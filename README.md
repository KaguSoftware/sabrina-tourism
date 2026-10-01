# Sabrina Turizm

Website and admin panel for Sabrina Turizm, a boutique travel agency offering private tours, hotel stays and chauffeur services across Türkiye.

Live site: [sabrinaturizm.com](https://sabrinaturizm.com)

## Features

- Tour packages (premade, fixed-date and daily) with itineraries, pricing tiers and galleries
- Hotels, regions and transportation pages with airport and custom transfer inquiry forms
- Booking handoff to WhatsApp with a prefilled message
- PDF tour plans and vouchers generated on the server (`/api/pdf/*`)
- Currency switcher (9 currencies) with live exchange rates (`/api/rates`)
- 10 languages through next-intl: English, Turkish, Arabic (RTL), Spanish, Italian, French, German, Russian, Chinese and Japanese
- Admin panel for site copy, packages, hotels, transportation, translations and vouchers, with AI-assisted translation

## Tech stack

| Layer           | Technology                           |
| --------------- | ------------------------------------ |
| Framework       | Next.js 16 (App Router)              |
| UI              | React 19, Tailwind CSS v4            |
| i18n            | next-intl                            |
| Database & Auth | Supabase (Postgres, Auth, Storage)   |
| Language        | TypeScript (strict)                  |
| Forms           | react-hook-form + Zod                |
| PDF             | @react-pdf/renderer                  |
| Tests           | Vitest                               |
| Deployment      | Vercel                               |

## Getting started

```bash
npm install
# create .env.local (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor, then the files in `supabase/migrations/` in order.
3. Seed sample data once with `npm run seed`.

See `supabase/README.md` for details.

### Environment variables

Create `.env.local` in the repo root:

| Variable | Required | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Public Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only admin actions and the seed script |
| `NEXT_PUBLIC_WA_PHONE` | yes | WhatsApp number for booking and inquiry links |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for the sitemap |
| `GROQ_API_KEY` | no | AI translation in the admin panel |
| `EXCHANGE_RATES_URL`, `EXCHANGE_RATES_FALLBACK_URL` | no | Override the default exchange rate sources |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npm run seed` | Seed Supabase with sample data |

## Project structure

```
src/
  app/
    [locale]/(public)/  Public pages (home, tours, packages, hotels, regions, transportation, legal)
    admin/              Admin panel (login, then auth-gated sections)
    api/                PDF generation and exchange rates
  components/           UI, grouped by page and feature
  i18n/                 Locales, routing and currencies
  lib/                  Supabase clients, data access and helpers
  proxy.ts              Locale routing and admin auth guard
messages/               Translation files, one per locale
supabase/               Schema, migrations and setup notes
scripts/seed.ts         One-time data seeder
```

## Admin access

Create a user in Supabase (Authentication, Users, Add user), then sign in at `/admin/login`.

## Deployment

The site deploys on Vercel. Set the environment variables above in the Vercel project settings before the first build.
