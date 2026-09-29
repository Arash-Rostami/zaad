# `src/app/` — Next.js App Router, SEO, and API

> **Scope:** routing, the root layout, metadata/SEO/JSON-LD, sitemap/robots, and the
> API route handlers. Read this before editing anything under `src/app/`.

## Routes

| Segment | File | Type | Notes |
|---|---|---|---|
| `/` | `page.js` | Server (async) | `generateMetadata` via `MetadataService.forHome()`; calls `resolveHomeUtensilImages()` (`src/lib/collectionImages.js`) and renders `<JsonLd/>` + `<AppShell utensilImages={...}/>` (client) — the image list is currently dormant: `Vision.jsx`'s gallery is video-driven now, the `utensilImages` prop is threaded but unconsumed |
| `/about` | `(house)/about/page.js` | Server (async, `force-dynamic`) | `generateMetadata` via `MetadataService.forAbout()`; renders `<JsonLd/>` + `<AboutChapter/>` — since 2026-09-29 a two-column `HouseDiptychShell` diptych pairing the `story` (left) and `about` + `aboutStats` (right) `aboutSections` entries — inside the shared `(house)/layout.js` chrome. |
| `/story` | `(house)/story/page.js` | Server (async, `force-dynamic`) | `generateMetadata` via `MetadataService.forStory()`; renders `<JsonLd/>` + `<StoryValueChapter/>` — since 2026-09-29 a single-column `HouseChapterShell` reading only the `brandValue` `aboutSections` entry. |
| `/sustainability` | `(house)/sustainability/page.js` | Server (async, `force-dynamic`) | `generateMetadata` via `MetadataService.forSustainability()`; renders `<JsonLd/>` + `<SustainabilityResponsibilityChapter/>` — since 2026-09-29 a single-column `HouseChapterShell` reading only the `sustainability` `aboutSections` entry (the fabricated `csr` entry and its stat grids were deleted at owner direction; the SEO `sustainabilityDesc` was rewritten to doc-true claims in the same change). |
| `(house)` shared layout | `(house)/layout.js` | Server | Renders `components/house/HouseSmoothScroll.jsx` (render-null client leaf mounting the shared `useLenisScroll` hook — gives House routes the same Lenis smooth-scroll as the showroom) + `components/house/HouseChrome.jsx` (slim header: back-to-showroom, ZAAD wordmark, the current page's name as a static underlined label — no `layoutId`, no multi-link nav; see CLAUDE.md's Load-bearing contracts — compact language/theme control) + `<main>{children}</main>` + the shared `components/Footer.jsx` (one footer site-wide since 2026-09-06 — mounted prop-less) + `components/shared/ScrollButton.jsx` (mounted prop-less). Not the showroom `Header`/`MenuControls`. **No longer mounts `DorsaPreloadScript` (removed 2026-09-07)** — see the font-preload paragraph below for why it stopped being needed here. |
| `/collection/[slug]` | `collection/[slug]/page.js` | Server (async) | `generateStaticParams` (en ids only), `generateMetadata` via `MetadataService.forCollection(item)` (still cookie-resolved per request — correct SEO per visitor), `notFound()` on miss; renders `<DorsaPreloadScript/>` + `<JsonLd/>` + `<CollectionPageClient items={itemPair}/>`. Since 2026-09-29 the page ships **both** fully-resolved item variants — `getResolvedItemPair(slug)` builds `{en, fa}` (each `{...dictionaryItem, images: resolveCollectionImages(item, lang)}`, so captions localize too) and `CollectionPageClient` picks `items[isFarsi ? "fa" : "en"]`. Before this, the single `item` prop was resolved from the cookie-read server dictionary, so a client language toggle switched every `t()` string but left all item content (description, story, spec tables, image captions) in the server-baked language — reported live on the VAAR page in dev (where the route renders per request and sees the real cookie); the pair also makes the route correct under a static prebuild regardless of which language the server baked. Metadata/JSON-LD are unchanged: still the per-request cookie-resolved item |
| `/collection/[slug]` leaf | `collection/[slug]/CollectionPageClient.jsx` | Client (`"use client"`) | `onSelectProduct` given to `Header`: `router.push` to `/collection/${id}` for a real product, `router.push("/")` when `product` is `null` — `MenuPanel`'s Digital Catalogue button (`UtilityStrip`, `onBlueprint`) calls `onSelectProduct(null)` as a "clear selection" signal before `window.open("/showcase/index.html")` (the former `SystemPortals.jsx` card pair, including its House card, was retired 2026-09-27; see `src/components/README.md`'s Header section). This leaf must not assume a non-null product. **`onScrollToSection`/`onInquire` (fixed 2026-09-07)** both funnel through a single `goHome(hash)` helper (`router.push(hash ? '/#${hash}' : "/")`) instead of the ad-hoc `router.push` calls each used to build separately; `onInquire(item)` additionally writes `{id, name, number}` to the `pendingInquiryItem` preference (`src/services/README.md`) before navigating, since crossing a full route boundary to `/` loses this page's own React state — `AppShell.jsx` reads it back on mount to restore the preselected-item chat/form prefill that only ever worked from the homepage's inline product view before this fix. `setActiveTab` here is a no-op (`() => {}`) — the product page has no "tab" concept, and it used to just be a second, redundant `router.push("/")` alongside `onSelectProduct(null)`'s own. |
| `/glance` | `glance/page.js` | Server (async, `force-dynamic`) | "ZAAD at a glance" lookbook route (added 2026-09-05) — `generateMetadata` via `MetadataService.forGlance()` (wrapped in a module-level React `cache()` so the metadata + schema pass builds once, not twice per render); renders `<GlancePage/>` + `<JsonLd/>` **after** the page tree (the user's explicit "SEO tags at bottom" placement). Standalone route on the Ledger precedent (own slim `glance/GlanceHeader.jsx` chrome, `useLenisScroll` called inside the client shell) — deliberately **not** in the `(house)` group. Changed from `force-static` to `force-dynamic` 2026-09-07 (see the font-preload paragraph below) — no longer mounts `DorsaPreloadScript` either, for the same reason. Reached from `Footer.jsx`'s primary-pages column (unheaded since the `menuJourneyIndex` heading was removed 2026-09-28 — `Link href="/glance"` is the column's first item after the `aboutBackToShowroom` home button — the footer's home entry was aligned to the menu's Home card wording 2026-09-29, replacing the old `menuMainPage` — labeled `zaadAtAGlance`). Closes with the shared `Footer` + `shared/ScrollButton`, both mounted inside `GlancePage` since the standalone route gets no `(house)` layout. |
| `/api/curate` | `api/curate/route.js` | Server route handler | `POST` only — the Gemini chat route (`chatCurator` is "ZAAD GUIDE"/"راهنمای زااد"; `curatorWelcome` opens "Welcome to your ZAAD Guide consultation"; the `zaadDigitalCurator` title is "ZAAD Guide"/"راهنمای زااد" — renamed from "ZAAD - Digital Curator"/"کیوریتور دیجیتال ZAAD" 2026-09-27 at client direction, display-text only, no identifier renamed; the route-facing UI badge text "AI Assistant"/"دستیار هوشمند" and its `curatorModelBadge` key were removed 2026-09-28 in the copy-replacement pass) |
| `/api/inquiry` | `api/inquiry/route.js` | Server route handler | `POST` only — validates and persists the Concierge inquiry form (see "The `/api/inquiry` route" below) |
| `/api/health` | `api/health/route.js` | Server route handler | `GET` → `{ status, time }` |
| `/ledger` | `ledger/page.js` | Server (async, `force-dynamic`) | Private admin register of the inquiry data — key-gated, never cached, noindexed (see "The `/ledger` route" below) |
| `/credits` | `credits/page.js` | Client (`"use client"`) | Client-facing site overview and studio credit (added 2026-09-07, rebuilt same day into a full report) — bilingual, unlisted: reachable only by direct URL, not linked from any nav, footer, or sitemap — and since 2026-09-29 truly unlisted: `credits/layout.js` (server) exports `robots: { index: false, follow: false }`, since the client page itself can't export metadata. Walks all seven routes (`PAGES`, a hairline `RouteRow` list with real route paths as mono tags), all seventeen smart features (`FEATURES`, a lattice `FeatureCell` grid — `bg-ink/10` seams between `bg-surface` cells, not individually boxed cards; expanded 2026-09-07 from an initial 8 to 16, and to 17 on 2026-09-29 with the restored Continue Browsing link, after a verification pass against the real codebase surfaced items missing from the first draft — the cinematic zoom/pan `Lightbox` (distinct from the 360° spin viewer), `useFontScale`'s text-size control, `useAmbientAudio`'s ambient track, `PreferenceService`'s "continue browsing" memory, `InquiryForm`'s appointment time-slot scheduling, the `[[SUBMIT_INQUIRY]]` AI-autofill mechanism, the static FlipHTML5 catalogue at `public/showcase/index.html`, and the custom cursor/Lenis "feel" — every entry here must trace to a real file, never a guess), the quality-assurance list (`CARE`, a `CareRow` list), the private-Ledger callout, and the received-brand-assets entries folded into the "Source Materials" column of the scope grid (2026-09-29 — the client-supplied FractulAlt Latin typeface, Logo 01/02, and the ZAAD pattern SVGs joined the lookbook/content/font-license rows as `creditsScopeProvided4–6`, after a brief standalone `RECEIVED` section was removed the same day at owner direction), the outstanding pre-launch items (two since the 2026-09-27/29 phone, address, and X-handle resolutions) (`CHECKLIST`, real checkbox squares) — see CLAUDE.md's "Keep the docs honest" policy: this page must be kept in sync with real page/feature changes going forward, the same rule as a folder doc. Section titles render plain non-italic `font-serif` like every other heading (an earlier
revision of this doc claimed they used the `.font-serif-luxury` italic token — they never
did, and that token was deleted outright in the 2026-09-28 unused-font purge). **Correction (2026-09-27):** an earlier revision of this doc claimed the hero repeated a plain "ZAAD" wordmark between the eyebrow and a `<h1>` — the page never has an `<h1>` (the heading is an `<h4>`, `creditsHeading`) and carries no such standalone wordmark; that line was stale and has been removed rather than reintroduced. Closing signature (`creditsProductLine`/`creditsEngineeredLine`) is deliberately literal/precise ("Product by Persol Business Solution" / "Engineered by Arash Rostami") and kept independent of `Footer.jsx`'s own `footerCraft` wording — not a shared string. The company name inside `creditsProductLine` is split out at render time and rendered as the one live link to `http://www.persolbs.com/` (`dir="ltr"`, same bidi treatment as `wrapBrandNames`/`wrapLatinRuns`) — no second "visit site" link. No Header/Footer reuse — a minimal fixed top bar (`aboutBackToShowroom` link + the shared `HouseControls` settings widget, imported directly from `house/HouseChrome.jsx`'s named export, which has no House-route coupling) plus `house/HouseSmoothScroll.jsx` reused as-is for Lenis parity with the rest of the site. **This page is CLAUDE.md's fourth documented GSAP spot** — a `ScrollTrigger`-scrubbed reading-progress bar (`scaleX` tween, `trigger` on the page's own `<main>`, `start: "top top"`/`end: "bottom bottom"`) rendered as a 2px line under the fixed header, `prefers-reduced-motion`-gated and torn down on unmount exactly like `house/ChapterPieces.jsx`'s scrub tween — added at explicit user direction after the page grew long enough to warrant one; see the Stack section's GSAP bullet in CLAUDE.md. |
| root layout | `layout.js` | Server (async) | `metadata`, `viewport`, `RootLayout` |
| robots | `robots.js` | Server metadata file | `allow: "/"`, `disallow: ["/api/", "/ledger"]` |
| sitemap | `sitemap.js` | Server metadata file | `/`, `/about`, `/story`, `/sustainability`, `/glance`, `/showcase/index.html`, + dynamic `en.collection` ids |

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
    <a href="#main-content">{dictionary.skipToContent}</a>  // server, sr-only until focused
    <JsonLd schemas={[MetadataService.orgSchema]} />   // SSR
    <InitialLoader />                                    // "use client"
    <CustomCursor />                                     // "use client"
    <LanguageProvider initialLanguage={initialLanguage}> // "use client"
      <MotionRoot>{children}</MotionRoot>                // "use client"
    </LanguageProvider>
```

- **Skip-to-content link (added, a11y pass):** the root layout resolves `dictionary`
  itself (`initialLanguage === "fa" ? fa : en`, the same two dictionary modules
  `lib/i18n/server.js`'s `getServerDictionary()` picks between) purely to render this one
  server-side string before `LanguageProvider` mounts — it's the first focusable element
  in `<body>`, `sr-only` until `:focus`, then a fixed pill (`focus:not-sr-only focus:fixed`)
  jumping to `#main-content`. `AppShell.jsx`'s `<main>` carries that id; the House/
  `collection/[slug]`/`/ledger`/`/glance` routes' own `<main>` elements do not yet — add
  `id="main-content"` there too whenever those files are next touched, so the link is
  meaningful sitewide, not just on `/`.
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
- When `initialLanguage === "fa"`, the layout renders two `<link rel="preload">`
  lines (`/fonts/Dorsa-Regular.otf`, `Dorsa-Light.otf`,
  `crossOrigin="anonymous"`) at the top of `<body>` — React 19 hoists them into
  `<head>`. Dorsa is the only raw `@font-face` font (`font-display: block` — like
  `next/font`'s face below, changed 2026-09-06 from `swap` so no face ever paints its
  fallback first; text is briefly invisible instead, then appears already typeset
  correctly, where a raw `swap` would have flashed the Tahoma fallback). **The Latin
  type system is a single typeface, FractulAlt** (replaced Playfair Display + Inter,
  2026-09-27, client-confirmed as the one unified English font; the 2026-09-28 mono
  re-point made `--font-mono` resolve to it too), via one `next/font/local` call:
  `fractulAlt` (five static weight files — Light/Regular/Medium/SemiBold/Bold →
  weights 300/400/500/600/700 — the only weights actually used by any `font-*` Tailwind
  utility class in `src/components/`). **`fractulAlt` sets `preload: false`
  deliberately** — `next/font/local`'s `preload` flag applies to every file in a
  multi-weight `src` array uniformly (verified against the installed `next` package;
  there is no per-file preload option), so preloading the call would preload
  Medium/SemiBold/Bold, weights that never render above the fold on any
  route, roughly doubling the font preload budget the old single-variable-file
  Playfair/Inter setup shipped. **The 2026-09-28 unused-font purge (explicit user
  direction "delete unused ones") removed everything with no consumer**: the two italic
  faces (`fractulAltItalic` + its woff2 files — zero consumers since the 2026-09-27
  sitewide italic removal), the `--font-serif-luxury` theme token and its CSS rules,
  `jetbrainsMono` (orphaned by the mono re-point), Hairline (no `font-thin`/
  `font-extralight` utility exists), Dorsa's 800/900 weight files (nothing requests
  them; the fa `.italic`→900 rule that did was itself dead), the `Dorsa-Black.otf`
  preload, and — on `global-error.js`, which replaces the root layout and can't reach
  `next/font` variables — the hard-coded Georgia/monospace faces, replaced with the
  brand font via a fixed-URL `@font-face` pair backed by the two new
  `public/fonts/FractulAlt-*.woff2` copies. Keep the Dorsa preload files in sync with
  Farsi above-the-fold weight usage (400 body/headings, 300 `.font-mono`
  labels) — see `src/styles/README.md`'s Dorsa section. This server-side preload path can't run at all
  on a route that always bakes `en` regardless of the visitor's real cookie —
  `components/shared/DorsaPreloadScript.jsx` (added 2026-09-07) closed that gap
  client-side for exactly that case: a cookie/localStorage check identical to
  `LanguageProvider`'s own restore logic, injecting the same two preload `<link>`s
  during initial HTML parsing when the visitor actually prefers `fa`. **The House pages
  and `/glance` stopped needing it the same day** — they were switched from
  `force-static` to `force-dynamic` (see the "Config" section and CLAUDE.md's Known
  issues) specifically so `generateMetadata()` could read the real per-request cookie
  instead of freezing at build time; as a side effect, `app/layout.js`'s own
  `getServerLanguage()` call now also runs per-request for these routes, so
  `initialLanguage` is correct from the very first byte of HTML and the standard
  server-side preload above already fires correctly — no client-side compensation
  needed. `DorsaPreloadScript` is now mounted **only** in `collection/[slug]/page.js`,
  which is still genuinely statically pre-rendered via `generateStaticParams` (a
  different mechanism than `force-static` — it pre-builds a fixed, known set of product
  pages at build time regardless of any per-request cookie, and this project still wants
  that for product pages specifically, unlike the House/`/glance` case). See
  `src/styles/README.md`'s Dorsa section for the full before/after and why this was
  needed in the first place (a real "wrong font" symptom, not just a theoretical flash).
- The home page's interactive UI (`AppShell`) is a client component, but Next.js still
  server-renders client components into the initial HTML, so `/`'s SSR payload is
  metadata + JSON-LD **plus** the server-rendered `AppShell` markup (interactive state
  hydrates client-side).

## Metadata / SEO / JSON-LD

Delegated to `src/services/MetadataService.js` (see `src/services/README.md`):

- Home: `MetadataService.forHome()` → `WebSite` schema (no `SearchAction` — removed
  2026-09-07, see CLAUDE.md's Known issues).
- Collection: `MetadataService.forCollection(item)` → `Product` + a 3-level
  `BreadcrumbList` (Home → Collections → item, the middle crumb pointing at `/glance`);
  canonical `${SITE_URL}/collection/${item.slug ?? item.id}`; description sliced to 155
  chars; title is the bare item name only — an intermediate version briefly appended the
  item's `number` code (`"GÁVV — C°01"`), which doubled the separator against
  `buildMeta`'s own `" | ZAAD"` suffix; reverted the same day (see
  `src/services/README.md`).
- Layout: `MetadataService.orgSchema` → `Organization` JSON-LD, now including a
  city/country-level `PostalAddress` (Tehran/IR, added 2026-09-07 — still not a full
  street address, see CLAUDE.md's Production placeholders) alongside the still-placeholder
  `sameAs`/`contactPoint` TODOs.
- Every `buildMeta()` call now also sets an explicit `robots`/`googleBot` directive
  block (added 2026-09-07 alongside a rewrite that also introduced `SITE_CONFIG` — a
  single object grouping the brand/site-url/social/contact placeholder values that used
  to be scattered module-level constants) and always resolves an Open Graph/Twitter
  image via `resolveImageUrl`, which now falls back to a real landscape product photo
  (`/image/gavv/gavv-06.jpg`, 2200×1556) instead of the small `/logo.png` wordmark
  whenever a page doesn't supply its own image — `logo.png` stays reserved for
  `orgSchema.logo` specifically (a brand mark is not a hero photo).
- `src/app/icon.png` (added 2026-09-07, regenerated 2026-09-27 from the real
  client-provided logo) — a 512×512 transparent-padded square built from
  `public/logo.png` via `ffmpeg scale=400:-1,pad=512:512:...`, since the source
  wordmark's own aspect ratio can't serve as a favicon directly. Next.js's file-based
  icon convention auto-detects any `icon.png`/`icon.svg`/`favicon.ico` placed directly
  in `src/app/` and injects the appropriate `<link rel="icon">` tags — no manual
  `metadata.icons` config needed.
- **`public/logo.svg`** (added 2026-09-27) — the real client-provided vector wordmark
  (source: `modification/ZAAD Logo 01.svg`, cleaned of two invisible `fill: none`
  helper rects during import), static dark fill (`#231f20`), viewBox `0 0 219.72
  54.22`. `public/logo.png` (used for `orgSchema.logo`, see below) is rasterized from
  this SVG at 880×217 (4x the SVG's native point size) rather than hand-maintained
  separately — regenerate the PNG from the SVG (not from scratch) if the mark ever
  changes again. **As of 2026-09-27, every rendered brand-mark wordmark in the app uses
  this same path data inline, not this file directly** — `components/InitialLoader.jsx`
  was first (a `currentColor`-recolored inline `<svg>` wrapped in a `text-ink` element so
  it reads correctly against `bg-surface` in all three themes, replacing an earlier
  per-letter animated text stagger), and `Header.jsx`, `Footer.jsx` (`text-canvas`, the
  permanently-dark footer), `house/HouseChrome.jsx`, `ledger/LedgerHeader.jsx`, and
  `glance/GlanceHeader.jsx` (the latter four `text-ink`) now copy the identical `<svg>`
  block instead of a live per-letter animated "ZAAD" text — see
  `src/components/README.md`'s Header.jsx section for the full duplicated-markup
  contract. None of these reference `public/logo.svg` as a file: an
  `<img src="/logo.svg">` can't inherit a Tailwind text color, which every one of these
  call sites needs (a light mark on dark surfaces, theme-adaptive ink elsewhere).

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
- **History is bounded** (2026-09-06): only the last **20** messages are sent to the
  model and each message's text is capped at **2000 chars** — a long conversation can
  no longer grow the request (and token cost) without limit. The client still keeps its
  full transcript for display; only what crosses the wire is truncated.
- **Grounding:** `systemInstruction` = the brand-tone `BRAND_HERITAGE_PROMPT` (voice/style
  only — no product facts) + `CuratorService.buildContext(language)` (the real product
  catalogue, House/brand copy, and acquisition/consultation strings pulled live from
  `lib/i18n/en.js`/`fa.js`, memoized per language). The old hardcoded fictional 3-item
  catalogue has been removed — do not reintroduce invented products/prices here.
  `BRAND_HERITAGE_PROMPT` also explicitly tells the model to structure replies with only
  `**bold**` and lists, never markdown headings (added 2026-09-07) — the chat surface has
  no heading rendering, so a stray `#`/`##`/`###` showed up as a literal, meaningless
  fragment. `concierge/CuratorChat.jsx`'s `renderCuratorLine` also strips any heading
  marker it sees anyway (rendering the rest as an accent-styled line, the same treatment
  `**bold**` gets) as a client-side safety net for whenever the model does it regardless.
- **AI client:** `CuratorService.generateReply({ contents, systemInstruction })` — routes
  to an OpenAI-compatible `POST {GEMINI_BASE_URL}/chat/completions` gateway (header
  `Authorization: apikey ${GEMINI_GATEWAY_API_KEY}`) when `GEMINI_BASE_URL` is set,
  retries once against `GEMINI_BASE_URL_FALLBACK`/`GEMINI_MODEL_FALLBACK` if the primary
  gateway call fails, then falls back to the native `@google/genai` SDK with
  `GEMINI_API_KEY` and `GEMINI_MODEL` (default `gemini-3.1-flash`) if both gateway
  attempts fail or no gateway is configured. Swapping provider/model is env-var-only —
  no code change needed. See `.env.example` for all six vars, and
  `src/services/README.md`'s CuratorService section for the fallback contract.
- **Response:** 200 `{ text }` on success; 200 with a graceful fallback message if neither
  `GEMINI_API_KEY` nor `GEMINI_BASE_URL` is set; 500 `{ error }` on caught error.
- **Anti-hallucination + chat lead-capture (added 2026-09-06):** `BRAND_HERITAGE_PROMPT`
  instructs the model to never guess when a question falls outside the supplied context —
  say so plainly and offer to have a specialist follow up — and, once it has a visitor's
  name and phone number (email optional; the only two required fields) **and** explicit
  confirmation to send it, to reply with its normal confirmation sentence followed by a
  literal `[[SUBMIT_INQUIRY]]\n{"clientName": "...", "clientEmail": "...", "clientPhone":
  "...", "additionalNote": "..."}\n[[/SUBMIT_INQUIRY]]` block. This works identically on
  both AI backends (native SDK or the OpenAI-compatible gateway) since it's plain text, not
  provider-specific function-calling. **The exact marker tokens are load-bearing** — they
  must match `hooks/useConcierge.js`'s `SUBMIT_INQUIRY_RE` regex verbatim, or chat-captured
  leads silently stop reaching `/api/inquiry`. See that hook's entry in
  `src/hooks/README.md` for the client-side parsing/submission side, and the `/api/inquiry`
  section below for the `source: "chat"` request shape it posts.

## The `/api/inquiry` route (added 2026-09-03)

`api/inquiry/route.js` — `POST` only. Backs the Concierge "Inquiry & Booking" form
(`concierge/InquiryForm.jsx` via `hooks/useConcierge.js`'s `handleInquirySubmit`) **and**
(added 2026-09-06) the AI Curator chat's confirmed lead-capture (`hooks/useConcierge.js`'s
`submitChatInquiry`, triggered by `resolveCuratorReply` parsing the `[[SUBMIT_INQUIRY]]`
block described in the `/api/curate` section above).

- **Request:** JSON `{ clientName, clientEmail, clientPhone, desiredConsultation,
  additionalNote, appointmentMode, appointmentWindow, language, source }`. `source` is
  optional and only ever sent as `"chat"` by the AI Curator path — omitted (or any other
  value) means the manual form, which is the strict/default validation path below.
- **Validation is server-side, not a UI nicety** — `validateInquiry(body)` checks name
  (2–100 chars), **phone required** (regex format), **email optional** (regex format only
  if provided — swapped from the original email-required/phone-optional design at the
  user's explicit request), `desiredConsultation` against `["acquisition", "consultation",
  "visit"]` (the form's 3-option category select — not `"interior"`/`"material"`, an
  earlier 4-option design), `appointmentMode`/`appointmentWindow` against their own fixed
  enums, and a 2000-char cap on `additionalNote`. **`source === "chat"` skips the
  `desiredConsultation`/`appointmentMode`/`appointmentWindow` checks entirely** — a chat
  lead has no consultation-type or appointment-slot picker — defaulting them to
  `"consultation"`/`null`/`""` in the saved record instead of erroring; name/phone/email/
  note keep the exact same rules as the manual form on both paths. On failure: 400
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
  `source: "chat" | "form"` (2026-09-06, so a human scanning `data/inquiries.json`/`/ledger`
  can tell which channel a lead came from — `Ledger.jsx` renders it as
  `t("ledgerSourceChat")`/`t("ledgerSourceForm")` in each entry's meta line, defaulting to
  "form" for any pre-existing record with no `source` field at all), `submittedAt`, `viewed: false` — the ledger's
  read/unread flag, flipped only by `/ledger`'s `setViewedAction`, never by the visitor) to `data/inquiries.json` (repo-root `data/`, a sibling of `public/`, not
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
  true`, `images.remotePatterns` for `ai.google.dev` over https only — no remote stock
  imagery anywhere in this codebase (2026-09-05); every image/video source is a local file
  under `public/`. Any new remote image host needs a `remotePatterns` entry here.
  `images.formats` is `["image/avif", "image/webp"]` (2026-09-06) — Next serves AVIF to
  browsers that accept it (~20–30% smaller than WebP at the same quality); the first entry
  is the preferred format, so keep AVIF first. Also defines `redirects()`: permanent
  `/brand-value` → `/story` and `/csr` → `/sustainability` (the two retired House
  sections folded into the diptych routes).
- **`next.config.js` was a dead duplicate** (only a webpack `IgnorePlugin` for
  README.md) — it has been **deleted**. Do not recreate it; edit `next.config.mjs`.
- `jsconfig.json`: `baseUrl: "."`, `paths: { "@/*": ["./src/*"] }`.
- No `revalidate` / `fetchCache` exports anywhere. The curate route is
  implicitly dynamic (reads `request.json()` + env); home is dynamic too (renders per
  request, not statically); `/collection/[slug]` is genuinely static (via
  `generateStaticParams`, a fixed known set of product pages built once). `/ledger`,
  `/about`, `/story`, `/sustainability`, and `/glance` all carry an explicit
  `export const dynamic = "force-dynamic"` — `/ledger` because it's cookie-gated and must
  never cache; the House routes and `/glance` since 2026-09-07 (changed from
  `force-static`) so their `generateMetadata()` reads the visitor's real
  `zaad_preferred_language` cookie per request instead of freezing at build time in
  English (see the font-preload paragraph above and CLAUDE.md's Known issues for the
  full story and the trade-off it accepts).

## Known SEO gaps

- **Fixed 2026-09-07 — Home `SearchAction` targeted a 404:** `forHome()` used to emit a
  `WebSite` schema with a `SearchAction` whose `urlTemplate` was
  `/collection?q={search_term_string}` — no `/collection` route or site search ever
  existed, so the target 404d. Removed outright rather than built out (see CLAUDE.md's
  Known issues). The sitemap and collection breadcrumb had the same class of 404 and
  were fixed the same way: the sitemap now lists `/showcase/index.html` — the real
  static URL that serves 200 — and the breadcrumb is `Home → Item`, dropping the dead
  `/collection` crumb.
- **Hreflang is incorrect:** `MetadataService.hreflangFor` returns the same URL for
  `x-default`, `en`, and `fa` (no locale-prefixed routing). Declaring `fa` hreflang on
  the identical `en` URL is not a valid alternate-language signal.
- **Sitemap uses `en.collection` ids only** — currently fine (fa collection has the
  same ids) but fragile if they ever diverge.
- **TODO placeholders** in `MetadataService` (`@zaad_x_placeholder` social handles,
  `zaad_placeholder` contact url) ship in JSON-LD/OG tags.

## Known rendering gap

- **Date-derived text computed at render time on `collection/[slug]`.** `Footer.jsx`
  (`localizedYear`, via `src/lib/localizedYear.js`) and, on the home route only (it's
  never mounted on the House routes or `/glance`), `header/MenuControls.jsx`'s
  timestamp strip (`now` — a `useState(() => new Date())` kept fresh by a 15-second
  interval, formatted into `stripLabel`) both call `new Date()` directly in a
  `"use client"` render. `collection/[slug]` is the one route still genuinely
  generated at build (via `generateStaticParams`), so if the deployed build isn't
  rebuilt across the boundary the date value crosses (a year rollover for the footer
  year), the client's hydration pass can compute a different value than what's baked
  into the static HTML. Home, the House routes, and `/glance` are all rendered
  per-request (see the Config section) — `Footer`'s `localizedYear` there is
  recomputed on every request, so the gap shrinks to an ordinary
  server-render-vs-client-hydration timing skew, not build staleness; the House
  routes stopped being static-route candidates for this note specifically when they
  switched to `force-dynamic` 2026-09-07. Both carry `suppressHydrationWarning` (the footer's year spans;
  `MenuControls`'s strip container div) to silence the resulting console warning.
  Neither is gated behind the mount-effect (`useState(null)` guard, render
  nothing until mounted) idiom `ChapterHero`'s `activeVideo` uses for the same class of
  problem — an intentional, low-risk tradeoff (the mismatch window is narrow and cosmetic),
  not an oversight, but worth revisiting if a stricter hydration-parity bar is ever wanted.