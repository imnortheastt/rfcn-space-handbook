import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Citation registry context — collects cited IDs in order of first appearance
// Used only in client-hydrated contexts (not the default lesson rendering path).
// ---------------------------------------------------------------------------

export interface CitationRegistryContextValue {
  /** Register a citation ID and return its 1-based appearance index */
  register: (id: string) => number;
}

export const CitationRegistryContext = createContext<CitationRegistryContextValue | null>(null);

/**
 * Provider that tracks which citation IDs have been rendered and in what order.
 * Wrap lesson content in this to enable ordered bibliography rendering.
 */
export function CitationRegistry({ children }: { children: ReactNode }) {
  const order = useRef<string[]>([]);

  const register = (id: string): number => {
    const existing = order.current.indexOf(id);
    if (existing !== -1) return existing + 1;
    order.current.push(id);
    return order.current.length;
  };

  return (
    <CitationRegistryContext.Provider value={{ register }}>
      {children}
    </CitationRegistryContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// <Cite> component — context-based (fallback / legacy path)
// ---------------------------------------------------------------------------

export interface CiteProps {
  /** Citation ID matching a key in the citations DB */
  id: string;
}

/**
 * Inline citation marker. Renders <sup><a href="#cite-{id}">[n]</a></sup>
 * where n is the order-of-first-appearance index within the current page.
 *
 * Must be used inside a <CitationRegistry> provider (or BibliographyCollector).
 * Falls back to rendering the raw ID in square brackets if no registry is found.
 */
export function Cite({ id }: CiteProps) {
  const registry = useContext(CitationRegistryContext);

  // Stable index: register on first render. In SSR this runs synchronously.
  const indexRef = useRef<number | null>(null);
  if (indexRef.current === null) {
    indexRef.current = registry ? registry.register(id) : 0;
  }
  const n = indexRef.current;

  // Keep registry in sync if id changes (edge case — MDX hot-reload)
  useEffect(() => {
    if (registry) {
      indexRef.current = registry.register(id);
    }
  }, [id, registry]);

  const label = registry ? `[${n}]` : `[${id}]`;

  return (
    <sup>
      <a href={`#cite-${id}`} aria-label={`Citation ${label}`}>
        {label}
      </a>
    </sup>
  );
}

// ---------------------------------------------------------------------------
// <CiteResolved> — pure SSR component, no hooks, no context
// Receives pre-computed citation number injected at build time by the lesson
// route. This is the default rendering path for lesson pages.
// ---------------------------------------------------------------------------

export interface CiteResolvedProps {
  /** Citation ID matching a key in the citations DB */
  id: string;
  /** Pre-resolved 1-based order-of-first-appearance index for this page */
  n: number;
}

/**
 * Pure SSR citation marker. Requires `n` to be injected at build time.
 * Used via the MDX `components` override in the lesson route so no client
 * JavaScript or React context is needed.
 */
export function CiteResolved({ id, n }: CiteResolvedProps) {
  return (
    <sup>
      <a href={`#cite-${id}`} aria-label={`Citation [${n}]`}>
        [{n}]
      </a>
    </sup>
  );
}
