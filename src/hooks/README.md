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

App-wide text-size accessibility control — the `+`/`−` control in `header/MenuControls.jsx`
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
- **Used by:** `header/MenuControls.jsx`, `house/HouseChrome.jsx`.

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
- **Used by:** `header/MenuControls.jsx`, `house/HouseChrome.jsx` (via `shared/AudioToggle.jsx`,
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
  that predate the hook (`Vision.jsx`'s `storyGalleryMounted`, the 360° spin's
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

- `activeTab`: `"showroom"` (the only value ever set since 2026-09-07 — the Catalogue card no longer sets a `"pdf"` tab, it calls `MenuPanel.jsx`'s `onBlueprint` which opens `/showcase/index.html` directly; see the note further down). **No live reader since 2026-09-28** — the Header→MenuPanel `activeTab` pass-through was removed with the menu's JourneyIndex row, and AppShell stopped destructuring it; the state itself stays because `setActiveTab`'s and `handleScrollToSection`'s internal `setActiveTabRaw("showroom")` + product-clear side effects still matter
- `selectedProduct`: a full collection item object or `null`
- `handleScrollToSection(sectionId)`: smooth-scrolls within the showroom tab
- `handleInquireItem(item)`: pre-fills the concierge form with the selected item and scrolls to the concierge section
- **Used by:** `src/components/AppShell.jsx`

---

### `useShowcase.js`

Orchestrates the collection showcase viewer. Wraps `useLightbox` and adds cross-collection navigation.

```js
const {
  selectedItem, selectItem,
  handleNextImage, handlePrevImage,
  viewMode, setViewMode,
  isSpecsExpanded, toggleSpecs,   // expanded by default (2026-09-28, user direction)
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
- **Pan and pinch-scale writes are both rAF-coalesced (2026-09-07; pinch was synchronous
  before this — see below).** `handleLightboxMouseMove` and single-finger
  `handleLightboxTouchMove` write into `panRef` and flush `setLightboxPan` once per frame
  via a scheduled rAF (`scheduleLightboxPan`). `handlePinchTouchMove` — a synchronous
  `{ passive: false }` touchmove listener firing on every pinch tick — still reads
  `getBoundingClientRect()` and computes the new scale/pan synchronously each tick (an
  unavoidable per-tick geometry read, same as the other handlers), but defers the actual
  `applyScale`/`setLightboxPan` writes to a second, independent rAF coalescer
  (`schedulePinchUpdate`/`pinchRafRef`/`pinchPendingRef`) so a fast pinch gesture triggers
  at most one re-render per frame instead of one per raw touch event. Pinch and
  single-finger-pan use **separate** raf refs (not a shared one) since they're
  mutually-exclusive gesture states (`handlePinchTouchMove` bails under 2 touches,
  `handleLightboxTouchMove` bails at 2+) — keeping them independent avoids any ambiguity
  about which pending payload a shared coalescer's callback should apply. **Every existing
  pan-cancellation call site got a matching pinch-cancellation call, so the original
  "cancel-before-set" guard against stale-frame clobbering still fully holds in both
  directions**: `handlePinchTouchMove` calls `cancelPendingPan()` before scheduling (a
  stale queued single-finger pan can't land after a pinch starts), `handlePinchTouchEnd`
  calls both `cancelPendingPan()` and `cancelPendingPinch()` before its own synchronous
  pan set (a stale queued pinch frame can't overwrite the final 2→1-finger re-anchor) —
  but since canceling the pending pinch rAF would otherwise silently drop whatever scale
  the very last pre-liftoff pinch tick computed (there is no later rAF to re-apply it),
  `handlePinchTouchEnd` captures `pinchRef.current.scale` before nulling the ref and
  calls `applyScale(finalScale)` synchronously right after the cancels, so the final
  zoom level always matches the gesture's true last tick regardless of whether the
  pending rAF got a chance to fire. The zoom-reset effect (on `activeImageIndex`/
  `isEnlarged` change) also cancels both before resetting scale and pan. The unmount
  cleanup effect cancels both raf refs too. If you touch pan/pinch code, keep every
  cancel-before-set guard paired for both mechanisms, and keep the scale flush in
  `handlePinchTouchEnd` — dropping either reintroduces a same-class stale-frame bug.
- `goNextWrapped()` / `goPrevWrapped()` — wrap-around image navigation
- **Used by:** `useShowcase.js` (via composition), `CollectionPage.jsx` (directly)

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
  at the call site below, derived from `data(...)`), since the lookup is by `id`, not
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

- **Used by:** `header/MenuPanel.jsx` (`lastViewedItem` — the menu's "Continue" link,
  restored 2026-09-29 at owner direction after the 2026-09-28 copy-pass removal; the link
  itself now lives in `MenuPanel.jsx` after the third row, not inside `SpecimenGrid`).

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
  retryLastExchange,
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
  pushes a `t("curatorError")` assistant message (now carrying `isError: true`, added
  2026-09-07). The welcome message (`id:
  "curator-welcome"`) is **filtered out of the payload** — sending it as a "model" turn
  made Gemini echo the greeting back as its reply, so the chat showed the welcome twice.
- **`retryLastExchange` (added 2026-09-07)** — an error bubble is a dead end without it:
  before this, resuming after a failed reply meant typing a brand-new message, since
  nothing re-sent the one that failed. Reads `chatMessagesRef.current` (not `chatMessages`
  state — same ref-mirroring idiom as the preselect effect below), bails if the last
  message isn't `isError`, otherwise trims that error bubble off, `setChatMessages`s the
  trimmed array, and calls `triggerCuratorResponse` with it — replaying the same history
  (including the user's original message, still in there) rather than asking them to
  retype anything. Deliberately does **not** read/write inside a `setChatMessages(prev =>
  ...)` updater to get this done — the actual re-send is a real side effect
  (`triggerCuratorResponse`'s `fetch`), and this project's own convention (see the
  session's cleanup pass) is an honest ref + a plain state set, not a side effect tucked
  inside a functional updater, which risks a double-fire under Strict Mode.
  `concierge/CuratorChat.jsx`'s `ChatMessage` renders a `t("errorRetry")` button under any
  `isError` bubble, wired straight to this.
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
- **Auto-scroll only fires when the visitor is already near the bottom (added
  2026-09-07)** — a `nearBottomRef` is kept in sync by a `scroll` listener (`{ passive:
  true }`, attached once to `scrollRef.current.parentElement` — the same scroll container
  the sentinel div lives in) that tracks whether the container is within 120px of its own
  bottom. The auto-scroll effect (still keyed on `[chatMessages, chatLoading]`, still
  scrolling via `scrollRef` — pairs with the sentinel div in `concierge/CuratorChat.jsx`,
  keep that div the last child of the scroll container) now bails when `nearBottomRef.current`
  is `false`. Before this, a visitor who scrolled up to reread earlier context got yanked
  back to the bottom the instant they sent a message or a reply landed — every chat
  update forced the scroll regardless of where they'd manually navigated to.
- **A request in flight can't be double-fired (added 2026-09-07).** `requestInFlightRef`
  is checked and set synchronously at the very top of `triggerCuratorResponse`, before
  `setChatLoading(true)` — a plain `useState`-driven `chatLoading` check alone (as
  `handleSendMessage` already had) is vulnerable to two calls landing in the same render
  cycle, before React has flushed the `disabled` attribute the state change would
  otherwise produce (a fast double-click, or a double-`Enter`). Since `retryLastExchange`
  also funnels through `triggerCuratorResponse`, this one guard covers both entry points
  at their shared choke point without needing a second copy of the guard's *logic* —
  but `handleSendMessage`'s own pre-check now also reads `requestInFlightRef.current`
  directly (alongside its existing `chatLoading` check), not just `chatLoading` alone:
  without that, the same-tick race could still let a second call build its
  `updatedHistory` off a stale `chatMessages` closure and overwrite the first call's
  message in `setChatMessages` (a lost user message, even though the network guard
  already stopped a duplicate `fetch`).
- **A visibly-empty reply is treated as a failure, not silently rendered (added
  2026-09-07).** If `resolveCuratorReply`'s result is empty/whitespace-only (a real
  gateway-flakiness shape observed this session — a 200 response with no usable text),
  the pushed message swaps in `t("curatorError")` and carries `isError: true` instead of
  an empty assistant bubble with no explanation and no way to retry.
- **The network-failure path distinguishes "you're offline" from "the service failed"
  (added 2026-09-07)** — `navigator.onLine === false` in the `catch` block selects
  `t("curatorOffline")` over the generic `t("curatorError")`, since the two situations
  call for different visitor action (check your own connection vs. try again / use the
  form) and were previously indistinguishable.
- **A slow reply says so instead of sitting silently (added 2026-09-07).** `chatLoadingSlow`
  flips true via a `window.setTimeout(9000)` started alongside `chatLoading`, cleared in
  the same `finally` block; `CuratorChat.jsx`'s loading pill swaps `t("analyzingParams")`
  for `t("analyzingParamsSlow")` once it fires. Worth having now that a single failed
  request can chain through the primary gateway, the fallback gateway, and the native SDK
  (`src/services/README.md`'s CuratorService section) before finally erroring — a
  legitimate multi-leg attempt can now run well past what feels instant.
- Chat input carries `maxLength={2000}` (`concierge/CuratorChat.jsx`, added 2026-09-07) —
  matches `api/curate/route.js`'s own server-side truncation cap exactly, so what the
  visitor sees they typed is always what the model actually receives; before this, a huge
  paste would render/download in full locally while the server silently truncated it for
  the model's context, a real mismatch between shown and answered.
- When `preselectedItem` changes, pre-fills the free-text category field with
  `t("privateArchiveAcquisition")` (since 2026-10-05 the category is the customer's own
  wording, so the preselect fills the translated label — the exact words the select used
  to show selected; state starts `""`, not `"acquisition"`) and `additionalNote` with an
  acquisition note
  (FA/EN branches), pushes a user inquiry, triggers a curator response, then calls
  `onClearPreselected()`. This effect reads the running chat history via a
  `chatMessagesRef` (mirrored every render, same idiom as `preselectedItemRef`) instead
  of closing over `chatMessages` state directly, so `chatMessages` itself never needs to
  sit in the dependency array (it would re-run this effect on every message sent); the
  array is `[preselectedItem, language, onClearPreselected, triggerCuratorResponse, t]` —
  the latter three are real dependencies, harmless to add since the effect's own
  `handledPreselectRef.current === preselectedItem` guard bails out on any re-fire where
  `preselectedItem` itself hasn't actually changed.
- **Welcome message (personalization restored 2026-09-29).** `buildWelcomeContent`
  (a `useCallback` keyed on `[t]`) personalizes from
  `PreferenceService.getPreference("lastViewedItem")`
  (`t("curatorWelcomeWithItem")`, `{name}` replaced) when no item is preselected, else
  returns `t("curatorWelcome")` — the same `lastViewedItem` chain the menu's Continue
  link uses (removed 2026-09-28 in the copy pass, restored end-to-end 2026-09-29 at
  owner direction; see `src/services/README.md`'s PreferenceService table). The
  welcome-reset effect's dependency array stays `[language,
  buildWelcomeContent]` (not `[language, buildWelcomeContent, preselectedItem]`) —
  depending on `preselectedItem` would re-run this effect and **wipe the in-progress
  chat history** every time "Inquire" is clicked on a second item mid-session, which is
  the opposite of the separate `preselectedItem` effect above's job (append to history,
  not reset it). **The same reset also skips while a request is
  in flight (`requestInFlightRef.current`, added 2026-09-07)** — a language switch
  mid-conversation used to wipe `chatMessages` down to a single fresh welcome message
  unconditionally; if a reply was still in flight when that happened, it would land
  moments later and get appended onto that now-orphaned fresh chat — a non-sequitur
  reply with the visitor's actual question gone. Only a
  genuine mid-flight language change is deferred (silently skipped, not queued —
  the conversation the visitor is already in just isn't reset out from under them).
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
- Listens to `scroll` (`passive: true`) and `resize` (no options passed — the passive
  flag is meaningless for resize), both rAF-coalesced through one `schedule`/`update`
  pair; recomputed synchronously on mount so
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
  `typeof window !== "undefined"` (mirrors `components/Vision.jsx`'s idiom) since this
  module may be pulled into a tree that also has server-rendered ancestors.
- **Used by:** `AppShell.jsx`, `house/HouseSmoothScroll.jsx` (mounted by
  `app/(house)/layout.js`), `collection/[slug]/CollectionPageClient.jsx`,
  `ledger/Ledger.jsx`, and `glance/GlancePage.jsx`. See
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
- ~~`useShowroomNav.setActiveTab("pdf")` opens `/showcase/index.html` in a new tab and
  bails — it never sets state.~~ (Removed 2026-09-07: the Catalogue card's click is now
  wired directly in `MenuPanel.jsx`'s `onBlueprint` — `window.open("/showcase/index.html")`
  after closing the menu — so the hook no longer special-cases `"pdf"`; callers only ever
  pass `"showroom"` to `setActiveTab` again (the hook itself does no validation — it just
  stores the value and clears the selection). The Catalogue card itself moved from
  `header/SystemPortals.jsx` to `header/UtilityStrip.jsx` in the 2026-09-27 menu-panel
  restructure (see `src/components/README.md`) — the click wiring is unchanged, just relocated.)
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
