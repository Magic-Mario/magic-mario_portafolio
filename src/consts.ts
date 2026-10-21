/**
 * Site metadata and the single developer profile.
 * One place to edit identity, contact channels and default SEO copy.
 */

export const SITE = {
  lang: 'en',
  name: 'Magic Mario',
  /** Short positioning line used in the header and social cards. */
  tagline: 'Cloud systems & agent tooling',
  title: 'Magic Mario — Cloud systems and agent tooling',
  description:
    'Case studies from a solo developer: a cloud-native life simulator built on AWS, and agenv, a lockfile for agent skills.',
  /** Fallback social-card alt text when a page has no cover image. */
  ogImageAlt: 'Magic Mario — cloud systems and agent tooling',
} as const;

export const DEVELOPER = {
  name: 'Magic Mario',
  /** One-line positioning statement (US1: "know what the developer builds" within seconds). */
  headline: 'I design and build cloud systems end to end — and the tooling that makes them reproducible.',
  /** Short introduction shown in the about area (FR-008). */
  bio: [
    'I am a solo developer. I take an idea from an empty repository to a running deployment: the infrastructure that carries it, the services behind it, the interface on top of it, and the developer tooling that keeps the whole thing honest.',
    'Most of that work sits around under-tested seams — determinism, provenance, caches that must not lie, and builds that must not depend on a network that happens to be up. I care about systems where the same input produces the same output, where a failure degrades instead of dropping the user, and where the boundaries between services are real and not just folder names.',
    'The two projects below are the current record of that.',
  ],
  /** Contact channels (FR-008). `github` is always rendered; email appears when configured. */
  links: {
    github: 'https://github.com/Magic-Mario',
    /**
     * Public contact address. Leave empty to hide the email channel; it is
     * rendered automatically once a real address is set here.
     */
    email: '',
  },
  /** Thematic focus shown on the about page. */
  focus: [
    'Cloud infrastructure as code',
    'Backend services and API design',
    'Developer tooling and reproducibility',
    'Static front ends that do not need JavaScript',
  ],
} as const;

export const NAV = [
  { href: '/', label: 'Work' },
  { href: '/about/', label: 'About' },
] as const;
