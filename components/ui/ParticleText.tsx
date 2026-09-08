'use client'

import { useEffect, useRef } from 'react';

/**
 * Sand-text effect, plain Canvas 2D, no libraries.
 *
 * At rest the grains lie in a faint mound along the bottom edge of the box.
 * When `isActive` turns on they rise (lowest rows of the word first) and settle
 * into the pixels of `text`. When it turns off they fall back into the mound.
 *
 * Meant to be mounted as an absolutely positioned overlay: the canvas fills its
 * parent and ignores pointer events.
 */
interface ParticleTextProps {
  text: string;
  color: string;       // grain colour once the word is formed
  isActive: boolean;
  grain?: number;      // grain size in CSS px (2 = sand)
  fontWeight?: number;
  className?: string;
}

const STEP = 2;               // sampling step over the rasterised text (CSS px)
const MAX_GRAINS = 7000;      // hard cap: the sampling step grows until we fit
const REST_ALPHA = 0.16;      // the mound is barely there
const RISE_STAGGER = 0.55;    // seconds between the first and the last row lifting off
/** next/font exposes the generated family name through --font-comfortaa; canvas cannot read CSS vars. */
function resolveFont(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--font-comfortaa').trim();
  return v ? `${v}, Comfortaa, sans-serif` : 'Comfortaa, sans-serif';
}

type Sim = {
  n: number;
  x: Float32Array; y: Float32Array;
  vx: Float32Array; vy: Float32Array;
  tx: Float32Array; ty: Float32Array;   // word targets
  rx: Float32Array; ry: Float32Array;   // mound targets
  delay: Float32Array;                  // lift-off delay per grain (s)
  s: Float32Array;                      // 0 = in the mound … 1 = in the word (drives alpha)
  w: number; h: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const v = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/** Rasterise the word and return grain targets. */
function sampleText(text: string, w: number, h: number, fontWeight: number, font: string): { pts: Float32Array; count: number } {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.floor(w));
  off.height = Math.max(1, Math.floor(h));
  const ctx = off.getContext('2d', { willReadFrequently: true })!;

  // Fit the word: as tall as 80 % of the box, but never wider than the box.
  let size = Math.floor(h * 0.8);
  ctx.font = `${fontWeight} ${size}px ${font}`;
  const width = ctx.measureText(text).width;
  if (width > w * 0.98) size = Math.floor((size * w * 0.98) / width);
  ctx.font = `${fontWeight} ${size}px ${font}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, 0, h / 2);

  const img = ctx.getImageData(0, 0, off.width, off.height).data;
  let step = STEP;
  let pts: number[] = [];
  for (;;) {
    pts = [];
    for (let py = 0; py < off.height; py += step) {
      for (let px = 0; px < off.width; px += step) {
        if (img[(py * off.width + px) * 4 + 3] > 128) pts.push(px, py);
      }
    }
    if (pts.length / 2 <= MAX_GRAINS || step > 6) break;
    step += 1;
  }
  return { pts: Float32Array.from(pts), count: pts.length / 2 };
}

/** Height of the mound at horizontal position x: a soft bump, taller in the middle. */
function moundHeight(x: number, w: number, h: number): number {
  const cx = w * 0.5;
  const spread = w * 0.32;
  const t = (x - cx) / spread;
  const peak = Math.min(h * 0.28, 22);
  return 2 + peak * Math.exp(-t * t);
}

function buildSim(text: string, w: number, h: number, fontWeight: number, font: string, prev?: Sim): Sim {
  const { pts, count } = sampleText(text, w, h, fontWeight, font);
  const n = count;
  const F = () => new Float32Array(n);
  const sim: Sim = { n, x: F(), y: F(), vx: F(), vy: F(), tx: F(), ty: F(), rx: F(), ry: F(), delay: F(), s: F(), w, h };

  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    sim.tx[i] = pts[i * 2] + Math.random() * 0.6 - 0.3;
    sim.ty[i] = pts[i * 2 + 1] + Math.random() * 0.6 - 0.3;
    if (sim.ty[i] < minY) minY = sim.ty[i];
    if (sim.ty[i] > maxY) maxY = sim.ty[i];
  }
  const range = Math.max(1, maxY - minY);

  for (let i = 0; i < n; i++) {
    // Mound: uniform across the width, piled inside the bump profile.
    const rx = Math.random() * w;
    const mh = moundHeight(rx, w, h);
    sim.rx[i] = rx;
    sim.ry[i] = h - 1 - Math.random() * mh;
    // Bottom rows of the word lift off first; jitter keeps it from looking like a scan line.
    const rowFromBottom = 1 - (sim.ty[i] - minY) / range;
    sim.delay[i] = (1 - rowFromBottom) * RISE_STAGGER + Math.random() * 0.18;

    if (prev && i < prev.n) {
      // Keep positions across a resize so the sand does not jump.
      sim.x[i] = Math.min(w, prev.x[i]); sim.y[i] = Math.min(h - 1, prev.y[i]);
      sim.vx[i] = prev.vx[i]; sim.vy[i] = prev.vy[i]; sim.s[i] = prev.s[i];
    } else {
      sim.x[i] = sim.rx[i]; sim.y[i] = sim.ry[i];
    }
  }
  return sim;
}

export const ParticleText = ({
  text,
  color,
  isActive,
  grain = 2,
  fontWeight = 700,
  className = '',
}: ParticleTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const activeRef = useRef(isActive);
  const activatedAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const reducedRef = useRef(false);

  // Keep the latest colour in a ref so the loop never needs to restart for it.
  const rgbRef = useRef<[number, number, number]>(hexToRgb(color));
  useEffect(() => { rgbRef.current = hexToRgb(color); }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = 1;
    let w = 0, h = 0;
    let disposed = false;

    const draw = () => {
      const sim = simRef.current;
      if (!sim) return;
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = rgbRef.current;
      // Five alpha buckets keep fillStyle changes (the expensive part) to a handful per frame.
      const BUCKETS = 5;
      for (let k = 0; k < BUCKETS; k++) {
        const a = REST_ALPHA + (1 - REST_ALPHA) * (k / (BUCKETS - 1));
        ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
        for (let i = 0; i < sim.n; i++) {
          if (Math.round(sim.s[i] * (BUCKETS - 1)) !== k) continue;
          ctx.fillRect(sim.x[i], sim.y[i], grain, grain);
        }
      }
    };

    const step = (dt: number, now: number) => {
      const sim = simRef.current;
      if (!sim) return false;
      const active = activeRef.current;
      const since = (now - activatedAtRef.current) / 1000;
      let moving = false;
      const k = dt * 60; // normalise to a 60 fps step

      for (let i = 0; i < sim.n; i++) {
        const goingUp = active && since >= sim.delay[i];
        const tx = goingUp ? sim.tx[i] : sim.rx[i];
        const ty = goingUp ? sim.ty[i] : sim.ry[i];
        const dx = tx - sim.x[i];
        const dy = ty - sim.y[i];

        if (goingUp) {
          // Spring flight into the word, with a whisper of drift so the letters breathe.
          sim.vx[i] = (sim.vx[i] + dx * 0.045 * k) * Math.pow(0.80, k);
          sim.vy[i] = (sim.vy[i] + dy * 0.045 * k) * Math.pow(0.80, k);
          sim.x[i] += sim.vx[i] * k + Math.sin(now * 0.004 + i) * 0.05;
          sim.y[i] += sim.vy[i] * k + Math.cos(now * 0.003 + i * 1.7) * 0.05;
          sim.s[i] = Math.min(1, sim.s[i] + 0.06 * k);
        } else {
          // Gravity brings the grain down, a weak spring walks it to its spot in the mound.
          sim.vx[i] = (sim.vx[i] + dx * 0.02 * k) * Math.pow(0.86, k);
          sim.vy[i] = (sim.vy[i] + 0.35 * k) * Math.pow(0.97, k);
          sim.x[i] += sim.vx[i] * k;
          sim.y[i] += sim.vy[i] * k;
          if (sim.y[i] >= ty) {
            sim.y[i] = ty;
            sim.vy[i] = Math.abs(sim.vy[i]) > 1.2 ? -sim.vy[i] * 0.18 : 0;
          }
          sim.s[i] = Math.max(0, sim.s[i] - 0.05 * k);
        }
        if (Math.abs(sim.vx[i]) > 0.02 || Math.abs(sim.vy[i]) > 0.02 || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) moving = true;
      }
      // Pending lift-offs count as motion too, otherwise the loop would stop before they start.
      if (active && since < RISE_STAGGER + 0.2) moving = true;
      return moving;
    };

    const loop = (ts: number) => {
      rafRef.current = null;
      if (disposed) return;
      const dt = Math.min(0.05, lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 1 / 60);
      lastTsRef.current = ts;
      const moving = step(dt, ts);
      draw();
      if (moving) rafRef.current = requestAnimationFrame(loop);
      else lastTsRef.current = 0;
    };

    const kick = () => {
      if (rafRef.current === null && !disposed) rafRef.current = requestAnimationFrame(loop);
    };

    const snapToState = () => {
      // Reduced motion: no flight, just the end state.
      const sim = simRef.current;
      if (!sim) return;
      const active = activeRef.current;
      for (let i = 0; i < sim.n; i++) {
        sim.x[i] = active ? sim.tx[i] : sim.rx[i];
        sim.y[i] = active ? sim.ty[i] : sim.ry[i];
        sim.vx[i] = 0; sim.vy[i] = 0; sim.s[i] = active ? 1 : 0;
      }
      draw();
    };

    const rebuild = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      simRef.current = buildSim(text, w, h, fontWeight, resolveFont(), simRef.current ?? undefined);
      if (reducedRef.current) snapToState(); else kick();
    };

    // Wait for the web font, otherwise the word is sampled in a fallback face.
    const ready = (document.fonts?.load(`${fontWeight} 40px ${resolveFont()}`).catch(() => undefined) ?? Promise.resolve())
      .then(() => document.fonts?.ready ?? undefined);
    ready.then(() => { if (!disposed) rebuild(); });

    const ro = new ResizeObserver(() => rebuild());
    ro.observe(parent);

    // Expose a re-kick for the isActive effect below.
    (canvas as any).__kick = () => (reducedRef.current ? snapToState() : kick());

    return () => {
      disposed = true;
      ro.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [text, fontWeight, grain]);

  // Re-stamp the lift-off clock when the word changes while active, so a new
  // title still rises bottom-row-first instead of all at once.
  useEffect(() => {
    activeRef.current = isActive;
    if (isActive) activatedAtRef.current = performance.now();
    const canvas = canvasRef.current as (HTMLCanvasElement & { __kick?: () => void }) | null;
    canvas?.__kick?.();
  }, [isActive, text]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
    />
  );
};

export default ParticleText;
