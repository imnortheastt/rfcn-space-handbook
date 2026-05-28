import { readFileSync } from 'node:fs';
import { visit } from 'unist-util-visit';
import type { Root, Text } from 'mdast';
import type { Plugin } from 'unified';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GlossaryEntry {
  /** Term in English */
  en: string;
  /** Term in Vietnamese */
  vi: string;
  /** Definition in English */
  definition_en: string;
  /** Definition in Vietnamese */
  definition_vi: string;
}

export type GlossaryData = GlossaryEntry[];

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

/**
 * Loads glossary JSON from disk. The file must be an array of GlossaryEntry.
 * Throws if the path does not exist or is not valid JSON.
 */
export function loadGlossary(jsonPath: string): GlossaryData {
  const raw = readFileSync(jsonPath, 'utf-8');
  return JSON.parse(raw) as GlossaryData;
}

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

/**
 * Looks up a term (case-insensitive) in the loaded glossary and returns the
 * matching entry, or undefined if not found.
 */
export function lookupTerm(
  term: string,
  lang: 'en' | 'vi',
  glossary: GlossaryData,
): GlossaryEntry | undefined {
  const needle = term.toLowerCase();
  return glossary.find((entry) => entry[lang].toLowerCase() === needle);
}

// ---------------------------------------------------------------------------
// Remark plugin
// ---------------------------------------------------------------------------

export interface RemarkGlossaryAutoLinkOptions {
  /**
   * Absolute path to glossary.json. Plugin no-ops gracefully if file is
   * missing (Phase 5 creates it — data/glossary.json).
   */
  glossaryPath: string;
}

/**
 * Remark plugin that wraps the first occurrence per file of each known
 * glossary term in a <GlossaryTerm name="..."> MDX JSX element.
 *
 * Must run BEFORE remark-math so term text is not inside math nodes.
 */
export const remarkGlossaryAutoLink: Plugin<[RemarkGlossaryAutoLinkOptions], Root> = (
  options,
) => {
  return (tree) => {
    let glossary: GlossaryData;

    try {
      glossary = loadGlossary(options.glossaryPath);
    } catch {
      // glossary.json not yet created — no-op
      console.warn(
        `[glossary] glossary.json not found at ${options.glossaryPath} — skipping auto-link`,
      );
      return;
    }

    // Track which terms have already been wrapped in this file (first-occurrence only)
    const wrapped = new Set<string>();

    visit(tree, 'text', (node: Text, index, parent) => {
      if (parent == null || index == null) return;
      // Skip nodes inside headings, links, code
      if (
        parent.type === 'heading' ||
        parent.type === 'link' ||
        parent.type === 'code' ||
        parent.type === 'inlineCode'
      ) {
        return;
      }

      let value = node.value;
      let modified = false;
      const newChildren: Array<{ type: string; value?: string; name?: string; children?: unknown[]; attributes?: unknown[] }> = [];

      // Walk through each glossary entry and find first unwrapped occurrence
      for (const entry of glossary) {
        const term = entry.en;
        const termKey = term.toLowerCase();
        if (wrapped.has(termKey)) continue;

        const idx = value.toLowerCase().indexOf(termKey);
        if (idx === -1) continue;

        // Split text around the match
        const before = value.slice(0, idx);
        const match = value.slice(idx, idx + term.length);
        const after = value.slice(idx + term.length);

        if (before) newChildren.push({ type: 'text', value: before });

        // Emit an mdxJsxTextElement for <GlossaryTerm name="...">
        newChildren.push({
          type: 'mdxJsxTextElement',
          name: 'GlossaryTerm',
          attributes: [{ type: 'mdxJsxAttribute', name: 'name', value: term }],
          children: [{ type: 'text', value: match }],
        });

        wrapped.add(termKey);
        value = after;
        modified = true;
        break; // one term replacement per visit call; next visit handles remaining text
      }

      if (!modified) return;

      if (value) newChildren.push({ type: 'text', value });

      // Replace the text node with the new nodes
      (parent.children as unknown[]).splice(index, 1, ...newChildren);
    });
  };
};
