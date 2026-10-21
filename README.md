# magic-mario portafolio

A public, static portfolio that showcases two projects as English case studies:

- **Life Simulator** — a cloud-native life sim on AWS (Terraform, EKS, FastAPI, gRPC, Next.js).
- **agenv** — a lockfile for agent skills (Rust CLI).

Built with **Astro 5** (content collections, `astro:assets`, MDX) and deployed to **GitHub Pages**
with GitHub Actions. No runtime, no database, no client-side JavaScript required for the content.

## Requirements

- **Bun ≥ 1.4** — the package manager and script runner used here (`node` is a symlink to `bun`
  on the development machine, so every script is Bun-first).
- **git**, and a GitHub repository with Pages enabled (for deployment only).

## Commands

```bash
bun install            # install dependencies from bun.lock

bun run dev            # dev server at http://localhost:4321
bun run build          # astro check + content contract + astro build → dist/
bun run preview        # serve the built dist/ locally

bun run test:e2e       # Playwright smoke tests (needs a build; starts its own server)
```

`bun run build` fails on a type error, a schema violation, or a case-study body that is missing the
required `##` headings — malformed content never reaches `dist/`.

### Playwright note

The browser cache on this machine may not match the installed Playwright version. Point
`CHROME_PATH` at an existing Chromium binary to reuse it:

```bash
CHROME_PATH=~/.cache/ms-playwright/chromium-1140/chrome-linux/chrome bun run test:e2e
```

## Project structure

```text
astro.config.mjs          site/base (env-driven), MDX, sitemap, captioned figures
src/
├── consts.ts             site metadata + the developer profile (name, bio, links)
├── content/
│   ├── config.ts         zod schema for the `projects` collection
│   └── projects/         one Markdown case study per project
├── layouts/              BaseLayout, ProjectLayout
├── components/           Header, Footer, ProjectCard, TechTags, StatusBadge
├── pages/                index, about, projects/[slug], 404, robots.txt
├── lib/url.ts            base-path-aware links
└── styles/global.css     design tokens, layout primitives, case-study prose
specs/001-project-portfolio/   spec, plan, contracts, data model, quickstart
.archify/                      Archify diagram specs (candidate JSON); rendered HTML stays local
```

## Adding or updating a project

1. Add `src/content/projects/<slug>.md` (the filename is the URL segment).
2. Fill the frontmatter (`title`, `summary`, `tech`, `order`, optional `repo`/`demo`/`cover`/`gallery`).
3. Write the body under `## Purpose`, `## The problem`, `## Architecture`, `## Technology`,
   `## Challenges & decisions` — and optionally `## What I'd do next`.

No page, route or component changes are needed. See
[`specs/001-project-portfolio/contracts/project-content.md`](specs/001-project-portfolio/contracts/project-content.md).

## Deployment

Pushing to `main` runs the [Site workflow](.github/workflows/deploy.yml): smoke tests, a production
build with the correct GitHub Pages origin and base path, and a deploy. Enable
**Settings → Pages → Source = GitHub Actions** once, in the repository.

For local production-shaped builds:

```bash
SITE_URL=https://magic-mario.github.io BASE_PATH=/magic-mario_portafolio/ bun run build
```
