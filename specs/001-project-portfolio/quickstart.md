# Quickstart: Project Portfolio Site

A run-and-validate guide. It proves the feature works end-to-end; implementation details belong to `tasks.md` and the implementation phase.

## Prerequisites

- **Bun ≥ 1.4** — the only JavaScript runtime/package manager on this machine (`node`/`npm` are not installed; `node` is a symlink to `bun`).
- **git** — for the repository and GitHub Pages.
- A GitHub account with permission to create a repository and enable Pages (for deployment only; not needed for local validation).

## Setup & run (local)

```bash
# from the repository root
bun install            # install dependencies from the committed lockfile
bun run dev            # dev server (default http://localhost:4321)
bun run build          # astro check + astro build  → dist/
bun run preview        # serve the built dist/ locally
```

`bun run dev` serves the site at the root path (`/`), unlike production which is served under `/<repo>/`.

## Validate each user story

Validation is manual-first here; the same journeys are the ones the Playwright smoke tests automate.

### US1 — Discover the projects (P1)

1. Open `/`.
2. **Expect**: both projects appear as cards, each with a title, a one-line summary, technology tags, and a working link to its detail page.
3. **Expect**: cards for projects that have `repo`/`demo` show those links; a project without them shows no dead link.
4. **Expect**: no horizontal scrolling at a 375 px-wide viewport.

### US2 — Understand a project in depth (P2)

1. From `/`, open the **life simulator** card, then the **agenv** card.
2. **Expect**: each detail page explains Purpose, The problem, Architecture, Technology, and Challenges & decisions, in that order.
3. **Expect**: architecture diagrams / screenshots render (and are lazy-loaded where below the fold).
4. **Expect**: the repository (and demo, if any) link opens the correct external destination.

### US3 — Get to know the developer (P3)

1. Open `/about/` (reachable from any page via header/footer).
2. **Expect**: a short introduction plus at least one working contact channel (GitHub, email).
3. **Expect**: selecting a channel opens the correct destination.

### US4 — Filter by technology (P4) — *deferred*

Not implemented in v1 (see research R5). With two projects the full list already satisfies the need.

## Quality gates

```bash
bun run build               # astro check + content contract + build must pass
bun run test:e2e            # US1/US2/US3 smoke journeys, responsive layout, internal links
```

Expected: build succeeds; smoke tests green. Optional deeper checks, when the tools are available:

```bash
bunx linkinator ./dist --recurse   # no broken internal/external links
bunx lhci autorun                  # performance/a11y/SEO budgets
```

Manual accessibility spot-check: keyboard-only navigation, visible focus, alt text on every image, WCAG AA contrast.

## Edge cases to exercise

- Temporarily remove `repo` and `demo` from one project → its card and page still render cleanly.
- Set a project's `summary` to a very long string → the card layout holds without overflow.
- Open a non-existent path → the 404 page appears with a link home.
- Disable JavaScript → the home listing and case studies remain readable.

## Deploy to GitHub Pages (first time)

1. `git init` and add the GitHub remote (the project is not a git repo yet).
2. Ensure `.gitignore` ignores `node_modules/`, `dist/`, `.astro/`.
3. Commit `package.json` + lockfile, `astro.config.mjs` (with `site` and `base`), `src/`, and `.github/workflows/deploy.yml`.
4. Push the default branch.
5. In the repository settings: **Pages → Source = GitHub Actions**.
6. Open `https://<user>.github.io/<repo>/` and confirm the home page, both project pages, and `/about/` load, with assets resolving under `/<repo>/`.

See [contracts/deploy-pipeline.md](./contracts/deploy-pipeline.md) for the pipeline contract.
