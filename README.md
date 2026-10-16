# VaultPay Financial Core

Enterprise invoice and payment management demo for Nexus Corporate Services. Admin and client portals use React/Vite; the API uses Express, MongoDB/Mongoose, JWT, Stripe Checkout, PDFKit, and Nodemailer.

## Deployment

Frontend:
https://prodesk-mission-20-hyuk.vercel.app/

https://prodesk-mission-20.vercel.app/

Backend:
https://prodesk-mission-20-2.onrender.com
## Features

- Role-based admin and client workspaces; JWT is held in an HttpOnly, SameSite cookie.
- Server-side role checks, ownership-scoped invoice queries, 401/403 distinction, body validation, Helmet, request rate limits, and configurable CORS.
- Invoice lifecycle, search, status filters, dashboards, customer profile, billing history, and backend-generated invoice/receipt PDFs.
- Stripe Checkout sessions derive price and currency from MongoDB. The raw-body webhook verifies Stripe signatures, validates invoice/session/amount/currency, and stores event IDs for idempotency before setting an invoice paid.
- Receipt email and payment record are created on verified success. SMTP failures are safely logged.
- Development seed with one admin and three clients, sample invoice states, and manual security audit instructions.

## Screenshots
<img width="1532" height="682" alt="Screenshot 2026-10-16 140503" src="https://github.com/user-attachments/assets/b07eceb1-768c-4cea-bef9-26d7d8cbf16e" />
<img width="1530" height="672" alt="Screenshot 2026-10-16 141005" src="https://github.com/user-attachments/assets/d2fe4960-9341-4c11-bcf9-a7c2463ba1a8" />
<img width="1238" height="693" alt="Screenshot 2026-10-16 140645" src="https://github.com/user-attachments/assets/86892875-cf33-4ae2-b5e7-35850d7e1112" />
<img width="766" height="590" alt="Screenshot 2026-10-16 140941" src="https://github.com/user-attachments/assets/693dbc87-1078-4b09-a803-8feca59a21f9" />

## Structure

`client/` React application. `server/src/` API entry point, models, middleware, services. `server/scripts/seed.js` development seed. `server/tests/` API test starter. Root `README.md`, `Prompts.md`, and `.env.example`.

## Prerequisites and setup

Node.js 20.19+ or 22.12+, npm, and a MongoDB Atlas database (or local MongoDB). From PowerShell:

```powershell
cd 'C:\Prodesk IT Mission 20\server'
Copy-Item .env.example .env
npm install
# Set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD and optional Stripe/SMTP variables in .env
npm run seed
npm run dev
```

In a second terminal:

```powershell
cd 'C:\Prodesk IT Mission 20\client'
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. Set VITE_API_URL to the server API origin. Do not use production credentials in demo environments.

### MongoDB Atlas

Create a project and database user, restrict network access to your development/deployed API IPs, copy the driver connection string into `MONGODB_URI`, and replace the database name and placeholders. Keep credentials out of source control.

### Stripe test mode

Create a Stripe account and use test mode keys in `STRIPE_SECRET_KEY`. Set `STRIPE_WEBHOOK_SECRET` from Stripe CLI or the endpoint configuration. The Checkout integration only accepts USD invoices to avoid currency exponent ambiguity; invoice amounts are validated to two decimal places and converted to integer cents.

Install Stripe CLI, then run:

```powershell
stripe login
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Copy the displayed `whsec_...` value into server `.env` and restart. Test with Stripe's documented test card `4242 4242 4242 4242`, a future expiry, any CVC, and a test postal code. For asynchronous payment paths use Stripe CLI event triggers and verify the webhook event. A success redirect alone never changes payment status.

### SMTP

Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM. Without these values, payment is recorded and receipt generation still works, while delivery failures are logged without exposing credentials.

## Demo accounts

After `npm run seed`, credentials are the configured ADMIN_EMAIL/ADMIN_PASSWORD (defaults `admin@vaultpay.demo` / `ChangeThisDemoPassword123!`) and clients `alex@northstar.example`, `maya@apex.example`, `liam@meridian.example` with password `ClientDemo123!`. These are development-only demo credentials; change them before exposing the app. Seed upserts only its named demo accounts, invoices, and demo payment references; it leaves other database records intact and refuses to run when NODE_ENV is production.

## API overview

- Auth: `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me`
- Admin: `GET /api/admin/dashboard`, `GET /api/admin/clients`, `GET|POST /api/admin/invoices`, `GET|PATCH /api/admin/invoices/:id`
- Client: `GET /api/client/dashboard`, `GET /api/client/invoices`, `GET /api/client/invoices/:id`, `GET|PATCH /api/client/profile`
- Payments: `POST /api/payments/create-checkout-session`, `GET /api/payments/history`
- Documents: `GET /api/invoices/:id/pdf`, `GET /api/invoices/:id/receipt`
- Stripe: raw body `POST /api/webhooks/stripe`

All private routes require the session cookie. Client reads verify ownership and return 403 when a valid invoice ID belongs to another user. Unknown IDs return 404; malformed IDs return 400.

## Verification and security audit

`cd server; npm test` runs the Node test suite. Verify manually with two client accounts: login as client A; request an invoice belonging to client B through both JSON and PDF routes; expect 403. Repeat without a cookie; expect 401. Try malformed Mongo IDs (400), client calls to admin routes (403), and public registration with `role: admin` (role is ignored). Replay a signed Stripe event to verify event idempotency; submit a forged signature and expect 400 with no invoice status change. See `server/tests/SECURITY_AUDIT.md` for a checklist.

## Deployment

Deploy the client static build to Vercel (`client` as root, `npm run build`, output `dist`; `client/vercel.json` includes SPA route fallback) and set `VITE_API_URL` to the API URL. Deploy `server` to Render as a Node web service (`npm install`, `npm start`), configure all server environment variables, set `CLIENT_URL` to the deployed frontend, and use a restricted MongoDB Atlas network policy. Configure a Stripe webhook endpoint to `https://<api-host>/api/webhooks/stripe` for completed and asynchronous Checkout session events. Enable HTTPS; cookies are Secure automatically in production. Do not deploy sample secrets or run the seed in production.

## Commands

Server: `npm run dev`, `npm start`, `npm run seed`, `npm test`. Client: `npm run dev`, `npm run build`, `npm run preview`.


Client registration is closed by default. To enable client self-registration after your own onboarding review, set ALLOW_CLIENT_REGISTRATION=true in server/.env; public registration always creates client-role accounts.
