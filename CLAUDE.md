# CLAUDE.md

Guidance for Claude Code working in this repository. ZAAD is a small Next.js 15
digital showroom (App Router, React 19, JavaScript — no TypeScript). Keep changes
small and proportionate to a ~66-file project.

## Stack

- **Next.js 15** (App Router) · **React 19** · **JavaScript** (`.js`/`.jsx`, no TS)
- **Tailwind CSS v4** (CSS-first `@theme`, PostCSS plugin — no `tailwind.config.js`)
- **Motion** (the `motion` package; client components import from `motion/react`) — the app's
  animation system for scroll-into-view reveals and interactive state
- **GSAP** (`gsap` + `ScrollTrigger`) — scoped to exactly four spots that need timeline sequencing,
  a scroll-pin, or a scrubbed parallax `motion` can't do natively (`Hero.jsx`'s entrance timeline,
  `Story.jsx`'s pinned image column, `Blueprint.jsx`'s pinned nav column, `house/ChapterPieces.jsx`'s
  `ChapterHero` scrubbed media-column parallax — a hard pin doesn't work there since the hero's two
  columns are roughly equal height, so it uses a non-pinning `scrub` tween instead), plus one
  integration-only consumer: `useLenisScroll` (see below) drives Lenis's raf through `gsap.ticker`
  and syncs `ScrollTrigger.update` — no timelines, no pins. Not a `motion` replacement — see
  `src/components/README.md`'s Conventions section before adding a fifth usage.
- **Lenis** — inertial smooth scrolling on the window. Initialized via the shared `src/hooks/useLenisScroll.js`
  hook (dynamic import, gsap-ticker-driven, synced with `ScrollTrigger`), consumed by `AppShell.jsx`
  (showroom), `house/HouseSmoothScroll.jsx` (a render-null leaf mounted in `(house)/layout.js` for the
  House routes), and `collection/[slug]/ProductPageClient.jsx` (product pages) — one instance per
  mounted route, never more than one at a time. `ScrollService`'s three `animate*` exports delegate
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
| `src/services/` | `src/services/README.md` | `ScrollService`, `MetaDataService`, `TranslationService` (the React i18n context lives here, **not** `src/contexts/` — that folder is empty) |
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
  `TranslationService` (localStorage + cookie), read server-side in
  `lib/i18n/server.js` via `next/headers`, **and** read client-side on
  `LanguageProvider` mount to restore the locale on static (`force-static`) routes
  (House pages + `collection/[slug]`, where the server bakes `initialLanguage="en"`).
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
  `activeLanguageBlobInNavbar` (ControlsFooter), `activeThemeBlobInNavbar`
  (ControlsFooter), `activeCurationTabLine` (SpecsTabs), `activeArchetypeTabLine`
  (CollectionTabs).
- **`activeAppointmentBlob`** (concierge `InquiryForm`) — the Audience toggle's
  indicator. Local to the inquiry form (not a cross-section group), but the same
  single-mounted rule applies: only the selected pill renders it, or the blob flies.
- **The House top nav shows only the current page, not all 3 links.** `house/HouseChrome.jsx`
  renders `t(currentNavItem.key)` (`NAV.find((item) => item.href === pathname)`) as a static label
  with a static underline bar beneath it (the "ON" look) — no `motion.span`, no `layoutId`, since
  there's nothing to animate between once only one item ever renders. The other two House pages
  are reachable via `house/HouseFooter.jsx`'s cross-link row instead — deliberately not duplicated
  in both header and footer. This has been implemented, reverted, and reimplemented more than once
  in-session at the user's explicit direction; the current (final) state is "current page only, in
  the header." Don't reintroduce the multi-link nav without direct instruction. (The earlier
  `activeAboutTabLine` rail indicator, and later `activeHouseNavLine`, were both removed for the
  same reason: the underline stopped being meaningful once there was nothing to differentiate.)
- **The House routes are a route group, not showroom tabs** — `src/app/(house)/`
  holds `about`, `story`, `sustainability` (3 routes, not 5). The `aboutSections` data
  still has 5 entries (`about`, `story`, `brandValue`, `sustainability`, `csr`) — `story`
  pairs `story`+`brandValue` and `sustainability` pairs `sustainability`+`csr` into
  two-column "diptych" pages; only `about` is single-column. A shared server `layout.js`
  renders `components/house/HouseChrome.jsx` (slim header: back-to-showroom, ZAAD
  wordmark, the current page's name as a static underlined label, compact language/theme
  control) and `components/house/HouseFooter.jsx`. `about/page.js` renders
  `house/AboutChapter.jsx` on the single-column `house/HouseChapterShell.jsx`;
  `story/page.js` and `sustainability/page.js` render `house/StoryValueChapter.jsx` and
  `house/SustainabilityResponsibilityChapter.jsx` on the two-column
  `house/HouseDiptychShell.jsx` (cinematic hero + twin editorial columns + stat grid(s) +
  cross-link cards + call strip). Do **not** reuse the showroom
  `Header`/`Footer`/`ControlsFooter` on the house routes — they are wired to
  `useShowroomNav` (in-app `setActiveTab` + scroll + the 120ms pre-scroll contracts) and
  to the global `activeLanguageBlobInNavbar`/`activeThemeBlobInNavbar` layoutId groups;
  reusing them cross-route would fly the indicators and break the scroll contracts. The
  compact control in `HouseChrome` uses plain active styling (no layoutId) on purpose.
- **Duplicated `imageKey` strings** — `showcase/ImageViewer.jsx` and
  `showcase/Lightbox.jsx` build identical `${id}-${idx}` / `${id}-macro` keys. Keep
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
  pre-scroll timeouts** in `MenuPanel`, `Header`, `Footer`, and `useShowroomNav` are now
  a soft lead-time, not a hard race — but keep them: they still avoid visibly scrolling
  mid-transition.
- **`generateStaticParams` emits `en.collection` ids only** — collection URLs derive
  from the English collection. Item `id`s must be URL-safe and stable.
- **Directional icons always point left in Farsi**, regardless of which direction they point
  in English (not a mirror-to-opposite rule). `MaisonButton` takes an explicit `icon` prop —
  always pass one; its English-substring-matching fallback (`getRelevantIcon`) silently breaks
  on Farsi labels. See `src/components/README.md` for the full icon-direction and icon-choice
  conventions.
- **`.font-farsi` / `.font-latin`** (`src/styles/globals.css`, documented in
  `src/styles/README.md`) — opt-in Dorsa for translated non-heading text vs. opt-out back to
  Latin for permanently-Latin brand content (collection `number`/`year`/`name`). Picking the
  wrong one either leaves real Farsi text in the wrong typeface or forces Dorsa onto Latin
  product codes like "C°01"/"GÁVV".

## Known issues (documented in folder docs; fix, don't replicate)

- `hreflangFor` returns the same URL for `en` and `fa` (no locale-prefixed routes), and
  social handles are TODO placeholders. See `src/services/README.md`.
- The home `WebSite` schema declares a `SearchAction` targeting
  `/collection?q={search_term_string}` — no such route/search exists (404). The sitemap
  and collection breadcrumb no longer 404 (sitemap lists `/showcase/index.html`, the real
  static URL; breadcrumb is `Home → Item`). See `src/app/README.md`.

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
