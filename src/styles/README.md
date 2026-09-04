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
| Mid | `.mid` | Ocean yacht slate — deep navy field, luminous champagne gold |
| Dark | `.dark` | Architectural carbon — near-black volume, warm off-white, aged bronze |

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
> light and dark share `#1C1C1C`, while the mid theme resolves it to `#0C0F15` (the navy
> family's own deep black, alongside `--text-canvas: #EBEFF5` cool white) so the always-dark
> footer and permanently-dark media scrims stay in-family with mid's navy field instead of
> reading as a foreign carbon block. The footer is still always dark, regardless of which
> palette is active — a deliberate editorial choice, a heavy typographic base grounding the page.

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
| `border-ink-subtle` | Pre-computed 10% ink border | `rgba(28,28,28,0.10)` |
| `border-ink-mild` | Pre-computed 15% ink border | `rgba(28,28,28,0.15)` |

> **Why pre-computed borders?** `border-ink/10` uses `color-mix()` which is correct in modern browsers but may fail in variable-chain scenarios. The pre-computed variants are preferred for high-frequency opacity values.

---

#### 3. Accent (Bronze / Gold — primary brand tone)

The brand's signature material color. It shifts across themes: warm travertine bronze in light, aged bronze in dark, luminous champagne gold in mid.

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

**Only call site today:** `concierge/InquiryForm.jsx`'s server-validation error display
(see `src/components/README.md` and `src/app/README.md`'s `/api/inquiry` section). Do not
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

> The reverse mistake is just as real: never use a theme-adaptive token (`text-accent`, `border-accent`, etc.) on a `bg-foundation` surface either. `Footer.jsx` is fully static by design (see above) except its link `hover:text-accent` states used to slip through unnoticed — `text-accent` resolves to a different value per theme (bronze in light, aged bronze in dark, **luminous champagne gold tuned for a navy field** in mid), so the hover color visibly shifted between themes even though the footer's background never does. Fixed to `hover:text-canvas` (full-opacity cream, brightening from the resting `text-canvas/80`/`/40`) — every color used inside a `bg-foundation` block should be a `canvas`/`foundation` token, with no exceptions for hover/active states.

---

#### 5. Control Surfaces (Interactive UI Components)

Surfaces specific to toggles, menus, pills, and the settings bar. These require fine-tuned per-theme values that do not follow the general surface/ink logic.

| Tailwind class | CSS Variable | Meaning |
|---|---|---|
| `bg-indicator` | `--bg-indicator` | Active state pill bg — dark ink / cream / champagne gold across themes |
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

Named shadows replace arbitrary `shadow-[0_30px_100px_rgba(0,0,0,0.06)]` strings across components. `shadow-ambient` is the one theme-aware shadow — it resolves `var(--shadow-color)`, which is tuned per theme (faint in light mode, much stronger in both dark modes) — and is deliberately used for every primary photography frame (`Story`, `StudioGallery`, `showcase/ImageViewer`, `house/ChapterPieces`) precisely so product/editorial images keep a visible "lifted" depth cue in dark mode. All the other named shadows use static RGBA values and do not adapt to theme; a former `shadow-canvas-low` token existed with a flat `rgba(0,0,0,0.06)` value and was removed after it visibly flattened photography frames in dark mode — do not reintroduce a static shadow for image frames.

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

### Selection & caret — theme-adaptive micro-details
Selection paints `--color-selection` with `--text-primary` text: the authored cream `#EAE7DC` in light, translucent bronze in mid (`rgba(242,210,153,0.30)`) and dark (`rgba(203,185,167,0.32)`) — the `.mid`/`.dark` blocks override the token so the single rule stays readable everywhere. `AppShell`'s root and the `layout.js` `<body>` both carry the Tailwind `selection:bg-selection selection:text-ink` utilities (same values, same system — keep all three in agreement). The global `::selection` rule covers everything else, including status screens. `input`/`textarea` caret is `--text-bronze`. The browser-default blue selection/caret must never surface anywhere.

### Lenis base styles
`globals.css` carries the Lenis smooth-scrolling contract block (`html.lenis`/`html.lenis body` height auto, `.lenis-smooth` scroll-behavior auto, `[data-lenis-prevent]` overscroll containment, `.lenis-stopped` overflow hidden). The instance lifecycle lives in `AppShell.jsx` — see `src/components/README.md`.

### Cinematic media utilities
| Tailwind class | Effect |
|---|---|
| `lux-vignette` | `::after` radial corner-darkening overlay (transparent 55% → rgba(0,0,0,0.16)), z-index 1, `pointer-events: none` — filmic depth for full-bleed media frames. Call sites: `Hero.jsx`'s video frame, `ChapterHero`'s media frame |
| `lux-ken-burns` | 26s perpetual 1.0→1.045 scale + drift (`kenBurnsDrift`, `--couture-ease`, alternate) — still photography that breathes. Call sites: `ChapterHero`'s fallback still, `Materials.jsx`'s macro preview (it replaced hover-zoom there). Never on interactive/zoomable imagery (`ImageViewer`, lightbox, GSAP-pinned columns) |

Both are neutralised by the global `prefers-reduced-motion` block. (`Story.jsx`'s home
carousel is the one pinned-column exception that still breathes — via a bounded per-slide
Motion drift (`scale: 1 → 1.035`, linear, 7s, per slide) rather than this perpetual CSS class;
see `src/components/README.md`.)

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
| Display / Hero | Elegant serif | Large, generous tracking, slow reveal animation |
| Section headings | Refined serif | Mid-scale, strong weight contrast with subtext |
| Labels / meta | Refined sans-serif, uppercase, tracked | Small, spaced, never crowded |
| Body / supporting copy | Refined sans-serif | Generous line-height (1.7–1.8), muted color |
| UI / control labels | Sans-serif, compact | `text-muted` or `text-dim` — subordinate to content |

### Rules

- No more than two typeface families in the entire project
- No playful, experimental, or tech-aesthetic fonts
- Generous line-height (1.7–1.9 for body) — white space is editorial
- Headlines should feel slightly too large. Restraint is in the layout, not the type
- Letter-spacing on uppercase labels: 0.08–0.12em minimum
- Never justify Latin text — ragged right is the web standard (browser justification has no
  hyphenation/river control, so short paragraphs get ugly word gaps). Farsi is the exception:
  justified text is the native Persian typographic convention, so long Farsi paragraphs carry
  `rtl:text-justify` — applied uniformly across home, House, and product pages
  (scoped per element — headings, labels, and mono/uppercase micro-copy
  stay ragged; chat bubble text is justified too via `rtl:text-justify` on the
  `whitespace-pre-wrap` content div; quotes are judged per block: the hero's brand quote is
  justified via `rtl:md:text-justify` to beat its `md:text-center`, Story's italic pull-quote
  stays ragged)
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

**Deliberate exception — `showcase/ProductPanel.jsx`'s specs accordion.** The
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

**`lines` contract:** takes a single element child whose own child is a plain string — `<MaisonReveal variant="lines"><h2 …>{t("key")}</h2></MaisonReveal>`. It measures the natural line breaks after mount, lifts each visual line out of its own overflow-hidden mask, then re-renders the plain text once the last line lands — masks never persist, so a later reflow (font-scale change, resize, locale remount) can never clip. `prefers-reduced-motion` renders plain immediately. Call sites: the Advantages, Materials, and Concierge `SectionHeader` h2s.

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

The `.sunbeam-signature-glare` class applies a slow diagonal light sweep across surfaces. Use only on decorative overlay elements, never on interactive elements. The CSS default is `28s` (no delay); consumers (`Advantages`, `Story`) apply it with no inline override, so the sweep runs at the default 28s.

```jsx
<div
    className="sunbeam-signature-glare absolute top-0 left-1/4 w-[240px] h-[220%]
    bg-gradient-to-r from-transparent via-white/[0.05] to-transparent
    mix-blend-overlay pointer-events-none"
/>
```

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
`globals.css` (weights 300/400/700/800/900). The `html[lang="fa"]` overrides map
body, headings (`h1–h6`), and `.font-mono`/`code` to `"Dorsa", "Tahoma", …`
(the `Tahoma` system face is the fallback). The Google Fonts `@import` no longer
loads Vazirmatn/Amiri — both were removed when Dorsa was adopted. Do **not**
re-introduce `font-family: "Vazirmatn"`/`"Amiri"` in the Farsi rules; those
faces are no longer loaded. (`FractulAlt-*.ttf` also lives in `/public/fonts`
but is Latin-only — 0 Persian glyphs — and is not currently wired to any
selector; do not point the Farsi rules at it.)

The `@font-face` blocks are `font-display: swap`, so a first Farsi paint can flash the
`Tahoma` fallback. To kill that flash, `app/layout.js` emits three `<link rel="preload">`
lines (`Dorsa-Regular.otf` + `Dorsa-Light.otf` + `Dorsa-Black.otf` — the only weights
Farsi actually uses above the fold: 400 for body/headings, 300 for `.font-mono` labels,
900 for the `.italic` accent rule below, which the home hero's title uses) when
`initialLanguage === "fa"`. Note the 900 file is **Black, not Heavy** — both declare
`font-weight: 900` above, and the later `@font-face` declaration wins, so preloading
Heavy would double-fetch. If the Farsi weight usage ever changes, change the preload
set in the same edit. On the `force-static` routes (which bake `en`) the preload no-ops
and Dorsa loads via plain swap after the client-side locale restore.

### `.font-farsi` — opt-in Dorsa for non-heading `.font-serif` text
`html[lang="fa"] .font-farsi { font-family: "Dorsa", "Tahoma", sans-serif !important; }`
lets a specific element keep Tailwind's `.font-serif` class (Playfair Display) for layout/weight
purposes while still rendering in Dorsa under `html[lang="fa"]`. It wins over the unscoped
`.font-serif` utility because it carries `!important` and `.font-serif` does not — so pairing
`font-serif font-farsi` on the same element is safe regardless of class order. `.font-serif`
itself is deliberately **excluded** from the blanket Farsi override (unlike `.font-sans`, `h1–h6`,
and `.font-mono`) so the ZAAD wordmark — always `.font-serif` alone, never `.font-farsi` — is
never touched. **Heading tags (`h1`–`h6`) are covered automatically regardless of `.font-serif`**
(a heading is essentially always translated content, never a brand-only Latin code, so the tag
selector is safe to broaden without a per-instance `.font-latin`/`.font-farsi` judgment call) —
`.font-farsi` is only needed on non-heading elements (`span`/`p`/`div`) carrying `.font-serif`
that render translated text: e.g. card/box titles in `header/JourneyIndex.jsx`,
`header/SystemPortals.jsx`, `Materials.jsx`'s material `name`, `Blueprint.jsx`'s section `title`,
`Story.jsx`'s pull-quotes/stat labels, `header/ControlsFooter.jsx`'s `BRAND_NAME[language]` span
(the "زاد" transliteration in its edition badge — see `src/components/README.md`'s note on the
wordmark-vs-incidental-mention distinction), and `productdetailspage/LookbookPoetry.jsx`'s
large decorative "زمین" watermark `div` — all found the same way (a Farsi string rendering in
the wrong, Latin-serif face because its tag/class combination fell through every existing
override). Do **not** add it to the wordmark, or to any field that stays Latin regardless of
locale (see `.font-latin` below) — `header/SpecimenGrid.jsx`'s `item.name` looked similar but is
the latter case, not this one.

### `.font-latin` — opt-out back to Latin for permanently non-Farsi brand content
`html[lang="fa"] .font-latin { font-family: "JetBrains Mono", "Inter", monospace !important; }`
is the inverse of `.font-farsi`: some fields are Latin **in both dictionaries** — collection
`number` ("C°01"…"C°04") and `name` (the product codenames "GÁVV"/"ZIVV"/"RÁKH"/"VARR") are never
translated, by brand design (see `src/lib/i18n/README.md`). Left alone, these inherit Dorsa from
an ancestor's `.font-mono`/`.font-sans` class (or from `body` itself, since the blanket
`html[lang="fa"], html[lang="fa"] body` rule cascades to any element with no explicit
`font-family` of its own). Wrap just the Latin fragment in `<span className="font-latin">`
— not the whole parent — when it sits inside a larger element that also renders real translated
text (e.g. `{t("productArchitecturalRecord")} <span className="font-latin">{item.number}</span>`
in `productdetailspage/ProductMeta.jsx`). Elements that are Latin-only outright (e.g. `SpecimenGrid`'s
`item.number` span) can carry `.font-latin` directly instead of nesting a child span. Current call
sites: `header/SpecimenGrid.jsx`, `productdetailspage/NavBar.jsx`, `productdetailspage/ProductMeta.jsx`
(the `item.number` span only — see below), `showcase/ProductPanel.jsx`,
`shared/Lightbox.jsx` (`archiveNumber`). `showcase/CollectionTabs.jsx`'s `item.number`/`item.name`
spans carry neither class — both sit under plain `.font-serif` (no `.font-mono`/`.font-sans`
ancestor), so they fall under the same exclusion as `item.name` below and need no wrapping.
`item.name` under plain `.font-serif` (no `.font-mono`/
`.font-sans` ancestor) needs neither class — `.font-serif` is already excluded from the Farsi
override. `item.designer` mixes scripts on some collection entries (`"استودیو ZAAD"`) — this is
correctly handled by `wrapLatinRuns(item.designer, isFarsi)` in `productdetailspage/ProductMeta.jsx`,
not a CSS class (mixed-script strings need the runtime scan `wrapLatinRuns` does, not a static
`.font-latin`/`.font-farsi` pairing).

**`item.year` is no longer part of this trio.** It reads in Farsi-Indic digits in `fa.js`
(`"۲۰۲۶"`, not `"2026"`) as of the digit-uniformity pass in `src/lib/i18n/README.md` — `.font-latin`
was removed from both its render sites (`productdetailspage/ProductMeta.jsx`, `showcase/ImageViewer.jsx`)
since it would force a Latin font onto Farsi digit glyphs. `item.price` (unused by any component
today) got the same digit conversion for data consistency, should a consumer render it later.

### Heading tags force Dorsa unconditionally — even on pure-Latin or `.font-serif` content
The `html[lang="fa"] h1, h2, h3, h4, h5, h6 { font-family: "Dorsa", "Tahoma", sans-serif !important; }`
rule (documented above under `.font-farsi`) is a raw **element** selector — it does not check for
`.font-serif`, `.font-latin`, or any class at all. Two real bugs shipped from forgetting this:
`Footer.jsx`'s "ZAAD" wordmark was wrapped in `<h3>`, so despite being plain `.font-serif` (which
is otherwise excluded from the blanket override) it rendered in Dorsa anyway — fixed by changing
`<h3>` → `<p>` (identical classes), matching how `Header.jsx`'s and `house/HouseFooter.jsx`'s
wordmarks already avoid heading tags for exactly this reason. `Blueprint.jsx`'s page title
(`t("zaadBlueprint")` = "نقشه ZAAD") and `concierge/CuratorChat.jsx`'s `t("zaadDigitalCurator")` = "کیوریتور دیجیتال ZAAD" — both
real Farsi text with an embedded Latin brand token, sitting
directly inside an `<h1>`/`<h3>` — had the same problem. **Rule of thumb when adding or touching
an `h1`–`h6`:** if it's ever going to render a Latin brand token (a hardcoded "ZAAD", a collection
codename, a model badge) either directly or mixed into translated Farsi copy, either wrap the
render with `wrapBrandNames(value)` (see below — the current fix for both of the mixed-content
cases above) or — if the content is 100% Latin brand text with no real Farsi prose ever mixed
in — don't use a heading tag for it at all.

### Brand tokens always render in `font-serif` — a deliberate identity rule, not a bug fix
Wherever the literal strings **"ZAAD"**, **"Dorsa"**, **"Persol Business Solution"**, or a
collection codename (**"GÁVV"**, **"ZIVV"**, **"RÁKH"**, **"VARR"** — the exact spellings live in
each `collection[].name` entry in `src/lib/i18n/en.js`/`fa.js`; "VAAR" appearing in a few prose
strings is a pre-existing typo, not an alternate spelling, and is out of scope here) appear
anywhere in the UI, they render in the site's Playfair `font-serif`, regardless of what
font-family the surrounding text uses (`font-mono`, `font-sans`, or inherited) — an explicit
user-specified brand-identity preference, independent of the Dorsa-heading bug above (fixing that
bug does not by itself satisfy this rule, and vice versa).

**`src/lib/wrapBrandNames.js`** is the mechanism: it scans a string for any of the tokens above and
wraps each match in `<span dir="ltr" className="font-serif">` (the `dir="ltr"` also gives it the
same bidi isolation `wrapLatinRuns` provides — no need to pass `isFarsi`, and no need to combine
the two helpers on the same string). It is a no-op (returns the input unchanged) when no token
matches, so it is safe to call unconditionally on any string that *might* contain one. Real call
sites: `Footer.jsx` and `house/HouseFooter.jsx` (`footerCraft`, replacing a per-file
`.split("Persol Business Solution")` one-off), `Hero.jsx` (`estFlorence`), `Advantages.jsx`
(`ZAADCertified`), `Blueprint.jsx` (`zaadBlueprint`, replacing its earlier `wrapLatinRuns` fix —
`.font-latin` and this rule want *different* fonts for the same substring, so `wrapBrandNames` is
correct here and `wrapLatinRuns` is not), `concierge/CuratorChat.jsx` (`zaadDigitalCurator`, same
reasoning), `productdetailspage/ProductMeta.jsx` and `showcase/ProductPanel.jsx` (`item.designer`
/`selectedItem.designer`, `item.specifications.origin`, `productZAAD` — same `wrapLatinRuns`→
`wrapBrandNames` swap for the same reason).

**Direct-heading-child sites (added 2026-09-03)** — the four sites where a brand token is the
heading's own unwrapped text child (see "Heading tags force Dorsa unconditionally" above for why
these specifically need `wrapBrandNames`, not just any brand-adjacent text): `productdetailspage/ProductMeta.jsx`'s
`<h1>` (`item.name`, e.g. "GÁVV"), `showcase/ProductPanel.jsx`'s `<h3>` (`selectedItem.name`, same
field), `Advantages.jsx`'s `<h3>` (`card.title` — one card's title, "The Dorsa Experience"/"تجربه
Dorsa", contains "Dorsa" as a literal Latin token in **both** `en.js` and `fa.js`, not English-only),
and `house/HouseDiptychShell.jsx`'s internal `ColumnHeader`'s `<h3>` (`title` prop, fed by
`house/StoryValueChapter.jsx`'s `left.title = t("storyHeroTitle")` = "Growth in the Land of Dorsa" —
English-only in effect since the Farsi value transliterates to "درسا" instead).

**Why a bare (non-`!important`) `.font-serif` span is enough, even nested inside a Dorsa'd
heading**: `font-family` is an inherited CSS property — inheritance is the *lowest*-priority
source in the cascade, used only when no rule directly targets that element. A child `<span>`
carrying its own `.font-serif` class is a rule that directly targets the span, so it wins over
whatever `font-family` value cascaded down from an ancestor's `!important` rule, with no
specificity contest involved (the ancestor's `!important` only settles competition among rules
that target the *ancestor itself*). This is why `wrapBrandNames`'s span doesn't need `!important`
the way `.font-farsi`/`.font-latin` do — the whole `.font-farsi`/`.font-latin` `!important` marker
in those two is standing convention for this project, not something the code strictly requires.

**Explicit exception**: `concierge/InquiryForm.jsx`'s email input `placeholder="client@zaad.com"`
(lowercase, `font-mono` — deliberately styled like an email/code field, per explicit user request
2026-09-02) is a fake example address, not a real brand mention — don't wrap it in
`wrapBrandNames`/uppercase it back to match the brand-token casing convention.

**Deliberately left alone** (judgment calls, not oversights): `<option>` elements
(`InquiryForm.jsx`'s `florenceViewing`, `NavBar.jsx`'s `productZAADArchive` breadcrumb segment)
can't selectively style a child span in most browsers; sibling-label grids where only one entry
contains a brand token (`footerMilanZAAD`/`menuHouseOfZAAD` among plain footer/menu links,
`showcaseZAADWeight`/`productZAADWeight` among a spec grid's other labels, `zaadTowerRowScheduling`
inside a dense technical spec table) were left uniform rather than making one sibling visually
odd; and long prose paragraphs mentioning a brand token mid-sentence (`aboutSections`, `brandStory`)
are still left as-is — those are markdown-adjacent, parsed by `house/ChapterPieces.jsx`'s
`EditorialBlock` `### heading` regex split, and extending `wrapBrandNames` there needs its own
case-by-case fragility check the rest of this sweep didn't require. `Advantages.jsx`'s `card.desc`
is **not** in this exception list (a stale earlier note here wrongly grouped it with the
markdown-parsed fields above — it's actually a plain string through `wrapLatinRuns`, one of that
helper's 13 call sites, so it gets full coverage automatically; see `src/lib/wrapLatinRuns.js`'s
English-fallback note in `src/lib/README.md`). This rule was originally applied only to short
labels/headings/eyebrows/badges/footer
text/menu cards/product titles, where it's both safe to isolate and reads as brand emphasis rather
than noise. **Extended to plain-string prose by explicit user request (2026-09-02):** every other
`en.js` key containing a brand token was audited against its render site and, where it was a direct
string render (not markdown-parsed) and not one of the exceptions above, wrapped:
`Hero.jsx`'s `heroDesc` and `bespokeObjects`,
`productdetailspage/TabAppliances.jsx`'s `gaggenauIntegrationSpecifics` eyebrow, `Footer.jsx`'s
`footerHouseDir` column heading, and `house/ChapterPieces.jsx`'s `CrossLinks` `{s.teaser}` (the
single shared render site for `crossLinkAbout`/`crossLinkStoryValue`/
`crossLinkSustainabilityResponsibility`, each a one-sentence cross-link teaser used across all
three House pages).

### Farsi text is never italicized — bold (900) instead
`html[lang="fa"] .italic { font-style: normal !important; font-weight: 900 !important; }`
strips Tailwind's `.italic` utility site-wide in Farsi and replaces it with Dorsa's
heaviest weight — Persian script has no proper italic form, and rendering it italic
looks broken. This is deliberately global (targets the utility class, not individual
components) so every current and future `italic` usage is covered automatically; do
not add per-component Farsi exceptions to re-enable italic or to dial the weight back
down. Confirm `Dorsa` has a `900` weight file loaded in the `@font-face` block above
before changing this value.

### `@custom-variant dark` — `dark:` utilities key to the app themes, not the OS
`@custom-variant dark (&:where(.dark, .dark *, .mid, .mid *));` is declared immediately
after the `@import "tailwindcss"`. Every `dark:` utility therefore triggers on the
**class-driven** `.mid`/`.dark` themes (both are dark fields — navy and carbon), never on
the OS `prefers-color-scheme`. Before it existed, a phone in OS-dark mode viewing the
light theme rendered `dark:group-hover:text-white` as invisible white-on-cream tab labels
and mismatched `dark:bg-panel/5` tints. Do not remove it, and do not write `dark:`
utilities expecting OS-keyed behavior — "on a dark surface" means `.mid` or `.dark` here.

### `@import "../../node_modules/tailwindcss"`
Tailwind v4 is imported via a relative path to `node_modules`. If `globals.css` is
relocated (e.g. moved to `src/app/`), this path breaks. It currently works because the
file lives at `src/styles/`.

### `--zaad-font-scale` — app-wide text-size accessibility control
Driven by `src/hooks/useFontScale.js` (the `+`/`−` control in `header/ControlsFooter.jsx`
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
`--zaad-user-scale: 1` and `--zaad-font-scale: var(--zaad-user-scale)`. The hook writes
**`--zaad-user-scale`** (range `0.85`–`1.3`) via `document.documentElement.style.setProperty(...)`
— see `src/hooks/README.md`'s `useFontScale.js` entry for the hook contract. A companion
rule `html[lang="fa"], .farsi-mode { --zaad-font-scale: calc(var(--zaad-user-scale) * 1.05) }`
bumps the Farsi baseline by exactly one `+` step: Dorsa at Latin-parity size reads cramped,
so Farsi defaults to what English looks like after one press of `+`, while the `+`/`−`
control keeps composing on top (effective Farsi range ≈ `0.89`–`1.365`). The control's
`100%` label shows the user scale, not the effective one. **Load-bearing:** the hook must
write `--zaad-user-scale`, never `--zaad-font-scale` — writing the effective var directly
would overwrite the Farsi bump and decouple the two languages.

**Farsi line-height compensation (same block):** the ×1.05 bump also grew every line box
(all leading in this codebase is unitless ratios), which read as inflated vertical rhythm.
The same `html[lang="fa"]/.farsi-mode` rule therefore divides the whole leading system by
the same factor — `--leading-*` theme vars (`tight 1.19 / snug 1.31 / normal 1.43 /
relaxed 1.54 / loose 1.9`), the `--text-*--line-height` companions, and an inherited
`line-height: 1.43` (preflight's 1.5 ÷ 1.05) — so Farsi line boxes return to the pre-bump
pixel rhythm while keeping the larger glyphs. The Farsi heading rule uses `1.48` (was 1.55,
same ÷1.05). `leading-none` and arbitrary `leading-[N]` values are literals and stay
uncompensated (+5% in Farsi — negligible, and headings override them via the `!important`
rule anyway). **Do not "simplify" these numbers away:** they are 1:1 tied to the 1.05 bump;
change one, change both.

### Section vertical rhythm — `section-y` / `section-y-break` (2026-09-01)

Section padding is no longer per-file `py-*` values — it flows through two tokens +
two `@utility` classes defined at the top of `globals.css`:

- `--zaad-section-y: 3.5rem` (mobile 56px) / `5rem` at `≥48rem` (80px) — the standard
  section rhythm, consumed via the `section-y` class.
- `--zaad-section-y-break: 5rem` (mobile 80px) / `8rem` at `≥48rem` (128px) — the
  "act break", consumed via `section-y-break`; used **only** where the narrative pivots
  (Story's manifesto, Concierge's inquiry). Luxury rhythm = restraint + a few deliberate
  pauses, not uniform inflation.

Tuning the whole site's vertical rhythm = editing those two token blocks; nothing else.

**Revert map** (the pre-2026-09-01 generous style — swap back per file to fully restore):

| File | Now | Was |
|---|---|---|
| `Advantages.jsx:29` | `section-y` | `py-24 md:py-36` |
| `Advantages.jsx:34` | `mb-12 md:mb-16` | `mb-16 md:mb-24` |
| `Story.jsx:67` | `section-y-break` | `py-24 md:py-36` |
| `Materials.jsx:19` | `section-y` | `py-24 md:py-36` |
| `Showcase.jsx:23` | `section-y` | `py-24 md:py-36` |
| `Concierge.jsx:16` | `section-y-break` | `py-24 md:py-36` |
| `concierge/SectionHeader.jsx:8` | `mb-12 md:mb-16` | `mb-16 md:mb-24` |
| `Blueprint.jsx:53` | `section-y` | `py-24 md:py-32` |
| `house/HouseChapterShell.jsx:32` | `section-y` | `py-20 md:py-32` |
| `house/HouseChapterShell.jsx:44` | `section-y` | `py-20 md:py-24` |
| `house/HouseDiptychShell.jsx:25` | `section-y` | `py-20 md:py-32` |
| `house/ChapterPieces.jsx:74` | `section-y` | `py-20 md:py-28` |
| `house/ChapterPieces.jsx` `ChapterHero` section | `pt-24 md:pt-32` | `pt-36 md:pt-44` |
| `ProductDetailsPage.jsx:24` | `md:pt-[calc(73px+2.5rem)]` | `md:pt-[calc(73px+4rem)]` |
| `ProductDetailsPage.jsx:27` | `mb-12 md:mb-16` | `mb-16 md:mb-24` |
| `productdetailspage/LookbookPoetry.jsx:10` | *(no outer mb; card keeps its own `py-12 md:py-16`)* | `+ mb-16 md:mb-24` |

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
`header/JourneyIndex.jsx`, `header/SystemPortals.jsx`'s `PortalCard`, and the 2026-09-01
sweep) is a pure-CSS Farsi override appended to the element's own size utility:
`text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))]`
— no JS, no `isFarsi` threading, English rendering untouched. Swept spots: Hero's
`heroQuote` (12→rtl 14), `InquiryForm`'s appointment hints / `archivalSpecs` /
`studioReplyStandard` (10/10.5→rtl 12), `ProductPanel`'s `showcaseAirfreight` /
`showcaseCatalogueText` (10→rtl 12), `TabHeritage`'s `certificateOfProvenance`,
`shared/Lightbox`'s `zoomHint`, and the `footerCopyright`/`footerCraft` strips in
`Footer.jsx` + `house/HouseFooter.jsx` (10/11→rtl 12).

### Radius language — one 6px radius sitewide (2026-09-03)

Every surface on every route (showroom, House, product) speaks **one** near-sharp
radius: **6px** — not Tailwind's per-class scale. Interactive surfaces carry
explicit `rounded-md` classes — nav settings trigger (`ExpandOnHoverPill`, both
variants), the control rows in `ControlsFooter` + `HouseChrome` (tracks, segment
buttons, indicator blobs), audio toggle, tooltip, video play/pause + expand
chips, prev/next arrows, every floating badge/pill over imagery (viewer,
lightbox, studio gallery), Blueprint tag chips, and the CTAs. A single unlayered
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

---

*This document is the single source of truth for visual and interaction decisions on this project. All contributors — human or AI — are bound by its principles.*
