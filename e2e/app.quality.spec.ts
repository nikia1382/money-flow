import {
  expect,
  test,
} from '@playwright/test';

const pages = [
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
  '/premium',
];

test.describe(
  'MoneyFlow UI quality',
  () => {
    for (const path of pages) {
      test(
        `${path} UI quality`,
        async ({ page }) => {
          const consoleErrors:
            string[] = [];

          page.on(
            'console',
            (message) => {
              if (
                message.type() ===
                'error'
              ) {
                consoleErrors.push(
                  message.text(),
                );
              }
            },
          );

          await page.addInitScript(
            () => {
              localStorage.setItem(
                'language',
                'en',
              );

              localStorage.setItem(
                'appearance',
                'light',
              );

              localStorage.removeItem(
                'theme',
              );
            },
          );

          await page.goto(path);

          await expect(
            page.locator(
              '.main-layout',
            ),
          ).toBeVisible();

          await page.waitForLoadState(
            'networkidle',
          );

          /*
           * بررسی اسکرول افقی ناخواسته
           */

          const overflow =
            await page.evaluate(
              () => ({
                viewportWidth:
                  document.documentElement
                    .clientWidth,

                contentWidth:
                  document.documentElement
                    .scrollWidth,
              }),
            );

          expect.soft(
            overflow.contentWidth,
            `Horizontal overflow on ${path}`,
          ).toBeLessThanOrEqual(
            overflow.viewportWidth + 2,
          );

          /*
           * بررسی نمایش کلید خام ترجمه
           */

          const bodyText =
            await page
              .locator('body')
              .innerText();

          const rawTranslationKeys =
            bodyText.match(
              /\b(?:auth|dashboard|accounts|transactions|budgets|recurringPayments|debts|goals|notifications|settings|profile|help|premium)\.[a-zA-Z][a-zA-Z0-9_.]*/g,
            ) ?? [];

          expect.soft(
            [
              ...new Set(
                rawTranslationKeys,
              ),
            ],
            `Raw translation keys on ${path}`,
          ).toEqual([]);

          /*
           * بررسی دکمه‌های بدون متن یا
           * aria-label
           */

          const unnamedButtons =
            await page
              .locator('button')
              .evaluateAll(
                (buttons) =>
                  buttons
                    .map(
                      (
                        button,
                        index,
                      ) => ({
                        index,

                        text:
                          button.textContent
                            ?.trim() ??
                          '',

                        ariaLabel:
                          button.getAttribute(
                            'aria-label',
                          ) ?? '',

                        title:
                          button.getAttribute(
                            'title',
                          ) ?? '',
                      }),
                    )
                    .filter(
                      (button) =>
                        !button.text &&
                        !button.ariaLabel &&
                        !button.title,
                    ),
              );

          expect.soft(
            unnamedButtons,
            `Unnamed buttons on ${path}`,
          ).toEqual([]);

          /*
           * بررسی IDهای تکراری
           */

          const duplicateIds =
            await page.evaluate(
              () => {
                const ids =
                  Array.from(
                    document.querySelectorAll(
                      '[id]',
                    ),
                  )
                    .map(
                      (element) =>
                        element.id,
                    )
                    .filter(Boolean);

                return ids.filter(
                  (id, index) =>
                    ids.indexOf(id) !==
                    index,
                );
              },
            );

          expect.soft(
            [
              ...new Set(
                duplicateIds,
              ),
            ],
            `Duplicate IDs on ${path}`,
          ).toEqual([]);

          /*
           * بررسی خطاهای Console
           */

          expect.soft(
            consoleErrors,
            `Console errors on ${path}`,
          ).toEqual([]);
        },
      );
    }
  },
);