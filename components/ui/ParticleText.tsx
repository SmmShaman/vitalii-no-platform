'use client'

import { useEffect, useRef } from 'react';

/**
 * Dust-text effect, plain Canvas 2D, no libraries.
 *
 * At rest nothing is drawn: the hero text is ordinary text. When `isActive`
 * turns on, grains appear on the pixels of that text (the parent's text nodes
 * are sampled), burst into a drifting cloud of dust, then gather into the
 * pixels of `text`. When it turns off the word bursts back into the cloud, the
 * dust drifts home onto the hero text and fades out.
 *
 * Mount it as an absolutely positioned overlay inside the block that holds the
 * hero text: the canvas fills the parent and ignores pointer events.
 */
interface ParticleTextProps {
  text: string;
  color: string;       // grain colour
  isActive: boolean;
  grain?: number;      // grain size in CSS px (2 = sand)
  fontWeight?: number;
  className?: string;
}

const STEP = 2;               // sampling step over the rasterised word (CSS px)
const MAX_GRAINS = 7000;      // hard cap: the sampling step grows until we fit
const CLOUD_TIME = 0.42;      // seconds the dust drifts as a cloud before it gathers
const RISE_STAGGER = 0.45;    // extra seconds between the first and the last row settling
const FADE_IN = 0.09;         // alpha gain per frame when the dust appears
const FADE_OUT = 0.035;       // alpha loss per frame once the dust heads home

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
  sx: Float32Array; sy: Float32Array;   // home: pixels of the hero text
  delay: Float32Array;                  // per-grain settle delay (s)
  seed: Float32Array;                   // per-grain phase for the drift noise
  s: Float32Array;                      // 0 = invisible at home … 1 = fully visible
  w: number; h: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const v = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function collectPixels(img: Uint8ClampedArray, w: number, h: number, cap: number): Float32Array {
  let step = STEP;
  let pts: number[] = [];
  for (;;) {
    pts = [];
    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        if (img[(py * w + px) * 4 + 3] > 128) pts.push(px, py);
      }
    }
    if (pts.length / 2 <= cap || step > 6) break;
    step += 1;
  }
  return Float32Array.from(pts);
}

/** Rasterise the word (left-aligned, vertically centred, fitted to the box). */
function sampleWord(text: string, w: number, h: number, fontWeight: number, font: string): Float32Array {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.floor(w));
  off.height = Math.max(1, Math.floor(h));
  const ctx = off.getContext('2d', { willReadFrequently: true })!;
  let size = Math.floor(h * 0.8);
  ctx.font = `${fontWeight} ${size}px ${font}`;
  const width = ctx.measureText(text).width;
  if (width > w * 0.98) size = Math.floor((size * w * 0.98) / width);
  ctx.font = `${fontWeight} ${size}px ${font}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, 0, h / 2);
  return collectPixels(ctx.getImageData(0, 0, off.width, off.height).data, off.width, off.height, MAX_GRAINS);
}

/**
 * Rasterise the hero text that lives next to the canvas: every visible text
 * node of `root` is redrawn on an offscreen canvas at its own on-screen
 * rectangle, with its own computed font. Those pixels are where the dust comes
 * from and where it goes back to.
 */
function sampleHome(root: HTMLElement, w: number, h: number): Float32Array {
  const off = document.createElement('canvas');
  off.width = Math.max(1, Math.floor(w));
  off.height = Math.max(1, Math.floor(h));
  const ctx = off.getContext('2d', { willReadFrequently: true })!;
  const origin = root.getBoundingClientRect();
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const el = node.parentElement;
      if (!el || !node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      if (el.tagName === 'CANVAS' || el.closest('[aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement!;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects());
    if (!rects.length) continue;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const px = parseFloat(cs.fontSize) || 16;
    const content = node.textContent!.replace(/\s+/g, ' ');
    if (rects.length === 1) {
      const r = rects[0];
      // Baseline sits roughly 0.8 em below the top of the glyph box.
      ctx.fillText(content.trim(), r.left - origin.left, r.top - origin.top + (r.height - px) / 2 + px * 0.8);
    } else {
      // Wrapped text: paint a filled band per line so the dust still comes from the words.
      for (const r of rects) ctx.fillRect(r.left - origin.left, r.top - origin.top + (r.height - px) / 2 + px * 0.15, r.width, px * 0.7);
    }
  }
  return collectPixels(ctx.getImageData(0, 0, off.width, off.height).data, off.width, off.height, MAX_GRAINS * 4);
}

function buildSim(root: HTMLElement, text: string, w: number, h: number, fontWeight: number, font: string, prev?: Sim): Sim {
  const word = sampleWord(text, w, h, fontWeight, font);
  let home = sampleHome(root, w, h);
  if (home.length < 2) home = Float32Array.from([w * 0.5, h * 0.5]);

  const n = word.length / 2;
  const F = () => new Float32Array(n);
  const sim: Sim = { n, x: F(), y: F(), vx: F(), vy: F(), tx: F(), ty: F(), sx: F(), sy: F(), delay: F(), seed: F(), s: F(), w, h };

  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    sim.tx[i] = word[i * 2] + Math.random() * 0.6 - 0.3;
    sim.ty[i] = word[i * 2 + 1] + Math.random() * 0.6 - 0.3;
    if (sim.ty[i] < minY) minY = sim.ty[i];
    if (sim.ty[i] > maxY) maxY = sim.ty[i];
  }
  const range = Math.max(1, maxY - minY);
  const homeCount = home.length / 2;

  for (let i = 0; i < n; i++) {
    // Each grain is born on a random pixel of the hero text.
    const j = Math.floor(Math.random() * homeCount) * 2;
    sim.sx[i] = home[j] + Math.random() - 0.5;
    sim.sy[i] = home[j + 1] + Math.random() - 0.5;
    // Bottom rows of the word settle first; jitter keeps it from looking like a scan line.
    const rowFromBottom = 1 - (sim.ty[i] - minY) / range;
    sim.delay[i] = (1 - rowFromBottom) * RISE_STAGGER + Math.random() * 0.15;
    sim.seed[i] = Math.random() * Math.PI * 2;

    if (prev && i < prev.n) {
      // Keep positions across a resize or a word change so the dust does not jump.
      sim.x[i] = Math.min(w, prev.x[i]); sim.y[i] = Math.min(h - 1, prev.y[i]);
      sim.vx[i] = prev.vx[i]; sim.vy[i] = prev.vy[i]; sim.s[i] = prev.s[i];
    } else {
      sim.x[i] = sim.sx[i]; sim.y[i] = sim.sy[i];
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
  const switchedAtRef = useRef(0);      // when isActive last flipped
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
      // Alpha buckets keep fillStyle changes (the expensive part) to a handful per frame.
      const BUCKETS = 6;
      for (let k = 1; k < BUCKETS; k++) {
        const a = k / (BUCKETS - 1);
        ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
        for (let i = 0; i < sim.n; i++) {
          if (Math.round(sim.s[i] * (BUCKETS - 1)) !== k) continue;
          ctx.fillRect(sim.x[i], sim.y[i], grain, grain);
        }
      }
    };

    /** Give every grain a puff of random velocity: the text/word bursts into dust. */
    const burst = (strength: number) => {
      const sim = simRef.current;
      if (!sim) return;
      for (let i = 0; i < sim.n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = strength * (0.4 + Math.random());
        sim.vx[i] += Math.cos(ang) * sp;
        sim.vy[i] += Math.sin(ang) * sp - strength * 0.25; // slight lift, dust rises a little
      }
    };

    const step = (dt: number, now: number) => {
      const sim = simRef.current;
      if (!sim) return false;
      const active = activeRef.current;
      const since = (now - switchedAtRef.current) / 1000;
      let moving = false;
      const k = dt * 60; // normalise to a 60 fps step
      const t = now * 0.001;

      for (let i = 0; i < sim.n; i++) {
        const cloud = since < CLOUD_TIME + (active ? sim.delay[i] : sim.delay[i] * 0.4);
        const tx = active ? sim.tx[i] : sim.sx[i];
        const ty = active ? sim.ty[i] : sim.sy[i];
        const dx = tx - sim.x[i];
        const dy = ty - sim.y[i];

        if (cloud) {
          // Drifting dust: damped velocity plus slow swirling noise, no target yet.
          const sw = sim.seed[i];
          sim.vx[i] = sim.vx[i] * Math.pow(0.93, k) + Math.sin(t * 2.1 + sw) * 0.08 * k;
          sim.vy[i] = sim.vy[i] * Math.pow(0.93, k) + Math.cos(t * 1.7 + sw * 1.3) * 0.08 * k;
          sim.x[i] += sim.vx[i] * k;
          sim.y[i] += sim.vy[i] * k;
          // Keep the cloud inside the box.
          if (sim.x[i] < 0) { sim.x[i] = 0; sim.vx[i] = Math.abs(sim.vx[i]); }
          if (sim.x[i] > w) { sim.x[i] = w; sim.vx[i] = -Math.abs(sim.vx[i]); }
          if (sim.y[i] < 0) { sim.y[i] = 0; sim.vy[i] = Math.abs(sim.vy[i]); }
          if (sim.y[i] > h - 1) { sim.y[i] = h - 1; sim.vy[i] = -Math.abs(sim.vy[i]); }
          sim.s[i] = Math.min(1, sim.s[i] + FADE_IN * k);
          moving = true;
        } else {
          // Spring flight to the word (active) or home onto the hero text (inactive).
          sim.vx[i] = (sim.vx[i] + dx * 0.05 * k) * Math.pow(0.78, k);
          sim.vy[i] = (sim.vy[i] + dy * 0.05 * k) * Math.pow(0.78, k);
          sim.x[i] += sim.vx[i] * k;
          sim.y[i] += sim.vy[i] * k;
          if (active) {
            sim.s[i] = Math.min(1, sim.s[i] + FADE_IN * k);
          } else {
            // Fade out as the grain gets close to its home pixel.
            const near = Math.abs(dx) + Math.abs(dy) < 6;
            sim.s[i] = Math.max(0, sim.s[i] - (near ? FADE_OUT * 2 : FADE_OUT) * k);
          }
          if (Math.abs(sim.vx[i]) > 0.02 || Math.abs(sim.vy[i]) > 0.02 || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || (!active && sim.s[i] > 0)) moving = true;
        }
      }
      return moving;
    };

    const loop = (ts: number) => {
      rafRef.current = null;
      if (disposed) return;
      // Fixed 60 Hz substeps so the flight takes the same wall-clock time at any frame rate.
      const elapsed = Math.min(0.25, lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 1 / 60);
      lastTsRef.current = ts;
      const SUB = 1 / 60;
      let moving = false;
      let acc = elapsed;
      do { moving = step(SUB, ts); acc -= SUB; } while (acc >= SUB);
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
        sim.x[i] = active ? sim.tx[i] : sim.sx[i];
        sim.y[i] = active ? sim.ty[i] : sim.sy[i];
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
      simRef.current = buildSim(parent, text, w, h, fontWeight, resolveFont(), simRef.current ?? undefined);
      if (reducedRef.current) snapToState(); else kick();
    };

    // Wait for the web font, otherwise the word is sampled in a fallback face.
    const ready = (document.fonts?.load(`${fontWeight} 40px ${resolveFont()}`).catch(() => undefined) ?? Promise.resolve())
      .then(() => document.fonts?.ready ?? undefined);
    ready.then(() => { if (!disposed) rebuild(); });

    const ro = new ResizeObserver(() => rebuild());
    ro.observe(parent);

    // Expose the transition hook for the isActive effect below.
    (canvas as any).__switch = (active: boolean) => {
      if (reducedRef.current) { snapToState(); return; }
      burst(active ? 2.2 : 1.6);
      kick();
    };

    return () => {
      disposed = true;
      ro.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [text, fontWeight, grain]);

  useEffect(() => {
    const flipped = activeRef.current !== isActive;
    activeRef.current = isActive;
    switchedAtRef.current = performance.now();
    const canvas = canvasRef.current as (HTMLCanvasElement & { __switch?: (a: boolean) => void }) | null;
    // A word change while active (tile to tile) re-bursts too, so the new title gathers from a cloud.
    if (flipped || isActive) canvas?.__switch?.(isActive);
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
