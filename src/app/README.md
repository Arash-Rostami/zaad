# `src/app/` — Next.js App Router, SEO, and API

> **Scope:** routing, the root layout, metadata/SEO/JSON-LD, sitemap/robots, and the
> API route handlers. Read this before editing anything under `src/app/`.

## Routes

| Segment | File | Type | Notes |
|---|---|---|---|
| `/` | `page.js` | Server (async) | `generateMetadata` via `MetadataService.forHome()`; calls `resolveHomeUtensilImages()` (`src/lib/collectionImages.js`) and renders `<JsonLd/>` + `<AppShell utensilImages={...}/>` (client) — the image list feeds `Story.jsx`'s auto-cycling carousel |
| `/about` | `(house)/about/page.js` | Server (async, `force-static`) | `generateMetadata` via `MetadataService.forAbout()`; renders `<JsonLd/>` + `<AboutChapter/>` (single-column `HouseChapterShell`) inside the shared `(house)/layout.js` chrome. |
| `/story` | `(house)/story/page.js` | Server (async, `force-static`) | `generateMetadata` via `MetadataService.forStory()`; renders `<JsonLd/>` + `<StoryValueChapter/>` — a two-column `HouseDiptychShell` pairing the `story` and `brandValue` `aboutSections` entries. |
| `/sustainability` | `(house)/sustainability/page.js` | Server (async, `force-static`) | `generateMetadata` via `MetadataService.forSustainability()`; renders `<JsonLd/>` + `<SustainabilityResponsibilityChapter/>` — a two-column `HouseDiptychShell` pairing the `sustainability` and `csr` `aboutSections` entries. |
| `(house)` shared layout | `(house)/layout.js` | Server | Renders `components/house/HouseSmoothScroll.jsx` (render-null client leaf mounting the shared `useLenisScroll` hook — gives House routes the same Lenis smooth-scroll as the showroom) + `components/house/HouseChrome.jsx` (slim header: back-to-showroom, ZAAD wordmark, the current page's name as a static underlined label — no `layoutId`, no multi-link nav; see CLAUDE.md's Load-bearing contracts — compact language/theme control) + `{children}` + `components/house/HouseFooter.jsx`. Not the showroom `Header`/`Footer`. |
| `/collection/[slug]` | `collection/[slug]/page.js` | Server (async) | `generateStaticParams` (en ids only), `generateMetadata` via `MetadataService.forCollection(item)`, `notFound()` on miss; renders `<JsonLd/>` + `<ProductPageClient item={item}/>` |
| `/collection/[slug]` leaf | `collection/[slug]/ProductPageClient.jsx` | Client (`"use client"`) | `onSelectProduct` given to `Header`: `router.push` to `/collection/${id}` for a real product, `router.push("/")` when `product` is `null` — `MenuPanel`'s Showroom/Blueprint portals call `onSelectProduct(null)` as a "clear selection" signal (harmless on the home page, where it's just `setSelectedProduct`); this leaf must not assume a non-null product |
| `/api/curate` | `api/curate/route.js` | Server route handler | `POST` only — the Gemini chat route (badge reads "AI Assistant"/"دستیار هوش مصنوعی" via `curatorModelBadge`; `chatCurator`/`curatorWelcome`/`curatorError` say "assistant"; the `zaadDigitalCurator` title remains "ZAAD Digital Curator"/"کیوریتور دیجیتال ZAAD") |
| `/api/inquiry` | `api/inquiry/route.js` | Server route handler | `POST` only — validates and persists the Concierge inquiry form (see "The `/api/inquiry` route" below) |
| `/api/health` | `api/health/route.js` | Server route handler | `GET` → `{ status, time }` |
| `/ledger` | `ledger/page.js` | Server (async, `force-dynamic`) | Private admin register of the inquiry data — key-gated, never cached, noindexed (see "The `/ledger` route" below) |
| root layout | `layout.js` | Server (async) | `metadata`, `viewport`, `RootLayout` |
| robots | `robots.js` | Server metadata file | `allow: "/"`, `disallow: ["/api/", "/ledger"]` |
| sitemap | `sitemap.js` | Server metadata file | `/`, `/about`, `/story`, `/sustainability`, `/showcase/index.html`, + dynamic `en.collection` ids |

There is **no** `loading.js`. There are three branded status boundaries, all `"use client"`
and all built on `components/shared/StatusScreen.jsx`:
- `not-found.js` — rendered inside the root layout (so `useLanguage()` works), CTA back to `/`.
- `error.js` — segment-level error boundary (`{error, reset}`), inside the root layout;
  "Try Again" calls `reset()`, secondary CTA returns to `/`.
- `global-error.js` — replaces the **entire** root layout including `<html>/<body>` when
  the root layout itself throws (e.g. inside `LanguageProvider`). Deliberately
  self-contained with inline styles and no `useLanguage()`/Tailwind dependency, since the
  thing that crashed may be the very context this boundary would otherwise rely on.

Global CSS lives at `src/styles/globals.css` (imported by the layout), **not** under `src/app/`.

## Server / client boundary (load-bearing)

The root layout is a **server** component. It runs `getServerLanguage()` (reads the
`zaad_preferred_language` cookie via `next/headers`) and passes the result as
`initialLanguage` to the **client** `LanguageProvider`:

```
<html lang={initialLanguage} dir={...} suppressHydrationWarning>
  <body className="bg-surface text-ink ...">
    <JsonLd schemas={[MetadataService.orgSchema]} />   // SSR
    <InitialLoader />                                    // "use client"
    <LanguageProvider initialLanguage={initialLanguage}> // "use client"
      <MotionRoot>{children}</MotionRoot>                // "use client"
    </LanguageProvider>
```

- `MotionRoot` (`components/shared/MotionRoot.jsx`) is a client leaf wrapping
  `{children}` in a root `MotionConfig reducedMotion="user"` — the one global lever
  that extends reduced-motion grace to the House routes and `collection/[slug]`,
  which don't pass through `AppShell`. The layout stays a server component; the
  provider and `MotionRoot` between them own the entire client boundary. See
  `src/components/README.md`'s MotionRoot section.

- Do **not** make the layout a client component, and do **not** drop the
  `initialLanguage` prop — the client `useState(initialLanguage)` seeds the first
  render to match the SSR `<html lang/dir>`.
- `suppressHydrationWarning` on `<html>` is required (the provider re-mutates
  `lang`/`dir`/`farsi-mode` client-side in a `useEffect`). `<body>` also carries it,
  for an unrelated reason: browser extensions (e.g. ColorZilla's `cz-shortcut-listen`)
  inject attributes onto `<body>` before React hydrates, which otherwise logs a false
  hydration-mismatch warning — not an app bug, don't chase it if it reappears.
- When `initialLanguage === "fa"`, the layout renders three `<link rel="preload">`
  lines (`/fonts/Dorsa-Regular.otf`, `Dorsa-Light.otf`, `Dorsa-Black.otf`,
  `crossOrigin="anonymous"`) at the top of `<body>` — React 19 hoists them into
  `<head>`. Dorsa is the only raw `@font-face` font (`font-display: swap`, so Farsi
  would otherwise flash Tahoma); Playfair/Inter/JetBrains are `next/font` and preload
  themselves. Keep the three files in sync with Farsi above-the-fold weight usage
  (400 body/headings, 300 `.font-mono` labels, 900 the `html[lang="fa"] .italic`
  accent rule — Hero's italic title span sits above the fold; **Black, not Heavy**:
  both declare weight 900 and the later `@font-face` declaration wins) — see
  `src/styles/README.md`'s Dorsa section. On the `force-static` routes the block
  no-ops (they bake `en`), which is accepted, not a bug.
- The home page's interactive UI (`AppShell`) is a client component, but Next.js still
  server-renders client components into the initial HTML, so `/`'s SSR payload is
  metadata + JSON-LD **plus** the server-rendered `AppShell` markup (interactive state
  hydrates client-side). The `/* pre-render components SSR */` comment in `page.js`
  refers to that shell pre-render — it is accurate, not misleading.

## Metadata / SEO / JSON-LD

Delegated to `src/services/MetaDataService.js` (see `src/services/README.md`):

- Home: `MetadataService.forHome()` → `WebSite` + `SearchAction` schema.
- Collection: `MetadataService.forCollection(item)` → `Product` + `BreadcrumbList`
  schema; canonical `${SITE_URL}/collection/${item.slug ?? item.id}`; description
  sliced to 155 chars.
- Layout: `MetadataService.orgSchema` → `Organization` JSON-LD (with placeholder
  `sameAs`/`contactPoint` — TODOs).

`JsonLd.jsx` (server component) emits one
`<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}/>`
per schema. **Any schema with non-serializable values or `</script>` in a string will
break.** Schemas come only from `MetadataService` static methods.

i18n metadata is **cookie-based, not URL-based** — `getServerLanguage()` reads the
cookie; there are no locale-prefixed routes.

## The `/api/curate` route

`api/curate/route.js` — `POST` only, no streaming. All AI-client and knowledge-grounding
logic lives in `services/CuratorService.js` (see `src/services/README.md`) — the route
itself only validates the request, assembles the system prompt, and shapes the response.

- **Request:** JSON `{ messages: [{ role, content }], language }`. Validates the
  `messages` array; 400 on bad input. `language` (sent by `hooks/useConcierge.js`) picks
  which locale's catalogue/house data grounds the answer — defaults to `en` in
  `CuratorService.buildContext` if omitted or not `"fa"`.
- **Grounding:** `systemInstruction` = the brand-tone `BRAND_HERITAGE_PROMPT` (voice/style
  only — no product facts) + `CuratorService.buildContext(language)` (the real product
  catalogue, House/brand copy, and acquisition/consultation strings pulled live from
  `lib/i18n/en.js`/`fa.js`, memoized per language). The old hardcoded fictional 3-item
  catalogue has been removed — do not reintroduce invented products/prices here.
- **AI client:** `CuratorService.generateReply({ contents, systemInstruction })` — routes
  to an OpenAI-compatible `POST {GEMINI_BASE_URL}/chat/completions` gateway (header
  `Authorization: apikey ${GEMINI_GATEWAY_API_KEY}`) when `GEMINI_BASE_URL` is set,
  otherwise falls back to the native `@google/genai` SDK with `GEMINI_API_KEY` and
  `GEMINI_MODEL` (default `gemini-2.5-flash`). Swapping provider/model is env-var-only —
  no code change needed. See `.env.example` for all four vars.
- **Response:** 200 `{ text }` on success; 200 with a graceful fallback message if neither
  `GEMINI_API_KEY` nor `GEMINI_BASE_URL` is set; 500 `{ error }` on caught error.

## The `/api/inquiry` route (added 2026-09-03)

`api/inquiry/route.js` — `POST` only. Backs the Concierge "Inquiry & Booking" form
(`concierge/InquiryForm.jsx` via `hooks/useConcierge.js`'s `handleInquirySubmit`).

- **Request:** JSON `{ clientName, clientEmail, clientPhone, desiredConsultation,
  additionalNote, appointmentMode, appointmentWindow, language }`.
- **Validation is server-side, not a UI nicety** — `validateInquiry(body)` checks name
  (2–100 chars), **phone required** (regex format), **email optional** (regex format only
  if provided — swapped from the original email-required/phone-optional design at the
  user's explicit request), `desiredConsultation` against `["acquisition", "consultation",
  "visit"]` (the form's 3-option category select — not `"interior"`/`"material"`, an
  earlier 4-option design), `appointmentMode`/`appointmentWindow` against their own fixed
  enums, and a 2000-char cap on `additionalNote`. On failure: 400
  `{ ok: false, errors: { field: i18nKey } }` — the values are **dictionary keys**
  (`"formErrorNameRequired"`, `"formErrorPhoneRequired"`, etc., defined in both
  `lib/i18n/en.js`/`fa.js`), not translated strings; the client calls `t()` on them. Do
  not return human-readable text from this route — it would bypass the i18n dictionary
  and break Farsi. **`appointmentWindow` is always required** (empty/"arrange later" is
  no longer accepted), regardless of `appointmentMode` — a private call and an in-person
  atelier visit both need a chosen time slot — `formErrorAppointmentWindowRequired`
  surfaces under the Cadence dropdown in `InquiryForm.jsx`. Only
  `clientName`/`clientEmail`/`clientPhone`/`additionalNote`/`appointmentWindow` have a
  dedicated `FieldError` in `InquiryForm.jsx`** — `useConcierge.js`'s
  `handleInquirySubmit` checks for this and falls back to the generic `formErrors.form`
  banner if the server ever returns an error for a field with no UI (currently only
  reachable for `desiredConsultation`/`appointmentMode`, since those are controlled
  selects that can only produce already-valid values through the real form — this guards
  a request that bypasses the browser UI).
- **Persistence:** on success, appends a record (`sessionRef` — a `crypto.randomInt`
  5-digit number, not `Math.random()` — the validated/trimmed fields, `language`,
  `submittedAt`, `viewed: false` — the ledger's read/unread flag, flipped only by
  `/ledger`'s `setViewedAction`, never by the visitor) to `data/inquiries.json` (repo-root `data/`, a sibling of `public/`, not
  nested under `src/` — gitignored, holds real customer PII: name/email/phone). Writes
  go through the **shared serialized store** `src/lib/inquiriesStore.js`
  (`mutateInquiries(transform)`): a module-level promise chain serializes every
  read-modify-write — both this route's appends **and** `/ledger`'s `deleteAction` queue
  through the same chain, so a public form submit and an admin delete can never
  interleave (a lost-update race that existed when each file had its own queue). Each
  write lands atomically via a uniquely-named temp file + `fs.rename`, with the temp
  file cleaned up if the rename fails. The data directory is created once
  (`ensureDataDirectory`, memoized via `isDirInitialized`) rather than on every write.
  **This assumes a persistent filesystem** (a real VPS/container with a mounted volume —
  confirmed as this project's deployment target). It will **not** work on serverless
  hosting (Vercel/Netlify/Cloud Run without an attached volume) or any container platform
  that recreates its filesystem on redeploy/restart/scale — writes would appear to
  succeed locally and then silently vanish. Revisit this route (swap to a real database
  or an external service) before deploying anywhere without a guaranteed persistent disk.
- **Response:** 200 `{ ok: true, sessionRef }` on success (a server-generated 5-digit
  number — no longer computed client-side); 400 with field errors on validation failure;
  400/500 `{ ok: false, error: "formErrorGeneric" }` on malformed JSON or a write failure.

## The `/ledger` route (added 2026-09-03)

`ledger/page.js` — the private admin view of the inquiry register (`data/inquiries.json`). Not
a CMS-style panel: one gated editorial page in the app's own design language, backed by
`components/ledger/Ledger.jsx`.

- **Access:** env key `ZAAD_LEDGER_KEY` (see `.env.example`). The gate form posts to an
  inline `"use server"` action in the page file; the action compares sha256 fingerprints
  with `timingSafeEqual` and, on match, sets an httpOnly session cookie `zaad_ledger`
  scoped to `/ledger` (`sameSite: "strict"`, `secure` in production) holding only the
  fingerprint hex — never the key itself. `lockAction` deletes the cookie. Cookie
  verification lives in one `isUnlocked()` helper shared by `Page` and `deleteAction` —
  **every server action must re-verify the cookie itself**; server actions are callable by
  anyone regardless of what UI is rendered. While locked the page never reads the data
  file; when unlocked it reads, sorts newest-first, and passes records to the client
  shell. If `ZAAD_LEDGER_KEY` is unset the gate renders and every attempt fails — there is
  no unlock path at all. No `revalidatePath` calls: a Server Action response already
  carries the fresh render of the current route, and the page is `force-dynamic`.
- **Deletion:** the client shell's two-step "Remove Entry" confirm calls the inline
  `deleteAction(sessionRef, submittedAt)` server action — re-gated via `isUnlocked()`,
  matching the record by `sessionRef` + `submittedAt` (a 5-digit number alone can collide
  eventually; the pair is unique), and writing back through the shared
  `src/lib/inquiriesStore.js` queue (`mutateInquiries`), the same serialized atomic path
  `/api/inquiry` appends through — a return of `null` from the transform skips the write
  (no match, nothing changed).
- **Viewed/unviewed (added 2026-09-04):** `setViewedAction(sessionRef, submittedAt, viewed)`
  — same shape as `deleteAction` (re-gated via `isUnlocked()`, matched by the
  `sessionRef`+`submittedAt` pair, written through the same `mutateInquiries` queue,
  `null` transform result when nothing changed) — flips one record's `viewed` flag. The
  client shell (`components/ledger/Ledger.jsx`) calls it both from a manual per-entry
  toggle and automatically the first time an entry is expanded; see
  `src/components/README.md`'s `ledger/Ledger.jsx` section for the three-tab
  (all/unviewed/viewed) filtering built on top of it.
- **SEO:** `metadata.robots` `index/follow: false` + `robots.js` disallow; no sitemap entry.
- **Known limitation:** the gate has no rate limiting (brute force is slowed only by
  single-flight form submissions). Acceptable for a single-admin key; revisit if the key
  is ever shared or exposed.

## Config

- **`next.config.mjs`** is the active config (Next loads `.mjs` first): `reactStrictMode:
  true`, `images.remotePatterns` for `images.unsplash.com` and `ai.google.dev` over
  https. Any new remote image host needs a `remotePatterns` entry here.
- **`next.config.js` was a dead duplicate** (only a webpack `IgnorePlugin` for
  README.md) — it has been **deleted**. Do not recreate it; edit `next.config.mjs`.
- `jsconfig.json`: `baseUrl: "."`, `paths: { "@/*": ["./src/*"] }`.
- No `revalidate` / `fetchCache` exports anywhere. The curate route is
  implicitly dynamic (reads `request.json()` + env); home and collection pages are
  static (collection via `generateStaticParams`); `/ledger` is the one explicit
  `export const dynamic = "force-dynamic"` route (cookie-gated, must never cache).

## Known SEO gaps

- **Home `SearchAction` targets a 404:** `forHome()` emits a `WebSite` schema with a
  `SearchAction` whose `urlTemplate` is `/collection?q={search_term_string}` — no
  `/collection` route and no site search exist, so the target 404s. (The sitemap and
  collection breadcrumb previously had the same class of 404 and have been fixed: the
  sitemap now lists `/showcase/index.html` — the real static URL that serves 200 — and
  the breadcrumb is `Home → Item`, dropping the dead `/collection` crumb.)
- **Hreflang is incorrect:** `MetaDataService.hreflangFor` returns the same URL for
  `x-default`, `en`, and `fa` (no locale-prefixed routing). Declaring `fa` hreflang on
  the identical `en` URL is not a valid alternate-language signal.
- **Sitemap uses `en.collection` ids only** — currently fine (fa collection has the
  same ids) but fragile if they ever diverge.
- **TODO placeholders** in `MetadataService` (`@zaad_x_placeholder` social handles,
  `zaad_placeholder` contact url) ship in JSON-LD/OG tags.

## Known rendering gap

- **Date-derived text computed at render time on static routes.** `Footer.jsx` /
  `house/HouseFooter.jsx` (`localizedYear`, via `src/lib/localizedYear.js`) and
  `header/ControlsFooter.jsx` (`formatTodayLabel`) both call `new Date()` directly in a
  `"use client"` render, on routes that are statically generated at build (home,
  `collection/[slug]`, and the three House routes). If the deployed build isn't rebuilt
  across the boundary the date value crosses (a year rollover for the footer year, a day
  rollover for `ControlsFooter`'s date), the client's hydration pass can compute a
  different value than what's baked into the static HTML. The footer year spans carry
  `suppressHydrationWarning` to silence the resulting console warning; `ControlsFooter`
  does not yet. None of the three are gated behind the mount-effect idiom the `atelierClock`
  studio-time strip and `ChapterHero`'s `activeVideo` already use for the same class of
  problem — an intentional, low-risk tradeoff (the mismatch window is narrow and cosmetic),
  not an oversight, but worth revisiting if a stricter hydration-parity bar is ever wanted.