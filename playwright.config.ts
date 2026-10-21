import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests for the three prioritized user journeys plus the responsive and
 * link integrity guarantees from the spec.
 *
 * The machine that authored this only ships Bun, and its Playwright browser
 * cache may hold a different Chromium build than the installed Playwright
 * expects; set CHROME_PATH to reuse an existing binary. CI installs its own.
 */
const executablePath = process.env.CHROME_PATH;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    launchOptions,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'bun run build && bun run preview --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
