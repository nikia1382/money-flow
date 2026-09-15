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

interface AppPage {
  name: string;
  path: string;
}

interface Variant {
  language: Language;
  appearance: Appearance;
}

const pages: AppPage[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
  },
  {
    name: 'accounts',
    path: '/accounts',
  },
  {
    name: 'transactions',
    path: '/transactions',
  },
  {
    name: 'budgets',
    path: '/budgets',
  },
  {
    name:
      'recurring-payments',
    path:
      '/recurring-payments',
  },
  {
    name: 'debts',
    path: '/debts',
  },
  {
    name: 'goals',
    path: '/goals',
  },
  {
    name: 'notifications',
    path: '/notifications',
  },
  {
    name: 'settings',
    path: '/settings',
  },
  {
    name: 'profile',
    path: '/profile',
  },
  {
    name: 'help',
    path: '/help',
  },
  {
    name: 'premium',
    path: '/premium',
  },
];

const variants: Variant[] = [
  {
    language: 'en',
    appearance: 'light',
  },
  {
    language: 'fa',
    appearance: 'dark',
  },
];

async function prepareAppearance(
  page: Page,
  variant: Variant,
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

      localStorage.removeItem(
        'theme',
      );
    },
    variant,
  );
}

test.describe(
  'MoneyFlow authenticated pages',
  () => {
    for (
      const variant of variants
    ) {
      for (
        const appPage of pages
      ) {
        test(
          `${appPage.name} ${variant.language} ${variant.appearance}`,
          async ({ page }) => {
            await prepareAppearance(
              page,
              variant,
            );

            await page.goto(
              appPage.path,
            );

            await page.waitForLoadState(
              'networkidle',
            );

            await expect(
              page.locator(
                '.main-layout',
              ),
            ).toBeVisible();

            await expect(
              page,
            ).toHaveScreenshot(
              `${appPage.name}-${variant.language}-${variant.appearance}.png`,
              {
                fullPage: true,
                animations:
                  'disabled',
              },
            );
          },
        );
      }
    }
  },
);