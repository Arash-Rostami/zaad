# `src/services/` — Scroll, Metadata, the i18n context, and the AI Curator

> **Scope:** `ScrollService.js`, `PreferenceService.js`, `MetadataService.js`,
> `LanguageProvider.jsx`, `CuratorService.js`. Read this before editing anything under
> `src/services/`.

**Important:** the React i18n context (`LanguageProvider` / `useLanguage`) lives here,
in `LanguageProvider.jsx` — **not** in `src/contexts/` (no such folder exists; the
Vite+Express+TS-migration leftover has been deleted). Do not link new code to
`src/contexts/`.

---

## `ScrollService.js` — the RAF smooth-scroll engine

A self-contained, stateless, imperative smooth-scroll utility. **Not** a scroll-progress
subscription system — there is no global state, no subscriber registry, no cleanup API.

Exports (three):

- `animateScrollTo(elementId, duration = 1450, extraOffset = 0)` — resolves `document.getElementById`,
  bails silently if missing, runs a `requestAnimationFrame` loop with `easeInOutQuint`.
  `extraOffset` (added 2026-09-05 for the `/glance` mobile chapter rail) is folded into
  the live header offset in both the Lenis and RAF branches — a page-specific sticky
  bar that covers the target's heading passes its `offsetHeight` (0 when
  `display:none`); do **not** extend `getHeaderOffset()` globally for per-page bars.
- `animateScrollToTop(duration = 1300)` — same, toward 0.
- `animateScrollToBottom(duration = 1300)` — same shape as `animateScrollToTop`, toward
  `document.documentElement.scrollHeight - window.innerHeight`; bails if already at/past
  that point. Added for `shared/ScrollButton.jsx`'s "smart" direction toggle (see
  `src/components/README.md` and `src/hooks/README.md`'s `useScrollButton.js` entry).
- `registerSmoothScroll(instance)` / `unregisterSmoothScroll(instance)` — set/clear the
  Lenis instance (registered by whichever `useLenisScroll` consumer is mounted —
  `AppShell.jsx`, `house/HouseSmoothScroll.jsx`, `collection/[slug]/CollectionPageClient.jsx`,
  `ledger/Ledger.jsx`, or `glance/GlancePage.jsx`,
  never more than one at a time; never registered under `prefers-reduced-motion`).

### Load-bearing contract
- **The header offset is measured live, every attempt** — `getHeaderOffset()` reads
  `getBoundingClientRect().bottom` of `[data-site-header]` (the showroom `Header.jsx`
  root; `header` tag fallback covers House chrome, `88` only if no header is in the DOM).
  The old hardcoded `88` was ~27px wrong on mobile (~61px header below `sm`, ~73px at
  `sm+`). If the header element or its `data-site-header` attribute is ever restructured,
  the measurement breaks — keep both.
- **Missing targets are retried, not dropped.** `animateScrollTo` retries every 100ms
  for up to 1200ms when `getElementById` finds nothing (the 600ms `AnimatePresence`
  unmount race), then bails silently as before.
- **Last-call-wins cancellation.** A module-level run-id invalidates older calls' retry
  timers and in-flight RAF loops (all three exports, `animateScrollTo`,
  `animateScrollToTop`, and `animateScrollToBottom`) — concurrent calls no longer fight over
  `window.scrollTo`. Callers still `setTimeout(..., 120)` before scrolling as a soft
  lead-time (avoids visibly scrolling mid-transition), but it is no longer a hard race.
- **Lenis delegation when smooth scrolling is active.** When a Lenis instance is
  registered, all three `animate*` exports delegate to `lenis.scrollTo(...)` with the
  same live header offset (negated — Lenis adds `offset` to the target position), the
  same duration (÷1000, Lenis takes seconds), and the same `easeInOutQuint` easing —
  identical feel, one code path. The RAF fallback only runs when no instance is
  registered (reduced-motion users, or the async Lenis chunk not yet loaded). Lenis
  interrupts its own in-flight `scrollTo` on a new call, so last-call-wins holds.
- Client-only (uses `window`/`document`); safe because all callers are client
  components/hooks.
- **`AppShell.jsx` re-runs `animateScrollTo` on mount for any incoming `location.hash`**
  (added 2026-09-07) — fixes cross-route "jump to a section" links (product-page
  Inquire/Header/Footer clicks that `router.push("/#section")` from a different route)
  landing in the wrong place. Next.js's own built-in hash scroll fires once, in the
  layout phase, before Lenis registers or any image/video-driven layout settles — so it
  reliably lands short of or past the real target. The mount effect waits the same
  120ms lead-time every other pre-scroll call site uses, then calls `animateScrollTo`
  (live header offset, Lenis-aware, retries if the target isn't mounted yet) and strips
  the hash via `history.replaceState` so it can't re-trigger. See CLAUDE.md's Load-bearing
  contracts (the Footer cross-route note) and `src/components/README.md`'s Header section
  for the call sites this replaced.

### Consumers
`Header.jsx`, `AppShell.jsx`, `Footer.jsx`, `CollectionPage.jsx`,
`glance/GlancePage.jsx`, `house/ChapterPieces.jsx`, `house/HouseSmoothScroll.jsx`,
`shared/ScrollButton.jsx`, `hooks/useShowroomNav.js`, and
`hooks/useLenisScroll.js` (`registerSmoothScroll`/`unregisterSmoothScroll`) — all via
the named exports; there is no lower-level hook surface. (`header/MenuPanel.jsx` no
longer imports it; `hooks/useScrollButton.js` never did — `shared/ScrollButton.jsx`
imports the exports directly and calls them on the values the hook returns.)

---

## `PreferenceService.js` — the `localStorage` wrapper (added 2026-09-06)

The single place any code reads or writes a per-visitor preference. Two named exports,
both SSR-guarded (`typeof window !== "undefined"`) and try/catch-wrapped (private
browsing, blocked storage, or quota errors fail silently — a missing preference is never
a crash):

- `getPreference(key, fallback = null)` — `JSON.parse`s the stored value, or returns
  `fallback` if absent/unreadable.
- `setPreference(key, value)` — `JSON.stringify`s and stores it.

Keys are stored under a shared `zaad_pref_` prefix — do not read/write `localStorage`
directly anywhere else in the app; add a new preference through this module so every
consumer shares one storage namespace and one failure-handling policy.

### `hooks/useLocalPreference.js` — the reactive wrapper

For components that need to *render* a preference reactively (not just write one).
`const [value, update] = useLocalPreference(key, fallback)`. Follows the same
hydration-safe idiom already established in this codebase for anything client-only
(`ChapterHero`'s `activeVideo`, the `initialLanguage` static-route restore — see
`src/components/README.md`): the `useState` seeds `fallback` so SSR and first client
paint match, then a mount-only `useEffect` populates the real value from
`getPreference` — a one-frame "flash" from empty to populated is expected and correct,
not a bug. `update(next)` writes through `setPreference` and updates local state in one
call. A component that only ever *writes* (never reads back reactively) should call
`setPreference` directly instead of pulling in this hook — see
`pendingInquiryItem`'s writer below. **Live again since 2026-09-29** — the menu's
`lastViewedItem` "Continue" link was restored at owner direction (it lives in
`header/MenuPanel.jsx` now, after the third menu row, not inside `SpecimenGrid`).

### Current preference keys

| Key | Shape | Written by | Read by |
| :--- | :--- | :--- | :--- |
| `materialSelection` | material `id` string | `Materials.jsx` via `useActiveSelection`'s `persistKey` | same, on next visit |
| `pendingInquiryItem` | `{ id, name, number }` (`useConcierge.js`'s preselect effect only ever reads `.name`/`.number`) | `collection/[slug]/CollectionPageClient.jsx`'s `onInquire` (added 2026-09-07, write-only — direct `setPreference`, not the reactive hook), right before `router.push("/#concierge")` — carries the clicked item across the route boundary since the product page's own React state can't survive a full navigation to `/` | `AppShell.jsx`'s mount effect: reads it once, calls `setPreselectedItem`, then clears it (`setPreference(key, null)`) so it can't re-fire on a later plain visit to `/` |
| `lastViewedItem` | `{ id, name, number }` | `CollectionPage.jsx` (effect on `item.id`/`name`/`number`, direct `setPreference`) — removed 2026-09-28 in the copy pass, **restored end-to-end 2026-09-29 at owner direction** ("history to continue") | `header/MenuPanel.jsx`'s reactive `useLocalPreference` → the minimal "Continue — {name}" link rendered after the third menu row (with hover-revealed `×` dismiss), plus `hooks/useConcierge.js`'s welcome personalization (`curatorWelcomeWithItem`) |

---

## `MetadataService.js` — server-only SEO/metadata

Builds Next.js metadata objects + schema.org JSON-LD. **No network calls**, no env vars.

- **`SITE_CONFIG` (added 2026-09-07, replacing bare `BRAND`/`SITE_URL` constants)** — one
  object grouping `brand`, `siteUrl` (**`https://zaaddesign.com` since 2026-09-29 — the real
  letterhead domain, owner decision, resolving the old `zaad.com` placeholder**; every
  canonical URL/OG tag/sitemap/robots entry now derives from it), `logoImage` (`/logo.png`),
  `defaultOgImage` (`/image/gavv/gavv-06.jpg` — a real, existing landscape product photo,
  2200×1556; picked specifically because it's landscape — an earlier candidate, a portrait
  collection photo, was checked and rejected for this exact reason, see the git
  history/session notes if curious), `socials` (`instagram` — the only real handle;
  `linkedin`/`telegram` commented out 2026-09-29 at owner direction so `sameAs` emits
  Instagram only — uncomment when real handles are supplied), `twitter.site` (also commented
  out 2026-09-29 — `buildMeta`'s `site:` becomes `undefined` and Next omits the tag), and
  `contact` (`whatsappUrl` commented out 2026-09-29 along with `orgSchema.contactPoint`'s
  `url:` line — the studio number is a landline extension, not confirmed WhatsApp-reachable;
  plus the full real `PostalAddress` fields: `streetAddress`/`addressLocality`/
  `addressCountry`/`postalCode`). The `socials` set was deliberately aligned to match
  `lib/socialLinks.js`'s real footer icon row — it used to list Instagram/Telegram/**X**
  instead, a different platform set than what's actually shown in the footer, for no real
  reason. `twitter.site` stays separate (it's the Twitter *Card* meta tag, unrelated to
  `sameAs`).
- Imports `getServerLanguage` from `@/lib/i18n/server` to pick the locale, and both
  `en`/`fa` dictionary modules (`forGlance` needs the locale-correct `collection` array).
- `COPY = { en: {…}, fa: {…} }` — per-route `*Desc` (meta description) fields rewritten
  2026-09-07 to be more specific and fact-grounded (the 9,000 sqm / 150 specialists /
  8 designers claims trace back to the real, already-published facts in `lib/i18n/en.js`'s
  `aboutStats` and the `about` `aboutSections` entry's own copy — `aboutIntro` was deleted
  2026-09-29 as an unused duplicate; note the *fabricated* quarry/stonemason claims that used to
  live here were purged on 2026-09-29 when the owner confirmed the CSR content was made
  up; `sustainabilityDesc` now makes only claims from the owner's approved text, and no
  invented stat key feeds it). The `*Title` fields
  are deliberately kept **shorter than the `*Desc` fields** — they build the literal
  browser-tab `<title>` text (see `buildMeta` below), where a long, multi-clause title
  reads as crowded/truncated in a tab; the fuller descriptive language lives in `*Desc`
  instead, which only ever appears in a meta description/search snippet, never the tab
  itself. Plus `collectionsCrumb`/`homeCrumb` breadcrumb labels.
- `OG_LOCALE = { en: "en_US", fa: "fa_IR" }`.
- `hreflangFor(url)` → `{ "x-default": url, en: url, fa: url }` — **all three point to
  the same URL** (no per-locale routes; see known issues).
- `resolveImageUrl(url)` (added 2026-09-07) — passes an already-absolute URL through
  unchanged, otherwise prefixes `SITE_CONFIG.siteUrl` onto a relative path, falling back
  to `SITE_CONFIG.defaultOgImage` when no `url` is given at all. Every `buildMeta` caller
  now always gets an OG/Twitter image (previously conditional on an `image` param being
  passed — a collection item with no real photo would have silently gotten none).
- `buildMeta({rawTitle, description, image, canonical, lang})` → Next.js metadata
  (title, `alternates.canonical`+`languages`, an explicit `robots`/`googleBot` directive
  block — added 2026-09-07, wasn't set before — `openGraph` 1400×920 via
  `resolveImageUrl`, `twitter`). **Title format is `"{rawTitle} | ZAAD"` uniformly now
  (2026-09-07)** — home used to be the odd one out with `"ZAAD | {homeTitle}"` reversed
  and an em-dash on every other page (`"{rawTitle} — ZAAD"`); both the separator and the
  brand's position relative to the page title are now consistent everywhere except the
  home page itself, which deliberately keeps brand-first (`"ZAAD | {homeTitle}"` — the
  one page where leading with the brand name is the correct, standard convention).
- `export class MetadataService`:
  - `static get orgSchema` — `Organization` JSON-LD, now including the full real
    `PostalAddress` (street/city/country/postalCode since 2026-09-27), with `sameAs`
    shipping Instagram only and `contactPoint`'s placeholder deep-link `url` commented
    out (2026-09-29 — see SITE_CONFIG above).
  - `static async forHome()` → `{meta, schemas}` (`WebSite` only — the dead
    `SearchAction` was removed 2026-09-07, see CLAUDE.md's Known issues).
  - `static async forCollection(item)` → `Product` + a 3-level `BreadcrumbList` (Home →
    Collections → item, the middle crumb linking `/glance` — added 2026-09-07, was a
    flat Home → Item before); canonical `${SITE_URL}/collection/${item.slug ?? item.id}`;
    description newline-stripped and sliced to 155 chars. Title is the bare item name —
    an intermediate version of this change briefly appended the item's `number` code
    (`"GÁVV — C°01"`), then chained *another* separator on top in `buildMeta`
    (`"GÁVV — C°01 — ZAAD"`) — reverted the same day for being visibly crowded in a
    browser tab; the `number` code still appears in the page's own visible UI
    (`NavBar.jsx` etc.), just not doubled into the tab title.
  - `static forAbout()` / `forStory()` / `forSustainability()` (the three House
    routes, added 2026-09-06) → the shared `simplePage(path, titleKey, descKey,
    extraSchema)` builder: canonical `${SITE_URL}/{path}`, per-route `COPY` keys
    (`aboutTitle`/`aboutDesc`, `storyTitle`/`storyDesc`,
    `sustainabilityTitle`/`sustainabilityDesc`), a Home → page `BreadcrumbList` + the
    `aboutPageSchema` WebPage (`forSustainability` passes its own WebPage variant
    with an `about` description). Same `{meta, schemas}` shape as `forHome()`.
  - `static async forGlance()` (added 2026-09-05) → `BreadcrumbList` +
    `orgSchema` + `CollectionPage` whose `hasPart` ItemList carries the **locale-correct**
    `collection` array (`fa.collection` when `lang === "fa"`, `en.collection` otherwise —
    fixed 2026-09-07; it used to hardcode `en.collection` regardless of the actual page
    language, so a Farsi page's own structured data described the collection in English)
    as `Product`s; canonical `${SITE_URL}/glance`; COPY keys `glanceTitle`/`glanceDesc` in
    both locales. The `/glance` page renders `<JsonLd/>` **after** the page tree, not
    before it — the user's explicit "SEO tags at bottom" placement (unique among the
    routes; everywhere else JsonLd comes first).

### Known issues
- **`hreflangFor` returns identical URLs for `en` and `fa`** — not a valid
  alternate-language signal (i18n is cookie-only; no locale-prefixed routes). Inert, not
  actively harmful (search engines just ignore a same-URL alternate) — a real fix needs
  locale-prefixed routing, out of scope for a metadata-only pass.
- **Placeholder handles no longer ship in metadata** (hidden 2026-09-29 at owner direction,
  reversing the 2026-09-07 ship-them decision): `SITE_CONFIG.twitter.site`,
  `SITE_CONFIG.socials`'s `linkedin`/`telegram` (Instagram — real — still ships in
  `sameAs`), and `SITE_CONFIG.contact.whatsappUrl` (plus `orgSchema.contactPoint`'s `url`)
  are all commented out in source, one keystroke to restore once real handles exist. The
  matching footer icon row renders the same three disabled (see `lib/socialLinks.js`).

**Fixed 2026-09-07** (were tracked here as known issues; resolved, not just documented):
every `image:` reference across `buildMeta` call sites (`forHome`, `simplePage` — the
three House routes, `forGlance`) used to point at `/og/home.jpg`, a file that never
existed under `public/`; `orgSchema.logo` pointed at `/logo.png`, also missing at the
time. `public/logo.png` now exists (originally a placeholder 367×161 wordmark PNG;
regenerated 2026-09-27 as an 880×217 raster of the real client-provided vector logo,
`public/logo.svg` — see `src/app/README.md`'s icon/logo notes) and is used for
`orgSchema.logo`; the OG/Twitter default image is `SITE_CONFIG.defaultOgImage`
(`/image/gavv/gavv-06.jpg`, a real 2200×1556 landscape product photo — see the
`SITE_CONFIG` entry above) rather than the wordmark, since a 367×161 logo makes a poor
1400×920 social-share card; swap in a dedicated OG image whenever one exists, no other
code needs to change. The dead `SearchAction`
(`forHome()`'s `WebSite` schema targeted `/collection?q={search_term_string}`, a route
that was never built) was removed outright rather than built out — a real site-search
feature is well beyond a metadata fix's scope, and shipping structured data that
advertises a broken action to Google is worse than shipping none.

---

## `CuratorService.js` — AI Curator grounding + provider client (added 2026-09-03)

Server-only static class consumed by `api/curate/route.js` (see `src/app/README.md`'s
"The `/api/curate` route" section for the request/response contract). Two static
methods, two separate concerns:

- **`buildContext(language)`** — builds the real grounding text the AI curator answers
  from, so it stops inventing products. Reads the *server-side* `en`/`fa` dictionary
  objects directly from `lib/i18n/en.js`/`fa.js` (static imports, not the client
  `LanguageProvider` context — this runs in a Route Handler, no React tree), then
  delegates the actual text-building to `lib/formatCuratorContext.js` (default export,
  same "one formatting concern per `src/lib/` file" convention as `wrapBrandNames.js`/
  `wrapLatinRuns.js` — see `src/lib/README.md`). That helper formats `collection` (every
  field per item: name/number/year/price/dimensions/materials/description/story/
  provenance/specifications/partners/islandSpecs/tallUnits/appliancesDetail/
  accessoriesDetail), `aboutSections` + `brandStory` (House/brand heritage), and a
  handful of acquisition/consultation strings into plain markdown-ish text.
  `CuratorService` itself only picks the dictionary and **memoizes the result per
  language** in a module-level `Map` (dictionaries are static imports that never change
  at runtime, so this is safe and avoids rebuilding a large string on every chat
  message).
- **`generateReply({ contents, systemInstruction })`** — the swappable AI-provider
  client. Branches purely on env vars:
  - `GEMINI_BASE_URL` set → OpenAI-compatible gateway path via the shared
    `callGateway(baseUrl, gatewayKey, model, messages)` helper: `POST
    {baseUrl}/chat/completions`, header `Authorization: apikey
    ${GEMINI_GATEWAY_API_KEY}`, body `{ model, messages, temperature, max_tokens }`,
    request aborted via `AbortSignal.timeout(30_000)`. `generateReply` throws a clear,
    sanitized error immediately if `GEMINI_GATEWAY_API_KEY` is missing (fails fast rather
    than sending a literal `apikey undefined` header); on a non-OK response, the raw
    upstream error body is `console.error`-logged server-side only — never forwarded to
    the client — and a generic `Curator gateway error {status}` is thrown instead (this
    project currently points it at an ArvanCloud AI gateway proxying
    `Gemini-3.1-Flash-Lite-Preview`, but the code has no ArvanCloud-specific logic — any
    OpenAI-compatible `/chat/completions` gateway works).
  - **Gateway fallback (added 2026-09-07)** — if the primary `callGateway` call throws
    (network failure like a connect timeout, or a non-OK response) and
    `GEMINI_BASE_URL_FALLBACK` is set, `generateReply` retries once against that second
    URL with `GEMINI_MODEL_FALLBACK` (falling back to the primary `model` string if
    unset) — same `GEMINI_GATEWAY_API_KEY`, since ArvanCloud's header key is
    account-level while the model identity lives in the URL path itself (each model
    deployment gets its own base URL). Guards against one ArvanCloud edge IP going
    unreachable while the account's other model deployment is fine. If the fallback also
    fails (or isn't configured), execution falls through to the native SDK path below
    when `GEMINI_API_KEY` is set, otherwise the original (or fallback) error is rethrown.
  - Otherwise, or after both gateway attempts fail → native `@google/genai` `GoogleGenAI`
    SDK (lazy singleton via `getGoogleClient()`, which throws immediately if
    `GEMINI_API_KEY` is unset rather than constructing a client with an empty key),
    `model: GEMINI_MODEL || DEFAULT_MODEL` (`DEFAULT_MODEL = "gemini-3.1-flash"` — a
    real, valid native Gemini id; do not default this constant to a gateway-only display
    name like `"Gemini-3.1-Flash-Lite"`, which the native SDK would reject).
  - **Swapping provider or model is env-var-only** — no code change needed. All six
    vars (`GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_BASE_URL`, `GEMINI_GATEWAY_API_KEY`,
    `GEMINI_MODEL_FALLBACK`, `GEMINI_BASE_URL_FALLBACK`) live in the repo-root `.env`
    (gitignored); `.env.example` documents the same names with placeholder/empty values
    only — **never put a real key/token in `.env.example`, it's git-tracked.**
  - **The three `console.log("Curator reply source: ...")` lines (one per branch —
    primary gateway, fallback gateway, native SDK) are intentional and standing, not
    debug leftovers** — explicit user direction is to always be able to see which
    gateway/model actually served a given reply in the production terminal. Do not
    remove them as "test-only instrumentation" during cleanup passes; a prior session
    removed them twice on that assumption and both times they were restored.

### Load-bearing contract
The old inline `route.js` system prompt used to hardcode a fictional 3-item catalogue
with invented prices. That's gone — `route.js` now composes `systemInstruction` from a
tone-only prompt (polite/contemporary/plain, not the old poetic-luxury voice — an
explicit user-directed tone change) plus `CuratorService.buildContext(language)`, and
the prompt explicitly instructs the model to ground every factual claim in that supplied
context and refuse to invent specs. If you add new dictionary content the curator should
know about (a new collection item, a new House section), no route/prompt/lib change is
needed — `formatCuratorContext` reads the dictionaries directly and will pick it up
automatically.

## `LanguageProvider.jsx` — the i18n React context

`"use client"`. The single React context for the app. Built on `createContext` +
`motion/react`.

- `registry = { en, fa }` — both dictionaries are **statically imported** (always
  bundled into the client) and looked up synchronously. (A previous `translationMap`
  with lazy `() => import(...)` loaders and a `useTranslation(locale)` async helper were
  dead code with no callers and have been removed.)
- `LanguageProvider({ initialLanguage, children })` — holds `language` state (seeded
  from `initialLanguage`), exposes `setLanguage` which writes **both** `localStorage`
  and a cookie, key **`zaad_preferred_language`** (cookie: `path=/; max-age=31536000;
  SameSite=Lax`). A `useEffect` sets `<html lang/dir>` and toggles the `farsi-mode`
  class on `documentElement`.
- **Client-side locale restore on mount** — a second `useEffect` (runs once, `[]`) reads
  `zaad_preferred_language` (cookie first, then `localStorage`) and, if it's a valid
  locale that differs from `initialLanguage`, calls `setLanguageState` to switch. This
  is what makes a returning Farsi visitor land on FA on a genuinely **static**
  (`generateStaticParams`) route — `collection/[slug]`, where the server bakes
  `initialLanguage="en"` at build and `cookies()` is empty in that context. **The House
  pages (`/about`, `/story`, `/sustainability`) and `/glance` no longer need this restore
  for `initialLanguage` specifically (changed 2026-09-07)** — they were switched from
  `force-static` to `force-dynamic` so `getServerLanguage()` reads the real cookie on
  every request, meaning `initialLanguage` is already correct from the first byte of
  HTML on those routes now; this effect is still harmless there (a no-op when the
  restored value already matches), it's just no longer load-bearing for them. It uses `setLanguageState` (not `setLanguage`)
  so it doesn't re-write the cookie. Trade-off: because state changes after the first
  client render, the **`key={language}` cross-fade fires once on load** whenever the
  restored locale differs from the SSR-baked one (graceful, on-brand — not a bug).
- Wraps children in `<AnimatePresence mode="wait"><motion.div key={language} …>` —
  the **`key={language}` triggers a full-app cross-fade on every locale switch**.
  Editing that key or the `AnimatePresence` changes the whole app's transition feel.
- `useLanguage()` returns `{ language, setLanguage, t, data, dir, isFarsi }` — throws
  if used outside the provider.

### Lookup functions
- `t(key)` → string; falls back to English, then to the raw key.
- `data(key)` → entry or `null`; used for arrays/objects (`collection`,
  `materialSamples`, …). **`data("collection")` returns the already-localized array**
  (fa.js has its own full `collection` array).

### Removed / dead
- **`getItemTranslations(id)` has been removed.** A previous version looked up
  `translations.items?.[id]`, but no dictionary has an `items` object — it always
  returned `null`. Components now read item fields directly (`item.name`, etc.),
  which is correct because `data("collection")` is already localized. Do not
  reintroduce it. (See `src/lib/i18n/README.md` for the localization model.)
- **`translationMap` + `useTranslation(locale)` have been removed** — dead code with no
  callers; the live path is the synchronous `registry`.
- **`MetadataService.forShowcase()` has been removed** — an orphan with no callers. Its
  `COPY` entries (`showcaseTitle`/`showcaseDesc`) were removed with it.

### Cross-cutting contracts (see also `CLAUDE.md`)
- The `zaad_preferred_language` cookie name is load-bearing — it's written here,
  read server-side by `lib/i18n/server.js` (for SSR on dynamic routes), **and** read
  client-side on `LanguageProvider` mount (to restore locale on static routes — see
  above). Renaming either side breaks SSR `lang`/`dir` and the static-route restore.
- The `key={language}` cross-fade and the `farsi-mode` class (matched by CSS selectors
  `html[lang="fa"]` / `.farsi-mode` in `styles/globals.css`) are load-bearing for RTL.