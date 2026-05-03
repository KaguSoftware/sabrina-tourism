# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run seed       # Seed Supabase with sample data
```

No test framework is configured. Type-check and lint are the primary correctness gates.

## Environment

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public Supabase credentials
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used in admin Server Actions
- `NEXT_PUBLIC_WA_PHONE` — WhatsApp phone number for the FAB and transport inquiry forms

## Architecture

**Stack:** Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 · Supabase (Postgres + Auth + Storage)

### Route groups

```
src/app/
  (public)/          # Marketing site — no auth required
    page.tsx         # Home
    packages/        # Tour listing + [slug] detail pages
    transportation/  # Fleet & inquiry page
  admin/
    login/           # Supabase email/password auth
    (authed)/        # Auth-gated via middleware; layout wraps AdminSidebar
      home/          # Edit home page copy (site_content table)
      packages/      # Full CRUD + reorder + feature flag
      tours-page/    # Edit packages listing hero copy
      transportation/ # Edit fleet cards & hero copy
```

### Data layer (`src/lib/`)

- `lib/supabase/browser.ts` — browser Supabase client (singleton)
- `lib/supabase/server.ts` — server Supabase client (uses `@supabase/ssr` cookies)
- `lib/db/packages.ts` — all package CRUD queries
- `lib/db/site-content.ts` — key/value CMS content queries
- `lib/db/transport.ts` — fleet & transport content queries
- `lib/db/signatures.ts` — signature destinations queries
- `lib/auth/actions.ts` — Server Actions for login/logout

Admin mutations are done via **Server Actions** using the service-role client from `lib/supabase/server.ts`. Public pages use the anon client.

### Component structure (`src/components/`)

- `primitives/` — generic UI atoms (Reveal, GoldButton, DatePicker, ParallaxImage, etc.)
- `layout/` — SiteHeader, SiteFooter, WhatsAppFAB
- `home/` — section components for the home page
- `packages/` — PackageCard, FilterBar, PackageListPage, PackageDetailPage (with sub-components for gallery, itinerary, tiers, lightbox)
- `transport/` — TransportationPage with AirportForm and CustomForm
- `admin/` — PackageEditor (tabbed: Basics, Overview, Itinerary, Tiers, Gallery, Inclusions), ImageUploader, shared form primitives
- `illustrations/` — inline SVG animations (HeroPanoramaSVG, TransportHeroSVG, RegionHeroSVG, FleetIllustration)

### Image storage

Public images are stored in Supabase Storage. `lib/supabase/storage.ts` (browser) and `lib/supabase/storage-server.ts` (server) expose upload/delete helpers. The `next.config.ts` allowlists Supabase and Unsplash domains for `next/image`.

### Forms

Admin forms use **react-hook-form** + **zod** validation. Transport inquiry forms (AirportForm, CustomForm) POST via Server Actions. Toast feedback uses **sonner**.

### Drag-and-drop

Package reordering in the admin uses **@dnd-kit** (core + sortable + utilities).

### Path alias

`@/*` resolves to `src/*` — always use this alias for imports.
