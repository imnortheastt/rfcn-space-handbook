import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FiveGCallFlow } from './five-g-call-flow';

describe('FiveGCallFlow', () => {
  it('renders without crashing and shows section title', () => {
    const { getByRole } = render(<FiveGCallFlow />);
    expect(getByRole('region', { name: /5G Call Flow/i })).toBeTruthy();
  });

  it('has scenario radio buttons with accessible labels', () => {
    const { getByRole } = render(<FiveGCallFlow />);
    expect(getByRole('radio', { name: /initial registration/i })).toBeTruthy();
    expect(getByRole('radio', { name: /handover/i })).toBeTruthy();
    expect(getByRole('radio', { name: /pdu session/i })).toBeTruthy();
  });

  it('advances step on Next button click', () => {
    const { getByText, getByRole } = render(<FiveGCallFlow />);
    expect(getByText(/Step 1 of/i)).toBeTruthy();
    fireEvent.click(getByRole('button', { name: /next/i }));
    expect(getByText(/Step 2 of/i)).toBeTruthy();
  });
});
