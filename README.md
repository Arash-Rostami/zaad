\# ZAAD — Next.js



A digital showroom for ZAAD's curated collection of sculptural objects and bespoke architectural interiors.



Migrated from Vite + Express + TS to \*\*Next.js 15 (App Router) + JavaScript\*\*.



\## Stack



\- Next.js 15 (App Router, React 19)

\- Tailwind CSS v4 (PostCSS plugin, CSS-first `@theme`)

\- Motion (Framer Motion successor)

\- Lucide React icons

\- `@google/genai` for the Digital Curator route (`/api/curate`)



\## Run locally



```bash

npm install

cp .env.example .env.local   # then add your real GEMINI\_API\_KEY

npm run dev

```



Opens at <http://localhost:3000>.



\## Build



```bash

npm run build

npm start

```



\## Architecture notes



\- All interactive components carry `"use client"` at the top (state, motion, browser APIs).

\- `app/layout.js` and the API routes stay as \*\*server components / route handlers\*\* — keeps the client bundle lean.

\- `LanguageProvider` (i18n context) wraps the tree in `layout.js`. It is itself a client component.

\- The Express `/api/curate` endpoint became `app/api/curate/route.js` (POST).

\- The custom RAF scroll engine is preserved in `lib/scroll.js`.



