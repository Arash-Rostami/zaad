# Components — Flat-Orchestrator Pattern

> **Audience:** AI agents and engineers working on this codebase  
> **Scope:** All files under `src/components/`  
> **Prerequisite reading:** `src/styles/README.md` (design tokens), `src/hooks/README.md` (state layer)

---

## Architecture: The Flat-Orchestrator Pattern

Each large component follows a two-tier structure:

```
ComponentName.jsx          ← Shell (orchestrator)
componentname/             ← Companion folder (sub-components)
  SubPiece.jsx
  AnotherPiece.jsx
  ...
```

A third tier exists for cross-cutting pieces:

```
shared/                    ← Reusable across multiple component trees
  Lightbox.jsx
  NoiseBg.jsx
```

### The Shell

The shell file is the **single point of logic**. It:

- Calls hooks (`useLanguage`, `useLightbox`, `useShowcase`, etc.)
- Derives all data needed by children (translations, collections)
- Passes state and callbacks **down as props** — never re-fetches in children
- Renders sub-components in a clean, readable JSX structure

The shell should read like an outline: glancing at it tells you the full structure of the UI without implementation noise.

### Sub-components

Sub-components are **pure presentational** pieces. They:

- Accept explicit props — no hook calls except where unavoidable
- Render one focused slice of the UI
- Are wrapped with `React.memo` when their output is fully determined by stable props

### Import convention

```js
import NavBar from "./collection/NavBar";
import CollectionTabs from "./showcase/CollectionTabs";
import SharedLightbox from "../shared/Lightbox";
```

Never use barrel files or index re-exports in companion folders — direct path imports only.

---

## Naming conventions (2026-09-06 rename pass — the law for new files)

- **Module per route**: a component lives in the folder of its route — root + `showcase/`/`header/` (showroom `/`), `collection/` (`/collection/[slug]`), `house/` (`(house)`), `glance/` (`/glance`), `ledger/` (`/ledger`), `concierge/` (`#concierge`). Cross-module pieces live in `shared/` only.
- **Folder = shell name, lowercase** (`CollectionPage.jsx` + `collection/`). No multi-word run-on folders.
- **Vocabulary registry**: one word per concept in *code identifiers* — **collection** (an item; never "product"), house/chapter, glance, ledger, concierge, Maison (brand primitives). Brand *copy* (UI strings, i18n keys) may still say specimen/piece.
- **File name = its primary export** (`LanguageProvider.jsx` exports `LanguageProvider`).

---

## Shared Components (`shared/`)

These are the only components intentionally designed to be consumed by multiple unrelated component trees.

### `shared/Lightbox.jsx`

The single cinematic lightbox implementation used by **both** `CollectionPage` and `Showcase`. Accepts a flat, explicit prop contract — no knowledge of the calling context.

```
Prop contract (required):
  isEnlarged, closeLightbox
  imageKey, imageSrc, imageAlt
  isLightboxLoading, markImageLoaded
  lightboxScale, setLightboxScale, cycleZoom, lightboxPan
  handleLightboxMouseMove, handleLightboxTouchMove
  isZoomControllerHovered, setIsZoomControllerHovered
  onPrev, onNext          ← pass null to hide nav (macro mode)
  archiveNumber, itemName
  counterLabel            ← pass null to hide (macro mode)
  footerTitle, footerPerspective, footerSubtitle, footerBadge, onCta
  t                       ← from useLanguage(), forwarded by both wrapper files

Prop contract (optional):
  noiseOverlay = false    ← both Showcase and PDP wrappers now pass true, for the same
                             grain-texture atmosphere used in header/MenuPanel.jsx
  showPanHint  = false    ← PDP passes (lightboxScale > 1)
  isRtl        = false    ← both wrappers pass isFarsi from useLanguage(), forwarded to
                             ZoomController's ExpandOnHoverPill so its horizontal-mode
                             slide-in direction matches the mirrored pill under dir="rtl"
```

The thin wrapper files in `collection/Lightbox.jsx` and `showcase/Lightbox.jsx` exist only to map their local hook state and item shape into this flat contract. They have no visual logic.

Internal `ZoomController` sub-component lives inside this file — it is not exported separately since it has no use outside the lightbox.

**Entrance choreography (staged, never instant).** On open, the chrome arrives in a staggered
score on the brand ease `[0.16, 1, 0.3, 1]` over 0.9s: top archive bar (delay 0.35) → close
button (0.5) → prev/next arrows (0.65) → footer bar (0.8, from `y: 15`). The image itself
unveils through a silk veil: `VEIL_CLIP` (`inset(10% 6% 10% 6% round 10px)`) → `OPEN_CLIP`
over 1.1s, keyed to `isLightboxLoading` so the veil opens only when the image has resolved
and replays per slide change (per-slide `AnimatePresence` exit re-collapses to the veil).
The arrows animate `x: ±12 → 0`, so Motion owns their centering via `y: "-50%"` — their
className has no `-translate-y-1/2` (a CSS transform there would fight Motion's). Zoom
scale stays at its own 0.45s snap; only the entrance/exit clipPath+opacity are choreographed.
Under `prefers-reduced-motion`: chrome uses `initial={false}` (no entrance, instant but
positioned) and the image skips the veil (open clip both ends).

**Keyboard, focus, and touch contract (self-contained — no extra props needed).** While
`isEnlarged`, the component: focuses its own close button on open and restores focus to
whatever triggered it on close; traps `Tab`/`Shift+Tab` inside itself; locks
`document.body` scroll; and listens for `Escape` (closes), `ArrowLeft`/`ArrowRight` (calls
`onPrev`/`onNext` if provided — semantic prev/next, not mirrored under RTL, since a
physical arrow key should always mean "back"/"forward" regardless of language). On touch,
a horizontal swipe past `SWIPE_THRESHOLD` (48px) on the image pane calls `onPrev`/`onNext`
the same way, but only while `lightboxScale <= 1` — swiping while zoomed in pans instead
(shares the image pane's existing `onTouchMove`, so don't add a second touch handler on
that element without reconciling with both). The top info bar hides the item name
below `sm` (`hidden sm:inline`) so it can't collide with the close button on a narrow
phone; the archive number and counter stay visible at all widths. The counter text is
wrapped in a `dir="ltr"` span so Farsi bidi can't reorder `1 OF 3` into `3 OF 1`, and
the info row itself carries no `overflow`/`max-w` clipping — an earlier
`max-w-[55vw] overflow-hidden` pair on the row clipped the counter mid-glyph on
360–430px phones; any clipping that's genuinely needed belongs to the media pane,
which has its own. `ZoomController`'s three icon-only chrome buttons (the rotating
cycle-zoom dial, the inline prev/next chevrons inside its expanded pill) carry
`aria-label`s (`t("cycleZoomLabel")`, `t("showcasePrev")`/`t("showcaseNext")` — the
same strings the main nav arrows already show as visible text) — `ZoomController`
now takes the wrapper's `t` prop for this (2026-09-07 accessibility pass); previously
these three had no accessible name at all.

**Touch zoom contract (mobile).** The ZoomController is `pointer-events-none` whenever
it is `opacity-0` — never invisibly tappable — and is forced visible on coarse pointers
via `[@media(hover:none)]:opacity-100` (plus `focus-within` for keyboard). Tapping the
image pane calls `cycleZoom()` (preset stops 1.0 → 1.8 → 3.0, from-between-stops
advances to the next stop above) — never a hardcoded intermediate scale. Two-finger
**pinch-zoom** is implemented in `useLightbox` via a native `{ passive: false }`
listener on the pane (see `src/hooks/README.md`); a multi-touch start invalidates the
swipe origin (`touchStartRef` nulled), so a pinch that settles back at scale 1 can't
fire a spurious prev/next on finger lift.

### `shared/StatusScreen.jsx`

Centered branded empty-state: eyebrow + serif title + muted copy + up to two `MaisonButton`
CTAs (primary `solid`, secondary `outline`). Pure presentational — no hook calls, callers
pass `t(...)`-resolved strings and `onPrimary`/`onSecondary` handlers as props. Used by
`app/not-found.js` and `app/error.js` (both `"use client"`, both call `useLanguage()` and
`useRouter()` themselves and pass the results down). **Not** used by `app/global-error.js`,
which must stay fully self-contained (see `src/app/README.md`) since it renders when the
root layout itself — including `LanguageProvider` — has thrown.

### `shared/Tooltip.jsx`

Custom hover/focus popover — not the native `title` attribute, which can't be themed and looks
inconsistent across browsers. **Scoped exception:** `collection/StudioGallery.jsx`'s image
caption and `collection/TabArchitecture.jsx`'s truncated spec-list entries use a plain
native `title` instead, deliberately — they reveal a full free-form sentence/spec string, and this
component's popup (`whitespace-nowrap`, uppercase, tracked mono pill) is sized for short UI labels;
forcing a long caption through it would render an oversized single-line pill running off-screen, not
a readable reveal. Don't extend `Tooltip.jsx` itself to accommodate this shape — a native `title` on
a `truncate`d element is the standard, accessible browser mechanism for exactly this case. A third
exception: `Footer.jsx`'s `footerCraft` credit line (since 2026-09-06,
an `<a href="http://www.persolbs.com/" target="_blank" rel="noopener noreferrer">`, not a plain
`<div>`) carries a static `title={"PBS - A.R.‎"}` — a fixed, non-localized attribution, not
`t()`-resolved UI copy, so there's no themed-label case to make here either (the string carries a
trailing U+200E LTR mark — without it the bidi algorithm flings the final period to the far left
when the Farsi-mode host element resolves RTL). The link's own font size is deliberately smaller
than the row's shared `text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))]`
baseline (the copyright/`©`-ledger-link side keeps that baseline) — `calc(8px*var(--zaad-font-scale))`
LTR / `calc(9px*var(--zaad-font-scale))` RTL, overriding the inherited size directly on the anchor,
per explicit user request to make the credit read as more minimal. Wraps a single trigger child in a `relative inline-flex` span and
positions an `AnimatePresence`-animated pill (`bg-panel-frost` + `backdrop-blur` + `shadow-canvas-lift`,
all theme-adaptive tokens so it reads correctly in all three color modes) above (`side="top"`,
default) or below (`side="bottom"`) it. `className` is merged onto the wrapper span, not the
tooltip pill — pass e.g. `className="flex-1"` when the trigger needs to fill a flex parent (the
wrapper span is `inline-flex` by default and won't stretch on its own). Transition is `450ms` with
the app's `[0.16, 1, 0.3, 1]` ease — intentionally unhurried, matching the brand's "nothing
snappy" pacing (see `src/styles/README.md`). Currently wired onto the language toggle, theme
toggle, and `AudioToggle` in `header/MenuControls.jsx` and `house/HouseChrome.jsx`'s
`HouseControls` — not yet rolled out app-wide; extend deliberately, one control cluster at a time,
rather than blanket-wrapping every button. `HouseControls` is `export`ed (added 2026-09-04) so
`ledger/LedgerHeader.jsx` can reuse it directly — a plain named import, not a barrel — rather than
duplicating the language/theme/font-scale/audio cluster a second time.

**Touch contract.** On coarse pointers the tooltip is tap-driven, not hover-driven: the wrapper
toggles visibility on `pointerdown` (`pointerType === "touch"` only), and while visible a
document-level bundle closes it — outside `pointerdown` (guarded by a `contains()` check on the
wrapper, so re-tapping the trigger toggles instead of double-closing), `pointercancel`,
`contextmenu` (Android long-press), and `scroll` (capture, so any scrollable region dismisses it).
The `mouseenter`/`mouseleave` pair is attached only when the pointer is hover-capable
(`matchMedia("(hover: hover) and (pointer: fine)")` in a mount-only effect — the same idiom as
`shared/ExpandOnHoverPill.jsx`): iOS fires a synthetic `mouseenter` on every tap, which would
otherwise re-open a tooltip the tap just closed. `onFocus` opens only when the target matches
`:focus-visible` — keyboard focus behaves exactly as before, but pointer/tap focus (Android
focuses buttons on tap) can no longer re-pop the pill after the toggle closed it. `Escape`
bubbling through the wrapper closes it, returns focus to the wrapper's first focusable child,
and **consumes the event** (`nativeEvent.stopImmediatePropagation()`, not `stopPropagation` —
Next's App Router hydrates into `document`, so React's delegated keydown listener and any
dialog's native `document`-level Escape listener sit on the *same node*, where only the
immediate variant suppresses the later-registered sibling listener) — layering rule: a
visible tooltip dismisses first, and only the next press reaches an enclosing dialog's own
Escape handler (the menu in `Header.jsx`, `ExpandOnHoverPill`'s dropdown close). Don't
downgrade to plain stopPropagation or one press closes two layers at once.
The pill itself is `pointer-events-none`, so it never swallows the tap it's informing.

### `shared/AudioToggle.jsx`

Pure presentational mute/unmute icon button (`Volume2`/`VolumeX` from `lucide-react`) for the
ambient background track. Takes `isMuted`, `onToggle`, `label` (used as both the visible
`aria-label` and, by callers, the `Tooltip` label) as props — no hook calls of its own; state comes
from `useAmbientAudio()` (see `src/hooks/README.md`) at the call site. Used by
`header/MenuControls.jsx` and `house/HouseChrome.jsx`. **The icon turns the site's gold accent
`#C5A059`** while unmuted/playing (2026-09-05, `isMuted ? "text-muted/70 hover:text-headline" :
"text-[#C5A059] hover:text-[#C5A059]/80"`) — a visible "it's on" state, since a plain
`Volume2`/`VolumeX` swap alone was easy to miss at this icon size; muted keeps the original
neutral treatment. Shared by both call sites, so the gold state applies on the showroom header
and the House chrome equally.

### `shared/ExpandOnHoverPill.jsx`

Reusable "collapsed icon → expands on hover" shell, extracted from `shared/Lightbox.jsx`'s
`ZoomController`, then generalized to also drive a control cluster. Has **two distinct reveal
modes** — picking the right one matters, see below.

**Current call sites: `house/HouseChrome.jsx` (dropdown mode) and `shared/Lightbox.jsx`'s
`ZoomController` (horizontal mode).** `header/MenuControls.jsx` (the showroom's full slide-out
menu, shared by the home page and product-detail pages) used to wrap its language/audio/theme
cluster in this component too, but that hover-to-expand behavior was removed deliberately — the
cluster now renders as a plain always-visible row (no trigger, no collapse). The hover-expand
affordance is reserved for chrome that sits directly in a *persistent* top header (House pages'
`HouseChrome`); a control cluster hidden inside an already-open full-screen menu overlay doesn't
need a second layer of hover-to-reveal. Note that the horizontal-mode pill has **no tap-open
affordance** on touch devices by design (hover handlers are gated off, and pill mode has no click
toggle) — on phones the ZoomController's preset row is reached through the pane-tap `cycleZoom()`
and the pane's side arrows instead, which cover the same functions.

**Shared props:**
- `isExpanded` + `onHoverChange` — controlled; the caller owns the hover state (`ZoomController`
  also uses its own copy of this state to drive icon rotation independently).
- `trigger` — always-visible element (e.g. an icon).
- `children` — revealed content; only mounted (via `AnimatePresence`) while `isExpanded`, so it
  never receives events or occupies layout while collapsed.
- `className` — merged onto the trigger/pill.
- `rtl` (bool, default `false`, **horizontal mode only**) — flips the content's slide-in direction
  (`x: 15` → `x: -15`). Framer Motion `x` offsets are physical pixels, not logical, so without this
  the revealed content visibly slides in from the wrong side once the pill's DOM order is mirrored
  under `dir="rtl"`.

**Mode 1 — horizontal grow (`dropdown` omitted/`false`).** The pill animates its actual `width` via
Framer Motion's `layout` prop (auto-measuring the real rendered content — never a hardcoded
`collapsedWidth`/`expandedWidth` pair; content width varies by language and a fixed pixel target
would clip or leave dead space). Use **only** when the pill already lives in its own `position:
absolute` container with no flex siblings that could be disturbed by it growing in place —
`ZoomController` is the one current user, inside the lightbox's absolutely-positioned overlay.
**Do not use this mode next to normal-flow siblings** (nav links, other flex children): an earlier
version tried to patch this with a `reservedWidth`/`reservedHeight` prop that reserved the
fully-expanded footprint permanently — that traded "siblings shift" for "a large permanent dead
gap next to the collapsed icon, with no responsive fallback since it's a raw pixel number, causing
likely mobile overflow." That approach was abandoned; the prop still exists on the component for
any future use case that's genuinely absolute-positioned-with-siblings, but neither current header
call site uses it anymore.

**Mode 2 — dropdown (`dropdown` prop, `true`).** The trigger stays in normal flow at its own small
natural size (no reserved space of any kind); `children` render as a `position: absolute` panel
below the trigger (`top-full end-0 mt-2` — `end-0` is Tailwind's logical `inset-inline-end`, so it
auto-respects `dir` with no `rtl:` variant needed) that overlays adjacent content rather than
pushing it. Use `panelClassName` for the panel's own background/border/shadow/padding (kept
separate from `className`, which styles only the collapsed trigger). This is the mode
`house/HouseChrome.jsx` uses for its language + `AudioToggle` + font-scale + theme toggle cluster
(behind a single `SlidersHorizontal` trigger) — it's the fix for the sibling-shift/dead-space
problem above, and should be the default choice for any future expand-on-hover control that sits
among other flex siblings. The trigger renders as a real `<button>` with an `onClick` toggle
(`onHoverChange(!isExpanded)`). The `onMouseEnter`/`onMouseLeave` pair is attached **only when
the pointer is hover-capable** (`matchMedia("(hover: hover) and (pointer: fine)")`, established
in a mount-only effect — never during render, so SSR/first paint match) — otherwise the handlers
are `undefined`. That gating is what makes the control usable on touch: a tap's synthetic
`mouseenter` hits a no-op handler instead of pre-setting expanded, so the click toggle opens the
panel and it stays open (without it, the synthetic enter + click toggle cancelled each other and
the panel could never open on phones). While a dropdown is open it also closes on outside-tap
(`pointerdown` outside the wrapper's ref) and on `Escape`; the opening tap can't self-close
because the listener attaches only after the open state lands. On hover-capable pointers the
hover flows behave exactly as before.

Also relevant re: `scaleX` — earlier versions of this component (and, further back, an uncommitted
regression in `ZoomController` itself) used `scaleX` to fake the collapse. Don't: `scaleX` is a
transform on the whole subtree, so every child (including a round trigger button) gets horizontally
squashed into an ellipse while collapsed/mid-transition. Both modes above use real layout changes
(`layout`-driven `width`, or mount/unmount) instead, which don't have this problem.

### `shared/MotionRoot.jsx`

Two-line client wrapper: `<MotionConfig reducedMotion="user">{children}</MotionConfig>`. Mounted
once by `app/layout.js` inside `LanguageProvider` (added 2026-09-03) so **every** route — home,
House, product — gets reduced-motion-aware Motion behavior; before it, only `AppShell.jsx` (home)
and `ScrollButton.jsx`'s self-wrap provided a `MotionConfig`, leaving the House routes and
`collection/[slug]` uncovered. The layout itself stays a server component — it passes server
children through this client boundary as props (the same pattern as `LanguageProvider`).
`AppShell.jsx`'s and `ScrollButton.jsx`'s own `MotionConfig`s now nest inside it (innermost wins,
identical setting — no behavioral change, kept as local guarantees).

### `shared/ScrollButton.jsx`

Floating "smart" scroll shortcut — a single circular control, `fixed bottom-6 sm:bottom-8
end-6 sm:end-8 z-[25]` (below the header's `z-50` and the menu's backdrop/panel `z-30`/
`z-40` so it's correctly covered when either is open; below the Lightbox's `z-[120]` for
the same reason). Self-contained like `Tooltip`/`Lightbox` — calls `useScrollButton()`
(see `src/hooks/README.md`) and `useLanguage()` itself; no props. Hidden until the page
has scrolled past a threshold, then shows `ArrowDown` (scrolls toward the bottom) or
`ArrowUp` (scrolls toward the top) depending on scroll position, cross-fading the icon on
direction change (`AnimatePresence mode="wait"`). Wrapped in its own `<MotionConfig
reducedMotion="user">` rather than relying on an ancestor providing one — historically
`AppShell.jsx` wrapped in `MotionConfig` but `collection/[slug]/CollectionPageClient.jsx` (the
other call site) did not, so the component guaranteed `prefers-reduced-motion` was
respected regardless of where it's mounted. Since 2026-09-03 `app/layout.js` wraps all
routes in `shared/MotionRoot.jsx` (a two-line client `<MotionConfig reducedMotion="user">`
inside `LanguageProvider`), making this self-wrap redundant — kept deliberately as a
harmless guarantee for any future call site outside the provider tree. Wrapped in `shared/Tooltip.jsx` for the same
hover-label affordance as the header's language/theme/audio controls. Mounted in
`AppShell.jsx`, `collection/[slug]/CollectionPageClient.jsx`, and `(house)/layout.js`
(all three routes now share this control).

### `shared/NoiseBg.jsx`

Memoised SVG grain texture overlay. Used in:
- `header/MenuPanel.jsx` (menu panel atmosphere)
- `shared/Lightbox.jsx` (when `noiseOverlay={true}`)
- hover-only on card surfaces, via the `revealOnHover` prop: `Advantages.jsx`'s cards,
  `house/ChapterPieces.jsx`'s `CrossLinks` cards, `collection/TabAppliances.jsx`'s
  appliance cards, and the menu's nav item cards (`header/SystemPortals.jsx`'s `PortalCard`,
  `header/JourneyIndex.jsx`, `header/SpecimenGrid.jsx`) — the texture fades in over 700ms
  on `group-hover`. The hover variant is a single layer (blend and opacity on the same
  element, so `--noise-blend` stays live throughout the fade — a wrapping opacity gate
  would isolate the blend until it hits 1). Consuming cards must carry `group` +
  `overflow-hidden`, and their content must be `relative z-10` — the grain is an absolute
  layer, so unpositioned content paints beneath it; the theme-tuned
  `--noise-opacity`/`--noise-blend` keep hover strength identical to the menu panel's

Accepts a `filterId` prop (default: `"noiseBg"`) to avoid SVG filter ID collisions when multiple instances appear on the same page. Always pass a unique string per call site — card grids index it per item (`advantageNoise-{id}`, `crossLinkNoise-{i}`, `applianceNoise-{idx}`).

### `shared/SocialLinks.jsx` (added 2026-09-04)

Icon-only Instagram/LinkedIn/Telegram/WhatsApp row, mapped from the shared
`lib/socialLinks.js` config (`SOCIAL_LINKS`) so `Footer.jsx` renders the identical four
links from one source instead of duplicating them. Takes one
optional `className` merged onto its root `flex` — `Footer.jsx` passes none, default
start-aligned under its "Connect With Us" label (Tailwind's `justify-*` are
logical/writing-mode-aware unlike `text-align`, so a right-aligned call site would need
no `rtl:` companion). Carries `rounded-md` — the same
6px "Radius language" (`src/styles/README.md`) every other icon-only utility control in
this codebase uses, `shared/AudioToggle.jsx` included; matters here because it sets the
corner shape of the `focus-visible` outline ring, not just a visible surface. **The footer is a
permanently `bg-foundation` surface** (see `src/styles/README.md`'s Canvas family-locking rule),
so the resting icon color is the `canvas` token (`text-canvas/50`) and the focus ring is
`outline-canvas` — but the **hover** color is a deliberate `hover:text-accent` exception (added
2026-09-04, by explicit user request), not an oversight of the family-locking rule. This is
different from the specific bug that rule documents (`Footer.jsx`'s plain-text nav links used to
hover to `text-accent` unnoticed, which read as a jarring hue-shift-per-theme on body copy that
was otherwise theme-invisible at rest) — these are brand-mark-adjacent icons, closer in kind to
the static `text-accent` already used on `Footer.jsx`'s "ZAAD" wordmark
in the same permanently-dark footer, just triggered on hover instead of shown at rest. Each
icon is wrapped in `shared/Tooltip.jsx` (`label={t(labelKey)}` — the same string as the `aria-label`,
so the visible-on-hover/focus tooltip and the screen-reader label always agree, localized in both
`en.js`/`fa.js`) — the tooltip's own `bg-panel-frost`/`text-ink` chip floats above the trigger with
its own opaque surface, so it is unaffected by (and exempt from) the footer's canvas-only rule,
the same as every other `Tooltip` consumer regardless of what background it's anchored to. Each
link is a real external anchor (`target="_blank" rel="noopener noreferrer"`) with an `aria-label`
from `t(labelKey)` — icon-only links have no visible text of their own, so the label is
load-bearing for screen readers, not decorative. See `src/lib/README.md`'s
`socialLinks.js` entry for the still-placeholder `href` values that need replacing with
the real handles before this ships.

### Smooth scrolling — Lenis (`hooks/useLenisScroll.js`)

Inertial wheel smoothing, extracted into `hooks/useLenisScroll.js` (see
`src/hooks/README.md`) so it isn't duplicated per route: dynamically imported
(`import("lenis")` — stays out of the critical bundle), `duration: 1.35` with an expo-out
easing, `smoothWheel: true`, skipped entirely under `prefers-reduced-motion` (native
scrolling, and `ScrollService` never gets a registered instance, so its RAF fallback runs).
The instance is driven by `gsap.ticker` (one RAF for the whole app) and synced with
`lenis.on("scroll", ScrollTrigger.update)` so the GSAP pins/scrubs (`Hero`/`Vision`/`ChapterHero`)
stay accurate. Cleanup restores GSAP's default `lagSmoothing(500, 33)` and destroys the
instance — callers may remount (`AppShell` on every locale switch via `key={language}`),
so init/destroy must stay symmetrical. `ScrollService` receives the instance via
`registerSmoothScroll`/`unregisterSmoothScroll` and delegates its three `animate*`
exports to it (see `src/services/README.md`).

**Call sites:** `AppShell.jsx` (calls the hook directly), `house/HouseSmoothScroll.jsx`
(a `"use client"` leaf that calls the hook and renders `null`, mounted first by the
server-component `app/(house)/layout.js` so the House routes stay smooth-scrolled without
making the layout itself a client component),
`collection/[slug]/CollectionPageClient.jsx` (calls the hook directly — that route is
already `"use client"`), and `ledger/Ledger.jsx` (calls the hook directly, unconditionally,
regardless of the gate/list/empty branch it's rendering — one instance for the whole
`/ledger` route, same as every other caller).

**`HouseSmoothScroll.jsx` also resets scroll-to-top on route change** (`usePathname()` +
`useEffect(() => animateScrollToTop(900), [pathname])`) — `app/(house)/layout.js` is a
shared layout across `/about`/`/story`/`/sustainability`, so it never remounts between
those three routes, and neither does the Lenis instance it owns; without this, clicking a
`CrossLinks` card (or any other House-to-House link) kept the previous page's scroll depth
instead of landing at the top. `animateScrollToTop` already no-ops at `scrollY === 0`, so
this is a no-op on first load and on same-page interactions.

**Inner scrollers must opt out** with `data-lenis-prevent` or Lenis hijacks their wheel
input: `concierge/CuratorChat.jsx`'s message list, `header/MenuPanel.jsx`'s inner panel
column, `collection/SpecsTabs.jsx`'s tab strip, and `glance/GlancePage.jsx`'s sticky mobile
chapter-chip rail (`overflow-x-auto`) — these four are the app's
only inner scroll containers; a new `overflow-*-auto` element needs the attribute too.
**Scroll-locked overlays need it on their root** even though they don't scroll
themselves: a `body overflow:hidden` lock stops native wheel but NOT Lenis's
programmatic `window.scrollTo` — so `shared/Lightbox.jsx`'s overlay root and
`header/MenuPanel.jsx`'s dialog root both carry it, or the page visibly scrolls behind
the open overlay. Lenis's base
contract styles live in `globals.css` (`html.lenis` height rules, `.lenis-smooth`
scroll-behavior, `.lenis-stopped` overflow).

---

## Asset Registry (`public/video/`, `public/audio/`)

Naming grammar (2026-09-05 reorganization, type-first): `{role}-{id}[-{variant}].{ext}`,
lowercase-kebab, ASCII, no numerics-only names. Every video's poster is the identical stem
with `.jpg` (its own ffmpeg-extracted first frame, never an unrelated stock image). One
canonical copy per asset — a new asset has exactly one obvious home by folder role, not by
which component happens to use it first.

| Asset class | Path convention | Consumer(s) |
| :--- | :--- | :--- |
| Hero rotation | `public/video/hero/hero-0N.{mp4,jpg}` (N = 01–04) | `Hero.jsx` |
| House chapter hero | `public/video/house/chapter-{gavv,zivv,rakh,vaar}.{mp4,jpg}` | `house/ChapterPieces.jsx` (`ChapterHero`'s `CHAPTER_HERO_VIDEOS`) |
| 360° spin | `public/video/spin/spin-{id}-360.{mp4,jpg}` (`id` = collection codename) | `showcase/ImageViewer.jsx`, `collection/StudioGallery.jsx` |
| Story gallery | `public/video/story/story-{hood,oven,cupboard,pan,inbuilt,light}.{mp4,jpg}` | `Vision.jsx` |
| Material preview | `public/video/material/{eucalyptus,stone,leather}.{mp4,jpg}` — the earlier **portrait** cuts are parked (not deleted) in `public/video/material/fallback/` for future use | `Materials.jsx` |
| Ambient audio | `public/audio/ambient-loop.m4a` | `hooks/useAmbientAudio.js` |
| Collection plates | `public/image/{id}/{id}-NN.jpg` — `id`-derived, **not** part of this reorganization, deliberately unchanged | `lib/collectionImages.js`'s `resolveCollectionImages()` (see `src/lib/README.md`) |
| Home carousel stills | `public/image/home/*` — feeds the dormant, commented-out `Vision.jsx` image carousel (see below), not currently rendered | `lib/collectionImages.js`'s `resolveHomeUtensilImages()` |

**Deliberately out of scope:** `public/image/{collection}/` plates (the `id`-derived pipeline
above — already correct) and `public/showcase/` (the FlipHTML5 lookbook export — a different
asset family entirely, not a component-consumed media path).

Every path above is a **path-prefix change only** — no logic edits, no URL/SEO surface touched
(none of these are `generateStaticParams`-derived), no coupling to the `image/{id}/` pipeline.
If you add a new autoplaying/looping media asset anywhere in `src/components/`, give it a role
folder here rather than dropping it loose in `public/video/` or `public/audio/`.

---

## Component Map

### `Hero.jsx`

No companion folder — small enough to stay a single file. Right column is an immersive,
full-bleed video panel (not an `<img>`): four landscape clips (`public/video/hero/hero-01.mp4`…`hero-04.mp4`)
cycle in a loop, one at a time, crossfading via `opacity`+`transform`(`scale`)+`filter`(`blur`) — the
same focus-pull recipe as `MaisonReveal`'s `lens-focus` variant (see `src/styles/README.md` Part
VIII), so the incoming clip settles into place rather than flatly fading in. Always `opacity`/`transform`
/`filter`, never `display`/unmount of a *rendered* clip, so whatever is mounted stays decoded and
ready — cheap once loaded, avoids a black flash at the cut. `playbackRate`
is pinned to `0.75` for the whole cycle. Since the 2026-09-06 media pass the reel also mounts
**progressively** (an extension of the old preload staggering): only the active and next-up
`<video>` exist in the DOM at first paint (`mountedCount` state, starts at 2, grows via an effect
on `activeVideo` — `Math.min(4, Math.max(count, activeVideo + 2))`, never shrinks — so the
crossfade always has both clips mounted and the set only grows to four after the visitor has
actually watched one full loop), and the next-up clip's preload is staged — `preload="metadata"`
for its first 3s, flipped to `auto` by the `nextEager` state (reset per rotation) — so first paint
streams **one** clip, not two.

**Layout contract:** the right column's height is **not** hardcoded — it's driven by CSS Grid's
default `align-items: stretch` on the parent `grid grid-cols-1 lg:grid-cols-2 lg:items-stretch`,
which stretches the video cell — since the 2026-09-03 scroll pass that stretched grid item is a
plain wrapper `div` (carrying the GSAP scrub ref, see below), and the `motion.div` video panel
inside fills it via `lg:h-full` (the panel's own children are all `absolute inset-0`, contributing
zero intrinsic height) — to exactly match the left text column's natural content height. This
is why the left column carries no vertical padding of its own — padding there would inflate the
row height and throw off the "video top = eyebrow top, video bottom = buttons bottom" alignment.
The grid itself is deliberately **not** wrapped in the site's usual `max-w-7xl` container, so the
video column is a true full-bleed 50% of the viewport, not 50% of the centered content column —
a one-off exception to this app's normal centered-grid convention, intentional for this hero only.

**Scroll-away duet (2026-09-03).** A second GSAP effect in this file (an extension of Hero's
existing authorized GSAP spot, not a new consumer — `ScrollTrigger` is now imported and registered
guarded, same idiom as the other three) mirrors `ChapterHero`'s scrub: under `gsap.matchMedia()`
`(min-width: 1024px)`, the text column scrubs `yPercent: 0 → -8` with `opacity: 1 → 0.25` while
the video wrapper lags `yPercent: 0 → 10` (both `scrub: 0.85`, trigger `sectionRef` on the root
`<section>`, `top top` → `bottom top`, `invalidateOnRefresh`); the whole effect bails under
`prefers-reduced-motion` and cleanup kills both tweens. The wrapper div exists so GSAP never
writes `transform` on the Motion-animated panel itself — same "outer column owns the GSAP
transform" idiom as `ChapterHero`'s `mediaColRef`.

**Mobile order:** `order-1 lg:order-2` (video) / `order-2 lg:order-1` (text) flips the visual stack
below `lg` so the video renders first, immediately under the fixed header. The section's own
top padding is responsive for the same reason — `pt-[61px] sm:pt-[73px] lg:pt-32` — matching
`Header.jsx`'s actual rendered height at each breakpoint (`py-3.5`+`h-8`+border ≈ 61px below `sm`,
`py-4`+`h-10`+border ≈ 73px at `sm` and up) so the video sits flush with no gap on mobile, while
`lg:pt-32` keeps the original generous breathing room once the layout goes two-column.

**This 61px/73px header-height match is a shared constant, not a Hero-only value.**
`CollectionPage.jsx`'s root wrapper (the `/collection/[slug]` page shell) uses the same
`61px`/`73px` figures in its own `pt-[calc(...)]` top padding, for the same reason — its content
sits under the same fixed `Header`. Its previous flat `py-10 md:py-16` never accounted for the
fixed header at all and visibly overlapped `NavBar`/product content on mobile and tablet widths;
fixed by decomposing into `pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)]`
(header clearance + breathing room; the additive was set to 3rem in the 2026-09-05 rhythm
standardization pass — see `src/styles/README.md`'s section-rhythm section; the redundant
`md:` duplicate of the `sm:` rule was dropped) and a separate `pb-14 md:pb-20` (56px mobile /
80px desktop exit — the standard section-y bottom cadence). If `Header.jsx`'s rendered height
ever changes, update both this file and `CollectionPage.jsx`.

**Scrim + caption tokens:** the bottom gradient (`bg-gradient-to-t from-foundation/70 via-foundation/15
to-transparent`) and the caption text (`text-canvas`) deliberately use the **static** `foundation`/`canvas`
token pair, not the theme-adaptive `ink`/`panel` tokens — `ink` inverts to near-white in the dark/mid
themes, which would flip a legibility scrim into a white wash. `foundation`/`canvas` are calibrated
specifically for "permanently dark surface" contexts (see `src/styles/README.md`) and stay correct
across all three palettes.

**Accessibility:** `prefers-reduced-motion` is checked once on mount; if set, the cycle never
autoplays (the first frame just sits static — no forced pause/resume juggling). A manual play/pause
icon button and a row of four progress dashes (jump directly to any clip, current one filled via
`scale-x-100`/`scale-x-0` on an inner bar — a `transform`, not an animated `width` — with
`origin-left rtl:origin-right` so the fill direction is correct in Farsi) sit bottom-start of the
panel, giving users control over the auto-cycling per WCAG's pause/stop/hide expectation for
auto-updating content. The raw `<video>` elements themselves stay `aria-hidden` (decorative,
muted, no captions); the interactive controls are not.

`Hero`'s five state vars (`activeVideo`, `stageReady`, `isPlaying`, `mountedCount`, `nextEager`)
and six effects (reduced-motion check on mount, the loader-gated entrance effect that sets
`stageReady` and runs the GSAP badge→title→desc→CTA timeline, `currentTime`/pause management keyed
on `activeVideo`, play/pause keyed on `[activeVideo, isPlaying]`, eager-mount bookkeeping, and the
lg-gated scroll-away scrub — see the Scroll-away duet note above) live directly in the shell — see
`src/hooks/README.md`'s "no `useState`/`useEffect` in components" rule; this is treated as within the
documented "trivial local UI toggle" exception rather than extracted to a hook, since it's a single
self-contained media-player concern with no cross-component reuse. (`stageReady` additionally gates
the video wrapper's scale/fade entrance — same `zaad:loaderComplete` contract as the timeline.)

### `house/ChapterPieces.jsx` — `ChapterHero`'s randomized video overlay

`ChapterHero` (used by both `HouseChapterShell` and `HouseDiptychShell`, so by all three House
pages — `/about`, `/story`, `/sustainability`) layers a looping collection video over its static
`heroImage` poster. The pool, `CHAPTER_HERO_VIDEOS` (`chapter-gavv.mp4`/`chapter-zivv.mp4`/`chapter-rakh.mp4`/`chapter-vaar.mp4`,
the four collection codenames — see `src/lib/i18n/README.md`), is a single shared constant at the
top of the file — the three page components (`AboutChapter`, `StoryValueChapter`,
`SustainabilityResponsibilityChapter`) pass no video prop and need no changes; the randomization
lives entirely in `ChapterHero`.

**Hydration-safe randomness:** these House routes are server-rendered (`force-dynamic` since
2026-09-07 — see the project's Load-bearing Contracts; this constraint applies regardless of
static vs. dynamic rendering, since it's about server/client output parity, not caching).
Picking `Math.random()` during render would diverge between the server-rendered HTML and
the client's first paint. `activeVideo` starts `null` (so SSR and first client paint both render
just the `<img>` poster, identical output) and is only rolled inside a `useEffect` — the
same pattern this project already uses for the `initialLanguage` static-route restore. Since the
2026-09-06 media pass that effect is gated on `hooks/useDeferredMedia.js` in `mode: "idle"`
(~1.5s): the hero paints the (now `priority`-loaded, above-fold LCP) `heroImage` first and the
random chapter clip only mounts and streams once the page is idle. If
`prefers-reduced-motion` is set, the effect returns early and `activeVideo` stays `null` — the
poster stays static, matching `Hero.jsx`'s reduced-motion behavior.

**`withVideo={false}` opt-out (2026-09-06):** `ChapterHero` takes an optional `withVideo`
(default `true`) prop; `false` skips the video-pick effect entirely so the `priority`
poster `<Image>` is the permanent hero media — zero clip bytes, no play/pause chip.
`/glance` passes it (user request: the lookbook's one clip wasn't worth ~2.4MB on a
text-led page); the three House routes don't and keep their video. The house page
components pass no video prop and need no changes; the randomization lives in
`ChapterHero`, gated by `withVideo`.

**Poster → video handoff:** once `activeVideo` is picked, the `<img>` is swapped for a single
`<video preload="metadata" poster={activeVideo.replace(".mp4", ".jpg")}>` — the clip's own exact
first frame (the same `src.replace(".mp4", ".jpg")` recipe as `Hero.jsx`'s posters), so the
poster → decoded-video transition is frame-identical, and the element carries no eager
full-clip prefetch hint — rather than layering `<video>` over `<img>` and gating visibility on a
JS `onCanPlay` event. The browser
shows the `poster` frame immediately and replaces it with real video frames the moment they're
decoded, natively, with no extra JS wait-gate stacked on top of network latency (an earlier version
did gate on `onCanPlay` + a 1400ms fade; that double-delay was reported live as "the first shot is
still the placeholder image" and was removed). The entrance dissolve — `motion.video`'s
`initial`/`animate` opacity+scale+blur, the same `lens-focus` recipe as `Hero.jsx`'s crossfade (see
above) — now fires on **mount**, not on load-completion, so it never adds to perceived load time. A
play/pause chip sits `top-6 end-6` (not `bottom-start` like `Hero`, since `heroBadge` already
occupies the bottom of this panel) using the same static `bg-foundation/40`/`text-canvas` token pair
as `Hero`'s controls, for the same reason: legible over arbitrary photo/video content regardless of
active theme. Reuses `Hero.jsx`'s `heroPauseVideo`/`heroPlayVideo` i18n keys — no new translation
strings.

`ChapterHero`'s two state vars (`activeVideo`, `isPlaying`) and three effects (the idle-gated
random pick via `useDeferredMedia`, the mount-only GSAP scrub setup, and
`playbackRate`/play-pause keyed on `[activeVideo, isPlaying]`) fall under the same
`src/hooks/README.md` "trivial local UI toggle" exception as `Hero`'s above — a single
self-contained media-player concern with no cross-component reuse.

`chapter-gavv.mp4` was re-encoded (2026-09-01, same resolution/duration, bitrate matched to its
`CHAPTER_HERO_VIDEOS` siblings) from ~11MB down to ~2.4MB — it was a real outlier in an
autoplaying rotation on SEO-facing static pages; now in line with its three siblings.

`scrollToEditorial` calls `animateScrollTo(scrollTargetId)` (`@/services/ScrollService`) rather than
a raw `window.scrollTo` — this makes the hero's scroll-down button/link cooperate with Lenis (see
`AppShell.jsx`'s smooth-scroll section above) instead of fighting its inertial `raf` with a
competing native scroll.

**A scoped GSAP usage** (originally authorized as an explicit fourth spot alongside `Hero.jsx`,
`Vision.jsx`, and `Blueprint.jsx`; `Blueprint.jsx` and its pinned nav column were removed
2026-09-06, so GSAP is back down to three spots — `Hero.jsx`, `Vision.jsx`, `ChapterHero` — see
CLAUDE.md): `ChapterHero`
runs a scrubbed parallax, not a pin, on its media column. Three refs — `sectionRef` on the hero's root
`<section>`, `mediaColRef` on the **outer** `lg:col-span-6` media column `div` (never the inner
`motion.video`-wrapping `motion.div`, which already owns `transform` via Motion's `initial`/
`animate` scale — GSAP writing `yPercent` to the same node would fight Motion for the `transform`
style). A third `useEffect` (mount-only, empty deps) mirrors `Vision.jsx`'s guarded-registration and
`gsap.matchMedia()` idiom exactly: bails under `prefers-reduced-motion`, gates the tween behind
`(min-width: 1024px)`, and `gsap.fromTo`s `mediaColRef.current` from `yPercent: 0` to `yPercent: 12`
with `scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.85,
invalidateOnRefresh: true }`. A second tween in the same `matchMedia` block (2026-09-03) releases
the text column: `textColRef.current` — a third ref, on the `lg:col-span-6` text column div, whose
children own their own Motion entrance tweens, so GSAP scrubs the parent only — animates
`yPercent: 0 → -8` with `opacity: 1 → 0.25` on the same trigger, so the copy drifts up and quiets
while the media lags down. A scrub, not a pin, was chosen deliberately — this hero's two columns
are roughly equal height (no meaningful pin distance) and the section clips overflow.

### `collection/StudioGallery.jsx` — per-item 360° spin tile

Unlike `Hero.jsx`'s generic atmosphere clips and `ChapterHero`'s randomized collection clips, this
video is **deterministic and product-identifying by design** — the whole point is to show the exact
piece the visitor is already looking at. `spin360Src` is derived directly from
`` `/video/spin/spin-${item.id}-360.mp4` `` (no shared pool, no randomness) — `item.id` already matches
the four collection codenames (`gavv`/`zivv`/`rakh`/`vaar`, see `src/lib/i18n/README.md`) 1:1 with the
`spin-{id}-360` video filenames on disk.

The main pane is a binary switch (`show360` state) between the existing image `AnimatePresence`
carousel and the video — never layered together, since a static image and a looping video showing
simultaneously would compete for attention (see `src/styles/README.md`'s "one motion at a time").
The thumbnail strip is `grid-cols-2 sm:grid-cols-4` (2×2 on narrow phones, single row of 4 at `sm`
and up) — every item has exactly 3 images, so the added "360° View" tile fills the row evenly, not
as a ragged extra, at both breakpoints. That 4th tile is the same
`item.images[0]?.url` photo dimmed under a `bg-foundation/70` scrim (icon + label on top) rather
than a flat `bg-foundation` block — a solid-color tile read as an empty/broken square next to the
three real image thumbnails beside it. Selecting an image thumbnail
resets `show360` to `false`; navigating to a different item (`item.id` changes) also resets it via
effect, so the gallery never opens on a stale product's spin. Unlike the other two video contracts
above, this one does **not** rely on the native `<video poster>` attribute for the no-black-frame
guarantee — `autoPlay` on a large/slow-loading clip drops the poster the moment the browser starts
buffering, before a frame is decoded, producing a black flash. Instead a plain
`<video preload="none" poster={spin360Src.replace(".mp4", ".jpg")}>` (the clip's own first frame as
a static-HTML fallback; `preload="none"` since the element only mounts on tile tap) sits under a
`motion.img` using the same
`item.images[0]?.url`, absolutely positioned, `pointer-events-none`, opacity 1→0 (0.5s) once the
video's `onLoadedData` fires (tracked via `isSpinReady`, reset alongside `show360` on `spin360Src`
change). The play/pause chip
here intentionally does **not** reuse the `bg-foundation/40`/`text-canvas` pair — it sits directly
over unpredictable per-product footage rather than a themed panel, so it uses a fixed `bg-black/50`
scrim (the gallery's only permanently-dark chip — the on-image caption pill it used to match was
removed in the 2026-09-03 luxury pass below). Reuses `Hero.jsx`'s
`heroPauseVideo`/`heroPlayVideo` i18n keys; adds one new key, `productSpin360Label`.

**Gallery chrome reads quiet (2026-09-03 luxury pass).** The caption no longer sits on the image as
a `bg-black/50` pill — it renders beneath the main pane as a small muted mono line, `truncate`d with
its native `title` kept (still the documented Tooltip exception), and `rtl:tracking-normal` since
Farsi text must not be letter-spaced. Thumbnails and the 360° tile are full-opacity now (the old
`opacity-60` inactive dimming is gone); selection is a 2px accent underline drawn via `scaleX`
(`origin-left rtl:origin-right`, 1000ms) — the same underline-draw language as the menu cards —
not a border+ring. Prev/next are `w-10 h-10` frosted-glass circles (`bg-panel-glass` +
`backdrop-blur-sm`, no shadows), hover-revealed off the pane's `group` with the persistent
`[@media(hover:none)]` touch fallback (`data-touch-boost` kept, still flex-centered); the archive
chip lost its shadow. The main image change unveils through a silk-veil `clipPath`
(`inset(6% 4% 6% 4%)` → open, 0.9s on the brand ease, quick 0.45s fade exit via a per-state
transition override) instead of a plain fade; the thumbnail strip carries its own
`MaisonReveal` (`slide-up-royal`, delay 0.6) nested inside the gallery's root reveal, so the
entrance score reads pane → strip. The veil is skipped under `prefers-reduced-motion`
(`useReducedMotion()` — plain opacity crossfade instead), and the caption's view-counter digits
localize via `Intl.NumberFormat` (`fa-IR`/`en-US`), matching `Vision.jsx`'s numeral treatment.

`StudioGallery`'s three state vars (`show360`, `isPlaying`, `isSpinReady`) and three effects (reset
on `item.id` change, reset `isSpinReady` on `spin360Src` change, play/pause keyed on
`[show360, isPlaying]`) fall under the same `src/hooks/README.md` "trivial local UI toggle"
exception as `Hero`'s and `ChapterHero`'s above.

**`showcase/ImageViewer.jsx` reuses this exact pattern** as a third `viewMode` value (`"360"`,
alongside `useShowcase.js`'s existing `"editorial"`/`"macro"`) rather than a separate boolean —
`ImageViewer` already had a mode switcher (the Editorial/Macro pill pair at the bottom), so the
360 tile is a third pill, not a fourth thumbnail slot like `StudioGallery`'s grid. Same
`` `/video/spin/spin-${item.id}-360.mp4` `` derivation, same `preload="none"` (never fetches until the pill is
tapped) + `motion.img` first-frame cover (no black-flash), same play/pause chip reusing
`heroPauseVideo`/`heroPlayVideo` and the `productSpin360Label` key `StudioGallery` already added.
Differs only in chip styling — `ImageViewer`'s corner badges are already `bg-panel-frost`-themed
(unlike `StudioGallery`'s `bg-black/50` scrim, chosen there for a different visual context), so the
360 play/pause button and bottom-right "360° View" badge use `ImageViewer`'s own existing
`bg-panel-frost` chip convention instead, for consistency within *this* component. `viewMode` resets
to `"360"` on item switch via `useShowcase.js`'s existing `selectItem`, which also unmounts the
video (pausing it) — no extra reset logic needed.

**`"360"` is the default `viewMode`** (`useShowcase.js`'s initial state, not `"editorial"`), but the
`<video>` element's actual *mount* is gated separately from which mode is selected — a `canMountSpin`
state starts `false` and flips to `true` only once the app's `zaad:loaderComplete` signal fires (the
same event `Hero.jsx` already gates its entrance timeline on; checks `sessionStorage`'s
`zaad_loader_complete` first for a same-session repeat visit, same pattern). Until then, `viewMode
=== "360"` still renders — the item's first photo (the same `motion.img` cover used for the
no-black-flash crossfade) shows alone, no `<video>` tag exists in the DOM at all. This matters because
`autoPlay` makes most browsers start fetching a video the moment it mounts, regardless of
`preload="none"` — so making 360 the default view without this gate would mean the heaviest asset in
the section starts downloading before the page has even finished loading, exactly what `preload="none"`
was meant to prevent. Unlike `Hero.jsx`'s entrance timeline, this gate does **not** check
`prefers-reduced-motion` — the video is content the user deliberately selects (the pill), not
unsolicited motion, and `StudioGallery.jsx`'s own established 360 pattern has no such gate either;
the deferral here is purely a load-timing concern, not a motion-preference one.

**Macro mode zooms into the currently-selected editorial image, not a separate photo.** The
dictionary's collection items used to carry a `macroUrl` field — a generic, unrelated Unsplash stock
photo (never one of the item's own real `/image/{id}/…jpg` files) — that Macro mode showed
regardless of which image was active in Editorial view. Removed from `en.js`/`fa.js` entirely (dead
field, no remaining reader) along with the special-cased `src`/`imageKey` branch in both
`ImageViewer.jsx` and `showcase/Lightbox.jsx` — both now always read
`selectedItem.images[activeImageIndex]?.url` and key on `` `${selectedItem.id}-${activeImageIndex}` ``
regardless of `viewMode`, keeping the two files' `imageKey` construction byte-identical per the
project's load-bearing contract. Practical effect: pick an image in Editorial, switch to Macro, and
you zoom into that same photo — not an unrelated placeholder — and because the `AnimatePresence` key
no longer changes on a pure mode toggle (only on an actual image-index or item change), switching
between Editorial and Macro on the same image no longer re-triggers the fade-in, only the zoom scale
animates.

### `Header.jsx` + `header/`

**Shell responsibilities:** `menuOpen` toggle state, reads `useLanguage`, `useTheme`, `data("collection")`. Passes all to `MenuPanel`.

| File | Role |
|------|------|
| `header/MenuPanel.jsx` | Animated slide-out overlay; composes all menu sub-sections |
| `header/SystemPortals.jsx` | "System Directories" column — House of ZAAD + Digital Catalogue portal cards (`memo`); no other content. 2026-09-07: the Catalogue card's click (built as `MenuPanel.jsx`'s `onBlueprint`, passed in here) was rewired from the long-dead `setActiveTab("pdf")` to `window.open("/showcase/index.html", "_blank", "noopener,noreferrer")` — the card finally goes somewhere: the same static lookbook the footer's Digital Catalogue link and the showcase panel's "VIEW IN DIGITAL CATALOGUE" button open. Same day: the first card (label `t("menuHouseOfZAAD")` = "HOUSE OF ZAAD") was ALSO found going nowhere near its name — its `onClick` (`MenuPanel.jsx`'s old `onShowroom`) just cleared the selected product and returned to the general showroom view, while "House of ZAAD" independently labels the actual `/about`/`/story`/`/sustainability` brand pages elsewhere (their shared `heroBadge` eyebrow) — a real destination collision, not a wording nuance. Rewired to `MenuPanel.jsx`'s new `onHouseOfZaad` (`navigateTo("/about")`, the same `router.push`+close pattern `JourneyIndex.jsx`'s links already use), and `menuHouseOfZAADPortalSub` changed from "Return to the digital showroom" to copy describing the House content it now actually opens. Both cards' `isActive` is `false` — neither corresponds to a state this menu can itself be open while true (the House pages don't render this menu at all, and the Catalogue opens in a new tab), so the `PortalCard` "active" halo never applies to either. |
| `header/JourneyIndex.jsx` | Three journey chapter cards (`memo`) — `MenuPanel.jsx` renders a fourth, small eyebrow-link button directly below this component's `md:col-span-8` column (2026-09-05, not inside `JourneyIndex.jsx` itself, not a new `SystemPortals` card by explicit user request): `onNavigateToConcierge`, same closure pattern as `SpecimenGrid.jsx`'s collection link below, scrolling to `id="concierge"`. Its label reuses `t("zaadDigitalCurator")` — the same string `concierge/CuratorChat.jsx` renders as that section's own on-page title, deliberately not `footerConcierge`/`conciergeBadge` ("Acquisition Concierge"), so the menu link and the section it jumps to read as the same destination. Like `SpecimenGrid.jsx`'s matching link, it carries no top or bottom rule — by explicit user preference, both links' classNames are byte-identical (see the `SpecimenGrid.jsx` row below); separation from the three cards above comes from the column's own `space-y-2` gap. This column also fills the height gap left by `SystemPortals.jsx`'s two stacked cards (`md:col-span-4`) being taller than this row's single-row three-card grid, so the two columns' bottoms land closer to level |
| `header/SpecimenGrid.jsx` | Collection item cards grid (`memo`) — its section-label badge is a clickable nav button (`onNavigateToCollection`, threaded down from `Header.jsx` via `MenuPanel.jsx`) that closes the menu and scrolls to the showroom's `id="collection"` section. A conditional "Continue Browsing" link renders **below the four cards** (moved here 2026-09-06, was briefly under `SystemPortals.jsx`'s two portal cards) when `useLocalPreference("lastViewedItem")` (`MenuPanel.jsx`) has a value — styled to match `JourneyIndex`'s sibling "AI Curator" link exactly, borderless (no top or bottom rule, by explicit user preference — this and the curator link intentionally carry a stray, inert `hover:border-[#C5A059]` with no base border-width utility, which is a no-op, not a bug: keep both links' classNames byte-identical rather than "fixing" one). Clicking it resolves the stored id against the current-language `collection` prop (so the displayed name/click target are never stale after a language switch) and reuses the same same-page `onSelectProduct` swap the grid's own cards use — a stale/deleted id that no longer matches `collection` just no-ops silently. A hover-revealed `×` dismiss button sits beside it (2026-09-06, `lucide-react`'s `X`, `opacity-0 group-hover/continue:opacity-100 focus-visible:opacity-100` on a `group/continue` wrapper so it doesn't clutter the row at rest) — calls `onClearLastViewed` (`MenuPanel.jsx`, `setLastViewedItem(null)` via `useLocalPreference`'s setter), letting a visitor who doesn't want to be reminded of an item clear just that one preference without a settings page |
| `header/MenuControls.jsx` | Copyright/edition strip + language, audio, font-scale, and theme toggles footer (`memo`) — controls render plain/always-visible, no hover-expand (see `shared/ExpandOnHoverPill.jsx` above). The font-scale Minus/Plus buttons carry `hover:bg-indicator hover:text-on-indicator` — the same token pair the language/theme options use for their *selected* state, reused here on `:hover`. Since 2026-09-03 the bound-reached button instead takes the full *selected-chip* look (`bg-indicator text-on-indicator`, still `disabled` + `cursor-not-allowed`): at min scale the − chip fills, at max the + chip fills, so the stepper reads as a segmented control where the exhausted direction is lit, not dimmed |

**Keyboard, focus, and scroll-lock contract (owned by `Header.jsx`, mirrors `shared/Lightbox.jsx`'s self-contained pattern).** While `menuOpen`, a single effect in `Header.jsx`: locks both `document.body` and `document.documentElement` overflow (the latter guards iOS Safari, which can scroll the root element even with the body locked — restored on cleanup, both of them, or the whole page stays permanently unscrollable once the menu has opened once); blocks background `touchmove` via a `{ passive: false }` listener, except inside whatever carries `data-menu-scroll-panel` (`MenuPanel.jsx`'s own scrollable content div, which also carries `overscroll-contain` so edge-swipes at its scroll bounds rubber-band in place rather than dragging the page behind) — omitting that attribute there makes the menu's own content unscrollable on touch; traps `Tab`/`Shift+Tab` within whatever carries `data-menu-panel` (`MenuPanel.jsx`'s root `motion.div`, which also carries `role="dialog" aria-modal="true"`); roves focus with `ArrowDown`/`ArrowUp` (wrapping) plus `Home`/`End`; closes on `Escape`; and restores focus on close to `document.activeElement` as captured when the menu opened. `ArrowLeft`/`ArrowRight` **adjust the focused segmented control** instead of moving focus: `MenuControls.jsx`'s three setting clusters carry `data-menu-language` / `data-menu-theme` / `data-menu-font` wrappers (the font buttons additionally `data-font-increase` / `data-font-decrease`), and the handler `.click()`s the adjacent option's real button — zero prop plumbing, bounds respected because `.click()` on a disabled button is a native no-op — then focuses it; "forward" (the arrow that advances in reading order) flips under `dir="rtl"` exactly like platform radiogroups, so physical arrows keep pointing at the option they select in both languages. Note the language case closes the menu by the global `key={language}` cross-fade remount (see the project CLAUDE.md contract) — that's existing behavior, not this handler's. All menu interactives (`header/` cards, `MenuControls` pills, `AudioToggle`) share the app-standard visible focus ring (`outline-none focus-visible:outline-2 outline-offset-2 outline-accent`), without which the arrow roving was invisible. On touch, a **downward swipe > 80px** on the `data-menu-scroll-panel` div dismisses the menu (listeners are passive, fire only when the panel is at scroll-top, and are cleaned up with the effect). `Escape` is **layered**: a visible `Tooltip` consumes it first (`nativeEvent.stopImmediatePropagation()` in its `onKeyDown` — Next's App Router hydrates into `document` itself, so React's delegated keydown listener and this effect's native `document.addEventListener("keydown")` sit on the *same node*, where `stopPropagation` cannot suppress a sibling listener; `stopImmediatePropagation` works because React's listener is registered at hydration, before the menu's); the next press closes the menu. `MenuPanel.jsx` itself has no keyboard logic of its own — unlike Lightbox, ownership stays in the shell because `Header.jsx` already owns `menuOpen` state and the toggle button's focus is naturally where restore-focus should land in the common case.

Navigation actions (`animateScrollTo`, `animateScrollToTop`) are resolved in **both** the shell (`Header.jsx` — logo scroll-to-top calls `animateScrollToTop` directly) and `MenuPanel`, via named exports from `ScrollService` (also home to `animateScrollToBottom` — see `shared/ScrollButton.jsx` above). **`Header.jsx`'s Inquiry button no longer calls `animateScrollTo` directly (fixed 2026-09-07)** — `handleInquiryClick` used to hardcode `animateScrollTo("concierge", 1500)`, which works when `Header` is mounted inside `AppShell` (the `#concierge` element exists on that page) but silently failed/retried-then-bailed when `Header` is mounted from `collection/[slug]/CollectionPageClient.jsx` (no such element exists on the product page at all). It now calls the `onScrollToSection` prop instead — the same prop `Footer.jsx` already correctly branches on — so it delegates to whichever implementation is actually correct for the current route: `AppShell`'s real in-app scroller, or `CollectionPageClient.jsx`'s `router.push('/#concierge')`, picked up by `AppShell.jsx`'s own mount-time hash handler once the navigation lands (see `src/services/README.md`'s ScrollService section). The redundant `setActiveTab("showroom")`/`onSelectProduct(null)` calls this handler used to make before scrolling were dropped too — both are now no-ops-or-worse on the product-page route (a second, redundant `router.push("/")`) and were already handled internally by `onScrollToSection` on the `AppShell` route.

**`Header.jsx`'s Browse/Close toggle label window is content-hugging, not fixed-width (2026-09-06).**
The toggle's label box is a `h-4 overflow-hidden` flex whose single mounted `motion.span` sits
in flow (`AnimatePresence mode="wait"` guarantees exactly one at a time). It was previously
`w-20` with `absolute` spans: at `sm` sizes "BROWSE" + the menu icon measures ~78px against the
80px window, so any `--zaad-font-scale` above 1 — including the residue of Farsi's ×1.05
multiplier when switching fa→en — clipped the centered label's first/last letters (reported as
"BROWSE" losing its "B"). With the window sized by its in-flow content the clip is impossible
at any scale in either language; the `h-4` + `overflow-hidden` vertical mask for the y-slide
label swap is unaffected. Button width now varies with the label ("منو" renders narrower than
"BROWSE") — content-fit is the intent, not drift. Same sizing family as `MaisonButton`'s
`w-max` label-row fix (above): never put a fixed width on a `whitespace-nowrap` text box.

**`MenuControls.jsx`'s edition strip is dynamic, not static text.** It renders
`{brand} {t("editionVersion")}` then a live date-time label assembled from per-locale
`Intl.DateTimeFormat` pieces as `` `${time} (${weekday}), ${date}` `` (since 2026-09-03) —
`"20:17 (Thu), September 3, 2026"` for `en` (short English weekday abbreviation), the
Persian-calendar equivalent with the **full un-abbreviated weekday** for `fa`
(`"۲۰:۱۷ (پنجشنبه), ۱۲ شهریور ۱۴۰۵"`). Below `md` the label swaps to a compact month-year form
(`"September 2026"` / `"۱۴۰۵ شهریور"`) — two sibling spans, `hidden md:inline` / `md:hidden`.
Farsi is the one place in the app that intentionally uses the Persian calendar; everywhere else
(`item.year`, "C°01"-style codes) stays Gregorian by brand design (see `.font-latin` in
`src/styles/README.md`). Both labels re-render on a 15s `setInterval` state tick — the interval
lives inside `MenuControls`, which only mounts while the menu is open, so it never ticks in the
background. `house/HouseChrome.jsx` has no equivalent strip — only `MenuControls.jsx` renders one.

**`ZAAD` transliterates to `زاد` for incidental brand mentions in Farsi, unlike the wordmark.**
`MenuControls.jsx` composes the brand name from a local `BRAND_NAME = { en: "ZAAD", fa: "زاد" }`
map rather than hardcoding "ZAAD". This is the opposite rule from the logotype: the *wordmark*
(`Header.jsx`'s clickable "ZAAD", `HouseChrome.jsx`'s, `Footer.jsx`'s) is always Latin in both
languages by deliberate brand-identity choice — but incidental mentions of the brand name in body
copy follow the same transliteration convention already used everywhere else in `fa.js`
(`"خانۀ زاد"`, `"کاتالوگ زاد"`, etc.). Don't assume every "ZAAD" string in the codebase is
wordmark-exempt from translation — check whether it's the logotype link or just prose mentioning
the brand. Relatedly: when a Latin-only fragment (a product code, a version number) sits inline
inside otherwise-RTL Farsi prose, wrap it in `<span dir="ltr" className="font-latin">` — the
`dir="ltr"` adds explicit Unicode bidi isolation on top of the font-family override, which matters
once more than one direction-mixed fragment sits on the same line (adjacent LTR/RTL runs can
reorder unpredictably without it). Not needed when a whole line is uniformly one script, as
`MenuControls.jsx`'s edition strip currently is.

**`Header.jsx`'s wordmark hover is a staggered letter color cascade (2026-09-03)** — the
letters are individual `<span>`s (`BRAND_LETTERS`), each with `transitionDelay: index * 60ms`
on a 700ms color transition to `text-accent`, cascading left→right on `group-hover`. The
earlier hover treatment (opacity dim + `tracking` letter-spacing expansion) is gone
deliberately: the tracking expansion shifted layout on every hover, and the cascade is
color-only so it has zero layout shift. Details that must survive edits: the letter row sits
in a `dir="ltr"` + `aria-hidden` wrapper with the word carried by the button's `aria-label`
(screen readers read "ZAAD", not four letters), and each letter span carries
`[transform:translateZ(0)]` so its color repaint composites on its own layer.

---

### `Showcase.jsx` + `showcase/`

**Shell responsibilities:** reads `useLanguage`, `useShowcase`, guards for `selectedItem`, owns the `AnimatePresence` transition between items.

| File | Role |
|------|------|
| `showcase/CollectionTabs.jsx` | Horizontal item selector with animated underline |
| `showcase/ImageViewer.jsx` | Left column — editorial/macro/360° image frame, prev/next, view mode switcher (see the `StudioGallery` section below for the shared 360° pattern; Macro no longer has its own placeholder image — see below) |
| `showcase/CollectionPanel.jsx` | Right column — name, story, specs accordion, CTA buttons. The action row pairs the solid `showcasePrivateInquiry` CTA with an outline `showcaseOpenPiece` button that calls `onViewDetails(selectedItem)` → the in-app `CollectionPage` swap in `AppShell` (smooth AnimatePresence cross-fade — not a route navigation; restored 2026-09-05 after a `router.push` attempt felt abrupt). The `showcaseRevealDossier` link inside the specs drawer is a separate exit: it opens the static page-flip catalogue at the selected collection's anchor (`CATALOGUE_PAGES`: gavv `#p=4`, zivv `#p=26`, rakh `#p=50`, vaar `#p=62`) in a new tab, labelled «مشاهده در کاتالوگ دیجیتال» — deliberately two different destinations, do not unify them |
| `showcase/Lightbox.jsx` | Thin wrapper → `shared/Lightbox` with Showcase-specific prop mapping |

**Item localization:** `CollectionPanel` reads item fields directly (`selectedItem.name`,
`selectedItem.description`, `selectedItem.story`, `selectedItem.materials`, …). The
selected item comes from `data("collection")` in `Showcase.jsx`, which is already
localized — there is no per-item override layer. (A previous `getItemTranslations(id)`
helper was dead code that always returned `null` and has been removed; do not
reintroduce it. See `src/lib/i18n/README.md`.)

---

### `CollectionPage.jsx` + `collection/`

**Shell responsibilities:** reads `useLanguage`, calls `useLightbox(item.images.length)`, holds `activeTab` state, scrolls to top on `item.id` change. Passes the entire `lightbox` object as a single prop to children.

| File | Role |
|------|------|
| `collection/NavBar.jsx` | Breadcrumb + animated back button (`memo`) |
| `collection/StudioGallery.jsx` | Left column — main image with prev/next nav, thumbnail strip + a 4th "360° View" tile that swaps the main pane to that item's own looping turntable clip (see below). Main pane + thumbnails render via `next/image` (`fill`, crossfade on a `motion.div` wrapper inside `AnimatePresence mode="wait"`); the main pane's `<Image>` is `priority` (above-fold LCP, 2026-09-06); the 360° cover still stays raw (opacity-animated `motion.img`, cached URL) |
| `collection/CollectionMeta.jsx` | Right column — title, specs grid, CTA pair (`memo`) |
| `collection/LookbookPoetry.jsx` | Vision/monograph section (`memo`, no-op if `item.farsiStory` absent); Farsi poetry column + a per-collection line-art SVG watermark render in Farsi mode only — the watermark is a module-level `WATERMARK_ICONS` map keyed by `item.id` (gavv layered earth-strata curves, zivv radiance arcs, rakh slatted-screen verticals, vaar architectural horizontals), stroke-based via a shared `STROKE` const, absolute `right-6 top-6`, `opacity-[0.04]`, `aria-hidden` + `pointer-events-none`; English mode shows the full-width English monograph column |
| `collection/SpecsTabs.jsx` | Tab bar orchestrator + `AnimatePresence` panel switcher; content via `memo(TabContent)` inside the switch |
| `collection/TabArchitecture.jsx` | Island + tall-unit specs panels |
| `collection/TabAppliances.jsx` | Gaggenau + Kesseböhmer integration grid |
| `collection/TabHeritage.jsx` | Static craft integrity panel (`memo`) |
| `collection/AcquisitionCTA.jsx` | Footer CTA with shimmer animation (`memo`) |
| `collection/Lightbox.jsx` | Thin wrapper → `shared/Lightbox` with PDP-specific prop mapping |

**Accessibility (2026-09-07 pass).** `StudioGallery.jsx`'s main image pane carries `role="button"`/`tabIndex={0}`/`onKeyDown` (Enter/Space, mirroring the existing click-to-zoom `onClick`) only while it's actually clickable (`!show360` — no click handler exists in 360 mode, so no keyboard affordance is added then either); `aria-label` is `t("productEnlargeImageLabel")` with `{name}` filled from `item.name`. `showcase/ImageViewer.jsx`'s main image pane got the identical treatment in a follow-up fix (same day): `role="button"`/`tabIndex={0}`/`onKeyDown` gated on `viewMode !== "360"` (its 360 mode has no click handler either, mirroring `StudioGallery`'s `!show360` gate), same `productEnlargeImageLabel` key for `aria-label`. Both gallery-open triggers in this component tree are now keyboard-reachable. The prev/next chevrons and every thumbnail/360-tile button in this file now carry the standard `focus-visible:outline` ring plus (for the icon-only chevrons) an `aria-label` from the existing `showcasePrev`/`showcaseNext` keys. `collection/Lightbox.jsx`'s `imageAlt` now prefers the active image's own `caption` over the bare item name, matching `shared/Lightbox.jsx`'s existing keyboard/focus-trap/focus-restore contract (documented above) — that contract itself needed no changes, it was already complete. `collection/SpecsTabs.jsx`'s tablist now implements the standard roving-tabindex pattern (`tabIndex={isActive ? 0 : -1}` per `SpecTabButton`, `ArrowLeft`/`ArrowRight`/`Home`/`End` on the `role="tablist"` wrapper, RTL-aware exactly like `header/MenuControls.jsx`'s font-scale arrow-adjust) — `document.getElementById(`tab-${id}`)?.focus()` is the same "resolve the real DOM node by id and act on it" idiom `MenuControls` already uses, not a new mechanism. The `activeCurationTabLine` `layoutId` itself is untouched.

---

### `Concierge.jsx` + `concierge/`

**Shell responsibilities:** reads `useLanguage`, calls `useConcierge(...)`, passes the entire `concierge` object to children.

| File | Role |
|------|------|
| `concierge/SectionHeader.jsx` | Start-aligned intro block (de-centered 2026-09-05 — reading-start `text-left rtl:text-right`, matching the other four home eyebrows) — per-element `MaisonReveal` stagger (eyebrow → `lines`-variant h2 → subtitle → click-to-call pill) (`memo`) |
| `concierge/InquiryForm.jsx` | Bespoke acquisition form + appointment (Audience/Cadence) + inline server-validation errors + animated success confirmation state. Its one native `<select>` (consultation category) is `appearance-none` with an absolutely-positioned `ChevronDown` (`end-3`, `pointer-events-none`) inside a `relative` wrapper and `pe-10` on the select — the browser's default arrow hugs the border and padding can't move it (2026-09-06, user request); `ps-4`/`pe-10` split instead of `px-4` so text never runs under the chevron. RTL lands free via `end-3`/`pe-*` logical properties. The Cadence button's own `ChevronDown` (custom dropdown, not a native select) already sits `px-3` inside its pill — no change needed there. Since 2026-09-06 the name/email and phone/category rows pair at all viewport sizes (`grid-cols-2 gap-4 md:gap-6`, was `grid-cols-1 md:grid-cols-2`): each column is `flex flex-col` with a **conditional** `mt-auto` on the input (`identityRowAlignsBottom`/`contactRowAlignsBottom` — true only while the pair is error-free, so a wrapped label bottom-aligns its input with its pair; dropped when either column shows a `FieldError`, since the error-free column's `mt-auto` would otherwise push its input ~20px below the errored one) and `leading-snug` on the label. The Audience/Cadence row deliberately keeps `grid-cols-1 sm:grid-cols-2` — the long Farsi toggle labels ("دریافت تماس اختصاصی") cannot fit half-width pills below `sm`. The email label renders as `t("contactEmail")` + a one-step-smaller `t("optionalMarker")` suffix span ("Secure" dropped, per user request); `ledger/Ledger.jsx`'s email and phone `DetailRow`s reuse `contactEmail`/`mobilePhone` without the marker. Submit button's `Send` icon: see the `MaisonButton` `iconClassName` bullet |
| `concierge/CuratorChat.jsx` | AI chat panel — message list, loading indicator, send form, download-transcript button. Its send chip's `Send` icon: see the `MaisonButton` `iconClassName` bullet (kept in sync with the form's) |

**`InquiryForm.jsx`'s validation is server-side, not client-side** (2026-09-03) — see
`src/hooks/README.md`'s `useConcierge.js` entry and `src/app/README.md`'s `/api/inquiry`
section. A local `FieldError` component renders `t(errorKey)` under `clientName`,
`clientEmail`, `clientPhone`, and `additionalNote` when `formErrors` has that key, in the
new `text-danger` token (see `src/styles/README.md`) with a small `AlertCircle` icon; the
matching input's border swaps to `border-danger` at the same time. A generic
`formErrors.form` banner (same `text-danger` treatment) covers network/server failures.
The submit `MaisonButton` uses its existing `disabled` prop while `formSubmitting`, and
swaps its label to `t("formSending")` — no new button variant needed. A single
`t("formChatAlternative")` line (2026-09-06, small `font-mono text-muted`) sits under the
`<h3>` heading, pointing visitors at the AI Curator chat as an alternative way to submit
the same information — see `src/hooks/README.md`'s `useConcierge.js` entry for how the
chat side actually captures and submits it.

**`CuratorChat.jsx`'s `ChatMessage` splits each message on `\n` and renders every
non-empty line as its own block** (2026-09-03), instead of one `whitespace-pre-wrap`
blob. A numbered/bulleted list line (matched against a small regex covering both Latin
and Persian digits) gets its own marker column instead of flowing inline; every line
still goes through `renderChatMarkdown` (see `src/lib/README.md`) for bold/bidi handling.
This exists because `rtl:text-justify` on one giant blob stretched non-final lines (e.g.
a mid-list item) into uneven, broken-looking spacing — justify only ever safely applies
within a single-line block, never across a whole multi-line reply.

**`ChatMessage`/`renderCuratorLine` detect script per line, not the page's `language`**
(added 2026-09-07) — `FARSI_CHAR` (`/[؀-ۿ]/`, the same Arabic-script block
`wrapLatinRuns.js` tests) is tested against each line's own text inside
`renderCuratorLine`, and the per-line result sets both (a) an explicit
`dir="rtl"`/`dir="ltr"` on that line's own wrapping `<div>` and (b) the `isFarsi` flag
passed into `renderChatMarkdown`. `ChatMessage` separately computes the same test once
against the whole `msg.content` (`msgIsFarsi`) purely as the bubble container's own
default `dir` — the per-line `dir` on each child always wins for that line's own bidi
context regardless of the container's. This replaces what used to be the page-level
`isFarsi` (`language === "fa"`) passed down from `Concierge.jsx`. This fixes two bugs
that were really one root cause: a full-English reply rendered on a `fa` page used to
pass `isFarsi=true` into `wrapLatinRuns` for text containing zero Farsi characters, which
collapses the whole string into one merged Latin run (see `wrapLatinRuns`'s single-space
run-merge in `src/lib/README.md`) — the literal `**` markers inside that merged run never
reach `renderChatMarkdown`'s bold-toggle split, so they leaked through unstyled instead
of becoming `text-accent` spans. Per-line detection also means a reply written in the
"other" language than the page now reads in its own natural direction instead of
inheriting the page's, **including a single reply that mixes a Farsi line and a fully-
English line** (per-line, not per-message, was needed for that case specifically — an
earlier per-message-only version of this fix left it as a known gap, since one shared
flag for the whole message can't get both lines right at once). The bubble's own
placement (`items-end`/`items-start` on the outer `motion.div`, based on `msg.role`, not
content language) is untouched. Known minor gap: the inner div's `rtl:rounded-tr-2xl`/
`rtl:text-justify` utility classes don't actually flip off under a local `dir="ltr"`
override on a `fa` page — Tailwind's `rtl:` variant is `:where(:dir(rtl), [dir="rtl"],
[dir="rtl"] *)`, and the `[dir="rtl"] *` clause still matches via the `<html dir="rtl">`
ancestor regardless of a closer override — so an English line's bubble-tail corner and
justify stay in their `fa`-page rounding/alignment even though the text itself correctly
reads LTR (native `dir` always governs actual bidi text flow, independent of that
utility-class quirk). Cosmetic only; revisit if it's ever worth chasing. `CuratorChat`
and `Concierge.jsx` no longer thread a `language` prop into `CuratorChat` for this
purpose — it was dead once `ChatMessage` stopped needing the page-level flag. **An error
bubble (`msg.isError`, added 2026-09-07) renders a `t("errorRetry")` text button beneath
its content**, wired to `useConcierge.js`'s `retryLastExchange` — reuses the same
`errorRetry` key `error.js`/`not-found.js` already use for their own "Try Again" CTA
rather than adding a new one. The download button
next to `curatorModelBadge` builds a plain-text transcript client-side (`Blob` +
temporary `<a download>`, no server round-trip) from `chatMessages` as they stand at
click time. Its styling matches `shared/AudioToggle.jsx`'s small-utility-icon-button
convention (borderless, `rounded-md`, `hover:text-headline`, `duration-700`,
`data-touch-boost`) — not `MaisonButton`, which is for labeled CTAs with its own
magnetic-drift/shine interaction, not bare icon affordances in a panel header.

**`CuratorChat.jsx`'s root is `h-full min-h-[520px]`, not a fixed `h-[520px]`** —
`Concierge.jsx`'s grid (`grid grid-cols-1 lg:grid-cols-12`, default `align-items: stretch`)
already sizes row children to match the tallest one; `InquiryForm.jsx` has no fixed
height and grows with its own content, so a hardcoded chat height could mismatch it.
`h-full` lets the chat panel match the form's height at `lg+` via that grid stretch;
`min-h-[520px]` is a floor so it doesn't collapse on narrower/stacked layouts where the
two no longer share a row.

**The chat's message list is a capped inner scroller (2026-09-06), not a page-growth area.**
The mechanism is two nested divs: an outer `flex-1 min-h-0 relative` flex child and an
inner `absolute inset-0 overflow-y-auto overscroll-contain` scroller (the one carrying
`data-lenis-prevent`, `scrollbar-sleek`, and the bg/border/padding). The nesting is
load-bearing, not decorative: `Concierge.jsx`'s grid row is sized intrinsically
(max-content) before stretch, so a flat `flex-1 min-h-0 overflow-y-auto` list still
contributes its full scrollable height to the row's max-content and the page elongates
with every message — empirically verified, `min-h-0` alone does **not** cap here (the
parent never gets a definite height for it to resolve against). Making the scroller
absolutely positioned removes it from intrinsic sizing entirely: the row's max-content is
then driven only by the sibling `InquiryForm` column and the root's `min-h-[520px]`
floor, the wrapper receives a definite bounded height, and the list scrolls inside it.
The bar is `scrollbar-sleek` (see `src/styles/README.md`'s Scrollbar section) — thin,
theme-adaptive, gold on hover — and the scroller keeps `data-lenis-prevent` (one of the
app's three inner scrollers) plus `overscroll-contain` so chat edge-swipes can't chain to
the page behind (same as `MenuPanel.jsx`'s scroll panel). `useConcierge`'s auto-scroll
targets `scrollRef.current.parentElement` — the sentinel's parent must remain the
scrolling div, i.e. the sentinel stays a direct child of the abspos scroller.

### House-of-ZAAD routes — `house/` (shared by `/about`, `/story`, `/sustainability`)

The three House routes share a slim chrome (rendered once by the route-group layout,
`src/app/(house)/layout.js`) and two chapter composers. `about` is a single-topic
chapter; `story` and `sustainability` are two-column "diptych" chapters that each pair
two of the five `aboutSections` data entries (`story`+`brandValue`,
`sustainability`+`csr`) into one page.

| File | Role |
|------|------|
| `house/HouseChrome.jsx` | Shared slim header: back-to-showroom, ZAAD wordmark, the **current** House page's name as a static underlined label (`NAV.find((item) => item.href === pathname)` — current-page-only, no `layoutId`), compact language/theme control (`memo`). Its own font-scale Minus/Plus buttons carry the same treatment as `header/MenuControls.jsx`'s copy — `hover:bg-indicator hover:text-on-indicator` off-bound, and since 2026-09-03 the selected-chip look (`bg-indicator text-on-indicator`) when their bound is reached — kept in sync deliberately even though the two controls don't share code (see the House-routes contract in the root CLAUDE.md) |
| `house/HouseChapterShell.jsx` | Single-column chapter composer (used only by `/about`): ambient bg + cinematic hero (eyebrow/title/intro + Unsplash image, randomized collection-video overlay — see `ChapterHero` below) + centered `<h2>` + centered editorial block (`EditorialBlock` called with `align="center"` — parses the `### I. …` headings from `aboutSections[].content`) + `EditorialSignature` horizontal divider (`className="mx-auto"`, single-column's decorative echo of the diptych's `&` medallion — see `ChapterPieces` below) + stat grid (renders nothing when `stats` is empty) + sibling cross-link cards + `tel:` call strip (`memo`) |
| `house/HouseDiptychShell.jsx` | Two-column chapter composer (used by `/story` and `/sustainability`): cinematic hero (same `ChapterHero`, so the same randomized video overlay) + a `left`/`right` pair of editorial columns (each with its own eyebrow/title/intro/content and optional stat grid, `EditorialBlock` called at its default `align="start"`), joined by a centered `&` divider — its hairline draws downward via Motion `whileInView` on entry (`scaleY`, `origin-top`, 1.6s; the whole spine is `hidden lg:block`, so desktop-only) with the medallion blooming 0.9s in as the line passes center — + sibling cross-link cards + call strip (`memo`) |
| `house/ChapterPieces.jsx` | Shared pieces (`ChapterHero`, `EditorialBlock`, `EditorialSignature`, `StatGrid`, `CrossLinks`, `CallStrip`) consumed by both shells. `EditorialBlock` takes an optional `align` prop (`"start"` default — `text-left rtl:text-right`, used by `HouseDiptychShell`'s columns; `"center"` — heading/eyebrow centered, prose `<p>` re-asserts `text-left rtl:text-right max-w-2xl mx-auto` so long-form body copy never centers, only the heading/label above it — used only by `HouseChapterShell`). `EditorialSignature` (single-column only, rendered by `HouseChapterShell`, takes an optional `className` merged onto its `MaisonReveal`) is a horizontal `accent/40` gradient rule with a centered `w-11 h-11` `bg-panel`/`border-accent/30`/`shadow-card-sm` circle holding a serif-italic "Z" seal — same visual family as `HouseDiptychShell`'s `&` medallion, but the mark differs deliberately: "&" joins two columns, "Z" seals one continuous narrative. Since 2026-09-03 its gradient rule draws via `scaleX` on entry (`origin-left rtl:origin-right`, 1.6s) with the seal blooming 0.8s in — matching the diptych spine's new draw language. `StatGrid` values count up on entry (`StatValue`: 2.6s eased 0→target, `fa-IR`/`en-US` digits, raw-string fallback, no count under reduced motion). `StatGrid` is always `grid-cols-3` (2026-09-06, user request: three stats in one line on mobile — the old `grid-cols-2` left the third stat alone on a second row) with `gap-4 md:gap-8`, and the per-cell alignment centers below `md` (`text-center md:text-left rtl:md:text-right` when `align="start"`; `align="center"` stays centered at all sizes) — desktop's start-aligned look is unchanged. A `StatGrid` with more than three stats would wrap to a second row; all current pages pass exactly 3 (or none). `ChapterHero`'s media frame carries `lux-vignette` and its fallback still `lux-ken-burns` (see `src/styles/README.md` cinematic utilities). `CallStrip` (2026-09-06) shows a live open/closed dot next to "Call the Atelier" — `[isOpen, setIsOpen] = useState(null)` populated in a mount-only effect from `lib/studioHours.js`'s `isStudioOpenNow()` (`Intl.DateTimeFormat` against `Asia/Tehran`, matching the real Sat–Thu 09:00–18:00 hours already stated in `callStudioSub`'s copy — Friday is the only closed day); `null` renders nothing extra, so SSR and first paint match. Dot color is `bg-accent`/`bg-muted/50`, not a new hardcoded hex |
| `house/AboutChapter.jsx` | `/about` chapter, on `HouseChapterShell` — the atelier/process/partnership, `aboutStats`, cross-links to Story and Sustainability (`memo`) |
| `house/StoryValueChapter.jsx` | `/story` chapter, on `HouseDiptychShell` — pairs the Land of Dorsa brand story (`story`, no stats) with brand values (`brandValue`, no stats), cross-links to About and Sustainability (`memo`) |
| `house/SustainabilityResponsibilityChapter.jsx` | `/sustainability` chapter, on `HouseDiptychShell` — pairs considered materials/sustainability (`sustainability`, `sustainabilityStats`) with CSR (`csr`, `csrStats`), cross-links to About and Story (`memo`) |
| `glance/GlanceHeader.jsx` | `/glance` slim fixed header — the `LedgerHeader` idiom (back-to-showroom `Link`, centered ZAAD wordmark, accent-underlined page label) reusing `HouseControls` from `house/HouseChrome` — the compact control has no `layoutId`, so it's safe outside the house routes (`memo`) |
| `glance/GlancePage.jsx` | `/glance` client orchestrator — `useLenisScroll` (called here, Ledger precedent: standalone route, not the `(house)` group), IntersectionObserver scroll-spy (`rootMargin: "-25% 0px -65% 0px"`) driving the two chapter rails (desktop rail items are link cards with `p-5` padding and `space-y-4` gap — per user direction 2026-09-05 — with the glance hover stack kept on top of that sizing: `NoiseBg` reveal + accent gradient wash + underline fill + warmed border, active `bg-panel` + `border-accent/50` + `shadow-card-sm` + full underline draw; the list enters via a `MaisonReveal` `unveil` wrapped **inside** the sticky nav so the sticky geometry is untouched), `animateScrollTo(\`glance-${id}\`)` navigation, `ChapterHero` (reused from `house/ChapterPieces.jsx` — its GSAP scrub is one of the three authorized spots, reused not extended) with `scrollTargetId="glance-body"` and `withVideo={false}` (2026-09-06, user request — the lookbook runs poster-only, zero clip bytes; see the `withVideo` note in the ChapterHero section), the overview chapter, the master matrix table, `CallStrip` close. Sticky-rail gotcha: the desktop rail is a grid child of the single-row 12-col grid (stretches tall → sticky works); the mobile chip rail must stay **outside** the grid container (a sticky grid child is trapped in its own short row) — `scrollbar-none`, not `no-scrollbar`. The rail carries `id="glance-rail-mobile"` and `handleNavigate` passes its live `offsetHeight` as `animateScrollTo`'s `extraOffset` (0 on `lg:`, where the rail is `display:none`), so chapter targets clear both the header and the rail (see `src/services/README.md`'s ScrollService section). The overview collection cards reuse the `CrossLinks` card grammar verbatim (`NoiseBg` revealOnHover + accent gradient wash + underline draw + mono eyebrow `item.number` + `wrapBrandNames` serif title + `crossLinkReadMore` footer with RTL-flipped `ArrowUpRight`) — click scrolls to that chapter. Rail/chip label spans and the statement blockquote carry `font-farsi` (translated serif text); labels drop tracking on Farsi (see `src/styles/README.md`). The page also closes with the shared `Footer` (mounted prop-less, the 2026-09-06 one-footer-site-wide pass — same footer as every other route) and the self-contained `shared/ScrollButton` (`memo`) |
| `glance/GlanceChapter.jsx` | Per-collection chapter — narrative blockquote (`\n`-split, `font-farsi` serif paragraphs), italic serif `tagline` (also `font-farsi`), partners `dl`, and a generic `SpecGroup` over the **heterogeneous** `islandSpecs`/`tallUnits` shapes (gavv: `partA`+`partB`+`parts`+`adjacentA`/`adjacentB`; zivv/rakh: `partA`+`adjacentA`(/`adjacentB`); vaar: `listSpecs` only — all keys optional), `SpecTable` for the supplements' `materialTable`, dimensions `dl`, `SpecCards` for `appliancesDetail` (gavv/zivv only) + `fittings`/`furniture` (static info cards — deliberately **no** accent underline or hover layers; the underline draw is an interactive/hover idiom, not decoration), layouts `ol` (`memo`) |

The house routes render their **own** chrome and do **not** reuse the showroom
`Header`/`MenuControls` (wired to `useShowroomNav` and the global navbar
`layoutId` groups). Since 2026-09-06 they share the showroom `Footer` — one footer
site-wide, per user direction; it mounts prop-less on every non-home route, so its
showroom-directory buttons take the internal `router.push("/#section")` fallback
(Footer renders no `layoutId`, so nothing flies cross-route). There is no House-nav `layoutId` group at all — the chrome shows only
the current page's name (see the `HouseChrome` row). `LanguageProvider` (root layout) covers all three routes, so the
`key={language}` full-app crossfade applies on locale switch.

---

### `ledger/Ledger.jsx` — the private register (`/ledger`)

Client shell whose two modes are decided entirely by what the server page
(`app/ledger/page.js`, see `src/app/README.md`) passes down: `unlocked={false}` → the key
gate (`useActionState` + the page's inline server action, `InquiryForm`'s field/label/error
styling, `MaisonButton` submit, plus the `HouseChrome` back-link idiom — a `Link href="/"`
with `ArrowLeft` and `t("ledgerReturnHome")`); unlocked with entries → boxed entry cards; unlocked with
zero entries → `shared/StatusScreen` (reuse, not a copy). **The gate is a divided layout (added
2026-09-05):** inside the original centered `min-h-screen` container (fixed-header `pt` offsets
intact — it stays a normal block between `LedgerHeader` and `Footer`, never full-bleed or
overlapping the chrome), a `max-w-5xl lg:grid-cols-2` split puts the form on the reading-order
start and, on the other side, a single portrait panel (`h-[70vh] max-h-[640px] aspect-[9/16]` —
the fallback clips' native 540×960 ratio, so `object-cover` crops nothing; the clips carry
in-video text that an `aspect-[3/4]` frame was cutting off at the top/bottom; frameless —
no border/rounded/shadow, deliberately unlike `Materials.jsx`'s carded analysis panel) that
plays the **fallback material clips one at a
time** — `GATE_FALLBACK_VIDEOS` (`eucalyptus`/`stone`/`leather` from `public/video/material/fallback/`,
with that folder's own `.jpg` posters). A `clipIndex` state advances on the video's `onEnded` and
wraps (`% length`), so the three loop sequentially, never concurrently; the `key={clip}` swap sits
in an `AnimatePresence mode="wait"` opacity cross-dissolve (`duration: 0.6`). Since the
2026-09-06 media pass the clip is gated by `hooks/useDeferredMedia.js` (in-view ref on the
portrait panel): `preload="none"` + poster until near-viewport, then preload `"auto"` and
the element's own `onLoadedData` handler (gated on `!useReducedMotion()`) starts playback —
replacing `autoPlay={!useReducedMotion}` + `preload="metadata"`; under reduced motion it
stays poster-only (`preload="none"` — zero clip bytes), and on mobile the panel is
`hidden lg:block` and never intersects, so the clip never loads there at all. The panel is
`aria-hidden` — mobile keeps the form column only. **Header is `ledger/LedgerHeader.jsx`,
not the showroom `Header`** (changed 2026-09-04, superseding the earlier "mounts the full
showroom chrome" design): a minimal bar modeled visually on `house/HouseChrome.jsx` — back-to-
showroom link (`t("ledgerReturnHome")`), centered "ZAAD" wordmark, a static `t("ledgerEyebrow")`
label in the House current-page-label style (no `layoutId`, nothing to animate between), and
the same `HouseControls` cluster House pages use (now `export`ed from `HouseChrome.jsx` for this
reuse). This deliberately drops the showroom `Header`'s nav tabs/collection controls/mobile menu
and the global `activeLanguageBlobInNavbar`/`activeThemeBlobInNavbar` layoutId groups from this
route — a direct instruction, not a rediscovery of the House-routes prohibition (that CLAUDE.md
rule still targets the House routes specifically). The showroom `Footer` stays mounted — since
the 2026-09-06 one-footer pass, prop-less like every other non-home route (Footer's own
`router.push("/#section")` fallback), alongside `ScrollButton`
and `useLenisScroll`, so the page still reads as the same site below the fold.

Entries paginate at `PAGE_SIZE = 10` (newest first — the server pre-sorts) over
**`filteredInquiries`**, not the raw `inquiries` prop — a `useMemo` applying the active
all/unviewed/viewed tab filter and then the search query (matched case-insensitively against
name/email/phone/`sessionRef`/consultation label). The open row is tracked by **`openKey`**
(a stable `${sessionRef}-${submittedAt}` identity), not a positional index — auto-mark-as-viewed
(below) can flip a record's `viewed` flag while it's open, which drops it out of the current
filter (e.g. it disappears from the "Unviewed" tab) and shifts every later row's position
immediately, client-side, via `effectiveInquiries`/`filteredInquiries` recomputing — no
`router.refresh()` involved for that reorder (only `handleDelete`'s does); a positional
`openIndex` would land on the wrong record in either case. Only
`goToPage` and a tab/search change (via a `useEffect` on `[activeFilter, query]`) reset
`openKey` outright — auto-mark and manual-toggle mutations leave it alone, since identity, not
position, is what's being tracked. `safePage` clamps when a delete (or a filter change) empties
the last page. The reveal stagger uses the page-local `stagger` offset, not the global index —
later pages would otherwise all sit at the 0.8s delay cap and lose the cascade.

**Viewed/unviewed (added 2026-09-04):** every inquiry record carries a `viewed` boolean
(defaulted `false` on write — see `/api/inquiry` in `src/app/README.md`). The three filter tabs
("All"/"Unviewed"/"Viewed", `filterTabs` array with live parenthesized counts, e.g. `(3)`) sit on
a local-only Motion `layoutId="activeLedgerFilterLine"` tab-underline — modeled on
`collection/SpecsTabs.jsx`'s `activeCurationTabLine` pattern but a distinct id, since it
mounts only on this route and must not collide with the four global groups. The tab row carries
the same persistent `border-b border-ink/10` hairline `SpecsTabs`/`showcase/CollectionTabs.jsx`
use under their own tab bars (not conditionally dropped above mobile), each `role="tab"` links to
the list via `id`/`aria-controls="ledger-entries-panel"`, and the list itself is
`role="tabpanel"` — the ARIA wiring those two reference tab bars don't need (they each drive a
single, obviously-adjacent panel) but this filter bar does, since "the panel" is the whole
paginated entry list below it. `LedgerEntry` gets
an `onSetViewed(sessionRef, submittedAt, viewed)` callback, used two ways: a manual per-entry
"Mark Viewed"/"Mark Unviewed" toggle (`Eye`/`EyeOff`) next to Delete in the open detail footer,
and an automatic mark-as-viewed the first time an entry is expanded (checked in `handleToggle`
as `!open && !inquiry.viewed`, so it never fires again once viewed, and only on the transition
into "open", not on close). **`onSetViewed` is optimistic, not refresh-driven (fixed 2026-09-04):**
it originally fired the page's `setViewedAction` server action through the shared `useTransition`
(`isMutating`/`startMutationTransition`) and then called `router.refresh()`, the same pattern
`handleDelete` uses — but that meant simply expanding an unread entry forced a full server
refetch of the whole page, which visibly reads as the page "restarting." `onSetViewed` now writes
straight into a `viewedOverrides` state map (`"${sessionRef}-${submittedAt}"` → boolean) before
firing `setViewedAction` in the background (still through the same transition, just without the
trailing `router.refresh()`); a `effectiveInquiries` `useMemo` merges `inquiries` with
`viewedOverrides` and is what `unviewedCount`/`viewedCount`/`filteredInquiries` actually read, so
the tabs/badge/dot/toggle-label update instantly with no server round-trip. A `useEffect` clears
`viewedOverrides` whenever the `inquiries` prop itself changes (today, only after `handleDelete`'s
`router.refresh()`) — by then the earlier `setViewedAction` writes have already landed on disk, so
the fresh server data already carries them and the now-redundant overrides can be dropped.
`handleDelete` still calls `router.refresh()` unchanged, since removing a row genuinely has to
shrink the list. **Status badge (added 2026-09-04, replacing an earlier unviewed-only accent
dot that user testing found too subtle to read at a glance):** every collapsed row leads with a
small `Eye`/`EyeOff` + "Viewed"/"Unviewed" badge (reusing the `ledgerTabViewed`/`ledgerTabUnviewed`
tab-label strings — no new vocabulary), `border-accent/40 text-accent bg-accent/5` when unviewed
and a quiet `border-ink/10 text-muted/60` when viewed — outside the `#concierge` scope, so unlike
`CuratorChat`'s model badge it's written as an explicit `rounded-md`, not `rounded-full` (the
sitewide radius sweep only normalizes non-circle radii to 6px; `rounded-full` outside `#concierge`
stays a true pill). The badge's icon direction is the mirror of the action button below it, not a
repeat: the badge shows the *current* state (`Eye` = viewed, `EyeOff` = unviewed), while the
"Mark Viewed"/"Mark Unviewed" toggle shows the *result* of clicking it (`EyeOff` when currently
viewed, since clicking hides it; `Eye` when currently unviewed) — the same icon can legitimately
mean opposite things in a status chip versus an action button, and both readings are intuitive in
context. The header block above the tabs also shows a live unviewed count next to the total entry
count. `onSetViewed` (like `onToggle`/`onDelete`) is a stable callback from the
parent's `useCallback`, so toggling one entry's viewed state doesn't re-render unrelated rows —
only the entry whose own `inquiry` prop actually changed (via `effectiveInquiries`'s per-item
merge) re-renders, preserving the existing per-entry memoization contract.

**Source label (added 2026-09-06):** each row's meta line (below the status badge) appends
`t("ledgerSourceChat")`/`t("ledgerSourceForm")` after the existing `{stamp} · FA/EN` text, reading
the new `inquiry.source` field (`"chat"` from the AI Curator's confirmed lead-capture, `"form"`
from the manual `InquiryForm.jsx` — see `src/app/README.md`'s `/api/inquiry` section and
`src/hooks/README.md`'s `useConcierge.js` entry) — falls back to "form" for any pre-existing
record with no `source` field at all, so old entries render unchanged.

Deletion is a two-step inline confirm inside the open entry
(first click arms for 4s — ref-stored timer, cleaned up on unmount — second click fires
the `deleteAction` server action through the shared `useTransition`, then `router.refresh()`es so
the entry vanishes from the list without a manual reload); the open card carries a subtle
`border-accent/30`. Entry refs render as
`SEC-COM-{sessionRef}` (the same code format `InquiryForm`'s success state shows the
visitor), consultation/appointment labels resolve through the existing concierge
dictionary keys (`privateArchiveAcquisition`/`residentialConsultation`/`florenceViewing`,
`appointmentMode*`, `appointmentSlot*`, `appointmentWindowArrangement`) — the ledger adds
only `ledger*` chrome strings, no new data vocabulary. The unfold is the
`showcase/CollectionPanel.jsx` accordion clip-path idiom (0.8s `[0.16,1,0.3,1]` animate /
0.6s `[0.7,0,0.84,0]` exit) — inside the interactive 300–800ms range, deliberately not
that accordion's 1.1s documented exception. `Intl` stamp formatters are module-cached per
locale (`stampFor`). User-entered visitor data (names, notes) renders in
the inherited body sans — never `.font-serif`/`.font-farsi` pairings, which are for
translated brand content — matching `CuratorChat`'s treatment of user-generated content;
notes go through `wrapLatinRuns`.

---

## Performance Techniques

### `React.memo`
Applied to components whose output is fully determined by stable props or no props. Prevents re-renders when parent state (e.g., `activeTab`, `menuOpen`, `formSubmitted`) changes but the component's own inputs have not.

**Memoised sub-components / shared:** `NavBar`, `CollectionMeta`, `LookbookPoetry`, `TabHeritage`, `AcquisitionCTA`, `SectionHeader`, `SystemPortals`, `JourneyIndex`, `SpecimenGrid`, `MenuControls`, `NoiseBg`. The top-level shells (`Hero`, `Advantages`, `Vision`, `Materials`, `HouseChrome`, `HouseChapterShell`, `HouseDiptychShell`, `AboutChapter`, `StoryValueChapter`, `SustainabilityResponsibilityChapter`, `MaisonButton`, `MaisonReveal`, `InitialLoader`, `Footer`) are also `memo`-wrapped.

### `memo` for tab content
`SpecsTabs` renders the active tab panel through `MemoizedTabContent` (`memo(TabContent)`) inside its `AnimatePresence` switch. Tab panels like `TabHeritage` are static JSX — memoizing the component avoids re-rendering their element trees on every parent render.

### Prop object grouping
`useLightbox` returns ~16 values. Rather than threading each individually through multiple layers, the shell stores the entire return as `const lightbox = useLightbox(n)` and passes it as a single prop. Same for `useShowcase` → `showcase` prop and `useConcierge` → `concierge` prop.

### `NoiseBg` + `ZoomController` isolation
Both are `memo` components that are structurally stable. Isolating them prevents the SVG layout and zoom widget from participating in any surrounding update cycle.

### Single Lightbox source
The `shared/Lightbox.jsx` eliminates the duplicate zoom controller, image transitions, and footer bar that previously existed in two separate files. One update point, zero drift.

---

## Conventions

- **Section eyebrows are plain content-descriptors, one shared type style (2026-09-05).**
  Every home section renders an eyebrow naming what's actually inside it — Vision
  `manifestoBadge`, Showcase `showcaseBadge`, Advantages `advantagesBadge`, Materials
  `materialArchaeology`, Concierge's `SectionHeader` `acquisitionsServices` — never poetic
  vagueness ("نما", "باستان‌شناسی متریال" and "اعتبار متمایز" were removed for this
  reason). The serif `h2` below carries the editorial poetry; the eyebrow is the plain
  label. All five share the identical class set: `text-[length:calc(11px*var(--zaad-font-scale))]
  sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3` —
  keep new sections on it byte-identical (they had drifted 10/11/12px before). Alignment is
  reading-start (`text-left rtl:text-right`), never centered — Concierge's
  `SectionHeader` was de-centered 2026-09-05 so all five land on the same edge. The same
  class set extends past the home page (2026-09-05 standardization pass): `house/HouseDiptychShell.jsx`'s
  `ColumnHeader` eyebrow and `ledger/Ledger.jsx`'s two `ledgerEyebrow` spans use it. The one deliberate exception is
  `house/ChapterPieces.jsx`'s `CrossLinks` eyebrow, which keeps `text-center` — it labels a
  centered sibling-card grid, not a reading column.
- **`Materials.jsx`'s selector cards ride the shared card grammar (2026-09-05).** The three
  material rows are raw `<button>` cards in the house-`CrossLinks`/`SpecimenGrid` hover language:
  `NoiseBg revealOnHover` + accent gradient wash + 2px accent underline draw (touch fallback
  included), `ArrowUpRight rtl:-scale-x-100` view hint, and a specimen number via
  `Intl.NumberFormat(isFarsi ? "fa-IR" : "en-US", {minimumIntegerDigits: 2})` — Farsi gets
  Hindi-Farsi digits, never Latin. The active card keeps the drawn underline +
  `border-accent/50 shadow-ambient`. The old `MaisonButton material-choice` variant is gone;
  `hexaSample` is "مشاهده‌ی نمونه"/"View Sample" with no arrow inside the string.
- **Every custom interactive element needs a visible `focus-visible` ring — never a bare
  `focus:outline-none`.** The sitewide convention (already on most buttons/links) is
  `outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-accent`; on the permanently-dark `Footer.jsx` surface (see the Canvas
  family-locking rule in `src/styles/README.md`) swap the last class for
  `focus-visible:outline-canvas`, matching `shared/SocialLinks.jsx`. A 2026-09-07 a11y pass
  found and fixed several plain `focus:outline-none`/`focus:outline-none focus-visible:border-accent`
  stragglers with no visible replacement at all (`Footer.jsx`'s nav lists,
  `showcase/CollectionTabs.jsx`'s `TabButton`, `showcase/CollectionPanel.jsx`'s specs toggle
  and catalogue link, `Hero.jsx`/`Vision.jsx`/`showcase/ImageViewer.jsx`'s video play/pause
  and dash-selector chips) — check any new icon/text button against this pattern before
  shipping it.
- **Hover-only reveals need a persistent touch fallback.** Any cue styled with only a
  `group-hover:`/`hover:` variant is invisible on phones. Apply the same styles under the
  `[@media(hover:none)]:` arbitrary variant (e.g. `[@media(hover:none)]:opacity-100
  [@media(hover:none)]:scale-x-100`) so coarse pointers see the cue persistently while
  hover-capable pointers keep the elegant reveal. Done for the ZoomController
  (`shared/Lightbox.jsx`), the menu cards' gradient/underline/"View" reveals
  (`header/SpecimenGrid.jsx`, `header/JourneyIndex.jsx`, `header/SystemPortals.jsx`), the
  `house/ChapterPieces.jsx` `CrossLinks` sibling cards (same gradient-wash + underline-draw
  language, shared by all 3 House pages), and the Maximize2 lightbox cues
  (`showcase/ImageViewer.jsx`, `collection/StudioGallery.jsx` —
  both are class-driven off the pane's `group`, not inline `style`, because inline styles beat any
  media-variant class). Tappable tiles pair this with `active:scale-[0.98]` press feedback.
- **`CrossLinks` deliberately has no whole-card or text `translate-y` on hover** — an earlier
  attempt added a card lift plus per-element vertical nudges and the user asked for it reverted
  ("no y-axis move for cards"); only the gradient wash and the underline draw (both
  opacity/`scaleX`, no `translate`) plus the read-more label's horizontal `translate-x` nudge
  survive. Don't reintroduce a `hover:-translate-y-*` here even if `SpecimenGrid`/`JourneyIndex`
  keep their own pre-existing text lift — that's their established look, not a pattern to extend.
  Sub-44px touch controls (e.g. `StudioGallery`'s chevrons and play/pause chip) grow to ≥44×44 on
  coarse pointers via the `data-touch-boost` attribute (must be flex-centered); `data-touch-slop`
  is the invisible ±8px hit-ring alternative where growth would break layout — used for the
  header's Browse/Inquiry buttons (growing them would shift the 61px mobile header height that
  `Hero.jsx`'s and `CollectionPage.jsx`'s top paddings are calibrated to) and the fixed `h-7`
  language/theme pill tracks and font-scale +/− buttons in `header/MenuControls.jsx` and
  `house/HouseChrome.jsx`'s pills, where 44px
  targets would explode the 28px track (both attributes defined in `src/styles/globals.css`). Two
  gotchas: the slop ring is a `::before`, so it is clipped by `overflow-hidden` — the header call
  sites pair it with `overflow-visible!` (MaisonButton's base class otherwise clips it) and it must
  never be used on an element whose `::before` is already decorative; and `MaisonButton` forwards
  unknown DOM props (`{...rest}`) onto its `<button>`, which is what lets `data-touch-*` attributes
  reach the DOM from its call sites at all.
- **Entrance choreography is a per-section reading-order score, never instant.** Every section
  across home, House, and the product page staggers its `MaisonReveal`s so blocks arrive in the
  order they're read: eyebrow/badge first (~0.1s), heading (`lines`) next, supporting text, media
  (`scale-down-unveil`), then trailing details (stats/cross-links/CTAs) — blocks spaced ~0.15s
  apart, totals running ~1–1.5s. `threshold={0.01}` (not the default) on same-viewport groups so
  the whole score fires together on section entry instead of piecemeal; keep the default
  threshold for long stacked lists (mobile editorial columns) so blocks don't reveal far
  off-screen. Interactive areas that remount on user action (Showcase's `ImageViewer` 0.4s /
  `CollectionPanel` 0.6s) stay at tighter delays — a click that re-reveals must feel responsive, not
  sluggish. The two heroes are exempt from `MaisonReveal`: home `Hero.jsx` runs its own GSAP
  badge→title→desc→CTA timeline (gated on the loader event), and `ChapterPieces.jsx`'s
  `ChapterHero` runs the Motion equivalent (0 → 0.1 → 0.3 → 0.5 + 1.8s media settle).
- **No TypeScript.** All files are `.jsx`.
- **No hardcoded colors.** Use semantic tokens (`text-accent`, `bg-surface`, etc.). Exception: `#C5A059` in `header/` sub-components where Tailwind opacity modifiers on `text-accent` are insufficient for hover gradients.
- **No comments** unless the logic would genuinely surprise a reader.
- **Translation keys** via `t("key")` from `useLanguage()`. Never inline English strings in components.
- **Display stills use `next/image`; zoom masters stay raw.** Editorial/atmosphere stills
  (`ChapterHero`'s fallback, `Vision.jsx`'s video-gallery
  pre-mount poster (see below), `StudioGallery`'s main pane + thumbnails) render via
  `next/image` `fill` + `sizes` inside their existing
  relative frames — automatic AVIF/WebP + responsive srcset directly from the local
  `public/image/*`/`public/video/*` file, no `remotePatterns` entry needed. **No remote
  stock imagery anywhere in this codebase** (2026-09-05) — every `next/image`/`<video>`
  source is a local file under `public/`; `next.config.mjs`'s `images.remotePatterns` now
  lists only `ai.google.dev` (the Gemini curator route), the earlier `images.unsplash.com`
  entry having gone unused once the last Unsplash placeholder (three House-chapter
  `heroImage` props) was replaced with local chapter/material stills. The pan/zoom surfaces (`showcase/ImageViewer.jsx`,
  `shared/Lightbox.jsx`) and the 360° spin cover deliberately stay raw `<img>`/`motion.img`:
  they need the full-resolution master (srcset downscaling would blur at zoom stops) and
  drive transforms by the percentage-based pan contracts — don't "modernize" them.
- **`Materials.jsx`'s macro preview is a looping video, not a still** (2026-09-05; `loop`
  added 2026-09-06 by user request) — one
  landscape clip per material sample (`public/video/material/{eucalyptus,stone,leather}.mp4`,
  mapped from the active sample's `id` via a small `MATERIAL_VIDEOS` lookup; re-encoded via
  ffmpeg, audio stripped, faststart, ~0.9–1.6MB each). The frame is `aspect-[1168/784]`
  (the clips' exact native pixel dimensions — the earlier portrait cuts are parked, not
  deleted, in `public/video/material/fallback/` for future use; the frame's aspect
  is set to match the source pixels exactly rather than a generic `aspect-video`, so
  `object-contain` never letterboxes/pillarboxes or crops). The whole detail panel already
  unmounts/remounts per material via the parent `AnimatePresence mode="wait"` +
  `key={active.id}` (a pre-existing pattern, unchanged) — so each selection mounts a brand
  new `<video muted playsInline loop>` element that plays from the start. **The native
  `loop` attribute alone proved unreliable in practice (added 2026-09-07)** — it stayed
  in place, but in real playback the clip was observed freezing on its last frame instead
  of restarting (the exact "frozen still" regression `loop` was originally added to
  prevent), so an explicit `onEnded` handler (`video.currentTime = 0; video.play()`) is
  now the actual mechanism that restarts it; `loop` stays as a harmless native-first
  attempt for browsers where it does work correctly (per spec, `ended` never fires when
  `loop` is honored, so the handler is a no-op there) and a guaranteed fallback where it
  doesn't. The muted+playsInline convention keeps every restart silent either way.
  Since the 2026-09-06 media pass the panel's loading is gated by `hooks/useDeferredMedia.js`
  (default in-view mode, ref on the aspect container): the `<video>` mounts with
  `preload="none"` (poster renders, zero clip bytes — the section is below the fold), raises
  preload to `"auto"` once the container nears the viewport, and its own `onLoadedData`
  handler (gated on `!useReducedMotion()`) starts playback — replacing the old
  `autoPlay={!useReducedMotion} preload="auto"`, which streamed the clip bytes with the
  page load. Playback stays gated on `!useReducedMotion()`, same convention as every other
  autoplaying video in this codebase, and reduced-motion visitors also keep
  `preload="none"` — the poster (each clip's own ffmpeg-extracted first frame) is the
  permanent end state instead of a blank element; the `loop` attribute is inert for them
  since playback never starts.
- **`Vision.jsx`'s stat strip (specialists / made-in-Iran / collections)** is its own inline
  `grid-cols-3` (2026-09-06, user request — was `grid-cols-2 md:grid-cols-3`, leaving the
  third stat alone on a second row on mobile), `gap-4 md:gap-6`, with `text-center
  md:text-start` on the grid container so all three sit centered on one line below `md`
  while desktop keeps the column's start alignment. This is a **bespoke copy, not the shared
  `house/ChapterPieces.jsx` `StatGrid`** (which got the same layout fix the same day for the
  house pages) — it renders plain `t(...)` strings, no count-up; keep the two layouts in sync
  if either changes again.
- **`Vision.jsx`'s original image carousel is commented out (2026-09-05), not deleted** — its
  `next/image`/`AnimatePresence` JSX, state (`utensilIndex`/`slideCount`/`slide`/`slideFits`),
  and derived memos (`numberFormatter`/`frameLabels`/`currentFrameNumber`/`totalFrameNumber`)
  are all preserved as a single commented block in place, alongside a comment listing the
  imports/consts (`motion`/`AnimatePresence`, `SILK_ENTER`/`SILK_EXIT`/`SLIDE_MS`) it needs
  restored to compile again — `next/image`'s `Image` import stays live above it (the static
  poster `<Image>` in the video gallery's not-yet-mounted fallback branch consumes it). `lib/collectionImages.js`'s `resolveHomeUtensilImages()`
  and the `utensilImages` prop chain (`page.js` → `AppShell.jsx` → `Vision.jsx`) are untouched and
  still wired, just unconsumed while the carousel is dormant — see `src/lib/README.md`. It was
  superseded in the same frame slot by an autoplaying video gallery (see below), by explicit user
  request to keep rather than remove the old implementation.
- **`Vision.jsx`'s video gallery** (added 2026-09-05, replacing the image carousel above in the
  same `aspect-[3/4] w-full max-w-[420px]` frame) cycles six clips from `public/video/story/`
  (`story-hood`/`story-oven`/`story-cupboard`/`story-pan`/`story-inbuilt`/`story-light` — mixed portrait/landscape; re-encoded via
  ffmpeg to ~100KB–1MB each, audio stripped, `faststart`, scaled to fit the display frame) via
  `motion.video` elements absolutely stacked and crossfaded on `animate={{opacity, scale,
  clipPath}}` keyed on an `activeStoryVideo` index — never mount/unmount, so all six stay decoded
  (same "opacity/transform/filter, never display" rule as `Hero.jsx`'s crossfade). Advancement has
  no timer: each clip's native `onEnded` event advances the index, cycling forever — a
  full-length-per-clip rotation, not a fixed slide duration. `preload` is staggered exactly like
  `Hero.jsx`: active + next index get `"auto"`, the rest `"metadata"`. A `storyGalleryMounted` gate
  (`IntersectionObserver`, `rootMargin: "0px"` on the frame div) additionally keeps the six
  `<video>` elements out of the DOM entirely until the section actually reaches the viewport edge —
  a `<video>` starts fetching the instant it mounts regardless of `preload`, the same reasoning
  documented below for `showcase/ImageViewer.jsx`'s `canMountSpin` gate. `rootMargin` is
  deliberately `0px`, not a few-hundred-px anticipatory lead: `Vision` sits immediately below
  `Hero.jsx`'s `min-h-screen` section with zero gap, so any positive bottom margin makes the
  observer's expanded zone cover Vision's top edge at `scrollY: 0` — firing on initial paint,
  before the user has scrolled at all, and eagerly fetching all six clips on every page load
  regardless of whether the visitor ever reaches this section. `0px` requires genuine scroll
  progress past the fold before the gate opens. Until then, a `next/image` `fill` + `sizes` of the
  first clip's ffmpeg-extracted first frame (`priority`, matching the old carousel's first-slide
  treatment) fills the frame, so there's no layout shift and no blank gap at first paint.
  `storyGalleryMounted` is sticky (set once, never unset — the six `<video>` elements stay mounted
  and decoded for the rest of the page's life once triggered), but a second, non-sticky
  `storyGalleryVisible` state tracks the *same* observer's live `isIntersecting` value every time it
  fires (the observer is never disconnected) — the play/pause effect gates on
  `isStoryVideoPlaying && storyGalleryVisible`, so playback actually pauses when the section
  scrolls off either edge of the viewport and resumes on return, rather than cycling forever once
  triggered. Each `<video>` also wires `onError={() => handleStoryVideoError(index)}` alongside
  `onEnded` — the handler ignores errors from any clip other than the active one (`index !==
  activeStoryVideo` bails, so a background/preloading clip's error can't hijack the rotation),
  and a failing active clip still advances the rotation on its turn instead of silently
  stalling the whole gallery on a single broken file. A `storyVideoErrorCount` ref stops
  advancing once every clip has failed consecutively (reset by any successful `onEnded`), so a
  misdeployed `public/` can't rapid-loop the gallery. Reduced motion
  reuses the file's existing `useReducedMotion()` value to keep `isStoryVideoPlaying` false (first
  frame sits static, matching `Hero.jsx`). Play/pause reuses `Hero.jsx`'s `heroPauseVideo`/
  `heroPlayVideo` i18n keys and its static `canvas`/`foundation` token pair (legible over
  unpredictable footage regardless of theme) — no new translation keys added.
- **`Vision.jsx`'s carousel is a fill-driven cinematic sequence, not a timed crossfade** (describes
  the commented-out block above, kept for when/if it's restored) —
  per slide, two nested Motion wrappers split the transform work: the outer "silk veil" enters
  from `clipPath: inset(30% 12% 30% 12% round 18px)` + `scale: 0.94` + `opacity: 0` to full
  (`inset(0 … round 6px)`), and is a flex-centering layer — the slide's photos have wildly
  different aspects (0.4–1.75 vs the frame's 3:4), so the *inner* drift wrapper hugs each
  image's own `{src, width, height}` (from `resolveHomeUtensilImages`) via `aspect-ratio`
  plus one explicit dimension, and carries `overflow-hidden rounded-md`: that hugging box
  is where the sitewide 6px radius becomes visible — a frame-level radius would only round
  the letterbox, never the photo. Unknown dimensions degrade to the old fill-the-frame
  render (no radius)
  over 1.9s on `ease: [0.19, 1, 0.22, 1]` (the `--couture-ease` value, as a Motion array since
  Motion doesn't read CSS custom properties), staggered 250ms behind the outgoing slide's pure
  1.6s fade (`ease: [0.7, 0, 0.84, 0]`) so the incoming image stays the deliberate moment; the
  inner wrapper is a bounded per-slide drift (`scale: 1 → 1.035`, `y: -1%`, linear, 7s) — the
  Motion-driven stand-in for `lux-ken-burns`, which stays banned here (GSAP-pinned column) —
  and nesting is what keeps the veil's scale and the drift's scale from fighting over one
  transform. Advancement has no timer: the active progress-rail hairline fills with
  `bg-accent` over 7s and its `onAnimationComplete` advances the index (background-tab rAF
  pause pauses the show for free; a manual jump unmounts the filling span, killing its
  callback — no double-advance). A hidden `next/image` of slide `i+1` prewarms the optimized
  asset so no unveil lands on an undecoded blank. Museum chrome inside the frame: a serif
  chapter numeral "01 / 06" top-start (crossfade per slide; digits via
  `Intl.NumberFormat(isFarsi ? "fa-IR" : "en-GB", {minimumIntegerDigits: 2})`) and a clickable
  hairline rail bottom-start (`aria-current`; labels via the `storyFrameLabel` i18n key with
  `{index}`/`{total}` `.replace`d at the call site — `t()` does not interpolate). Under
  `prefers-reduced-motion` (`useReducedMotion()`): static image, static numeral, static accent
  rail, no advancement. The Image's old `hover:scale-105` classes are gone — the drift owns the
  scale story now. This still mirrors `globals.css`'s `silkUnfurl`/`.animate-silk-reveal`
  keyframe family; that CSS class itself still has no live call site. If a future component
  wants this same "silk unveil" feel without needing an exit phase, reach for the CSS class
  directly rather than re-deriving the values a third time.
- **`Vision.jsx`'s section entrance is a single choreographed score, not per-block reveals.** The
  text column has no wrapper reveal — each block carries its own `MaisonReveal` with
  `threshold={0.01}` so the whole score fires together the moment the section enters view
  (right after the hero): eyebrow (`unveil`, 0.1s) → title (`variant="lines"`, 0.3s) → image
  column (`scale-down-unveil`, 0.3s) → quote (0.5s) → divider (0.65s) → paragraphs (0.75s) → stat
  cells (0.9/1.05/1.2s) → caption card (`slide-up-royal`, 1.3s); the numeral/rail mid-score
  entries (0.55s/0.7s) belonged to the now-commented-out carousel above — the video gallery's
  play/pause control has no reveal delay of its own, it renders inline once the section's
  `IntersectionObserver` gate fires. All reveals are transform/opacity-only, so the
  GSAP pin's `offsetHeight` math is unaffected. Keep delays in reading order when editing —
  the deliberate ~1.3s unfold is the point ("must not load fast, with grace").
- **`Footer.jsx`'s directory grid and legal strip each arrive via their own `MaisonReveal`**
  (`unveil`, 0.1/0.35, `threshold={0.01}`) since 2026-09-03, when it was the only section on any
  route with no entrance score. (A live Florence-studio-hours clock — `atelierClock*` i18n keys,
  computed client-only on a 30s interval — lived in this same brand column through 2026-09-04;
  removed by explicit user request, not a bug fix. If a similar always-current, client-only,
  no-hydration-surface display is needed again, the `useState(null)` mount-guard idiom it used is
  still the right shape — see `ChapterHero`'s `activeVideo` for the same idiom elsewhere.)
- **Footer route/link audit (2026-09-05)** — `Footer.jsx`'s Blueprints column (heading key
  `footerBlueprintTitle`, "Studio Archives"/"آرشیو" — the fa value was shortened from
  "آرشیو فنی استودیو" on 2026-09-07 by user request, en untouched; first column since the
  2026-09-06 reorder to Blueprints → House → Showroom → Connect, per user request — was third
  before; demoted back to third on 2026-09-07 when the menu-mirror reorder made the column order
  Main Page → Other Pages → Archives → Connect — see the menu-mirror bullet below) gained a
  `footerFullLookbook`
  link to `/showcase/index.html` (new tab). (The since-deleted `house/HouseFooter.jsx`'s
  Showroom Directory column had reused the exact same `footerPhilosophy`/
  `footerCollection`/`footerConcierge`/`zaadAtAGlance` keys, in the same order, as
  `Footer.jsx`'s own — the key-sharing convention survives its deletion in the 2026-09-06
  one-footer pass.) The machine `sitemap.js` was audited
  in the same pass and already lists every real route correctly (including `/glance`,
  `/showcase/index.html`, and all dynamic `/collection/{id}` routes) — no changes needed there.
  (This same pass briefly restored a `setActiveTab("blueprint")` button in this column, since
  `Blueprint.jsx` had zero reachable entry points anywhere in the app; the button and the page
  itself were both removed the next day — see below — so this column was back to `zaadAtAGlance`
  + `footerFullLookbook` (later 2026-09-07: `zaadAtAGlance` moved to the Other Pages column as its
  first entry by user request — see the menu-mirror bullet — leaving this column
  `footerFullLookbook` ("Digital Catalogue") + the four collection-name links). The static
  `footerMilanZAAD` atelier line that used to close this column
  moved to the brand column on 2026-09-07 — see the sync bullet below.)
- **`Blueprint.jsx` and its footer entry point were removed (2026-09-06), by explicit user
  request** — the page (`t("zaadBlueprint")`, a GSAP-pinned nav column + article panel reading
  from the now-deleted `blueprintSections` dictionary array), its `AppShell.jsx` tab branch, and
  the `Footer.jsx` button/`footerBlueprintLink` key are all gone; `studioArchives`,
  `blueprintIntroText`, `exploreBriefingFiles`, `chapterFile`, `statusCompliant`,
  `blueprintSystemTags`, and `glanceTeaser` (the removed page's only consumer) were removed from
  `en.js`/`fa.js` alongside it, since none had any other caller. GSAP is back down to three
  authorized spots (`Hero.jsx`, `Vision.jsx`, `ChapterHero`) — see the GSAP note below and
  CLAUDE.md. Don't reintroduce any of this without direct instruction.
- **Footer words mirror the header menu (2026-09-07, user request — revised twice same day; this
  is the final state).** Column order is now Main Page → Other Pages → Studio Archives → brand:
  the first column's heading IS the Main Page link — a `button` styled like the other columns'
  h4s (later same day: user collapsed the duplicated "Main Page" heading + first list item into
  one clickable title) running `handleMainPage` (branches on the same `onScrollToSection`
  truthiness guard as `handleSection`: when present, `setActiveTab("showroom")` +
  `onSelectProduct?.(null)` + `animateScrollToTop(1400)` behind the same 100ms lead-time as
  `handleSection`; routes that pass neither prop, i.e. the House layout, fall back to
  `router.push("/")` directly). **`onSelectProduct` (fixed 2026-09-07)** is a third prop now
  threaded into `Footer` from both `AppShell.jsx` (`setSelectedProduct`) and
  `collection/[slug]/CollectionPageClient.jsx` (its own `onSelectProduct`, which
  `router.push`es to `/collection/{id}` or `/`) — the same dual-context "go home" recipe
  `Header.jsx`'s `handleBrandClick` already used (clears the in-app product view on `AppShell`,
  navigates to `/` on the product-page route). Before this fix `handleMainPage` only ever called
  `animateScrollToTop`, which on `/collection/[slug]` (where `onScrollToSection` is a real,
  truthy `router.push`-based function per the note above) just scrolled the outgoing product
  page to its own top instead of returning to the homepage — the button silently did nothing.
  With the list below reading, in homepage order, Our Vision
  (`manifestoBadge`) → `#vision` (2026-09-07: the Story section was renamed Vision — see the
  rename bullet below; `manifestoBadge` now reads "Our Vision"/"نگاه ما"), CURATED COLLECTION
  (`menuCuratedSpecimens`) → `#collection`, Advantages (`advantagesBadge`) → `#advantages`, and
  ZAAD - Digital Curator (`zaadDigitalCurator`, wrapped in `wrapLatinRuns(...)` for the Latin
  "ZAAD" run inside the Farsi label) → `#concierge`. The second column's heading is
  `menuJourneyIndex` ("OTHER PAGES"/"سایر صفحات") over `zaadAtAGlance` → `/glance` (moved here
  as the column's first entry from the Archives column, 2026-09-07, user request) followed by
  the menu's three journey labels
  (`menuOriginsPhilosophy`/`menuStoryBrandValue`/`menuSustainabilityResponsibility`) — and
  since 2026-09-07 (later same day, user request) `house/HouseChrome.jsx`'s NAV array uses those
  same three keys too, so the House header's current-page label reads identically to menu +
  footer; `footerAboutUs`/`footerStoryBrandValue`/`footerSustainabilityResponsibility` were
  deleted from `en.js`/`fa.js` (HouseChrome was their last caller). `footerPhilosophy`/
  `footerCollection`/`footerConcierge`/`footerHouseDir`/`footerShowroomDir` are all deleted
  (Footer was their only caller). The static `footerMilanZAAD` atelier line (since 2026-09-07 a
  single word: "Tehran"/"تهـران" — earlier "Materials"/"متریال", before that "ZAAD Atelier —
  Tehran"/"کارگاه متریال — تهران") lives in the brand column directly under the ZAAD wordmark
  and ABOVE the social block, as the first of two separate `<p>` rows (each `text-xs font-mono
  tracking-widest uppercase text-canvas/40 block select-none mb-4` — the `mb-4` provides the
  gap; explicit classes since they no longer inherit the archives ul's styling), each led by a
  custom glyph `<sup>`: `𖡡` before the label row, `🕻` before the phone row. The social block
  below renders no visible "Connect With Us" label — only a `⌕` glyph `<sup>` whose `title`
  tooltip carries `t("footerConnectWithUs")`,
  directly above `SocialLinks`. Same day (2026-09-07), three additions from the
  footer audit: (1) the phone placeholder row directly below the atelier label —
  `<sup> 🕻 </sup> <span dir="ltr">{t("studioPhone")}</span>` (the `dir="ltr"` wrapper
  is mandatory for space-separated digit groups under RTL — see the standing rule in
  CLAUDE.md and `src/lib/i18n/README.md`; no `.font-latin`, it lacks Persian digit glyphs),
  reusing the shared placeholder number key (swap
  `studioPhone` once the real number exists; fa renders Hindi-Farsi digits); (2) the Main Page
  column gained a Materials entry (`materialsBadge`, shortened same day from
  "Material Analysis Core"/"هسته‌ی تحلیل متریال" to just "Materials"/"متریال" by explicit user
  demand — don't re-embellish it) after Advantages — first as a
  `ADVANTAGES | MATERIALS` single line, then reverted same day to one entry per line by user
  request — Materials needed a new `id="materials"` on its `<section>` (it was the
  only homepage section with no anchor, unreachable from any nav); (3) the Archives column's
  `footerFullLookbook` value was renamed to "Digital Catalogue"/"کاتالوگ دیجیتال"
  (user request, same key) and
  all four collection names follow it, each on its own line (revised same day from a
  `|`-separated single line the user found ugly), each a
  `<Link href={/collection/${item.id}}>` rendering `wrapLatinRuns(item.name, isFarsi)` (codes
  stay Latin in Farsi) at one font level smaller than the column's other links
  (`text-[length:calc(11px*var(--zaad-font-scale))]`, rtl `13px`) — the data comes from
  `useLanguage().data("collection")` via the same
  `useMemo` + module-level `EMPTY_ARRAY` pattern as `Showcase.jsx`. The footer must stay
  layoutId-free — it renders on all 5 host routes.
- **The homepage Story section is now Vision (2026-09-07, user request — full rename, names stay
  consistent at every level).** The section was `Story.jsx` with `id="story"`, eyebrow
  `manifestoBadge` = "Our Story"/"داستان ما", and a Hero CTA (`ourPhilosophy` = "Our Heritage &
  Vision"/"میراث و نگاه ما") scrolling to it — three names for one destination. Final state: file
  `Vision.jsx` (internal `function Vision` + `React.memo(Vision)` — file name = primary export),
  `id="vision"`, eyebrow `manifestoBadge` = "Our Vision"/"نگاه ما", Hero CTA `ourPhilosophy` =
  "Our Vision"/"نگاه ما" (key name unchanged — hero CTA and section eyebrow are legitimately
  separate keys), `AppShell.jsx`'s `handleScrollToVision` + `onScrollToVision` prop chain,
  `Footer.jsx`'s `handleSection("vision")`. The internal data keys (`storyTitle`, `storyQuote2`,
  …) keep their names — they're content, not navigation (`storyQuote`, the section's original
  quote key, now sits dead in both dictionaries with no caller). **The House `/story` route is a
  different destination ("Story & Brand Value") and was deliberately NOT renamed** — its
  `aboutSections` data id `"story"` and `menuStoryBrandValue` are the House chapter, untouched.
  GSAP spot #2 moved with the file: it's `Vision.jsx`'s pinned image column now (CLAUDE.md and
  the styles/app/hooks/lib READMEs were all swept in the same pass).
- **"Digital Catalogue" is the single name for the static lookbook (2026-09-07, user decision).**
  Every catalogue-named surface reads "Digital Catalogue"/"کاتالوگ دیجیتال": the menu card
  (`menuZAADCatalogue`, en was "ZAAD Catalogue"), the footer Archives link
  (`footerFullLookbook`, en was "Full Lookbook" then briefly "Catalogue"), the showcase specs
  drawer's link button (`showcaseRevealDossier`, was "VIEW IN CATALOGUE") and its side sentence
  (`showcaseCatalogueText`, "master catalogue" → "digital catalogue"). The menu card was also
  rewired to actually open `/showcase/index.html` — see the `SystemPortals.jsx` row above; the
  hook's `"pdf"` tab special-case is gone (`useShowroomNav` accepts `"showroom"` only again).
  The one remaining "Catalogue" word in English copy is `monograph` ("Comprehensive
  Catalogue", the Hero bottom-bar button that scrolls to `#collection`) — deliberately left:
  it names a different destination (the in-app collection section, and its fa value is
  "مجموعه‌ی منتخب", no catalogue word at all); renaming it to "Digital Catalogue" would
  misdescribe what it does. The menu card was kept per explicit user instruction after being
  flagged dead in the 2026-09-07 audit.
- **The `©` at the start of the copyright line is a deliberate hidden link to `/ledger`**
  (added 2026-09-03 as a separate trailing `·` character; moved onto the `©` glyph itself
  2026-09-04, dropping the extra `·` entirely) — `Footer.jsx` splits `footerCopyright`'s
  leading `"© "` off the translated string (`.replace(/^©\s*/, "")` after the `{year}`
  substitution) so the `©` can render as its own `<Link href="/ledger">`, with the rest of
  the copyright text following as plain text — don't "clean up" the split back into one
  string. It carries `aria-hidden="true"` + `tabIndex={-1}` so it's invisible to screen
  readers and removed from keyboard tab order — the only way to find it is knowing it's
  there and clicking it — but unlike the resting-state-only treatment the old `·` had, this
  one *does* carry `hover:text-accent` (by explicit user request 2026-09-04): resting
  `text-canvas/40` blends into the surrounding copy exactly as before, and only reveals
  itself in gold on hover to a visitor who happens to run their cursor over that one
  character. This is intentional: `/ledger` (see `src/app/README.md`'s "The `/ledger`
  route") is a real, key-gated admin page, and the site deliberately has **no visible/
  discoverable link to it in any nav or menu** — the owner can just bookmark the URL
  directly instead.
- **`"use client"`** on shell files only. Sub-components and `shared/` files inherit the client boundary from their parent shell.
- **`MaisonButton` — always pass `icon` explicitly**, don't rely on the fallback. Its
  `getRelevantIcon(label)` guesses an icon by matching *English* substrings in the label text
  (`"inquiry"` → `Sparkles`, `"submit"` → `Send`, etc.) — it silently stops matching anything the
  moment the label is Farsi (or any English wording it wasn't written for), and previously left
  most buttons in the app on the generic `ArrowUpRight` fallback in Farsi regardless of the
  button's actual purpose. `icon` (a Lucide component) takes priority over that guess when
  provided; `getRelevantIcon` now exists only as a same-language fallback for calls that don't
  pass one. Every non-`hideIcon`, plain-string-children call site in the
  app has been given an explicit, purpose-matched icon (e.g. `Sparkles` for inquiry/concierge
  CTAs, `Send` for form submit, `RefreshCw` for form reset, `ArrowLeft` for "return/back",
  `ArrowDown` for in-page scroll-to-section, `Eye`/`Layers`/`RotateCw` for editorial/macro/360°
  view toggles, `Compass`/`Sparkles` for explore/story CTAs) — keep new buttons consistent with
  that mapping rather than inventing new icon meanings per call site.
- **`MaisonButton`'s hover reflection is motion-value-driven, not state** (2026-09-06).
  `handleMouseMove` writes the pointer position into `reflectionX`/`reflectionY`
  `useMotionValue`s composed by a `useMotionTemplate` into the radial-gradient string —
  zero React re-renders per pointer move (previously a `reflectionPos` state fired one
  render per mousemove). The magnetic drift values already worked this way; if you touch
  this handler, keep everything on motion values — don't reintroduce per-event `setState`.
- **`MaisonButton`'s optional `iconClassName` prop** styles just the icon (appended after the
  RTL flip class in both the resting and hover-accent copies). Added for the send buttons
  (2026-09-06, user request "rotate 45° so they don't point toward the sky"): `Send`'s
  paper-plane points ↗ by default; `iconClassName="rotate-45"` levels it to point → in
  English. **Farsi needs a counter-rotation** (2026-09-06, found live): with just the auto
  `rtl:-scale-x-100` mirror, the icon rendered ↗ → mirror (NW) → +45° rotation = straight ↑
  ("toward the sky") — Tailwind v4's scale applies *before* its rotate in the final transform,
  so the rotation direction must be flipped too: the send buttons carry
  `rtl:-rotate-45` alongside the mirror (mirror NW → −45° = ←, horizontal). fa must point
  180° opposite en — the regular icons-point-left-in-Farsi rule, not an exception. Any rotated
  + mirrored icon needs the same `rtl:-rotate-<same-angle>` counter-rotation; `CuratorChat.jsx`'s
  raw send chip mirrors this inline (`rotate-45 rtl:-rotate-45 rtl:-scale-x-100`); keep the two
  in sync. An earlier `flipIconInRtl` opt-out prop (unmirrored send in fa) was added and then
  removed the same day when the user reversed the direction — do not re-add it.
- **`MaisonButton`'s optional `labelClassName` prop** styles just the label span (both the resting
  and hover-accent copies, since the label renders twice — see the RTL note above) without
  touching the icon or the button's own `className`. Added for `showcase/ImageViewer.jsx`'s three
  view-mode pills (Editorial/Macro/360°): three `flex-1` pills with full label text have no room on
  a ~375px phone (`whitespace-nowrap` + `overflow-hidden` means text clips silently, not wraps or
  ellipsizes) — `labelClassName="hidden sm:inline"` collapses each pill to icon-only below `sm`,
  paired with an explicit `aria-label` on the button itself so the control stays accessible with no
  visible label. Two view-mode pills (the pre-existing Editorial/Macro pair) had enough room without
  this; don't reach for it below three pills in a row unless the same width math actually fails.
- **`MaisonButton`'s two label-row spans (`renderContent()`'s plain-string branch) carry `w-max`.**
  Without it, the row (`flex items-center justify-center ... whitespace-nowrap`, no explicit width)
  under-computes its own shrink-to-fit width by ~15-22px versus its actual content (label +
  `tracking-[0.2em]` letter-spacing + icon) — a real browser sizing quirk that shows up specifically
  because this row sits inside a `transform`ed (`translateY`, for the hover slide-reveal) ancestor
  that's itself inside the button's own `overflow-hidden`. The whole button inherits that
  undersized width, so its `overflow-hidden` clips the centered content's edges — visually, the
  label's first character gets eaten and the icon gets squeezed (reported live as "EXPLORE THE
  COLLECTIONS" rendering as "XPLORE THE COLLECTIONS"). Confirmed and fixed by rendering the actual
  page (Playwright against the running dev server) and measuring `getBoundingClientRect()` before
  and after. `display: inline-flex` also fixes the width measurement but was rejected — it turns
  the two label-row spans into inline-level boxes, which then flow side-by-side in the parent's
  normal flow instead of stacking vertically for the hover reveal (visually confirmed as both
  label copies showing at once). `w-max` fixes the sizing while staying `display: flex`
  (block-level), preserving the stack. Both rows also carry `mx-auto`: for a default/auto-width
  button the ancestor chain is itself shrink-to-fit, so the row already sits flush with no spare
  space and `mx-auto` is a no-op — but for a caller that puts `w-full`/`flex-1` on the button
  itself (`showcase/CollectionPanel.jsx`'s Private Inquiry CTA, `collection/CollectionMeta.jsx`'s
  and `concierge/InquiryForm.jsx`'s submit buttons, `showcase/ImageViewer.jsx`'s mode pills), the
  button's width becomes definite and its `width:auto` block-level ancestors (the two wrapping
  spans) resolve to fill 100% of it — leaving the now-`w-max` row narrower than its parent with
  nothing to center it (block boxes don't auto-center; `justify-center` on the row itself only
  centers content *within* the row, which is moot once the row equals its content's width).
  `mx-auto` restores centering in that case by giving the row's own even auto-margins something to
  distribute. Keep `w-max` **and** `mx-auto` together on both rows if this component is ever edited.
- **A single forward-pointing icon always points left in Farsi**, regardless of which direction it
  points in English — this is the opposite of "mirror to the visual opposite." Applies to a lone
  directional icon with no paired counterpart on screen: a left-pointing icon (`ArrowLeft` "back")
  stays unrotated; a right-pointing one (`ChevronRight` "continue", `ArrowUpRight`) gets
  `rtl:rotate-180` (straight left/right icons) or `rtl:-scale-x-100` (diagonal icons, e.g.
  `ArrowUpRight` in `MaisonButton.jsx`, `house/ChapterPieces.jsx`, `showcase/CollectionPanel.jsx`,
  `Send` in `concierge/CuratorChat.jsx`'s chat send button — a
  diagonal needs a mirror, not a 180° spin). `MaisonButton.jsx` renders its label/icon pair
  **twice** (default + hover-revealed accent copy, both always mounted); both copies need the RTL
  class or the icon flickers back to its English direction on hover. `getRelevantIcon` in
  `MaisonButton.jsx` only matches English label substrings, so almost every Farsi-labeled button
  falls through to the default `ArrowUpRight` — that fallback needs the mirror too, not just the
  semantic icons.
- **A prev/next PAIR is the opposite case — neither chevron rotates, in either language.**
  `ChevronLeft`/`ChevronRight` carousel buttons (`shared/Lightbox.jsx`'s main nav arrows and its
  `ZoomController`'s inline pair, `showcase/ImageViewer.jsx`, `collection/StudioGallery.jsx`)
  sit at fixed physical `left-*`/`right-*` positions that never reposition under `dir="rtl"` (only
  logical `start-*`/`end-*` would move them, and these deliberately don't — the left button is
  always "go back", the right button always "go forward", regardless of language). An earlier
  version applied the single-icon rule here too (`rtl:rotate-180` on the right chevron only), which
  made both buttons point left in Farsi — visually indistinguishable, confirmed as a real usability
  bug in testing. The fix: drop the `rtl:rotate-180` entirely from the "next" chevron in every pair
  above. Each button's icon direction is now constant across both languages, matching its constant
  physical position — don't reintroduce the mirror on a paired chevron even though the single-icon
  rule above still applies to unpaired ones.

  **A second, subtler way to break this rule: a plain `flex` row's main axis is itself
  direction-relative, independent of any explicit `rtl:` class (found and fixed 2026-09-07).**
  `shared/Lightbox.jsx`'s `ZoomController` renders its inline prev/zoom-preset/next cluster as a
  plain `<div className="flex items-center space-x-4">` — CSS's `flex-direction: row` (the
  default) resolves against the inline/writing direction, so under `dir="rtl"` the browser
  itself visually reverses which end is "first," with zero explicit RTL styling needed to
  cause it. Unlike the physically-absolute-positioned pairs above (immune to this because
  `position: absolute` + physical `left-*`/`right-*` don't consult `dir` at all), this inline
  toolbar's prev/next buttons swapped screen sides under Farsi — while each icon still pointed
  its original, un-rotated direction — reproducing the exact "left arrow points right, right
  arrow points left" symptom this whole rule exists to prevent, just via a different mechanism
  (container reversal instead of icon rotation). Fix: `dir="ltr"` on that specific inner row
  (`shared/Lightbox.jsx`), pinning its physical layout regardless of page direction — the
  outer wrapper (with its logical `ps-3`/`pe-2`/`border-s`/`me-1` padding, which should keep
  mirroring to stay aligned with `ExpandOnHoverPill`'s own `isRtl`-driven expand direction) is
  untouched. Any other prev/next pair sharing one flex-row parent (not just two independently,
  physically positioned buttons) needs the same `dir="ltr"` pin — check for this shape
  specifically, since it produces no lint warning and no explicit `rtl:` class to grep for.
- **`wrapLatinRuns(text, isFarsi)`** (`src/lib/README.md`) — auto-wraps Latin runs embedded
  inside otherwise-Farsi prose (`item.description`, `item.story`, material/appliance names, …)
  in a `dir="ltr" className="font-serif"` span — bidi isolation plus the site's brand-identity
  look, not the monospace `.font-latin` treatment.
  Call it at the final render site for any dictionary/data string that might mix scripts —
  don't hand-wrap individual substrings in new components when this exists.
- **`.font-farsi` / `.font-latin`** (see `src/styles/README.md`) — opt-in Dorsa for translated
  non-heading `.font-serif` text (card/box titles), and the inverse opt-out back to Latin for
  fields that are Latin in both dictionaries (collection `number`, `year`, `name`). Check which
  one a given field needs before styling new Farsi-adjacent text — most bugs here come from
  assuming an ancestor's `.font-mono`/`.font-sans` class is harmless when the child is actually
  permanently-Latin brand content.
- **Collection `number` codes ("C°01"–"C°04") always render as `font-serif font-latin`**
  (2026-09-07, user request — standing rule, applies automatically to every future rendering
  site, the user will not re-mention it). Several sites had them inheriting a mono context;
  all were normalized to the `SpecimenGrid.jsx` pattern. Current render sites:
  `header/SpecimenGrid.jsx`, `showcase/CollectionTabs.jsx` (also gained the missing
  `font-latin` — the code was falling into the Farsi font), `showcase/CollectionPanel.jsx`'s
  `<sup>`, `showcase/Lightbox.jsx` + `collection/Lightbox.jsx` (both via
  `shared/Lightbox.jsx`'s `archiveNumber` span), `collection/CollectionMeta.jsx`,
  `collection/NavBar.jsx`, `glance/GlanceChapter.jsx`, `glance/GlancePage.jsx`.
- **Tailwind v4's `space-x-*`/`space-y-*` compile to logical properties** (`margin-inline-start`/`end`
  on `> :not(:last-child)`), so they already auto-mirror under `dir="rtl"` — never pair them with
  `rtl:space-x-reverse`. That's a v3-era idiom; under v4 it flips the margin back to the *wrong* side,
  producing a missing gap plus a spurious edge margin in Farsi only. If a gap looks wrong in RTL,
  the fix is almost always something else (a hardcoded `left-*`/`right-*`, `pl-*`/`pr-*`, or `ml-*`/
  `mr-*` nearby) — check for those before touching `space-x-*`.
- **`header/MenuControls.jsx`'s `md:rtl:flex-row-reverse`** — Tailwind's default RTL behavior
  already mirrors a `flex-row`'s child order (first DOM child moves to the physical right). This
  component explicitly cancels that so the language/theme control pills stay physically on the
  right and the copyright/edition text stays physically on the left in both languages — a
  deliberate exception, not the default `flex-row` RTL behavior other rows in this codebase rely on.
- **GSAP is scoped, not a site-wide replacement for `motion`.** `MaisonReveal`/`motion` (via
  `motion/react`) remains the animation system for every scroll-into-view reveal and interactive
  state across the app. `gsap` (added as a real dependency, `gsap.registerPlugin(ScrollTrigger)`
  guarded behind `typeof window !== "undefined"`) is used in exactly three places, all for effects
  `motion` cannot do natively: `Hero.jsx` drives its badge/title/paragraph/CTA entrance as one
  coordinated `gsap.timeline()` (via `gsap.context()` for cleanup) instead of four separately-delayed
  `motion` elements — gated behind the `zaad:loaderComplete` event / `zaad_loader_complete`
  sessionStorage flag (see the `InitialLoader.jsx` note below) so it plays *after* the loader clears,
  not invisibly underneath it (plus, since 2026-09-03, its scrubbed scroll-away duet — see the
  Scroll-away duet note in Hero's section); `Vision.jsx` pins its image column (`ScrollTrigger.create({ pin: ... })`)
  while the taller text column scrolls past it (since 2026-09-05, the same `matchMedia` block also
  scrubs a subtle `scale: 1 → 1.06` zoom, `scrub: 0.6`, on the video gallery's frame div via a second
  `gsap.fromTo` sharing the pin's trigger/start/end — an additional tween inside this existing
  authorized spot, not a new usage site; it targets the frame div, never the same node any
  `motion.video` child animates, so GSAP and Motion never fight over one `transform`); and
  `house/ChapterPieces.jsx`'s `ChapterHero` runs a scrubbed (non-pinned) parallax on its media column
  via `gsap.fromTo` + `scrollTrigger: { scrub }` — see the `ChapterHero` section above for the exact
  refs/tween. (`Blueprint.jsx` pinned its section-nav column the same way `Vision.jsx` does; the page
  and its footer entry point were removed 2026-09-06 by explicit user request — don't reintroduce
  without direct instruction.) All these usages: guard
  on `prefers-reduced-motion` locally (same pattern as `shared/CustomCursor.jsx`, not the app-wide
  `MotionConfig`), scope any `ScrollTrigger` to `lg:` and up via `gsap.matchMedia()` when the desktop
  layout differs from the stacked mobile one, and clean up on unmount (`ctx.revert()` /
  `trigger.kill()` inside the `useEffect` return). Do not reach for `gsap` for a plain fade/slide
  reveal — that is what `MaisonReveal` variants are for; only add a new `gsap` usage for a genuine
  timeline-sequencing or scroll-pin need `motion` cannot express. `Vision.jsx`'s pinned column and its
  sibling scrolling column both carry an explicit `lg:col-start-*` (not
  just `lg:col-span-*`) — when `ScrollTrigger` pins a grid item with `pinSpacing: false`, the browser
  sets `position: fixed` on it directly (no spacer element), which per the CSS Grid spec removes it
  from grid-item auto-placement entirely; without an explicit start line the sibling column would
  auto-place itself into column 1 the moment the pinned item is fixed, since the algorithm treats it
  as if it weren't there. Keep both columns' start lines explicit if this pin is ever restructured.
- **`InitialLoader.jsx`'s loader-complete signal.** The full-screen brand reveal
  (`#zaad-loader`, `z-[9999]`) shows on a user's first load this session (tracked via the
  `zaad_initial_loaded` sessionStorage flag, which is set the instant the loader *starts*, not when
  it finishes — do not use it to detect completion). Its duration is readiness-based, not a fixed
  5s: it exits once BOTH a minimum brand time has elapsed AND a readiness promise resolves — the
  minimum is **derived from the entrance variants themselves** (`ENTRANCE_DONE_MS`, the max of the
  letters' staggered end and the accent line's `delay + duration` ≈ 3.7s — changed 2026-09-07 from a
  hardcoded 2400ms that cut the line's draw mid-stroke; deriving it keeps the exit auto-synced with
  any future variant edit), so the loader's own animation is always complete before the veil
  dissolves. The readiness promise is a
  `Promise.all` of `document.fonts.ready` (skipped when `document.readyState === "complete"` on
  mount, since the load/fonts have already settled), the **`window` `"load"` event** (added
  2026-09-06, user request "make timing perfectly sync": the loader now holds until the page's
  eager resources — above-fold images, the hero's `preload="auto"` clip — have actually settled,
  so its exit reveals a fully loaded page instead of fading over one still loading; lazy media
  `preload="none"` never blocked it anyway), and a double `requestAnimationFrame`. The old hard
  5000ms cap was **removed** for that sync — `window.load` itself is the terminal condition
  (it fires even when resources error out; only a genuinely hanging request can delay it, and
  the browser's own stall timeout ends that) — **but that removal proved fragile in practice
  (2026-09-07: a hanging/slow load event — it waits for every subresource incl. the hero's
  `preload="auto"` clips — left the opaque veil up indefinitely = white page until refresh), so the
  load-wait is now raced against `LOAD_WAIT_CAP_MS` (`ENTRANCE_DONE_MS + 2000`, ≈ 5.7s): a fast
  `load` still gates the exit (the 2026-09-06 sync intent), a slow one can extend the veil past
  the entrance but never hang it.** A second, pre-JS backstop lives in the loader's inline script:
  10s after HTML parse, if `zaad_loader_complete` is still unset (dev chunk timeout → hydration
  never ran, or any other dead-JS stall — the SSR veil renders opaque with its letters at
  `opacity: 0`, i.e. a blank screen), it adds the existing `skip-loader` class to `<html>` so the
  CSS kill-switch (`display:none`) drops the veil without touching the DOM — hydration, if it
  arrives later, simply runs the loader hidden and hands off normally, no mismatch.
  `prefers-reduced-motion: reduce`
  skips the minimum brand time (exit as soon as ready). All timers are guarded by a done-flag so
  completion fires exactly once and is fully cleaned on unmount. On completion it sets a **separate**
  `zaad_loader_complete` flag and dispatches a `window` `"zaad:loaderComplete"` event. Any entrance
  animation that must not run invisibly underneath the loader (currently `Hero.jsx`'s GSAP text
  timeline **and** its video wrapper's scale/fade, both driven by the same `stageReady`/`playTimeline`
  gate — added 2026-09-07 so the video assembles as the veil lifts instead of its entrance being spent
  under the opaque overlay; `showcase/ImageViewer.jsx`'s `canMountSpin` follows the identical pattern)
  should check `zaad_loader_complete` synchronously on mount (repeat loads within the session skip
  the loader, so the flag is already true) and otherwise listen for `"zaad:loaderComplete"` once.
