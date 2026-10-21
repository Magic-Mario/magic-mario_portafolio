import { test, expect } from '@playwright/test';

const PROJECTS = [
  { slug: 'life-simulator', title: 'Life Simulator', repo: 'https://github.com/Magic-Mario' },
  { slug: 'agenv', title: 'agenv — a lockfile for agent skills', repo: 'https://github.com/Magic-Mario/agenv' },
] as const;

const CASE_STUDY_HEADINGS = [
  'Purpose',
  'The problem',
  'Architecture',
  'Technology',
  'Challenges & decisions',
];

test.describe('US1 — discover the projects', () => {
  test('the home page lists every project with its key facts', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const cards = page.locator('article.card');
    await expect(cards).toHaveCount(PROJECTS.length);

    for (const project of PROJECTS) {
      const card = page.locator('article.card').filter({ hasText: project.title });
      await expect(card.getByRole('heading', { name: project.title })).toBeVisible();
      await expect(card.locator('ul.tags > li')).not.toHaveCount(0);
      await expect(card.locator('p.card__summary')).not.toBeEmpty();
      await expect(card.getByRole('link', { name: /read the case study/i })).toHaveAttribute(
        'href',
        `/projects/${project.slug}/`,
      );
    }
  });

  test('a published project exposes its source repository', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('article.card').filter({ hasText: 'agenv' });
    await expect(card.getByRole('link', { name: /source/i })).toHaveAttribute(
      'href',
      'https://github.com/Magic-Mario/agenv',
    );
  });
});

test.describe('US2 — understand a project in depth', () => {
  for (const project of PROJECTS) {
    test(`${project.slug} reads as a full case study`, async ({ page }) => {
      await page.goto(`/projects/${project.slug}/`);

      await expect(page.getByRole('heading', { level: 1, name: project.title })).toBeVisible();

      const headings = await page.locator('.prose h2').evaluateAll((nodes) =>
        nodes.map((node) => node.textContent?.trim() ?? ''),
      );

      // The required headings appear in the contract's order.
      const positions = CASE_STUDY_HEADINGS.map((heading) => headings.indexOf(heading));
      expect(positions, `headings found: ${headings.join(' | ')}`).not.toContain(-1);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);

      // Every figure carries alt text, and the project links to its source.
      const figures = page.locator('.case-figure img');
      for (let index = 0; index < (await figures.count()); index += 1) {
        await expect(figures.nth(index)).toHaveAttribute('alt', /\S/);
      }

      await expect(page.getByRole('link', { name: /source code/i })).toHaveAttribute('href', project.repo);
      await expect(page.getByRole('link', { name: /all work/i })).toHaveAttribute('href', '/');
    });
  }
});

test.describe('US3 — get to know the developer', () => {
  test('the about page introduces the developer and offers contact', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).first().click();

    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /github/i }).first()).toHaveAttribute(
      'href',
      'https://github.com/Magic-Mario',
    );

    // Every rendered email channel must be deliverable: a noreply placeholder
    // is not a contact channel, so it is never rendered.
    const mailtoLinks = page.locator('main a[href^="mailto:"]');
    for (let index = 0; index < (await mailtoLinks.count()); index += 1) {
      await expect(mailtoLinks.nth(index)).not.toHaveAttribute(
        'href',
        /users\.noreply\.github\.com/,
      );
    }
  });
});

test.describe('Edge cases', () => {
  test('an unknown path renders the 404 page with a way home', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/does not exist/i);
    await expect(page.getByRole('link', { name: /back to the work/i })).toHaveAttribute('href', '/');
  });

  test('no horizontal scrolling at a phone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const route of ['/', '/about/', ...PROJECTS.map((p) => `/projects/${p.slug}/`)]) {
      await page.goto(route);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `${route} scrolls horizontally`).toBe(false);
    }
  });

  test('internal links resolve', async ({ page, request }) => {
    const routes = ['/', '/about/', ...PROJECTS.map((p) => `/projects/${p.slug}/`)];
    const targets = new Set<string>();

    for (const route of routes) {
      await page.goto(route);
      for (const href of await page.$$eval('a[href]', (anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
      )) {
        if (href.startsWith('/') && !href.startsWith('//')) {
          targets.add(href.split('#')[0]);
        }
      }
    }

    for (const target of targets) {
      const response = await request.get(target);
      expect(response.status(), `GET ${target}`).toBeLessThan(400);
    }
  });
});
