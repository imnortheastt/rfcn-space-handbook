import { describe, it, expect } from 'vitest';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { unified } from 'unified';
import { remarkGlossaryAutoLink, lookupTerm, type GlossaryData } from './index';

// ---------------------------------------------------------------------------
// Inline fixture — no disk I/O needed for tests
// ---------------------------------------------------------------------------

const FIXTURE_GLOSSARY: GlossaryData = [
  {
    en: 'OFDM',
    vi: 'OFDM',
    definition_en: 'Orthogonal Frequency-Division Multiplexing',
    definition_vi: 'Ghép kênh phân chia theo tần số trực giao',
  },
  {
    en: 'subcarrier',
    vi: 'sóng mang con',
    definition_en: 'An individual frequency carrier within an OFDM signal',
    definition_vi: 'Sóng mang tần số riêng lẻ trong tín hiệu OFDM',
  },
];

// ---------------------------------------------------------------------------
// lookupTerm
// ---------------------------------------------------------------------------

describe('lookupTerm', () => {
  it('finds an English term case-insensitively', () => {
    const result = lookupTerm('ofdm', 'en', FIXTURE_GLOSSARY);
    expect(result).toBeDefined();
    expect(result?.en).toBe('OFDM');
  });

  it('returns undefined for unknown term', () => {
    expect(lookupTerm('MIMO', 'en', FIXTURE_GLOSSARY)).toBeUndefined();
  });

  it('finds Vietnamese term', () => {
    const result = lookupTerm('sóng mang con', 'vi', FIXTURE_GLOSSARY);
    expect(result).toBeDefined();
    expect(result?.en).toBe('subcarrier');
  });
});

// ---------------------------------------------------------------------------
// remarkGlossaryAutoLink (with mock glossaryPath via a patched loader)
// ---------------------------------------------------------------------------

describe('remarkGlossaryAutoLink', () => {
  it('wraps first occurrence of a known term in an mdxJsxTextElement', () => {
    // Build a minimal MDAST with a paragraph containing "OFDM"
    const tree = fromMarkdown('OFDM is used in LTE. OFDM appears again.');

    // Manually inject glossary data by replacing the plugin loadGlossary call.
    // We do this by providing a glossaryPath that won't exist and monkey-patching
    // the module — simpler: we exercise the plugin with a fake path and override
    // node:fs via the fact that the plugin no-ops on missing file, so instead
    // we construct the plugin function directly with known data.

    // Direct unit test: call the transform function produced by the plugin factory
    // with a tree that has known content, using a glossaryPath that resolves.
    // Since the test runner has access to the fixture, write a temp file.
    const os = { tmpdir: () => '/tmp' };
    void os; // unused — we use a different approach below

    // Strategy: extract the plugin visitor logic by building the processor
    // with a patched filesystem. Instead, we test the visit behaviour directly
    // by constructing the transformed tree using the exported plugin with
    // a real temp glossary file written before the test.
    const { writeFileSync } = require('node:fs');
    const tmpPath = `/tmp/glossary-test-${Date.now()}.json`;
    writeFileSync(tmpPath, JSON.stringify(FIXTURE_GLOSSARY));

    const processor = unified().use(remarkGlossaryAutoLink, { glossaryPath: tmpPath });
    processor.run(tree);

    // Find any mdxJsxTextElement nodes in the tree
    const jsxNodes: unknown[] = [];
    function collectJsx(node: { type: string; children?: unknown[] }) {
      if (node.type === 'mdxJsxTextElement') jsxNodes.push(node);
      if (node.children) {
        for (const child of node.children) {
          collectJsx(child as { type: string; children?: unknown[] });
        }
      }
    }
    collectJsx(tree as unknown as { type: string; children?: unknown[] });

    expect(jsxNodes.length).toBeGreaterThan(0);
    const first = jsxNodes[0] as { name: string; attributes: Array<{ name: string; value: string }> };
    expect(first.name).toBe('GlossaryTerm');
    expect(first.attributes[0]?.name).toBe('name');
    expect(first.attributes[0]?.value).toBe('OFDM');
  });

  it('no-ops gracefully when glossary file is missing', () => {
    const tree = fromMarkdown('OFDM is used in LTE.');
    const processor = unified().use(remarkGlossaryAutoLink, {
      glossaryPath: '/nonexistent/path/glossary.json',
    });
    // Should not throw
    expect(() => processor.run(tree)).not.toThrow();
  });
});
