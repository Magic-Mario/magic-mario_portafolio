import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * GitHub Pages project sites are served under `/<repo>/`, while local dev wants `/`.
 * Both `site` and `base` are therefore configurable from the environment:
 *
 *   SITE_URL   origin without a trailing slash, e.g. https://magic-mario.github.io
 *   BASE_PATH  repo path with leading and trailing slash, e.g. /magic-mario_portafolio/
 *
 * The deploy workflow derives both from the GitHub repository automatically.
 */
const site = (process.env.SITE_URL ?? 'https://magic-mario.github.io').replace(/\/$/, '');

function normalizeBase(value) {
  const raw = (value ?? '/').trim();
  if (raw === '' || raw === '/') return '/';
  return `/${raw.replace(/^\/+/, '').replace(/\/+$/, '')}/`;
}

const base = normalizeBase(process.env.BASE_PATH);

/**
 * Wrap a lone Markdown image in `<figure>/<figcaption>` so case-study diagrams
 * read as captioned figures. The `alt` text stays on the image for assistive
 * tech; only the visible caption is marked as decorative.
 */
function rehypeFigure() {
  return (tree) => {
    const visit = (node) => {
      if (!node || !Array.isArray(node.children)) return;
      for (const child of node.children) {
        const onlyChild = child.children?.length === 1 ? child.children[0] : null;
        const isImageParagraph =
          child.type === 'element' &&
          child.tagName === 'p' &&
          onlyChild?.type === 'element' &&
          onlyChild.tagName === 'img';

        if (isImageParagraph) {
          const img = onlyChild;
          const captionText = typeof img.properties?.alt === 'string' ? img.properties.alt : '';
          child.tagName = 'figure';
          child.properties = { className: ['case-figure'] };
          child.children = [
            img,
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { 'aria-hidden': 'true' },
              children: [{ type: 'text', value: captionText }],
            },
          ];
        } else {
          visit(child);
        }
      }
    };
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeFigure],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
