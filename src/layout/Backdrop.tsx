import { useEffect, useMemo, useRef } from 'react';
import { animate, utils } from 'animejs';
import './Backdrop.css';

/**
 * Soft blobs in the five group colours, drifting behind the page.
 *
 * Each blob is a radial gradient rather than a blurred element, so fourteen of
 * them cost nothing to paint, and the only animated properties are transform and
 * opacity, which stay on the compositor. The component is mounted after the page
 * is idle (see App) so it never competes with first paint, and it stays still
 * when the visitor has asked for reduced motion.
 */
const COLORS = ['--c-client', '--c-personal', '--c-play', '--c-template', '--c-early'];
const COUNT = 14;

interface Blob {
  left: number;
  top: number;
  size: number;
  color: string;
}

function makeBlobs(): Blob[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    left: utils.random(-10, 100),
    top: utils.random(-10, 100),
    size: utils.random(180, 420),
    color: COLORS[i % COLORS.length],
  }));
}

export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const blobs = useMemo(makeBlobs, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const anims = Array.from(root.children).map((el, i) =>
      animate(el, {
        x: () => utils.random(-90, 90),
        y: () => utils.random(-70, 70),
        scale: () => utils.random(0.85, 1.25, 2),
        opacity: () => utils.random(0.5, 1, 2),
        duration: () => utils.random(16000, 30000),
        delay: i * 120,
        ease: 'inOutSine',
        loop: true,
        alternate: true,
      }),
    );
    return () => anims.forEach((a) => a.revert());
  }, []);

  return (
    <div ref={ref} className="backdrop" aria-hidden="true">
      {blobs.map((b, i) => (
        <span
          key={i}
          className="backdrop-blob"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            '--blob': `var(${b.color})`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
