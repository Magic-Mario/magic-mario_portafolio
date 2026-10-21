# Phase 0 Research: Project Portfolio Site

All Technical Context unknowns are resolved below. Each entry follows **Decision / Rationale / Alternatives considered**.

---

## R1 — Site generator / build tool

**Decision**: **Astro 5** in its default static-output mode.

**Rationale**: Astro renders to plain HTML with **zero client JavaScript by default**, which directly satisfies SC-006 (usable with JS disabled) and the performance budgets, while still providing content collections (G2), MDX for rich case studies (G5), and first-class image optimization for diagrams/screenshots. It has an official GitHub Pages deployment guide and produces a pure static `dist/`.

**Alternatives considered**:
- *Plain HTML/CSS/JS* — simplest and zero-dependency, but adding a project means hand-editing HTML and duplicating layout, violating FR-007/SC-005.
- *Jekyll* — native to GitHub Pages, but heavier to express custom case-study layouts and requires Ruby.
- *Eleventy (11ty)* — lighter and content-driven, but weaker built-in image pipeline and MDX ergonomics than Astro for visual case studies.

---

## R2 — Package manager and local runtime (no Node/npm on this machine)

**Decision**: Use **Bun 1.4.2** as the local package manager and task runner (`bun install`, `bun run …`, `bunx`). CI uses **Node 22** installed by `actions/setup-node`.

**Rationale**: This machine has **no Node.js and no npm** — `node` is a symlink to `bun` and `npm`/`npx`/`pnpm`/`yarn`/`corepack` are absent. Bun is Astro's supported and documented alternative package manager and can run the Astro CLI and `astro build`. Using the CI runner's real Node keeps the deploy path on Astro's primary supported runtime, avoiding any Bun-specific behavior in production.

**Alternatives considered**:
- *Install Node via nvm/mise/fnm* — would give the canonical toolchain, but adds a system-level install the user has not asked for. Revisit if Astro/Bun friction appears.
- *Bun everywhere (including CI)* — fewer moving parts, but Astro's Pages action path targets Node; not worth the risk on the deploy path.

**Risk / mitigation**: Native-dependent packages (notably `sharp` for `astro:assets`) can be the sharpest edge under Bun. If image optimization misbehaves under Bun, fall back to pre-optimized images committed to `public/`, or install Node just for builds. Verify early in implementation.

---

## R3 — Content modeling: how a project is authored

**Decision**: One **Markdown/MDX file per project** in the Astro content collection `src/content/projects/`, with a **typed frontmatter schema** (zod) and the case-study narrative in the body under fixed headings.

**Rationale**: This is the concrete mechanism for G2/FR-007/SC-005 — adding a project is "create one file, fill the fields". The zod schema makes the authoring contract explicit and fails the build on malformed content, keeping pages consistent.

**Alternatives considered**:
- *Hard-coded project data in a TS array* — simple, but mixes content with code and makes long-form, image-rich case studies awkward.
- *Headless CMS* — rejected by the spec's assumptions (no CMS, owner edits the repo directly).

Details of fields and validation are in [data-model.md](./data-model.md) and [contracts/project-content.md](./contracts/project-content.md).

---

## R4 — Styling approach

**Decision**: **Scoped Astro styles plus one global stylesheet of CSS custom properties** (design tokens: color, spacing, type scale, light/dark). No CSS framework.

**Rationale**: Keeps dependencies and build surface minimal, produces no runtime cost, and is easy to theme. Astro scopes component styles by default, preventing leakage. Satisfies the responsive and accessibility budgets without a framework's overhead.

**Alternatives considered**:
- *Tailwind CSS* — fast to author with, but adds build dependency and config for a site with only a handful of components.
- *A component library* — unnecessary weight and visual sameness for a personal portfolio.

---

## R5 — Interactivity / the technology filter (FR-010, US4, Priority P4)

**Decision**: **Defer** the filter. Ship the home page listing both projects statically; with only two projects, a filter adds UI and JS for no real benefit.

**Rationale**: FR-010 is a SHOULD, and US4 is the lowest priority. The checklist already flags the filter as low value at this scope. Deferring preserves the zero-JS, high-performance posture.

**Alternatives considered**:
- *Client-side filter island* — small Astro island, but pointless for two items.
- *Server-side/static filtered routes* — more routes and content duplication for no user benefit at this size.

**Revisit when**: the showcased set grows beyond roughly four to five projects.

---

## R6 — Testing & quality gates

**Decision**: Layered, lightweight validation: `astro check` (types + content schema) and `astro build` (must succeed) as CI blockers; **`linkinator`** to catch broken internal/external links (SC-003, edge case "broken external link"); **Playwright** smoke tests for the three prioritized journeys (US1/US2/US3); **Lighthouse CI** budgets for performance, accessibility, Best Practices and SEO (SC-004 and the Performance Goals).

**Rationale**: The feature has no business logic to unit-test; its risks are content rendering, navigation, responsiveness and performance. Testing at that level directly verifies the success criteria rather than inventing unit tests.

**Alternatives considered**:
- *Unit tests (Vitest)* — little to test without logic; would be ceremony.
- *Manual-only validation* — insufficient for a deploy pipeline; regressions (broken links, perf) would ship silently.

---

## R7 — Deployment to GitHub Pages

**Decision**: A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with Node 22 and publishes the Astro `dist/` via `actions/deploy-pages`. `astro.config.mjs` sets `site` to the Pages origin and `base` to `/<repo>` for the project site.

**Rationale**: This is the maintainable, officially supported path (no committed build output, no `gh-pages` branch juggling) and gives a repeatable deploy on every push to the default branch. Correct `base` handling is the main GitHub Pages pitfall and is called out as a contract.

**Alternatives considered**:
- *Commit built output to a `gh-pages` branch* — simple but pollutes history and requires manual rebuilds.
- *`withastro/action`* — convenient wrapper, but the explicit workflow is clearer and pins its own Node version.

**Prerequisite discovered**: the project directory is **not yet a git repository** and has no remote, so the Pages prerequisite (creating the repo and remote, enabling Pages as "GitHub Actions") must be done before the first deploy. This is deployment setup, not application work.

Details are in [contracts/deploy-pipeline.md](./contracts/deploy-pipeline.md).
