# Contract: Project content (authoring interface)

This is the interface between **content authors** (the developer) and the **templates**. It is enforced at build time by the zod schema in `src/content/config.ts`; a violation fails `astro build`.

## Authoring unit

One file per project: `src/content/projects/<slug>.md` (or `.mdx`). The filename (without extension) **is** the slug and the public URL segment.

Current entries (FR-011):

| File | slug | Public URL |
|------|------|-----------|
| `life-simulator.md` | `life-simulator` | `/projects/life-simulator/` |
| `agenv.md` | `agenv` | `/projects/agenv/` |

## Frontmatter schema

```yaml
---
# required
title: string            # 1–60 chars
summary: string          # 20–160 chars, one line
tech: [string, ...]      # >= 1 entry
order: number            # ascending home-page position
# optional
status: active | prototype | archived   # default: active
year: string             # e.g. "2025–2026"
role: string             # e.g. "Solo developer"
repo: string (URL)       # public source; omit if none
demo: string (URL)       # live demo; omit if none
cover: ./path-to-image   # relative to the md file
gallery: [./img1.png, ...]
featured: boolean        # default: false
---
```

## Body contract

Markdown/MDX after the frontmatter, using these second-level headings in order. Only the last is optional:

```markdown
## Purpose
## The problem
## Architecture
## Technology
## Challenges & decisions
## What I'd do next      <!-- optional -->
```

MDX is permitted so a case study may embed an Astro component (for example a figure with a caption or an interactive diagram) without changing the layout.

## Guarantees to the author

1. **Add a project = add one file.** No page, route, or component edits required (FR-007, SC-005).
2. **Graceful omission.** Missing `repo`/`demo` simply hide their links; the card and page still render.
3. **Heavy media handled for you.** `cover`/`gallery` images referenced from `src/assets` are optimized (resized, modern formats, lazy loading) automatically.
4. **Build-time safety.** A typo in a field name or a bad `tech`/`order` type fails the build with a pointed error rather than producing a broken page.

## Non-goals

- No live data fetching, no CMS, no authoring UI.
- No per-project custom templates; if one project needs a bespoke layout, that is a change to this contract and must be raised explicitly.
