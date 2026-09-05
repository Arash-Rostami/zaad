# Translation & Data Registry

## Purpose

This folder is the **single source of truth** for all user-visible text, structured
data, and product collection definitions. No component or hook should hardcode
language strings or product data directly.

## Files

| File | Role |
|------|------|
| `config.js` | Supported language codes + default language |
| `en.js` | English translations + the full English product collection + brand story |
| `fa.js` | Farsi translations + a **full parallel Farsi product collection** |
| `server.js` | Server-side locale resolver (reads the language cookie via `next/headers`) |

Locales (see `config.js`): `en` (LTR, default) and `fa` (RTL).

## How localization actually works

**The whole dictionary is swapped per locale — there is no per-item override layer.**

- `en.js` and `fa.js` each export a single top-level object with the **same shape**:
  flat string keys (`t("showcaseTitle")`) plus structured arrays/objects
  (`advantageCards`, `materialSamples`, `aboutSections`, `brandStory`,
  `aboutStats`/`sustainabilityStats`/`csrStats`, the
  `collection` array of 4 items by `id`: `gavv`, `zivv`, `rakh`, `vaar`). The fourth
  item's `id`, asset paths (`/image/vaar/*`, `/video/vaar*.mp4`) and URL slug are all
  **"vaar"** — the lookbook's correct spelling, renamed end-to-end in the 2026-09-05
  follow-up to the content-accuracy pass. (Until that date `id`/assets/URL were the
  misspelled `varr` while only the displayed `name` said "VAAR" — a temporary
  decoupling, since removed. The id must keep matching the asset folder name:
  `resolveCollectionImages` reads `public/image/{id}/` at request time and the 360
  spin is `/video/{id}-360.mp4`, so a partial rename silently breaks the image
  pipeline and the 360 player.) `aboutSections`
  (5 items by `id`: `about`, `story`, `brandValue`, `sustainability`, `csr`) powers the
  **three** House routes' editorial blocks, even though there are 5 data entries — `/about`
  reads only `about` (on the single-column `house/HouseChapterShell.jsx`); `/story` reads
  `story` + `brandValue` as a paired `left`/`right` diptych; `/sustainability` reads
  `sustainability` + `csr` the same way (both on the two-column
  `house/HouseDiptychShell.jsx`). The `### I. ...` headings inside each entry's `content`
  are parsed into styled editorial sub-blocks by the shared `EditorialBlock` piece in
  `house/ChapterPieces.jsx`. `story` and `brandValue` have no dedicated stats array —
  `StoryValueChapter` passes `stats={[]}` for both columns, which the stat grid renders as
  nothing. Keep it parallel in `fa.js` like the others.
- `glance` (added 2026-09-05) is the "ZAAD at a glance" lookbook composite for the
  `/glance` route: hero copy, an `overview` chapter, `sections` labels, and per-collection
  `supplements` (gavv/zivv: `tagline`, `narrative`, `materialTable`, `dimensions`,
  `fittings`, `furniture`; rakh/vaar: `tagline`, `narrative`, `materialTable`, `layouts`)
  plus the `matrix` (master spec table + partner directory). It is **supplement-only** —
  the page composes it with `data("collection")` for the shared item data
  (narratives/partners/island specs/appliances), so it must never duplicate collection
  facts. The supplements' key shape is part of the contract: a missing/extra key per id
  in one locale silently renders nothing — keep `en.js` and `fa.js` byte-parallel in shape.
  The flat keys `zaadAtAGlance` and `glanceRailLabel` (the rail `aria-label`) live
  alongside the other flat keys. (A `glance.tags` SEO-keyword block existed briefly on
  2026-09-05 — visible chips + schema `keywords` — and was removed at the user's
  direction the same day; do not re-add visible keyword tags to this page.)
- `fa.js` is a **complete parallel dictionary**, including its own full `collection`
  array — not a thin text-override map. When the active language is `fa`,
  `data("collection")` returns the Farsi collection with already-localized text.
- Therefore components read item fields directly (`item.name`, `item.description`,
  `item.specifications.finish`, …). The item they receive is already in the active
  language **where it came from `data("collection")`** (the showcase, the menu, the
  concierge preselection).

### Product details page — also localized

`/collection/[slug]` resolves the item server-side via `getServerDictionary()` (the
same cookie-aware lookup), so `item.*` is in the active language there too — consistent
with the showcase / menu / concierge paths. `generateStaticParams` emits `en.collection`
ids only (the URL space); `en` and `fa` collections share the same `id` set, so one URL
serves both locales (fragile only if the id sets ever diverge). The
`productdetailspage/` UI chrome (tab labels, section headings, CTAs, the Lookbook
block) is localized via `t(...)`.

> Note (updated 2026-09-05): the `collection` array in both `en.js` and `fa.js` is now
> fact-checked against the real ZAAD lookbook (`ZAAD LOOKBOOK-050216.pdf`, cross-referenced
> against `.claude/data/ZAAD Kitchen Collection.md` — a local research file, not part of
> the tracked repo) rather than mock/invented copy. ZAAD's real location is **Tehran** —
> do not reintroduce Italian geography (Milan/Tuscany/Florence/Carrara/Turin/Sicily/
> Rapolano etc.) into any collection, About, Footer, or CSR copy; an earlier version of
> this content invented a full fictional "Italian atelier" backstory (specific quarries,
> price/weight/lead-time figures, a mistranslated Farsi "forged" as "جعل" i.e.
> "counterfeited") that had no basis in the source material and has been removed. Where
> the lookbook doesn't specify a fact (e.g. per-item price, weight, or lead time), the
> honest value is "Available upon inquiry" / "بر اساس استعلام", not an invented number.

## Using it in components

Import `useLanguage()` from `@/services/TranslationService` (the React context lives
in `src/services/`, **not** `src/contexts/` — that folder is empty):

```js
import {useLanguage} from "@/services/TranslationService";

const {t, data, language, setLanguage, dir, isFarsi} = useLanguage();
```

### `t(key)` — flat string

Returns a translated string. Falls back to English, then to the raw key.

```js
t("showcaseTitle")       // "Curated Showcase" | "مجموعه کلکسیون منتخب"
t("submitInquiry")       // "Submit Secure Inquiry" | "ثبت نهایی درخواست رزرو امن"
```

### `data(key)` — structured object or array

Returns arrays/objects from the active-language dictionary. Falls back to English,
then `null`.

```js
data("collection")        // the 4-item array, already in the active language
data("advantageCards")    // array of advantage card objects
data("materialSamples")   // array of material sample objects
data("brandStory")        // { philosophy, tagline, narrative_1, narrative_2 }
```

## Locale transport — the `zaad_preferred_language` cookie

The chosen locale is carried by a cookie named **`zaad_preferred_language`**
(this name is load-bearing — renaming either side breaks SSR lang/dir):

- **Client writes it** in `TranslationService` (`setLanguage`): writes the same value
  to `localStorage` and to a cookie `zaad_preferred_language=…; path=/; max-age=31536000; SameSite=Lax`.
- **Server reads it** in `server.js` (`getServerLanguage`): reads the cookie via
  `next/headers` `cookies()`; accepts only `"en"`/`"fa"`, else falls back to
  `defaultLanguage` (`"en"`).
- The root layout (`src/app/layout.js`) runs `getServerLanguage()` on the server and
  passes the result as `initialLanguage` to the client `LanguageProvider`, and sets
  `<html lang dir>` server-side. The provider's `useEffect` then keeps `<html
  lang/dir>` and the `farsi-mode` class in sync on the client. `suppressHydrationWarning`
  on `<html>` is required for this.

There are **no locale-prefixed routes** — i18n is cookie-only. (This makes the
`fa` hreflang in `MetaDataService` point at the same URL as `en`; see
`src/services/ARCHITECTURE.md` for that known SEO limitation.)

## Adding a new translation key

1. Add the key to `en.js` with the English value.
2. Add the **same key** to `fa.js` with the Farsi value.
3. Use `t("yourKey")` in the component.

## Adding a new collection item

1. Add the full item object to the `collection` array in **`en.js`** (structural
   fields + English text).
2. Add the **same item** (same `id`) to the `collection` array in **`fa.js`** with
   Farsi text. Keep the two arrays in the same order and with matching `id`s.
3. The sitemap (`src/app/sitemap.js`) and `generateStaticParams`
   (`src/app/collection/[slug]/page.js`) derive URLs from `en.collection` ids, so the
   `id` must be URL-safe and stable.

## Digit convention in `fa.js`

Every number in `fa.js` uses **Farsi-Indic digits** (۰–۹) — phone display text, product
`dimensions` descriptions, `year`, `price` — with exactly one exception: the collection
`number` code (`"C°01"`…`"C°04"`), which is a permanent Latin brand mark, not a number
(see the `.font-latin` contract in `src/styles/README.md`).

**A Farsi-digit value that has more than one space-separated group still needs
`dir="ltr"` on its wrapping element** (but *not* `.font-latin` — that forces a Latin font
that lacks Persian digit glyphs). `studioPhone` (`"+۹۸ ۲۱ ۰۰۰۰ ۰۰۰۰"`) is the example:
Arabic-script digits are native to RTL text and usually need no help (a single token like
`year` or a colon-joined range like `appointmentSlotMorning1Time` renders correctly with
no wrapper at all), but once a value is a *sequence* of space-separated numeric groups,
the spaces between them are bidi-neutral and can visually reorder the groups under the
surrounding RTL paragraph — the same underlying issue `wrapLatinRuns.js` handles for
mixed Latin/Farsi runs, just triggered by neutral characters (spaces) instead of Latin
letters this time. `dir="ltr"` pins the group order without touching the digit glyphs or
font.

**Stays Western/ASCII regardless of locale:** only `studioPhoneTel` (the raw `tel:` URI
value — Persian digits would break dialing on many devices) and the collection `number`
code. Scientific unit values (`density: "2.42 g/cm³ …"`) and Gaggenau model
names/ratings are technical/brand terms, not "numbers", and are left as-is for the same
reason `number`/`name` are — they aren't translatable prose.

**Trailing-punctuation pinning:** when a dictionary string ends in punctuation after a
run whose direction differs from the rendering paragraph (e.g. `footerCraft`'s tooltip
"LATIN. period" on an RTL host, or `footerCopyright`'s final dot after Persian prose),
append the matching invisible directional mark — U+200E (LRM) for Latin-ending strings,
U+200F (RLM) for Farsi-ending ones — so the punctuation stays attached to its run
instead of flinging to the far edge. `fa.js`'s `footerCopyright` carries the RLM.

## Do not

- Hardcode language strings in components with `isFarsi ? "FA" : "EN"` ternaries —
  put them in both dictionaries and use `t(...)`.
- Drop a key from `fa.js` that exists in `en.js`. `t(key)` falls back to English (safe),
  but `data(key)` falls back to `null` (not English) — a missing array/object key will
  crash a `.map()`. Keep `fa.js` structurally parallel to `en.js`: every key present,
  even if the text is placeholder.
- Add an `items` override object to `fa.js` — the per-item-override architecture was
  replaced by the full-dictionary swap. (A previous version of this README described
  an `items: { gavv, zivv, rakh, vaar }` object and a `getItemTranslations(id)`
  helper; neither exists in the code. `getItemTranslations` was dead code that always
  returned `null` and has been removed.)