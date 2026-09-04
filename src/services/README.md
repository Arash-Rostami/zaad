# `src/services/` — Scroll, Metadata, the i18n context, and the AI Curator

> **Scope:** `ScrollService.js`, `MetaDataService.js`, `TranslationService.jsx`,
> `CuratorService.js`. Read this before editing anything under `src/services/`.

**Important:** the React i18n context (`LanguageProvider` / `useLanguage`) lives here,
in `TranslationService.jsx` — **not** in `src/contexts/` (that folder is empty, a
leftover from the Vite+Express+TS migration). Do not link new code to `src/contexts/`.

---

## `ScrollService.js` — the RAF smooth-scroll engine

A self-contained, stateless, imperative smooth-scroll utility. **Not** a scroll-progress
subscription system — there is no global state, no subscriber registry, no cleanup API.

Exports (three):

- `animateScrollTo(elementId, duration = 1450)` — resolves `document.getElementById`,
  bails silently if missing, runs a `requestAnimationFrame` loop with `easeInOutQuint`.
- `animateScrollToTop(duration = 1300)` — same, toward 0.
- `animateScrollToBottom(duration = 1300)` — same shape as `animateScrollToTop`, toward
  `document.documentElement.scrollHeight - window.innerHeight`; bails if already at/past
  that point. Added for `shared/ScrollButton.jsx`'s "smart" direction toggle (see
  `src/components/README.md` and `src/hooks/README.md`'s `useScrollButton.js` entry).
- `registerSmoothScroll(instance)` / `unregisterSmoothScroll(instance)` — set/clear the
  Lenis instance (registered by whichever `useLenisScroll` consumer is mounted —
  `AppShell.jsx`, `house/HouseSmoothScroll.jsx`, or `collection/[slug]/ProductPageClient.jsx`,
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
  timers and in-flight RAF loops (both exports, `animateScrollTo` and
  `animateScrollToTop`) — concurrent calls no longer fight over
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

### Consumers
`Header.jsx`, `AppShell.jsx`, `hooks/useShowroomNav.js`, `header/MenuPanel.jsx`,
`hooks/useScrollButton.js` (indirectly, via `shared/ScrollButton.jsx`) — all via the
three named exports; there is no lower-level hook surface.

---

## `MetaDataService.js` — server-only SEO/metadata

Builds static Next.js metadata objects + schema.org JSON-LD. **No network calls**, no
env vars — `BRAND = "ZAAD"` and `SITE_URL = "https://zaad.com"` are hardcoded constants.

- Imports `getServerLanguage` from `@/lib/i18n/server` to pick the locale.
- `COPY = { en: {…}, fa: {…} }` — home titles & descriptions per locale.
- `OG_LOCALE = { en: "en_US", fa: "fa_IR" }`.
- `hreflangFor(url)` → `{ "x-default": url, en: url, fa: url }` — **all three point to
  the same URL** (no per-locale routes; see known issues).
- `buildMeta({rawTitle, description, image, canonical, lang})` → Next.js metadata
  (title, `alternates.canonical`, `openGraph` 1400×920, `twitter`).
- `export class MetadataService`:
  - `static get orgSchema` — `Organization` JSON-LD (placeholder `sameAs`/`contactPoint`).
  - `static async forHome()` → `{meta, schemas}` (`WebSite` + `SearchAction` →
    `/collection?q={search_term_string}`).
  - `static async forCollection(item)` → `Product` + `BreadcrumbList` (Home → Item);
    canonical `${SITE_URL}/collection/${item.slug ?? item.id}`; description sliced to
    155 chars.

### Known issues
- **`hreflangFor` returns identical URLs for `en` and `fa`** — not a valid
  alternate-language signal (i18n is cookie-only; no locale-prefixed routes).
- **TODO placeholders** ship in metadata: `twitter.site: "@zaad_x_placeholder"`,
  `sameAs` Instagram/Telegram/X, `contactPoint.url: "https://wa.me/zaad_placeholder"`.
- **Home `SearchAction` targets a 404** — `forHome()`'s `WebSite` schema declares a
  `SearchAction` at `/collection?q={search_term_string}`, but no `/collection` route or
  site search exists.

---

## `CuratorService.js` — AI Curator grounding + provider client (added 2026-09-03)

Server-only static class consumed by `api/curate/route.js` (see `src/app/README.md`'s
"The `/api/curate` route" section for the request/response contract). Two static
methods, two separate concerns:

- **`buildContext(language)`** — builds the real grounding text the AI curator answers
  from, so it stops inventing products. Reads the *server-side* `en`/`fa` dictionary
  objects directly from `lib/i18n/en.js`/`fa.js` (static imports, not the client
  `TranslationService` context — this runs in a Route Handler, no React tree), then
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
  - `GEMINI_BASE_URL` set → OpenAI-compatible gateway path: `POST
    {GEMINI_BASE_URL}/chat/completions`, header `Authorization: apikey
    ${GEMINI_GATEWAY_API_KEY}`, body `{ model: GEMINI_MODEL || DEFAULT_MODEL, messages,
    temperature, max_tokens }`, request aborted via `AbortSignal.timeout(30_000)`. Throws
    a clear, sanitized error immediately if `GEMINI_GATEWAY_API_KEY` is missing (fails
    fast rather than sending a literal `apikey undefined` header); on a non-OK response,
    the raw upstream error body is `console.error`-logged server-side only — never
    forwarded to the client — and a generic `Curator gateway error {status}` is thrown
    instead (this project currently points it at an ArvanCloud AI gateway proxying
    `Gemini-3.1-Flash-Lite-Preview`, but the code has no ArvanCloud-specific logic — any
    OpenAI-compatible `/chat/completions` gateway works).
  - Otherwise → native `@google/genai` `GoogleGenAI` SDK (lazy singleton via
    `getGoogleClient()`, which throws immediately if `GEMINI_API_KEY` is unset rather
    than constructing a client with an empty key), `model: GEMINI_MODEL ||
    DEFAULT_MODEL` (`DEFAULT_MODEL = "gemini-2.5-flash"` — a real, valid native Gemini
    id; do not default this constant to a gateway-only display name like
    `"Gemini-3.1-Flash-Lite"`, which the native SDK would reject).
  - **Swapping provider or model is env-var-only** — no code change needed. All four
    vars (`GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_BASE_URL`, `GEMINI_GATEWAY_API_KEY`)
    live in the repo-root `.env` (gitignored); `.env.example` documents the same names
    with placeholder/empty values only — **never put a real key/token in `.env.example`,
    it's git-tracked.**

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

## `TranslationService.jsx` — the i18n React context

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
  is what makes a returning Farsi visitor land on FA on **static** (`force-static`)
  routes — e.g. the House pages (`/about`, `/story`, `/sustainability`) and
  `collection/[slug]`, where the server bakes `initialLanguage="en"` at build and
  `cookies()` is empty in that context. It uses `setLanguageState` (not `setLanguage`)
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
  `advantageCards`, …). **`data("collection")` returns the already-localized array**
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