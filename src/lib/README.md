# `src/lib/` — Shared Utilities

Plain data/logic helpers with no React hook dependencies (importable from both server
and client components). `src/lib/i18n/` has its own README — see that file for the
translation/dictionary system.

## `collectionImages.js`

Server-only (`node:fs`/`node:path`). `resolveCollectionImages(item, lang)` reads
`public/image/{item.id}/` at request time, sorts files numerically by filename, and
returns `{ url, orientation, caption }` objects — auto-detecting image dimensions from
raw PNG/JPEG bytes (no external image library) to set `orientation`. Falls back to
`item.images` (the dictionary's hardcoded array) if the folder is missing or empty.
Called from `src/app/collection/[slug]/page.js` only — never import this into a client
component, it will crash (no `fs` in the browser).

**Both fs passes are module-level cached** (2026-09-06): `listSortedImages` memoizes
the sorted filename list per folder (`listCache`) and `readDimensions` wraps the SOF-marker
scan with a per-file `dimensionCache` — a folder is listed and each file's bytes are
dimension-scanned exactly once per server process, not per request. `public/image/` is
deploy-time-static content, so an unbounded Map keyed by path is safe here; clear the
caches only if that assumption ever breaks (never in dev where `public/` can change).

`resolveHomeUtensilImages()` — same file, same server-only constraint. Reads
`public/image/home/` (no `item`/`lang` params — a flat folder, not per-collection-item),
filters by the same `IMAGE_EXTENSIONS` set, sorts numerically, and returns
`{ src, width, height }` objects (dimensions via the same `readDimensions` — no
orientation/caption — the caller only needs the aspect so each slide can hug its own
image instead of letterboxing inside the fixed 3:4 frame). Falls back to a 2-file
hardcoded array (`utensil-01.png`, `utensil-02.png`, with their real dimensions) if the
folder is missing/empty, mirroring `resolveCollectionImages`'s fallback philosophy.
Whatever files exist in that folder at request time are picked up automatically —
adding a 3rd, 10th, or 98th image needs no code change. Called from `src/app/page.js`
only, which passes the result down as `AppShell`'s `utensilImages` prop — currently
**dormant**: `Vision.jsx`'s gallery is video-driven now, the prop is threaded but
unconsumed (see `src/components/README.md`).

## `localizedYear.js`

`localizedYear(isFarsi)` returns the current Gregorian year (`new Date().getFullYear()`)
formatted via `Intl.NumberFormat` with `useGrouping: false` — Persian digit glyphs when
`isFarsi`, Latin digits otherwise. The two `Intl.NumberFormat` instances are hoisted to
module scope (2026-09-06) — call sites hit the render path every paint, and constructing
an `Intl.NumberFormat` per call is real work (locale-data lookup), not free.
`useGrouping` must stay `false`: `Intl.NumberFormat`
inserts a thousands separator by default, which turns a 4-digit year into `"2,026"`.
Gregorian year, not a Jalali calendar conversion. Called at render time, not cached in
state — call site: `Footer.jsx`, composing
`t("footerCopyright").replace("{year}", localizedYear(isFarsi))` (a single-year string,
e.g. `© {year} - All Rights Reserved.` — no start-date range), then stripping the
leading `"© "` (`.replace(/^©\s*/, "")`) before `wrapLatinRuns`, since its `©` renders
separately as the hidden `/ledger` link (see `src/components/README.md`'s "hidden link"
note). (The former second call site that skipped the strip, `house/HouseFooter.jsx`,
was deleted in the 2026-09-06 one-footer pass.)

## `socialLinks.js` (added 2026-09-04)

Exports `SOCIAL_LINKS` — a frozen 4-entry array (`id`, `href`, `icon` — a `lucide-react`
component reference, `labelKey`, and `disabled`) for Instagram, LinkedIn, Telegram, and
WhatsApp. The single shared source `shared/SocialLinks.jsx` (see
`src/components/README.md`) maps over it, so `Footer.jsx` renders the identical row from
one config. (The former second consumer, `house/HouseFooter.jsx`, was deleted in the
2026-09-06 one-footer pass.) **Instagram's `href` is the real handle** (`zaaddesignofficial`,
supplied 2026-09-27); the other three are still `*_placeholder` values and carry
**`disabled: true`** (2026-09-29, owner direction: keep the icons visible but unclickable —
`shared/SocialLinks.jsx` renders them as dimmed `aria-disabled` spans instead of links
until real handles exist). Replace those three `href`s and drop the `disabled` flags when
supplied; nothing else needs to change (`shared/SocialLinks.jsx` and the footer only ever
read from this one file). Telegram
has no dedicated `lucide-react` icon, so `Send` (paper airplane) stands in — it happens to
already resemble Telegram's own logo shape. WhatsApp has no dedicated icon either;
`MessageCircle` is the closest generic chat-bubble glyph `lucide-react` offers.

## `studioHours.js` (added 2026-09-06)

Client-safe, no hook calls. `isStudioOpenNow(date = new Date())` resolves the
Tehran-local weekday/hour via `Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tehran",
weekday: "short", hour: "numeric", hour12: false })`, independent of the visitor's own
device timezone/locale — Node/Next.js ships full ICU by default, so `timeZone: "Asia/
Tehran"` needs no extra polyfill/data in either SSR or the browser. Open Sat–Thu
09:00–18:00 Tehran time (`weekday !== "Fri"` — Friday is the only closed day, matching
`callStudioSub`'s stated hours literally, not general knowledge about Iran's weekend).
Sole consumer: `house/ChapterPieces.jsx`'s `CallStrip` (see `src/components/README.md`),
which calls it inside a mount-only effect (`isOpen` starts `null` so SSR and first paint
render no status dot — the same hydration-safe idiom as `useLocalPreference`) and renders
`t("studioStatusOpen")`/`t("studioStatusClosed")` next to a `bg-accent`/`bg-muted/50` dot
(no new hardcoded color).

## `wrapBrandNames.js`

Client-safe, no hook calls, no `isFarsi` parameter needed. `wrapBrandNames(text)` scans a
string for a fixed token list — split into `ZAAD_TOKENS` ("ZAAD", "Dorsa", "Persol Business
Solution", and the four collection codenames "GÁVV"/"ZIVV"/"RÁKH"/"VAAR") and `PARTNER_TOKENS`
("Gaggenau", "Domus", "Salice", "Kesseböhmer", "Coopersburg" — the manufacturing/supply
partners named in `en.js`/`fa.js` appliance/hardware spec text), merged into one combined
`BRAND_TOKENS` list — and wraps each match in `<span dir="ltr" className="font-serif">`.
This is a deliberate brand-identity typography rule (these tokens always render in the
site's FractulAlt serif, regardless of the surrounding text's font) — not a bidi-safety
mechanism like `wrapLatinRuns` below, though the `dir="ltr"` incidentally provides the
same isolation. No-op (returns the input unchanged) when nothing matches, so it's safe to
call unconditionally. See `src/styles/README.md`'s "Brand tokens always render in
`font-serif`" section for the full rationale, the complete call-site list, and what was
deliberately left alone. **`wrapLatinRuns.js`'s English path now delegates here** (see
below) — extending either token list benefits both mechanisms at once.

## `wrapLatinRuns.js`

Client-safe (returns React elements, but has no hook calls itself — callable from
server or client). `wrapLatinRuns(text, isFarsi)` scans a string for contiguous runs of
non-Farsi characters (anything outside the `؀-ۿ‌‏` Arabic-script block) and wraps each
run in `<span dir="ltr" className="font-serif">` for Unicode bidi isolation plus the
site's brand-identity look. Returns the string unchanged only when `text` isn't a
non-empty string.

**In English (`isFarsi` falsy), delegates to `wrapBrandNames(text)` instead of no-op'ing
(changed 2026-09-03, explicit user request — "make sure the same rules apply in English").**
Isolating "runs of non-Farsi characters" is meaningless once the whole string is already
Latin, so the Farsi-only run-isolation logic below simply doesn't run in English; instead,
the same "known brand/partner token → `font-serif`" rule applies via exact-token matching
(`wrapBrandNames`), giving parity with what Farsi gets via full-run isolation. One
consequence: `wrapBrandNames` matches only the exact token, not adjacent words merged by a
single space the way Farsi's run-merge does — `"Dorsa Home"` gets `"Dorsa"` wrapped but
not `"Home"` (harmless; "Home" isn't a brand token) — whereas the equivalent Farsi string
would have merged both words into one span. This parity holds at every call site below.

**Wraps in `.font-serif`, not `.font-latin` (changed 2026-09-02, explicit user request).**
Every call site here isolates embedded proper nouns inside Farsi prose — our own brand/
collection names (`ZAAD`, `Dorsa`, `GÁVV`/`ZIVV`/`RÁKH`/`VAAR`) and third-party partner
brands (`Gaggenau`, `Domus`, `Salice`, `Kesseböhmer`, etc.) — and the site's rule is that
brand-adjacent proper nouns render in the FractulAlt `.font-serif` face, not the monospace
`.font-latin` face (see `src/styles/README.md`'s "Brand tokens always render in
`font-serif`" section for the full rationale, and `wrapBrandNames.js` below for the
sibling mechanism that applies the same face to an *exact* token match rather than any
isolated Latin run). Previously wrapping in `.font-latin` looked like a technical/spec
monospace treatment fighting the surrounding paragraph's own `.font-serif`, and this is
the bug that was actually reported. `.font-latin` (the CSS utility itself, and its direct
manual use on `item.number`/similar always-Latin *code* fields — see `src/components/README.md`'s
`.font-latin` section) is untouched; only this helper's own choice of class changed.

Adjacent non-Farsi tokens separated by exactly one plain space merge into a single span
(so `"Dorsa Home"` or `"ZAAD S.P.A."` don't fragment into one span per word); a Farsi
word or Farsi punctuation between two Latin tokens breaks the merge correctly, since it
isn't a single-space gap.

**Each merged run is trimmed to its alphanumeric core before wrapping** (leading/trailing
characters that aren't `[A-Za-z0-9]` are excluded from the span, not just whole
punctuation-only runs). Without this, a lone bracket/paren adjacent to a single-letter
token — e.g. `"C (یخچال..."` — would merge across the one-space gap into a run like `"C ("`,
forcing the opening paren into a `dir="ltr"` span while its matching closing paren (with no
Latin neighbor) stayed untouched; that asymmetric isolation breaks Unicode's natural paren
mirroring in the surrounding RTL flow and reads as backwards/misplaced parentheses — a
classic mixed-script bidi artifact, not a data problem, so it isn't fixed by editing the
dictionary strings. Trimming leaves bare punctuation (parens, colons, bullets, a lone `.`
between Farsi digits, etc.) outside every span so it inherits ordinary RTL mirroring.

**Use at the final render site**, not deep in a data pipeline — call it once, right where
a string becomes JSX children (e.g. `{wrapLatinRuns(item.description, isFarsi)}`), never
on a string that still gets `.replace()`/concatenation/template-literal composition
afterward (`wrapLatinRuns` returns a React node array, not a string, once it's actually
wrapped something). Current call sites: `Vision.jsx`, `Materials.jsx`,
`Footer.jsx`, `concierge/InquiryForm.jsx`,
`collection/CollectionMeta.jsx`,
`collection/TabArchitecture.jsx` (also its `tower.key`/`listSpecs` entries, not
just `overview`/bullets — anything rendering a dictionary string with embedded Latin
needs this call, not just the obvious paragraph fields), `collection/TabAppliances.jsx`,
`collection/StudioGallery.jsx`, `collection/Lightbox.jsx`, `showcase/Lightbox.jsx`,
`showcase/CollectionPanel.jsx`, `glance/GlancePage.jsx`, `glance/GlanceChapter.jsx` (the
`/glance` lookbook composite), `app/credits/page.js`, and `ledger/Ledger.jsx` (admin note
fields) — every one of these renders dictionary prose (`item.*`
fields, or `t()` strings) that mixes Latin brand names/technical terms into Farsi
sentences at the data layer; see `src/lib/i18n/README.md` for why the dictionary itself
isn't restructured to avoid this instead. The 2026-09-28 mixed-script audit closed the
remaining 16 Latin-in-Farsi render gaps in one pass and confirmed the en direction is
gap-free; `wrapBrandNames` (the en path) gained its own call sites in
`collection/TabHeritage.jsx` and `collection/SpecsTabs.jsx`. **Attributes/keys always take
the raw string**: `collection/StudioGallery.jsx` keeps a raw `captionTitle` memo for its
truncated caption's `title` attribute and wraps only the rendered `{captionText}` — the
pattern for any element needing both.

**`concierge/CuratorChat.jsx` (added 2026-09-02)** is the one call site that isolates
*runtime* content, not a dictionary string: `hooks/useConcierge.js`'s `chatMessages`
state mixes static seeded strings (`t("curatorWelcome")`, `t("curatorError")`), raw
user-typed input, and dynamic `/api/curate` (Gemini) response text — all plain strings
with no dictionary-layer control. Wrapping happens once at the message-bubble render,
covering all three sources uniformly rather than threading it through the hook or the
API route. **The `isFarsi` passed in is per-line, not the page's `language`** (changed
2026-09-07) — `renderCuratorLine` tests each line's own text for actual Farsi characters
rather than trusting the page locale; see `src/components/README.md`'s `CuratorChat.jsx`
section for why (a full-English reply on a `fa` page used to defeat this file's
bold-marker detection below, and a single reply mixing a Farsi line with a fully-English
line needed per-line rather than per-message detection to get both lines right at once).
`CuratorChat` no longer takes a `language` prop from `Concierge.jsx` — it was only ever
used to compute the page-level `isFarsi` this replaced.

**(2026-09-03) That render site now calls `renderChatMarkdown.js`, not `wrapLatinRuns`
directly** — the AI curator's replies (see `services/CuratorService.js` in
`src/services/README.md`) are prompted to answer in markdown, so raw `**bold**` was
showing up as literal asterisks in the chat bubble.

`renderChatMarkdown(text, isFarsi)` runs `wrapLatinRuns(text, isFarsi)` on the **intact,
unsplit** input first, then walks the resulting node array as a second pass, toggling a
`bold` flag on each `**` marker it encounters and wrapping the plain-text pieces in
between in `text-accent` (the brand bronze/gold token — no hardcoded hex) spans. It does
**not** split the raw string on `**bold**` before calling `wrapLatinRuns` — an earlier
version did, and that fragmented lines like `"... (C°02): ..."` into separate chunks
before `wrapLatinRuns` ever saw them, defeating its alnum-core paren-trimming (above) and
producing mismatched, backwards-looking parens around Latin tokens. Feeding the whole
line to `wrapLatinRuns` first and layering bold-detection on its *output* afterward keeps
every paren/brand-token decision exactly as `wrapLatinRuns` intended, regardless of where
a `**` marker happens to land relative to a wrapped span. `CuratorChat.jsx` is currently
its only call site — deliberately not merged into `wrapLatinRuns` itself, since every
other call site renders dictionary prose that never contains markdown syntax.

**`CuratorChat.jsx`'s `ChatMessage` also splits each reply on `\n` and renders every line
as its own block** (see `src/components/README.md`), calling `renderChatMarkdown` once
per line rather than once for the whole message. This is a rendering-layer concern, not
`renderChatMarkdown`'s — the helper itself has no opinion on line/paragraph structure,
only on bold+bidi within a single line of text.

**Markdown headings (`#`/`##`/`###`) are stripped before a line ever reaches
`renderChatMarkdown` (added 2026-09-07).** `CuratorChat.jsx`'s `renderCuratorLine` matches
a leading `HEADING = /^\s*#{1,6}\s+(.*)$/` first, strips the marker, and renders the
remainder as its own `text-accent font-semibold` line — the same visual treatment `**bold**`
already gets, so a heading reads as brand-consistent emphasis instead of a broken literal
`###` (the model occasionally emits headings despite `api/curate/route.js`'s system prompt
now explicitly telling it not to — this is the client-side safety net for when it does
anyway). This mirrors how `wrapBrandNames`/`renderChatMarkdown` already treat bold as a
line-level concern, not a `renderChatMarkdown` one — the heading strip happens one layer
above it, same as the `\n`-split and `LIST_ITEM` regex.

## `formatCuratorContext.js` (added 2026-09-03)

Server-safe (no `fs`, no hooks — plain data-to-text formatting, though in practice only
ever called server-side from `services/CuratorService.js`). `formatCuratorContext(dict)`
takes an already-resolved `en`/`fa` dictionary object (not a language string) and returns
the single grounding-context string the AI curator answers from: the `collection` array
(every field, including nested `specifications`/`partners`/`islandSpecs`/`tallUnits`/
`appliancesDetail`/`accessoriesDetail`), `aboutSections` + `brandStory` (House/brand
heritage), and a handful of acquisition/consultation strings. Pulled out of
`CuratorService.js` into its own `src/lib/` file on request, so this dictionary→text
formatting logic sits alongside `wrapBrandNames.js`/`wrapLatinRuns.js` rather than living
inside a service class. No caching here — `CuratorService.buildContext` is what memoizes
the result per language; calling this function directly re-formats every time.

## `inquiriesStore.js` (added 2026-09-03)

Server-only (`node:fs`/`node:path`) — the single serialized persistence layer for
`data/inquiries.json` (repo-root `data/`, gitignored, real customer PII).
`readInquiries()` returns the parsed array, or `[]` on a missing/corrupt file.
`mutateInquiries(transform)` runs the whole read-modify-write through a module-level
promise chain, and **every** writer — `/api/inquiry`'s public form appends and
`/ledger`'s gated `deleteAction` — queues through that same chain, so two writers can
never interleave (when the API route and the ledger page each had a private queue, a
form submit landing inside an admin delete's read→rename window could silently drop or
resurrect a record). The transform returns the next array, or `null` to skip the write
entirely (ledger's no-match delete). Each write lands atomically: a uniquely-named temp
file + `fs.rename` over the real file, with the temp file unlinked if the rename
throws (Windows EPERM/antivirus lock). The queue is module state — it serializes
writers within one Node process, not across instances; fine for this project's single
persistent-filesystem deployment (see `src/app/README.md`'s `/api/inquiry` section for
that assumption).
