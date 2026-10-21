# Contract: Build & deploy pipeline (GitHub Pages)

The interface between the **repository** and **GitHub Pages**. Getting this wrong (usually the `base` path) is the most common way a GitHub Pages site ships broken.

## Inputs

| Input | Source | Notes |
|-------|--------|-------|
| Source content | `src/` (pages, components, `content/projects/*.md`, assets) | The authoring contract |
| Site origin | `astro.config.mjs` → `site`, from `SITE_URL` | `https://<user>.github.io` |
| Base path | `astro.config.mjs` → `base`, from `BASE_PATH` | `/<repo>` for a project site; omit for a user/org site or custom domain |
| Build runtime | Bun 1.4 via `oven-sh/setup-bun` | The repository ships `bun.lock`; the development machine is Bun-only (no npm) |
| Workflow | `.github/workflows/deploy.yml` | Build on push to the default branch; checks on pull requests |

## Outputs

| Output | Description |
|--------|-------------|
| `dist/` | Fully static HTML/CSS/JS/images, published by `actions/deploy-pages` |
| Live URL | `https://<user>.github.io/<repo>/` (stable public address, FR-005) |
| Deploy artifact | The `github-pages` environment artifact produced by the workflow |

## Required workflow steps

1. `actions/checkout@v4`
2. `oven-sh/setup-bun@v2` (pin `bun-version: 1.4.2`)
3. `bun install --frozen-lockfile` (lockfile committed)
4. `bunx playwright install --with-deps chromium` + `bun run test:e2e` (smoke journeys)
5. `bun run build` with `SITE_URL`/`BASE_PATH` derived from the repository (runs `astro check`,
   the content contract, then `astro build`; a failure blocks deploy)
6. `actions/configure-pages`, `actions/upload-pages-artifact` (path `dist/`), `actions/deploy-pages`

## Prerequisites (one-time, outside the application)

- The project directory is **not yet a git repository**. Before the first deploy: `git init`, add the GitHub remote, and push the default branch.
- In the repository settings, set **Pages → Source = GitHub Actions**.
- `.gitignore` must exclude `node_modules/`, `dist/`, and `.astro/` (build output is never committed).

## Guarantees

- **Every push to the default branch republishes** the site; the URL never changes between deploys.
- **A failing check or build does not deploy** — broken content or types cannot reach production.
- **No secrets** are required: publishing to GitHub Pages uses the workflow's built-in `GITHUB_TOKEN` and Pages permissions (`contents: read`, `pages: write`, `id-token: write`).
- **Reproducible**: the committed lockfile plus pinned Node version make builds deterministic.

## Verifications after first deploy

- `https://<user>.github.io/<repo>/` loads the home page with both project cards.
- Deep links and assets resolve under `/<repo>/…` (no 404s from root-absolute paths).
- `/projects/life-simulator/`, `/projects/agenv/`, and `/about/` render.
- A Lighthouse (mobile) run on the deployed home page meets the budgets in the plan.
