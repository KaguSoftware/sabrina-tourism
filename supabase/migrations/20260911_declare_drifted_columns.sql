-- Declares three columns that exist in the live database but were never added
-- by a migration (they were created directly against the project).
--
-- Why this matters: `savePremadePackage` writes `premade_packages.currency` on
-- every save. Any environment rebuilt from these migrations alone — a fresh dev
-- database, staging, a restore — would therefore reject every fixed-date tour
-- save with PGRST204 "Could not find the 'currency' column". The other two are
-- read-only leftovers, declared here so the schema is reproducible.
--
-- ADD COLUMN IF NOT EXISTS makes this a no-op against the live database; the
-- types and nullability below mirror what is already there.

ALTER TABLE premade_packages
  -- Written by the fixed-dates editor on every save.
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  -- Legacy: read as a fallback when no tier carries a price. Never written.
  ADD COLUMN IF NOT EXISTS price    numeric;

ALTER TABLE hotels
  -- Present in the live schema; not referenced by application code.
  ADD COLUMN IF NOT EXISTS booking_url text NOT NULL DEFAULT '';
