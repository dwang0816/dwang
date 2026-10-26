import { useEffect, useRef } from 'react';
import './Backdrop.css';

/**
 * A slow node graph behind the page.
 *
 * Points drift across the viewport; any two within reach are joined by a line
 * that fades with distance, and every so often a bright pulse runs along one
 * of the links. Drawn on a single canvas at device resolution, paused while
 * the tab is hidden, and frozen on one frame when the visitor prefers reduced
 * motion. The component mounts after the page is idle (see App).
 */

const TEAL = [46, 211, 195] as const;
const GOLD = [233, 196, 92] as const;
const GREEN = [95, 212, 138] as const;
const VIOLET = [180, 140, 242] as const;

type RGB = readonly [number, number, number];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: RGB;
}

interface Pulse {
  a: Node;
  b: Node;
  t: number; // 0..1 progress
  speed: number;
  c: RGB;
}

const LINK = 170; // px: how close two nodes must be to connect
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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
    let dpr = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = performance.now();
    let sincePulse = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area so phones get a sparse graph, not a wall.
      const count = Math.min(170, Math.max(48, Math.floor((w * h) / 9000)));
      nodes = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.12 + Math.random() * 0.22;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.2 + Math.random() * 1.8,
          c: Math.random() < 0.72 ? TEAL : pick([GOLD, GREEN, VIOLET]),
        };
      });
      pulses = [];
    };

    const step = (dt: number) => {
      // dt in frames at 60fps, so drift speed is the same on 120Hz screens.
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
      }
      for (const p of pulses) p.t += p.speed * dt;
      pulses = pulses.filter((p) => p.t < 1);
    };

    const spawnPulse = () => {
      // Pick a random node and the nearest neighbour inside link range.
      const a = pick(nodes);
      let best: Node | null = null;
      let bestD = LINK;
      for (const b of nodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < bestD) {
          bestD = d;
          best = b;
        }
      }
      if (best) pulses.push({ a, b: best, t: 0, speed: 0.012 + Math.random() * 0.012, c: a.c });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Links first, so nodes sit on top of them.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK) continue;
          const alpha = (1 - d / LINK) * 0.5;
          ctx.strokeStyle = rgba(a.c === TEAL ? TEAL : a.c, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = rgba(n.c, 0.14);
        ctx.fillRect(n.x - n.r * 3, n.y - n.r * 3, n.r * 6, n.r * 6);
        ctx.fillStyle = rgba(n.c, 0.95);
        ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
      }

      // Pulses: a bright head with a short fading tail along the link.
      for (const p of pulses) {
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const tail = Math.max(0, p.t - 0.18);
        const tx = p.a.x + (p.b.x - p.a.x) * tail;
        const ty = p.a.y + (p.b.y - p.a.y) * tail;
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, rgba(p.c, 0));
        grad.addColorStop(1, rgba(p.c, 0.9));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = rgba(p.c, 1);
        ctx.shadowColor = rgba(p.c, 0.9);
        ctx.shadowBlur = 10;
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        ctx.shadowBlur = 0;
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      sincePulse += now - last + dt * 16.667;
      if (sincePulse > 260 && pulses.length < 10) {
        sincePulse = 0;
        spawnPulse();
      }
      step(dt);
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

    resize();
    if (still) {
      for (let i = 0; i < 4; i++) spawnPulse();
      draw();
    } else {
      start();
    }
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />;
}
