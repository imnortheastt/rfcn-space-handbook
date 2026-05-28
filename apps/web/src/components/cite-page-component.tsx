import { CiteResolved } from '@rfcn-space-handbook/citations';

/**
 * Returns a build-time-bound <Cite> replacement for a specific lesson page.
 * The returned component is a pure SSR React component: no hooks, no context,
 * no client-side hydration. It resolves each citation ID to its 1-based
 * order-of-first-appearance index using the pre-computed map.
 *
 * Usage in lesson route frontmatter:
 *   import { makeCiteComponent } from '../../../components/cite-page-component';
 *   const Cite = makeCiteComponent(citeIndexMap);
 *   <Content components={{ Cite }} />
 */
export function makeCiteComponent(
  citeIndexMap: ReadonlyMap<string, number>,
): (props: { id: string }) => React.ReactElement {
  return function CitePageComponent({ id }: { id: string }) {
    const n = citeIndexMap.get(id) ?? 0;
    return <CiteResolved id={id} n={n} />;
  };
}
