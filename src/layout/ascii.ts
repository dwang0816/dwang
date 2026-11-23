/**
 * The letter grid every part of the backdrop draws into.
 *
 * Things are plotted as points in screen pixels with a depth; each point lands
 * in a CW x CH letter cell and the nearest point wins the cell. The grid keeps
 * one glyph and one colour per cell, and the colours live in an RGBA buffer
 * that doubles as the tint image when the frame is drawn.
 */

export const TAU = Math.PI * 2;
export const CW = 8; // one letter cell, CSS px
export const CH = 14;

export const RAMP = ' .,:;-=+*#%@'; // dark -> bright
export const GLYPHS = RAMP + "|/\\'`()<>oOY_~^v";
const g = (ch: string) => GLYPHS.indexOf(ch);
export const G = {
  dot: g('.'),
  comma: g(','),
  colon: g(':'),
  dash: g('-'),
  eq: g('='),
  plus: g('+'),
  star: g('*'),
  hash: g('#'),
  pct: g('%'),
  at: g('@'),
  bar: g('|'),
  fwd: g('/'),
  back: g('\\'),
  tick: g("'"),
  grave: g('`'),
  lpar: g('('),
  rpar: g(')'),
  lt: g('<'),
  gt: g('>'),
  o: g('o'),
  O: g('O'),
  Y: g('Y'),
  under: g('_'),
  tilde: g('~'),
  caret: g('^'),
  v: g('v'),
};

/** Brightness 0..1 -> a glyph from the ramp (never the blank). */
export const ramp = (lum: number) =>
  Math.min(RAMP.length - 1, Math.max(1, Math.floor(lum * (RAMP.length - 1) + 0.5)));

/** The glyph that best follows a stroke heading `ang` (radians, y up). */
export function strokeGlyph(ang: number): number {
  const a = ((ang % Math.PI) + Math.PI) % Math.PI;
  if (Math.abs(a - Math.PI / 2) < Math.PI / 8) return G.bar;
  if (a < Math.PI / 8 || a > (7 * Math.PI) / 8) return G.dash;
  return a < Math.PI / 2 ? G.fwd : G.back;
}

/** Small seeded PRNG, so the scene is the same on every visit. */
export function rng(seed: number) {
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
export class Grid {
  cols: number;
  rows: number;
  z: Float32Array;
  g: Int8Array;
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

  /** Plot one point at screen (sx, sy), depth z, coloured by HSV. */
  plot(sx: number, sy: number, z: number, glyph: number, h: number, s: number, v: number) {
    const c = Math.floor(sx / CW);
    const r = Math.floor(sy / CH);
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return;
    const i = r * this.cols + c;
    if (z >= this.z[i]) return;
    this.z[i] = z;
    this.g[i] = glyph;
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
