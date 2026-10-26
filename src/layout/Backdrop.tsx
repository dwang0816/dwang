import { useEffect, useRef } from 'react';
import './Backdrop.css';

/**
 * A skill-tree constellation behind the page.
 *
 * Round nodes drift slowly; any two within reach are joined by a link that
 * fades with distance, and bright pulses run along the links now and then.
 * Nodes near the pointer wake up: they brighten, grow a ring, lean toward the
 * cursor and link to it, so moving the mouse feels like scanning the tree.
 *
 * One canvas at device resolution, paused while the tab is hidden, frozen on
 * a single frame under prefers-reduced-motion. Mounted after the page is idle
 * (see App), so it never competes with the content.
 */

type RGB = readonly [number, number, number];

const TEAL: RGB = [46, 211, 195];
const GOLD: RGB = [233, 196, 92];
const GREEN: RGB = [95, 212, 138];
const VIOLET: RGB = [180, 140, 242];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: RGB;
  /** 0..1, how lit by the cursor; eases so nodes glow in and out. */
  lit: number;
}

interface Pulse {
  a: Node;
  b: Node;
  t: number;
  speed: number;
  c: RGB;
}

const LINK = 170; // px: how close two nodes must be to connect
const REACH = 220; // px: how far the cursor wakes nodes
const DRIFT = 0.3; // px/frame: top cruising speed

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

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
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = performance.now();
    let sincePulse = 0;
    // Pointer in page pixels; null until the pointer moves, and again after it leaves.
    let px: number | null = null;
    let py: number | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area so phones get a sparse tree, not a wall.
      const count = Math.min(170, Math.max(48, Math.floor((w * h) / 9000)));
      nodes = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.4 + Math.random() * 1.8,
          c: Math.random() < 0.72 ? TEAL : pick([GOLD, GREEN, VIOLET]),
          lit: 0,
        };
      });
      pulses = [];
    };

    const step = (dt: number) => {
      for (const n of nodes) {
        // Lean toward the cursor when close; otherwise settle back to cruising speed.
        let target = 0;
        if (px != null && py != null) {
          const dx = px - n.x;
          const dy = py - n.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH) {
            target = 1 - d / REACH;
            const pull = 0.012 * target;
            n.vx += (dx / (d || 1)) * pull * dt;
            n.vy += (dy / (d || 1)) * pull * dt;
          }
        }
        n.lit += (target - n.lit) * Math.min(1, 0.08 * dt);

        const sp = Math.hypot(n.vx, n.vy);
        if (sp > DRIFT) {
          n.vx *= DRIFT / sp;
          n.vy *= DRIFT / sp;
        }
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

    const dot = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Links between nodes. Lit nodes pull their links up with them.
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
          const lit = Math.max(a.lit, b.lit);
          const alpha = (1 - d / LINK) * (0.42 + lit * 0.5);
          ctx.strokeStyle = rgba(a.c, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Links from woken nodes to the cursor, then the cursor itself.
      if (px != null && py != null) {
        for (const n of nodes) {
          if (n.lit < 0.03) continue;
          ctx.strokeStyle = rgba(n.c, n.lit * 0.7);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
        ctx.strokeStyle = rgba(TEAL, 0.5);
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = rgba(TEAL, 0.9);
        dot(px, py, 1.8);
      }

      // Nodes: a soft halo, a thin ring when lit, and the core.
      for (const n of nodes) {
        const r = n.r * (1 + n.lit * 0.9);
        ctx.fillStyle = rgba(n.c, 0.1 + n.lit * 0.18);
        dot(n.x, n.y, r * 3.2);
        if (n.lit > 0.05) {
          ctx.strokeStyle = rgba(n.c, n.lit * 0.9);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 3.5 + n.lit * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = rgba(n.c, 0.95);
        dot(n.x, n.y, r);
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
        dot(x, y, 2);
        ctx.shadowBlur = 0;
      }
    };

    const frame = (now: number) => {
      // dt in frames at 60fps, so drift speed is the same on 120Hz screens.
      const dt = Math.min(3, (now - last) / 16.667);
      sincePulse += now - last;
      last = now;
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
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // touch has no hover; leave the tree calm
      px = e.clientX;
      py = e.clientY;
    };
    const onLeave = () => {
      px = null;
      py = null;
    };

    resize();
    if (still) {
      for (let i = 0; i < 4; i++) spawnPulse();
      draw();
    } else {
      start();
    }
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
