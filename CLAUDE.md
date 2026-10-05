# CLAUDE.md

Guidance for Claude Code working in this repository. ZAAD is a small Next.js 15
digital showroom (App Router, React 19, JavaScript — no TypeScript). Keep changes
small and proportionate to a ~66-file project.

## Stack

- **Next.js 15** (App Router) · **React 19** · **JavaScript** (`.js`/`.jsx`, no TS)
- **Tailwind CSS v4** (CSS-first `@theme`, PostCSS plugin — no `tailwind.config.js`)
- **Motion** (the `motion` package; client components import from `motion/react`) — the app's
  animation system for scroll-into-view reveals and interactive state
- **GSAP** (`gsap` + `ScrollTrigger`) — scoped to four spots that need timeline sequencing,
  a scroll-pin, or a scrubbed effect `motion` can't do natively (`Hero.jsx`'s entrance timeline,
  `Vision.jsx`'s pinned image column, `house/ChapterPieces.jsx`'s `ChapterHero` scrubbed
  media-column parallax — a hard pin doesn't work there since the hero's two columns are roughly
  equal height, so it uses a non-pinning `scrub` tween instead, and `app/credits/page.js`'s
  scroll-scrubbed reading-progress bar under the fixed header, added 2026-09-07 at explicit user
  direction), plus one integration-only consumer: `useLenisScroll` (see below) drives Lenis's raf
  through `gsap.ticker` and syncs `ScrollTrigger.update` — no timelines, no pins. Not a `motion`
  replacement — see `src/components/README.md`'s Conventions section before adding a fifth usage.
- **Lenis** — inertial smooth scrolling on the window. Initialized via the shared `src/hooks/useLenisScroll.js`
  hook (dynamic import, gsap-ticker-driven, synced with `ScrollTrigger`), consumed by `AppShell.jsx`
  (showroom), `house/HouseSmoothScroll.jsx` (a render-null leaf mounted in `(house)/layout.js` for the
  House routes), `collection/[slug]/CollectionPageClient.jsx` (product pages), `ledger/Ledger.jsx`
  (`/ledger`), and `glance/GlancePage.jsx` (`/glance`)
  — one instance per mounted route, never more than one at a time. `ScrollService`'s three `animate*` exports delegate
  to the registered instance. Skipped entirely under `prefers-reduced-motion` (RAF fallback runs
  instead). Inner scrollers must opt out via `data-lenis-prevent`.
- **lucide-react** icons · **`@google/genai`** for the AI Assistant (Gemini) route
- Path alias: `@/*` → `./src/*` (see `jsconfig.json`)

## Commands

```bash
npm install
cp .env.example .env          # then set the real GEMINI_API_KEY (or GEMINI_MODEL/
                               # GEMINI_BASE_URL/GEMINI_GATEWAY_API_KEY for a gateway —
                               # see src/services/README.md's CuratorService section)
npm run dev                  # http://localhost:3000
npm run build
npm start
npm run lint
npm run format               # prettier --write .
npm run clean                # rm -rf .next out
```

## Architecture topography (read the folder doc before editing that folder)

| Folder | Doc | What's there |
|---|---|---|
| `src/app/` | `src/app/README.md` | Routes, server/client boundary, metadata/SEO/JSON-LD/sitemap/robots, the `/api/curate` route |
| `src/components/` | `src/components/README.md` | The flat-orchestrator component pattern, the shared `Lightbox` contract, motion `layoutId`/`key` contracts |
| `src/hooks/` | `src/hooks/README.md` | The hooks and their contracts |
| `src/services/` | `src/services/README.md` | `ScrollService`, `MetadataService`, `LanguageProvider` (the React i18n context lives here, **not** `src/contexts/` — that folder is empty) |
| `src/lib/i18n/` | `src/lib/i18n/README.md` | Locales, dictionaries, the `zaad_preferred_language` cookie transport |
| `src/styles/` | `src/styles/README.md` | The design system, theme tokens, motion philosophy |

## Policies (apply to every session)

### 1. Read the folder doc before editing it
Before making any change or addition inside a folder, read that folder's doc (above)
first. If the doc contradicts the code, **trust the code** — then fix the doc (policy 2).

### 2. Keep the docs honest
When you establish, confirm, or change a reusable pattern, a load-bearing contract,
or a convention, update the relevant folder doc **in the same change**. Do not let the
docs drift from the code. Stale docs are worse than no docs.

`src/app/credits/page.js` (added 2026-09-07) is a client-facing summary of every page and
capability on the site, by explicit user direction, and is held to this same rule: any turn
that adds, removes, or materially changes a page or a smart feature must update this page's
content (and its `en.js`/`fa.js` copy) in the same change, exactly like a folder doc. Treat a
stale credits page as a doc-honesty violation, not a cosmetic gap.

### 3. Review before calling work done
Before considering any non-trivial change complete, run a rigorous multi-agent review
for likely breakage. Spawn 2–3 subagents (or use `/code-review`) to check, **against the
real code**, for:

- hydration mismatches and broken server/client boundaries
- broken Motion contracts: the four global `layoutId` groups, the `key`-driven
  `AnimatePresence` cross-fades (see "Load-bearing contracts" below)
- i18n breakage: hard-coded English bypassing `t(...)`, the `zaad_preferred_language`
  cookie name, `<html lang/dir>` + `farsi-mode` class
- scroll breakage: the `88`px header offset, the `120ms` pre-scroll timeouts
- theme breakage: CSS token renames
- regressions in any contract listed below

Verify each finding against the actual code before acting. Apply low-risk fixes
directly. Ask the user only on architecturally significant changes. Cap fix loops at
**two cycles** — after that, surface to the user.

### 4. Review hook (not present — opt-in later)
There is **no** PostToolUse review hook in this project. If per-edit automated review is
wanted later, add a single lightweight Node hook (single Anthropic call, diff-only,
code-files-only, visible logging) — do **not** port the PHP/Ollama dual-reviewer
machinery from other projects.

## Load-bearing contracts (a future edit breaks these)

- **i18n cookie `zaad_preferred_language`** — written client-side in
  `LanguageProvider` (localStorage + cookie), read server-side in
  `lib/i18n/server.js` via `next/headers`, **and** read client-side on
  `LanguageProvider` mount to restore the locale on `collection/[slug]` — the one
  remaining route where the server bakes `initialLanguage="en"` regardless of the real
  visitor (`generateStaticParams` prebuilds it, so `cookies()` can't see a real request).
  Since 2026-09-29 the product page's **item content** no longer depends on that restore at
  all: `collection/[slug]/page.js` ships both fully-resolved variants
  (`getResolvedItemPair` → `{en, fa}`, captions included) and `CollectionPageClient` picks
  `items[isFarsi ? "fa" : "en"]` — before, the single cookie-resolved `item` prop meant a
  client language toggle left all item content (description, specs, image captions) in the
  server-baked language. The restore still matters for SSR `lang`/`dir` and first-paint text.
  The House pages no longer need this restore for `initialLanguage` (switched from
  `force-static` to `force-dynamic` 2026-09-07 — see the Known issues entry below), but
  the mount-restore code itself still runs there harmlessly as a no-op.
  Renaming any side breaks SSR `lang`/`dir` and the static-route restore. The mount
  restore uses `setLanguageState` (not `setLanguage`) so it doesn't re-write the cookie;
  because state changes after first client render, the `key={language}` cross-fade
  fires once on load when the restored locale differs from the SSR-baked one.
- **Server → client `initialLanguage` prop chain** — `app/layout.js` runs
  `getServerLanguage()` on the server and passes it to the client `LanguageProvider`.
  Do not make the layout a client component; do not drop the prop.
- **`key={language}`** on the provider's wrapping `motion.div` triggers a full-app
  cross-fade on every locale switch. Editing it changes the whole app's transition.
- **Four global Motion `layoutId` groups** — each must have exactly one mounted
  element or the indicator flies between sections:
  `activeLanguageBlobInNavbar` (MenuControls), `activeThemeBlobInNavbar`
  (MenuControls), `activeCurationTabLine` (SpecsTabs), `activeArchetypeTabLine`
  (CollectionTabs).
- **`activeAppointmentBlob`** (concierge `InquiryForm`) — the Audience toggle's
  indicator. Local to the inquiry form (not a cross-section group), but the same
  single-mounted rule applies: only the selected pill renders it, or the blob flies.
- **`activeLedgerFilterLine`** (`ledger/Ledger.jsx`'s all/unviewed/viewed tabs) — same
  local-scope, single-mounted pattern as `activeAppointmentBlob`, on the `/ledger` route.
- **Phone numbers and any Farsi value made of space-separated numeric groups always render
  inside a plain `<span dir="ltr">`** — never bare, never `.font-latin` (it forces a Latin font
  lacking Persian digit glyphs). The spaces between digit groups are bidi-neutral and visually
  reorder under an RTL paragraph. `studioPhone` (`+۹۸ ۲۱ ۰۰۰۰ ۰۰۰۰`) is the canonical case,
  wrapped in `concierge/SectionHeader.jsx`, `house/ChapterPieces.jsx`, and `Footer.jsx`
  (and the concierge appointment slot times in `InquiryForm.jsx`); when the value is injected
  into a larger string (a `.replace()` template) a span is impossible — wrap it in the
  Unicode LRE/PDF pair (U+202A/U+202C) instead. See
  `src/lib/i18n/README.md`'s "Farsi-digit" section for the full bidi reasoning. Apply
  automatically to every future phone/number-group rendering — this rule is standing; the user
  will not re-mention it.
- **The House top nav shows only the current page, not all 3 links.** `house/HouseChrome.jsx`
  renders `t(currentNavItem.key)` (`NAV.find((item) => item.href === pathname)`) as a static label
  with a static underline bar beneath it (the "ON" look) — no `motion.span`, no `layoutId`, since
  there's nothing to animate between once only one item ever renders. The other two House pages
  are reachable via the shared `Footer.jsx`'s House Directory column instead — deliberately not duplicated
  in both header and footer. This has been implemented, reverted, and reimplemented more than once
  in-session at the user's explicit direction; the current (final) state is "current page only, in
  the header." Don't reintroduce the multi-link nav without direct instruction. (The earlier
  `activeAboutTabLine` rail indicator, and later `activeHouseNavLine`, were both removed for the
  same reason: the underline stopped being meaningful once there was nothing to differentiate.)
- **The House routes are a route group, not showroom tabs** — `src/app/(house)/`
  holds `about`, `story`, `sustainability` (3 routes, not 5). Since 2026-10-05 (owner
  direction) **all three House pages are single-column `HouseChapterShell` pages**:
  `/about` reads the `about` entry + `aboutStats` (the only stat grid), `/story` and
  `/sustainability` read the `brandValue` and `sustainability` entries respectively.
  The former two-column `HouseDiptychShell.jsx` diptych and the `aboutSections` `story`
  entry were deleted outright the same day — the story narrative now lives once, as the
  homepage `heroDesc` (owner: "bring it to homepage hero… not entirely erasing it"), so
  don't reintroduce a story chapter or a diptych shell without direct instruction.
  The `aboutSections` data has 3 entries (`about`, `brandValue`, `sustainability`),
  each with plain blank-line-separated paragraphs — the `### I.`/«یک.» numbered
  sub-headings were stripped 2026-10-05 at owner direction, and `ChapterPieces`'
  `EditorialBlock` now splits on blank lines and renders one `<p>` per paragraph (no
  heading parsing; `whitespace-pre-line` is gone). `HouseChapterShell`'s editorial
  section also lost its two `.pattern-diamond-grid` ambient blobs the same day (owner
  direction — no bg pattern on the House pages; only `Materials.jsx` still carries the
  pattern since the Hero band's pattern strip was removed 2026-10-05 at owner
  direction). The same pass removed every House hero paragraph —
  `brandValueHeroIntro` (like `sustainabilityResponsibilityHeroIntro` before it) and the
  `about` hero intro are gone from both dictionaries; no House page passes `heroIntro`
  (owner: "no text in those heroes") — and the same pass merged the hero and the
  editorial section outright (owner: "merge hero and paragraphs… two sections are
  total waste"): the three House pages no longer render `ChapterHero` at all.
  `HouseChapterShell` is now one merged section — small serif h1 title in the
  homepage section-header idiom — **one title only**: the page's `t(heroTitle)`
  (e.g. `aboutTitle`, `storyValueHeroTitle`, `sustainabilityResponsibilityHeroTitle`)
  rendered as a small gold mono uppercase h1 (`MaisonReveal` `unveil` —
  **not** `variant="lines"`: this page hit the same `LinesReveal` mask-hides-title
  gotcha as the credits page h1, see `src/components/README.md` — no accent rule
  under it), then `EditorialBlock` paragraphs and the chapter image side by side in a
  two-column grid (image first on mobile, text left / image right on desktop;
  **no "Read More" MaisonButton and no scroll-down arrow**; the image is the
  permanent `lux-ken-burns` still — the randomized chapter videos no longer play
  anywhere). `ChapterHero` itself survives — redesigned 2026-10-05 to mirror the
  homepage `Hero.jsx`'s grammar (full-height media column, hairline grid, foundation
  scrim, bottom-start control — see `src/components/README.md`) — and is now
  **`/glance`-only**
  (its `heroIntro` + `withVideo={false}` + `scrollTargetId="glance-body"` passes are
  unchanged; its default `scrollTargetId="house-editorial"` is inert — no House
  page mounts it or carries that id anymore). No closing signature anywhere (the `EditorialSignature`
  Z-medallion piece was deleted entirely — nothing renders it anymore). A shared server `layout.js`
  renders `components/house/HouseChrome.jsx` (slim header: back-to-showroom, ZAAD
  wordmark, the current page's name as a static underlined label, compact language/theme
  control) and the shared `components/Footer.jsx` (since 2026-09-06, all routes share the
  homepage footer by user direction). `about/page.js`,
  `story/page.js` and `sustainability/page.js` render
  `house/AboutChapter.jsx`, `house/StoryValueChapter.jsx` and
  `house/SustainabilityResponsibilityChapter.jsx` on
  the single-column `house/HouseChapterShell.jsx` (merged title + paragraphs/image
  section + optional stat grid + cross-link cards + call strip; only `/about` passes
  stats).
  Do **not** reuse the showroom
  `Header`/`MenuControls` on the house routes — they are wired to
  `useShowroomNav` (in-app `setActiveTab` + scroll + the 120ms pre-scroll contracts) and
  to the global `activeLanguageBlobInNavbar`/`activeThemeBlobInNavbar` layoutId groups;
  reusing them cross-route would fly the indicators and break the scroll contracts. The
  shared `Footer` is the one exception (2026-09-06, explicit user direction: one footer
  site-wide) — safe cross-route because it renders no `layoutId` and its showroom-directory
  buttons fall back to `router.push("/#section")` whenever `onScrollToSection` isn't a real
  in-app scroller. **`collection/[slug]/CollectionPageClient.jsx` also passes
  `onScrollToSection`/`setActiveTab` to `Header`/`Footer`, not just `AppShell`** (fixed
  2026-09-07 — this doc previously said "only AppShell passes it," which was already
  inaccurate and masked a real bug: this route's versions used to call `router.push`
  directly instead of going through `ScrollService.animateScrollTo`, so a header/footer
  "jump to Concierge" click from a product page landed on whatever section the homepage's
  images happened to have pushed into that scroll position by the time Next's own
  one-shot hash-scroll fired, before Lenis/GSAP/images ever settled). Both routes' props
  are now real, correctly-behaving cross-route navigators: `CollectionPageClient.jsx`'s
  `onScrollToSection(sectionId)` does `router.push('/#${sectionId}')`, and `AppShell.jsx`
  has a mount effect that reads any incoming `location.hash`, waits the same 120ms
  lead-time as every other pre-scroll call site, then re-runs the correct, Lenis-aware
  `animateScrollTo` and strips the hash — the one place that actually lands the scroll
  correctly regardless of which route it was launched from (since 2026-10-01 it calls
  `animateScrollToSettled` instead — the one-shot measurement landed short whenever the
  homepage's deferred media/lazy images settled during the 1450ms glide, e.g. the
  product-page consult CTA ending on a section above `#concierge`; the settled variant
  polls for drift for ~3s and issues short 600ms corrective glides, cancels on the first
  user wheel/touchmove/keydown/pointerdown or any newer programmatic `animate*` call, and
  its stopper is cleaned up on unmount — see
  `src/services/README.md`'s ScrollService section). See `src/services/README.md`'s
  ScrollService section for the full mechanism, and `src/components/README.md`'s Header
  section for `handleInquiryClick`'s matching fix. **`Footer.jsx`'s "Main Page" button needed
  the same fix (found in review, fixed 2026-09-07)** — `handleMainPage` used to assume
  `onScrollToSection` being truthy meant "mounted inside `AppShell`" and just called
  `animateScrollToTop`, which on `/collection/[slug]` (where `onScrollToSection` is also
  truthy, per the note above) only scrolled the outgoing product page to its own top instead
  of returning home. `Footer` now also takes an `onSelectProduct` prop (from `AppShell.jsx`'s
  `setSelectedProduct` / `CollectionPageClient.jsx`'s own `onSelectProduct`) and
  `handleMainPage` calls `onSelectProduct?.(null)` — the same dual-context "go home" recipe
  `Header.jsx`'s `handleBrandClick` already used. The
  compact control in `HouseChrome` uses plain active styling (no layoutId) on purpose.
- **Duplicated `imageKey` strings** — `showcase/ImageViewer.jsx` and
  `showcase/Lightbox.jsx` build identical `${id}-${idx}` keys. Keep
  them byte-identical or the viewer and lightbox animate out of sync.
- **Zoom stops `[1.0, 1.8, 3.0]`** are duplicated in `hooks/useLightbox.js`
  (`cycleZoom`) and `components/shared/Lightbox.jsx` (preset array). Change one,
  change the other.
- **Pan coordinates are 0–100 percentages, not pixels** — in `useLightbox`,
  `useShowcase`, `shared/Lightbox.jsx`, and `showcase/ImageViewer.jsx`.
- **`ScrollService.js` measures the header height live** — every attempt reads
  `getBoundingClientRect().bottom` of the `[data-site-header]` element (added to
  `Header.jsx`'s root; `header` tag fallback for House chrome, `88` if none). The old
  hardcoded `offset = 88` was ~27px wrong on mobile.
- **`animateScrollTo` retries until the target mounts** — if `getElementById` returns
  null it retries every 100ms up to 1200ms, then bails silently; a module-level run-id
  makes the newest call cancel older retry/scroll loops (last-call-wins). The **120ms
  pre-scroll timeouts** in `MenuPanel`, `Header`, `useShowroomNav`, and `AppShell` are now
  a soft lead-time, not a hard race — but keep them: they still avoid visibly scrolling
  mid-transition. (`Footer`'s are 100ms — a deliberate shorter lead-time in the current
  live-edited file, not drift to be "fixed".)
- **`generateStaticParams` emits `en.collection` ids only** — collection URLs derive
  from the English collection. Item `id`s must be URL-safe and stable.
- **Directional icons always point left in Farsi**, regardless of which direction they point
  in English (not a mirror-to-opposite rule). `MaisonButton` takes an explicit `icon` prop —
  always pass one; its English-substring-matching fallback (`getRelevantIcon`) silently breaks
  on Farsi labels. See `src/components/README.md` for the full icon-direction and icon-choice
  conventions.
- **Index numbers lead at the right edge in Farsi** (standing rule, 2026-09-29) — any paired
  number+label row must render the number first in reading order (rightmost in RTL), never
  trailing at the far-left edge. Two correct idioms: DOM-number-first for natural flow rows
  (`glance/GlancePage.jsx`'s rails, `glance/GlanceChapter.jsx`'s spec lists — no class needed,
  RTL flips them correctly), and `rtl:order-first` on the number span when English needs the
  number elsewhere (`Materials.jsx`'s tab cards additionally use `rtl:justify-start` so the
  number sits adjacent to the label instead of pinned to the opposite edge by
  `justify-between`). The broken anti-pattern was a `justify-between` row with DOM
  name-first, which put the number at the far-left edge in Farsi.
- **`.font-farsi` / `.font-latin`** (`src/styles/globals.css`, documented in
  `src/styles/README.md`) — opt-in Dorsa for translated non-heading text vs. opt-out back to
  Latin for permanently-Latin brand content (collection `number`/`name`). Picking the
  wrong one either leaves real Farsi text in the wrong typeface or forces Dorsa onto Latin
  product codes like "C°01"/"GÁVV".
- **The `[[SUBMIT_INQUIRY]]`/`[[/SUBMIT_INQUIRY]]` marker tokens** (AI Curator chat
  lead-capture, added 2026-09-06) — `api/curate/route.js`'s system prompt instructs the
  model to emit this exact block once it has confirmed contact info to forward, and
  `hooks/useConcierge.js`'s `SUBMIT_INQUIRY_RE` regex parses it back out client-side.
  Change one and not the other and chat-submitted leads silently stop reaching
  `/api/inquiry` — no error, just nothing saved. See `src/app/README.md`'s `/api/curate`
  section and `src/hooks/README.md`'s `useConcierge.js` entry.

## Known issues (documented in folder docs; fix, don't replicate)

- `hreflangFor` returns the same URL for `en` and `fa` (no locale-prefixed routes) — inert,
  not actively harmful; a real fix needs locale-prefixed routing. See `src/services/README.md`.
- **Fixed 2026-09-07:** Farsi metadata (title/description/OG/JSON-LD) never reached
  search engines on `/about`, `/story`, `/sustainability`, or `/glance` — those routes
  were `force-static`, so `generateMetadata()` ran once at build time with no real
  cookie to read, freezing every visitor's SEO snippet in English regardless of the page
  content they actually saw. Switched all four to `export const dynamic =
  "force-dynamic"` so `getServerLanguage()` reads the real per-request cookie; accepted
  trade-off is losing static-generation speed on these four low-traffic editorial pages
  (not the product pages or homepage, which already rendered per-request) in exchange
  for correct Farsi search snippets/social previews. As a side effect,
  `shared/DorsaPreloadScript.jsx` (see below) is no longer needed on these routes and was
  removed from `(house)/layout.js`/`glance/page.js` — `initialLanguage` is now correct
  from the first byte of HTML on them, so the standard font-preload path just works. See
  `src/app/README.md` and `src/styles/README.md`.
- **Fixed 2026-09-07:** the home `WebSite` schema's dead `SearchAction` (targeted
  `/collection?q={search_term_string}`, no such route/search ever existed) was removed
  outright rather than built out — a real site-search feature is out of scope for a
  4-item boutique collection (every piece is already visible in one showcase scroll; a
  search feature would be pure overhead with nothing to search for). The sitemap and
  collection breadcrumb no longer 404 either (sitemap lists `/showcase/index.html`, the
  real static URL; breadcrumb is `Home → Item`). See `src/app/README.md`.
- **Fixed 2026-09-07:** OG/logo assets 404 (found in the 2026-09-06 perf audit) — every
  `image:` reference in `MetadataService.js`'s `buildMeta` call sites pointed at
  `/og/home.jpg`, which never existed, and `orgSchema.logo` pointed at a missing
  `/logo.png`. `public/logo.png` now exists (a 367×161 wordmark PNG) and is used for
  `orgSchema.logo` only; the OG/Twitter default image (`resolveImageUrl`'s fallback) is
  `/image/gavv/gavv-06.jpg`, a real 2200×1556 landscape product photo — picked over the
  wordmark specifically because a 367×161 logo makes a poor 1400×920 social-share card.
  Swap `SITE_CONFIG.defaultOgImage` in `MetadataService.js` whenever a dedicated OG image
  exists; nothing else needs to change. See `src/services/README.md`.

### Production placeholders — real values needed before launch (consolidated 2026-09-07)

Every fake/placeholder value left in the codebase, gathered in one place so a future
session doesn't have to re-discover them by grepping. Each is a real gap the client
needs to supply, not a code bug — nothing here should be invented.

- **Phone (resolved 2026-09-27):** `lib/i18n/en.js`/`fa.js`'s `studioPhone` is now the
  real studio number from the client's letterhead — `"+98 21 75982"` (en) /
  `"+۹۸ ۲۱ ۷۵۹۸۲"` (fa, Hindi-Farsi digits, same `dir="ltr"` wrapping as before,
  untouched). `studioPhoneTel` is `"+982175982;ext=157"` — the RFC 3966 `;ext=` tel-URI
  parameter carries the letterhead's "Ext. 157", since neither call site
  (`concierge/SectionHeader.jsx`, `house/ChapterPieces.jsx`) needed any change beyond the
  dictionary value (both just interpolate `tel:${t("studioPhoneTel")}`).
  **WhatsApp deep link hidden 2026-09-29 at owner direction**: the real number is a
  landline-style extension line, not confirmed WhatsApp-reachable, so
  `SITE_CONFIG.contact.whatsappUrl` and `orgSchema.contactPoint`'s `url:` line are
  commented out in source — uncomment with a real deep link when one is confirmed.
- **Address (resolved 2026-09-27; visible footer line added 2026-09-29):**
  `MetadataService.orgSchema.address` has the full real `PostalAddress` — `streetAddress:
  "Unit 13, 4th Floor, No. 1489, North Shariati St"`, `addressLocality: "Tehran"`,
  `addressCountry: "IR"`, `postalCode: "1941913415"` — and since 2026-09-29 the visible
  footer shows the full one-line address too (`footerStudioAddress` key in both dictionaries —
  Tehran prepended into the street address by owner direction, the former separate
  `footerMilanZAAD` "Tehran" row deleted); the phone line was already in the
  footer brand column.
- **Social media (Instagram real; the rest hidden 2026-09-29 at owner direction):**
  `SITE_CONFIG.socials.instagram` and `lib/socialLinks.js`'s Instagram entry point at
  the real handle, `zaaddesignofficial` — the only handle the client supplied. LinkedIn,
  Telegram, WhatsApp, and `SITE_CONFIG.twitter.site` (the X card handle) are placeholders
  that now ship **nowhere**: commented out of `SITE_CONFIG` metadata (LinkedIn/Telegram
  dropped from `sameAs`, WhatsApp from `contactPoint`, X from the Twitter card) and
  rendered disabled/unclickable in the footer (`disabled: true` in `lib/socialLinks.js` →
  `shared/SocialLinks.jsx` renders a dimmed `aria-disabled` span). Restore each by
  uncommenting its line and dropping its `disabled` flag once a real handle exists.
- **Production domain (resolved 2026-09-29):** owner chose the letterhead's real domain —
  `https://zaaddesign.com` now drives `app/layout.js`'s `metadataBase`,
  `MetadataService.js`'s `SITE_CONFIG.siteUrl`, `app/sitemap.js`/`app/robots.js`'s
  `SITE_URL`, all eight dictionary `imageUrl` values, and the InquiryForm email
  placeholder (`client@zaaddesign.com`). No `zaad.com` reference remains in `src/`.

### Open points from the 2026-09-27 redesign session — awaiting owner input

Surfaced mid-session, deliberately not actioned without an explicit go-ahead. Check this
list before assuming a related item is finished.

- **"Ribbon" yellow wordmark — resolved 2026-09-29 (owner decision: footer strip).** The
  brand-book `ZAAD Logo 02.svg` lives at `public/logo-ribbon.svg` (since 2026-09-27) and is now
  used as a decorative scrolling band at two call sites via `shared/RibbonScroll.jsx`:
  `Hero.jsx`'s bottom transitional strip and `Footer.jsx`'s full-bleed closing strip —
  never as a logo mark replacement (all logo call sites still use the single dark `Logo 01.svg`).
  Direction follows reading direction (`html[dir="rtl"]` CSS reversal; the marquee viewport is
  `dir="ltr"` so the track can't slide off-screen in Farsi), and the footer band goes grayscale
  in the light theme only (`ribbon-neutral-in-light`). See `src/components/README.md`'s
  `shared/RibbonScroll.jsx` section.
- **WhatsApp deep link — resolved 2026-09-29 (hidden, not built):** same decision as the
  Social media bullet above — `SITE_CONFIG.contact.whatsappUrl` and `contactPoint`'s `url:`
  are commented out; the footer WhatsApp icon renders disabled. Uncomment with a real
  deep link once the landline (`+98 21 75982 ext. 157`) is confirmed WhatsApp-reachable.
- **LinkedIn / Telegram / X handles — resolved 2026-09-29 (hidden, not built):** same
  decision as the Social media bullet above — placeholders are commented out of metadata
  and rendered disabled in the footer; restore each once a real handle is supplied.

**Resolved 2026-09-28 (the copy-replacement pass):** the final site copy replacement from
`modification/لیست حذفیات زاد.docx` was actioned end-to-end (renames, content blocks, and
blank-field removals applied to `fa.js`/`en.js` in parity; the Material Monograph box — the
section the client's earlier document ordered removed — was among the removals, along with the
Hero badge/quote strip, archive numbers, continue-browsing feature, spec-grid label rows, and
the menu/footer "Other Pages" heading). Brand spelling is `زااد` sitewide for incidental Farsi
mentions (was `زاد`). Two low-confidence docx lines were deliberately **not** actioned and need
an owner call, since resolved: (a) docx lines 178–183 list the product page's `AcquisitionCTA`
strings (`acquisitionPrivileges`/`acquisitionHeading`/`acquisitionDesc`) twice — once blanked,
once with no pipe. The owner confirmed 2026-09-28 that **no mark also means delete** (the same
rule as blank), so the "keep" reading was wrong: the CTA box's whole text block was removed from
`AcquisitionCTA.jsx` and all three keys deleted from both dictionaries (the box keeps only its
CTA pair); (b) docx line 44's bare
"خرید یا مشاوره" (blank = remove) — resolved later on 2026-09-28 by the owner's confirmation:
the parenthetical was erased from the inquiry form heading, `acquisitionCard` is now
"فرم درخواست"/"Request Form". The "نمای ژورنالی" (Journal View) CTA item from the earlier
redesign doc was also resolved 2026-09-28 by the owner's clarification: it meant aligning the
`درخواست مشاوره` + `مشاهده مجموعه` CTA pair with the three view-mode buttons (journal/macro/
360°) under the collection image — already implemented; its remaining ask (the Materials
accordion defaulting open/uncollapsed) was applied the same day.

## Coding conventions

- `"use client"` on shell files only; sub-components inherit the boundary.
- No hard-coded color hex in components — use semantic tokens from
  `src/styles/README.md` (the one documented exception is `#C5A059` in `header/`).
- No code comments unless the logic would genuinely surprise a reader.
- User-facing strings go through `t("key")` from `useLanguage()` — never inline
  English (the product-details page is the known exception being worked down).
- No barrel files / index re-exports in component folders — direct path imports.

## PostToolUse review gate + reviewer-must-match-agent rule

This project now runs the same three-pipeline agent architecture as its sibling projects (Fateh, BMS-CM, BMS-CX) — uniform mechanism, project-specific content only in the pattern references. `.claude/hooks/post_tool_review.php` only actively gates **Ollama-native** sessions (`ANTHROPIC_BASE_URL` contains `11434`): two `glm-5.2:cloud` reviewers run a 2-round back-and-forth, gated at 93% confidence. In every other session (Claude Code, Omni) the hook is a deliberate no-op — it cannot authenticate a real review call in either. The reviewer must always match the driving agent instead: after completing a coherent unit of work, spawn a reviewer subagent via the `Agent` tool — plain Claude Code → `claude-reviewer`, Omni → `omni-reviewer` (pinned `model: ArashReviewerCombo`, no external dependency). This is in addition to, not a replacement for, the review policy above (2-3 subagents on named risk areas) — one subagent call can carry both. Every `.claude/agents/*.md` role follows one `<pipeline>-<job>` naming scheme: `claude-planner`/`omni-planner`, `claude-coder`/`omni-coder`, `claude-reviewer`/`omni-reviewer`. Delegation to `glm-5.2:cloud` is Claude-Code-only — Ollama and Omni each have their own native mechanism.
## Generalized pipeline (deployed 2026-08-30 — supersedes policy 4 above and everything after it)

The Fateh pipeline now runs in this project; stack differences live only in `.claude/hooks/pipeline_config.php` (stack: next; skills: code-reviewer + nextjs-performance) and the `nextjs-performance` skill installation.

**Read-skills-first (hard prerequisite):** on the very first turn of every session, before replying or doing anything else, read `.claude/skills/code-reviewer/SKILL.md` and `.claude/skills/nextjs-performance/SKILL.md` (plus `.claude/skills/ollama/SKILL.md` in Ollama-native sessions), then summarize their key rules in your own words. The `vanilla mode` bypass phrase drops this read and all other project policies; `resume project mode` or a new session resumes them.

**Review model (subagent mode, since 2026-08-30):** `FATEH_REVIEW_MODE='subagent'` in `~/.claude/pipelines/models.ps1` is the pipeline default: `.claude/hooks/post_tool_review.php` is INERT in every session — it never gates, it only tracks edit state for the Stop hook. Review ownership lives with the Lead's own harness subagents: after each coherent unit of work, the session spawns a FRESH `claude-reviewer` subagent via the `Agent` tool (no model override — inherits the driving model; two lenses: correctness/security, then performance/pattern-consistency); safe fixes are applied by the Lead or a coder subagent, never by the reviewer; trivial-lane single-file edits are the only exception. No API call is made for coding, delivery, unit review, or fixes. API calls survive in exactly two places: plan enrichment (`FATEH_PLAN_MODEL`, plus the OpenAI refiner `FATEH_MAX_MODEL` on max) and the end-stage dual review (`FATEH_REVIEWER_MODEL_A` + `FATEH_REVIEWER_MODEL_B`, one round per stage, findings fixed by the Lead). Ollama-native sessions follow the lean subagent-lanes engine in `.claude/skills/ollama/SKILL.md`. This supersedes the tiered-gate paragraph, the old "no PostToolUse review hook" policy, and the omni-reviewer paragraph.

**Delegation three-lane (plain Claude Code sessions; sessions are the Lead — planning, architecture, and review decisions are never delegated):** Trivial (single file, few lines) — code directly, no delegation, no subagent review. Standard — optionally enrich via `claude-planner` @ `FATEH_CC_PLAN_MODEL` only when a plan genuinely adds value, then coder slices to `claude-coder` (parallel only across file-disjoint slices with worktree isolation; otherwise sequential), closed by a mandatory `claude-reviewer` pass. Complex (schema/auth/destructive/multi-module) — Fable-5 plan enrichment REQUIRED, then one explicit ask about refining via the OpenAI refiner (auto-satisfied if the user already said "max"), then as standard. Safeguards: secrets in context → no delegation, work directly; subagent failure → absorb the slice in-harness the same turn.

**End-stage documentation sweep (Stop hook `stop_docsync.php` enforced):** documentation work happens exactly once per turn, in one consolidated pass right before the work is declared done — never per-edit. It covers the governing folder READMEs/`*Pattern.md` docs (this project's folder READMEs under `src/` stand in for pattern docs), this project's load-bearing contracts, tests if a test tree exists, and leftover temp/probe-file hygiene; A `PreToolUse` gate (`pretooluse_pattern_doc_gate.php`) additionally requires pattern docs to be read before editing files under them.
