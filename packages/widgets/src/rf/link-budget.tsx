import { useState } from 'react';

export interface LinkBudgetProps {
  /** Target CNR threshold in dB; margin computed against this */
  targetCnr?: number;
}

interface LinkState {
  eirp: number;      // dBW
  gT: number;        // dB/K
  pathLoss: number;  // dB
  atmoLoss: number;  // dB
  bandwidth: number; // Hz
}

const K_DB = -228.6; // Boltzmann constant in dBW/Hz/K

/**
 * Link budget calculator using the standard carrier-to-noise ratio equation.
 *
 * CNR = EIRP + G/T - PathLoss - AtmoLoss - K - 10·log10(BW)
 *
 * @experimental Physics is placeholder — not validated against ITU-R standards.
 * Use `client:visible` in Astro, never `client:load`.
 */
export function LinkBudget({ targetCnr = 10 }: LinkBudgetProps) {
  const [state, setState] = useState<LinkState>({
    eirp: 50,
    gT: 20,
    pathLoss: 200,
    atmoLoss: 2,
    bandwidth: 36e6,
  });

  function set(field: keyof LinkState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val)) setState((s) => ({ ...s, [field]: val }));
    };
  }

  const bwLog = 10 * Math.log10(Math.max(state.bandwidth, 1));
  const cnr = state.eirp + state.gT - state.pathLoss - state.atmoLoss - K_DB - bwLog;
  // Placeholder Eb/N0 — spectral efficiency approximation
  const ebN0 = cnr - 10 * Math.log10(Math.max(state.bandwidth / 1e6, 1));
  const margin = cnr - targetCnr;

  const fmt = (n: number) => n.toFixed(2);

  return (
    <section aria-labelledby="lb-title" style={{ fontFamily: 'inherit' }}>
      <h3 id="lb-title">Link Budget Calculator</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="lb-eirp">EIRP (dBW)</label>
        <input id="lb-eirp" type="number" step="0.1" value={state.eirp} onChange={set('eirp')} />

        <label htmlFor="lb-gt">G/T (dB/K)</label>
        <input id="lb-gt" type="number" step="0.1" value={state.gT} onChange={set('gT')} />

        <label htmlFor="lb-path">Path Loss (dB)</label>
        <input id="lb-path" type="number" step="0.1" value={state.pathLoss} onChange={set('pathLoss')} />

        <label htmlFor="lb-atmo">Atmospheric Loss (dB)</label>
        <input id="lb-atmo" type="number" step="0.1" value={state.atmoLoss} onChange={set('atmoLoss')} />

        <label htmlFor="lb-bw">Bandwidth (Hz)</label>
        <input id="lb-bw" type="number" step="1000" value={state.bandwidth} onChange={set('bandwidth')} />
      </form>

      <output aria-live="polite" aria-label="Link budget results">
        <dl>
          <dt>CNR</dt><dd>{fmt(cnr)} dB</dd>
          <dt>Eb/N0</dt><dd>{fmt(ebN0)} dB</dd>
          <dt>Link Margin</dt><dd>{fmt(margin)} dB {margin >= 0 ? '✓' : '✗'}</dd>
        </dl>
      </output>
    </section>
  );
}
