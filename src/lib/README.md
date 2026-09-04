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
only, which passes the result down as `AppShell`'s `utensilImages` prop → `Story.jsx`'s
auto-cycling carousel (see `src/components/README.md`).

## `localizedYear.js`

`localizedYear(isFarsi)` returns the current Gregorian year (`new Date().getFullYear()`)
formatted via `Intl.NumberFormat` with `useGrouping: false` — Persian digit glyphs when
`isFarsi`, Latin digits otherwise. `useGrouping` must stay `false`: `Intl.NumberFormat`
inserts a thousands separator by default, which turns a 4-digit year into `"2,026"`.
Gregorian year, not a Jalali calendar conversion. Called at render time, not cached in
state — call sites: `Footer.jsx`, `house/HouseFooter.jsx`, composing
`t("footerCopyright").replace("{year}", localizedYear(isFarsi))` (now a single-year
string, e.g. `© {year} ZAAD S.P.A. ...` — no start-date range) before that string reaches
`wrapLatinRuns`.

## `wrapBrandNames.js`

Client-safe, no hook calls, no `isFarsi` parameter needed. `wrapBrandNames(text)` scans a
string for a fixed token list — split into `ZAAD_TOKENS` ("ZAAD", "Dorsa", "Persol Business
Solution", and the four collection codenames "GÁVV"/"ZIVV"/"RÁKH"/"VARR") and `PARTNER_TOKENS`
("Gaggenau", "Domus", "Salice", "Kesseböhmer", "Coopersburg" — the manufacturing/supply
partners named in `en.js`/`fa.js` appliance/hardware spec text), merged into one combined
`BRAND_TOKENS` list — and wraps each match in `<span dir="ltr" className="font-serif">`.
This is a deliberate brand-identity typography rule (these tokens always render in the
site's Playfair serif, regardless of the surrounding text's font) — not a bidi-safety
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
would have merged both words into one span. Confirmed live (computed `fontFamily` checked
via Playwright, both languages) at every call site below, including `Advantages.jsx`'s
`card.desc` (previously wrongly documented in `src/styles/README.md` as a "deliberately
left alone" exception — it isn't; that note has been corrected).

**Wraps in `.font-serif`, not `.font-latin` (changed 2026-09-02, explicit user request).**
Every call site here isolates embedded proper nouns inside Farsi prose — our own brand/
collection names (`ZAAD`, `Dorsa`, `GÁVV`/`ZIVV`/`RÁKH`/`VARR`) and third-party partner
brands (`Gaggenau`, `Domus`, `Salice`, `Kesseböhmer`, etc.) — and the site's rule is that
brand-adjacent proper nouns render in the Playfair `.font-serif` face, not the monospace
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
wrapped something). Current call sites: `Story.jsx`, `Advantages.jsx`, `Materials.jsx`,
`Blueprint.jsx`, `Footer.jsx`, `house/HouseFooter.jsx`, `concierge/InquiryForm.jsx`,
`productdetailspage/ProductMeta.jsx`, `productdetailspage/LookbookPoetry.jsx`,
`productdetailspage/TabArchitecture.jsx` (also its `tower.key`/`listSpecs` entries, not
just `overview`/bullets — anything rendering a dictionary string with embedded Latin
needs this call, not just the obvious paragraph fields), `productdetailspage/TabAppliances.jsx`,
`showcase/ProductPanel.jsx` — every one of these renders dictionary prose (`item.*`
fields, or `t()` strings) that mixes Latin brand names/technical terms into Farsi
sentences at the data layer; see `src/lib/i18n/README.md` for why the dictionary itself
isn't restructured to avoid this instead.

**`concierge/CuratorChat.jsx` (added 2026-09-02)** is the one call site that isolates
*runtime* content, not a dictionary string: `hooks/useConcierge.js`'s `chatMessages`
state mixes static seeded strings (`t("curatorWelcome")`, `t("curatorError")`), raw
user-typed input, and dynamic `/api/curate` (Gemini) response text — all plain strings
with no dictionary-layer control. Wrapping happens once at the message-bubble render,
covering all three sources uniformly rather than threading it through the hook or the
API route. `CuratorChat` needed a new `language` prop from `Concierge.jsx` to compute
`isFarsi` (mirrors the prop `InquiryForm` already received).

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
