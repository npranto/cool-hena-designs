# ADR: Foundation architecture (CHD-1)

**Status:** Accepted (discovery complete)  
**Ticket:** CHD-1 — Architecture decision record & env matrix  
**Stack context:** Next.js 16, React 19, TypeScript. Deployment preference: Netlify or Vercel for the main app; other services on their native hosts.

---

## Context

Cool Henna Designs sells henna designs and event packages. Customers choose **artist** and **location**, select **one purchasable item per checkout**, schedule a slot whose duration comes from that item, and **prepay in full** at checkout. **Confirmation on successful payment** is the default, assuming the slot is validated or held so double-booking cannot occur.

- **Multi-artist, multi-location** under one brand; availability and conflicts are **per artist** (and per location if hours differ).
- **Timezone:** `America/New_York` for policy and display; store instants in **UTC** in the database.
- **Locale:** English-only MVP.
- **Cancellations:** Customers may cancel for **full refund** until the **scheduled start**; **automated** refunds on that path where possible; **admin** can issue refunds manually for exceptions.
- **Operational buffer:** At least **1 hour** between appointments by default; **same-day booking** allowed for now — both must be **configurable** without structural rewrites.
- **Data residency:** **US-only** for stored customer and booking data.
- **Admin:** **Invite-only**; no open admin registration.
- **Ops:** Single technical owner for migrations, webhooks, and logs; **responsive admin** (mobile and desktop).
- **Gallery / marketing content:** Non-technical editors, **weekly** updates; **CMS-level** publishing without a code deploy. Scale planning: ≤10 images per catalog item, ≤~100 gallery images, ≤~50 videos.
- **Messaging:** **Primary** channel is an **async on-site widget**; threads should **automatically include** booking context (booking id, artist, location, time, payment status).
- **Email:** Transactional mail; **fastest path to ship** (provider default domain acceptable at first).
- **SMS:** Not in MVP.
- **Volume:** ≤~10 paid bookings/day at launch; peak &lt;~50/day. **Uptime:** best effort.
- **Budget:** Lean; pay modestly more for industry-standard tools that reduce risk or editor friction; **avoid** a long tail of overlapping SaaS.

**Compliance (MVP):** US-focused, standard small-business practice (privacy policy, sensible retention, secure handling of PII). Not a full GDPR program unless scope expands.

**PII baseline:** Name, email, phone; service location/venue; optional notes (allergies, preferences, event details); optional reference media — confirm whether uploads live in **your storage** vs **URLs only** at implementation.

---

## Decisions

| Area                     | Decision                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App hosting**          | Next.js on **Netlify** (current) or **Vercel**; not locked in, but prefer these PaaS options for the main app.                                                                                                                                                                                                                                                                    |
| **Database**             | **US-region Postgres** with **connection pooling** suitable for serverless (e.g. pooler or serverless driver). Implementation choice: e.g. **Neon** or **Supabase Postgres** — pick one vendor whose **US** region meets residency.                                                                                                                                               |
| **Migrations**           | **One** approach only: **Drizzle** or **Prisma** (TBD at CHD-3); migrations live in repo.                                                                                                                                                                                                                                                                                         |
| **Admin authentication** | **Hosted** invite-only flow (**Supabase Auth** if DB is Supabase, else **Clerk** or equivalent) plus app-level **admin** role / allowlist.                                                                                                                                                                                                                                        |
| **Stripe integration**   | **Checkout Sessions** created server-side with `metadata` tying payment to `bookingId` (and artist, location, product identifiers as needed). **Webhooks** update booking/payment state; **idempotent** processing.                                                                                                                                                               |
| **Catalog vs CMS**       | **Headless CMS** for gallery and editorial content (titles, captions, alt text, sort order, tags, featured). **Commerce-critical fields** (price, duration, SKU linkage) — **recommended** source of truth: **database**, with CMS linking by stable slug/id to avoid editors breaking money fields. (If you later choose CMS-as-source for price, add strict validation/review.) |
| **Messaging**            | **Third-party async-capable widget**; pass **identify / custom attributes**: booking id, artist, location, start time, payment status.                                                                                                                                                                                                                                            |
| **Transactional email**  | **One** provider (e.g. Resend, Postmark, SendGrid); start with **shared/default sending domain**; move to **owned domain** + SPF/DKIM when ready.                                                                                                                                                                                                                                 |

---

## Rationale (why these decisions)

### App hosting (Netlify / Vercel)

The main app is a **Next.js** deployment; Netlify and Vercel are the **default operational fit**: managed TLS, preview deploys, environment isolation, and documented integration with serverless/edge runtimes. That **reduces ops load** for a single technical owner and matches **CHD-2** scope (build, redirects, webhook URL stability). Staying **unlocked** to either vendor avoids painting into a corner if pricing or limits change; **backend services** (DB, CMS) stay on their native hosts so we do not force inappropriate workloads onto the frontend platform.

### Database (US Postgres + pooling)

Bookings, artists, locations, slots, payments, and configurable rules (buffer, same-day flags) are **relational** and **write-contended** at checkout. **Postgres** gives **ACID transactions**, constraints, and clear modeling for **per-artist** availability—better than document-only or SQLite-centric designs at this complexity. **US-only residency** is a stated requirement; a **US-region** managed Postgres satisfies that with less self-managed infrastructure than raw RDS for this team size.

**Connection pooling** (or a serverless-friendly driver) is required because **Netlify/Vercel-style** runtimes open **many short-lived** connections; without pooling, Postgres hits **connection limit** errors under normal traffic spikes (e.g. seasonal peaks under your stated &lt;50/day ceiling still include burst checkout).

### Migrations (one tool: Drizzle or Prisma)

A **single** migration story keeps **CHD-3** auditable: empty DB → `migrate` → known schema. **Drizzle** and **Prisma** are both widely used with Next.js, support **reviewable SQL** (directly or as generated artifacts), and run in **CI** the same way as locally. Picking **one** avoids split-brain schema sources and duplicate migration paths.

### Admin authentication (hosted, invite-only)

Requirements: **invite-only** admins, **no** public sign-up, **responsive** use. **Hosted** auth (e.g. Supabase Auth, Clerk) outsources **session security**, passwordless/magic flows, and **MFA** options later—areas that are easy to get wrong in custom code. Pairing with an app-level **admin** flag or allowlist keeps **authorization** explicit in your schema. **Supabase Auth** pairs naturally if Postgres is already on Supabase; otherwise **Clerk** (or similar) avoids tying identity to one DB vendor.

### Stripe (Checkout Sessions + webhooks + idempotency)

**Checkout Session** created **server-side** is the standard pattern when amounts, line items, and **metadata** (`bookingId`, artist, location) are **dynamic** per request—exactly your **one item per checkout** + scheduled service model. It gives a **hosted PCI boundary**, **success/cancel URLs**, and a **single** payment artifact to reconcile in webhooks.

**Webhooks** are the **source of truth** for paid/refunded state; the client must not trust redirect alone. **Idempotency** matters because Stripe **retries** deliveries; without storing processed event ids (or equivalent), you risk **double state transitions**.

**Payment Links** were rejected because they are optimized for **static** or pre-configured offers, not **slot-bound** bookings with rich **per-checkout metadata**.

### Catalog vs CMS (headless CMS + DB for commerce truth)

**Non-technical** staff need **weekly** updates **without** git or deploys—**headless CMS** is the right editor experience (roles, media library, optional preview).

Putting **price, duration, and SKU linkage** in the **database** (with CMS linking via **stable slug/id**) **separates concerns**: editors own **copy and imagery**; the app owns **money and scheduling math**. That reduces risk of accidental **wrong price** publishes and keeps refunds/chargebacks aligned with **one** authoritative catalog table. If price ever lives in CMS, add **review workflows** or guardrails—explicitly deferred for MVP simplicity.

### Messaging (async widget + booking context)

Product requirement: **primary** channel is **on-site**, **async** is acceptable. A **third-party widget** delivers a proven **inbox**, notifications, and mobile apps for staff without building chat infrastructure. Passing **identify / custom attributes** (booking id, artist, location, time, payment status) satisfies **support context** without asking customers to paste order numbers—fewer errors and faster resolution.

### Transactional email (one provider; default domain first)

Confirmations and lifecycle email are **required** for trust and operations; a **single** transactional vendor keeps **templates, API keys, and bounce handling** in one place. Starting on the provider’s **default sending domain** matches your **fastest path to ship**; moving to **your domain** with SPF/DKIM improves **branding and deliverability** when DNS is ready—no architectural change, only configuration.

### Environment variable matrix (why this shape)

**Secrets never ship to the client** except names intentionally prefixed for the browser (e.g. Stripe publishable key, public app URL). **Separate values per context** (local, preview, production) implements your **dev/prod isolation** requirement: preview deploys must not hit **live** Stripe or **prod** data. **One webhook secret per endpoint** is required because signature verification is **tied to the signing secret Stripe issues per destination**—mixing secrets across environments breaks verification and risks **wrong-environment** events being accepted. **Read-only CMS tokens** in production web reduce blast radius if the frontend is compromised.

### Local vs production (why behavior differs)

**Stripe webhooks** need a **public HTTPS** URL; locally, **Stripe CLI** (or a tunnel) is the standard substitute so you can run the **same handler code** without exposing your laptop. **Idempotency** must be **on in all environments** so retries during testing match production behavior. **Dedicated databases** per environment prevent preview branches from **corrupting or leaking** real customer data. **Auth callback URLs** and **widget workspaces** differ by environment so test traffic never pollutes **production** identity or support queues.

---

## Rejected alternatives (summary + why)

| Alternative                              | Why not (brief)                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Payment Links**                        | Cannot express **dynamic** slot + **per-booking metadata** cleanly; poor fit for programmatic booking creation.                                         |
| **Git-based gallery**                    | Editors are **non-technical** and update **weekly**; PR-based workflows add friction and **trainer cost**.                                              |
| **SMS-first / SMS reminders**            | Explicitly **out of MVP**; adds **cost**, **opt-in/consent**, and **carrier** edge cases without being required for launch.                             |
| **Email as primary support**             | Conflicts with chosen **widget-first** product direction; email stays **secondary** (confirmations, async follow-up).                                   |
| **SQLite as primary store**              | **Concurrent** checkout and **multi-artist** writes favor Postgres **locking and constraints**; migration to Postgres later is **expensive** once live. |
| **Manual approval before every payment** | Hurts **conversion** and complicates **slot holding** vs your **pay-to-confirm** model; **refunds** cover exceptions.                                   |
| **Many overlapping SaaS tools**          | Each integration is **secrets, monitoring, and failure modes**; a **small** set matches **lean budget** and **one** ops owner.                          |

---

## Environment variable matrix

Use **separate** values per **local**, **Netlify deploy previews**, and **production**. Names below are illustrative; align with chosen CMS/auth vendors.

| Name                                 | Purpose                                         | Public vs secret    | Local                   | Preview            | Production                        | Netlify notes                         |
| ------------------------------------ | ----------------------------------------------- | ------------------- | ----------------------- | ------------------ | --------------------------------- | ------------------------------------- |
| `DATABASE_URL`                       | Postgres (pooled) connection                    | **Secret**          | Dev DB                  | Preview/staging DB | Prod DB                           | **Deploy contexts**; never commit     |
| `DATABASE_DIRECT_URL`                | Direct URL for migrations (if required by tool) | **Secret**          | Yes                     | CI / migrate only  | Migrate only                      | Do not use for runtime serverless     |
| `STRIPE_SECRET_KEY`                  | Stripe server API                               | **Secret**          | Test                    | Test               | Live                              | Previews **must not** use live key    |
| `STRIPE_WEBHOOK_SECRET`              | Webhook signature verification                  | **Secret**          | From Stripe CLI         | Test endpoint      | Live endpoint                     | **One secret per endpoint**           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js / client                              | **Public**          | Test `pk_`              | Test `pk_`         | Live `pk_`                        | Browser-exposed                       |
| `NEXT_PUBLIC_APP_URL`                | Canonical URL for redirects/links               | **Public**          | `http://localhost:3000` | Preview URL        | `https://…`                       | Align with `URL` / `DEPLOY_PRIME_URL` |
| Session / OAuth secrets              | Provider-specific (e.g. `AUTH_SECRET`)          | **Secret**          | Dev                     | Preview            | Prod                              | Rotate on leak                        |
| `CMS_*` / `SANITY_*` etc.            | CMS API tokens, project ids                     | **Secret** (tokens) | Draft optional          | Preview token      | **Read-only** prod where possible | Prefer minimal scopes                 |
| `EMAIL_API_KEY`                      | Transactional email                             | **Secret**          | Sandbox                 | Sandbox            | Prod                              | Custom domain DNS later               |
| Widget install vars                  | Per vendor (`*_ID`, `*_SECRET`)                 | Per vendor docs     | Per env                 | Per env            | Prod                              | Often mix of public + server secret   |
| `CRON_SECRET`                        | Protect scheduled routes (if added)             | **Secret**          | N/A                     | Optional           | Yes                               | Netlify scheduled functions           |

**Stripe metadata contract (implement consistently):** At minimum `bookingId`; include `artistId`, `locationId`, and product/SKU identifiers as needed for support and reconciliation.

---

## Local vs production

| Concern                 | Local / preview                                                | Production                                                        |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Stripe webhooks**     | **Stripe CLI** (`listen` → localhost) or tunnel; **test** keys | **HTTPS** URL; **live** keys; monitor failed deliveries in Stripe |
| **Webhook idempotency** | Same code path; test event ids                                 | **Required**; persist `stripe_event_id` (or equivalent)           |
| **Database**            | Dedicated dev (US)                                             | Dedicated prod (US); **no** shared DB with dev                    |
| **Admin auth**          | Dev / test tenant or keys                                      | Production tenant; **strict** callback URLs                       |
| **CMS**                 | Staging / draft dataset                                        | Published content; caching / revalidation as designed             |
| **Email**               | Sandbox / suppress                                             | Real delivery; upgrade domain when DNS ready                      |
| **Widget**              | Vendor test workspace if available                             | Production workspace                                              |

---

## What we are explicitly not doing (MVP)

- SMS notifications and phone-based 2FA (unless added later).
- Multi-language / i18n.
- Custom PDF invoices or accounting export (Stripe receipt + on-site confirmation suffice initially).
- Payment Links as the primary checkout path.
- Customer account login (optional future enhancement for “my bookings”).

---

## Next tickets

- **CHD-2** — Netlify + Next runtime hardening (build, webhook base URL, redirects).
- **CHD-3** — Database project, schema v1, migrations.
- Subsequent tickets assume this ADR unless superseded by a new ADR.

---

## Open decisions at implementation time

- **ORM:** Drizzle vs Prisma.
- **Postgres vendor:** Neon vs Supabase (or other **US** managed Postgres) — confirm region and subprocessors.
- **Admin auth vendor:** Supabase Auth vs Clerk (if not using Supabase for DB).
- **CMS and widget:** Specific products — shortlist against US-only, invite-only admin, and metadata APIs.
- **Customer reference photos:** URL-only MVP vs upload to **US** object storage (privacy + env vars).
