import { CH, CW, G, Grid, TAU, ramp, rng } from './ascii';

/**
 * Two kinds of jellyfish, built as 3D points that are turned, tilted, leaned,
 * projected and plotted into the letter grid.
 *
 * jelly(): the one from jellyfish.py. A tall bell that contracts on each beat,
 * four frilly oral arms, long tentacles that lag behind the pulse, and sparks
 * shed from the bell.
 *
 * moonJelly(): a moon jellyfish. A wide, shallow, glassy saucer seen a little
 * from above, so the four glowing rings inside it show, with faint radial
 * canals, a dense fringe of short tentacles round the rim, and four short
 * frilly arms.
 *
 * Shared by both:
 * - Point counts follow the size on screen, so a baby a few letters wide costs
 *   a few hundred points and a big one tens of thousands.
 * - Colour wave: every contraction moves the hue on by `hueStep`, and the new
 *   colour sweeps from the top of the bell down to the tentacle tips.
 * - Lean: a roll in the screen plane.
 * - Spawn: while `spawn` runs 0 -> 1, every point starts as a white mote in a
 *   swirling cloud around a blue core and spirals in to where it belongs.
 */

const D = 6; // camera distance for the perspective divide
const WAVE = 1.1; // seconds for a new colour to travel bell top -> tentacle tips
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
  ct: number; // tilt toward the viewer
  st: number;
  cl: number; // lean
  sl: number;
}

const out = new Float64Array(3);
function project(cam: Cam, x: number, y: number, z: number) {
  const x1 = cam.cr * x + cam.sr * z;
  const z1 = -cam.sr * x + cam.cr * z;
  const y2 = cam.ct * y + cam.st * z1;
  const z2 = -cam.st * y + cam.ct * z1;
  const x3 = cam.cl * x1 - cam.sl * y2;
  const y3 = cam.sl * x1 + cam.cl * y2;
  const k = D / (D + z2);
  out[0] = cam.cx + x3 * cam.scale * k;
  out[1] = cam.cy - y3 * cam.scale * k;
  out[2] = z2;
}

/** Light a unit normal after turning and tilting it like a point. */
function shade(cam: Cam, nx: number, ny: number, nz: number) {
  const nx1 = cam.cr * nx + cam.sr * nz;
  const nz1 = -cam.sr * nx + cam.cr * nz;
  const ny2 = cam.ct * ny + cam.st * nz1;
  const nz2 = -cam.st * ny + cam.ct * nz1;
  return {
    diff: Math.max(0, nx1 * LIGHT[0] + ny2 * LIGHT[1] + nz2 * LIGHT[2]),
    rim: (1 - Math.abs(nz2)) ** 2,
  };
}

/** cos/sin tables around a bell, cached per resolution. */
const rings = new Map<number, { c: Float64Array; s: Float64Array; c16: Float64Array }>();
function ring(n: number) {
  let r = rings.get(n);
  if (!r) {
    r = { c: new Float64Array(n), s: new Float64Array(n), c16: new Float64Array(n) };
    for (let k = 0; k < n; k++) {
      const ph = (TAU * k) / n;
      r.c[k] = Math.cos(ph);
      r.s[k] = Math.sin(ph);
      r.c16[k] = Math.cos(16 * ph);
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
  scale: number; // px per body unit; the classic bell is about 2 units wide
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

type Emit = (z: number, g: number, h: number, s: number, v: number) => void;

/**
 * Everything shared by both kinds: the camera, the colour wave, and emit(),
 * which every plotted point goes through so the spawn can intercept it.
 * (ccx, ccy) is the middle of the body, where the spawn cloud gathers.
 */
function body(grid: Grid, t: number, o: JellyOpts, tilt: number, ccx: number, ccy: number) {
  const cam: Cam = {
    cx: o.cx, cy: o.cy, scale: o.scale,
    cr: Math.cos(o.rot), sr: Math.sin(o.rot),
    ct: Math.cos(tilt), st: Math.sin(tilt),
    cl: Math.cos(o.lean), sl: Math.sin(o.lean),
  };

  /** Hue at a point `pos` of the way down the body (0 = top of the bell). */
  const hueAt = (pos: number) => {
    const beats = (t - pos * WAVE) / o.period;
    const n = Math.floor(beats);
    const f = beats - n;
    return o.hue + o.hueStep * (n + (f < 0.3 ? smooth(f / 0.3) : 1));
  };

  const spawn = o.spawn ?? 1;
  let emit: Emit = (z, g, h, s, v) => grid.plot(out[0], out[1], z, g, h, s, v);
  if (spawn < 1) {
    const scale = o.scale;
    let n = 0;
    emit = (z, g, h, s, v) => {
      const i = n++;
      const delay = hash(i) * 0.55;
      if (spawn < delay * 0.45) return; // not in the cloud yet
      const k = clamp01((spawn - delay) / 0.45);
      const e = 1 - (1 - k) ** 3;
      const r2 = hash(i + 7919.3);
      const th = r2 * TAU + spawn * 2.2;
      const rho = scale * (0.5 + 1.9 * Math.sqrt(hash(i + 104.7)));
      const x0 = ccx + rho * Math.cos(th);
      const y0 = ccy + rho * 0.8 * Math.sin(th);
      const x = x0 + (out[0] - x0) * e - ccx;
      const y = y0 + (out[1] - y0) * e - ccy;
      const sw = (1 - e) * 1.8; // spiral in
      const cs = Math.cos(sw);
      const sn = Math.sin(sw);
      const px = ccx + x * cs - y * sn;
      const py = ccy + x * sn + y * cs;
      if (k < 1) {
        // Only a few points show while travelling, so the cloud stays a
        // sparse swirl of motes rather than a solid disc.
        const r3 = hash(i + 31.7);
        if (r3 > 0.06 + 0.1 * k) return;
        grid.plot(px, py, z, r3 < 0.025 ? G.star : r3 < 0.06 ? G.plus : G.dot, 0.6, 0.2, 0.45 + 0.5 * k);
      } else {
        grid.plot(px, py, z, g, h, s, v);
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
        grid.plot(ccx + rr * Math.cos(ang), ccy - scale * 0.3 + rr * 0.75 * Math.sin(ang), -50,
          ramp(f * flare), 0.62 - 0.05 * f, 0.75 - 0.4 * f, flare * (0.35 + 0.65 * f));
      }
    }
  }
  return { cam, hueAt, emit, spawn };
}

/** Four frilly ribbons twisting under the bell; shared by both kinds. */
function oralArms(cam: Cam, emit: Emit, hueAt: (p: number) => number, t: number, o: JellyOpts,
  w: number, len: number, reach: number, pos0: number) {
  const ns = clampN((o.scale * len * 3) / CH, 4, 160);
  const nv = o.scale < 90 ? 3 : 7;
  for (let arm = 0; arm < 4; arm++) {
    for (let i = 0; i < ns; i++) {
      const s = i / (ns - 1);
      const lag = pulse(t - s * 0.5, o.period);
      const ang = (arm * TAU) / 4 + 1.6 * s + 0.5 * Math.sin(3 * s - w);
      const rho = 0.08 + reach * s * (1 + 0.3 * Math.sin(5 * s - w + arm));
      const y = -0.05 - s * len * (1 + 0.1 * lag);
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const h = hueAt(pos0 + (1 - pos0) * 0.6 * s) + 0.07;
      for (let j = 0; j < nv; j++) {
        const v = -1 + (2 * j) / (nv - 1);
        const frill = v * 0.09 * (0.5 + s) * (1 + 0.5 * Math.sin(20 * s - 2 * w + v));
        const lum = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(25 * s + 3 * v - 2 * w));
        project(cam, rho * ca - frill * sa, y, rho * sa + frill * ca);
        emit(out[2] + o.back, ramp(lum), h, 0.7, lum * (1 - 0.45 * s) * 0.95 * o.dim);
      }
    }
  }
}

/** The glyph that follows a stroke through screen points i-1 .. i+1. */
function strokeAt(xs: Float64Array, ys: Float64Array, i: number, n: number) {
  const i0 = Math.max(0, i - 1);
  const i1 = Math.min(n - 1, i + 1);
  const dc = (xs[i1] - xs[i0]) / CW;
  const dr = (ys[i1] - ys[i0]) / CH;
  if (Math.abs(dc) < 0.4 * Math.abs(dr)) return G.bar;
  if (Math.abs(dr) < 0.4 * Math.abs(dc)) return G.dash;
  return dc * dr > 0 ? G.back : G.fwd;
}

// Sparks: fixed seeds, 4 s lifetimes.
const SPARKS = (() => {
  const r = rng(7);
  return Array.from({ length: 70 }, () => ({ su: 0.3 + r() * 0.7, sp: r() * TAU, off: r() * 4, sh: r() * 0.15 }));
})();

let sx = new Float64Array(0);
let sy = new Float64Array(0);
let sz = new Float64Array(0);
function scratch(n: number) {
  if (sx.length < n) {
    sx = new Float64Array(n);
    sy = new Float64Array(n);
    sz = new Float64Array(n);
  }
}

export function jelly(grid: Grid, t: number, o: JellyOpts) {
  const { dim, back, period, scale } = o;
  const w = (TAU * t) / period;
  const p = pulse(t, period);
  const { cam, hueAt, emit, spawn } = body(grid, t, o, 0.2, o.cx, o.cy + scale * 0.7);
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
    const hue = hueAt(u * 0.3);
    for (let k = 0; k < nph; k++) {
      const cp = R.c[k];
      const sp = R.s[k];
      const px = r * cp;
      const pz = r * sp;
      const nx = px / (a * a);
      const nz = pz / (a * a);
      const nl = Math.sqrt(nx * nx + ny0 * ny0 + nz * nz) || 1;
      const { diff, rim } = shade(cam, nx / nl, ny0 / nl, nz / nl);
      const tex = 0.8 + 0.2 * R.c16[k];
      const lum = clamp01((0.3 + 0.55 * diff + 0.8 * rim) * tex * texU + edge);
      project(cam, px, py, pz);
      // cos(ph + w) by the angle-sum rule, to skip a trig call
      emit(out[2] + back, ramp(lum),
        hue + 0.22 * py + 0.08 * (cp * cw - sp * sw), 0.8 - 0.35 * rim, (0.3 + 0.7 * lum) * dim);
    }
  }

  oralArms(cam, emit, hueAt, t, o, w, 1.3, 0.22, 0.3);

  // -- tentacles: hang from the rim, lag behind the pulse, sway
  const nt = clampN((scale / CH) * 8, 6, 260);
  scratch(nt);
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
      const g = s > 0.88 ? G.tick : strokeAt(sx, sy, i, nt);
      const val = (0.95 - 0.6 * s) * (0.7 + 0.3 * Math.sin(30 * s - 3 * w)) * dim;
      out[0] = sx[i];
      out[1] = sy[i];
      emit(sz[i] + back, g, hueAt(0.3 + 0.7 * s) + 0.2 + 0.1 * s, 0.6, val);
    }
  }

  // -- sparks: particles shed from the bell
  if (o.sparks && spawn >= 1) {
    const hue = hueAt(0);
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

export function moonJelly(grid: Grid, t: number, o: JellyOpts) {
  const { dim, back, period, scale } = o;
  const w = (TAU * t) / period;
  const p = pulse(t, period);
  // Seen a little from above, so the rings inside the saucer show.
  const { cam, hueAt, emit } = body(grid, t, o, 0.72, o.cx, o.cy + scale * 0.3);
  const A = 1.25 * (1 - 0.16 * p); // radius: narrows on the contraction
  const B = 0.5 * (1 + 0.4 * p); // height: domes up on the contraction
  const cw = Math.cos(w);
  const sw = Math.sin(w);

  // -- bell: a wide, shallow, glassy saucer with a scalloped rim.
  // Texture, from big to small: radial canals that branch 16 -> 32 -> 64
  // toward the rim and meet a ring canal near the edge; a bright ripple that
  // runs out from the top after each contraction; fine concentric growth
  // lines; a stable mottle across the glass; and scattered glowing specks.
  const nu = clampN((scale / CH) * 3, 5, 60);
  const nph = clampN(((TAU * scale * A) / CW) * 1.4, 16, 300);
  const R = ring(nph);
  const canal = Math.max(1, Math.round(nph / 16));
  const canal2 = Math.max(1, Math.round(canal / 2));
  const canal4 = Math.max(1, Math.round(canal / 4));
  const beatPh = (((t / period) % 1) + 1) % 1;
  for (let iu = 0; iu < nu; iu++) {
    const u = 0.02 + (0.98 * iu) / (nu - 1);
    const su = Math.sin((u * Math.PI) / 2);
    const cu = Math.cos((u * Math.PI) / 2);
    const py = B * cu;
    const ny0 = py / (B * B);
    const edge = u > 0.93 ? 0.4 : 0;
    const hue = hueAt(u * 0.35);
    const rd = (u - beatPh * 1.2) / 0.07;
    const ripple = 0.32 * Math.exp(-rd * rd) * (1 - beatPh);
    const ringCanal = Math.abs(u - 0.88) < 0.03 ? 0.28 : 0;
    const lines = 0.07 * Math.sin(u * 46 - w * 0.5);
    for (let k = 0; k < nph; k++) {
      const cp = R.c[k];
      const sp = R.s[k];
      const r = A * su * (1 + 0.035 * u ** 6 * R.c16[k]);
      const px = r * cp;
      const pz = r * sp;
      const nx = px / (A * A);
      const nz = pz / (A * A);
      const nl = Math.sqrt(nx * nx + ny0 * ny0 + nz * nz) || 1;
      const { diff, rim } = shade(cam, nx / nl, ny0 / nl, nz / nl);
      const canals = k % canal === 0 ? 0.26 : u > 0.5 && k % canal2 === 0 ? 0.18 : u > 0.72 && k % canal4 === 0 ? 0.11 : 0;
      const n = hash(iu * 977.1 + k * 3.7); // stable per point
      const mottle = 0.8 + 0.4 * (n - 0.5) + 0.08 * Math.sin(t * 1.8 + n * TAU);
      const lum = clamp01((0.1 + 0.28 * diff + 0.75 * rim) * mottle + edge + canals + ringCanal + ripple + lines);
      project(cam, px, py, pz);
      const hh = hue + 0.12 * py + 0.06 * (cp * cw - sp * sw);
      if (n > 0.991 && u > 0.15) {
        // a glowing speck, twinkling on its own clock
        const tw = 0.6 + 0.4 * Math.sin(t * 2.6 + n * 400);
        emit(out[2] + back - 0.01, tw > 0.75 ? G.star : G.plus, hh + 0.5, 0.3, tw * dim);
      } else {
        emit(out[2] + back, ramp(lum), hh, 0.55 - 0.25 * rim, (0.22 + 0.78 * lum) * dim);
      }
    }
  }

  // -- the four rings (gonads): frilly horseshoes just under the bell's top,
  // with a dotted fill and a shimmer running round them
  const hueRing = hueAt(0.15) + 0.5;
  const nRing = clampN(((TAU * 0.25 * scale) / CW) * 2.4, 12, 110);
  for (let j = 0; j < 4; j++) {
    const ang = (j * TAU) / 4 + Math.PI / 4;
    const rc = 0.5 * A;
    const gx = rc * Math.cos(ang);
    const gz = rc * Math.sin(ang);
    const gy = B * Math.sqrt(Math.max(0, 1 - (rc / A) ** 2)) - 0.05;
    const glow = 0.75 + 0.25 * pulse(t - 0.2 - j * 0.1, period);
    for (let i = 0; i < nRing; i++) {
      const th = ang + 0.5 + (i / (nRing - 1)) * (TAU - 1); // gap faces the rim
      const frill = 1 + 0.16 * Math.sin(9 * th + w * 1.5 + j);
      const shimmer = 0.8 + 0.2 * Math.sin(6 * th - 2 * w);
      // They sit inside the glassy bell but glow through it, so they are
      // drawn in front of its surface.
      for (const [rr, g, s, v] of [
        [0.1, G.dot, 0.4, 0.55],
        [0.165, G.o, 0.65, 0.9],
        [0.24 * frill, G.O, 0.7, 1],
      ] as const) {
        project(cam, gx + rr * Math.cos(th), gy, gz + rr * Math.sin(th));
        emit(out[2] + back - 1, g, hueRing + (rr - 0.16) * 0.6, s, glow * shimmer * v * dim);
      }
    }
  }

  oralArms(cam, emit, hueAt, t, o, w, 0.75, 0.16, 0.35);

  // -- fringe: many short tentacles round the rim, lagging the pulse
  const nf = clampN((scale * 0.5 * 3) / CH, 4, 40);
  scratch(nf);
  for (let k = 0; k < o.nTent; k++) {
    const phi = (k * TAU) / o.nTent;
    const cphi = Math.cos(phi);
    const sphi = Math.sin(phi);
    // alternate long and short, so the fringe reads as a layered curtain
    const len = (k % 2 ? 0.26 : 0.4) + 0.12 * hash(k + 0.5);
    for (let i = 0; i < nf; i++) {
      const s = i / (nf - 1);
      const lag = pulse(t - 0.25 - s * 0.6, period);
      const rr = 1.25 * (1 - 0.16 * lag) * (1 + 0.08 * s * (1 - lag));
      const sway = 0.06 * s * Math.sin(w - 3 * s + k * 0.7);
      project(cam, rr * cphi + sway, -s * len * (1 + 0.3 * lag), rr * sphi + sway);
      sx[i] = out[0];
      sy[i] = out[1];
      sz[i] = out[2];
    }
    for (let i = 0; i < nf; i++) {
      const s = i / (nf - 1);
      const tip = i === nf - 1;
      const g = tip ? (k % 3 ? G.dot : G.o) : s > 0.8 ? G.tick : strokeAt(sx, sy, i, nf);
      const beads = 0.8 + 0.2 * Math.sin(14 * s - w * 2 + k);
      out[0] = sx[i];
      out[1] = sy[i];
      emit(sz[i] + back, g, hueAt(0.4 + 0.6 * s) + 0.12, tip ? 0.3 : 0.5, (tip ? 0.85 : (0.75 - 0.4 * s) * beads) * dim);
    }
  }
}
