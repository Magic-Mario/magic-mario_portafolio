import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL ?? '/';
  const sitemap = new URL(`${base}sitemap-index.xml`.replace(/\/{2,}/g, '/'), site);

  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap.href}`, ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
