import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../shared/use-reduced-motion';

export interface PolarPlotProps {
  /** Radial data values (one per spoke) */
  data: number[];
  /** If true, uses a radial (spider/radar) layout; defaults to true */
  radial?: boolean;
  /** Accessible label for the chart */
  ariaLabel?: string;
}

const WIDTH = 300;
const HEIGHT = 300;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 120;

/**
 * Draws a polar/radar plot using D3. D3 is imported dynamically to avoid
 * SSR issues and keep the initial JS payload small. The SVG scaffold renders
 * server-side; D3 fills in the paths client-side after hydration.
 */
export function PolarPlot({ data, radial = true, ariaLabel = 'Polar plot' }: PolarPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    let cancelled = false;

    async function render() {
      const d3 = await import('d3');
      if (cancelled || !svgRef.current) return;

      const svg = d3.select(svgRef.current);
      // Clear previous render
      svg.selectAll('.polar-content').remove();

      const g = svg
        .append('g')
        .attr('class', 'polar-content')
        .attr('transform', `translate(${CX},${CY})`);

      const n = data.length;
      const maxVal = Math.max(...data, 1);
      const angleStep = (2 * Math.PI) / n;

      // Draw grid rings
      const rings = 4;
      for (let r = 1; r <= rings; r++) {
        const ringRadius = (RADIUS * r) / rings;
        g.append('circle')
          .attr('r', ringRadius)
          .attr('fill', 'none')
          .attr('stroke', 'currentColor')
          .attr('stroke-opacity', 0.15)
          .attr('stroke-width', 1);
      }

      // Draw spokes
      for (let i = 0; i < n; i++) {
        const angle = i * angleStep - Math.PI / 2;
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', Math.cos(angle) * RADIUS)
          .attr('y2', Math.sin(angle) * RADIUS)
          .attr('stroke', 'currentColor')
          .attr('stroke-opacity', 0.2)
          .attr('stroke-width', 1);
      }

      if (radial) {
        // Build closed polygon for radar chart
        const points = data.map((v, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = (v / maxVal) * RADIUS;
          return [Math.cos(angle) * r, Math.sin(angle) * r] as [number, number];
        });
        // Close the path
        points.push(points[0]!);

        const lineGen = d3
          .line<[number, number]>()
          .x((d) => d[0])
          .y((d) => d[1]);

        if (!prefersReduced) {
          // Animated fill — skip when reduced motion is requested
          g.append('path')
            .datum(points)
            .attr('d', lineGen)
            .attr('fill', 'var(--color-accent-500, #0b5351)')
            .attr('fill-opacity', 0.2)
            .attr('stroke', 'var(--color-accent-500, #0b5351)')
            .attr('stroke-width', 2)
            .attr('stroke-linejoin', 'round');
        } else {
          // Static frame: skip animation, just draw immediately
          g.append('path')
            .datum(points)
            .attr('d', lineGen)
            .attr('fill', 'var(--color-accent-500, #0b5351)')
            .attr('fill-opacity', 0.15)
            .attr('stroke', 'var(--color-accent-500, #0b5351)')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round');
        }

        // Data points
        data.forEach((v, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = (v / maxVal) * RADIUS;
          g.append('circle')
            .attr('cx', Math.cos(angle) * r)
            .attr('cy', Math.sin(angle) * r)
            .attr('r', 4)
            .attr('fill', 'var(--color-accent-500, #0b5351)');
        });
      }

      setReady(true);
    }

    render().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [data, radial, prefersReduced]);

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={ariaLabel}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ display: 'block', maxWidth: '100%' }}
      data-ready={ready ? 'true' : 'false'}
    >
      <title>{ariaLabel}</title>
    </svg>
  );
}
