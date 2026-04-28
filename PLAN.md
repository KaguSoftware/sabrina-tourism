# Repo Restructure & Hardening Plan

> Status: **AWAITING APPROVAL** — no code has been changed.  
> Next.js version in use: **16.2.4** · React **19.2.4** · Tailwind **v4**  
> Node module docs were not installed (`node_modules/next/dist/docs/` absent); all Next 16
> conventions below are drawn from the published changelog and Next 16 release notes, which
> align with what the existing code already does (App Router, `next/font/google`, `next/image`
> with `fill`, `metadata` export, `loading.tsx` / `error.tsx` / `not-found.tsx` conventions,
> `robots.ts` / `sitemap.ts` / `manifest.ts` as route handlers).

---

## 1 · Current structure summary

```
/                          ← repo root (no src/)
├── app/
│   ├── fonts.ts           ← Google Font declarations
│   ├── globals.css        ← Tailwind v4 @theme + global styles
│   ├── layout.tsx         ← root layout (metadata, fonts, shell)
│   ├── page.tsx           ← home page
│   ├── packages/
│   │   └── page.tsx       ← /packages route
│   └── transportation/
│       └── page.tsx       ← /transportation route
├── components/
│   ├── home/              (AboutStrip, FeaturedPackages, HeroPanorama, HowItWorks,
│   │                        QuoteStrip, SignatureDestinations)
│   ├── illustrations/     (FleetIllustration, HeroPanoramaSVG, RegionHeroSVG,
│   │                        TransportHeroSVG)
│   ├── layout/            (SiteFooter, SiteHeader, WhatsAppFAB)
│   ├── packages/          (FilterBar, PackageCard, PackageDetailPage, PackageListPage)
│   ├── primitives/        (CustomCursor, GoldButton, GoldUnderlineHeading, Hairline,
│   │                        Kicker, PaperPlanePath, ParallaxImage, PassportStamp,
│   │                        PassportStampTracker, Reveal)
│   └── transport/         (TransportationPage)
├── lib/
│   ├── packages/          (constants.ts, packages.ts, types.ts)
│   ├── signatures/        (constants.ts, signatures.ts, types.ts)
│   ├── transport/         (constants.ts, transport.ts, types.ts)
│   └── whatsapp/          (constants.ts, types.ts, whatsapp.ts)
├── public/                ← static assets (images, favicon…)
├── package.json
└── tsconfig.json
```

**What's missing from every component folder:** `index.ts` barrel file (0 out of 27 folders have one).  
**What exists in every component folder:** `ComponentName.tsx`, `types.ts`, `constants.ts` — all present.

---

## 2 · Target structure

Everything moves under `src/`. The directory tree after the move:

```
/
├── src/
│   ├── app/
│   │   ├── fonts.ts                    ← moved from app/fonts.ts
│   │   ├── layout.tsx                  ← moved; import path for globals.css updates
│   │   ├── page.tsx                    ← moved
│   │   ├── packages/
│   │   │   └── page.tsx                ← moved
│   │   ├── transportation/
│   │   │   └── page.tsx                ← moved
│   │   ├── loading.tsx                 ← NEW (global Suspense boundary UI)
│   │   ├── error.tsx                   ← NEW (global error boundary UI)
│   │   ├── not-found.tsx               ← NEW (404 page)
│   │   ├── robots.ts                   ← NEW
│   │   ├── sitemap.ts                  ← NEW
│   │   └── manifest.ts                 ← NEW (PWA manifest)
│   ├── components/
│   │   ├── home/
│   │   │   ├── AboutStrip/             ← moved; + index.ts added
│   │   │   ├── FeaturedPackages/       ← moved; + index.ts added
│   │   │   ├── HeroPanorama/           ← moved; + index.ts added
│   │   │   ├── HowItWorks/             ← moved; + index.ts added (bug fix applied here)
│   │   │   ├── QuoteStrip/             ← moved; + index.ts added
│   │   │   └── SignatureDestinations/  ← moved; + index.ts added
│   │   ├── illustrations/
│   │   │   ├── FleetIllustration/      ← moved; + index.ts added
│   │   │   ├── HeroPanoramaSVG/        ← moved; + index.ts added
│   │   │   ├── RegionHeroSVG/          ← moved; + index.ts added
│   │   │   └── TransportHeroSVG/       ← moved; + index.ts added
│   │   ├── layout/
│   │   │   ├── SiteFooter/             ← moved; + index.ts added
│   │   │   ├── SiteHeader/             ← moved; + index.ts added (kicker--light fix applied)
│   │   │   └── WhatsAppFAB/            ← moved; + index.ts added
│   │   ├── packages/
│   │   │   ├── FilterBar/              ← moved; + index.ts added
│   │   │   ├── PackageCard/            ← moved; + index.ts added
│   │   │   ├── PackageDetailPage/      ← moved; + index.ts added (fill + Fragment fix applied)
│   │   │   └── PackageListPage/        ← moved; + index.ts added
│   │   ├── primitives/
│   │   │   ├── CustomCursor/           ← moved; + index.ts added
│   │   │   ├── GoldButton/             ← moved; + index.ts added
│   │   │   ├── GoldUnderlineHeading/   ← moved; + index.ts added
│   │   │   ├── Hairline/               ← moved; + index.ts added
│   │   │   ├── Kicker/                 ← moved; + index.ts added
│   │   │   ├── PaperPlanePath/         ← moved; + index.ts added
│   │   │   ├── ParallaxImage/          ← moved; + index.ts added
│   │   │   ├── PassportStamp/          ← moved; + index.ts added
│   │   │   ├── PassportStampTracker/   ← moved; + index.ts added (flag comment)
│   │   │   └── Reveal/                 ← moved; + index.ts added
│   │   └── transport/
│   │       └── TransportationPage/     ← moved; + index.ts added
│   ├── lib/
│   │   ├── env.ts                      ← NEW: validates NEXT_PUBLIC_WA_PHONE at boot
│   │   ├── packages/                   ← moved (constants.ts, packages.ts, types.ts)
│   │   ├── signatures/                 ← moved (constants.ts, signatures.ts, types.ts)
│   │   ├── transport/                  ← moved (constants.ts, transport.ts, types.ts)
│   │   └── whatsapp/                   ← moved; constants.ts reads from env
│   ├── styles/
│   │   └── globals.css                 ← moved from app/globals.css
│   └── types/                          ← NEW: cross-cutting types only
│       └── .gitkeep                    ← placeholder; populate as shared types emerge
├── .editorconfig                        ← NEW
├── .env.example                         ← NEW
├── .eslintrc.cjs  (or eslint.config.js) ← updated with new rules
├── .github/
│   └── workflows/
│       └── ci.yml                       ← NEW
├── .nvmrc                               ← NEW
├── .prettierrc                          ← NEW
├── .prettierignore                      ← NEW
├── AGENTS.md
├── CLAUDE.md
├── PLAN.md
├── README.md                            ← replaced (create-next-app default → real docs)
├── next.config.ts  (or .js)            ← unchanged if exists, else no change needed
├── package.json                         ← devDeps added
├── postcss.config.mjs                  ← unchanged
└── tsconfig.json                        ← paths updated
```

---

## 3 · tsconfig path alias update

**Current** (`tsconfig.json` line 22):
```json
"paths": {
  "@/*": ["./*"]
}
```

**Target:**
```json
"paths": {
  "@/*": ["./src/*"]
}
```

**Compatibility note:** Next 16 with `moduleResolution: "bundler"` resolves the `@/*` alias
via the `paths` map before bundling. Changing the target to `./src/*` is the canonical
approach documented for `src/`-layout projects and is fully supported. Every existing
`@/components/…`, `@/lib/…` import continues to resolve correctly after the move — only the
tsconfig root pointer changes, not the import strings in source files.

---

## 4 · Component colocation contract

**Required files per folder:**
- `ComponentName.tsx`
- `types.ts`
- `constants.ts`
- `index.ts` (barrel)

**Current state — what is missing:**

Every single one of the 27 component folders is missing `index.ts`. No other required files
are missing (`types.ts` and `constants.ts` exist in all 27 folders).

**Complete list of folders missing `index.ts`:**

| Folder | Missing |
|--------|---------|
| `components/home/AboutStrip/` | `index.ts` |
| `components/home/FeaturedPackages/` | `index.ts` |
| `components/home/HeroPanorama/` | `index.ts` |
| `components/home/HowItWorks/` | `index.ts` |
| `components/home/QuoteStrip/` | `index.ts` |
| `components/home/SignatureDestinations/` | `index.ts` |
| `components/illustrations/FleetIllustration/` | `index.ts` |
| `components/illustrations/HeroPanoramaSVG/` | `index.ts` |
| `components/illustrations/RegionHeroSVG/` | `index.ts` |
| `components/illustrations/TransportHeroSVG/` | `index.ts` |
| `components/layout/SiteFooter/` | `index.ts` |
| `components/layout/SiteHeader/` | `index.ts` |
| `components/layout/WhatsAppFAB/` | `index.ts` |
| `components/packages/FilterBar/` | `index.ts` |
| `components/packages/PackageCard/` | `index.ts` |
| `components/packages/PackageDetailPage/` | `index.ts` |
| `components/packages/PackageListPage/` | `index.ts` |
| `components/primitives/CustomCursor/` | `index.ts` |
| `components/primitives/GoldButton/` | `index.ts` |
| `components/primitives/GoldUnderlineHeading/` | `index.ts` |
| `components/primitives/Hairline/` | `index.ts` |
| `components/primitives/Kicker/` | `index.ts` |
| `components/primitives/PaperPlanePath/` | `index.ts` |
| `components/primitives/ParallaxImage/` | `index.ts` |
| `components/primitives/PassportStamp/` | `index.ts` |
| `components/primitives/PassportStampTracker/` | `index.ts` |
| `components/primitives/Reveal/` | `index.ts` |
| `components/transport/TransportationPage/` | `index.ts` |

**Barrel contract** — each `index.ts` will re-export the component and its types:
```ts
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./types";
```

---

## 5 · Bugs to fix during the move

> Do NOT fix yet. Fix order: apply each fix in the same commit that moves the file.

### Bug 1 — `HowItWorks/HowItWorks.tsx` line 82: `require("react")` in component body

**File:** `src/components/home/HowItWorks/HowItWorks.tsx`  
**Problem:** Inside `StepCard`, `useState` is destructured via `const { useState } = require("react")` inside the function body. This violates the Rules of Hooks (a hook call behind a dynamic require), breaks Fast Refresh, and will throw in strict mode.  
**Fix:** Remove the `require` line. Add `useState` to the existing top-level import: `import { useRef, useEffect, useState } from "react";`

### Bug 2 — `PackageDetailPage/PackageDetailPage.tsx` lines 124–129: `fill` in non-relative container

**File:** `src/components/packages/PackageDetailPage/PackageDetailPage.tsx`  
**Problem:** The inline photo strip wraps each `<Image fill …>` in `<div className="aspect-[4/3] overflow-hidden">`. `next/image` with `fill` requires the parent to be `position: relative` (or `absolute`/`fixed`). The `aspect-[4/3]` utility does not set `position: relative`, so the image escapes its container and renders incorrectly.  
**Fix:** Add `relative` to the wrapper div: `<div className="relative aspect-[4/3] overflow-hidden">`.

### Bug 3 — `PackageDetailPage/PackageDetailPage.tsx` lines 210–220: `<>` fragment with `key` in `.map()`

**File:** `src/components/packages/PackageDetailPage/PackageDetailPage.tsx`  
**Problem:** The tier card `<dl>` maps over label/value pairs and wraps `<dt>` + `<dd>` in a bare `<>…</>` fragment. Keys are placed on `<dt>` and `<dd>` individually rather than on the fragment. React requires keyed fragments to use `<Fragment key={…}>` from `react`, not shorthand `<>`.  
**Fix:** `import { Fragment } from "react"` at the top; replace `<> … </>` with `<Fragment key={dt}> … </Fragment>` and remove the individual `key` props from `<dt>` and `<dd>`.

### Bug 4 — `SiteHeader/SiteHeader.tsx` line 76 & `PackageDetailPage.tsx` line 303: `kicker--light` not defined

**Files:** `src/components/layout/SiteHeader/SiteHeader.tsx`, `src/components/packages/PackageDetailPage/PackageDetailPage.tsx`  
**Problem:** `className="kicker--light"` is passed as a modifier to `<Kicker>`. The class `kicker--light` is referenced but never defined in `globals.css`. The Kicker component likely spreads `className` onto its root element; the class silently does nothing.  
**Fix:** Add `.kicker--light` rule to `src/styles/globals.css` that lightens the kicker text color (e.g., `color: var(--color-cream)` with reduced opacity) to make it legible over dark hero backgrounds — which is clearly the intent at both usage sites.

### Bug 5 — `PassportStampTracker/PassportStampTracker.tsx` lines 27–33: fragile `textContent` matching

**File:** `src/components/primitives/PassportStampTracker/PassportStampTracker.tsx`  
**Problem:** Section detection works by querying `h1, h2, h3` elements and filtering with `el.textContent?.toLowerCase().includes(name.toLowerCase())`. This will false-positive on partial matches (e.g., section name "route" matches any heading containing the word "route"), is sensitive to copy changes, and may match nested headings unintentionally. It also observes every matching candidate simultaneously, so the stamp can trigger from an off-screen duplicate.  
**Flag for review:** This is an architectural decision, not a one-line fix. Recommended future approach: add `data-section="SectionName"` attributes to the relevant `<section>` elements and query only those. Do not fix during this move — flag with a `// TODO` comment.

---

## 6 · Industry-standard additions

### 6a · Prettier

**New files:**
- `.prettierrc` — config including `prettier-plugin-tailwindcss` for class sorting
- `.prettierignore` — excludes `.next/`, `node_modules/`, `public/`

**Dependency additions (`devDependencies`):**
```
prettier
prettier-plugin-tailwindcss
```

**`package.json` script addition:**
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

### 6b · ESLint tightening

The project already has `eslint-config-next`. Extend with:

**New dependency additions (`devDependencies`):**
```
eslint-plugin-import
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
```

**Rules to add in `eslint.config.js` (or `.eslintrc.cjs`):**
- `import/order` — enforce module group ordering: builtin → external → `@/*` internal → relative
- `no-restricted-imports` with pattern `../../` (blocks relative parent imports deeper than 1 level; `@/` aliases must be used instead)
- `@typescript-eslint/consistent-type-imports` — enforce `import type` for type-only imports

### 6c · `.editorconfig`

**New file:** `.editorconfig`
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### 6d · `.nvmrc`

**New file:** `.nvmrc`
```
20
```
Pins Node to the current LTS major. `@types/node` is already `^20` in `package.json`.

### 6e · `.env.example` and `src/lib/env.ts`

**New file:** `.env.example`
```sh
# WhatsApp contact number — include country code, no spaces or dashes
# Example: +905301234567
NEXT_PUBLIC_WA_PHONE="+90XXXXXXXXXX"
```

**New file:** `src/lib/env.ts`  
Validates `NEXT_PUBLIC_WA_PHONE` at module load time (no new runtime dependencies — plain TypeScript):
```ts
// Validated at build time and at server start.
const phone = process.env.NEXT_PUBLIC_WA_PHONE;
if (!phone || !/^\+\d{7,15}$/.test(phone)) {
  throw new Error(
    "NEXT_PUBLIC_WA_PHONE is missing or invalid. Set it in .env.local (e.g. +905301234567)."
  );
}
export const WA_PHONE = phone;
```

**Change to `src/lib/whatsapp/constants.ts`:**  
Remove the hardcoded `export const WA_PHONE = "+905XXXXXXXXX"`.  
Replace with `export { WA_PHONE } from "@/lib/env";`

### 6f · App Router special routes

All go under `src/app/`:

| File | Purpose |
|------|---------|
| `loading.tsx` | Global `<Suspense>` fallback — animated skeleton or spinner using existing brand colors |
| `error.tsx` | `"use client"` error boundary — shows a minimal error message with a retry button |
| `not-found.tsx` | 404 page — brand-appropriate message + link back to home |
| `robots.ts` | `export default function robots()` returning `{ rules, sitemap }` |
| `sitemap.ts` | `export default function sitemap()` returning static + package routes |
| `manifest.ts` | `export default function manifest()` returning PWA manifest (name, icons, theme_color) |

### 6g · README.md

Replace the create-next-app boilerplate with a project README covering:
- Project name and one-line description
- Tech stack (Next 16, React 19, Tailwind v4, TypeScript)
- Getting started (`cp .env.example .env.local`, `npm install`, `npm run dev`)
- Environment variables table
- Folder structure overview
- Contributing notes (Prettier, ESLint, Node version)

### 6h · GitHub Actions CI

**New file:** `.github/workflows/ci.yml`

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
```

---

## 7 · Out of scope (future work)

The following are explicitly **not** part of this plan:

- Redesigning or changing any visual design, colors, or copy
- Swapping or upgrading any library (framer-motion, gsap, etc.)
- Adding a test framework (Vitest, Playwright) — recommended as next initiative
- Adding i18n / locale routing
- Database or CMS integration
- Image optimization pipeline changes (CDN, next.config `images` domains)
- Removing or replacing any existing component logic

---

## Execution order (for the implementation prompt)

1. Update `tsconfig.json` paths
2. Create `src/` directory and move all files (maintaining internal structure)
3. Update `src/app/layout.tsx` import path for `globals.css` (now `../styles/globals.css`)
4. Apply Bug 1–4 fixes in-place while moving the affected files
5. Add `// TODO` comment in PassportStampTracker (Bug 5 flag)
6. Add `index.ts` barrel to every component folder (27 files)
7. Add `src/lib/env.ts` + update `src/lib/whatsapp/constants.ts`
8. Add `src/app/loading.tsx`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `manifest.ts`
9. Add `.editorconfig`, `.nvmrc`, `.env.example`
10. Add `.prettierrc`, `.prettierignore`, install Prettier deps
11. Update ESLint config + install ESLint plugin deps
12. Add `.github/workflows/ci.yml`
13. Replace `README.md`
14. Run `npm run format`, `npm run lint`, `npx tsc --noEmit`, `npm run build` — fix any errors
