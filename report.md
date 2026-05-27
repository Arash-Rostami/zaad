# ZAAD Component Health Report

This report outlines the structural health of the Next.js components and provides the exact fixes for malfunctions and poor practices identified during Phase 1 of the audit. As requested, no codebase modifications have been made.

## 1. InitialLoader: Hydration Mismatch & Script Misplacement
**File:** `src/components/InitialLoader.jsx`
**Status:** Malfunctioning / Severe

**Issue:**
The component attempts to render a `<script>` tag that modifies the `documentElement.classList` during the render phase. In Next.js (App Router), this inline script will render on the server, but the React tree during hydration will mismatch if the browser modifies the DOM before React hydrates. Additionally, rendering `<script>` tags inside `<body>` components (as this is included in `layout.js` inside `<body>`) is an anti-pattern and can cause Next.js to throw severe hydration mismatch errors.

**Fix:**
Remove the script from `InitialLoader.jsx`. If a blocking script is required to prevent a flash of unstyled content or to skip the loader, it must be placed inside the `<head>` of `layout.js`.

```jsx
// src/components/InitialLoader.jsx
// Remove the <script> block and only return the <AnimatePresence> tree.
export default function InitialLoader() {
    // ...
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div ...>
                    {/* ... */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

## 2. useTheme: Hydration Mismatch
**File:** `src/hooks/useTheme.js`
**Status:** Warning

**Issue:**
The initial state is hardcoded to `"light"`, but the `useEffect` reads `localStorage` and updates it. This means the server renders "light", but the client might have "dark" saved. This will cause a hydration mismatch on the first render for any component depending on `themeMode` (e.g., `ControlsFooter.jsx`).

**Fix:**
Use an initialization state (`mounted`) to ensure the client-side component only renders the theme-dependent UI *after* it has read from `localStorage`.

```javascript
// src/hooks/useTheme.js
export default function useTheme() {
  const [themeMode, setThemeMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cached = localStorage.getItem("zaad-theme");
    const initialMode = cached || "light";
    setThemeMode(initialMode);
    applyThemeClass(initialMode);
  }, []);

  const handleThemeChange = (mode) => {
    // ...
  };

  return { themeMode, handleThemeChange, mounted };
}
```

## 3. useConcierge: Missing Dependencies & Date.now() Safety
**File:** `src/hooks/useConcierge.js`
**Status:** Warning

**Issue:**
While `Date.now()` and `Math.random()` are used safely inside event handlers (`handleSendMessage`, `handleInquirySubmit`) and `useEffect`, there's a missing dependency in the `useEffect` that triggers the curator response. `t` (the translation function) is missing from the dependency array in the initial `useEffect`.

**Fix:** Add `t` to the dependency array.

```javascript
// src/hooks/useConcierge.js
  useEffect(() => {
    setChatMessages([
      {
        id: "curator-welcome",
        role: "assistant",
        content: t("curatorWelcome"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language, t]); // Added 't'
```

## 4. ProductDetailsPage: Missing Dependencies
**File:** `src/components/ProductDetailsPage.jsx`
**Status:** Healthy / Minor Warning

**Issue:**
The `useEffect` used to scroll to the top works but strictly speaking should include `item.id` in its dependency array to ensure it re-fires correctly when the route changes between products. Currently, it does include it, which is correct.

```javascript
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [item.id]);
```

## 5. useShowcase: Hydration & DOM Access
**File:** `src/hooks/useShowcase.js`
**Status:** Healthy

**Analysis:**
The showcase logic utilizes state cleanly and passes properties down to components. The `getBoundingClientRect()` calls are safely contained within event handlers (`handleMacroMouseMove`, `handleMacroTouchMove`), avoiding any server-side execution errors.

## 6. Server / Client Boundaries
**Status:** Healthy

**Analysis:**
The project correctly leverages App Router boundaries. `src/app/layout.js`, `src/app/page.js`, and `src/app/collection/[slug]/page.js` are clean Server Components. The `"use client"` directive is accurately isolated to interactive islands (e.g., `ProductPageClient.jsx`, `AppShell.jsx`, and specific UI components). Data fetching (via `MetadataService`) and SEO generation are correctly handled on the server. There are no unnecessary `"use client"` directives observed at the page level.

## 7. MetadataService Typos
**File:** Various Imports
**Status:** Malfunctioning / Severe

**Issue:**
There was a typo where imports in layout.js, page.js, and collection page are looking for `MetaDataService` but the file was named `MetaDataService.js` and exporting `MetadataService`. This caused the build to fail on Linux systems (due to case sensitivity).
**Fix:**
Rename `src/services/MetaDataService.js` to `src/services/MetadataService.js`.
