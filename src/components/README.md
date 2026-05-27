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
import NavBar from "./productdetailspage/NavBar";
import CollectionTabs from "./showcase/CollectionTabs";
import SharedLightbox from "../shared/Lightbox";
```

Never use barrel files or index re-exports in companion folders — direct path imports only.

---

## Shared Components (`shared/`)

These are the only components intentionally designed to be consumed by multiple unrelated component trees.

### `shared/Lightbox.jsx`

The single cinematic lightbox implementation used by **both** `ProductDetailsPage` and `Showcase`. Accepts a flat, explicit prop contract — no knowledge of the calling context.

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

Prop contract (optional):
  noiseOverlay = false    ← Showcase sets true; PDP omits
  showPanHint  = false    ← PDP passes (lightboxScale > 1)
```

The thin wrapper files in `productdetailspage/Lightbox.jsx` and `showcase/Lightbox.jsx` exist only to map their local hook state and item shape into this flat contract. They have no visual logic.

Internal `ZoomController` sub-component lives inside this file — it is not exported separately since it has no use outside the lightbox.

### `shared/NoiseBg.jsx`

Memoised SVG grain texture overlay. Used in:
- `header/MenuPanel.jsx` (menu panel atmosphere)
- `shared/Lightbox.jsx` (when `noiseOverlay={true}`)

Accepts a `filterId` prop (default: `"noiseBg"`) to avoid SVG filter ID collisions when multiple instances appear on the same page. Always pass a unique string per call site.

`header/NoiseBg.jsx` is a thin re-export shim (`export { default } from "../shared/NoiseBg"`) kept for import-path backward compatibility.

---

## Component Map

### `Header.jsx` + `header/`

**Shell responsibilities:** `menuOpen` toggle state, reads `useLanguage`, `useTheme`, `data("collection")`. Passes all to `MenuPanel`.

| File | Role |
|------|------|
| `header/MenuPanel.jsx` | Animated slide-out overlay; composes all menu sub-sections |
| `header/SystemPortals.jsx` | "System Directories" column — Showroom + Blueprints portals (`memo`) |
| `header/JourneyIndex.jsx` | Three journey chapter cards (`memo`) |
| `header/SpecimenGrid.jsx` | Collection item cards grid (`memo`) |
| `header/ControlsFooter.jsx` | Language + theme toggles footer (`memo`) |
| `header/NoiseBg.jsx` | Re-export shim → `shared/NoiseBg` |

Navigation actions (`animateScrollTo`, `animateScrollToTop`) are resolved **inside `MenuPanel`**, not in the shell, to keep the shell thin.

---

### `Showcase.jsx` + `showcase/`

**Shell responsibilities:** reads `useLanguage`, `useShowcase`, guards for `selectedItem`, owns the `AnimatePresence` transition between items.

| File | Role |
|------|------|
| `showcase/CollectionTabs.jsx` | Horizontal item selector with animated underline |
| `showcase/ImageViewer.jsx` | Left column — editorial/macro image frame, prev/next, view mode switcher |
| `showcase/ProductPanel.jsx` | Right column — name, story, specs accordion, CTA buttons |
| `showcase/Lightbox.jsx` | Thin wrapper → `shared/Lightbox` with Showcase-specific prop mapping |

**Key prop contract:** `getItemTranslations` comes from `useLanguage()` in the shell and is passed explicitly to `ProductPanel` — it does not live on the `useShowcase` object.

---

### `ProductDetailsPage.jsx` + `productdetailspage/`

**Shell responsibilities:** reads `useLanguage`, calls `useLightbox(item.images.length)`, holds `activeTab` state, scrolls to top on `item.id` change. Passes the entire `lightbox` object as a single prop to children.

| File | Role |
|------|------|
| `productdetailspage/NavBar.jsx` | Breadcrumb + animated back button (`memo`) |
| `productdetailspage/StudioGallery.jsx` | Left column — main image with prev/next nav, thumbnail strip |
| `productdetailspage/ProductMeta.jsx` | Right column — title, specs grid, CTA pair (`memo`) |
| `productdetailspage/LookbookPoetry.jsx` | Bilingual Farsi/English story section (`memo`, no-op if `item.farsiStory` absent) |
| `productdetailspage/SpecsTabs.jsx` | Tab bar orchestrator + `AnimatePresence` panel switcher; content via `useMemo` |
| `productdetailspage/TabArchitecture.jsx` | Island + tall-unit specs panels |
| `productdetailspage/TabAppliances.jsx` | Gaggenau + Kesseböhmer integration grid |
| `productdetailspage/TabHeritage.jsx` | Static craft integrity panel (`memo`) |
| `productdetailspage/AcquisitionCTA.jsx` | Footer CTA with shimmer animation (`memo`) |
| `productdetailspage/Lightbox.jsx` | Thin wrapper → `shared/Lightbox` with PDP-specific prop mapping |

---

### `Concierge.jsx` + `concierge/`

**Shell responsibilities:** reads `useLanguage`, calls `useConcierge(...)`, passes the entire `concierge` object to children.

| File | Role |
|------|------|
| `concierge/SectionHeader.jsx` | Centered title/subtitle intro block (`memo`) |
| `concierge/InquiryForm.jsx` | Bespoke acquisition form + animated success confirmation state |
| `concierge/CuratorChat.jsx` | AI chat panel — message list, loading indicator, send form |

---

## Performance Techniques

### `React.memo`
Applied to components whose output is fully determined by stable props or no props. Prevents re-renders when parent state (e.g., `activeTab`, `menuOpen`, `formSubmitted`) changes but the component's own inputs have not.

**Memoised:** `NavBar`, `ProductMeta`, `LookbookPoetry`, `TabHeritage`, `AcquisitionCTA`, `SectionHeader`, `SystemPortals`, `JourneyIndex`, `SpecimenGrid`, `ControlsFooter`, `NoiseBg`.

### `useMemo` for tab content
`SpecsTabs` wraps the active tab panel in `useMemo([activeTab, item])`. Tab panels like `TabHeritage` are static JSX — this avoids re-creating their element trees on every parent render.

### Prop object grouping
`useLightbox` returns ~16 values. Rather than threading each individually through multiple layers, the shell stores the entire return as `const lightbox = useLightbox(n)` and passes it as a single prop. Same for `useShowcase` → `showcase` prop and `useConcierge` → `concierge` prop.

### `NoiseBg` + `ZoomController` isolation
Both are `memo` components that are structurally stable. Isolating them prevents the SVG layout and zoom widget from participating in any surrounding update cycle.

### Single Lightbox source
The `shared/Lightbox.jsx` eliminates the duplicate zoom controller, image transitions, and footer bar that previously existed in two separate files. One update point, zero drift.

---

## Conventions

- **No TypeScript.** All files are `.jsx`.
- **No hardcoded colors.** Use semantic tokens (`text-accent`, `bg-surface`, etc.). Exception: `#C5A059` in `header/` sub-components where Tailwind opacity modifiers on `text-accent` are insufficient for hover gradients.
- **No comments** unless the logic would genuinely surprise a reader.
- **Translation keys** via `t("key")` from `useLanguage()`. Never inline English strings in components.
- **`"use client"`** on shell files only. Sub-components and `shared/` files inherit the client boundary from their parent shell.


# Optimizations to evaluate — apply only if the gain is real:

For emphasis, I reiterate:
Reformatting the file in a clean and elegant with right indentation and spaces
React.memo — wrap the component if its output is fully determined by stable props and it re-renders due to unrelated parent state changes (tab switches, form input, open/close toggles, etc.). Skip if props change frequently anyway.
useMemo for element trees — if the component builds a large static sub-tree that doesn't depend on frequently-changing state, wrap it: useMemo(() => <HeavyPanel />, [stableDep]). Skip for small or cheap trees.
Prop object grouping — if a hook returns 10+ values that are threaded through multiple layers unchanged, store the whole return as one object and pass it as a single prop. Unpack only at the leaf that needs it.
useCallback / useMemo for handlers — only if a stable function reference is needed to prevent a memoised child from breaking. Not as a general habit.
"use client" placement — flag if it appears on a sub-component that inherits the boundary from its parent shell. It belongs only on the shell.
Your response format:

Verdict per technique — checked it, applied / skipped / not applicable, one line each
Optimized code — complete file, not a diff
What was intentionally left alone and why