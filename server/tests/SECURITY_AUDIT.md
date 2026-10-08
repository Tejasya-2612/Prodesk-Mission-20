# Security audit checklist

- [ ] No cookie: private API responds 401.
- [ ] Client cannot access admin API (403).
- [ ] Client A requests client B invoice JSON, PDF, receipt, or checkout: 403.
- [ ] Invalid ObjectId: 400.
- [ ] Public registration role=admin is ignored.
- [ ] Checkout amount and currency are read from stored invoice, never request body.
- [ ] Invalid Stripe signature is rejected without database changes.
- [ ] Replay identical verified Stripe event; exactly one payment and receipt email attempt.
- [ ] Success return URL without webhook leaves invoice unpaid.
- [ ] Production errors contain no stack or secrets; cookies are Secure.
