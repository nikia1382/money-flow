import {
  defineConfig,
  devices,
} from '@playwright/test';

const authFile =
  '.auth/user.json';

export default defineConfig({
  testDir: './e2e',

  fullyParallel: true,

  timeout: 40_000,

  expect: {
    timeout: 7_000,

    toHaveScreenshot: {
      maxDiffPixelRatio:
        0.01,
    },
  },

  reporter: 'html',

  use: {
    baseURL:
      'http://localhost:4200',

    trace:
      'on-first-retry',

    screenshot:
      'only-on-failure',
  },

  projects: [
    {
      name:
        'desktop-chromium',

      testMatch:
        /auth\.visual\.spec\.ts/,

      use: {
        ...devices[
          'Desktop Chrome'
        ],

        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },

    {
      name:
        'mobile-chromium',

      testMatch:
        /auth\.visual\.spec\.ts/,

      use: {
        ...devices[
          'Pixel 7'
        ],
      },
    },

    {
      name: 'setup',

      testMatch:
        /auth\.setup\.ts/,
    },

    {
      name: 'app-desktop',

testMatch: /app\..*\.spec\.ts/,

      dependencies: [
        'setup',
      ],

      use: {
        ...devices[
          'Desktop Chrome'
        ],

        storageState:
          authFile,

        viewport: {
          width: 1440,
          height: 900,
        },
      },
    },

{
  name: 'app-mobile',

  testMatch:
    /app\..*\.spec\.ts/,

  dependencies: [
    'setup',
  ],

  use: {
    ...devices[
      'Pixel 7'
    ],

    storageState:
      authFile,
  },
},
  ],

  webServer: {
    command:
      'npm start',

    url:
      'http://localhost:4200',

    reuseExistingServer:
      true,

    timeout:
      120_000,
  },
});