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

- Persists selection to `localStorage` under `"zaad-theme"` (hyphen, not underscore).
- Adds/removes CSS classes on `document.documentElement`.
- Also syncs the browser chrome color: `applyThemeClass` writes the matching hex
  (`THEME_COLORS` — light `#F4F1ED`, mid `#1F242C`, dark `#111110`, mirroring
  `--bg-primary` per theme in `globals.css`) into the `<meta name="theme-color">` tag
  that `app/layout.js`'s `viewport.themeColor` renders. Keep this map in sync if
  `--bg-primary` ever changes.
- **Used by:** `Header.jsx`, `house/HouseChrome.jsx`

---

### `useFontScale.js`

App-wide text-size accessibility control — the `+`/`−` control in `header/ControlsFooter.jsx`
and `house/HouseChrome.jsx`'s `HouseControls`.

```js
const { fontScale, increaseFontScale, decreaseFontScale, resetFontScale, minFontScaleReached, maxFontScaleReached } = useFontScale();
```

- Persists to `localStorage` under `"zaad-font-scale"` (mirrors `useTheme.js`'s pattern:
  local `useState`, synced from storage on mount).
- Range `0.85`–`1.3` in `0.05` steps; writes the current value to
  `document.documentElement.style.setProperty("--zaad-user-scale", value)` — the
  **user** scale, not the effective `--zaad-font-scale`, which CSS derives from it
  (including the Farsi-mode `* 1.05` baseline bump — see `src/styles/README.md`). Writing
  `--zaad-font-scale` directly here would overwrite that bump.
- **Scales font-size only — never layout.** `src/styles/globals.css` redefines
  Tailwind's `--text-xs` … `--text-9xl` theme tokens as `calc(<default rem> *
  var(--zaad-font-scale))`, so every named `text-*` utility scales automatically. Do
  **not** apply `--zaad-font-scale` to `html`'s root font-size — Tailwind v4's spacing
  scale (`p-*`, `gap-*`, `w-*`, `h-*`, …) is also `rem`-based off the root, so that would
  scale padding/gaps/widths right along with text, distorting every layout instead of
  just enlarging copy. See `src/styles/README.md`'s Implementation Gotchas for the full
  mechanism, including how the many arbitrary `text-[Npx]` utilities in this codebase are
  wired into the same scale.
- **Used by:** `header/ControlsFooter.jsx`, `house/HouseChrome.jsx`.

---

### `useAmbientAudio.js`

Shared ambient background-audio toggle (muted by default).

```js
const { isMuted, toggleMute } = useAmbientAudio();
```

- The actual `Audio` object is a **module-level singleton**, not component state — created lazily
  on first unmute (guarded by `typeof window !== "undefined"`), src `/audio/ambient-loop.m4a`, `loop = true`,
  `preload = "none"`. This mirrors `useTheme.js`'s pattern (local `useState` per call site, no React
  context, since none of the calling components are ever mounted simultaneously). Playback survives
  the calling component unmounting (e.g. closing the hamburger menu) since the `Audio` object isn't
  tied to that component's lifecycle — only the *toggle UI* is.
  **`isMuted`'s initial state must read the singleton, not assume `true`:** since every remount
  (e.g. reopening the menu) re-runs `useState`, a plain `useState(true)` would show "muted" on
  reopen even if playback never stopped — fixed (2026-09-05) via a lazy initializer,
  `useState(() => !audioEl || audioEl.paused)`, so a remount reflects the real singleton state
  instead of resetting the icon. Safe under SSR: `audioEl` is `null` on the server (never created
  there), so `!audioEl` short-circuits before `.paused` is ever read.
- **Off by default and zero-cost until enabled:** every page load starts muted, no `Audio` object
  exists yet, and nothing is fetched. The element is created only inside the `toggleMute` unmute
  click (a user gesture, satisfying autoplay-with-sound policies); `preload = "none"` means the
  browser downloads no bytes before that click. Mute is a hard stop: `pause()`, not a silent
  `muted` flag — no autoplay-on-mount hack, no muted `play()` warm-up.
- **No preference persistence** (deliberate): a stored "unmuted" preference can't be honored on
  reload without a user gesture, so the toggle honestly restarts muted on every load.
- Requires the file at `public/audio/ambient-loop.m4a`. Without it `audio.play()` rejects silently
  (caught, no crash) and the toggle just has nothing to unmute.
- **Used by:** `header/ControlsFooter.jsx`, `house/HouseChrome.jsx` (via `shared/AudioToggle.jsx`,
  see `src/components/README.md`).

---

### `useDeferredMedia.js` (added 2026-09-06)

The shared deferred-multimedia gate — one hook, three load techniques, so no component
re-rolls its own video/audio loading strategy. Returns `[ready, ref]`; attach `ref` to the
media's container element (not the `<video>` itself) for the in-view modes.

```js
const [ready, ref] = useDeferredMedia({ mode, idleDelay, rootMargin });
```

- **`mode: "in-view"` (default)** — `IntersectionObserver` on `ref` with `rootMargin`
  (default `"300px"`, fires ~one screen before the media enters view, once — then disconnects).
  For below-fold media: nothing loads while it's off-screen.
- **`mode: "idle"`** — `ready` flips after `idleDelay` ms (default `1500`). For above-fold
  heroes whose video must not block first paint: paint the cheap poster branch first, mount
  the `<video>` once the page is idle.
- **`mode: "eager"`** — `ready` immediately; exists so "load now" is expressed through the same
  API rather than a bypass.
- Fallbacks: if the ref target isn't mounted when the effect runs (conditionally rendered
  consumer), the observe is retried once on the next animation frame; if it's still absent
  or `IntersectionObserver` doesn't exist, `ready` flips immediately — the hook degrades to
  eager, never to "never loads".
- SSR/hydration-safe: `ready` starts `false` on both server and client (no mismatch), and
  all timing/observer work happens inside the effect. Cleanup disconnects the observer /
  clears the timeout.
- **Playback is driven from the element, not a state effect.** With `preload="none"` no
  media events fire at all; once `ready` flips the consumer raises preload to `"auto"`,
  the load starts, and the `<video>`'s own `onLoadedData` handler (gated on
  `!reduceMotion`) calls `play()`. A play *effect* keyed on the consumer's state is wrong
  under `AnimatePresence mode="wait"` — the state changes while the old element is still
  exiting, so the effect fires against the old element and never re-runs when the new one
  mounts (two confirmed dead-video bugs in the first pass, fixed 2026-09-06). Reduced-motion
  visitors keep `preload="none"` — poster only, zero clip bytes.
- **Consumers** (the 2026-09-06 media pass): `house/ChapterPieces.jsx`'s `ChapterHero`
  (`idle` — all three House routes + `/glance`), `Materials.jsx` and
  `ledger/Ledger.jsx`'s `LedgerGate` clip reel (both in-view, `preload="none"`→`"auto"` +
  `onLoadedData` play). `Hero.jsx`'s reel doesn't use the hook — its need is progressive
  *mount staging* of a rotating set, hand-rolled as `mountedCount`/`nextEager` state (see
  `src/components/README.md`; its play/rate effects depend on `mountedCount` too, so a
  far-dot click that mounts a not-yet-rendered clip re-runs them). The two bespoke gates
  that predate the hook (`Story.jsx`'s `storyGalleryMounted`, the 360° spin's
  `canMountSpin`) intentionally keep their own logic — documented there, don't refactor
  them onto this hook without checking those contracts first.
- **Not for images:** `next/image` already lazy-loads by default; the image-side discipline
  is `priority` on above-fold LCP images (`ChapterHero`'s poster, `StudioGallery`'s main
  pane — 2026-09-06) and nothing elsewhere.

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

- `activeTab`: `"showroom"` | `"pdf"` (the latter opens `/showcase/index.html` externally — see the note further down; `header/SystemPortals.jsx`'s Catalogue card highlights on `"pdf"`, the tab it actually sets)
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
- **`handleMacroMouseMove`/`handleMacroTouchMove` are rAF-coalesced** (2026-09-06): the
  handler stores the latest coords in `zoomCoordsRef` and schedules a single
  `requestAnimationFrame`-flushed `setZoomCoords` — one React render per frame no matter
  how many mousemove events fired. Cleanup cancels the pending rAF. Keep new
  pointer-coordinate state on this idiom (`CustomCursor.jsx` is the precedent); per-event
  `setState` re-renders once per event.
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
- `cycleZoom()` — steps through zoom presets: 1.0 → 1.8 → 3.0 → 1.0; from a
  between-stop scale (e.g. a pinch that ended at 2.3), it advances to the next stop
  above, else resets to 1.0 — never re-uses the old fixed-2.0 tap value.
- **Pinch-zoom** — `handleLightboxTouchMove` lazily attaches a native
  `{ passive: false }` touchmove listener to the pane element on first touch: two
  fingers scale by distance ratio (clamped [1.0, 3.0], snapping to 1.0 below ~1.05 so
  the `scale <= 1` swipe gate stays truthful), pan follows the pinch midpoint, and a
  2→1 finger lift re-anchors pan to the remaining finger. All pan values are 0–100
  percentages (the contract below).
- **`setLightboxScale` is a ref-syncing wrapper (`applyScale`)** — it accepts the same
  value-or-updater signature, but also mirrors the scale into a ref so the native pinch
  listener reads the gesture-start scale without stale closures. Don't bypass it.
- **Pan updates are rAF-coalesced; pinch stays synchronous** (2026-09-06). `handleLightboxMouseMove`
  and single-finger `handleLightboxTouchMove` write into `panRef` and flush `setLightboxPan` once
  per frame via a scheduled rAF (`scheduleLightboxPan`). The native pinch handlers
  (`handlePinchTouchMove`/`handlePinchTouchEnd`) are synchronous `{ passive: false }` listeners
  and call `cancelPendingPan()` before their own `setLightboxPan` — otherwise a stale rAF from a
  just-finished mousemove could clobber the pinch-anchored pan a frame later. The zoom-reset
  effect (on `activeImageIndex`/`isEnlarged` change) follows the same guard — cancel + ref-sync
  before resetting pan to 50/50 — so a queued rAF can't resurrect pre-navigation coordinates
  after an image switch. If you touch pan
  code, keep that cancel-before-set guard.
- `goNextWrapped()` / `goPrevWrapped()` — wrap-around image navigation
- **Used by:** `useShowcase.js` (via composition), `ProductDetailsPage.jsx` (directly)

---

### `useActiveSelection.js`

Generic hook for tracking the active item in a list. Used for tabs/panels where one item is "open" at a time.

```js
const { active, setActive } = useActiveSelection(items, persistKey);
// active defaults to items[0]; persistKey is optional
```

- **`persistKey`** (added 2026-09-06, optional) — when given, the selected item's `id` is
  saved via `services/PreferenceService.js` and restored (in a mount-only effect) the next
  time the same `persistKey` is used, so a returning visitor's choice sticks instead of
  always resetting to `items[0]`. Internally the hook now tracks `activeId`, not the full
  item, and re-resolves `active = items.find(i => i.id === activeId) || items[0] || null`
  every render — safe against `items` being a fresh array reference each render (as it is
  at both call sites below, derived from `data(...)`), since the lookup is by `id`, not
  identity. The external `{active, setActive}` contract is unchanged for callers that omit
  `persistKey` — `setActive` still takes the full item, not an id.
- **Used by:** `Materials.jsx` (`persistKey="materialSelection"`)

---

### `useLocalPreference.js` (added 2026-09-06)

Reactive wrapper around `services/PreferenceService.js` for components that need to
*render* a stored preference, not just write one. Full contract, the hydration-safe
seed/populate idiom it follows, and the current table of preference keys/consumers all
live in `src/services/README.md`'s `PreferenceService.js` section — read that first.

```js
const [value, update] = useLocalPreference(key, fallback);
```

- **Used by:** `header/MenuPanel.jsx` (`lastViewedItem`, for the "Continue Browsing" link)

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
  formSubmitted, formSubmitting,
  formErrors, setFormErrors,
  sessionRef,
  chatMessages, userQuery, setUserQuery,
  chatLoading, scrollRef,
  handleInquirySubmit,
  handleSendMessage,
} = useConcierge({ language, preselectedItem, onClearPreselected, t });
```

- **(2026-09-03) `handleInquirySubmit` is now `async` and does POST** — `{ clientName,
  clientEmail, clientPhone, desiredConsultation, additionalNote, appointmentMode,
  appointmentWindow, language }` to **`/api/inquiry`** (`src/app/api/inquiry/`), which
  validates server-side and appends the record to `data/inquiries.json`. Sets
  `formSubmitting` for the duration of the request (drives `InquiryForm`'s disabled
  submit button + `t("formSending")` label). On `{ ok: false, errors }`, sets
  `formErrors` — a `{ field: i18nKey }` map `InquiryForm` renders inline per field (or
  `{ form: i18nKey }` for a generic banner on network/server failure). On `{ ok: true,
  sessionRef }`, `sessionRef` now comes from the **server**, not a client-side
  `Math.random()` call as before — `InquiryForm` still renders it as
  `SEC-COM-{sessionRef}` on the success card. `formErrors` is cleared at the start of
  each submit attempt and by the success screen's "inquire another object" reset.
- `handleSendMessage` / `triggerCuratorResponse` POST `{ messages, language }` to
  **`/api/curate`** (the Gemini AI Assistant route in `src/app/api/curate/`); on error
  pushes a `t("curatorError")` assistant message. The welcome message (`id:
  "curator-welcome"`) is **filtered out of the payload** — sending it as a "model" turn
  made Gemini echo the greeting back as its reply, so the chat showed the welcome twice.
- **Chat-driven lead capture (added 2026-09-06)** — `triggerCuratorResponse` runs the raw
  model text through `resolveCuratorReply` before displaying it: a module-scoped
  `SUBMIT_INQUIRY_RE` looks for a `[[SUBMIT_INQUIRY]]{...json...}[[/SUBMIT_INQUIRY]]` block
  (the exact tokens the `/api/curate` system prompt is instructed to emit — see
  `src/app/README.md`'s `/api/curate` section; keep both in sync). If found, the JSON is
  parsed, the block is stripped from what's shown, and — only if the parsed object has both
  `clientName` and `clientPhone` — `submitChatInquiry` POSTs `{clientName, clientEmail,
  clientPhone, additionalNote, language, source: "chat"}` to `/api/inquiry` (the same
  route/validation/persistence path `handleInquirySubmit` uses, just with the
  consultation/appointment fields omitted — see that route's doc for the `source: "chat"`
  branch). On success the displayed message gets `\n\n{sessionRef label}: #{ref}` appended;
  on a missing-field parse, a failed submit, or malformed JSON, it falls back to the
  cleaned text (with `t("curatorSubmitFailed")` appended for the latter two cases) rather
  than ever silently dropping the visitor's message. The AI is prompted to only ever emit
  the block after it has both required fields and the visitor has explicitly confirmed —
  this hook trusts that confirmation happened and does not re-ask; it never submits without
  the block being present.
- Auto-scrolls the chat window via `scrollRef` (pairs with the sentinel div in
  `concierge/CuratorChat.jsx` — keep that div the last child of the scroll container).
- When `preselectedItem` changes, pre-fills `additionalNote` with an acquisition note
  (FA/EN branches), pushes a user inquiry, triggers a curator response, then calls
  `onClearPreselected()`.
- **Welcome message is personalized when relevant (added 2026-09-06).** The existing
  `[language, t]` welcome-reset effect now calls a `buildWelcomeContent()` helper: if
  there is **no** `preselectedItem` (read via a `preselectedItemRef` updated every
  render, deliberately *not* an effect dependency — see below) and
  `PreferenceService.getPreference("lastViewedItem")` returns something, the welcome uses
  `t("curatorWelcomeWithItem")` (`{name}` replaced) instead of the plain
  `t("curatorWelcome")`. The effect's dependency array intentionally stays `[language,
  t]` (not `[language, t, preselectedItem]`) — adding `preselectedItem` would re-run this
  effect and **wipe the in-progress chat history** every time "Inquire" is clicked on a
  second item mid-session, which is the opposite of the separate `preselectedItem` effect
  above's job (append to history, not reset it). The `useEffect`
  disable-line comment on this effect is intentional, not a masked bug — the ref exists
  precisely so the effect can read the *current* preselect state without depending on it.
- **Used by:** `Concierge.jsx`

---

### `useScrollButton.js`

Scroll-position tracking for `shared/ScrollButton.jsx`'s floating "smart" scroll control.

```js
const { visible, direction } = useScrollButton();
```

- `visible` — `false` until the page has scrolled past `240px`, and permanently `false`
  on a page short enough that its total scroll range is under `320px` (nothing worth
  offering a scroll shortcut for).
- `direction` — `"down"` while in the top half of the page's scroll range, `"up"` past
  the midpoint; the button itself swaps icon/action on this, `ArrowDown` → scroll to
  `document.documentElement.scrollHeight - window.innerHeight`, `ArrowUp` → scroll to
  `0`, both via `ScrollService`'s eased RAF scroller (`animateScrollToBottom`/
  `animateScrollToTop`).
- Listens to `scroll`/`resize` (both `passive`), recomputed synchronously on mount so
  the button doesn't flash-appear on a page that loads already scrolled.
- **Used by:** `shared/ScrollButton.jsx` only.

---

### `useLenisScroll.js`

Inertial (Lenis) smooth-scroll initialization, extracted verbatim from `AppShell.jsx`'s
mount effect so the same behavior can be reused across routes.

```js
useLenisScroll();
```

- No params, no return value — pure side-effect hook.
- Dynamically imports `lenis`, wires it to `gsap.ticker` (single RAF for the page),
  syncs `lenis.on("scroll", ScrollTrigger.update)`, and registers the instance with
  `ScrollService` via `registerSmoothScroll`/`unregisterSmoothScroll`. Skipped entirely
  under `prefers-reduced-motion`. Cleanup restores GSAP's default `lagSmoothing(500, 33)`
  and destroys the instance — init/destroy must stay symmetrical since callers may remount
  (e.g. `AppShell` on every locale switch via `key={language}`).
- Guards `gsap.registerPlugin(ScrollTrigger)` at module scope with
  `typeof window !== "undefined"` (mirrors `components/Story.jsx`'s idiom) since this
  module may be pulled into a tree that also has server-rendered ancestors.
- **Used by:** `AppShell.jsx`, `house/HouseSmoothScroll.jsx` (mounted by
  `app/(house)/layout.js`), `collection/[slug]/ProductPageClient.jsx`, and
  `ledger/Ledger.jsx`. See
  `src/components/README.md`'s Lenis section for the full contract (config values,
  inner-scroller opt-outs, scroll-locked-overlay opt-ins).

---

## Load-bearing contracts (a future edit breaks these)

- **Zoom stops `[1.0, 1.8, 3.0]`** are duplicated in `useLightbox.js` (`cycleZoom`) and
  `components/shared/Lightbox.jsx` (preset array). Change one, change the other.
- **Pan coordinates are 0–100 percentages, not pixels** — in `useLightbox`
  (`handleLightboxMouseMove`/`TouchMove`) and `useShowcase`
  (`handleMacroMouseMove`/`TouchMove`). Switching to pixels silently breaks zoom origin.
- **120ms pre-scroll timeouts** in `useShowroomNav` (`handleInquireItem`) — a soft
  lead-time letting the product panel unmount before scrolling. The RAF engine in
  `ScrollService` now retries (100ms ticks, 1200ms cap) until the target section is
  back in the DOM, so a slow unmount no longer silently drops the scroll — but keep
  the timeouts: they avoid visibly scrolling mid-transition.
- `useShowroomNav.setActiveTab("pdf")` opens `/showcase/index.html` in a new tab and
  bails — it never sets state.
- `useShowcase.selectItem` resets `activeImageIndex` to 0 and forces `viewMode = "360"`
  (the default view — see `showcase/ImageViewer.jsx` in `src/components/README.md`), same
  as the hook's own initial state.

---

## Conventions

- Hooks live at `src/hooks/*.js`.
- Each hook file exports a single default function named `use<Something>`.
- Hooks may call other hooks (e.g., `useShowcase` composes `useLightbox`).
- Hooks must not render JSX.
- Do not import from `src/lib/data.js` — it has been removed. Use `data("collection")` from `useLanguage()` instead.
