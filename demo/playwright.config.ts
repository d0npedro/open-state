import { defineConfig, devices } from '@playwright/test';

/**
 * `npm run test:e2e:ci` (npm_lifecycle_event), PW_E2E_CI=1 oder CI=true:
 * - 1 worker, 2 retries
 * - Production-Server auf Port 3010 (kein Konflikt mit Dev auf 3000)
 * - webServer: build + next start (kein separates Build-Skript nötig)
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
    // CI=true (GHA) und test:e2e:ci brauchen production build vor next start.
    // Build hier bündeln, damit weder Workflow noch npm-Skript es vergessen können.
    command: isE2eCi
      ? `npm run build && npx next start -p ${port}`
      : `npm run dev -- -p ${port}`,
    url: baseURL,
    reuseExistingServer: !isE2eCi,
    timeout: 180_000,
  },
});
