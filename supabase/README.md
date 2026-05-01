# Supabase Setup

## 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and wait for it to finish provisioning.

## 2. Run the schema

Open the **SQL Editor** in your Supabase dashboard, paste the contents of `schema.sql`, and click **Run**.

This creates the `media` storage bucket, all tables, the featured-cap trigger, `updated_at` auto-bump triggers, and RLS policies in one shot.

## 3. Seed the data

Copy your Supabase project URL and anon key from **Project Settings → API** into a `.env.local` file at the repo root:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Then run:

```bash
npm run seed
```

The seed script (`scripts/seed.ts`) reads the static data files and inserts all packages, itinerary days, tiers, gallery images, inclusions, airports, vehicles, and site content rows.
