import {
  expect,
  test,
} from '@playwright/test';

const sidebarRoutes = [
  '/dashboard',
  '/accounts',
  '/transactions',
  '/budgets',
  '/recurring-payments',
  '/debts',
  '/goals',
  '/notifications',
  '/settings',
  '/profile',
  '/help',
];

test.describe(
  'MoneyFlow functionality',
  () => {
    /* =========================
       Sidebar Navigation
    ========================= */

    test(
      'sidebar links navigate correctly',
      async ({ page }) => {
        await page.goto(
          '/dashboard',
        );

        await expect(
          page.locator(
            '.main-layout',
          ),
        ).toBeVisible();

        for (
          const route of
          sidebarRoutes
        ) {
          const link =
            page.locator(
              `.sidebar a[href="${route}"]`,
            );

          await expect(
            link,
          ).toBeVisible();

          await link.click();

          await expect(
            page,
          ).toHaveURL(
            (url) =>
              url.pathname === route,
          );

          await expect(
            page.locator(
              '.main-layout',
            ),
          ).toBeVisible();
        }
      },
    );

    /* =========================
       Authentication Guard
    ========================= */

    test(
      'unauthenticated users are redirected to login',
      async ({
        browser,
        baseURL,
      }) => {
        const context =
          await browser.newContext({
            baseURL,

            storageState: {
              cookies: [],
              origins: [],
            },
          });

        const page =
          await context.newPage();

        await page.goto(
          '/dashboard',
        );

        await expect(
          page,
        ).toHaveURL(
          (url) =>
            url.pathname ===
              '/login' &&
            url.searchParams.get(
              'returnUrl',
            ) === '/dashboard',
        );

        await expect(
          page.locator(
            'form.auth-form',
          ),
        ).toBeVisible();

        await context.close();
      },
    );

    /* =========================
       Public Auth Pages
    ========================= */

    test(
      'login and register pages are publicly available',
      async ({
        browser,
        baseURL,
      }) => {
        const context =
          await browser.newContext({
            baseURL,

            storageState: {
              cookies: [],
              origins: [],
            },
          });

        const page =
          await context.newPage();

        await page.goto(
          '/login',
        );

        await expect(
          page.locator(
            'form.auth-form',
          ),
        ).toBeVisible();

        await page.goto(
          '/register',
        );

        await expect(
          page.locator(
            'form.auth-form',
          ),
        ).toBeVisible();

        await context.close();
      },
    );

    /* =========================
       Authentication Validation
    ========================= */

    test(
      'auth forms validate required fields',
      async ({
        browser,
        baseURL,
      }) => {
        const context =
          await browser.newContext({
            baseURL,

            storageState: {
              cookies: [],
              origins: [],
            },
          });

        const page =
          await context.newPage();

        let loginRequests = 0;
        let registerRequests = 0;

        await page.route(
          '**/api/auth/login',
          async (route) => {
            loginRequests++;

            await route.abort();
          },
        );

        await page.route(
          '**/api/auth/register',
          async (route) => {
            registerRequests++;

            await route.abort();
          },
        );

        /* =========================
           Login Validation
        ========================= */

        await page.goto(
          '/login',
        );

        await page.locator(
          '.submit-button',
        ).click();

        await expect(
          page.locator(
            '#login-email',
          ),
        ).toHaveClass(
          /ng-invalid/,
        );

        await expect(
          page.locator(
            '#login-password',
          ),
        ).toHaveClass(
          /ng-invalid/,
        );

        await expect(
          page.locator(
            '.field-error',
          ),
        ).toHaveCount(2);

        await expect(
          page,
        ).toHaveURL(
          (url) =>
            url.pathname ===
            '/login',
        );

        expect(
          loginRequests,
        ).toBe(0);

        /* =========================
           Register Validation
        ========================= */

        await page.goto(
          '/register',
        );

        await page.locator(
          '.submit-button',
        ).click();

        await expect(
          page.locator(
            '#register-name',
          ),
        ).toHaveClass(
          /ng-invalid/,
        );

        await expect(
          page.locator(
            '#register-email',
          ),
        ).toHaveClass(
          /ng-invalid/,
        );

        await expect(
          page.locator(
            '#register-password',
          ),
        ).toHaveClass(
          /ng-invalid/,
        );

        await expect(
          page.locator(
            '#confirm-password',
          ),
        ).toHaveClass(
          /ng-invalid/,
        );

        await expect(
          page.locator(
            '.field-error',
          ),
        ).toHaveCount(4);

        await expect(
          page,
        ).toHaveURL(
          (url) =>
            url.pathname ===
            '/register',
        );

        expect(
          registerRequests,
        ).toBe(0);

        await context.close();
      },
    );
  },
);