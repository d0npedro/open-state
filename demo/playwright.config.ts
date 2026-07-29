import { defineConfig, devices } from '@playwright/test';

/**
 * `npm run test:e2e:ci` (npm_lifecycle_event), PW_E2E_CI=1 oder CI=true:
 * - 1 worker, 2 retries
 * - Production-Server auf Port 3010 (kein Konflikt mit Dev auf 3000)
 * - webServer: single `next build` + `next start`
 * - Build-Artefakte in `.next-e2e` (NEXT_DIST_DIR) — schützt vor Multi-Loop-Races auf `.next`
 * - kein reuseExistingServer
 */
const isE2eCi =
  process.env.npm_lifecycle_event === 'test:e2e:ci' ||
  process.env.PW_E2E_CI === '1' ||
  !!process.env.CI;

const port = isE2eCi ? 3010 : 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isE2eCi,
  retries: isE2eCi ? 2 : 0,
  workers: isE2eCi ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    locale: 'de-DE',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  webServer: {
    // Single build owner. NEXT_DIST_DIR isolates from concurrent multi-loop builds.
    command: isE2eCi
      ? `npm run build && npx next start -p ${port}`
      : `npm run dev -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: !isE2eCi,
    timeout: 180_000,
    env: {
      ...process.env,
      ...(isE2eCi ? { NEXT_DIST_DIR: '.next-e2e' } : {}),
    },
  },
});
