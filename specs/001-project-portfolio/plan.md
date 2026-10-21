# Implementation Plan: Project Portfolio Site

**Branch**: `001-project-portfolio` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-project-portfolio/spec.md`

## Summary

Build a public, static portfolio published on GitHub Pages that showcases **two** projects — the *life simulator* (one entry grouping its cloud infrastructure, backend, web frontend, and internal events service) and *agenv* — as English case studies with supporting visuals, plus an about/contact area.

Technical approach: an **Astro 5** static site with content collections (each project is one Markdown/MDX file), scoped CSS with a small design system, Astro's built-in image optimization for diagrams and screenshots, and deployment to GitHub Pages via a GitHub Actions workflow. Because the machine has **Bun only** (no Node/npm), local work uses Bun as the package manager while CI builds with Node 22 from `actions/setup-node`.

## Technical Context

**Language/Version**: TypeScript 5.x on **Astro 5.x**; runtime for tooling — **Bun 1.4.2 locally and in CI** (the development machine has Bun only; the repository ships `bun.lock`)

**Primary Dependencies**: `astro`, `@astrojs/mdx`, `@astrojs/sitemap`; `sharp` (used transitively by `astro:assets` for image optimization). No UI framework/island needed for v1.

**Storage**: Files only — Astro **content collections** (`src/content/projects/*.{md,mdx}` with frontmatter). No database, no backend.

**Testing**: `astro check` (types/content schema), a content-contract script (required case-study headings), `astro build` (build integrity), Playwright smoke tests covering the three prioritized user journeys plus responsive and internal-link checks (`bun run test:e2e`), and — optionally — `linkinator` and Lighthouse CI budgets (performance/accessibility/SEO).

**Target Platform**: Static hosting on **GitHub Pages** (project site under `https://<user>.github.io/<repo>/`); modern evergreen desktop and mobile browsers.

**Project Type**: Web application — single static front-end, no server component.

**Performance Goals**: Lighthouse mobile ≥ 95 for Performance, Accessibility, Best Practices and SEO on all routes; LCP < 2.5 s; no layout shift (CLS ≈ 0).

**Constraints**: Static output only (no server runtime) · correct handling of the `/ <repo>` base path on GitHub Pages · fully usable at a 375 px viewport with no horizontal scroll · core content readable with JavaScript disabled · adding a project means editing one Markdown file only (no structural change) · text content in English.

**Scale/Scope**: 3–6 routes total (`/`, `/projects/<slug>` ×2, `/about`, `404`); a handful of images per project; content set expected to grow slowly.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution at `.specify/memory/constitution.md` is still the **unratified template** (placeholders only), so it defines no enforceable principles. In its place, the plan applies gates derived directly from the specification:

| Gate | Source | Status |
|------|--------|--------|
| G1 — Static only, no server-side runtime | Assumptions; FR-006 | ✅ Astro default static output; GitHub Pages serves files only |
| G2 — Content-driven: add/update a project without restructuring | FR-007, SC-005 | ✅ One Markdown file per project in a content collection; templates are generic |
| G3 — Responsive (≥375 px, no horizontal scroll) and usable without JS | FR-009, SC-004, SC-006 | ✅ CSS-first layout; zero client JS required for core content |
| G4 — Publicly reachable, published via GitHub Pages | FR-005, FR-006 | ✅ Actions workflow deploys to Pages |
| G5 — Case studies with visuals | FR-012 | ✅ MDX + `astro:assets` diagrams/screenshots |
| G6 — Scope limited to the two chosen projects | FR-011 | ✅ Content collection currently contains exactly two entries |

**Result**: all gates pass with no violations. Complexity Tracking is empty (see below).

> Note: since the constitution is unratified, it is recommended to run `/speckit.constitution` to establish real project principles; this plan can be re-checked afterwards.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-portfolio/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (/speckit.plan output)
├── data-model.md        # Phase 1 output (/speckit.plan output)
├── quickstart.md        # Phase 1 output (/speckit.plan output)
├── contracts/           # Phase 1 output (/speckit.plan output)
│   ├── project-content.md
│   ├── routes.md
│   └── deploy-pipeline.md
├── checklists/
│   └── requirements.md  # /speckit.specify output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
magic-mario_portafolio/
├── astro.config.mjs            # site/base, integrations (mdx, sitemap), image config
├── package.json                # scripts: dev, build, preview, check
├── tsconfig.json
├── .gitignore                  # node_modules, dist, .astro
├── .github/
│   └── workflows/
│       └── deploy.yml          # build (Node 22) + deploy to GitHub Pages
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── consts.ts               # site metadata + developer profile (name, bio, links)
    ├── content/
    │   ├── config.ts           # zod schema for the `projects` collection
    │   └── projects/
    │       ├── life-simulator.md   # case study #1
    │       └── agenv.md            # case study #2
    ├── layouts/
    │   ├── BaseLayout.astro    # <head>, header, footer, meta/OG tags
    │   └── ProjectLayout.astro # case-study chrome around MDX body
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── ProjectCard.astro   # home listing card
    │   ├── TechTags.astro
    │   └── Prose.astro         # typography wrapper for case-study content
    ├── pages/
    │   ├── index.astro         # US1 — project listing
    │   ├── about.astro         # US3 — about/contact
    │   ├── projects/
    │   │   └── [slug].astro    # US2 — case-study pages
    │   └── 404.astro
    ├── styles/
    │   └── global.css          # design tokens (colors, spacing, type scale)
    └── assets/
        └── projects/           # diagrams & screenshots, optimized by astro:assets
```

**Structure Decision**: A single Astro project at the repository root. The site is one static front-end with no backend, so none of the multi-project options apply. Content lives in a typed content collection (`src/content/projects`) so that the templates in `src/pages` and `src/components` stay generic and a new project is added by dropping in one Markdown file — satisfying FR-007/SC-005 (G2).

## Complexity Tracking

> No Constitution Check violations; no complexity to justify.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
