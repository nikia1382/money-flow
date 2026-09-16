# MoneyFlow free cloud deployment

This setup uses:

- **Cloudflare Pages** for the Angular frontend
- **Koyeb Free Instance** for the Spring Boot API
- **Neon Free** for PostgreSQL

The browser calls `/api` on the same Cloudflare domain. A Pages Function securely forwards those requests to Koyeb, so the API URL is not hardcoded into the Angular bundle.

## 1. Merge and update the repositories

Make sure the deployment pull requests for both repositories are merged into `main`.

On your computer, update both projects:

```powershell
git switch main
git pull origin main
```

## 2. Create the Neon database

1. Sign in at <https://console.neon.tech>.
2. Create a project named `moneyflow`.
3. Choose a region near the Koyeb region you plan to use. Frankfurt is a good default.
4. Open **Connect** and keep the connection details private.
5. Record:
   - host
   - database name
   - role/user
   - password

Do not commit the connection string or password to GitHub.

## 3. Generate a JWT secret

Run this in PowerShell:

```powershell
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

Save the result temporarily. It will be stored as a secret in Koyeb.

## 4. Deploy the API to Koyeb

1. Sign in at <https://app.koyeb.com>.
2. Select **Create Web Service**.
3. Choose **GitHub** and repository `nikia1382/money-flow-api`.
4. Select branch `main`.
5. Select **Dockerfile** as the builder.
6. Choose the **Free Instance** and Frankfurt if available.
7. Set the exposed HTTP port to `8080`.
8. Configure the health check path as `/api/health`.
9. Add these environment variables:

| Name | Value |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://NEON_HOST/NEON_DATABASE?sslmode=require` |
| `DB_USERNAME` | Neon role/user |
| `DB_PASSWORD` | Neon password |
| `JWT_SECRET` | Generated Base64 value |
| `JWT_ISSUER` | `moneyflow-api` |
| `JPA_DDL_AUTO` | `update` |
| `JPA_SHOW_SQL` | `false` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:4200` |

10. Deploy and wait for the service to become healthy.
11. Open `https://YOUR-SERVICE.koyeb.app/api/health`.

Expected response:

```json
{"status":"ok"}
```

Copy the Koyeb service origin, without `/api/health`.

## 5. Deploy the frontend to Cloudflare Pages

1. Sign in to Cloudflare.
2. Open **Workers & Pages** and create a **Pages** project.
3. Connect GitHub and select `nikia1382/money-flow`.
4. Use these build settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | Angular |
| Build command | `npm run build` |
| Build output directory | `dist/money-flow/browser` |
| Node version | `20` or newer |

5. Add the encrypted environment variable:

| Name | Value |
| --- | --- |
| `BACKEND_URL` | `https://YOUR-SERVICE.koyeb.app` |

6. Deploy the Pages project.
7. Open the generated `.pages.dev` URL.

The `_redirects` file keeps Angular routes working after refresh. The Pages Function forwards all `/api/*` calls to Koyeb.

## 6. Verify the live application

Test in this order:

1. Open the registration page.
2. Create a new test user.
3. Sign in.
4. Create an account.
5. Add an income and an expense transaction.
6. Create a budget and a financial goal.
7. Refresh the browser on a nested route such as `/transactions`.
8. Sign out and sign in again.
9. Open Neon and confirm that tables and rows exist.
10. Check the browser console and Koyeb runtime logs for errors.

## 7. Free-tier behavior

- Cloudflare Pages does not sleep.
- Koyeb Free scales to zero after one hour without traffic. The first request after sleeping can be slower.
- Neon compute suspends when idle and resumes on demand.
- Never store financial data that matters only in a free demo environment.
- Never commit database credentials, JWT secrets, or generated Playwright auth state.

## 8. Automatic updates

After GitHub integration is enabled:

- pushes to frontend `main` automatically redeploy Cloudflare Pages
- pushes to backend `main` automatically redeploy Koyeb
- pull requests continue to run the existing GitHub Actions checks before merge
