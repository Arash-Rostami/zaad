# ZAAD — Design System & Brand Architecture

> **Scope:** `src/styles/globals.css` and all components under `src/components/`  
> **Audience:** All agents, engineers, and collaborators working on this codebase  
> **Non-negotiable rule:** Never hardcode a color hex value in a component. Use semantic tokens only.

---

## Part I — Brand Identity & Design Vision

### What This Project Is

ZAAD is the digital showroom for an ultra-premium decoration and interior design house with a deliberately limited, highly curated collection. The website is not a store. It is a digital exhibition space — closer in spirit to a private gallery opening than to a retail experience.

The guiding creative brief was authored to produce work at the standard of:

- High fashion maisons (Hermès, Loro Piana)
- Architectural studios (Tadao Ando, Studio KO)
- Premium furniture houses (Poltrona Frau, Carl Hansen)
- Luxury interior galleries (Axel Vervoordt, Vincent Van Duysen)
- International editorial publications (Wallpaper*, Apartamento)

The result must feel like **digital craftsmanship** — not a product, not a template, not a trend. Something made with obsessive care, calibrated for a discerning audience.

---

### Target Emotional Response

When a visitor lands on this site, they should feel — in sequence:

1. **Awe** — the first impression is visually commanding, not busy
2. **Trust** — the composition communicates competence and seriousness instantly
3. **Calm sophistication** — nothing is rushed or noisy
4. **Curiosity** — the curation makes them want to go deeper
5. **Desire** — materials, light, and space create tactile longing
6. **Exclusivity** — the restraint signals that not everyone belongs here

The experience should feel like entering a private design exhibition after hours, when the space is yours alone.

---

### What This Brand Is

- Ultra-premium segment decorator and design house
- A very small, deliberately limited collection
- Each object is museum-worthy by design intent
- Clients are discerning, unhurried, and quality-obsessed

### What This Brand Is Not

- A mass ecommerce store
- A startup landing page
- A SaaS product website
- A trendy experimental portfolio
- A loud "modern" digital experience

---

### Visual Character

The site's visual character is defined by a single adjective cluster:

**Timeless. Elegant. Quiet. Architectural. Cinematic. Restrained.**

Everything that does not serve this cluster is removed. Whitespace is not empty — it is a luxury asset. Restraint is the design decision. The absence of something is as intentional as its presence.

---

## Part II — CSS Architecture

### File Location

```
src/styles/globals.css
```

### Structure

```
globals.css
│
├── CSS Variables (:root / .mid / .dark)    ← Theme-specific raw values
│   └── Three palettes: Light, Mid, Dark
│
├── @theme block                            ← Tailwind v4 token registration
│   └── Maps CSS vars → Tailwind color names
│
├── @layer utilities                        ← Pre-composed helper classes
│   └── Opacity composites, shadows, control surfaces, placeholders
│
├── Global transitions                      ← Chiaroscuro theme-switching
├── Keyframes                               ← Editorial light effects
└── Farsi / RTL overrides                   ← i18n typography corrections
```

---

## Part III — Color System

### Philosophy

The color system is modeled on material realism: stone, warm linen, travertine, aged bronze, architectural carbon, ocean slate. No synthetic colors. No trend-chasing gradients. No neon.

The palette is expressed through three named themes. Each theme is a curated palette with its own character — but all three must feel like they belong to the same brand.

| Palette | Body class | Character |
|---|---|---|
| Light | *(default / none)* | Tuscan linen — warm cream ground, iron ink, travertine bronze |
| Mid | `.mid` | Architectural graphite — neutral gray field, luminous marigold accent (recolored 2026-09-27 from a navy-field/champagne-gold identity; see Part XV) |
| Dark | `.dark` | Architectural carbon — near-black volume, warm off-white, marigold yellow accent |

---

### Semantic Token Reference

All tokens are defined as CSS variables in all three theme blocks, registered in `@theme`, and consumed via Tailwind utility classes. **Never use a hex value in a component.**

---

#### 1. Surfaces

Page backgrounds, card faces, overlays. All theme-adaptive.

| Tailwind class | Meaning | Light value |
|---|---|---|
| `bg-surface` | Primary page background | `#F4F1ED` |
| `bg-surface-alt` | Section alternate / raised surface | `#E8E4DF` |
| `bg-surface-overlay` | Alternate surface at 40% opacity | `rgba(232,228,223,0.40)` |
| `bg-surface-frosted` | Alternate surface at 60% opacity | `rgba(232,228,223,0.60)` |
| `bg-panel` | Card / panel face | `#FFFFFF` |
| `bg-panel-glass` | Panel at 40% — glass effect | `rgba(255,255,255,0.40)` |
| `bg-panel-frost` | Panel at 95% — frosted glass | `rgba(255,255,255,0.95)` |
| `bg-panel/{n}` | Panel at arbitrary opacity via Tailwind modifier | — |
| `bg-foundation` | **Family-locked** permanent dark base (footer + dark scrims) | `#1C1C1C` |

> `bg-foundation` is dark in every theme, but it is **family-locked, not fully static**:
> light and dark share `#1C1C1C`, while the mid theme resolves it to `#111111` (the mid
> family's own deep black, alongside `--text-canvas: #F0F0F0` neutral off-white — both
> recolored 2026-09-27 from a navy/cool-white pair to a neutral-gray pair at the same
> lightness) so the always-dark footer and permanently-dark media scrims stay in-family with
> mid's graphite field instead of reading as a foreign carbon block. The footer is still
> always dark, regardless of which palette is active — a deliberate editorial choice, a
> heavy typographic base grounding the page.

---

#### 2. Ink (Typographic & Structural Tones)

All text, borders, and structural ink — the primary mark-making color of the system.

| Tailwind class | Meaning | Light value |
|---|---|---|
| `text-ink` | Primary body text, icons, structural elements | `#1C1C1C` |
| `text-muted` | Secondary / supporting copy | `#5C5954` |
| `text-dim` | Placeholder text, tertiary labels | `#9C9588` |
| `text-headline` | High-contrast headings (pure white in dark theme) | `#1C1C1C` |
| `bg-ink` | Ink-colored fill (solid dark buttons, badge backgrounds) | `#1C1C1C` |
| `border-ink` | Full-weight ink border | `#1C1C1C` |
| `border-ink/{n}` | Ink border at opacity via Tailwind modifier | — |
| `border-ink-faint` | Pre-computed 5% ink border | `rgba(28,28,28,0.05)` |
| `border-ink-mild` | Pre-computed 15% ink border | `rgba(28,28,28,0.15)` |

> **Why pre-computed borders?** `border-ink/10` uses `color-mix()` which is correct in modern browsers but may fail in variable-chain scenarios. The pre-computed variants are preferred for high-frequency opacity values.

---

#### 3. Accent (Bronze / Gold — primary brand tone)

The brand's signature material color. It shifts across themes: warm travertine bronze in light (unchanged, by explicit client request), and a bright marigold yellow (`#FFC211`) in both mid and dark (recolored 2026-09-27 — mid from the earlier champagne-gold value, dark from the earlier aged-bronze value).

| Tailwind class | Meaning |
|---|---|
| `text-accent` | Bronze/gold text — labels, highlights, active indicators, hover reveals |
| `bg-accent` | Accent fill — category badges, active pills, decorative elements |
| `border-accent` | Full accent border |
| `border-accent/{n}` | Accent border at arbitrary opacity |
| `from-accent`, `via-accent`, `to-accent` | Gradient stops using accent |
| `fill-accent`, `stroke-accent` | SVG intrinsic fill/stroke in accent |

Use it with restraint. Bronze earns its presence by being rare.

---

#### 3b. Danger (muted terracotta — form validation only, added 2026-09-03)

The **only other** chromatic signal in the system, deliberately not a bright alert red —
a muted warm rust/terracotta chosen to read as "attention" without breaking the
restrained luxury palette. Same per-theme resolution pattern as `accent`
(`--text-danger` in `:root`/`.mid`/`.dark`, mapped via `--color-danger` in `@theme`):
light `#A6483A`, mid `#E8927C`, dark `#D48B78` — lighter in the two dark-background
themes for contrast, same shift direction as `--text-bronze`.

| Tailwind class | Meaning |
|---|---|
| `text-danger` | Terracotta text — inline field-validation error messages |
| `border-danger` | Input border swap on a field with an active validation error |
| `bg-danger/{n}` | Very low-opacity fill behind a generic error banner (e.g. `bg-danger/5`) |

**Call sites today:** `concierge/InquiryForm.jsx`'s server-validation error display
(see `src/components/README.md` and `src/app/README.md`'s `/api/inquiry` section), plus
`ledger/Ledger.jsx`'s admin chrome — the gate form's validation-error message and the
delete button's destructive-confirm state. Do not
reach for `text-danger` for anything that isn't a validation/error state — it exists
specifically to be rare, the same way `accent` does.

---

#### 4. Canvas (Static — permanently dark contexts)

Used exclusively where the background is always dark, regardless of active theme. The footer is the primary use case.

| Tailwind class | Meaning | Value |
|---|---|---|
| `text-canvas` | Light text on foundation/dark background | `#F4F1ED` light/dark, `#EBEFF5` mid |
| `text-canvas/{n}` | Canvas at arbitrary opacity | — |
| `border-canvas/{n}` | Canvas-toned border at opacity | — |

> Canvas tokens follow the same **family-locking** as `bg-foundation` (see above): they are
> calibrated specifically for `bg-foundation` contexts — light/dark cream, mid cool white —
> and never touch theme-adaptive surfaces. The reverse rule also holds: `bg-ink` +
> `text-canvas` is **not** a valid inverted pair (both go light in dark/mid — invisible);
> inverted pills use `bg-ink` + `text-on-indicator`, which inverts per theme by design.

> The reverse mistake is just as real: never use a theme-adaptive token (`text-accent`, `border-accent`, etc.) on a `bg-foundation` surface either. `Footer.jsx` is fully static by design (see above) — `text-accent` resolves to a different value per theme (bronze in light, aged bronze in dark, **luminous champagne gold tuned for a navy field** in mid), so a hover color keyed to it visibly shifts between themes even though the footer's background never does. The current live file still carries two `hover:text-accent` links inside the footer (the PBS strip and the hidden `©` `/ledger` link) — the standing exceptions to the canvas-only rule; every other color used inside a `bg-foundation` block should stay a `canvas`/`foundation` token.

---

#### 5. Control Surfaces (Interactive UI Components)

Surfaces specific to toggles, menus, pills, and the settings bar. These require fine-tuned per-theme values that do not follow the general surface/ink logic.

| Tailwind class | CSS Variable | Meaning |
|---|---|---|
| `bg-indicator` | `--bg-indicator` | Active state pill bg — dark ink / cream / marigold yellow across themes |
| `text-on-indicator` | `--text-on-indicator` | Text inside active pill — inverted per theme |
| `bg-toggle-track` | `--bg-toggle-track` | Language/theme toggle track background |
| `bg-overlay-panel` | `--bg-overlay-panel` | Slide-out navigation panel backdrop |
| `bg-control-bar` | `--bg-control-bar` | Settings/control bar glass surface |
| `border-control` | `--border-control` | Settings bar border — accent-tinted |

---

#### 6. Tonal & Selection Utilities

| Tailwind class | Value | Use |
|---|---|---|
| `bg-tone` | `#D6D0C7` | Warm separator, mid-tone background accent, decorative fills |
| `bg-selection` | `#EAE7DC` | Browser text selection highlight |

---

### Tailwind Opacity Modifier Syntax

All tokens are registered in `@theme`, so Tailwind v4's opacity modifier syntax works automatically via `color-mix()`:

```jsx
<div className="bg-surface-alt/30 border-ink/10 text-accent/80" />
<div className="bg-panel/70 border-accent/40" />
```

For pre-computed composites (`bg-surface-overlay`, `bg-panel-glass`, etc.) the opacity is already baked into the CSS variable value. **Do not apply a Tailwind opacity modifier on top** — it will double-apply the opacity.

---

## Part IV — Shadow Scale

Named shadows replace arbitrary `shadow-[0_30px_100px_rgba(0,0,0,0.06)]` strings across components. `shadow-ambient` is the one theme-aware shadow — it resolves `var(--shadow-color)`, which is tuned per theme (faint in light mode, much stronger in both dark modes) — and is deliberately used for every primary photography frame (`StudioGallery`, `showcase/ImageViewer`, `house/ChapterPieces`) precisely so product/editorial images keep a visible "lifted" depth cue in dark mode. All the other named shadows use static RGBA values and do not adapt to theme; a former `shadow-canvas-low` token existed with a flat `rgba(0,0,0,0.06)` value and was removed after it visibly flattened photography frames in dark mode — do not reintroduce a static shadow for image frames.

| Tailwind class | Value | Intended use |
|---|---|---|
| `shadow-ambient` | `0 20px 50px var(--shadow-color)` | Default card/section elevation, primary photography frames |
| `shadow-canvas-mid` | `0 15px 35px rgba(0,0,0,0.06)` | Toolbar, control bar, floating bars |
| `shadow-canvas-lift` | `0 20px 45px rgba(0,0,0,0.08)` | Hover lift state on cards |
| `shadow-card-sm` | `0 4px 16px rgba(0,0,0,0.07)` | Tight card shadow, small components |
| `shadow-card-md` | `0 4px 16px rgba(0,0,0,0.15)` | Mid-weight cards |
| `shadow-card-lg` | `0 20px 50px rgba(0,0,0,0.15)` | Heavy cards, modals |
| `shadow-deep` | `0 50px 110px rgba(0,0,0,0.18)` | Full-bleed slide-out panel |

---

## Part V — Placeholder & Glow Utilities

| Tailwind class | Effect |
|---|---|
| `placeholder-dim` | Placeholder text at `--text-dim` color |
| `placeholder-dim-faint` | Placeholder at 60% of `--text-dim` |
| `text-glow-subtle` | Editorial text glow — `text-shadow: 0 0 12px rgba(142,122,98,0.15)` |

### Scrollbar — "quiet luxury"
A thin custom scrollbar (WebKit): 6px wide, `--bg-primary` track, `--bg-secondary` thumb (3px radius), thumb hover lifts to `--color-tone`. Defined in `globals.css` under `@layer utilities`.

Two scrollbar utility classes live next to it: `.scrollbar-none` (hides the bar entirely — used by `glance/GlancePage.jsx`'s mobile chip rail, `ledger/Ledger.jsx`'s filter-tab rail, and `collection/SpecsTabs.jsx`'s tab row) and `.scrollbar-sleek` (added 2026-09-06 for `concierge/CuratorChat.jsx`'s message list): 4px full-round thumb in `--color-muted` on a transparent track, hover warms to `--color-accent`, Firefox via `scrollbar-width: thin` + `scrollbar-color`. Use `.scrollbar-sleek` for any visible inner scroller — the site-wide global above already covers the window.

### Selection & caret — theme-adaptive micro-details
Selection paints `--color-selection` with `--text-primary` text: the authored cream `#EAE7DC` in light, translucent bronze in mid (`rgba(242,210,153,0.30)`) and dark (`rgba(203,185,167,0.32)`) — the `.mid`/`.dark` blocks override the token so the single rule stays readable everywhere. `AppShell`'s root and the `layout.js` `<body>` both carry the Tailwind `selection:bg-selection selection:text-ink` utilities (same values, same system — keep all three in agreement). The global `::selection` rule covers everything else, including status screens. `input`/`textarea` caret is `--text-bronze`. The browser-default blue selection/caret must never surface anywhere.

### Lenis base styles
`globals.css` carries the Lenis smooth-scrolling contract block (`html.lenis`/`html.lenis body` height auto, `.lenis-smooth` scroll-behavior auto, `[data-lenis-prevent]` overscroll containment, `.lenis-stopped` overflow hidden). The instance lifecycle lives in `AppShell.jsx` — see `src/components/README.md`.

### Cinematic media utilities
| Tailwind class | Effect |
|---|---|
| `lux-vignette` | `::after` radial corner-darkening overlay (transparent 55% → rgba(0,0,0,0.16)), z-index 1, `pointer-events: none` — filmic depth for full-bleed media frames. Call sites: `Hero.jsx`'s video frame, `ChapterHero`'s media frame |
| `lux-ken-burns` | 26s perpetual 1.0→1.045 scale + drift (`kenBurnsDrift`, `--couture-ease`, alternate) — still photography that breathes. Call site: only `house/ChapterPieces.jsx`'s `ChapterHero` fallback still (`Materials.jsx`'s macro preview no longer uses it). Never on interactive/zoomable imagery (`ImageViewer`, lightbox, GSAP-pinned columns) |
| `ribbon-wordmark-glide` | 38s linear perpetual `translate3d(0,0,0) → translate3d(-50%,0,0)` (`ribbonWordmarkGlide` keyframe) on a `w-max` flex row holding two identical groups of the yellow wordmark (`public/logo-ribbon.svg`) — a genuine continuous loop, one of the few in the system (see the Editorial Keyframe note below), because it's an atmospheric watermark band, not interactive content: seamless since the two groups are pixel-identical and the visible container is no wider than one group (that constraint now requires call sites to raise the copy count for wider viewports — the component's `copies` prop, `shared/RibbonScroll.jsx`, added 2026-09-29 with the second call site; the footer's full-bleed band passes 9 for ultrawide coverage). Call sites: `Hero.jsx`'s bottom transitional band and `Footer.jsx`'s full-bleed closing band (both render `shared/RibbonScroll.jsx`, extracted 2026-09-29; see `src/components/README.md`'s Hero.jsx + RibbonScroll sections). Two direction rules added 2026-09-29: the marquee viewport is `dir="ltr"` so the track left-anchors overflowing right in Farsi too (an RTL right-anchored track slides off-screen under the negative translate — the band was blank in Farsi 2026-09-27→09-29), and `html[dir="rtl"]` reverses the glide so the wordmark glides rightward in Farsi. Under `prefers-reduced-motion`, `RibbonScroll` renders a single static, non-tiled instance instead (detected via the same `matchMedia` mount check the video reel already uses) — the global reduced-motion block alone (`animation-duration: 0.01ms`) would only freeze the doubled track mid-loop, not remove the duplication, so this needs the JS branch, not just the CSS override. (2026-09-28: the Hero band was split into two stacked strips — this glide is the **first** strip; the diamond pattern moved out from behind it into its own second strip drifting the opposite way, see `pattern-diamond-drift` below) |
| `pattern-diamond-drift` | 32s linear perpetual `background-position: 0 0 → 200px 0` (`diamondGridDrift` keyframe) applied on top of `.pattern-diamond-grid` — exactly one tile width (200px) per iteration, so the rightward drift loops seamlessly. Added 2026-09-28, user direction: the Hero bottom band's two patterns (ribbon wordmark + diamond grid) used to overlap in one strip; they now read one after another, counter-moving — the wordmark glides left, this grid drifts right (in Farsi both animations reverse, preserving the counter-move). Call site: `Hero.jsx`'s bottom band's second strip only. Under `prefers-reduced-motion` the strip renders without this class (static texture, no JS branch needed — unlike the ribbon's doubled track, freezing here leaves a valid static pattern) |
| `ribbon-neutral-in-light` | Opt-in class for a `RibbonScroll` band whose `<img>` copies should lose their color in the light theme only — `html.light .ribbon-neutral-in-light img { filter: grayscale(1) }` with a 700ms filter transition; mid and dark themes keep the full `#ffc600` yellow (owner direction 2026-09-29: colorless in light, colored in the other two). Applied to the footer band only — the Hero band stays yellow in all three themes |
| `pattern-diamond-grid` | Background-image texture (`url("/patterns/zaad-diamond-grid.svg")`, tiled at `200px 212px`) — free-form: the radial circle `mask-image` that used to fade each blob's edges was **removed 2026-09-29 at owner direction** ("all patterns must have free style, no circle"); the texture now fills its blob square, with off-canvas positioning + the parent section's `overflow-hidden` clipping the edges (don't reintroduce the mask). Replaced the `clip-triangle` utility on the large ambient blobs (the utility was added 2026-09-27 and swapped to the pattern the same day) per client direction: a generic triangle mask read as a foreign geometric motif, not a brand mark. This is the real brand-book pattern (`modification/ZAAD Pattern 01.svg`, a repeating diamond/chain-link motif, optimized via `svgo` into `public/patterns/zaad-diamond-grid.svg` — see `src/components/README.md`'s Asset Registry) rendered as ambient texture, never a loud graphic. Apply only to the large ambient background blobs (never a functional control). **Opacity split (2026-09-29, owner direction):** every ambient blob — `Materials.jsx`'s two and both House shell pairs — renders the quiet pair (`opacity-[0.22] dark:opacity-[0.08]` for the larger blob, `0.16`/`0.06` for the smaller). The owner first standardized all call sites at `0.35`/`0.45` ("much stronger" + "all app patterns must be consistent"), then walked every blob back to the quiet values the same day as too strong next to text ("they are very strong"). The **Hero band strip alone** keeps `opacity-[0.35] dark:opacity-[0.45]` — dark deliberately higher than light on that one strip, superseding the 2026-09-27 dark-lower rule there. Don't raise the blobs without owner say-so. Current call sites: `Materials.jsx`'s two section-level ambient blobs (moved here from `Vision.jsx` 2026-09-27, client request, alongside that section's single-column/accordion restructure — `Vision.jsx`'s four elements are NOT pattern blobs: they carry the `clip-triangle` mask instead, the 2026-09-20 circular→triangular conversion), `Hero.jsx`'s bottom band (see `pattern-diamond-drift` above), and — since 2026-09-29, owner request to move the pattern off the heroes onto the titled editorial sections — two large blobs each in `house/HouseChapterShell.jsx`'s `house-editorial` section and `house/HouseDiptychShell.jsx`'s `TwinChapter`, the former hero `AMBIENT` pair relocated verbatim (`left-1/3 top-1/10 w-[700px] h-[700px]` + `-right-1/4 bottom-1/10 w-[600px] h-[600px]`; `overflow-hidden` on the section clips the bleed) `house/ChapterPieces.jsx`'s `AMBIENT` no longer carries the pattern — it keeps only the `sunbeam-signature-glare` strip (the pattern left the House heroes entirely). The SVG's own fill (`#ffc600`) is intentionally left baked into the asset rather than recolored per theme via `mask-image`+`bg-accent` — at the standardized opacity, tiled this small it reads as neutral warm texture in all three palettes, not a literal yellow swatch; this is an asset color (like a photograph's palette), not a component hex value, so it doesn't violate the "no hardcoded hex in components" rule. **The two small "Z"/"&" medallion dividers** (`house/ChapterPieces.jsx`'s `EditorialSignature`, `house/HouseDiptychShell.jsx`'s `TwinChapter`, both 44×44/`w-11 h-11`) reverted to plain `rounded-full` instead — a repeating diamond-grid texture makes no sense at that size, and these are small solid brand-mark medallions, not ambient texture. |
| `clip-triangle` | Upward-pointing triangle mask, `clip-path: polygon(50% 13.397%, 0% 100%, 100% 100%)`. The apex sits at 13.397% (= 1 − √3⁄2) so the triangle is exactly **equilateral on a square element** (2026-09-29, owner direction; the original apex-at-0% polygon was isoceles with sides ≈1.118× the base). This is percentage-based, so the equilateral guarantee holds only while the element's width equals its height — every current call site (`Vision.jsx`'s four ambient shapes, 700/600/350/384px squares) keeps `w-*` = `h-*`; if a non-square element ever needs a triangle, give it its own polygon rather than stretching this one. All four `Vision.jsx` shapes were faded to near-subliminal opacity 2026-09-29 at owner direction ("triangle is in story part… much fader"): gradient washes `via-accent/4`/`bg-accent/2` light and `/3` dark (was `/10`,`/5`,`/6`,`/8`), and the manifesto corner triangle `bg-tone/10` (was `/30`) — they read as a faint breath on the paper, not a geometric motif. |

Both are neutralised by the global `prefers-reduced-motion` block. (`Vision.jsx`'s home-story
video column is the one pinned-column exception that still breathes — the stills carousel this
note used to describe is fully commented out; the pinned video frame now runs a GSAP scrubbed
`scale: 1 → 1.06` tween over its 6-video gallery rather than this perpetual CSS class; see
`src/components/README.md`.)

---

## Part VI — Typography System

Typography is one of the most important luxury signals. It must communicate:

- **Confidence** — large, unhurried editorial scale
- **Heritage** — serif headlines that suggest permanence
- **Precision** — exacting line-height rhythm and letter-spacing
- **Sophistication** — zero decorative excess

### Hierarchy

| Role | Character | Notes |
|---|---|---|
| Display / Hero | Elegant serif, `font-light`, `text-ink` | Large, slow reveal animation — see "Uniform heading system" below |
| Section headings | Refined serif, `font-light`, `text-ink` | Mid-scale — see "Uniform heading system" below |
| Labels / meta | Refined sans-serif, uppercase, tracked | Small, spaced, never crowded |
| Body / supporting copy | Refined sans-serif | Generous line-height (1.7–1.8), muted color |
| UI / control labels | Sans-serif, compact | `text-muted` or `text-dim` — subordinate to content |

### Uniform heading system (2026-09-27 — every `h1`–`h6` in the app)

Every heading tag (`h1`–`h6`), site-wide, follows one locked rule set — **only size varies
by tier**, everything else is identical on every heading everywhere, including Farsi-rendered
ones (the `html[lang="fa"]` Dorsa `font-family` override is a separate mechanism, untouched by
this system — see Part XV):

- **Family:** `font-serif` (FractulAlt) on every heading, no exceptions.
- **Weight:** `font-light`, no exceptions — no `font-medium`/`font-semibold`/`font-bold`/
  `font-extralight` heading anywhere.
- **Style:** no italic on any heading or heading-internal accent span, no exceptions (the
  former Hero.jsx/`house/ChapterPieces.jsx` `heroTitleAccent` accent-span exceptions were
  removed 2026-09-27, superseding the "one named exception" language this doc used to
  carry — see the italic-removal note in Part XV).
- **Color:** `text-ink` — the single monochrome ink token, everywhere. Never
  `text-headline`, `text-accent`, or a raw `text-[var(--text-primary)]` on a heading.
- **Size — the one tier-varying property.** Assigned by the heading's *role*, not
  mechanically by its tag (a flagship item name tagged `<h3>` inside `showcase/CollectionPanel.jsx`
  or `glance/GlanceChapter.jsx` gets Page-title-tier sizing because it plays that exact role
  elsewhere too — see those files):

  | Tier | Tag(s) typically | Size classes |
  |---|---|---|
  | Hero | H1, homepage hero only (`Hero.jsx`) | `text-3xl sm:text-4xl md:text-5xl`, `font-bold` (2026-09-28 user direction — one size down from every other tier's ladder start and the one heading allowed to break `font-light`; see exception 2 below) |
  | Page-title | H1, one per page (`collection/CollectionMeta.jsx`, `ledger/Ledger.jsx`, `shared/StatusScreen.jsx`, `app/credits/page.js`'s hero `h4`) | `text-4xl sm:text-5xl` |
  | Section heading | H2 (`Materials.jsx`, `Vision.jsx`, `concierge/SectionHeader.jsx`, `showcase/CollectionTabs.jsx`, `glance/GlancePage.jsx`, `house/HouseChapterShell.jsx`/`HouseDiptychShell.jsx`, `app/credits/page.js`'s `SectionHeading`) | `text-2xl md:text-3xl` |
  | Subsection | H3 (`concierge/CuratorChat.jsx`, `concierge/InquiryForm.jsx`, `collection/AcquisitionCTA.jsx`, `Materials.jsx`'s active-material `h3`, the `CrossLinks`/glance-overview card `h3`s) | `text-xl md:text-2xl` |
  | Minor | H4/H5/H6 and any compact list/card/eyebrow-role heading regardless of tag (`glance/GlanceChapter.jsx`'s spec titles, `collection/TabHeritage.jsx`/`TabArchitecture.jsx`/`TabAppliances.jsx`'s card titles, `showcase/CollectionPanel.jsx`'s monograph label, `Footer.jsx`'s column-index `h3`s, `app/credits/page.js`'s route/feature row `h3`s) | `text-lg` |

  `tracking-tight` on a heading that already carried it is untouched (unrelated to this pass —
  see the load-bearing contracts note in `CLAUDE.md`).

**Named exception:**
1. **`Footer.jsx`'s three column-index `h3`s** keep `text-canvas/40` instead of `text-ink` —
   `Footer` is a permanently `bg-foundation` (always-dark) surface (see Part III's Canvas
   family-locking rule), and `text-ink` resolves to the same near-black value as
   `bg-foundation` in the light theme, which would render the heading invisible. `text-canvas`
   is this surface's established ink-equivalent (the same swap `SocialLinks`/the header
   wordmark already use on this surface) — family/weight/size still follow the uniform system,
   only the color token differs, for contrast, not for taste.
2. **`Hero.jsx`'s h1 is `font-bold`, not `font-light`** (2026-09-28, direct user instruction
   "bold but size smaller"): the home hero title also dropped one size tier
   (`text-3xl sm:text-4xl md:text-5xl`, and its `heroDesc` paragraph dropped one size to
   `text-sm sm:text-base md:text-lg` in the same change). Originally the fa blanket `h1`
   rule forced `font-weight: 400`, so the bold read in English only — **since 2026-09-29
   the `html[lang="fa"] h*.font-bold` override in `globals.css` gives it real Dorsa Bold
   (700) in Farsi too**, at owner request for EN/FA parity; `Dorsa-Bold.otf` is preloaded
   alongside Regular/Light (both in `app/layout.js` and `DorsaPreloadScript.jsx`).
   The one heading allowed to break
   the uniform weight — do not copy it onto other headings, and do not "fix" it back.

### Rules

- No more than two typeface families in the entire project
- No playful, experimental, or tech-aesthetic fonts
- Generous line-height (1.7–1.9 for body) — white space is editorial
- Headlines should feel slightly too large. Restraint is in the layout, not the type
- **No letter-spacing on uppercase labels, eyebrows, badges, buttons, nav pills, or any mono
  micro-copy** (removed sitewide 2026-09-27, superseding the brief same-day reduction attempt
  — see Part XV's "Letter-spacing" note). With the site-wide font-size increase
  already shipped, the client judged wide tracking no longer necessary at any value. Every
  `tracking-wide`/`tracking-wider`/`tracking-widest`/`tracking-[Nem]` utility on this class of
  element has been removed (browser-default `normal` spacing applies); `tracking-tight` on
  headings is unrelated and untouched — see the load-bearing contracts note in `CLAUDE.md`.
- Never justify text, in either language — ragged flow is the web standard (browser
  justification has no hyphenation/river control, so short paragraphs get ugly word gaps).
  Farsi was the exception until **2026-09-29**: justified text was the native Persian
  typographic convention, but browser Farsi justification is pure word-gap stretching
  (amplified by the global `word-spacing: 0.15em` on `html[lang="fa"]`), which the owner
  flagged three separate times as broken-looking "letter spacing" — twice on the Hero
  (`heroDesc`), once as a general complaint. The 2026-09-27 pass tried widening the Farsi
  containers (`rtl:max-w-*` — those width bumps are still live and still valid); it shrank
  the stretching but never eliminated it, so `rtl:text-justify` was dropped **entirely
  sitewide** on 2026-09-29 (~23 instances across 13 files, including the Hero's
  `rtl:!text-justify`, the chat bubbles, and every `rtl:md:text-justify` quote variant).
  Farsi body copy now flows ragged right-to-left exactly as English flows ragged
  left-to-right. Don't reintroduce `rtl:text-justify` anywhere — if uneven Farsi word gaps
  are ever reported again, the remaining suspect is the global `word-spacing: 0.15em`, not
  justify.
- `text-wrap: balance` (headings) and `text-wrap: pretty` (paragraphs) are global base rules — line breaks self-select; never hand-tune them with `<br>` in body copy

---

## Part VII — Spacing & Layout Principles

### Core Principle

Whitespace is a luxury asset. Every pixel of empty space communicates that the brand does not need to fill every corner to justify itself.

### Layout Rules

- Use strong grid systems with consistent column gutters
- Sections breathe via the `section-y` / `section-y-break` tokens (see "Section vertical rhythm" below) — never hand-rolled `py-*` paddings on section boundaries
- Asymmetric yet balanced: off-center crops, unequal column splits (e.g. 5/7 or 4/8), deliberate tension
- Each section should feel individually art directed — not templated
- Never create card grids with more than 3 columns
- Never present the collection in a uniform product grid — each piece deserves space

### Vertical Rhythm

Section transitions create cinematic pacing. The scroll should feel like turning a page in a luxury magazine — not clicking through a website. Space between sections signals a change of editorial chapter.

### Interactive control chrome — the micro-spacing discipline

The principles above are about editorial *sections*. This is the equivalent discipline for
persistent UI chrome — headers, control pills, toggles — established through repeated correction
in one session and worth holding the line on:

- **Consistent gap rhythm between adjacent chrome elements.** If four elements sit in a row (e.g.
  a header's back-link, wordmark, page label, and controls), they should all use the *same*
  spacing value at each breakpoint, not a mix (e.g. a `gap-4` grid next to a `gap-3` flex child) —
  inconsistent gaps read as sloppy even when each individual value is "close enough."
- **Interactive elements that expand must never shift their neighbors.** A hover-expand control
  (see `shared/ExpandOnHoverPill.jsx` in `src/components/README.md`) has to reserve its
  fully-expanded footprint up front and grow inside that reservation, not grow in place inside a
  flex row — the latter visibly pushes sibling elements (e.g. nav links) every time it opens.
  "Breathing room" is not the same as "things move when you touch them" — the latter reads as a
  bug, not elegance, no matter how smooth the easing curve is.
- **Only the current/active state gets visual weight — never all states at once.** A nav with
  three destinations should show emphasis on exactly the one you're on, not list all three as
  equally weighted options next to each other; that's clutter, not information. This is the same
  restraint principle as "never create card grids with more than 3 columns" above, applied to
  navigation instead of layout.
- **Direction-sensitive motion needs an explicit RTL branch — it does not auto-mirror.** Framer
  Motion `x`/`y` offsets are physical pixels, not logical properties; a slide-in that looks right
  in English can slide in from the visually wrong side in Farsi once the surrounding flex order
  mirrors under `dir="rtl"`. Every icon-direction and slide-direction decision needs to be checked
  under both languages, not assumed to inherit correctness from `dir="rtl"` alone. See
  `src/components/README.md`'s "Directional icons always point left in Farsi" note for the
  icon-specific version of this same rule.

---

## Part VIII — Motion & Interaction Philosophy

> This section is binding for all animation and component work.

### Brand Motion Character

Motion must communicate sophistication through restraint. It must never seek attention. The user should *feel* quality before consciously registering that something moved.

The motion language must be:
- **Refined** — minimal, intentional, nothing superfluous
- **Architectural** — structural, geometric, grounded
- **Cinematic** — paced like editorial film, not reactive app UI
- **Tactile** — as if responding to physical material weight
- **Understated** — the absence of motion is as important as motion itself

The motion language must never be:
- Playful, bouncy, or elastic
- Flashy, shimmering aggressively, or attention-seeking
- Startup-like, gaming-inspired, or tech-demo oriented
- Continuous or scroll-locked (no persistent scroll-driven animation)

---

### The motion trio — division of labor, no overlap

Three motion libraries run in this app. That is only acceptable because each owns a
distinct job none of the others can do, and because their domains never overlap.
The stack is invisible to the visitor; the *restraint* in how it is used is what
reads as luxury. If a new effect can be built with an already-mounted library,
adding a fourth library (or a second instance of one) is wrong.

- **Motion** (`motion/react`) — the default. All entrance reveals (`MaisonReveal`),
  cross-fades, hover/state transitions, layoutId indicators. One shared root
  `MotionConfig reducedMotion="user"` (`components/shared/MotionRoot.jsx`,
  mounted in the root layout) makes every Motion animation on every route degrade
  gracefully. Never duplicated: no per-component `MotionConfig` wrappers (the one
  self-wrapped `ScrollButton` is a deliberate historical exception, documented in
  `src/components/README.md`).
- **GSAP** (`gsap` + `ScrollTrigger`) — only what Motion cannot do: timeline
  sequencing, scroll pinning, and scrubbed scroll-driven tweens. Scoped to the
  documented files (see `src/components/README.md`'s Conventions); a new GSAP
  usage requires a stated reason Motion can't cover it. The overlap rule that
  matters most: **GSAP must never write `transform` on a node Motion animates**
  — wrap the Motion node in a plain div and tween the wrapper (the Hero
  video-wrapper idiom).
- **Lenis** — inertial window scroll, one instance per mounted route, always via
  `hooks/useLenisScroll.js` (gsap-ticker-driven, synced with ScrollTrigger,
  auto-disabled under `prefers-reduced-motion`). The wheel glide is the single
  strongest "expensive" feel-cue; keep it subtle and never scroll-jack — Lenis
  changes how scrolling *feels*, never what scrolling *does*.

Anti-patterns that would flip the trio from luxury to gimmick — all currently
absent, keep them that way: spring overshoot/bounce, parallax on every image
(GSAP stays on its scoped spots), forced/wheel-hijacked sections, looping
spin/pulse/float effects, and reveals that re-fire on scroll-back (entrances are
`once`).

---

### Core Easing Curve

```css
cubic-bezier(0.16, 1, 0.3, 1);

```

This curve produces a rapid initial acceleration followed by a long, smooth deceleration — the motion signature of premium physical objects settling into place. It must not be overridden without a documented reason.

- **Global theme-switch transition duration:** 1050ms (color, border, background)
- **Interactive motion duration range:** 300ms–800ms depending on element weight
- **Reveal animation minimum duration:** 1000ms

**Deliberate exception — `showcase/CollectionPanel.jsx`'s specs accordion.** The
dimensions/materials/finish disclosure panel runs its clip-path reveal at `1.1s` (toggle
icon rotation at `0.7s`), above the 800ms interactive ceiling, by explicit user request:
this one control is meant to read as a graceful, dignified unfurl — a considered reveal
of curated detail — rather than a quick utilitarian toggle, in deliberate contrast to
every other interactive toggle in the app (which should stay inside 300–800ms, per the
`header/MenuPanel.jsx` fix above). Don't "fix" this back down to the interactive range;
it's intentional, not an oversight. Don't extend the same treatment to other toggles
without the same explicit direction — the contrast is the point.

**Close needs its own curve, not the reveal's curve reused.** The accordion's `animate`
and `exit` used to share one `transition` (the mandated `[0.16,1,0.3,1]` fast-start/
slow-end curve applied to both). That curve is tuned for *revealing* — applied to
*closing* too, most of the visual collapse happens in the animation's first instant
(fast start), which reads as an abrupt snap no matter how long the total duration is.
Fixed by giving `animate` and `exit` their own nested `transition` (Framer Motion
supports this — a `transition` key inside the `animate`/`exit` object itself overrides
the component-level `transition` prop for that state change only): `animate` keeps the
brand curve, `exit` uses `[0.7, 0, 0.84, 0]` — the exact temporal mirror of
`[0.16,1,0.3,1]` (mirrored via `(1-x2, 1-y2, 1-x1, 1-y1)`), i.e. a slow, dignified start
that accelerates to a decisive finish. Same principle applies anywhere else a
reveal/dismiss pair shares one easing value and the dismiss reads as abrupt — mirror the
curve for `exit` rather than reusing `animate`'s verbatim.

### Button Interaction System

Buttons implement a five-layer premium hover system. All layers operate simultaneously and must feel like a single unified material response.

#### Layer 1 — Magnetic Drift

The button drifts subtly toward the cursor using spring physics.

- Maximum drift: **4px** in any direction
- Spring: `{ damping: 22, stiffness: 100, mass: 0.9 }`
- Movement strength coefficient: `0.08` (very restrained)
- On leave: returns to origin with the same spring — no snap or reset

This must operate subconsciously. If the user notices the drift, the strength is too high.

#### Layer 2 — Silk Light Overlay

A radial gradient follows the cursor across the button surface on hover.

```js
background: `radial-gradient(circle 120px at ${x}% ${y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 80%)`
mixBlendMode: "overlay"
opacity: 0.35
```

This simulates light grazing across polished stone, brushed bronze, or layered silk. It must be:
- Barely perceptible at a glance
- Atmospheric, not glossy
- Never "tech" or "glassy" in character

#### Layer 3 — Split Typography Transition

Button label text translates vertically on hover. A second identical label sits directly below, revealed by the upward translation.

- Vertical travel: exactly **50%** of the line-height container
- Duration: **1100ms** with the standard easing curve
- The clip container hides the duplicate until the transition reaches it
- Hovered copy color: `text-accent`

This is an editorial technique borrowed from luxury fashion and gallery signage. It must feel like pages turning in a printed catalog — never like a CSS hover state.

#### Layer 4 — Depth Compression

On `mousedown` / `whileTap`:

```js
whileTap={{ scale: 0.985 }}

```

The button compresses inward by 1.5%. This communicates physical substance — the object responds to pressure like a precision-made material object. Scaling beyond `0.985` breaks the luxury illusion.

#### Layer 5 — Cinematic Timing

No layer reacts instantly. Every transition uses the standard easing at 1100ms. The deliberate delay before response signals that the system is weighted and considered — not reactive and cheap.

---

### `MaisonReveal` — Viewport Entrance System

Elements animate in once when entering the viewport, then remain static. There is no continuous scroll animation.

| Variant | Motion properties | Typical use |
|---|---|---|
| `unveil` | Opacity + Y translate + blur + scale | Primary text blocks, section headings |
| `slide-up-royal` | Opacity + Y translate | Cards, panels entering from below |
| `scale-down-unveil` | Opacity + scale + blur | Image frames, right-column panels |
| `lens-focus` | Opacity + scale + blur (heavier) | Full-bleed hero and editorial imagery |
| `royal-gate` | Opacity + X translate + scale + blur | Lateral panel reveals |
| `lines` | Per-line mask rise (measured line breaks, 0.12s stagger) | Flagship serif section headings only |

**`lines` contract:** takes a single element child whose own child is a plain string — `<MaisonReveal variant="lines"><h2 …>{t("key")}</h2></MaisonReveal>`. It measures the natural line breaks after mount, lifts each visual line out of its own overflow-hidden mask, then re-renders the plain text once the last line lands — masks never persist, so a later reflow (font-scale change, resize, locale remount) can never clip. `prefers-reduced-motion` renders plain immediately. Call sites: the Materials and Concierge `SectionHeader` h2s, and `Vision.jsx`'s `storyTitle` h2.

- Delay between sibling reveals: **0.1s–0.3s** increments
- Default reveal duration: **1.6s**
- Minimum reveal duration: **1.0s** — never go below this
- `once: true` — elements animate in once and are done

---

### General Animation Principles

**Timing over complexity.** A 1.4s fade with correct easing is more luxurious than a 0.3s multi-property transition. Complexity is not a substitute for calibration.

**Staggered reveals create depth.** When multiple elements enter, each delays by 0.1–0.2s. This creates editorial pacing, not a pop-in grid.

**One motion at a time.** If typography moves, the container is still. If the container scales, the text does not also drift. Competing simultaneous animations signal cheap design.

**Subtlety scales down.** When in doubt, make the effect less visible. Luxury is defined by what is held back.

---

### Editorial Keyframe: Sunbeam Glare

The `.sunbeam-signature-glare` class applies a slow diagonal light sweep across surfaces. Use only on decorative overlay elements, never on interactive elements. The CSS default is `28s` (no delay); every consumer overrides it inline: `Vision.jsx` carries two sweeps (one at `26s`, a second at `35s` with an `-8s` delay), and `house/ChapterPieces.jsx`'s `AMBIENT` sets `26s`.

```jsx
<div
    className="sunbeam-signature-glare absolute top-0 left-1/4 w-[240px] h-[220%]
    bg-gradient-to-r from-transparent via-white/[0.05] to-transparent
    mix-blend-overlay pointer-events-none"
/>
```

**A second sanctioned perpetual loop: `ribbon-wordmark-glide`** (`Hero.jsx`'s bottom
watermark band and `Footer.jsx`'s closing band, added 2026-09-27/2026-09-29, both rendered by
`shared/RibbonScroll.jsx`) — same reasoning as `lux-ken-burns`: continuous motion is
an anti-pattern only for content the visitor is meant to focus on or interact with; a faded
brand-mark texture band is closer to `lux-ken-burns`'s "still photography that breathes" than
to a UI element. See the cinematic media utilities table above for the mechanism.

**A third: `pattern-diamond-drift`** (`Hero.jsx`'s bottom band's second strip, added
2026-09-28 with the band split) — same category again: a low-opacity ambient brand-texture
strip, deliberately drifting against the ribbon's direction so the two strips counter-move
(in both reading directions — both loops reverse under `html[dir="rtl"]`).

---

## Part IX — Image & Photography Direction

Photography is the primary carrier of brand emotion. Typography sets the standard. Photography delivers the feeling.

### Style Criteria

- **Architectural composition** — considered framing, strong negative space
- **Natural lighting** — no studio flash aesthetics, no dramatic artificial lighting
- **Soft shadows** — light wraps around objects, never cuts
- **Material focus** — macro detail, surface texture, grain, seam, weave
- **Museum-like framing** — objects float in space, not packed into scene
- **High contrast texture** — the viewer should almost feel the surface

### What to Avoid

- Generic stock imagery
- Oversaturated post-processing
- Fake luxury (cold blue tones, excessive rim light, over-retouched surfaces)
- Lifestyle clichés (hands touching products, people smiling at objects)

Images must feel: **tangible, expensive, artistic, real.**

---

## Part X — Performance & Technical Standards

### Core Requirements

- Excellent Core Web Vitals across all device classes
- Fast LCP — above-fold content renders without layout shift
- GPU-accelerated transforms only (`transform`, `opacity`) — never animate `width`, `height`, `top`, `margin`
- Lazy-load all below-fold imagery
- No JavaScript bloat — motion libraries only where they provide genuine value
- Efficient animations — `will-change` only where confirmed necessary

### Architecture Principles

- Clean, modular, maintainable code
- Semantic HTML — structure communicates meaning, not just layout
- No inline style hacks except where CSS variables require it
- Component-scoped styling via Tailwind semantic tokens — no global overrides

---

## Part XI — Accessibility

Luxury does not excuse inaccessible design. Accessibility is integrated invisibly.

- WCAG AA contrast compliance at minimum (AAA where achievable)
- All interactive elements keyboard-navigable
- Proper ARIA labels on non-text controls
- Semantic HTML5 landmarks
- Focus states visible but styled to match brand character
- `prefers-reduced-motion` respected — all animations respect the system preference
- Screen reader support for dynamic content

Accessibility must feel like it belongs, not like it was bolted on.

---

## Part XII — Content Tone & Copywriting

### Voice Character

- **Sophisticated** — confident, never loud
- **Minimal** — say less. One precise sentence over three average ones
- **Editorial** — reads like a printed magazine, not a website
- **Poetic but restrained** — imagery in language, never purple prose
- **Confident** — no hedging, no qualification, no startup energy

### Avoid

- Marketing buzzwords ("innovative", "disruptive", "seamless")
- Aggressive sales language
- Urgency or scarcity manipulation
- Self-congratulatory superlatives
- Startup-style copy ("We believe in...", "Our mission is...")

### Copy Model

Think: the label card on a gallery piece. Or the caption in an architecture monograph. Or a single sentence in a Hermès catalogue. Minimal. Precise. Enough.

---

## Part XIII — Rules for Future Additions

### Adding a new color token

1. Define the raw CSS variable value in **all three** theme blocks (`:root`, `.mid`, `.dark`).
2. Register it in `@theme` under a semantic role-based name — never a descriptive hex name.
3. If opacity variants require pre-computation (variable chains through another variable), add a `@layer utilities` class.
4. Document it in this file.

```css
/* CORRECT */
:root { --text-editorial: #4A3F35; }
.dark { --text-editorial: #C9BFB5; }
.mid  { --text-editorial: #B8C4D4; }

@theme { --color-editorial: var(--text-editorial); }
/* Usage: text-editorial, border-editorial/20 */

/* WRONG — never do either of these */
.some-component { color: #4A3F35; }
.some-component { color: var(--some-unnamed-var); }
```

### Adding a new shadow

Add to `@layer utilities` with a functional name:

```css
.shadow-panel-hover { box-shadow: 0 24px 60px rgba(0, 0, 0, 0.09); }
```

### Adding a new interactive control surface

If a new UI control requires its own themed background, add to all three theme blocks and a utility class:

```css
:root  { --bg-new-control: rgba(28, 28, 28, 0.08); }
.dark  { --bg-new-control: rgba(255, 255, 255, 0.08); }
.mid   { --bg-new-control: rgba(0, 0, 0, 0.30); }

@layer utilities {
    .bg-new-control { background-color: var(--bg-new-control); }
}
```

### Adding a new section or component

Before building:
1. Is the motion restrained? Duration ≥ 1s for reveals. No bouncing.
2. Is the color usage semantic? No hex values in JSX or component CSS.
3. Does it justify its existence? Remove anything that does not serve the brand character.
4. Is it accessible? Semantic HTML, keyboard nav, focus state.
5. Is it fast? GPU-only transforms, lazy-loaded images, no bloat.

---

## Part XIV — What This System Is Not

- **Not utility-first.** Tailwind utilities are used, but always through semantic tokens — never raw colors or arbitrary values except for spatial layout.
- **Not a component library.** Styling lives in components. This file provides only the token vocabulary.
- **Not theme-agnostic.** Every token is tuned for three specific palettes. New palettes require extending all three theme blocks simultaneously.
- **Not a design trend.** This system is built for 5–10 year relevance. Trend-chasing changes are not compatible with it.
- **Not permissive.** There is no escape hatch for "just this once." The discipline is the system.

---

## Part XV — Implementation Gotchas

These are load-bearing details in `globals.css` that are easy to break silently.

### Farsi typography — Dorsa (self-hosted)
Farsi/RTL text renders in **Dorsa**, a Persian typeface self-hosted under
`/public/fonts/Dorsa-*.otf` and declared via `@font-face` at the top of
`globals.css` (weights 300/400/700 — the 800/900 files were removed in the 2026-09-28
unused-font purge; nothing requested them). The `html[lang="fa"]` overrides map
body, headings (`h1–h6`), and `.font-mono`/`code` to `"Dorsa", "Tahoma", …`
(the `Tahoma` system face is the fallback). The Google Fonts `@import` no longer
loads Vazirmatn/Amiri — both were removed when Dorsa was adopted. Do **not**
re-introduce `font-family: "Vazirmatn"`/`"Amiri"` in the Farsi rules; those
faces are no longer loaded. FractulAlt (the site's Latin serif/sans typeface, see below)
is Latin-only — 0 Persian glyphs — and must never be pointed to by any Farsi rule.

All `@font-face` blocks are `font-display: block` (changed 2026-09-06 from `swap`, user
request "always fonts take effect": `swap` painted the Tahoma/Latin fallback first and
flashed to the real face on arrival — visible on every cold load and most refreshes,
since the loader only covers the first visit per session). `block` renders text
invisible for up to 3s instead of wrong — with same-origin preloaded fonts the invisible
window is a fraction of a second and the first paint is already the correct face. The
single remaining `next/font` face in `app/layout.js` (`fractulAlt`) carries the same
`display: "block"` — keep all font sources on `block`; do not reintroduce `swap` for
any single face or the flash returns for that face. To shorten the invisible window,
`app/layout.js` emits three `<link rel="preload">`
lines (`Dorsa-Regular.otf` + `Dorsa-Light.otf` + `Dorsa-Bold.otf` — the weights Farsi
uses above the fold: 400 for body/headings, 300 for `.font-mono` labels, and 700 for
explicitly bold headings — the Hero h1 is the only `font-bold` heading site-wide, allowed
by the `html[lang="fa"] h*.font-bold` override added 2026-09-29 at owner request for
EN/FA weight parity) when `initialLanguage === "fa"`. (An earlier fourth preload,
`Dorsa-Black.otf` for the 900 `.italic` accent rule, was removed with the 2026-09-28
unused-font purge — see Part XV.) If the Farsi weight usage ever changes, change the
preload set in the same edit — **in both places**: `shared/DorsaPreloadScript.jsx`
duplicates this array for the static `collection/[slug]` route (same duplicated-value
contract class as `imageKey`/zoom-stops).

**On a route that always bakes `initialLanguage="en"` regardless of the real visitor,
this server-side preload can't run at all — `cookies()` returns nothing useful in that
context.** This used to be true of the House pages, `collection/[slug]`, and `/glance`
alike (all either `force-static` or otherwise unable to see the real per-request
cookie). Without a preload hint, Dorsa only started loading after the client-side
locale-restore effect (`LanguageProvider.jsx`) flipped `<html lang>`/`.farsi-mode`, so a
returning Farsi visitor saw a much longer `font-display: block` invisible-text window
than on routes that could bake `fa` directly — long enough in practice to run past the
block period and paint the `Tahoma` fallback before Dorsa finally swapped in, which read
as "wrong/default font" rather than a brief flash. `shared/DorsaPreloadScript.jsx`
(added 2026-09-07) closed that gap client-side: the same static `<script>` for every
visitor (so the HTML stays fully cacheable), reading `document.cookie`/`localStorage`
for `zaad_preferred_language` at runtime — the identical check `LanguageProvider`'s
restore effect does — and if `"fa"`, synchronously injecting the same three preload
`<link>` tags into `document.head` during initial HTML parsing, well before React
hydrates.

**The House pages and `/glance` stopped needing it the same day** — they were switched
from `force-static` to `force-dynamic` specifically so `generateMetadata()` (and, as a
side effect, `app/layout.js`'s own `getServerLanguage()` call) reads the real
`zaad_preferred_language` cookie on every request instead of freezing at build time.
`initialLanguage` is now correct from the very first byte of HTML on those two routes,
so the standard server-side preload above already fires correctly and
`DorsaPreloadScript` was removed from `(house)/layout.js` and `glance/page.js`.
**`collection/[slug]/page.js` still mounts it** — that route remains genuinely static via
`generateStaticParams` (a fixed, known set of product pages built once, a different
mechanism from `force-static` that this project still wants to keep for product pages),
so it still can't see the real per-request cookie and still needs the client-side
compensation.

### FractulAlt — the single Latin typeface (replaced Playfair Display + Inter, 2026-09-27)
The site used to run two separate Latin typefaces — Playfair Display (`--font-serif`,
headlines and the brand wordmark) and Inter (`--font-sans`, body/UI). Both were retired in
favor of **FractulAlt**, a single self-hosted typeface confirmed by the client as the one
unified English font. One `next/font/local` call in `app/layout.js`:

- `fractulAlt` (`--font-fractulalt`) — a five-file weight-mapped `src` array:
  Light/Regular/Medium/SemiBold/Bold → weights 300/400/500/600/700. These are the *only*
  weights any `font-*` Tailwind utility class actually renders anywhere in
  `src/components/` (grepped before shipping). Hairline (200) was dropped in the 2026-09-28
  unused-font purge (no `font-thin`/`font-extralight` utility exists anywhere), alongside
  the two italic faces (`fractulAltItalic` — zero consumers since the 2026-09-27 sitewide
  italic removal) and `jetbrainsMono` (orphaned by the same day's mono re-point below).

The `@theme` block maps the family to every utility token: `--font-serif:
var(--font-fractulalt), Georgia, serif`, `--font-sans: var(--font-fractulalt), sans-serif`,
and — since the 2026-09-28 mono re-point (user request: every English label still rendering
in the non-brand coding face, e.g. "COLLECTION STRUCTURAL SPECS (SHOW STATS OVERVIEW)",
must render in the default typeface) — `--font-mono: var(--font-fractulalt), monospace` too.
All three utility tokens resolve to the *same* family; `.font-mono` survives purely as a
semantic label class with no font-branching effect. `html[lang="fa"]` is unaffected — the
blanket Farsi override still forces `.font-mono` to Dorsa. `html[lang="fa"] .font-latin`
was re-pointed in the same change from `var(--font-jetbrains), var(--font-fractulalt),
monospace` to `var(--font-fractulalt), monospace` so fa-mode Latin codenames ("C°01",
"GÁVV") render in the same face as their en-mode `.font-serif` twins (this doc previously
claimed the chain was already `var(--font-fractulalt)` — that was drift; the code kept
JetBrains primary until 2026-09-28).

**`preload: false` on `fractulAlt`** — verified against the installed `next` package source
(`next/font/local`'s `preload` flag is applied uniformly to every file in a multi-file `src`
array; there is no per-file preload option). Preloading all five `fractulAlt` weights would
preload Medium/SemiBold/Bold too, none of which render above the fold on any route — same
"preload only the above-the-fold subset of a multi-weight family" discipline the Dorsa
preload links above already apply. Net preload payload dropped versus the old
single-variable-file Playfair + Playfair-Italic + Inter setup, even though total *shipped*
bytes across all weight files rose (static per-weight files, unlike a single variable-font
file, don't share glyph outlines across weights) — see `app/README.md`'s font-preload
paragraph for the same reasoning from the layout side.

Source files live in `src/fonts/FractulAlt-{Weight}.woff2` (converted from the foundry's
original bundle — only the `.woff2` files were kept, smaller and matching this project's
existing self-hosted-font pattern). The deleted faces' files (Hairline, both italics,
JetBrains Mono) were removed from disk in the 2026-09-28 purge, and two public copies
(`public/fonts/FractulAlt-Light.woff2` + `FractulAlt-Regular.woff2`) were added the same day
for `app/global-error.js`, which replaces the root layout and therefore can't reach
`next/font`'s variables — it declares its own inline `@font-face` pair at a fixed `/fonts/`
URL instead (the one sanctioned spot where the brand font is loaded outside
`next/font`).

### `.font-farsi` — opt-in Dorsa for non-heading `.font-serif` text
`html[lang="fa"] .font-farsi { font-family: "Dorsa", "Tahoma", sans-serif !important; }`
lets a specific element keep Tailwind's `.font-serif` class (FractulAlt) for layout/weight
purposes while still rendering in Dorsa under `html[lang="fa"]`. It wins over the unscoped
`.font-serif` utility because it carries `!important` and `.font-serif` does not — so pairing
`font-serif font-farsi` on the same element is safe regardless of class order. `.font-serif`
itself is deliberately **excluded** from the blanket Farsi override (unlike `.font-sans`, `h1–h6`,
and `.font-mono`) so the ZAAD wordmark — always `.font-serif` alone, never `.font-farsi` — is
never touched. **Heading tags (`h1`–`h6`) are covered automatically regardless of `.font-serif`**
(a heading is essentially always translated content, never a brand-only Latin code, so the tag
selector is safe to broaden without a per-instance `.font-latin`/`.font-farsi` judgment call) —
`.font-farsi` is only needed on non-heading elements (`span`/`p`/`div`) carrying `.font-serif`
that render translated text: e.g. card/box titles in `header/PrimaryPages.jsx`,
`header/UtilityStrip.jsx`, `Materials.jsx`'s material `name`, `glance/GlancePage.jsx`'s rail/chip chapter labels and
overview statement blockquote, `glance/GlanceChapter.jsx`'s tagline + narrative paragraphs,
`Vision.jsx`'s pull-quotes/stat labels, `header/MenuControls.jsx`'s `BRAND_NAME[language]` span
(the "زااد" transliteration in its edition badge — see `src/components/README.md`'s note on the
wordmark-vs-incidental-mention distinction), and `house/ChapterPieces.jsx`'s `StatValue`
count-up stat span — all found the same way (a Farsi string rendering in
the wrong, Latin-serif face because its tag/class combination fell through every existing
override). Do **not** add it to the wordmark, or to any field that stays Latin regardless of
locale (see `.font-latin` below) — `header/SpecimenGrid.jsx`'s `item.name` looked similar but is
the latter case, not this one.

### `.font-latin` — opt-out back to Latin for permanently non-Farsi brand content
`html[lang="fa"] .font-latin { font-family: var(--font-fractulalt), monospace !important; }`
is the inverse of `.font-farsi`: some fields are Latin **in both dictionaries** — collection
`number` ("C°01"…"C°04") and `name` (the product codenames "GÁVV"/"ZIVV"/"RÁKH"/"VAAR") are never
translated, by brand design (see `src/lib/i18n/README.md`). Left alone, these inherit Dorsa from
an ancestor's `.font-mono`/`.font-sans` class (or from `body` itself, since the blanket
`html[lang="fa"], html[lang="fa"] body` rule cascades to any element with no explicit
`font-family` of its own). Wrap just the Latin fragment in `<span className="font-latin">`
— not the whole parent — when it sits inside a larger element that also renders real translated
text (e.g. `shared/Lightbox.jsx`'s `<span className="font-serif font-latin">{archiveNumber}</span>
{" "}{t("lightboxArchiveLabel")}`). Elements that are Latin-only outright (e.g.
`glance/GlanceChapter.jsx`'s header `item.number` span) can carry `.font-latin` directly instead
of nesting a child span. Current call
sites: `shared/Lightbox.jsx` (`archiveNumber`), `glance/GlancePage.jsx` (overview card
`item.number` eyebrow) and `glance/GlanceChapter.jsx` (header `item.number` — the
`item.year` beside it stays unwrapped, Farsi digits), `concierge/InquiryForm.jsx`'s
`SEC-COM-{sessionRef}` span, `Materials.jsx`'s per-locale label span (`font-farsi` in
Farsi, `font-latin` in English), and `ledger/Ledger.jsx`'s session-ID chip.
(The former `header/SpecimenGrid.jsx` / `collection/NavBar.jsx` / `collection/CollectionMeta.jsx`
/ `showcase/CollectionPanel.jsx` / `showcase/CollectionTabs.jsx` call sites all fell away in the
2026-09-28 copy-replacement pass — the number spans, archive strips, spec grids, and designer
rows they wrapped were blanked in the client's copy list and removed.)
`item.name` under plain `.font-serif` (no `.font-mono`/
`.font-sans` ancestor) needs neither class — `.font-serif` is already excluded from the Farsi
override (`header/SpecimenGrid.jsx`'s remaining `item.name` is the live example).
Mixed-script strings like the former `"استودیو ZAAD"` designer field are a different tool —
they need the runtime scan `wrapLatinRuns`/`wrapBrandNames` does, not a static
`.font-latin`/`.font-farsi` pairing.

**`item.year` is no longer part of this trio.** It reads in Farsi-Indic digits in `fa.js`
(`"۲۰۲۶"`, not `"2026"`) as of the digit-uniformity pass in `src/lib/i18n/README.md` — `.font-latin`
was removed from both its render sites (`collection/CollectionMeta.jsx`, `showcase/ImageViewer.jsx`)
since it would force a Latin font onto Farsi digit glyphs. `item.price` (unused by any component
today) got the same digit conversion for data consistency, should a consumer render it later.

### Heading tags force Dorsa unconditionally — even on pure-Latin or `.font-serif` content
The `html[lang="fa"] h1, h2, h3, h4, h5, h6 { font-family: "Dorsa", "Tahoma", sans-serif !important; }`
rule (documented above under `.font-farsi`) is a raw **element** selector — it does not check for
`.font-serif`, `.font-latin`, or any class at all. Two real bugs shipped from forgetting this:
`Footer.jsx`'s "ZAAD" wordmark was wrapped in `<h3>`, so despite being plain `.font-serif` (which
is otherwise excluded from the blanket override) it rendered in Dorsa anyway — fixed by changing
`<h3>` → `<p>` (identical classes), matching how `Header.jsx`'s
wordmark already avoids heading tags for exactly this reason. `concierge/CuratorChat.jsx`'s
`t("zaadDigitalCurator")` = "راهنمای زااد" — real Farsi text, sitting directly inside an
`<h3>` — had the same problem (its value was the mixed-script "کیوریتور دیجیتال ZAAD" at the
time; renamed 2026-09-27, pure Farsi now, but the wrap stays as future-proofing). **Rule of thumb when adding or touching
an `h1`–`h6`:** if it's ever going to render a Latin brand token (a hardcoded "ZAAD", a collection
codename, a model badge) either directly or mixed into translated Farsi copy, either wrap the
render with `wrapBrandNames(value)` (see below — the current fix for both of the mixed-content
cases above) or — if the content is 100% Latin brand text with no real Farsi prose ever mixed
in — don't use a heading tag for it at all.

### Brand tokens always render in `font-serif` — a deliberate identity rule, not a bug fix
Wherever the literal strings **"ZAAD"**, **"Dorsa"**, **"Persol Business Solution"**, or a
collection codename (**"GÁVV"**, **"ZIVV"**, **"RÁKH"**, **"VAAR"** — the exact spellings live in
each `collection[].name` entry in `src/lib/i18n/en.js`/`fa.js`) appear
anywhere in the UI, they render in the site's FractulAlt `font-serif`, regardless of what
font-family the surrounding text uses (`font-mono`, `font-sans`, or inherited) — an explicit
user-specified brand-identity preference, independent of the Dorsa-heading bug above (fixing that
bug does not by itself satisfy this rule, and vice versa).

**`src/lib/wrapBrandNames.js`** is the mechanism: it scans a string for any of the tokens above and
wraps each match in `<span dir="ltr" className="font-serif">` (the `dir="ltr"` also gives it the
same bidi isolation `wrapLatinRuns` provides — no need to pass `isFarsi`, and no need to combine
the two helpers on the same string). It is a no-op (returns the input unchanged) when no token
matches, so it is safe to call unconditionally on any string that *might* contain one. Real call
sites: `Footer.jsx` (`footerCraft`, replacing a per-file
`.split("Persol Business Solution")` one-off), `Hero.jsx` (`heroDesc` only — the
former `estFlorence` tagline call site was removed 2026-09-27 along with the text itself and
`bespokeObjects` was deleted in the 2026-09-28 copy-replacement pass, see
the Hero.jsx ribbon-band note in `src/components/README.md`), `Materials.jsx`
(`ZAADCertified`), `concierge/CuratorChat.jsx` (`zaadDigitalCurator`, same
reasoning), `collection/CollectionMeta.jsx` and `showcase/CollectionPanel.jsx` (the
collection `name` codenames — "GÁVV" etc., Latin in both dictionaries; their former designer/
origin/`productZAAD` wrap targets were removed 2026-09-28 with the rows those labels sat in).

**Direct-heading-child sites (added 2026-09-03)** — sites where a brand token is the
heading's own unwrapped text child (see "Heading tags force Dorsa unconditionally" above for why
these specifically need `wrapBrandNames`, not just any brand-adjacent text): `collection/CollectionMeta.jsx`'s
`<h1>` (`item.name`, e.g. "GÁVV"), `showcase/CollectionPanel.jsx`'s `<h3>` (`selectedItem.name`, same
field), and `house/HouseDiptychShell.jsx`'s internal `ColumnHeader`'s `<h2>` (`title` prop, fed by
`house/AboutChapter.jsx`'s `story`/`about` `aboutSections` entries' `title` fields —
"داستان زااد"/"خانۀ زااد" in Farsi, "The Story of ZAAD"/"The Maison" in English).

**Why a bare (non-`!important`) `.font-serif` span is enough, even nested inside a Dorsa'd
heading**: `font-family` is an inherited CSS property — inheritance is the *lowest*-priority
source in the cascade, used only when no rule directly targets that element. A child `<span>`
carrying its own `.font-serif` class is a rule that directly targets the span, so it wins over
whatever `font-family` value cascaded down from an ancestor's `!important` rule, with no
specificity contest involved (the ancestor's `!important` only settles competition among rules
that target the *ancestor itself*). This is why `wrapBrandNames`'s span doesn't need `!important`
the way `.font-farsi`/`.font-latin` do — the whole `.font-farsi`/`.font-latin` `!important` marker
in those two is standing convention for this project, not something the code strictly requires.

**Explicit exception**: `concierge/InquiryForm.jsx`'s email input `placeholder="client@zaaddesign.com"`
(lowercase, `font-mono` — deliberately styled like an email/code field, per explicit user request
2026-09-02) is a fake example address, not a real brand mention — don't wrap it in
`wrapBrandNames`/uppercase it back to match the brand-token casing convention.

**Deliberately left alone** (judgment calls, not oversights): `<option>` elements
(`InquiryForm.jsx`'s `florenceViewing`; `NavBar.jsx`'s former `productZAADArchive` breadcrumb
segment was on this list until the whole breadcrumb strip was removed 2026-09-28, key deleted)
can't selectively style a child span in most browsers; sibling-label grids where only one entry
contains a brand token (`menuChapterHome` among plain menu links — the former footer
sibling `footerMilanZAAD` (deleted 2026-09-29; merged into `footerStudioAddress`) read "Tehran"/"تهـران" and no longer contained a token,
`showcaseZAADWeight` among a spec grid's other labels (its sibling `productZAADWeight` was
deleted 2026-09-28), `zaadTowerRowScheduling`
inside a dense technical spec table) were left uniform rather than making one sibling visually
odd; and long prose paragraphs mentioning a brand token mid-sentence (`aboutSections`, `brandStory`)
are still left as-is — those are markdown-adjacent, parsed by `house/ChapterPieces.jsx`'s
`EditorialBlock` `### heading` regex split, and extending `wrapBrandNames` there needs its own
case-by-case fragility check the rest of this sweep didn't require. This rule was originally applied only to short
labels/headings/eyebrows/badges/footer
text/menu cards/product titles, where it's both safe to isolate and reads as brand emphasis rather
than noise. **Extended to plain-string prose by explicit user request (2026-09-02):** every other
`en.js` key containing a brand token was audited against its render site and, where it was a direct
string render (not markdown-parsed) and not one of the exceptions above, wrapped:
`Hero.jsx`'s `heroDesc` (its `bespokeObjects` companion on this list was deleted
2026-09-28),
`collection/TabAppliances.jsx`'s `gaggenauIntegrationSpecifics` eyebrow, and
`house/ChapterPieces.jsx`'s `CrossLinks` `{s.teaser}` (the
single shared render site for `crossLinkAbout`/`crossLinkStoryValue`/
`crossLinkSustainabilityResponsibility`, each a one-sentence cross-link teaser used across all
three House pages). (`Footer.jsx`'s former `footerHouseDir` column heading was on this list;
the key is deleted from both dictionaries, and the heading that briefly replaced it
(`menuJourneyIndex`) was itself deleted with the whole heading block in the 2026-09-28
copy-replacement pass — the column's list survives without any heading.)

### Farsi text is never italicized
Persian script has no proper italic form — rendering it italic looks broken. The client's
"no italic" rule (2026-09-27) is absolute and sitewide: every `.italic` usage in
`src/components/` was removed in that pass, including the two former "signature flourish"
accent spans (`Hero.jsx`'s title-accent and `house/ChapterPieces.jsx`'s `heroTitleAccent`,
both now plain `font-serif`). The `html[lang="fa"] .italic` override that used to swap
Farsi `.italic` to Dorsa 900 became dead with that removal and was deleted in the
2026-09-28 unused-font purge — along with the `fractulAltItalic` `next/font/local` call,
its woff2 files, the `--font-serif-luxury` theme token and its `html[lang="fa"]` CSS rule
(zero remaining consumers; the family only shipped italic-style files), Dorsa's 800/900
weight files (no `font-extrabold`/`font-black` utility exists anywhere, and nothing else
requested those weights), and the `Dorsa-Black.otf` preload. **The purge resolved the open
item this section used to carry** ("delete the unused font infrastructure or confirm a
future consumer") by explicit user direction ("delete unused ones", 2026-09-28). If italic
is ever deliberately reintroduced: Farsi needs a Dorsa-weight swap rule again (no italic
Dorsa face exists), and `font-serif-luxury` would need its own re-ship decision — it is
gone from `@theme`, so the class no longer resolves to any family.

### `@custom-variant dark` — `dark:` utilities key to the app themes, not the OS
`@custom-variant dark (&:where(.dark, .dark *, .mid, .mid *));` is declared immediately
after the `@import "tailwindcss"`. Every `dark:` utility therefore triggers on the
**class-driven** `.mid`/`.dark` themes (both are dark fields — graphite and carbon), never on
the OS `prefers-color-scheme`. Before it existed, a phone in OS-dark mode viewing the
light theme rendered `dark:group-hover:text-white` as invisible white-on-cream tab labels
and mismatched `dark:bg-panel/5` tints. Do not remove it, and do not write `dark:`
utilities expecting OS-keyed behavior — "on a dark surface" means `.mid` or `.dark` here.

### `@import "../../node_modules/tailwindcss"`
Tailwind v4 is imported via a relative path to `node_modules`. If `globals.css` is
relocated (e.g. moved to `src/app/`), this path breaks. It currently works because the
file lives at `src/styles/`.

### `--zaad-font-scale` — app-wide text-size accessibility control
Driven by `src/hooks/useFontScale.js` (the `+`/`−` control in `header/MenuControls.jsx`
and `house/HouseChrome.jsx`). Two mechanisms, both scoped to **font-size only** — neither
touches `html`'s root font-size, because Tailwind v4's spacing scale (`p-*`, `gap-*`,
`w-*`, `h-*`, …) is also `rem`-based off the root; scaling root font-size would enlarge
padding/gaps/widths right along with text and distort every layout, not just copy:

1. **Named utilities** (`text-xs` … `text-9xl`) — this file's own `:root` block
   redefines Tailwind's `--text-xs` … `--text-9xl` theme tokens as `calc(<default rem> *
   var(--zaad-font-scale))`, placed immediately after `@import "tailwindcss"` so the
   later same-specificity `:root` declaration wins in the cascade. Automatic — no
   per-component change needed for these.
2. **Arbitrary pixel utilities** (`text-[Npx]`) — Tailwind's arbitrary values are static
   px, invisible to any CSS variable unless written that way explicitly. Every
   `text-[Npx]` in `src/components/**/*.jsx` was mechanically converted to
   `text-[length:calc(Npx*var(--zaad-font-scale))]` (177 occurrences, 34 files) — same
   visual size at the default `--zaad-font-scale: 1`, but now responsive to the toggle.
   **Load-bearing:** any *new* arbitrary text size must be written in this
   `text-[length:calc(Npx*var(--zaad-font-scale))]` form from the start, or it silently
   won't respond to the accessibility control while everything around it does — a plain
   `text-[Npx]` will compile and look identical at 100%, so this bug won't show up until
   someone actually presses `+`/`−`.

`--zaad-font-scale` itself is a two-layer variable (2026-09-01): `:root` defines
`--zaad-user-scale: 1` and `--zaad-font-scale: calc(var(--zaad-user-scale) * 1.15)` — the
`* 1.15` is a permanent site-wide baseline size increase (added 2026-09-27, client request),
layered underneath the accessibility control rather than replacing it: at the default
`--zaad-user-scale: 1` every `--text-*` token now renders 15% larger than its raw Tailwind
value, and the `+`/`−` control still composes on top of that baseline exactly as before. The
hook writes **`--zaad-user-scale`** (range `0.85`–`1.3`) via
`document.documentElement.style.setProperty(...)` — see `src/hooks/README.md`'s
`useFontScale.js` entry for the hook contract; `useFontScale.js`'s own MIN/MAX/STEP constants
were not touched by the 2026-09-27 change. A companion rule
`html[lang="fa"], .farsi-mode { --zaad-font-scale: calc(var(--zaad-user-scale) * 1.05 * 1.15) }`
bumps the Farsi baseline by exactly one `+` step on top of the same 1.15 baseline: Dorsa at
Latin-parity size reads cramped, so Farsi defaults to what English looks like after one press
of `+`, while the `+`/`−` control keeps composing on top (effective Farsi range ≈
`0.89`–`1.365`, each end also carrying the 1.15 baseline). The control's `100%` label shows
the user scale, not the effective one. **Load-bearing:** the hook must write
`--zaad-user-scale`, never `--zaad-font-scale` — writing the effective var directly would
overwrite both the Farsi bump and the 1.15 baseline and decouple the two languages. **If the
1.15 baseline is ever retuned, change both the `:root` line and the `html[lang="fa"]`/
`.farsi-mode` line together** — the second composes on the first (`* 1.05 * 1.15`, not a
standalone value), so editing only one desyncs Farsi from the new baseline the same way
editing only one side of the old `--zaad-font-scale`/`--zaad-user-scale` split would.

**Farsi line-height compensation (same block):** the ×1.05 bump also grew every line box
(all leading in this codebase is unitless ratios), which read as inflated vertical rhythm.
The same `html[lang="fa"]/.farsi-mode` rule therefore divides the whole leading system by
the same factor — `--leading-*` theme vars (`tight 1.19 / snug 1.31 / normal 1.43 /
relaxed 1.54 / loose 1.9`), the `--text-*--line-height` companions, and an inherited
`line-height: 1.43` (preflight's 1.5 ÷ 1.05) — so Farsi line boxes return to the pre-bump
pixel rhythm while keeping the larger glyphs. The Farsi heading rule used `1.48` (was 1.55,
same ÷1.05) until 2026-09-29, when the owner's sitewide "too much space between title and
text" direction dropped it to **`1.25`** for all Farsi `h1`–`h6`: at 1.48 every heading —
including the h1s explicitly written with `leading-tight`/`leading-[1.12]`, which the
`!important` rule overrides — carried ~7px of dead air above and below the glyphs, which is
what read as "uncommon space" under every section title. 1.25 keeps Dorsa legible on wrapped
display headings while restoring the tight title+text relationship. `leading-none` and
arbitrary `leading-[N]` values are literals and stay uncompensated (+5% in Farsi —
negligible, and headings override them via the `!important` rule anyway). **Do not "simplify"
these numbers away:** they are 1:1 tied to the 1.05 bump; change one, change both.

### Section vertical rhythm — `section-y` / `section-y-break` (retuned 2026-09-29)

Section padding is no longer per-file `py-*` values — it flows through four tokens +
two `@utility` classes defined at the top of `globals.css`. The rhythm is deliberately
**asymmetric** (quiet entry, generous exit — the luxury cadence; the boundary between two
`section-y` sections lands at 112px desktop):

- `--zaad-section-y-top` / `--zaad-section-y-bottom`: `2rem`/`3rem` mobile, `3rem`/`4rem`
  at `≥48rem` — the standard section rhythm, consumed via the `section-y` class.
- `--zaad-section-y-break-top` / `--zaad-section-y-break-bottom`: `2rem`/`4rem` mobile,
  `3rem`/`5.5rem` at `≥48rem` — the "act break", consumed via `section-y-break`; used
  **only** where the narrative pivots (Vision's manifesto, Concierge's inquiry). Luxury
  rhythm = restraint + a few deliberate pauses, not uniform inflation.

Tuning the whole site's vertical rhythm = editing those two token blocks; nothing else.
History: pre-2026-09-05 the tokens were symmetric (80/80 and 128/128 desktop) and the
stacked 160/208px boundaries read as bloat — keep the top lean. The 2026-09-05 rebalance
went bottom-heavy (3.5/5rem and 4.5/7rem bottoms, 128px boundary); the 2026-09-29 retune
(owner: "slightly chubby and unprofessional, keep the best luxury look") trimmed the bottoms
back — desktop 5rem→4rem standard and 7rem→5.5rem act-break, mobile 3.5→3rem and 4.5→4rem —
keeping boundaries inside the expert-cited luxury range (96–136px desktop section gaps,
80–96px mobile) while removing the up-to-75%-more-bottom asymmetry that read as "chubby".
Tops are unchanged on purpose: a lean entry is half the luxury cadence. Two fixed-header
pages can't consume the tokens and instead hard-code the same cadence into header-calibrated
calcs — `CollectionPage.jsx` (`pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)] pb-12 md:pb-16`)
and `ledger/Ledger.jsx` (same `pt` calcs, `pb-16`) — match their additives/bottoms when
retuning the tokens (the `61px`/`73px` figures are `Header.jsx`'s rendered heights; see
`src/components/README.md`).

**Revert map** (the pre-2026-09-01 generous style — swap back per file to fully restore):

| File | Now | Was |
|---|---|---|
| `Vision.jsx:196` | `section-y-break` | `py-24 md:py-36` |
| `Materials.jsx:62` | `section-y` | `py-24 md:py-36` |
| `Showcase.jsx:25` | `section-y` | `py-24 md:py-36` |
| `Concierge.jsx:16` | `section-y-break` | `py-24 md:py-36` |
| `concierge/SectionHeader.jsx:7` | `mb-12 md:mb-16` | `mb-16 md:mb-24` |
| `house/HouseChapterShell.jsx:32` | `section-y` | `py-20 md:py-32` |
| `house/HouseChapterShell.jsx:44` | `section-y` | `py-20 md:py-24` |
| `house/HouseDiptychShell.jsx:37` | `section-y` | `py-20 md:py-32` |
| `house/ChapterPieces.jsx:221` | `section-y` | `py-20 md:py-28` |
| `house/ChapterPieces.jsx` `ChapterHero` section | `pt-24 md:pt-32` | `pt-36 md:pt-44` |
| `CollectionPage.jsx:29` | `pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)]` | `md:pt-[calc(73px+4rem)]` |
| `CollectionPage.jsx:32` | `mb-12 md:mb-16` | `mb-16 md:mb-24` |

Deliberately untouched: `Footer` (already modest), `shared/StatusScreen` (full-screen
centering), Hero's internal `mt-16`, House `CallStrip`'s page-terminal `pb-20`, and all
content-internal gaps (`space-y-*` inside editorial blocks, `gap-12` grids).

Farsi word rhythm: `html[lang="fa"]/.farsi-mode` also sets `word-spacing: 0.15em`
(Dorsa's inter-word space renders tight/"interwoven" without it). Do **not** add positive
`letter-spacing` to Farsi text — browsers break the cursive letter-joining of Arabic-script
fonts at any non-zero value, so the "air" between words must come from `word-spacing` alone.

Farsi prose floor: a full Farsi *sentence* must never sit in a Latin micro-tag size
(< 12px base) — Dorsa needs ~12px minimum to read as body copy. Short eyebrow/tag/chip
labels (≤ ~3 words: eyebrows, spec labels, material chips, attributions, meta lines) keep
their Latin micro sizes — only prose gets the floor. The idiom (already used by
`header/PrimaryPages.jsx`, `header/SpecimenGrid.jsx`, `header/UtilityStrip.jsx`, and the 2026-09-01
sweep) is a pure-CSS Farsi override appended to the element's own size utility:
`text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))]`
— no JS, no `isFarsi` threading, English rendering untouched. Swept spots: `InquiryForm`'s appointment hints / `archivalSpecs` /
`studioReplyStandard` (10/10.5→rtl 12), `CollectionPanel`'s `showcaseAirfreight` /
`showcaseCatalogueText` (10→rtl 12), `TabHeritage`'s `certificateOfProvenance`,
`shared/Lightbox`'s `zoomHint`, and the `footerCopyright`/`footerCraft` strips in
`Footer.jsx` (10/11→rtl 12).

### Radius language — one 6px radius sitewide (2026-09-03)

Every surface on every route (showroom, House, product) speaks **one** near-sharp
radius: **6px** — not Tailwind's per-class scale. Interactive surfaces carry
explicit `rounded-md` classes — nav settings trigger (`ExpandOnHoverPill`, both
variants), the control rows in `MenuControls` + `HouseChrome` (tracks, segment
buttons, indicator blobs), audio toggle, tooltip, video play/pause + expand
chips, prev/next arrows, every floating badge/pill over imagery (viewer,
lightbox, studio gallery), and the CTAs. A single unlayered
rule block at the end of `globals.css` ("Radius language") is the safety net;
it resolves, sitewide:

- the whole radius scale (`rounded`, `rounded-sm` … `rounded-2xl`) → 6px,
  whatever the utility claims;
- `MaisonButton` pills via the `maison-button` marker class on its root → 6px
  (all variants);
- the concierge section's leftover `rounded-full` controls via `#concierge`
  scope — call pill, audience toggle + blob, chat input/send, badges, the
  success coin.

**True circles keep `rounded-full`** and must never be swept into the rule:
ambient glows, status dots, the "Z"/"&" medallions on divider hairlines, the
custom cursor. Rounding a glow or the cursor is a visual bug, not a style
choice. (`rtl:`-prefixed radius variants like CuratorChat's bubble corners
compile to different class tokens, so the block never touches them — their
base corners come from the swept `rounded-2xl`.)

The block is **unlayered on purpose** — it must beat Tailwind's `@layer
utilities` (and `!important` utilities like the lightbox CTA's old
`!rounded-full` beat *it*, which is why those were removed rather than fought).
Changing the site's corner character = editing the one `border-radius: 6px`
value in that block; the pilot history (0px → 2px → 4px → 6px) landed on 6px
as "precision without the knife-edge".

### The `.mid` theme recolor (2026-09-27, client request) — navy → gray, champagne gold → marigold

`.mid`'s field shifted from a navy identity to a neutral-gray one, and its gold accent from
champagne (`#F2D299`) to a bright marigold yellow (`#FFC211`). Only `.mid` was touched —
`:root` (light) and `.dark` keep their own bronze/gold values and dark-carbon field untouched.

**Gray conversion method:** every navy value that Part I's `bg-foundation`/`text-canvas`
family-lock note called out as "the navy family's own" was desaturated to a neutral gray *at
the same HSL lightness* (`L = (max(R,G,B) + min(R,G,B)) / 2`, rounded to the nearest integer,
then applied equally to R/G/B) rather than picked freehand:

| Variable | Before | After | L (0–255) |
|---|---|---|---|
| `--bg-primary` | `#1F242C` | `#262626` | 37.5→38 |
| `--bg-secondary` | `#161A20` | `#1B1B1B` | 27 |
| `--bg-secondary-40`/`-60` rgba base | `22, 26, 32` | `27, 27, 27` | 27 (same base as `--bg-secondary`, alphas `0.46`/`0.66` unchanged) |
| `--bg-foundation` / `--bg-overlay-panel` | `#0C0F15` | `#111111` | 16.5→17 |
| `--border-color-5/10/15` rgba base | `235, 239, 245` | `240, 240, 240` | 240 (alphas `0.06`/`0.12`/`0.18` unchanged) |
| `--text-primary` / `--text-headline` / `--text-canvas` | `#EBEFF5` | `#F0F0F0` | 240 |
| `--text-on-indicator` | `#1F242C` | `#262626` | tracks the new `--bg-primary` — it was already an exact duplicate of that variable's value pre-recolor, kept in sync rather than left as a stray navy hex |
| `--bg-card` | `#282E38` | `#303030` | 48 |
| `--bg-card-trans` rgba base | `40, 46, 56` | `48, 48, 48` | 48 (same base as `--bg-card`, alpha `0.82` unchanged) |
| `--bg-card-95` rgba base | `38, 44, 54` | `46, 46, 46` | 46 (its own base, one step darker than `--bg-card` before and after; alpha `0.97` unchanged) |
| `--text-secondary` / `--text-dim` | `#97A5B8` | `#A8A8A8` | 167.5→168 |

`--bg-secondary-40`/`-60` aren't in Part I's family-locked list by name, but their rgba base is
the literal decimal form of the old `--bg-secondary` hex — left navy while the hex changed
would have produced a visibly blue-tinted overlay on a now-gray base, so they were converted
using the same method as an extension of the same fix, not a separate scope decision.
`--bg-card`/`-trans`/`-95` and `--text-secondary`/`--text-dim` (originally left as a documented
residual, since they weren't part of Part I's family-locked navy pairing) were folded into the
same gray conversion on explicit follow-up instruction (2026-09-27) — same method, same
lightness-preserving math, so the whole `.mid` palette is now consistently neutral-gray with
no remaining blue cast. **`--shadow-color` (`rgba(10, 12, 16, 0.40)`) is the one value still
untouched** — it's a shadow-alpha token, not a surface/ink color, and was not named in either
recolor request; its residual blue tint is imperceptible in practice (a 40%-alpha shadow, never
seen at full strength) but is noted here for completeness should a future pass want full
uniformity.

**Gold → marigold conversion:** `--text-bronze` and `--bg-indicator` both moved from
`#F2D299` to `#FFC211` (the same champagne value was reused for both, so both got the swap for
consistency). The old gold's RGB triplet (`242, 210, 153`) also appeared inside two rgba()
call sites in the same `.mid` block — `--color-selection` and `--gold-specular`'s three
gradient stops — and was replaced with the new marigold's triplet (`255, 194, 17`) in place,
every alpha and gradient stop-percentage left exactly as it was. `--text-on-indicator` (the
ink color painted on top of `--bg-indicator`) was re-pointed at the new `--bg-primary` gray
(see table above) rather than left as a stray navy hex — it reads as a legible dark ink
against the new bright marigold, same as it did against navy before.

### Letter-spacing: tried a reduction, reversed same-day, then removed entirely (2026-09-27)

A 2026-09-27 pass briefly reduced letter-spacing sitewide (a `--tracking-widest: 0.08em`
`@theme` override, `.lux-button-atelier:hover`'s `letter-spacing` cut to `0.18em`, and every
arbitrary bracket tracking value in JSX reduced by ~25–30%). The client reversed that same
day and every value was restored to its pre-2026-09-27 original.

**Later the same day, the client made a different, fresh call: remove wide letter-spacing
entirely rather than reduce it.** With the site-wide font-size increase already shipped,
tracking was judged unnecessary at any value, not just the earlier reduced one. Every
`tracking-wide`/`tracking-wider`/`tracking-widest`/`tracking-[Nem]` utility used on uppercase
mono labels, eyebrows, badges, buttons, and nav pills across `src/components/**` and
`src/app/**` was removed outright (not replaced with `tracking-normal` — Tailwind's own
default is already `normal`, so dropping the utility is sufficient once nothing upstream sets
a wider inherited value). `tracking-tight` on headings is a separate, unrelated tightening
effect and was left untouched everywhere. `html[lang="fa"] .tracking-widest`/`.tracking-wider`/
`.tracking-[0.3em]`/`.tracking-[0.4em]` (the old Farsi-mode tracking-reduction overrides in
`globals.css`) were removed as dead CSS in the same change, since no component carries those
classes anymore. `.lux-button-atelier:hover`'s `letter-spacing: 0.24em` widen-on-hover effect
(and the matching `letter-spacing` entries in its `transition`/`will-change` lists) was also
removed — and in the 2026-09-29 dead-CSS sweep the entire `.lux-button-atelier` rule, by then
unconsumed, was deleted outright along with 17 other dead classes and 8 orphaned
keyframes/`@property` blocks. This supersedes the "tried and reversed" note above and the
prior standing instruction not to re-attempt a reduction — that instruction was about
re-attempting a *reduction*; full removal was a distinct, later, explicit decision.

---

*This document is the single source of truth for visual and interaction decisions on this project. All contributors — human or AI — are bound by its principles.*
