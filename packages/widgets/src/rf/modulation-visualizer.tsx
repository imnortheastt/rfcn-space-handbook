import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../shared/use-reduced-motion';

type Scheme = 'BPSK' | 'QPSK' | '16QAM' | '64QAM';

/** Ideal constellation points for each modulation scheme (I, Q pairs) */
const CONSTELLATIONS: Record<Scheme, [number, number][]> = {
  BPSK: [[-1, 0], [1, 0]],
  QPSK: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  '16QAM': Array.from({ length: 16 }, (_, i) => {
    const re = (i % 4) * 2 - 3;
    const im = Math.floor(i / 4) * 2 - 3;
    return [re / 3, im / 3] as [number, number];
  }),
  '64QAM': Array.from({ length: 64 }, (_, i) => {
    const re = (i % 8) * 2 - 7;
    const im = Math.floor(i / 8) * 2 - 7;
    return [re / 7, im / 7] as [number, number];
  }),
};

const SCATTER_COUNT = 120;
const CANVAS_SIZE = 280;
const HALF = CANVAS_SIZE / 2;
const SCALE = 110;

function drawConstellation(
  ctx: CanvasRenderingContext2D,
  scheme: Scheme,
  snrDb: number,
  prefersReduced: boolean,
) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Grid axes
  ctx.strokeStyle = 'rgba(128,128,128,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(HALF, 0); ctx.lineTo(HALF, CANVAS_SIZE);
  ctx.moveTo(0, HALF); ctx.lineTo(CANVAS_SIZE, HALF);
  ctx.stroke();

  // Noise sigma derived from SNR (linear): sigma = 1 / sqrt(2 * 10^(SNR/10))
  const snrLinear = Math.pow(10, snrDb / 10);
  const sigma = 1 / Math.sqrt(2 * snrLinear);

  const points = CONSTELLATIONS[scheme];

  // Noise scatter (skip heavy drawing in reduced-motion)
  const scatterCount = prefersReduced ? 20 : SCATTER_COUNT;

  ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
  for (let i = 0; i < scatterCount; i++) {
    const [ix, iy] = points[i % points.length]!;
    // Box-Muller for Gaussian noise
    const u = Math.random() || 1e-10;
    const v = Math.random();
    const nx = sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    const ny = sigma * Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
    const cx = HALF + (ix + nx) * SCALE;
    const cy = HALF - (iy + ny) * SCALE;
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Ideal symbol points
  ctx.fillStyle = 'rgb(239, 68, 68)';
  for (const [ix, iy] of points) {
    const cx = HALF + ix * SCALE;
    const cy = HALF - iy * SCALE;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export interface ModulationVisualizerProps {
  /** Initial modulation scheme */
  defaultScheme?: Scheme;
}

/**
 * Constellation diagram for common digital modulation schemes.
 * Noise scatter is derived from SNR via Gaussian model.
 *
 * @experimental Noise model is illustrative, not validated against channel simulators.
 * Use `client:visible` in Astro, never `client:load`.
 */
export function ModulationVisualizer({ defaultScheme = 'QPSK' }: ModulationVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scheme, setScheme] = useState<Scheme>(defaultScheme);
  const [snr, setSnr] = useState(15);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawConstellation(ctx, scheme, snr, prefersReduced);
  }, [scheme, snr, prefersReduced]);

  const schemes: Scheme[] = ['BPSK', 'QPSK', '16QAM', '64QAM'];

  return (
    <figure aria-label="Modulation constellation visualizer" style={{ margin: 0 }}>
      <div role="group" aria-label="Modulation scheme">
        {schemes.map((s) => (
          <label key={s} style={{ marginRight: '0.75rem' }}>
            <input
              type="radio"
              name="mod-scheme"
              value={s}
              checked={scheme === s}
              onChange={() => setScheme(s)}
            />{' '}
            {s}
          </label>
        ))}
      </div>

      <label htmlFor="mod-snr" style={{ display: 'block', marginTop: '0.5rem' }}>
        SNR: {snr} dB
      </label>
      <input
        id="mod-snr"
        type="range"
        min={0}
        max={30}
        step={1}
        value={snr}
        onChange={(e) => setSnr(Number(e.target.value))}
        aria-label={`SNR ${snr} dB`}
      />

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${scheme} constellation at ${snr} dB SNR`}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ display: 'block', marginTop: '0.5rem', maxWidth: '100%' }}
      />
      <figcaption>
        {scheme} constellation diagram — SNR {snr} dB. Red dots: ideal symbols. Blue scatter: noise.
      </figcaption>
    </figure>
  );
}
