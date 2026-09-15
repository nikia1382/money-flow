import {
  expect,
  Page,
  test,
} from '@playwright/test';

type Language =
  | 'en'
  | 'fa';

type Appearance =
  | 'light'
  | 'dark';

interface VisualVariant {
  language: Language;
  appearance: Appearance;
}

const variants:
  VisualVariant[] = [
    {
      language: 'en',
      appearance: 'light',
    },
    {
      language: 'fa',
      appearance: 'light',
    },
    {
      language: 'en',
      appearance: 'dark',
    },
    {
      language: 'fa',
      appearance: 'dark',
    },
  ];

async function preparePage(
  page: Page,
  language: Language,
  appearance: Appearance,
): Promise<void> {
  await page.addInitScript(
    ({
      language,
      appearance,
    }) => {
      localStorage.setItem(
        'language',
        language,
      );

      localStorage.setItem(
        'appearance',
        appearance,
      );

      /*
       * کلید قدیمی را حذف می‌کنیم تا
       * با appearance تداخل نداشته باشد.
       */
      localStorage.removeItem(
        'theme',
      );
    },
    {
      language,
      appearance,
    },
  );
}

test.describe(
  'Authentication visual consistency',
  () => {
    for (
      const variant of variants
    ) {
      test(
        `login ${variant.language} ${variant.appearance}`,
        async ({ page }) => {
          await preparePage(
            page,
            variant.language,
            variant.appearance,
          );

          await page.goto(
            '/login',
          );

          await page
            .locator('h1')
            .waitFor();

          await expect(
            page,
          ).toHaveScreenshot(
            `login-${variant.language}-${variant.appearance}.png`,
            {
              fullPage: true,
              animations:
                'disabled',
            },
          );
        },
      );

      test(
        `register ${variant.language} ${variant.appearance}`,
        async ({ page }) => {
          await preparePage(
            page,
            variant.language,
            variant.appearance,
          );

          await page.goto(
            '/register',
          );

          await page
            .locator('h1')
            .waitFor();

          await expect(
            page,
          ).toHaveScreenshot(
            `register-${variant.language}-${variant.appearance}.png`,
            {
              fullPage: true,
              animations:
                'disabled',
            },
          );
        },
      );
    }
  },
);