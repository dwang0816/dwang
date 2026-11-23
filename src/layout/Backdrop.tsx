import { useEffect, useRef } from 'react';
import './Backdrop.css';

/**
 * An ASCII jellyfish behind the page, ported from jellyfish.py.
 *
 * Each frame the scene is built as 3D points (bell, oral arms, tentacles,
 * sparks), projected, and dropped into a grid of letter cells where the nearest
 * point wins. The grid is then drawn as letters: glyphs are stamped from a
 * pre-rendered white atlas, coloured in one pass with a tiny per-cell colour
 * image, and given a soft glow from a blurred quarter-size copy.
 *
 * Compared with the reel: no HUD bar, no code strip, no sound, a calmer pulse,
 * and a palette that stays in the site's teal/blue/violet range instead of
 * cycling the whole rainbow. The big jellyfish sits in the right-hand margin
 * on wide screens; a few small, dim ones rise slowly through the background.
 * Runs at 30 fps, pauses when the tab is hidden; reduced motion gets one frame.
 */

const TAU = Math.PI * 2;
const BEAT = 3.2; // seconds per pulse of the big jellyfish
const TURN = 48; // seconds per full turn about the vertical axis
const FPS = 30;
const CW = 8; // one letter cell, CSS px
const CH = 14;
const D = 6; // camera distance for the perspective divide
const TILT_C = Math.cos(0.2);
const TILT_S = Math.sin(0.2);

const RAMP = ' .,:;-=+*#%@'; // dark -> bright
const GLYPHS = RAMP + "|/\\'`";
const G = (ch: string) => GLYPHS.indexOf(ch);
const G_BAR = G('|');
const G_DASH = G('-');
const G_BACK = G('\\');
const G_FWD = G('/');
const G_TICK = G("'");
const G_GRAVE = G('`');
const G_DOT = G('.');
const G_PLUS = G('+');
const G_STAR = G('*');

const LIGHT = (() => {
  const v = [-0.45, 0.75, -0.5];
  const n = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / n, v[1] / n, v[2] / n] as const;
})();

/** 0 -> 1 fast contraction, then a slow relax; smooth and periodic. */
function pulse(t: number, period: number): number {
  const ph = (((t / period) % 1) + 1) % 1;
  return ph < 0.3
    ? 0.5 - 0.5 * Math.cos((Math.PI * ph) / 0.3)
    : 0.5 + 0.5 * Math.cos((Math.PI * (ph - 0.3)) / 0.7);
}

const ramp = (lum: number) => Math.min(RAMP.length - 1, Math.max(1, Math.floor(lum * (RAMP.length - 1) + 0.5)));

/** Small seeded PRNG so the sparks and plankton are the same every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A z-buffered grid of letters: nearest point wins each cell. */
class Grid {
  cols: number;
  rows: number;
  z: Float32Array;
  g: Int8Array;
  /** RGBA per cell, written straight into the colour image. */
  rgba: Uint8ClampedArray;

  constructor(cols: number, rows: number, rgba: Uint8ClampedArray) {
    this.cols = cols;
    this.rows = rows;
    this.z = new Float32Array(cols * rows);
    this.g = new Int8Array(cols * rows);
    this.rgba = rgba;
  }

  reset() {
    this.z.fill(Infinity);
    this.g.fill(-1);
    this.rgba.fill(0);
  }

  plot(sx: number, sy: number, z: number, glyph: number, h: number, s: number, v: number) {
    const c = Math.floor(sx / CW);
    const r = Math.floor(sy / CH);
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return;
    const i = r * this.cols + c;
    if (z >= this.z[i]) return;
    this.z[i] = z;
    this.g[i] = glyph;
    // HSV -> RGB, written as bytes.
    const hh = (((h % 1) + 1) % 1) * 6;
    const k = Math.floor(hh) % 6;
    const f = hh - Math.floor(hh);
    const vv = Math.max(0, Math.min(1, v)) * 255;
    const p = vv * (1 - s);
    const q = vv * (1 - s * f);
    const u = vv * (1 - s * (1 - f));
    let R: number, Gc: number, B: number;
    switch (k) {
      case 0: R = vv; Gc = u; B = p; break;
      case 1: R = q; Gc = vv; B = p; break;
      case 2: R = p; Gc = vv; B = u; break;
      case 3: R = p; Gc = q; B = vv; break;
      case 4: R = u; Gc = p; B = vv; break;
      default: R = vv; Gc = p; B = q;
    }
    const o = i * 4;
    this.rgba[o] = R;
    this.rgba[o + 1] = Gc;
    this.rgba[o + 2] = B;
    this.rgba[o + 3] = 255;
  }
}

interface Cam {
  cx: number;
  cy: number;
  scale: number;
  cr: number; // cos/sin of the turn
  sr: number;
}

/** Turn, tilt and project one point; result lands in `out`. */
const out = new Float64Array(3);
function project(cam: Cam, x: number, y: number, z: number) {
  const x1 = cam.cr * x + cam.sr * z;
  const z1 = -cam.sr * x + cam.cr * z;
  const y2 = TILT_C * y + TILT_S * z1;
  const z2 = -TILT_S * y + TILT_C * z1;
  const k = D / (D + z2);
  out[0] = cam.cx + x1 * cam.scale * k;
  out[1] = cam.cy - y2 * cam.scale * k;
  out[2] = z2;
}

interface JellyOpts {
  cx: number;
  cy: number;
  scale: number;
  hue: number;
  dim: number;
  back: number;
  period: number;
  detail: number;
  nTent: number;
  sparks: boolean;
}

// Sparks: fixed seeds, 4 s lifetimes, shed from the bell.
const SPARKS = (() => {
  const r = rng(7);
  return Array.from({ length: 70 }, () => ({
    su: 0.3 + r() * 0.7,
    sp: r() * TAU,
    off: r() * 4,
    sh: r() * 0.15,
  }));
})();

function jelly(grid: Grid, t: number, o: JellyOpts, rot: number) {
  const { hue, dim, back, period, detail } = o;
  const w = (TAU * t) / period;
  const p = pulse(t, period);
  const cam: Cam = { cx: o.cx, cy: o.cy, scale: o.scale, cr: Math.cos(rot), sr: Math.sin(rot) };
  const a = 1 - 0.18 * p;
  const b = 0.92 * (1 + 0.14 * p);

  // -- bell: a squashed dome that contracts on each beat
  const nu = Math.max(10, Math.round(70 * detail));
  const nph = Math.max(32, Math.round(260 * detail));
  for (let iu = 0; iu < nu; iu++) {
    const u = 0.02 + (0.98 * iu) / (nu - 1);
    const su = Math.sin((u * Math.PI) / 2);
    const cu = Math.cos((u * Math.PI) / 2);
    const r = a * su + 0.1 * u ** 8 * (1 - p) - 0.06 * p * u ** 6;
    const texU = 0.88 + 0.12 * Math.sin(12 * u - w);
    const edge = u > 0.94 ? 0.3 : 0;
    const py = b * cu;
    for (let k = 0; k < nph; k++) {
      const ph = (TAU * k) / nph;
      const cp = Math.cos(ph);
      const sp = Math.sin(ph);
      const px = r * cp;
      const pz = r * sp;
      // ellipsoid normal, turned and tilted like the point
      let nx = px / (a * a);
      let ny = py / (b * b);
      let nz = pz / (a * a);
      const nl = Math.hypot(nx, ny, nz) || 1;
      nx /= nl;
      ny /= nl;
      nz /= nl;
      const nx1 = cam.cr * nx + cam.sr * nz;
      const nz1 = -cam.sr * nx + cam.cr * nz;
      const ny2 = TILT_C * ny + TILT_S * nz1;
      const nz2 = -TILT_S * ny + TILT_C * nz1;
      const diff = Math.max(0, nx1 * LIGHT[0] + ny2 * LIGHT[1] + nz2 * LIGHT[2]);
      const rim = (1 - Math.abs(nz2)) ** 2;
      const tex = (0.8 + 0.2 * Math.cos(16 * ph)) * texU;
      const lum = Math.min(1, Math.max(0, (0.3 + 0.55 * diff + 0.8 * rim) * tex + edge));
      project(cam, px, py, pz);
      grid.plot(out[0], out[1], out[2] + back, ramp(lum),
        hue + 0.22 * py + 0.08 * Math.cos(ph + w), 0.8 - 0.35 * rim, (0.3 + 0.7 * lum) * dim);
    }
  }

  // -- oral arms: four frilly ribbons twisting under the bell
  const ns = Math.max(16, Math.round(160 * detail));
  for (let arm = 0; arm < 4; arm++) {
    for (let i = 0; i < ns; i++) {
      const s = i / (ns - 1);
      const lag = pulse(t - s * 0.5, period);
      const ang = (arm * TAU) / 4 + 1.6 * s + 0.5 * Math.sin(3 * s - w);
      const rho = 0.08 + 0.22 * s * (1 + 0.3 * Math.sin(5 * s - w + arm));
      const y = -0.05 - s * 1.3 * (1 + 0.1 * lag);
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      for (let j = 0; j < 7; j++) {
        const v = -1 + j / 3;
        const frill = v * 0.09 * (0.5 + s) * (1 + 0.5 * Math.sin(20 * s - 2 * w + v));
        const x = rho * ca - frill * sa;
        const z = rho * sa + frill * ca;
        const lum = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(25 * s + 3 * v - 2 * w));
        project(cam, x, y, z);
        grid.plot(out[0], out[1], out[2] + back, ramp(lum),
          hue + 0.07 + 0.1 * s, 0.7, lum * (1 - 0.45 * s) * 0.95 * dim);
      }
    }
  }

  // -- tentacles: hang from the rim, lag behind the pulse, sway
  const nt = Math.max(24, Math.round(260 * detail));
  const sx = new Float64Array(nt);
  const sy = new Float64Array(nt);
  const sz = new Float64Array(nt);
  for (let k = 0; k < o.nTent; k++) {
    const phi = (k * TAU) / o.nTent;
    const len = 2.4 * (0.85 + 0.15 * Math.sin(2.3 * k));
    for (let i = 0; i < nt; i++) {
      const s = i / (nt - 1);
      const lag = pulse(t - s * 0.9, period);
      const rr = (1 - 0.18 * lag + 0.08) * (1 - 0.45 * s);
      const sway = 0.3 * s ** 1.2;
      const x = rr * Math.cos(phi) + sway * Math.sin(w - 4 * s + 1.3 * k) + 0.04 * Math.sin(14 * s - 2 * w + k);
      const z = rr * Math.sin(phi) + sway * Math.cos(w - 3.3 * s + 1.7 * k);
      const y = -s * len * (1 + 0.12 * lag);
      project(cam, x, y, z);
      sx[i] = out[0];
      sy[i] = out[1];
      sz[i] = out[2];
    }
    for (let i = 0; i < nt; i++) {
      const s = i / (nt - 1);
      // the stroke's screen direction picks the letter
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(nt - 1, i + 1);
      const dc = (sx[i1] - sx[i0]) / CW;
      const dr = (sy[i1] - sy[i0]) / CH;
      let g: number;
      if (s > 0.88) g = G_TICK;
      else if (Math.abs(dc) < 0.4 * Math.abs(dr)) g = G_BAR;
      else if (Math.abs(dr) < 0.4 * Math.abs(dc)) g = G_DASH;
      else g = dc * dr > 0 ? G_BACK : G_FWD;
      const val = (0.95 - 0.6 * s) * (0.7 + 0.3 * Math.sin(30 * s - 3 * w)) * dim;
      grid.plot(sx[i], sy[i], sz[i] + back, g, hue + 0.2 + 0.25 * s, 0.6, val);
    }
  }

  // -- sparks: particles shed from the bell
  if (o.sparks) {
    for (const sp of SPARKS) {
      const age = ((t + sp.off) % 4) / 4;
      const r0 = Math.sin((sp.su * Math.PI) / 2);
      const x0 = r0 * Math.cos(sp.sp);
      const y0 = 0.92 * Math.cos((sp.su * Math.PI) / 2);
      const z0 = r0 * Math.sin(sp.sp);
      const dl = Math.hypot(x0, y0 + 0.3, z0);
      const reach = (0.15 + 0.9 * age ** 0.7) * 0.8;
      const v = (1 - age) ** 1.5 * Math.sin((Math.PI / 2) * Math.min(age * 5, 1));
      const g = v > 0.7 ? G_STAR : v > 0.45 ? G_PLUS : v > 0.25 ? G_TICK : G_DOT;
      project(cam, x0 + (x0 / dl) * reach, y0 + ((y0 + 0.3) / dl) * reach - 0.4 * age, z0 + (z0 / dl) * reach);
      grid.plot(out[0], out[1], out[2] + back, g, hue + 0.5 + sp.sh, 0.35, v * dim);
    }
  }
}

interface Mote {
  x: number; // 0..1
  y: number; // 0..1
  speed: number; // px/s upward
  ph: number;
  v: number;
}

function makePlankton(w: number, h: number): Mote[] {
  const r = rng(3);
  const n = Math.round(Math.min(260, (w * h) / 9000));
  return Array.from({ length: n }, () => ({
    x: r(),
    y: r(),
    speed: 8 + r() * 14,
    ph: r() * TAU,
    v: 0.1 + r() * 0.18,
  }));
}

/** Small jellies: x, starting y (fraction of height), size vs the big one, pulse, rise time (s), hue offset. */
const SMALL: readonly [number, number, number, number, number, number][] = [
  [0.07, 0.3, 0.32, 4.0, 150, 0.1],
  [0.33, 0.85, 0.26, 5.0, 190, -0.06],
  [0.56, 0.15, 0.22, 4.4, 170, 0.16],
  [0.74, 0.65, 0.2, 3.6, 210, 0.04],
];

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const atlas = document.createElement('canvas');
    const tint = document.createElement('canvas'); // one pixel per cell
    const glow = document.createElement('canvas'); // quarter size, blurred
    const tintCtx = tint.getContext('2d')!;
    const glowCtx = glow.getContext('2d')!;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let grid: Grid | null = null;
    let image: ImageData | null = null;
    let plankton: Mote[] = [];
    let raf = 0;
    let lastDraw = 0;
    const t0 = performance.now();

    const buildAtlas = () => {
      atlas.width = GLYPHS.length * CW * dpr;
      atlas.height = CH * dpr;
      const a = atlas.getContext('2d')!;
      a.clearRect(0, 0, atlas.width, atlas.height);
      a.setTransform(dpr, 0, 0, dpr, 0, 0);
      a.fillStyle = '#fff';
      a.font = '500 13px "IBM Plex Mono", ui-monospace, Consolas, monospace';
      a.textAlign = 'center';
      a.textBaseline = 'middle';
      for (let i = 0; i < GLYPHS.length; i++) a.fillText(GLYPHS[i], i * CW + CW / 2, CH / 2 + 1);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      const cols = Math.ceil(w / CW);
      const rows = Math.ceil(h / CH);
      tint.width = cols;
      tint.height = rows;
      image = tintCtx.createImageData(cols, rows);
      grid = new Grid(cols, rows, image.data);
      glow.width = Math.ceil(w / 4);
      glow.height = Math.ceil(h / 4);
      plankton = makePlankton(w, h);
      buildAtlas();
    };

    const scene = (t: number) => {
      if (!grid) return;
      grid.reset();
      const hue = 0.56 + 0.07 * Math.sin((TAU * t) / 90); // drifts slowly, stays cool

      for (const m of plankton) {
        const x = m.x * w + 12 * Math.sin((TAU * t) / 10 + m.ph);
        const y = (((m.y * h - t * m.speed) % h) + h) % h;
        grid.plot(x, y, 500, m.v > 0.22 ? G_GRAVE : G_DOT, 0.52, 0.5, m.v);
      }

      const narrow = w < 760;
      const scale = Math.min(h * 0.19, w * (narrow ? 0.3 : 0.2));
      const rot = (TAU * t) / TURN;

      SMALL.forEach(([fx, fy, size, period, rise, dh], i) => {
        // Rise from below the fold to above the top, then start again.
        const span = 1.4;
        const y = ((((fy - t / rise) % span) + span) % span) - 0.25;
        jelly(grid!, t + i * 0.9, {
          cx: fx * w + 18 * Math.sin((TAU * t) / 40 + i * 1.7),
          cy: y * h,
          scale: scale * size,
          hue: hue + dh,
          dim: 0.45,
          back: 50,
          period,
          detail: Math.max(0.2, (scale * size) / 200),
          nTent: 7,
          sparks: false,
        }, rot * 1.3 + i);
      });

      // The big one: in the right margin when the whole bell fits there,
      // otherwise toward the right, showing through the panels.
      const gutter = (w - 1180) / 2;
      const cx = narrow ? w * 0.5 : gutter > scale * 2.3 ? w - gutter / 2 : Math.min(w * 0.76, w - scale * 1.4);
      const cy = Math.max(h * 0.1, 30) + scale * 1.1 - h * 0.035 * pulse(t - 0.4, BEAT) + 10 * Math.sin((TAU * t) / 23);
      jelly(grid, t, {
        cx: cx + 14 * Math.sin((TAU * t) / 31),
        cy,
        scale,
        hue,
        dim: 0.85,
        back: 0,
        period: BEAT,
        detail: Math.min(1, Math.max(0.45, scale / 200)),
        nTent: 12,
        sparks: true,
      }, rot);
    };

    const draw = (t: number) => {
      if (!grid || !image) return;
      scene(t);

      // 1. Stamp white glyphs from the atlas.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      const aw = CW * dpr;
      const ah = CH * dpr;
      const { cols, rows, g } = grid;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gi = g[r * cols + c];
          if (gi > 0) ctx.drawImage(atlas, gi * aw, 0, aw, ah, c * CW, r * CH, CW, CH);
        }
      }

      // 2. Colour them: one pixel per cell, scaled up without smoothing.
      tintCtx.putImageData(image, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tint, 0, 0, cols * CW, rows * CH);
      ctx.imageSmoothingEnabled = true;

      // 3. Glow: a blurred quarter-size copy added back on top.
      glowCtx.clearRect(0, 0, glow.width, glow.height);
      glowCtx.filter = 'blur(2px)';
      glowCtx.drawImage(canvas, 0, 0, glow.width, glow.height);
      glowCtx.filter = 'none';
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.9;
      ctx.drawImage(glow, 0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - lastDraw < 1000 / FPS - 2) return;
      lastDraw = now;
      draw((now - t0) / 1000);
    };

    const start = () => {
      if (still || raf) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      if (still) draw(1.1);
    };

    resize();
    if (still) draw(1.1);
    else start();
    // The atlas was drawn with whatever font was ready; redraw once Plex arrives.
    document.fonts?.ready.then(() => {
      buildAtlas();
      if (still) draw(1.1);
    });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />;
}
