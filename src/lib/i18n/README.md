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
  (`advantageCards`, `materialSamples`, `blueprintSections`, `aboutSections`, `brandStory`,
  `aboutStats`/`sustainabilityStats`/`csrStats`, and the
  `collection` array of 4 items by `id`: `gavv`, `zivv`, `rakh`, `varr`). `aboutSections`
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

> Note: the Farsi copy in `fa.js` (collection + UI strings) is currently placeholder,
> to be refined. The localization **logic** is complete; only the text content is mock.

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
data("blueprintSections") // array of blueprint section objects
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
that lacks Persian digit glyphs). `studioPhone` (`"+۳۹ ۰۵۵ ۰۰۰۰ ۰۰۰"`) is the example:
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

## Do not

- Hardcode language strings in components with `isFarsi ? "FA" : "EN"` ternaries —
  put them in both dictionaries and use `t(...)`.
- Drop a key from `fa.js` that exists in `en.js`. `t(key)` falls back to English (safe),
  but `data(key)` falls back to `null` (not English) — a missing array/object key will
  crash a `.map()`. Keep `fa.js` structurally parallel to `en.js`: every key present,
  even if the text is placeholder.
- Add an `items` override object to `fa.js` — the per-item-override architecture was
  replaced by the full-dictionary swap. (A previous version of this README described
  an `items: { gavv, zivv, rakh, varr }` object and a `getItemTranslations(id)`
  helper; neither exists in the code. `getItemTranslations` was dead code that always
  returned `null` and has been removed.)