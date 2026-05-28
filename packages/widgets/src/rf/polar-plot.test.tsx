import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PolarPlot } from './polar-plot';

describe('PolarPlot', () => {
  it('renders an SVG element with sample data', () => {
    const { container } = render(<PolarPlot data={[1, 2, 3]} ariaLabel="Test polar plot" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('renders a <title> element for accessibility', () => {
    const { container } = render(<PolarPlot data={[1, 2, 3]} ariaLabel="RF channel plot" />);
    const title = container.querySelector('title');
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe('RF channel plot');
  });

  it('renders with role="img" on the svg', () => {
    const { container } = render(<PolarPlot data={[4, 5, 6]} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
  });
});
