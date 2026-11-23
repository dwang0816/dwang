import { CH, CW, G, Grid, TAU, ramp, rng } from './ascii';

/**
 * One jellyfish, ported from jellyfish.py: a bell that contracts on each beat,
 * four frilly oral arms, tentacles that lag behind the pulse, and sparks shed
 * from the bell. Everything is built as 3D points, turned, tilted, projected
 * and plotted into the letter grid.
 *
 * Point counts follow the jellyfish's size on screen, so a baby a few letters
 * wide costs a few hundred points while the big one costs tens of thousands.
 *
 * Two additions over the reel's script: a lean (a slow roll in the screen
 * plane), and a hue that steps on every contraction. And a spawn: while
 * `spawn` runs from 0 to 1, every point starts out as a white mote in a
 * swirling cloud around a blue core and spirals in to where it belongs.
 */

const D = 6; // camera distance for the perspective divide
const TILT_C = Math.cos(0.2);
const TILT_S = Math.sin(0.2);
const LIGHT = (() => {
  const v = [-0.45, 0.75, -0.5];
  const n = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / n, v[1] / n, v[2] / n] as const;
})();

/** 0 -> 1 fast contraction, then a slow relax; smooth and periodic. */
export function pulse(t: number, period: number): number {
  const ph = (((t / period) % 1) + 1) % 1;
  return ph < 0.3
    ? 0.5 - 0.5 * Math.cos((Math.PI * ph) / 0.3)
    : 0.5 + 0.5 * Math.cos((Math.PI * (ph - 0.3)) / 0.7);
}

interface Cam {
  cx: number;
  cy: number;
  scale: number;
  cr: number; // turn
  sr: number;
  cl: number; // lean
  sl: number;
}

const out = new Float64Array(3);
function project(cam: Cam, x: number, y: number, z: number) {
  const x1 = cam.cr * x + cam.sr * z;
  const z1 = -cam.sr * x + cam.cr * z;
  const y2 = TILT_C * y + TILT_S * z1;
  const z2 = -TILT_S * y + TILT_C * z1;
  const x3 = cam.cl * x1 - cam.sl * y2;
  const y3 = cam.sl * x1 + cam.cl * y2;
  const k = D / (D + z2);
  out[0] = cam.cx + x3 * cam.scale * k;
  out[1] = cam.cy - y3 * cam.scale * k;
  out[2] = z2;
}

/** cos/sin tables around the bell, cached per resolution. */
const rings = new Map<number, { c: Float64Array; s: Float64Array; tex: Float64Array }>();
function ring(n: number) {
  let r = rings.get(n);
  if (!r) {
    r = { c: new Float64Array(n), s: new Float64Array(n), tex: new Float64Array(n) };
    for (let k = 0; k < n; k++) {
      const ph = (TAU * k) / n;
      r.c[k] = Math.cos(ph);
      r.s[k] = Math.sin(ph);
      r.tex[k] = 0.8 + 0.2 * Math.cos(16 * ph);
    }
    rings.set(n, r);
  }
  return r;
}

const clampN = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
/** Stable pseudo-random 0..1 per point index. */
const hash = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export interface JellyOpts {
  cx: number;
  cy: number;
  scale: number; // px per body unit; the bell is about 2 units wide
  hue: number;
  dim: number;
  back: number; // depth offset, so far jellies sit behind near ones
  period: number; // seconds per pulse
  rot: number; // turn about the vertical axis
  lean: number; // roll in the screen plane, radians
  hueStep: number; // hue change per contraction
  nTent: number;
  sparks: boolean;
  /** 0..1 while spawning; 1 (or omitted) once formed. */
  spawn?: number;
}

// Sparks: fixed seeds, 4 s lifetimes.
const SPARKS = (() => {
  const r = rng(7);
  return Array.from({ length: 70 }, () => ({ su: 0.3 + r() * 0.7, sp: r() * TAU, off: r() * 4, sh: r() * 0.15 }));
})();

let sx = new Float64Array(0);
let sy = new Float64Array(0);
let sz = new Float64Array(0);

export function jelly(grid: Grid, t: number, o: JellyOpts) {
  const { dim, back, period, scale } = o;
  const w = (TAU * t) / period;
  const p = pulse(t, period);
  const cam: Cam = {
    cx: o.cx, cy: o.cy, scale,
    cr: Math.cos(o.rot), sr: Math.sin(o.rot),
    cl: Math.cos(o.lean), sl: Math.sin(o.lean),
  };

  // Colour steps on each beat, blending across the contraction.
  const beats = t / period;
  const nBeat = Math.floor(beats);
  const inBeat = beats - nBeat;
  const hue = o.hue + o.hueStep * (nBeat + (inBeat < 0.3 ? smooth(inBeat / 0.3) : 1));

  // Every plotted point goes through emit(); while spawning it is pulled
  // in from a swirling cloud instead of drawn where it belongs.
  const spawn = o.spawn ?? 1;
  let emit = (z: number, g: number, h: number, s: number, v: number) => grid.plot(out[0], out[1], z, g, h, s, v);
  if (spawn < 1) {
    const ccx = o.cx;
    const ccy = o.cy + scale * 0.7; // middle of the body, bell to tentacles
    let n = 0;
    emit = (z, g, h, s, v) => {
      const i = n++;
      const r1 = hash(i);
      const delay = r1 * 0.55;
      if (spawn < delay * 0.45) return; // not in the cloud yet
      const k = clamp01((spawn - delay) / 0.45);
      const e = 1 - (1 - k) ** 3;
      const r2 = hash(i + 7919.3);
      const th = r2 * TAU + spawn * 2.2;
      const rho = scale * (0.5 + 1.9 * Math.sqrt(hash(i + 104.7)));
      const x0 = ccx + rho * Math.cos(th);
      const y0 = ccy + rho * 0.8 * Math.sin(th);
      let x = x0 + (out[0] - x0) * e - ccx;
      let y = y0 + (out[1] - y0) * e - ccy;
      const sw = (1 - e) * 1.8; // spiral in
      const cs = Math.cos(sw);
      const sn = Math.sin(sw);
      [x, y] = [x * cs - y * sn, x * sn + y * cs];
      if (k < 1) {
        // Only a few points show while travelling, so the cloud stays a
        // sparse swirl of motes rather than a solid disc.
        const r3 = hash(i + 31.7);
        if (r3 > 0.06 + 0.1 * k) return;
        const mote = r3 < 0.025 ? G.star : r3 < 0.06 ? G.plus : G.dot;
        grid.plot(ccx + x, ccy + y, z, mote, 0.6, 0.2, 0.45 + 0.5 * k);
      } else {
        grid.plot(ccx + x, ccy + y, z, g, h, s, v);
      }
    };

    // The blue core the cloud gathers around: grows, flares, then fades.
    const flare = Math.sin(Math.PI * Math.min(1, spawn * 1.15));
    const R = scale * 0.38 * Math.min(1, spawn * 2.2);
    for (let ri = 0; ri < 8; ri++) {
      const rr = (ri / 8) * R;
      const nAround = Math.max(1, Math.round((TAU * rr) / CW));
      for (let a = 0; a < nAround; a++) {
        const ang = (a / nAround) * TAU + spawn * 3;
        const f = 1 - ri / 8;
        grid.plot(ccx + rr * Math.cos(ang), ccy - scale * 0.5 + rr * 0.75 * Math.sin(ang), -50,
          ramp(f * flare), 0.62 - 0.05 * f, 0.75 - 0.4 * f, flare * (0.35 + 0.65 * f));
      }
    }
  }
  const a = 1 - 0.18 * p;
  const b = 0.92 * (1 + 0.14 * p);
  const cw = Math.cos(w);
  const sw = Math.sin(w);

  // -- bell: a squashed dome that contracts on each beat
  const nu = clampN((scale / CH) * 3.5, 5, 70);
  const nph = clampN(((TAU * scale) / CW) * 1.4, 14, 260);
  const R = ring(nph);
  for (let iu = 0; iu < nu; iu++) {
    const u = 0.02 + (0.98 * iu) / (nu - 1);
    const su = Math.sin((u * Math.PI) / 2);
    const cu = Math.cos((u * Math.PI) / 2);
    const r = a * su + 0.1 * u ** 8 * (1 - p) - 0.06 * p * u ** 6;
    const texU = 0.88 + 0.12 * Math.sin(12 * u - w);
    const edge = u > 0.94 ? 0.3 : 0;
    const py = b * cu;
    const ny0 = py / (b * b);
    for (let k = 0; k < nph; k++) {
      const cp = R.c[k];
      const sp = R.s[k];
      const px = r * cp;
      const pz = r * sp;
      let nx = px / (a * a);
      let ny = ny0;
      let nz = pz / (a * a);
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= nl;
      ny /= nl;
      nz /= nl;
      const nx1 = cam.cr * nx + cam.sr * nz;
      const nz1 = -cam.sr * nx + cam.cr * nz;
      const ny2 = TILT_C * ny + TILT_S * nz1;
      const nz2 = -TILT_S * ny + TILT_C * nz1;
      const diff = Math.max(0, nx1 * LIGHT[0] + ny2 * LIGHT[1] + nz2 * LIGHT[2]);
      const rim = (1 - Math.abs(nz2)) ** 2;
      const lum = Math.min(1, Math.max(0, (0.3 + 0.55 * diff + 0.8 * rim) * R.tex[k] * texU + edge));
      project(cam, px, py, pz);
      // cos(ph + w) by the angle-sum rule, to skip a trig call
      emit(out[2] + back, ramp(lum),
        hue + 0.22 * py + 0.08 * (cp * cw - sp * sw), 0.8 - 0.35 * rim, (0.3 + 0.7 * lum) * dim);
    }
  }

  // -- oral arms: four frilly ribbons twisting under the bell
  const ns = clampN((scale / CH) * 4, 4, 160);
  const nv = scale < 90 ? 3 : 7;
  for (let arm = 0; arm < 4; arm++) {
    for (let i = 0; i < ns; i++) {
      const s = i / (ns - 1);
      const lag = pulse(t - s * 0.5, period);
      const ang = (arm * TAU) / 4 + 1.6 * s + 0.5 * Math.sin(3 * s - w);
      const rho = 0.08 + 0.22 * s * (1 + 0.3 * Math.sin(5 * s - w + arm));
      const y = -0.05 - s * 1.3 * (1 + 0.1 * lag);
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      for (let j = 0; j < nv; j++) {
        const v = -1 + (2 * j) / (nv - 1);
        const frill = v * 0.09 * (0.5 + s) * (1 + 0.5 * Math.sin(20 * s - 2 * w + v));
        const lum = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(25 * s + 3 * v - 2 * w));
        project(cam, rho * ca - frill * sa, y, rho * sa + frill * ca);
        emit(out[2] + back, ramp(lum),
          hue + 0.07 + 0.1 * s, 0.7, lum * (1 - 0.45 * s) * 0.95 * dim);
      }
    }
  }

  // -- tentacles: hang from the rim, lag behind the pulse, sway
  const nt = clampN((scale / CH) * 8, 6, 260);
  if (sx.length < nt) {
    sx = new Float64Array(nt);
    sy = new Float64Array(nt);
    sz = new Float64Array(nt);
  }
  for (let k = 0; k < o.nTent; k++) {
    const phi = (k * TAU) / o.nTent;
    const cphi = Math.cos(phi);
    const sphi = Math.sin(phi);
    const len = 2.4 * (0.85 + 0.15 * Math.sin(2.3 * k));
    for (let i = 0; i < nt; i++) {
      const s = i / (nt - 1);
      const lag = pulse(t - s * 0.9, period);
      const rr = (1 - 0.18 * lag + 0.08) * (1 - 0.45 * s);
      const sway = 0.3 * s ** 1.2;
      const x = rr * cphi + sway * Math.sin(w - 4 * s + 1.3 * k) + 0.04 * Math.sin(14 * s - 2 * w + k);
      const z = rr * sphi + sway * Math.cos(w - 3.3 * s + 1.7 * k);
      project(cam, x, -s * len * (1 + 0.12 * lag), z);
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
      if (s > 0.88) g = G.tick;
      else if (Math.abs(dc) < 0.4 * Math.abs(dr)) g = G.bar;
      else if (Math.abs(dr) < 0.4 * Math.abs(dc)) g = G.dash;
      else g = dc * dr > 0 ? G.back : G.fwd;
      const val = (0.95 - 0.6 * s) * (0.7 + 0.3 * Math.sin(30 * s - 3 * w)) * dim;
      out[0] = sx[i];
      out[1] = sy[i];
      emit(sz[i] + back, g, hue + 0.2 + 0.25 * s, 0.6, val);
    }
  }

  // -- sparks: particles shed from the bell
  if (o.sparks && spawn >= 1) {
    for (const sp of SPARKS) {
      const age = ((t + sp.off) % 4) / 4;
      const r0 = Math.sin((sp.su * Math.PI) / 2);
      const x0 = r0 * Math.cos(sp.sp);
      const y0 = 0.92 * Math.cos((sp.su * Math.PI) / 2);
      const z0 = r0 * Math.sin(sp.sp);
      const dl = Math.hypot(x0, y0 + 0.3, z0);
      const reach = (0.15 + 0.9 * age ** 0.7) * 0.8;
      const v = (1 - age) ** 1.5 * Math.sin((Math.PI / 2) * Math.min(age * 5, 1));
      const g = v > 0.7 ? G.star : v > 0.45 ? G.plus : v > 0.25 ? G.tick : G.dot;
      project(cam, x0 + (x0 / dl) * reach, y0 + ((y0 + 0.3) / dl) * reach - 0.4 * age, z0 + (z0 / dl) * reach);
      grid.plot(out[0], out[1], out[2] + back, g, hue + 0.5 + sp.sh, 0.35, v * dim);
    }
  }
}
