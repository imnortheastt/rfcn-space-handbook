import { useEffect, useState } from 'react';

/**
 * Returns true when the user has requested reduced motion via OS/browser settings.
 * SSR-safe: returns false on the server (no window available).
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    // Guard: window is undefined in SSR / Node environments
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    // Use addEventListener for modern browsers; addListener is deprecated
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      mq.addListener(handler);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      return () => mq.removeListener(handler);
    }
  }, []);

  return prefersReduced;
}
