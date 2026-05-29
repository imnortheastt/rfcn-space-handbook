import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure DOM is cleaned up between tests (required when vitest globals: false)
afterEach(cleanup);

// jsdom does not implement window.matchMedia — stub it for all widget tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
