import {
  expect,
  test,
} from '@playwright/test';

import AxeBuilder from
  '@axe-core/playwright';

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
  'MoneyFlow accessibility',
  () => {
    for (const path of pages) {
      test(
        `${path} accessibility`,
        async ({
          page,
        }) => {
          await page.goto(path);

          await expect(
            page.locator(
              '.main-layout',
            ),
          ).toBeVisible();

          await page.waitForLoadState(
            'networkidle',
          );

          const results =
            await new AxeBuilder({
              page,
            })
              .withTags([
                'wcag2a',
                'wcag2aa',
                'wcag21a',
                'wcag21aa',
              ])
              .analyze();

          const violations =
            results.violations.map(
              (violation) => ({
                id:
                  violation.id,

                impact:
                  violation.impact,

                help:
                  violation.help,

                elements:
                  violation.nodes.map(
                    (node) =>
                      node.target,
                  ),
              }),
            );

          expect(
            violations,
          ).toEqual([]);
        },
      );
    }
  },
);