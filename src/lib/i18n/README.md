#  Translation & Data Registry

## Purpose

This folder is the **single source of truth** for all user-visible text, structured data, and product collection definitions. No component or hook should hardcode language strings or product data directly.

## Files

| File | Role |
|------|------|
| `en.js` | English translations + full product collection + brand story |
| `fa.js` | Farsi translations + Farsi text overrides for collection items |
| `config.js` | Supported language codes and default language |

## How to use in components

Import `useLanguage()` from `TranslationService`:

```js
import {useLanguage} from "./TranslationService";

const {t, data, getItemTranslations, language, isFarsi} = useLanguage();
```

### `t(key)` — flat string

Returns a translated string for a given key. Falls back to English if the key is missing in the active language.

```js
t("showcaseTitle")       // "Curated Showcase" | "ویترین اختصاصی"
t("submitInquiry")       // "Submit Secure Inquiry" | "ثبت نهایی درخواست رزرو امن"
```

### `data(key)` — structured object or array

Returns arrays or objects. Falls back to English.

```js
data("collection")        // full array of 4 kitchen items (always EN structural data)
data("advantageCards")    // array of advantage card objects in active language
data("materialSamples")   // array of material sample objects in active language
data("blueprintSections") // array of blueprint section objects in active language
data("brandStory")        // { philosophy, tagline, narrative_1, narrative_2 }
```

### `getItemTranslations(id)` — per-item text overrides

Returns FA text overrides for a collection item by id. Returns `null` for English (components fall back to item fields directly).

```js
const itemTrans = getItemTranslations("gavv");
// FA: { name, dimensions, materials[], description, story, provenance, … }
// EN: null

// Usage pattern in components:
const name = itemTrans?.name || item.name;
```

## Adding a new translation key

1. Add the key to `en.js` with the English value.
2. Add the same key to `fa.js` with the Farsi value.
3. Use `t("yourKey")` in the component.

## Collection data architecture

- `en.js` exports `collection: [ /* 4 full item objects */ ]` containing all structural fields (images, specs, partners, islandSpecs, tallUnits, appliancesDetail, accessoriesDetail) plus English text.
- `fa.js` exports `items: { gavv: {…}, zivv: {…}, rakh: {…}, varr: {…} }` with Farsi overrides for text fields only.
- `TranslationService` merges them: `data("collection")` returns EN collection; `getItemTranslations(id)` returns FA overrides when active language is Farsi.
- Components always use the `item.*` fields for structural data, and `itemTrans?.field || item.field` for text fields.

## Do not

- Import from `data.js` — it has been removed.
- Hardcode language strings in components using `isFarsi ? "FA" : "EN"` ternaries.
- Add product data anywhere except `en.js` collection and `fa.js` items overrides.
