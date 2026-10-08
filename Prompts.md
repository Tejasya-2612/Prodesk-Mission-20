# Implementation and verification record

AI assistance helped shape the React/Vite and Express/Mongoose architecture, the role and ownership boundaries, Stripe Checkout and raw webhook verification, PDFKit invoice/receipt generation, Nodemailer receipt delivery, and security middleware. The implementation is JavaScript throughout. Admin and client workspaces use protected layouts; server routes enforce roles and ownership.

The Stripe webhook is mounted with `express.raw()` before JSON parsing and verifies signatures with `stripe.webhooks.constructEvent`. Invoice state changes only after the event, stored invoice/session association, client metadata, amount, and currency match. Webhook event IDs, unique Stripe session payment records, and conditional invoice status updates reduce duplicate processing. Emails attach the backend-generated receipt; delivery failures log a safe message.

Verification executed on 2026-10-03 (local project date):

- `client`: `npm run build` succeeded after splitting the chart into a lazy-loaded module and enabling Tailwind v4. Final build output had no oversized chunk warning.
- `server`: `npm test -- --test-reporter=spec` passed 8 tests for API health, unauthenticated 401 behavior, closed registration, invalid webhook signatures, amount validation, checkout metadata/amount matching, and signature rejection.
- `server`: `node --check src/index.js` succeeded.
- `server`: `npm audit --omit=dev` reported zero vulnerabilities after upgrading Nodemailer.
- Development servers: Vite and the API test-mode server started; `GET /` returned HTTP 200 and `GET /api/health` returned `ok`.

Database-backed login, ownership/IDOR cases, PDF authorization against seeded records, live Stripe Checkout/webhook delivery, and SMTP delivery were not exercised because no MongoDB, Stripe, or SMTP credentials were supplied. `server/tests/SECURITY_AUDIT.md` describes manual checks to complete after configuration. Do not treat these external integration checks as passed.
