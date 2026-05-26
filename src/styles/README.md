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
- Architectural ateliers (Tadao Ando, Studio KO)
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
| `bg-foundation` | **Static** permanent dark base (footer only) | `#1C1C1C` |

> `bg-foundation` never adapts to theme. The footer is always dark, regardless of which palette is active. This is a deliberate editorial choice — a heavy typographic base grounding the page.

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

This is the only "warm" chromatic signal in the system. Use it with restraint. Bronze earns its presence by being rare.

---

#### 4. Canvas (Static — permanently dark contexts)

Used exclusively where the background is always dark, regardless of active theme. The footer is the primary use case.

| Tailwind class | Meaning | Value |
|---|---|---|
| `text-canvas` | Cream text on foundation/dark background | `#F4F1ED` (static) |
| `text-canvas/{n}` | Canvas at arbitrary opacity | — |
| `border-canvas/{n}` | Canvas-toned border at opacity | — |

> Canvas tokens are **not** theme-adaptive. They are calibrated specifically for `bg-foundation` contexts. Never use them on theme-adaptive surfaces.

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

Named shadows replace arbitrary `shadow-[0_30px_100px_rgba(0,0,0,0.06)]` strings across components. All shadows use static RGBA values — they do not adapt to theme.

| Tailwind class | Value | Intended use |
|---|---|---|
| `shadow-ambient` | `0 20px 50px var(--shadow-color)` | Default card/section elevation |
| `shadow-canvas-low` | `0 30px 100px rgba(0,0,0,0.06)` | Hero image, primary photography frames |
| `shadow-canvas-mid` | `0 15px 35px rgba(0,0,0,0.06)` | Toolbar, control bar, floating bars |
| `shadow-canvas-lift` | `0 20px 45px rgba(0,0,0,0.08)` | Hover lift state on cards |
| `shadow-card-sm` | `0 4px 16px rgba(0,0,0,0.07)` | Tight card shadow, small components |
| `shadow-card-md` | `0 4px 16px rgba(0,0,0,0.15)` | Mid-weight cards |
| `shadow-card-lg` | `0 20px 50px rgba(0,0,0,0.15)` | Heavy cards, modals |
| `shadow-deep` | `0 50px 110px rgba(0,0,0,0.18)` | Full-bleed slide-out panel |

---

## Part V — Placeholder Utilities

| Tailwind class | Effect |
|---|---|
| `placeholder-dim` | Placeholder text at `--text-dim` color |
| `placeholder-dim-faint` | Placeholder at 60% of `--text-dim` |

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
- Never justify text

---

## Part VII — Spacing & Layout Principles

### Core Principle

Whitespace is a luxury asset. Every pixel of empty space communicates that the brand does not need to fill every corner to justify itself.

### Layout Rules

- Use strong grid systems with consistent column gutters
- Sections breathe — minimum 6rem vertical padding on section boundaries, often 10rem+
- Asymmetric yet balanced: off-center crops, unequal column splits (e.g. 5/7 or 4/8), deliberate tension
- Each section should feel individually art directed — not templated
- Never create card grids with more than 3 columns
- Never present the collection in a uniform product grid — each piece deserves space

### Vertical Rhythm

Section transitions create cinematic pacing. The scroll should feel like turning a page in a luxury magazine — not clicking through a website. Space between sections signals a change of editorial chapter.

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

### Core Easing Curve

```css
cubic-bezier(0.16, 1, 0.3, 1);

```

This curve produces a rapid initial acceleration followed by a long, smooth deceleration — the motion signature of premium physical objects settling into place. It must not be overridden without a documented reason.

- **Global theme-switch transition duration:** 1050ms (color, border, background)
- **Interactive motion duration range:** 300ms–800ms depending on element weight
- **Reveal animation minimum duration:** 1000ms

---

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

Button label text translates vertically on hover. A second identical label in `text-accent` sits directly below, revealed by the upward translation.

- Vertical travel: exactly **50%** of the line-height container
- Duration: **1100ms** with the standard easing curve
- The clip container hides the duplicate until the transition reaches it

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

The `.sunbeam-signature-glare` class applies a slow diagonal light sweep across surfaces. Use only on decorative overlay elements, never on interactive elements.

```jsx
<div
  className="sunbeam-signature-glare absolute top-0 left-1/4 w-[240px] h-[220%]
    bg-gradient-to-r from-transparent via-white/[0.05] to-transparent
    mix-blend-overlay pointer-events-none"
  style={{ animationDuration: "26s", animationDelay: "-8s" }}
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

*This document is the single source of truth for visual and interaction decisions on this project. All contributors — human or AI — are bound by its principles.*
