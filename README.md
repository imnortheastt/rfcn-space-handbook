# RF · Core Network · Space Handbook

A bilingual (Vietnamese + English), open-and-free, deeply-written technical handbook
teaching RF Engineering, Core Network Architecture, and Space Engineering — from
beginner SWE through to research frontier (6G, NTN, NewSpace).

**Strategic positioning:** MDN-for-radio-and-space, written natively in Vietnamese
alongside English. The competitive moat is Vietnamese-language fidelity at engineering
depth, unified treatment of three domains that elsewhere live in disconnected silos,
and handbook density (deep, citable, durable) over video-bootcamp ephemerality.

> Full architecture, PRD, curriculum map, and multi-year roadmap:
> [`docs/PLATFORM_BLUEPRINT.md`](docs/PLATFORM_BLUEPRINT.md)

---

## Tech Stack

- **Astro 5** — multi-page application, content collections
- **React islands** — interactive widgets (antenna patterns, link budgets, orbital sims)
- **Pagefind** — client-side full-text search
- **Cloudflare Pages** — hosting (zero backend, no database, no auth)
- **pnpm workspaces** — monorepo

---

## Dev Quickstart

> Requires Node >= 20, pnpm >= 9.

```bash
pnpm install
pnpm dev        # start local dev server (http://localhost:4321)
pnpm build      # production build → dist/
pnpm preview    # preview production build locally
```

---

## Repository Structure

```
rfcn-space-handbook/
├── apps/
│   └── web/          # Astro site (main platform)
├── packages/
│   ├── widgets/      # React interactive widgets (shared)
│   └── ui/           # Shared design system components
├── content/          # All lesson MDX files (CC BY-SA 4.0)
├── data/             # Citations, glossary, curriculum metadata (CC BY-SA 4.0)
├── docs/             # Platform architecture & contributor docs
│   └── PLATFORM_BLUEPRINT.md
├── LICENSE           # CC BY-SA 4.0 — content/ and data/
├── LICENSE-CODE      # MIT — source code
└── NOTICE            # Explains the dual-license split
```

---

## Vercel one-time setup

1. Create a Vercel project: [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → select this repo.
2. Set **Framework Preset** to **Astro** (auto-detected).
3. Build command, install command, and output directory are overridden by `vercel.json` — no UI changes needed.
4. Add a custom domain in **Project Settings → Domains** when ready.
5. Web Analytics are auto-enabled by the `@astrojs/vercel` adapter config.

---

## License

- **Content** (`content/`, `data/`): [CC BY-SA 4.0](LICENSE)
- **Source code** (everything else): [MIT](LICENSE-CODE)

See [NOTICE](NOTICE) for the dual-license explanation.



