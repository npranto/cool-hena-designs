# Cool Henna Designs — Tickets (MVP+)

**Stack context:** Next.js 16, React 19, Tailwind 4, TypeScript, Netlify. Default assumptions: Postgres (e.g. Supabase), Stripe Checkout, embedded helpdesk/chat for messaging—adjust tickets if you choose pure SaaS booking (e.g. Cal.com) instead.

---

## Order overview

| Order | ID     | Title                                        |
| ----- | ------ | -------------------------------------------- |
| 1     | CHD-1  | Architecture decision record & env matrix    |
| 2     | CHD-2  | Netlify + Next runtime hardening             |
| 3     | CHD-3  | Database project & schema v1                 |
| 4     | CHD-4  | Stripe account & webhook endpoint            |
| 5     | CHD-5  | Create booking + Checkout Session API        |
| 6     | CHD-6  | Slot model & conflict rules                  |
| 7     | CHD-7  | Refund path (API or Dashboard)               |
| 8     | CHD-8  | Admin authentication                         |
| 9     | CHD-9  | Admin dashboard: booking list & filters      |
| 10    | CHD-10 | Accept / decline / propose alternate         |
| 11    | CHD-11 | Replace booking form with real flow          |
| 12    | CHD-12 | Policy pages (cancellation, deposit, safety) |
| 13    | CHD-13 | Spam & abuse basics                          |
| 14    | CHD-14 | Gallery content pipeline                     |
| 15    | CHD-15 | Embed unified messaging + booking context    |
| 16    | CHD-16 | Transactional email                          |
| 17    | CHD-17 | E2E smoke tests                              |
| 18    | CHD-18 | Production cutover checklist                 |
| 19    | CHD-19 | Post-launch monitoring & runbook             |

---

## Epic 0 — Foundation & environment

### CHD-1 — Architecture decision record (ADR) & env matrix

**Summary:** Lock decisions for database, admin auth, Stripe integration shape (Checkout vs Payment Links), gallery approach (headless CMS vs media host vs git-based), and messaging (embedded widget vs email-first). Document which variables are `NEXT_PUBLIC_*` vs server-only secrets for Netlify.

**Acceptance criteria:**

- [ ] Short ADR or README section lists chosen stack and rejected alternatives in one line each.
- [ ] Env var matrix: name, purpose, public vs secret, required for local vs prod.
- [ ] Clear note on what runs locally vs production-only (webhooks, etc.).

**Depends on:** —

**Notes:** Blocks any API or deploy work that would otherwise churn.

---

### CHD-2 — Netlify + Next runtime hardening

**Summary:** Align Node version with `package.json` / team standard, confirm build command and publish output for Next on Netlify, and ensure API routes or Netlify Functions / Edge can host Stripe webhooks. Add redirects for apex/`www` and HTTPS if applicable.

**Acceptance criteria:**

- [ ] Production build succeeds on Netlify; preview deploys work for PRs.
- [ ] Documented base URL for Stripe webhook registration.
- [ ] Redirect rules verified (if custom domain).

**Depends on:** CHD-1

---

### CHD-3 — Database project & schema v1

**Summary:** Create the database project (e.g. Supabase), define initial tables aligned to the MVP model: `customers`, `service_offerings`, `bookings`, `payments` (or Stripe fields on `bookings`), with indexes for `status` and time-range queries. Use migrations (SQL, Prisma, Drizzle, etc.—one approach only).

**Acceptance criteria:**

- [ ] Migrations live in the repo; empty DB can be recreated from scratch.
- [ ] README or ticket comment explains how to run migrations locally and in CI.
- [ ] Foreign keys and enums (or check constraints) match documented state machine for bookings.

**Depends on:** CHD-1

---

## Epic 1 — Payments & booking core

### CHD-4 — Stripe account & webhook endpoint (serverless)

**Summary:** Implement a POST handler for Stripe webhooks (`checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`—subscribe only to events you use). Verify signatures with the webhook secret; implement idempotency (e.g. `stripe_event_id` store or idempotent processing). Map events to `booking_id` via Stripe object metadata.

**Acceptance criteria:**

- [ ] Webhook succeeds in Stripe test mode with official CLI or dashboard test.
- [ ] Duplicate delivery does not double-update booking/payment state.
- [ ] No secrets exposed to the client bundle.

**Depends on:** CHD-3, CHD-2

---

### CHD-5 — Create booking + Checkout Session API

**Summary:** Server action or API route: validate input (service, slot, customer email/name), insert `booking` row (`requested` or `pending_payment` per ADR), create Stripe Checkout Session with `metadata.bookingId` (and line items / amounts per policy), return the Checkout URL to the client.

**Acceptance criteria:**

- [ ] Happy path: DB row created, redirect to Stripe Checkout works.
- [ ] Invalid or taken slot returns a clear error without charging.
- [ ] Rate limiting or basic abuse consideration documented (full implementation in CHD-13).

**Depends on:** CHD-3, CHD-4 (metadata contract agreed)

---

### CHD-6 — Slot model & conflict rules

**Summary:** Define availability: weekly template + exceptions, manual slot rows, or external calendar sync (later). Implement reservation logic so two clients cannot claim the same slot (transaction boundary or unique constraint). Document timezone handling: store UTC + IANA timezone; display in client-appropriate local time.

**Acceptance criteria:**

- [ ] Documented model for “what is a slot” and who owns the calendar.
- [ ] Concurrent or rapid double-submit cannot double-book the same slot.
- [ ] Timezone behavior verified with at least one non-default zone in tests or manual checklist.

**Depends on:** CHD-3

---

### CHD-7 — Refund path (API or documented Dashboard flow)

**Summary:** For MVP+, implement either an admin-only “Refund” action calling Stripe’s Refund API with server-side checks, or a strict operational runbook using Stripe Dashboard plus DB sync via webhook. Persist refund status on `booking` / `payment` rows.

**Acceptance criteria:**

- [ ] Cancelled or declined booking can result in money returned per policy.
- [ ] UI or admin reflects `refunded` / partial state; webhooks reconcile async updates.
- [ ] Policy for “who may refund” is documented (owner-only, etc.).

**Depends on:** CHD-4, CHD-5

---

## Epic 2 — Admin & approvals

### CHD-8 — Admin authentication

**Summary:** Protect `/admin` (or equivalent) with Supabase Auth allowlisted emails, Netlify Identity, or another ADR-approved method. Use Next.js 16–appropriate session/cookie patterns; no public access to booking PII.

**Acceptance criteria:**

- [ ] Unauthenticated users cannot list or mutate bookings.
- [ ] Session expiry behavior is acceptable for occasional admin use.
- [ ] If using RLS, admin policies reviewed for least privilege.

**Depends on:** CHD-1, CHD-3

---

### CHD-9 — Admin dashboard: booking list & filters

**Summary:** Table view: date/time, customer, service, status, payment state. Filters for new / confirmed / declined / cancelled. Links out to Stripe customer or payment when useful.

**Acceptance criteria:**

- [ ] Owner can scan “today” and “needs action” without raw SQL.
- [ ] Usable on a phone at minimum (scrollable table or card layout).

**Depends on:** CHD-8, CHD-5

---

### CHD-10 — Accept / decline / propose alternate

**Summary:** Actions update `booking.status` with valid transitions only. Optional email to client (CHD-16). If decline after payment, integrate with refund policy (CHD-7). Optional “propose alternate slot” may create a new pending state or message (align with product rules).

**Acceptance criteria:**

- [ ] Documented state machine; invalid transitions rejected.
- [ ] Customer receives appropriate notification when implemented (email ticket).

**Depends on:** CHD-9, CHD-7

---

## Epic 3 — Public site integration

### CHD-11 — Replace booking form with real flow

**Summary:** Replace the current UI-only `BookingForm` with a flow wired to CHD-5 / CHD-6: service → slot selection → customer details → pay → confirmation page with booking reference.

**Acceptance criteria:**

- [ ] End-to-end path works in Stripe test mode.
- [ ] Accessible labels, errors, and focus management on validation failure.

**Depends on:** CHD-5, CHD-6

---

### CHD-12 — Policy pages (cancellation, deposit, allergy/safety)

**Summary:** Dedicated routes or anchored sections with stable URLs for cancellation, deposits, travel, and allergy/safety. Link from booking flow and footer. Store `policyVersion` or snapshot on `booking` at checkout if required.

**Acceptance criteria:**

- [ ] Legal/operational copy present; booking acknowledges key terms if required by ADR.
- [ ] URLs stable for marketing and email links.

**Depends on:** CHD-11

---

### CHD-13 — Spam & abuse basics

**Summary:** Add Cloudflare Turnstile or hCaptcha on booking submission; rate limit session creation by IP; optional honeypot field.

**Acceptance criteria:**

- [ ] Automated abuse is materially reduced without blocking normal users.
- [ ] Failure modes (CAPTCHA expired) are user-recoverable.

**Depends on:** CHD-11

---

## Epic 4 — Gallery (MVP+)

### CHD-14 — Gallery content pipeline (“minutes to live”)

**Summary:** Implement the ADR-chosen approach: CMS webhook → rebuild, on-demand revalidation, or runtime fetch. Replace placeholder tiles in `GallerySection` with real images, alt text, and responsive layout; optimize for LCP (Next/Image or provider transforms).

**Acceptance criteria:**

- [ ] Non-developer can add/reorder images in roughly 15 minutes.
- [ ] Site updates without code deploy if that was the ADR goal; otherwise document one-command deploy.
- [ ] Images have alt text for accessibility.

**Depends on:** CHD-1, CHD-2

---

## Epic 5 — Messaging (MVP+)

### CHD-15 — Embed unified messaging + booking context

**Summary:** Add site-wide widget (e.g. Crisp, Intercom). Pass `email` and `bookingId` after identification or post-checkout. Document that the owner uses the provider’s inbox as the single pane for threads. Update privacy policy for third-party chat.

**Acceptance criteria:**

- [ ] Customers can continue a thread in the widget; owner sees all threads in provider dashboard.
- [ ] Privacy policy mentions chat vendor and data retention at a high level.

**Depends on:** CHD-11

---

### CHD-16 — Transactional email

**Summary:** Integrate Resend, Postmark, or SendGrid: booking received, payment confirmed, accepted/declined; optional 24h reminder (MVP+). Templates include booking reference and link to policies/contact.

**Acceptance criteria:**

- [ ] Emails send in production; API keys server-only.
- [ ] Failures logged; retries or dead-letter strategy noted.

**Depends on:** CHD-5, CHD-10

---

## Epic 6 — Quality & launch

### CHD-17 — E2E smoke tests

**Summary:** Add Playwright or Cypress: home → booking → Stripe test card → confirmation; admin login → booking visible. Run in GitHub Actions on PR (extend existing workflows).

**Acceptance criteria:**

- [ ] CI fails if critical path breaks.
- [ ] Secrets for E2E documented (test keys only).

**Depends on:** CHD-11, CHD-8

---

### CHD-18 — Production cutover checklist

**Summary:** Stripe live mode keys, live webhook URL, production CMS/media, DNS and SSL, optional Sentry. Publish privacy/terms for payments and messaging. Rollback: feature-flag or disable booking CTA.

**Acceptance criteria:**

- [ ] Checklist document with owner sign-off line.
- [ ] Rollback path tested once in staging.

**Depends on:** All epics shipped for MVP+ scope.

---

### CHD-19 — Post-launch monitoring & runbook

**Summary:** One-pager: failed webhooks, stuck `pending_payment`, refund requests, escalation to Stripe support, who to call for domain/CMS. Bookmark Stripe Dashboard searches.

**Acceptance criteria:**

- [ ] Runbook stored alongside tickets or in `docs/`.
- [ ] Owner knows how to check “did payment land?” without developer.

**Depends on:** CHD-18

---

## Optional reordering

- **Gallery before messaging:** If portfolio is blocking launch, complete CHD-14 before CHD-15–CHD-16.
- **SaaS booking:** If using Cal.com (or similar) for slots, replace CHD-5/CHD-6 with integration tickets and align CHD-4 with that product’s payment events.

---

## References

- Product/architecture context: single-page marketing site today; `GallerySection` placeholders; `BookingForm` UI-only (`components/booking-form.tsx`).
- Deploy: `netlify.toml`, Node 22 in Netlify env.
