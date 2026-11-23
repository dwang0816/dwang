import { useEffect, useRef } from 'react';
import { CH, CW, GLYPHS, Grid, TAU, rng } from './ascii';
import { jelly, moonJelly, pulse } from './jellyfish';
import { drawSeabed, makeSeabed, type Seabed } from './seabed';
import './Backdrop.css';

/**
 * A deep-sea scene in ASCII behind the page, after jellyfish.py.
 *
 * Big jellyfish that gather themselves out of a swirl of motes when the site
 * opens, lean a little, and send a new colour down their bodies on every
 * beat: on wide screens one in each side margin (the classic one and a moon
 * jelly), otherwise the classic one alone in the middle. Smaller and baby
 * jellies rise slowly through the water, and a seabed of corals, vents and
 * fish runs along the bottom. See jellyfish.ts and seabed.ts.
 *
 * Drawing: every part plots into one letter grid (ascii.ts). The grid is drawn
 * by stamping white glyphs from a pre-rendered atlas, colouring them in one
 * pass with a tiny per-cell colour image, and adding a blurred quarter-size
 * copy for glow. 30 fps; the clock only runs while the tab is visible, so the
 * spawn is never missed; reduced motion gets one finished frame.
 */

const BEAT = 3.2; // seconds per pulse of the big jellyfish
const MOON_BEAT = 3.9; // the moon jelly pulses a little slower
const HUE_STEP = 0.38; // hue change per flap: about a third of the wheel
const CONTENT = 1180; // the page's content width (--wrap)
const TURN = 48; // seconds per full turn
const SPAWN = 2.6; // seconds for the big one to gather itself
const FPS = 30;

interface Drifter {
  x: number; // 0..1 of width
  y: number; // starting height, 0..1
  size: number; // vs the big one
  period: number;
  rise: number; // seconds to cross the screen
  dh: number; // hue offset
  sway: number; // px
  swayPer: number;
  ph: number;
  baby: boolean;
}

function makeSwarm(w: number): Drifter[] {
  const r = rng(5);
  const nSmall = Math.max(4, Math.min(10, Math.round(w / 240)));
  const nBaby = Math.max(5, Math.min(16, Math.round(w / 130)));
  const out: Drifter[] = [];
  for (let i = 0; i < nSmall + nBaby; i++) {
    const baby = i >= nSmall;
    out.push({
      // spread across the width in strata, with jitter, so they never bunch up
      x: (((i * 0.618034) % 1) + (r() - 0.5) * 0.08 + 1) % 1,
      y: r(),
      size: baby ? 0.06 + r() * 0.04 : 0.18 + r() * 0.16,
      period: baby ? 1.8 + r() * 1 : 3.4 + r() * 1.8,
      rise: baby ? 70 + r() * 60 : 140 + r() * 90,
      dh: -0.08 + r() * 0.28,
      sway: baby ? 30 + r() * 30 : 14 + r() * 14,
      swayPer: 14 + r() * 14,
      ph: r() * TAU,
      baby,
    });
  }
  return out;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

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
    let seabed: Seabed | null = null;
    let swarm: Drifter[] = [];
    let raf = 0;
    let last = 0;
    let lastDraw = 0;
    let t = still ? 8 : 0; // scene clock, seconds; only runs while visible

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
      seabed = makeSeabed(w, h);
      swarm = makeSwarm(w);
      buildAtlas();
    };

    const scene = () => {
      if (!grid || !seabed) return;
      grid.reset();
      const hue = 0.56;
      const narrow = w < 760;
      const scale = Math.min(h * 0.18, w * (narrow ? 0.3 : 0.2));
      const rot = (TAU * t) / TURN;
      // Everything but the big one fades in while it gathers itself.
      const spawn = clamp01(t / SPAWN);
      const fade = clamp01((t - 0.4) / 2);
      const ease = fade * fade * (3 - 2 * fade);

      // On phones the floor sits right behind panel text, so keep it quieter.
      drawSeabed(grid, seabed, t, w, h, ease * (narrow ? 0.6 : 1));

      swarm.forEach((d, i) => {
        const sc = Math.max(d.baby ? 13 : 30, scale * d.size);
        // Rise from below the fold to above the top, then start again.
        const span = 1.45;
        const y = ((((d.y - t / d.rise) % span) + span) % span) - 0.25;
        jelly(grid!, t + i * 0.9, {
          cx: d.x * w + d.sway * Math.sin((TAU * t) / d.swayPer + d.ph),
          cy: y * h,
          scale: sc,
          hue: hue + d.dh,
          dim: (d.baby ? 0.6 : 0.45) * ease,
          back: d.baby ? 55 : 50,
          period: d.period,
          rot: rot * 1.3 + i,
          lean: 0.1 * Math.sin((TAU * t) / (9 + i) + d.ph),
          hueStep: 0.06,
          nTent: d.baby ? 5 : 7,
          sparks: false,
        });
      });

      // The big ones. Each flap moves the hue a long way round the wheel
      // (HUE_STEP), so every beat sends a very different colour down the body.
      // Wide screens: one in each side margin, clear of the content.
      // Otherwise: the classic one alone, centred behind the content.
      const gutter = (w - CONTENT) / 2;
      const sides = gutter >= 250;
      const big = sides ? Math.min(gutter * 0.4, h * 0.17) : scale;
      const thrust = h * 0.035 * pulse(t - 0.4, BEAT);
      jelly(grid, t, {
        cx: (sides ? gutter / 2 : w * 0.5) + 12 * Math.sin((TAU * t) / 31),
        cy: Math.max(h * 0.09, 30) + big * 1.1 - thrust + 10 * Math.sin((TAU * t) / 23),
        scale: big,
        hue,
        dim: 0.85,
        back: 0,
        period: BEAT,
        rot,
        lean: 0.1 + 0.07 * Math.sin((TAU * t) / 12),
        hueStep: HUE_STEP,
        nTent: 12,
        sparks: true,
        spawn,
      });
      if (sides) {
        const moon = Math.min(gutter * 0.34, h * 0.16);
        moonJelly(grid, t, {
          cx: w - gutter / 2 + 12 * Math.sin((TAU * t) / 27),
          cy: h * 0.3 + h * 0.06 * Math.sin((TAU * t) / 37) - h * 0.03 * pulse(t - 0.3, MOON_BEAT),
          scale: moon,
          hue: hue + 0.35,
          dim: 0.85,
          back: 0,
          period: MOON_BEAT,
          rot: -rot * 0.8,
          lean: -0.08 + 0.06 * Math.sin((TAU * t) / 14),
          hueStep: HUE_STEP,
          nTent: 56,
          sparks: false,
          spawn: clamp01((t - 0.3) / SPAWN),
        });
      }
    };

    const draw = () => {
      if (!grid || !image) return;
      scene();

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

    // The loop. In-app browsers on iOS (Messenger, Instagram: WKWebView)
    // report page visibility unreliably and can leave requestAnimationFrame
    // stalled, which froze the scene on one frame. So the loop never stops
    // itself on visibility events (browsers already pause rAF in hidden tabs),
    // a watchdog restarts it when frames stop arriving, and if rAF still will
    // not fire, a plain timer drives the frames until it comes back.
    let fallback = 0; // setInterval id while rAF is not firing
    let lastTick = 0; // when the scene last advanced, by any driver
    let kicked = false; // the watchdog has already restarted rAF once

    const tick = (now: number) => {
      t += Math.min(1000, Math.max(0, now - last)) / 1000; // cap a long stall
      last = now;
      lastTick = now;
      if (now - lastDraw < 1000 / FPS - 2) return;
      lastDraw = now;
      draw();
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      kicked = false;
      if (fallback) {
        clearInterval(fallback); // rAF is back
        fallback = 0;
      }
      tick(now);
    };
    const start = () => {
      if (still) return;
      cancelAnimationFrame(raf);
      last = lastTick = performance.now();
      raf = requestAnimationFrame(frame);
    };
    /** Restart the loop if it has stalled. */
    const revive = () => {
      if (still || performance.now() - lastTick < 1500) return;
      if (!kicked || document.visibilityState === 'hidden') {
        kicked = true;
        start();
      } else if (!fallback) {
        // rAF was restarted and still did not fire: drive frames by timer
        fallback = window.setInterval(() => tick(performance.now()), 1000 / FPS);
      }
    };
    const watchdog = still ? 0 : window.setInterval(revive, 1000);
    const onResize = () => {
      resize();
      if (still) draw();
    };

    resize();
    if (still) draw();
    else start();
    // The atlas was drawn with whatever font was ready; redraw once Plex arrives.
    document.fonts?.ready.then(() => {
      buildAtlas();
      if (still) draw();
    });
    // Any sign of life from the page is a chance to restart a stalled loop.
    const wake = ['pageshow', 'focus', 'pointerdown', 'touchstart', 'scroll'] as const;
    window.addEventListener('resize', onResize);
    for (const e of wake) window.addEventListener(e, revive, { passive: true });
    document.addEventListener('visibilitychange', revive);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(fallback);
      clearInterval(watchdog);
      window.removeEventListener('resize', onResize);
      for (const e of wake) window.removeEventListener(e, revive);
      document.removeEventListener('visibilitychange', revive);
    };
  }, []);

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />;
}
