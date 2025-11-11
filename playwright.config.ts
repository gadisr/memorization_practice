import { defineConfig, devices } from '@playwright/test';

const useExternalServer = process.env.USE_DOCKER === 'true' || process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: useExternalServer
    ? undefined
    : {
        command: 'python3 serve.py',
        url: 'http://localhost:3000/public/index.html',
        cwd: '.',
        timeout: 120_000,
        reuseExistingServer: !process.env.CI
      }
});

