import { CH, CW, G, Grid, TAU, rng, strokeGlyph } from './ascii';

/**
 * The deep-sea floor along the bottom of the screen, in the same letters as
 * the jellyfish: a dark sand bed with rocks, corals of a few kinds, sea grass,
 * tube worms and anemones, a couple of hydrothermal vents breathing bubbles,
 * schools of tiny fish crossing at different depths, and marine snow falling
 * through all of it.
 *
 * Everything static is laid out once per resize as a list of cells. Cells on
 * anything that sways carry an amplitude and phase, and a few glowing tips
 * carry a twinkle, so a frame only has to offset and plot them.
 */

interface Cell {
  x: number;
  y: number;
  g: number;
  h: number;
  s: number;
  v: number;
  z: number;
  amp: number; // sway, px
  ph: number;
  tw: number; // twinkle depth, 0..1
}

interface Vent {
  x: number;
  y: number;
  rise: number; // px a bubble travels
  bubbles: { off: number; per: number; wob: number }[];
}

interface School {
  y: number; // 0..1 of height
  dir: 1 | -1;
  speed: number; // px/s
  x0: number;
  hue: number;
  v: number;
  z: number;
  fish: { dx: number; dy: number; ph: number }[];
}

interface Flake {
  x: number;
  y: number;
  speed: number;
  ph: number;
  v: number;
}

export interface Seabed {
  cells: Cell[];
  vents: Vent[];
  schools: School[];
  snow: Flake[];
}

// Coral colours: (hue, saturation). Warm reds and pinks read as deep-sea
// coral; violet and teal tie them back to the jellyfish.
const CORAL: readonly [number, number][] = [
  [0.95, 0.6], // pink
  [0.03, 0.72], // coral red
  [0.08, 0.7], // amber
  [0.8, 0.55], // violet
  [0.47, 0.6], // teal
];

export function makeSeabed(w: number, h: number): Seabed {
  const r = rng(11);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
  const cells: Cell[] = [];
  const add = (x: number, y: number, g: number, hh: number, s: number, v: number, z: number,
    amp = 0, ph = 0, tw = 0) => cells.push({ x, y, g, h: hh, s, v, z, amp, ph, tw });

  const narrow = w < 760;
  const base = h * (narrow ? 0.9 : 0.86);
  const a1 = r() * TAU;
  const a2 = r() * TAU;
  const a3 = r() * TAU;
  const floorAt = (x: number) =>
    base + h * 0.022 * Math.sin(x / 210 + a1) + h * 0.012 * Math.sin(x / 77 + a2) + 4 * Math.sin(x / 21 + a3);

  // -- sand: a lit surface row, then darker, sparser texture below
  for (let x = CW / 2; x < w; x += CW) {
    const top = floorAt(x);
    add(x, top, pick([G.dot, G.comma, G.under, G.dash, G.tilde, G.dot]), 0.57, 0.35, 0.34, 300);
    for (let y = top + CH; y < h + CH; y += CH) {
      if (r() > 0.7) continue;
      const depth = (y - top) / Math.max(1, h - top);
      add(x, y, pick([G.dot, G.comma, G.colon, G.dot, G.dash, G.eq]), 0.6, 0.4, 0.2 * (1 - 0.65 * depth) + 0.03 * r(), 300);
    }
  }

  // -- rocks: half-buried mounds
  const nRocks = Math.max(2, Math.round(w / 420));
  for (let i = 0; i < nRocks; i++) {
    const x0 = r() * w;
    const rx = 28 + r() * 60;
    const ry = 16 + r() * 30;
    const y0 = floorAt(x0) + 6;
    for (let y = y0 - ry; y <= y0; y += CH) {
      for (let x = x0 - rx; x <= x0 + rx; x += CW) {
        const q = ((x - x0) / rx) ** 2 + ((y - y0) / ry) ** 2;
        if (q > 1) continue;
        const n = Math.sin(x * 0.21) + Math.cos(y * 0.33 + x * 0.05);
        const g = q > 0.75 ? (y < y0 - ry * 0.5 ? G.under : G.lpar) : n > 0.6 ? G.at : n > -0.2 ? G.hash : G.pct;
        add(x, y, g, 0.62, 0.15, 0.2 + 0.08 * (1 - q), 260);
      }
    }
  }

  // -- corals and friends, spaced along the floor
  const slots = Math.max(4, Math.round(w / (narrow ? 70 : 85)));
  for (let i = 0; i < slots; i++) {
    const x0 = ((i + 0.15 + r() * 0.7) / slots) * w;
    const y0 = floorAt(x0) + 3;
    const [hue, sat] = pick(CORAL);
    const z = 30 + r() * 15;
    const ph0 = r() * TAU;
    const kind = r();
    const tall = Math.min(h * 0.16, 130) * (0.55 + r() * 0.6);

    if (kind < 0.24) {
      // branching coral: a small fractal tree with glowing tips
      const grow = (x: number, y: number, ang: number, len: number, depth: number) => {
        const steps = Math.max(1, Math.round(len / 5));
        for (let k = 1; k <= steps; k++) {
          const px = x + Math.cos(ang) * len * (k / steps);
          const py = y - Math.sin(ang) * len * (k / steps);
          const f = Math.max(0, (y0 - py) / tall);
          add(px, py, strokeGlyph(ang), hue, sat, 0.38 + 0.18 * f, z, 5 * f ** 1.3, ph0 - f * 1.5);
        }
        const ex = x + Math.cos(ang) * len;
        const ey = y - Math.sin(ang) * len;
        if (depth === 0) {
          const f = Math.max(0, (y0 - ey) / tall);
          const tip = r();
          add(ex, ey - 4, tip < 0.35 ? G.o : tip < 0.7 ? G.star : G.tick, hue, sat * 0.6, 0.85, z - 1,
            5 * f ** 1.3, ph0 - f * 1.5, 0.35);
          return;
        }
        // Branches fork early and often, and not every fork reaches the top.
        const n = r() < 0.4 ? 3 : 2;
        for (let b = 0; b < n; b++) {
          const stunted = depth > 1 && r() < 0.2;
          grow(ex, ey, ang + 0.62 * (b - (n - 1) / 2) + (r() - 0.5) * 0.45,
            len * (0.7 + r() * 0.25), stunted ? 0 : depth - 1);
        }
      };
      // Several stems straight from the base make it a bush, not a tree.
      const stems = 2 + Math.floor(r() * 2);
      for (let k = 0; k < stems; k++) {
        const ang = Math.PI / 2 + 0.5 * (k - (stems - 1) / 2) + (r() - 0.5) * 0.3;
        grow(x0 + (k - (stems - 1) / 2) * CW, y0, ang, tall * (0.2 + r() * 0.08), 3);
      }
    } else if (kind < 0.38) {
      // sea fan: a fine, wide lattice of thin branches
      const fan = (x: number, y: number, ang: number, len: number, depth: number) => {
        const steps = Math.max(1, Math.round(len / 6));
        for (let k = 1; k <= steps; k++) {
          const px = x + Math.cos(ang) * len * (k / steps);
          const py = y - Math.sin(ang) * len * (k / steps);
          const f = Math.max(0, (y0 - py) / tall);
          add(px, py, depth > 2 ? strokeGlyph(ang) : G.colon, hue, sat * 0.8, 0.3 + 0.14 * f, z + 4, 3 * f, ph0 - f);
        }
        if (depth === 0) return;
        const ex = x + Math.cos(ang) * len;
        const ey = y - Math.sin(ang) * len;
        fan(ex, ey, ang + 0.32, len * 0.78, depth - 1);
        fan(ex, ey, ang - 0.32, len * 0.78, depth - 1);
      };
      fan(x0, y0, Math.PI / 2, tall * 0.3, 4);
    } else if (kind < 0.52) {
      // brain coral: a ridged dome
      const rx = 16 + r() * 22;
      const ry = rx * (0.55 + r() * 0.2);
      for (let y = y0 - ry; y <= y0; y += CH) {
        for (let x = x0 - rx; x <= x0 + rx; x += CW) {
          const q = ((x - x0) / rx) ** 2 + ((y - y0) / ry) ** 2;
          if (q > 1) continue;
          const n = Math.sin((x - x0) * 0.35 + 2 * Math.sin((y - y0) * 0.4));
          const g = q > 0.8 ? G.tilde : n > 0.5 ? G.at : n > 0 ? G.pct : n > -0.5 ? G.eq : G.tilde;
          add(x, y, g, hue, sat * 0.8, 0.32 + 0.14 * n + 0.1 * (1 - q), z, 0, 0, q < 0.2 ? 0.15 : 0);
        }
      }
    } else if (kind < 0.66) {
      // tube worms: pale stalks under red plumes
      const n = 3 + Math.floor(r() * 4);
      for (let k = 0; k < n; k++) {
        const x = x0 + (k - n / 2) * CW * (0.9 + r() * 0.5);
        const ht = tall * (0.25 + r() * 0.35);
        const ph = ph0 + k;
        for (let y = y0; y > y0 - ht; y -= CH) {
          const f = (y0 - y) / ht;
          add(x, y, G.bar, 0.1, 0.12, 0.34, z, 2.5 * f, ph);
        }
        add(x, y0 - ht - 2, r() < 0.5 ? G.Y : G.star, 0.99, 0.85, 0.8, z - 1, 2.5, ph, 0.3);
      }
    } else if (kind < 0.8) {
      // anemone: a stubby body and swaying tentacles with glowing tips
      for (let k = -1; k <= 1; k++) add(x0 + k * CW, y0, k === 0 ? G.at : k < 0 ? G.lpar : G.rpar, hue, sat, 0.42, z);
      const n = 7 + Math.floor(r() * 5);
      for (let k = 0; k < n; k++) {
        const ang = Math.PI * (0.15 + (0.7 * k) / (n - 1));
        const len = 14 + r() * 18;
        const steps = Math.max(2, Math.round(len / 5));
        for (let j = 1; j <= steps; j++) {
          const f = j / steps;
          const tip = j === steps;
          add(x0 + Math.cos(ang) * len * f, y0 - CH * 0.6 - Math.sin(ang) * len * f,
            tip ? G.o : strokeGlyph(ang), hue, sat * (tip ? 0.5 : 1), tip ? 0.8 : 0.45, z, 4.5 * f, ph0 + k * 0.4 - f, tip ? 0.4 : 0);
        }
      }
    } else {
      // sea grass: tall blades that sway in a travelling wave
      const n = 2 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const x = x0 + (k - n / 2) * CW * 1.3;
        const ht = tall * (0.9 + r() * 0.9);
        const ph = ph0 + k * 0.7;
        let alt = r() < 0.5;
        for (let y = y0; y > y0 - ht; y -= CH * 0.8) {
          const f = (y0 - y) / ht;
          alt = !alt;
          add(x, y, alt ? G.rpar : G.lpar, 0.42, 0.5, 0.2 + 0.12 * f, z + 6, 14 * f ** 1.5, ph - f * 2.5);
        }
      }
    }
  }

  // -- hydrothermal vents: a short chimney with a hot mouth, breathing bubbles
  const vents: Vent[] = [];
  const nVents = Math.max(1, Math.round(w / 700));
  for (let i = 0; i < nVents; i++) {
    const x = ((i + 0.3 + r() * 0.4) / nVents) * w;
    const y = floorAt(x);
    const ht = 2 + Math.floor(r() * 3);
    for (let k = 0; k < ht; k++) {
      const yy = y - k * CH;
      const half = Math.max(0, ht - k - 1);
      for (let c = -half - 1; c <= half + 1; c++) {
        const edge = Math.abs(c) === half + 1;
        add(x + c * CW, yy, edge ? (c < 0 ? G.fwd : G.back) : G.hash, 0.05, 0.25, 0.26, 28);
      }
    }
    add(x, y - ht * CH, G.v, 0.06, 0.85, 0.75, 27, 0, 0, 0.5);
    vents.push({
      x,
      y: y - ht * CH - 6,
      rise: h * (0.35 + r() * 0.3),
      bubbles: Array.from({ length: 9 }, (_, k) => ({ off: k / 9 + r() * 0.05, per: 7 + r() * 4, wob: r() * TAU })),
    });
  }

  // -- schools of tiny fish
  const schools: School[] = Array.from({ length: narrow ? 2 : 3 }, (_, i) => {
    const n = 5 + Math.floor(r() * 7);
    return {
      y: 0.22 + i * 0.2 + r() * 0.08,
      dir: r() < 0.5 ? 1 : -1,
      speed: 16 + r() * 22,
      x0: r() * w,
      hue: pick([0.52, 0.56, 0.12]),
      v: 0.28 + r() * 0.12,
      z: 70 + i,
      fish: Array.from({ length: n }, () => ({ dx: (r() - 0.5) * 140, dy: (r() - 0.5) * 60, ph: r() * TAU })),
    } as School;
  });

  // -- marine snow, falling slowly
  const snow: Flake[] = Array.from({ length: Math.round(Math.min(280, (w * h) / 8000)) }, () => ({
    x: r(),
    y: r(),
    speed: 6 + r() * 12,
    ph: r() * TAU,
    v: 0.1 + r() * 0.18,
  }));

  return { cells, vents, schools, snow };
}

export function drawSeabed(grid: Grid, sb: Seabed, t: number, w: number, h: number, fade: number) {
  for (const f of sb.snow) {
    const x = f.x * w + 10 * Math.sin((TAU * t) / 12 + f.ph);
    const y = (((f.y * h + t * f.speed) % h) + h) % h;
    grid.plot(x, y, 500, f.v > 0.22 ? G.grave : G.dot, 0.55, 0.35, f.v * fade);
  }

  for (const c of sb.cells) {
    const x = c.amp ? c.x + c.amp * Math.sin(t * 0.7 + c.ph) : c.x;
    const v = c.tw ? c.v * (1 - c.tw + c.tw * (0.5 + 0.5 * Math.sin(t * 1.7 + c.x * 0.05))) : c.v;
    grid.plot(x, c.y, c.z, c.g, c.h, c.s, v * fade);
  }

  for (const vent of sb.vents) {
    for (const b of vent.bubbles) {
      const age = ((t / b.per + b.off) % 1 + 1) % 1;
      const x = vent.x + 5 * Math.sin(age * 9 + b.wob) * age;
      const y = vent.y - age * vent.rise;
      const g = age < 0.2 ? G.dot : age < 0.55 ? G.o : G.O;
      grid.plot(x, y, 25, g, 0.53, 0.3, 0.55 * (1 - age * age) * fade);
    }
  }

  for (const s of sb.schools) {
    const span = w + 400;
    const cx = ((((s.x0 + s.dir * t * s.speed) % span) + span) % span) - 200;
    const cy = s.y * h + 18 * Math.sin((TAU * t) / 17 + s.x0);
    for (const f of s.fish) {
      const x = cx + f.dx;
      const y = cy + f.dy + 4 * Math.sin(t * 2 + f.ph);
      // "><>" swims right, "<><" swims left
      const head = s.dir > 0 ? G.gt : G.lt;
      const tail = s.dir > 0 ? G.gt : G.lt;
      const body = s.dir > 0 ? G.lt : G.gt;
      grid.plot(x - s.dir * CW, y, s.z, tail, s.hue, 0.35, s.v * 0.8 * fade);
      grid.plot(x, y, s.z, body, s.hue, 0.35, s.v * fade);
      grid.plot(x + s.dir * CW, y, s.z, head, s.hue, 0.35, s.v * fade);
    }
  }
}
