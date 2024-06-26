// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const isCI = !!process.env.CI;
// const useBrowserCat = !!process.env.BROWSERCAT_API_KEY;

// const connectOptions = useBrowserCat ? {
//     wsEndpoint: 'wss://api.browsercat.com/connect',
//     headers: {
//       'Api-Key': process.env.BROWSERCAT_API_KEY
//     }
//   } : undefined;

// console.log('BROWSERCAT ENABLED:', useBrowserCat)

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  timeout: 5 * 60 * 1000,

  /* Configure expect defaults */
  expect: {
    toHaveScreenshot: {
      threshold: 0.4,
      maxDiffPixelRatio: 0.01,
      maxDiffPixels: 25
    },
    toMatchSnapshot: {
      threshold: 0.4,
      maxDiffPixelRatio: 0.01,
      maxDiffPixels: 25
    },
  },

  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  
  /* Retry on CI only */
  // retries: useBrowserCat || isCI ? 2 : 0,
  retries: isCI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  // workers: useBrowserCat ? 10 : isCI ? 1 : '50%',
  workers: isCI ? 1 : '50%',
  
  /* # of max failures */
  // maxFailures: useBrowserCat && !isCI ? 0 : 3,
  maxFailures: !isCI ? 0 : 3,
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:1234',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure output locations. */
  outputDir: '.test-results/spec/output',
  snapshotPathTemplate: '.test-results/spec/snaps/{projectName}/{testFilePath}/{arg}{ext}',
  testMatch: '*.spec.{js,jsx}',

  /* Configure reporting. See https://playwright.dev/docs/test-reporters */
  // reporter: isCI ? 'html' : 'line',
  reporter: [
    ['html', {
      outputFolder: '.test-results/spec/results', 
      open: 'never',
    }],
    isCI ? ['github'] : ['line'],
  ],

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 1024 },
        // connectOptions
      },
    },

    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 1024 }
      },
    },

    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 1024 }
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // viewport: { width: 1280, height: 1024 },
        isMobile: true
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        // viewport: { width: 1280, height: 1024 },
        isMobile: true
      },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:1234',
    reuseExistingServer: !isCI,
  },
});

