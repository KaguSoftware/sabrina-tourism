# Meridian & Co.

Boutique tourism website for Meridian & Co. — a concierge agency offering private tours and chauffeur services across Türkiye. Built as a full-stack Next.js application with a CMS-backed admin panel, dynamic package catalogue, and a Supabase database.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Database & Auth | Supabase (Postgres + Auth + Storage) |
| Language | TypeScript (strict) |
| Forms | react-hook-form + Zod |
| Drag & drop | @dnd-kit |
| Deployment | Vercel |

## Local setup

```bash
# 1. Clone
git clone <repo-url>
cd sabrina-tourism

# 2. Copy env template and fill in your Supabase credentials
cp .env.local.example .env.local
# Edit .env.local — see Environment variables below

# 3. Install dependencies
npm install

# 4. Apply the database schema
# Paste the contents of supabase/schema.sql into the Supabase SQL editor and run it.

# 5. Seed initial data (run once after schema is applied)
npm run seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` with these four values (all available in the Supabase project dashboard):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_WA_PHONE=+905XXXXXXXXX
```

## Admin access

1. Navigate to `/admin/login`.
2. Create the admin user via **Supabase Dashboard → Authentication → Users → Add user**.
3. Log in with that email and password.

The admin panel covers: home page copy, tours catalogue (create / edit / reorder / feature), tours listing page hero, and transportation page hero + fleet.

## Folder structure

```
src/
  app/              Next.js App Router pages
    (public)/       Public-facing routes (/, /packages, /transportation)
    admin/          Admin panel routes (auth-gated)
  components/
    admin/          Admin-only UI components
    home/           Home page section components
    layout/         SiteHeader, SiteFooter, WhatsAppFAB
    packages/       Package list and detail page components
    transport/      Transportation page component
    primitives/     Shared design-system primitives
  lib/
    db/             Server-side database fetch functions
    supabase/       Supabase client factories and type definitions
    utils/          Shared utilities (slugify, etc.)
    whatsapp/       WhatsApp deep-link message builders
supabase/
  schema.sql        Full Postgres schema — apply via Supabase SQL editor
scripts/
  seed.ts           One-time data seeder (npm run seed)
public/             Static assets
```

## Deployment (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Set the same four environment variables in **Project → Settings → Environment Variables**.
3. Deploy. Vercel picks up `next build` automatically.

## Troubleshooting

**Images don't appear**
Verify the `media` bucket exists in Supabase Storage and its policy allows public reads. The schema creates it automatically — re-run `supabase/schema.sql` if needed.

**`/admin` redirects in a loop**
Check that your Supabase project has an authenticated user and that the anon key is correct. Also verify the middleware matcher in `src/middleware.ts` does not accidentally exclude `/admin` routes.

**Build fails with "Missing env"**
The build requires all four env vars at compile time. Set them in Vercel's environment variable panel before deploying.

**Seed fails**
Make sure `SUPABASE_SERVICE_ROLE_KEY` is set (not the anon key) and that the schema has been applied first.
