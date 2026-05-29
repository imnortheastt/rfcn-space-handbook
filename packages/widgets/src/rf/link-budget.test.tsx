import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LinkBudget } from './link-budget';

describe('LinkBudget', () => {
  it('renders without crashing', () => {
    const { getByRole } = render(<LinkBudget />);
    expect(getByRole('region', { name: /link budget calculator/i })).toBeTruthy();
  });

  it('has accessible labeled inputs', () => {
    const { getByLabelText } = render(<LinkBudget />);
    expect(getByLabelText(/EIRP/i)).toBeTruthy();
    expect(getByLabelText(/G\/T/i)).toBeTruthy();
    expect(getByLabelText(/Path Loss/i)).toBeTruthy();
  });

  it('updates results when EIRP input changes', () => {
    const { getByLabelText, getByRole } = render(<LinkBudget targetCnr={10} />);
    const eirpInput = getByLabelText(/EIRP/i);
    const output = getByRole('status');
    const before = output.textContent;
    fireEvent.change(eirpInput, { target: { value: '60' } });
    expect(output.textContent).not.toBe(before);
  });
});
