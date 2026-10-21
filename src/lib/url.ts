/**
 * Base-path-aware URL helpers.
 *
 * GitHub Pages serves this project site under `/<repo>/`, so every internal
 * link and public asset must be built through `import.meta.env.BASE_URL`
 * instead of a root-absolute string (see contracts/routes.md).
 */

const RAW_BASE = import.meta.env.BASE_URL ?? '/';
const BASE = RAW_BASE.endsWith('/') ? RAW_BASE.slice(0, -1) : RAW_BASE;

/** Turn a site-relative path into a base-path-aware href. */
export function url(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** Whether `href` points at the current route (for `aria-current`). */
export function isActive(currentPath: string, href: string): boolean {
  const target = url(href);
  if (target === BASE + '/') return currentPath === BASE + '/' || currentPath === '/';
  return currentPath === target || currentPath.startsWith(target.endsWith('/') ? target : `${target}/`);
}
