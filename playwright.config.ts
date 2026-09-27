import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.AMOURA_BASE_URL ||
  'https://jksgiq-r4.myshopify.com/?preview_theme_id=207539044694';

export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./tests/global.setup'),
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/playwright-report.json' }]
  ],
  outputDir: 'reports/playwright-results',
  use: {
    baseURL,
    storageState: '.auth/shopify.json',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    ignoreHTTPSErrors: true,
    reducedMotion: 'reduce'
  },
  projects: [
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: devices['iPhone 13'].userAgent
      }
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true
      }
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1440, height: 1000 },
        deviceScaleFactor: 1
      }
    }
  ]
});
