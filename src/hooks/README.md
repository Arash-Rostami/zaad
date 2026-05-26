#  Custom React Hooks

## Purpose

All stateful logic and side effects are extracted into hooks here. Components are thin shells that render UI — they import hooks and spread their return values. No component should contain `useState` or `useEffect` blocks directly (except trivial cases like a single local UI toggle).

## Rule: one hook per logical domain

Do not create a new hook if an existing one can be parameterised or reused. Prefer fewer, smarter hooks over many narrow ones.

---

## Hook Catalogue

### `useTheme.js`

Manages the three-way visual theme: `light`, `mid`, `dark`.

```js
const { themeMode, handleThemeChange } = useTheme();
```

- Persists selection to `localStorage` under `"zaad_theme"`.
- Adds/removes CSS classes on `document.documentElement`.
- **Used by:** `Header.jsx`

---

### `useShowroomNav.js`

Page-level routing state for the single-page app.

```js
const {
  activeTab, setActiveTab,
  preselectedItem, setPreselectedItem,
  selectedProduct, setSelectedProduct,
  handleScrollToSection,
  handleInquireItem,
} = useShowroomNav();
```

- `activeTab`: `"showroom"` | `"blueprint"`
- `selectedProduct`: a full collection item object or `null`
- `handleScrollToSection(sectionId)`: smooth-scrolls within the showroom tab
- `handleInquireItem(item)`: pre-fills the concierge form with the selected item and scrolls to the concierge section
- **Used by:** `src/app/page.js`

---

### `useShowcase.js`

Orchestrates the collection showcase viewer. Wraps `useLightbox` and adds cross-collection navigation.

```js
const {
  selectedItem, selectItem,
  handleNextImage, handlePrevImage,
  viewMode, setViewMode,
  isSpecsExpanded, toggleSpecs,
  zoomCoords, isZooming, setIsZooming,
  handleMacroMouseMove, handleMacroTouchMove,
  // …all useLightbox fields spread in
} = useShowcase();
```

- Reads the collection via `data("collection")` from `useLanguage()` — no direct data imports.
- Cross-collection navigation: when the last image of an item is reached, `handleNextImage` advances to the first image of the next item.
- **Used by:** `Showcase.jsx`

---

### `useLightbox.js`

Controls an image lightbox: zoom, pan, loading state, image cycling.

```js
const {
  activeImageIndex, setActiveImageIndex,
  isEnlarged, openLightbox, closeLightbox,
  isHoveredOverImage, setIsHoveredOverImage,
  lightboxScale, setLightboxScale, cycleZoom,
  lightboxPan,
  handleLightboxMouseMove, handleLightboxTouchMove,
  isLightboxLoading, markImageLoaded,
  isZoomControllerHovered, setIsZoomControllerHovered,
  goNextWrapped, goPrevWrapped,
} = useLightbox(imageCount);
```

- `imageCount` — number of images in the current item
- `cycleZoom()` — steps through zoom presets: 1.0 → 1.8 → 3.0 → 1.0
- `goNextWrapped()` / `goPrevWrapped()` — wrap-around image navigation
- **Used by:** `useShowcase.js` (via composition), `ProductDetailsPage.jsx` (directly)

---

### `useActiveSelection.js`

Generic hook for tracking the active item in a list. Used for tabs/panels where one item is "open" at a time.

```js
const { active, setActive } = useActiveSelection(items);
// active defaults to items[0]
```

- **Used by:** `Materials.jsx`, `Blueprint.jsx`

---

### `useConcierge.js`

Manages the acquisition form and the AI chat panel.

```js
const {
  clientName, setClientName,
  clientEmail, setClientEmail,
  clientPhone, setClientPhone,
  desiredConsultation, setDesiredConsultation,
  additionalNote, setAdditionalNote,
  formSubmitted,
  chatMessages, userQuery, setUserQuery,
  chatLoading, scrollRef,
  handleInquirySubmit,
  handleSendMessage,
} = useConcierge({ language, getItemTranslations, preselectedItem, onClearPreselected, t });
```

- Sends form data to `/api/inquire` on submit.
- Sends chat messages to `/api/curator` (Gemini proxy).
- Auto-scrolls the chat window via `scrollRef`.
- When `preselectedItem` changes, appends a curator message mentioning the item.
- **Used by:** `Concierge.jsx`

---

## Conventions

- Hooks live at `src/hooks/*.js`.
- Each hook file exports a single default function named `use<Something>`.
- Hooks may call other hooks (e.g., `useShowcase` composes `useLightbox`).
- Hooks must not render JSX.
- Do not import from `src/lib/data.js` — it has been removed. Use `data("collection")` from `useLanguage()` instead.
