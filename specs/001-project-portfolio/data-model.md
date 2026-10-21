# Phase 1 Data Model: Project Portfolio Site

The "data" of this feature is **content**, not a database. Entities are modeled as an Astro content collection plus site constants.

---

## Entity: Project

Represents one showcased project. Instance = one file in `src/content/projects/`, identified by its filename (the `slug`). The site ships exactly two instances for this version: `life-simulator` and `agenv` (FR-011).

**Frontmatter fields**

| Field | Type | Required | Rules / notes |
|-------|------|----------|---------------|
| `title` | `string` | ✅ | Display name; 1–60 chars |
| `summary` | `string` | ✅ | One-line description shown on the card; 20–160 chars |
| `tech` | `string[]` | ✅ | ≥ 1 technology keyword; rendered as tags (FR-001, FR-010 data) |
| `status` | `'active' \| 'prototype' \| 'archived'` | — | Defaults to `'active'` |
| `year` | `string` | — | Free-form period, e.g. `"2025–2026"` |
| `role` | `string` | — | The developer's role, e.g. `"Solo developer"` |
| `repo` | `string` (URL) | — | Public source link; omit when none (FR-004 edge case) |
| `demo` | `string` (URL) | — | Live demo link; omit when none |
| `cover` | image asset | — | Card/hero image, optimized by `astro:assets` |
| `gallery` | image asset[] | — | Additional diagrams/screenshots (FR-012/G5) |
| `order` | `number` | ✅ | Ascending sort order on the home page |
| `featured` | `boolean` | — | Reserves a highlight slot on the home page; default `false` |

**Body (Markdown/MDX)** — the case-study narrative (FR-003/FR-012), authored under these headings:

1. `## Purpose` — what it is
2. `## The problem` — the problem it solves
3. `## Architecture` — how the pieces fit, with a diagram when available
4. `## Technology` — stack and why
5. `## Challenges & decisions` — notable difficulties and the choices made
6. `## What I'd do next` — *(optional)* future direction

**Validation rules**

- The zod schema in `src/content/config.ts` enforces every rule above; a malformed project **fails the build** rather than shipping broken content.
- `repo` and `demo` are independently optional; when both are absent the card and page must render without dead links (spec edge case).
- `gallery`/`cover` images must resolve to files under `src/assets/` so `astro:assets` can optimize them.

**Relationships**: none (flat collection). `order`/`featured` only affect home-page presentation.

---

## Entity: Developer profile

The portfolio owner. Modeled as plain constants in `src/consts.ts` (not a collection; there is exactly one).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | ✅ | Display name |
| `headline` | `string` | ✅ | One-line positioning statement (US1 "know what the developer builds") |
| `bio` | `string` | ✅ | Short introduction shown in the about area (FR-008) |
| `avatar` | image asset | — | Optional portrait |
| `links` | `{ github: string; email?: string; linkedin?: string; other?: { label: string; url: string }[] }` | ✅ (`github`) | Contact channels (FR-008); rendered in the footer and about page |

**Validation rules**: `github` is mandatory (US3 requires at least one working channel); `email` is rendered only when a real address is configured, because a noreply placeholder is not a working channel. Links must be absolute URLs (email may be `mailto:`).

---

## Entity: Portfolio site (composition)

The rendered whole, derived — not stored.

- **Home listing**: all `Project` entries sorted by `order`, each rendered as a `ProjectCard` (title, `summary`, `tech` tags, repo/demo links, link to detail page).
- **Project page**: one route per `Project` slug; `ProjectLayout` chrome + Prose body + gallery.
- **About area**: `/about`, rendering the `Developer profile`.
- **404 page**: standard not-found route.

---

## State transitions

None. All content is static; there is no runtime state, session, or persistence.

---

## Field → requirement traceability

| Field / behavior | Requirement |
|------------------|-------------|
| `title`, `summary`, `tech`, card link | FR-001 |
| slug → stable detail URL | FR-002 |
| body headings (purpose → challenges) | FR-003 |
| `repo`, `demo` | FR-004 |
| `cover`, `gallery` | FR-012 |
| one-file-per-project authoring | FR-007 / SC-005 |
| `Developer profile.links` | FR-008 / US3 |
