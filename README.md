# MoneyFlow Web

Angular frontend for MoneyFlow, a bilingual personal-finance application for managing accounts, transactions, budgets, recurring payments, debts, goals, notifications, and user settings.

## Stack

- Angular 20 with standalone components and signals
- Angular SSR
- ngx-translate (English and Persian/RTL)
- Chart.js and ng2-charts
- Playwright and axe-core for end-to-end, visual, quality, and accessibility checks

## Requirements

- Node.js 20 or newer
- npm
- The [MoneyFlow API](https://github.com/nikia1382/money-flow-api) running locally for authenticated features

## Local development

```bash
npm ci
npm start
```

The app is available at `http://localhost:4200`. Development requests use `http://localhost:8080/api`.

## Production configuration

Production builds use `/api` as the API base URL so the frontend and backend can be served behind the same domain or reverse proxy. Update `src/environments/environment.production.ts` if the API is hosted on another origin, and add that origin to the backend `CORS_ALLOWED_ORIGINS` variable.

```bash
npm run build
```

The production output is written to `dist/money-flow`.

## Tests

```bash
# Unit tests
npm run test:ci

# All Playwright tests
npm run e2e

# Functional checks
npm run e2e:functional

# Desktop and mobile accessibility checks
npm run e2e:accessibility
```

Authenticated Playwright tests require a running API and test credentials:

```powershell
$env:MONEYFLOW_E2E_EMAIL="your-test-user@example.com"
$env:MONEYFLOW_E2E_PASSWORD="your-test-password"
npm run e2e
```

Never commit real credentials or generated Playwright authentication state.

## CI

GitHub Actions installs dependencies and verifies the production build on pushes and pull requests. Full authenticated Playwright tests should run in an environment where the API, PostgreSQL, and dedicated E2E credentials are available.
