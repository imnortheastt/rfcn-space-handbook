import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { ModulationVisualizer } from './modulation-visualizer';

// jsdom does not implement canvas.getContext — stub it to avoid "not implemented" errors
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
});

describe('ModulationVisualizer', () => {
  it('renders canvas with accessible label', () => {
    render(<ModulationVisualizer />);
    expect(screen.getByRole('img', { name: /QPSK constellation/i })).toBeTruthy();
  });

  it('has scheme radio buttons', () => {
    render(<ModulationVisualizer />);
    expect(screen.getByRole('radio', { name: 'BPSK' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: '16QAM' })).toBeTruthy();
  });

  it('updates aria-label when scheme changes', () => {
    const { getByRole } = render(<ModulationVisualizer />);
    fireEvent.click(getByRole('radio', { name: 'BPSK' }));
    expect(getByRole('img', { name: /BPSK constellation/i })).toBeTruthy();
  });
});
