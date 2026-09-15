import {
  expect,
  test as setup,
} from '@playwright/test';

const authFile =
  '.auth/user.json';

setup(
  'authenticate',
  async ({ page }) => {
    const email =
      process.env[
        'MONEYFLOW_E2E_EMAIL'
      ];

    const password =
      process.env[
        'MONEYFLOW_E2E_PASSWORD'
      ];

    if (
      !email ||
      !password
    ) {
      throw new Error(
        'MONEYFLOW_E2E_EMAIL and MONEYFLOW_E2E_PASSWORD are required.',
      );
    }

    await page.goto(
      '/login',
    );

    await page
      .locator(
        'input[formcontrolname="email"]',
      )
      .fill(email);

    await page
      .locator(
        'input[formcontrolname="password"]',
      )
      .fill(password);

    await page
      .locator(
        'button[type="submit"]',
      )
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/dashboard/,
    );

    await page.context()
      .storageState({
        path: authFile,
      });
  },
);