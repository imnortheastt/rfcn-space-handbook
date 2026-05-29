import { useEffect, useRef, useState } from 'react';

type Lane = 'UE' | 'gNB' | 'AMF' | 'SMF' | 'UPF';
type Step = { from: Lane; to: Lane; label: string };

type Scenario = 'initial-registration' | 'handover' | 'pdu-session-establishment';

const SCENARIOS: Record<Scenario, Step[]> = {
  'initial-registration': [
    { from: 'UE', to: 'gNB', label: 'RRC Setup Request' },
    { from: 'gNB', to: 'AMF', label: 'N2 Initial UE Message' },
    { from: 'AMF', to: 'UE', label: 'Authentication Request' },
    { from: 'UE', to: 'AMF', label: 'Authentication Response' },
    { from: 'AMF', to: 'UE', label: 'Security Mode Command' },
    { from: 'UE', to: 'AMF', label: 'Security Mode Complete' },
    { from: 'AMF', to: 'gNB', label: 'Initial Context Setup' },
    { from: 'gNB', to: 'UE', label: 'RRC Reconfiguration' },
  ],
  'handover': [
    { from: 'gNB', to: 'AMF', label: 'Handover Required' },
    { from: 'AMF', to: 'gNB', label: 'Handover Command' },
    { from: 'UE', to: 'gNB', label: 'RRC Handover Complete' },
    { from: 'gNB', to: 'AMF', label: 'Handover Notify' },
    { from: 'AMF', to: 'SMF', label: 'N11 Update Session' },
    { from: 'SMF', to: 'UPF', label: 'N4 Modify Bearer' },
  ],
  'pdu-session-establishment': [
    { from: 'UE', to: 'AMF', label: 'PDU Session Establishment Req' },
    { from: 'AMF', to: 'SMF', label: 'N11 Create SM Context' },
    { from: 'SMF', to: 'UPF', label: 'N4 Session Establishment' },
    { from: 'UPF', to: 'SMF', label: 'N4 Session Response' },
    { from: 'SMF', to: 'AMF', label: 'N11 SM Context Response' },
    { from: 'AMF', to: 'gNB', label: 'PDU Session Resource Setup' },
    { from: 'gNB', to: 'UE', label: 'PDU Session Accept' },
  ],
};

const LANES: Lane[] = ['UE', 'gNB', 'AMF', 'SMF', 'UPF'];
const LANE_X: Record<Lane, number> = { UE: 50, gNB: 150, AMF: 250, SMF: 350, UPF: 450 };
const SVG_W = 510;
const HEADER_Y = 30;
const STEP_H = 45;

/**
 * 5G call flow sequence diagram with keyboard step navigation.
 *
 * @experimental Message sequence is illustrative, not exhaustive per 3GPP TS 23.502.
 * Use `client:visible` in Astro, never `client:load`.
 */
export function FiveGCallFlow() {
  const [scenario, setScenario] = useState<Scenario>('initial-registration');
  const [stepIdx, setStepIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = SCENARIOS[scenario];
  const svgH = HEADER_Y + steps.length * STEP_H + 20;

  useEffect(() => {
    setStepIdx(0);
  }, [scenario]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') setStepIdx((i) => Math.min(i + 1, steps.length - 1));
    if (e.key === 'ArrowLeft') setStepIdx((i) => Math.max(i - 1, 0));
  }

  return (
    <section aria-labelledby="callflow-title">
      <h3 id="callflow-title">5G Call Flow</h3>

      <div role="group" aria-label="Scenario">
        {(Object.keys(SCENARIOS) as Scenario[]).map((s) => (
          <label key={s} style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              name="callflow-scenario"
              value={s}
              checked={scenario === s}
              onChange={() => setScenario(s)}
            />{' '}
            {s.replace(/-/g, ' ')}
          </label>
        ))}
      </div>

      <p style={{ fontSize: '0.85em', color: 'gray' }}>
        Step {stepIdx + 1} of {steps.length} — use ← → arrow keys to navigate
      </p>

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKey}
        aria-label="Call flow diagram — use arrow keys to step through messages"
        style={{ outline: 'none', cursor: 'default' }}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${svgH}`}
          aria-hidden="true"
          style={{ maxWidth: SVG_W, display: 'block' }}
        >
          {/* Lane headers */}
          {LANES.map((lane) => (
            <g key={lane}>
              <text
                x={LANE_X[lane]}
                y={HEADER_Y}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                fill="currentColor"
              >
                {lane}
              </text>
              <line
                x1={LANE_X[lane]}
                y1={HEADER_Y + 8}
                x2={LANE_X[lane]}
                y2={svgH - 10}
                stroke="currentColor"
                strokeOpacity={0.2}
                strokeDasharray="4 3"
              />
            </g>
          ))}

          {/* Message arrows */}
          {steps.map((step, i) => {
            const y = HEADER_Y + 20 + i * STEP_H;
            const x1 = LANE_X[step.from];
            const x2 = LANE_X[step.to];
            const isActive = i === stepIdx;
            const isPast = i < stepIdx;
            const color = isActive ? '#f59e0b' : isPast ? '#6b7280' : 'currentColor';
            const opacity = isActive ? 1 : isPast ? 0.5 : 0.25;
            const dir = x2 > x1 ? 1 : -1;
            const arrowX = x2 - dir * 8;

            return (
              <g
                key={i}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${step.from} to ${step.to}: ${step.label}`}
              >
                <line
                  x1={x1}
                  y1={y}
                  x2={arrowX}
                  y2={y}
                  stroke={color}
                  strokeOpacity={opacity}
                  strokeWidth={isActive ? 2 : 1}
                  markerEnd={`url(#arrow-${isActive ? 'active' : 'default'})`}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill={color}
                  fillOpacity={opacity}
                >
                  {step.label}
                </text>
              </g>
            );
          })}

          <defs>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={() => setStepIdx((i) => Math.max(i - 1, 0))} disabled={stepIdx === 0}>
          ← Prev
        </button>{' '}
        <button onClick={() => setStepIdx((i) => Math.min(i + 1, steps.length - 1))} disabled={stepIdx === steps.length - 1}>
          Next →
        </button>
      </div>
    </section>
  );
}
