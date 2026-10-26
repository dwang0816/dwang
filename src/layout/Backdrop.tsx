import { useEffect, useRef } from 'react';
import { CONSTELLATIONS, type Constellation } from './constellations';
import './Backdrop.css';

/**
 * A night sky behind the page.
 *
 * Three depths of stars, each pre-rendered once to its own offscreen canvas and
 * slid across the viewport at its own speed, so a thousand stars cost two
 * drawImage calls a frame. The brightest hundred or so are drawn live so they
 * can twinkle; the very brightest carry diffraction spikes. A faint band of dust
 * sits behind everything. Real constellations are placed in the mid layer with
 * their stick figures and names, and wake up when the pointer comes near.
 * Every six to twelve seconds a meteor crosses.
 *
 * The pointer also parallaxes the layers a few pixels, which is what makes the
 * depth read. Touch leaves the sky still; reduced motion gets one frame.
 */

type RGB = readonly [number, number, number];

/** Star colour by temperature, weighted toward white and blue-white. */
const TEMPS: readonly { c: RGB; w: number }[] = [
  { c: [255, 255, 255], w: 5 },
  { c: [205, 220, 255], w: 4 },
  { c: [170, 195, 255], w: 1 },
  { c: [255, 244, 220], w: 3 },
  { c: [255, 214, 170], w: 1.5 },
  { c: [255, 180, 130], w: 0.6 },
];
const TEMP_TOTAL = TEMPS.reduce((n, t) => n + t.w, 0);

function tempColor(): RGB {
  let r = Math.random() * TEMP_TOTAL;
  for (const t of TEMPS) {
    r -= t.w;
    if (r <= 0) return t.c;
  }
  return TEMPS[0].c;
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

interface Star {
  x: number;
  y: number;
  r: number;
  c: RGB;
  a: number;
  /** twinkle phase and speed; only used for live-drawn stars */
  ph: number;
  sp: number;
  spikes: boolean;
}

interface Layer {
  depth: number; // parallax factor and drift multiplier
  canvas: HTMLCanvasElement;
  live: Star[]; // bright stars drawn every frame
  drift: number; // current x offset
}

interface Placed extends Constellation {
  /** Star positions in sky pixels (mid layer space). */
  pts: { x: number; y: number; r: number }[];
  /** 0..1, how awake it is. */
  lit: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1
  len: number;
}

const DRIFT = 0.018; // px/frame at depth 1
const REACH = 160; // px: how near the pointer must come to wake a constellation

function makeLayer(w: number, h: number, depth: number, perPx: number, liveShare: number): Layer {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.floor((w * h) / perPx);
  const live: Star[] = [];
  for (let i = 0; i < count; i++) {
    // Magnitude distribution: most stars are faint, a few are bright.
    const m = Math.pow(Math.random(), 2.6);
    const star: Star = {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.35 + m * 1.9 * depth,
      c: tempColor(),
      a: 0.35 + m * 0.65,
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 1.4,
      spikes: m > 0.93 && depth >= 0.6,
    };
    if (m > 1 - liveShare) {
      live.push(star);
      continue;
    }
    ctx.fillStyle = rgba(star.c, star.a);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    if (star.r > 1.1) {
      // soft halo for the mid-bright ones
      ctx.fillStyle = rgba(star.c, star.a * 0.12);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return { depth, canvas, live, drift: 0 };
}

/**
 * The dust band: many soft blobs along a diagonal. Rendered once at device
 * resolution; a scaled-up low-res version shows the browser's gradient dither
 * as a checker pattern, so no shortcuts here.
 */
function makeDust(w: number, h: number): HTMLCanvasElement {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(w * dpr));
  canvas.height = Math.max(1, Math.floor(h * dpr));
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cw = w;
  const ch = h;
  const tints: RGB[] = [
    [120, 150, 220],
    [46, 211, 195],
    [180, 140, 242],
    [233, 196, 92],
    [200, 210, 255],
  ];
  // Band runs from upper-left to lower-right, slightly curved.
  for (let i = 0; i < 220; i++) {
    const t = Math.random();
    const bx = cw * (t * 1.3 - 0.15);
    const by = ch * (0.15 + t * 0.7 + Math.sin(t * Math.PI) * 0.12);
    const spread = (0.09 + Math.random() * 0.1) * ch;
    const x = bx + (Math.random() - 0.5) * spread * 2.2;
    const y = by + (Math.random() - 0.5) * spread;
    const r = (0.06 + Math.random() * 0.16) * ch;
    const c = tints[Math.floor(Math.random() * tints.length)];
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(c, 0.05 + Math.random() * 0.05));
    g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  return canvas;
}

function placeConstellations(w: number, h: number): Placed[] {
  // Each constellation gets a box in a loose grid so they never overlap.
  const cols = w > 900 ? 3 : 2;
  const rows = 3;
  const cellW = w / cols;
  const cellH = h / rows;
  const cells: number[] = [];
  for (let i = 0; i < cols * rows; i++) cells.push(i);
  // shuffle
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const out: Placed[] = [];
  CONSTELLATIONS.slice(0, cells.length).forEach((con, i) => {
    const cell = cells[i];
    const cx = (cell % cols) * cellW;
    const cy = Math.floor(cell / cols) * cellH;
    const size = Math.min(cellW, cellH) * (0.42 + Math.random() * 0.14);
    const ox = cx + (cellW - size * con.w) * (0.2 + Math.random() * 0.6);
    const oy = cy + (cellH - size * con.h) * (0.2 + Math.random() * 0.6);
    out.push({
      ...con,
      lit: 0,
      pts: con.stars.map(([sx, sy, mag]) => ({
        x: ox + sx * size,
        y: oy + sy * size,
        r: 1.2 + (3 - mag) * 0.55,
      })),
    });
  });
  return out;
}

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let layers: Layer[] = [];
    let dust: HTMLCanvasElement | null = null;
    let cons: Placed[] = [];
    let meteors: Meteor[] = [];
    let nextMeteor = 4000;
    let raf = 0;
    let last = performance.now();
    let t = 0; // seconds
    let px: number | null = null;
    let py: number | null = null;
    let parX = 0; // eased parallax, -1..1
    let parY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layers = [
        makeLayer(w, h, 0.35, 1500, 0.02), // far: many, tiny, almost still
        makeLayer(w, h, 0.65, 3800, 0.08), // mid
        makeLayer(w, h, 1.0, 11000, 0.22), // near: few, brighter, most twinkle
      ];
      dust = makeDust(w, h);
      cons = placeConstellations(w, h);
      meteors = [];
    };

    const drawLayerImage = (img: HTMLCanvasElement, ox: number, oy: number) => {
      // Wrap horizontally: the layer is drawn twice when the drift reveals an edge.
      const x = ((ox % w) + w) % w;
      ctx.drawImage(img, x - w, oy, w, h);
      ctx.drawImage(img, x, oy, w, h);
    };

    const spikes = (x: number, y: number, c: RGB, a: number, len: number) => {
      const g1 = ctx.createLinearGradient(x - len, y, x + len, y);
      g1.addColorStop(0, rgba(c, 0));
      g1.addColorStop(0.5, rgba(c, a));
      g1.addColorStop(1, rgba(c, 0));
      ctx.strokeStyle = g1;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - len, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
      const g2 = ctx.createLinearGradient(x, y - len, x, y + len);
      g2.addColorStop(0, rgba(c, 0));
      g2.addColorStop(0.5, rgba(c, a));
      g2.addColorStop(1, rgba(c, 0));
      ctx.strokeStyle = g2;
      ctx.beginPath();
      ctx.moveTo(x, y - len);
      ctx.lineTo(x, y + len);
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Dust band, far back, with the far layer's parallax.
      if (dust) {
        ctx.globalAlpha = 0.65;
        drawLayerImage(dust, layers[0].drift + parX * 4, parY * 3);
        ctx.globalAlpha = 1;
      }

      for (const L of layers) {
        const ox = L.drift + parX * 10 * L.depth;
        const oy = parY * 7 * L.depth;
        drawLayerImage(L.canvas, ox, oy);

        // Live stars: twinkle, and spikes on the brightest.
        const wrap = ((ox % w) + w) % w;
        for (const s of L.live) {
          const tw = 0.72 + 0.28 * Math.sin(t * s.sp * 2.2 + s.ph);
          const a = s.a * tw;
          let x = s.x + wrap;
          if (x > w) x -= w;
          const y = s.y + oy;
          ctx.fillStyle = rgba(s.c, a * 0.14);
          ctx.beginPath();
          ctx.arc(x, y, s.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = rgba(s.c, a);
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
          if (s.spikes) spikes(x, y, s.c, a * 0.55, s.r * 9 * tw);
        }
      }

      // Constellations ride the mid layer.
      const mid = layers[1];
      const cox = ((mid.drift + parX * 10 * mid.depth) % w) + (mid.drift < 0 ? w : 0);
      const coy = parY * 7 * mid.depth;
      for (const con of cons) {
        const shift = (x: number) => {
          let v = x + (cox % w);
          if (v > w) v -= w;
          return v;
        };
        const lineA = 0.1 + con.lit * 0.5;
        ctx.strokeStyle = `rgba(190, 215, 255, ${lineA})`;
        ctx.lineWidth = 0.8;
        for (const [i, j] of con.lines) {
          const a = con.pts[i];
          const b = con.pts[j];
          ctx.beginPath();
          ctx.moveTo(shift(a.x), a.y + coy);
          ctx.lineTo(shift(b.x), b.y + coy);
          ctx.stroke();
        }
        for (const p of con.pts) {
          const x = shift(p.x);
          const y = p.y + coy;
          const a = 0.75 + con.lit * 0.25;
          ctx.fillStyle = `rgba(225, 235, 255, ${a * 0.16})`;
          ctx.beginPath();
          ctx.arc(x, y, p.r * 3.2 + con.lit * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(240, 245, 255, ${a})`;
          ctx.beginPath();
          ctx.arc(x, y, p.r + con.lit * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        if (con.lit > 0.02) {
          const lx = shift(con.pts[con.label[0]].x) + con.label[1];
          const ly = con.pts[con.label[0]].y + coy + con.label[2];
          ctx.font = '500 10px "IBM Plex Mono", ui-monospace, monospace';
          ctx.fillStyle = `rgba(200, 220, 255, ${con.lit * 0.85})`;
          ctx.letterSpacing = '2px';
          ctx.fillText(con.name.toUpperCase(), lx, ly);
          ctx.letterSpacing = '0px';
        }
      }

      // Meteors.
      for (const m of meteors) {
        const fade = Math.sin(m.life * Math.PI);
        const tx = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.len * fade;
        const ty = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.len * fade;
        const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(1, `rgba(255,255,255,${0.9 * fade})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${fade})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (dt: number, ms: number) => {
      t += ms / 1000;
      for (const L of layers) L.drift -= DRIFT * L.depth * dt;

      // Ease parallax toward the pointer.
      const tx = px == null ? 0 : (px / w) * 2 - 1;
      const ty = py == null ? 0 : (py / h) * 2 - 1;
      parX += (tx - parX) * Math.min(1, 0.04 * dt);
      parY += (ty - parY) * Math.min(1, 0.04 * dt);

      // Wake constellations near the pointer.
      const mid = layers[1];
      const cox = mid.drift + parX * 10 * mid.depth;
      for (const con of cons) {
        let target = 0;
        if (px != null && py != null) {
          let best = Infinity;
          for (const p of con.pts) {
            let x = p.x + (((cox % w) + w) % w);
            if (x > w) x -= w;
            const d = Math.hypot(x - px, p.y - py);
            if (d < best) best = d;
          }
          if (best < REACH) target = 1 - best / REACH;
        }
        con.lit += (target - con.lit) * Math.min(1, 0.07 * dt);
      }

      // Meteors.
      nextMeteor -= ms;
      if (nextMeteor <= 0) {
        nextMeteor = 6000 + Math.random() * 6000;
        const fromLeft = Math.random() < 0.5;
        const speed = 9 + Math.random() * 6;
        const ang = (fromLeft ? 0.35 : Math.PI - 0.35) + (Math.random() - 0.5) * 0.4;
        meteors.push({
          x: fromLeft ? Math.random() * w * 0.4 : w * 0.6 + Math.random() * w * 0.4,
          y: Math.random() * h * 0.5,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 0,
          len: 90 + Math.random() * 110,
        });
      }
      for (const m of meteors) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life += 0.035 * dt;
      }
      meteors = meteors.filter((m) => m.life < 1);
    };

    const frame = (now: number) => {
      const ms = Math.min(50, now - last);
      const dt = ms / 16.667;
      last = now;
      step(dt, ms);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (still || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX;
      py = e.clientY;
    };
    const onLeave = () => {
      px = null;
      py = null;
    };

    resize();
    if (still) draw();
    else start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />;
}
