# Feature Specification: Project Portfolio Site

**Feature Branch**: `001-project-portfolio`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Crear un portafolio con GitHub Pages con el objetivo de exhibir y explicar los proyectos internos que he desarrollado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover the developer's projects (Priority: P1)

A visitor (recruiter, peer developer, or curious collaborator) opens the portfolio's home page and immediately sees the developer's projects listed as cards, each with a name, a one-line summary, technology keywords, and a link to a dedicated page.

**Why this priority**: The single most important job of a portfolio is to make the work discoverable within seconds. Without this, nothing else matters, and it alone constitutes a viable first version.

**Independent Test**: Open the site root with the full set of projects and confirm every showcased project appears as a card with its title, summary, technology keywords, and a working link to its detail page.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site root, **When** the page finishes loading, **Then** all showcased projects are listed, each with a title, a one-line summary, technology keywords, and a link to its detail page.
2. **Given** a project has a public source repository or a live demo, **When** the visitor views that project's card, **Then** a link to the repository and/or demo is visible.
3. **Given** the set of showcased projects changes, **When** the home page is rebuilt, **Then** the cards reflect the current set without any layout change.

---

### User Story 2 - Understand a project in depth (Priority: P2)

A visitor opens a project's dedicated page and reads a clear explanation of what the project is, the problem it solves, how it is built (architecture and technology), the notable challenges or decisions behind it, and where to find the code.

**Why this priority**: "Explaining" the projects is the developer's stated goal; discoverability (US1) brings the visitor in, and the detail page is what actually communicates the work.

**Independent Test**: Open any project's detail page and confirm it presents purpose, context, technology, notable challenges/decisions, visuals when available, and links to the source.

**Acceptance Scenarios**:

1. **Given** the visitor is on the home page, **When** they open a project, **Then** a dedicated page shows the project's purpose, the problem it solves, its technology, and its notable challenges or decisions.
2. **Given** a project has architecture diagrams, screenshots, or other visuals, **When** the detail page loads, **Then** those visuals are displayed alongside the explanation.
3. **Given** a project has a public repository or demo, **When** the visitor follows the link, **Then** they reach the correct external destination.

---

### User Story 3 - Get to know and contact the developer (Priority: P3)

A visitor reaches an "about" area that introduces the developer and offers ways to make contact (for example code hosting profile and professional email).

**Why this priority**: Converts interest in the work into a conversation, but the portfolio is still useful without it.

**Independent Test**: Open the about area and confirm the developer's introduction and at least one working contact channel are present.

**Acceptance Scenarios**:

1. **Given** a visitor wants to know who built the projects, **When** they open the about area, **Then** they see a short introduction and the developer's contact channels.
2. **Given** a visitor selects a contact channel, **When** they activate it, **Then** the correct destination opens.

---

### User Story 4 - Explore projects by technology (Priority: P4)

A visitor who cares about a specific technology (for example a particular language or framework) filters the project list to see only the projects that use it.

**Why this priority**: Useful for targeted visitors, but the full list already covers the core need.

**Independent Test**: Select a technology filter and confirm only the matching projects remain visible, with a way to clear the filter.

**Acceptance Scenarios**:

1. **Given** the home page lists several projects, **When** the visitor selects a technology keyword, **Then** only projects associated with that keyword remain visible.
2. **Given** a filter is active, **When** the visitor clears it, **Then** all projects are visible again.

---

### Edge Cases

- The portfolio contains only one or two projects: the layout must still look intentional rather than empty.
- A project has a very long or very short summary: cards and detail pages keep a consistent, non-overflowing layout.
- A project has no public repository and no demo: the card and detail page still render, gracefully omitting the missing links.
- Titles or summaries contain accented or non-Latin characters: they render correctly everywhere.
- An external link (repository or demo) is broken or unavailable: the visitor is not left on a dead end.
- The visitor uses a small mobile screen or a large desktop screen: content remains readable and navigable without horizontal scrolling.
- The site is opened without JavaScript or with slow connectivity: the core content (project list and explanations) remains readable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST list every showcased project, each with a title, a one-line summary, technology keywords, and a link to its detail page.
- **FR-002**: Each showcased project MUST have a dedicated page reachable at a stable, shareable address.
- **FR-003**: Each project page MUST explain what the project is, the problem it solves, its technology, and its notable challenges or design decisions.
- **FR-004**: Each project MUST present links to its public source repository and, when one exists, to a live demonstration.
- **FR-005**: The portfolio MUST be publicly reachable at a stable public address.
- **FR-006**: The portfolio MUST be published as a public static site through the developer's GitHub Pages (hosting requirement set by the user).
- **FR-007**: Project content MUST be organized so the owner can add or update a project without redesigning the site or changing page structure.
- **FR-008**: The portfolio MUST include an "about" area with the developer's short introduction and contact channels.
- **FR-009**: The portfolio MUST be usable on both phone-sized and desktop-sized screens without horizontal scrolling.
- **FR-010**: Visitors SHOULD be able to browse or filter projects by technology keyword or category.
- **FR-011**: The portfolio MUST showcase exactly two projects: (1) the **life simulator**, presented as a single project that encompasses its cloud infrastructure, backend, web frontend, and internal events service; and (2) **agenv**, the agent-environment tool. No other internal projects are in scope for this version.
- **FR-012**: Each project explanation MUST be a case study covering the project's purpose, the problem it solves, its architecture and technology, its notable challenges or design decisions, and supporting visuals such as diagrams or screenshots.
- **FR-013**: All portfolio content MUST be written in English.

### Key Entities *(include if feature involves data)*

- **Project**: A piece of work to showcase. Key attributes: title, one-line summary, detailed explanation, technology keywords, category, current status, source repository link, demo link (optional), visuals such as diagrams or screenshots (optional), and notable challenges or decisions.
- **Developer profile**: The owner of the portfolio. Key attributes: display name, short introduction, and contact channels.
- **Portfolio site**: The collection of showcased projects plus the developer profile, presented as a home listing, per-project pages, and an about area.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can tell what the developer builds within 10 seconds of landing on the home page.
- **SC-002**: From the home page, a visitor can reach any project's detail page in at most 2 interactions.
- **SC-003**: 100% of showcased projects have a working link to their detail page and, when available, to their source repository.
- **SC-004**: Every page is fully usable at a 375-pixel-wide viewport with no horizontal scrolling.
- **SC-005**: The owner can add a new project in under 10 minutes by editing content only, with no changes to page structure.
- **SC-006**: All pages are reachable and readable with JavaScript disabled (core content only).

## Assumptions

- The primary audience is technical (recruiters, peers, and potential collaborators) with no prior knowledge of the developer's projects.
- The portfolio is a public, static site hosted on the developer's own GitHub account through GitHub Pages; no server-side runtime, accounts, or authentication are involved.
- The developer maintains the content directly in the repository; there is no content management system or editorial workflow.
- The showcased projects already exist and are described in their own repositories; their descriptions are adapted, not authored from scratch.
- Modern evergreen browsers (desktop and mobile) are the target; legacy browser support is out of scope.
- The portfolio content is written in English (FR-013) for a broad, primarily technical audience.
- Exactly two projects are showcased: the life simulator (a deliberate grouping of its several repositories) and agenv (FR-011). Other internal projects, such as the agent-memory system, are out of scope for this version.
- Each project page is a case study with supporting visuals (FR-012), not a bare card or a one-paragraph note.
- No analytics, comments, or user accounts are in scope for the first version.
