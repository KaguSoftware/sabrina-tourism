-- Add rich fields to premade_packages
ALTER TABLE premade_packages
  ADD COLUMN IF NOT EXISTS region           text,
  ADD COLUMN IF NOT EXISTS duration         text,
  ADD COLUMN IF NOT EXISTS min_people       int,
  ADD COLUMN IF NOT EXISTS max_people       int,
  ADD COLUMN IF NOT EXISTS available_from   date,
  ADD COLUMN IF NOT EXISTS available_to     date,
  ADD COLUMN IF NOT EXISTS overview         text;

-- Itinerary days
CREATE TABLE IF NOT EXISTS premade_package_itinerary_days (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES premade_packages (id) ON DELETE CASCADE,
  day_number  int         NOT NULL,
  title       text        NOT NULL DEFAULT '',
  description text        NOT NULL DEFAULT '',
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Tiers (0–3 per package; tier_name is the label)
CREATE TABLE IF NOT EXISTS premade_package_tiers (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id      uuid        NOT NULL REFERENCES premade_packages (id) ON DELETE CASCADE,
  tier_name       text        NOT NULL,
  vehicle_class   text        NOT NULL DEFAULT '',
  accommodation   text        NOT NULL DEFAULT '',
  group_size      text        NOT NULL DEFAULT '',
  guide_languages text[]      NOT NULL DEFAULT '{}',
  meals_included  text        NOT NULL DEFAULT '',
  highlights      text[]      NOT NULL DEFAULT '{}',
  sort_order      int         NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Inclusions / exclusions
CREATE TABLE IF NOT EXISTS premade_package_inclusions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES premade_packages (id) ON DELETE CASCADE,
  kind        text        NOT NULL CHECK (kind IN ('included', 'not_included')),
  text        text        NOT NULL DEFAULT '',
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE premade_package_itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE premade_package_tiers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE premade_package_inclusions     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_premade_itinerary"   ON premade_package_itinerary_days;
DROP POLICY IF EXISTS "public_read_premade_tiers"       ON premade_package_tiers;
DROP POLICY IF EXISTS "public_read_premade_inclusions"  ON premade_package_inclusions;

CREATE POLICY "public_read_premade_itinerary"  ON premade_package_itinerary_days FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_premade_tiers"      ON premade_package_tiers          FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_premade_inclusions" ON premade_package_inclusions      FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "auth_write_premade_itinerary"  ON premade_package_itinerary_days;
DROP POLICY IF EXISTS "auth_write_premade_tiers"      ON premade_package_tiers;
DROP POLICY IF EXISTS "auth_write_premade_inclusions" ON premade_package_inclusions;

CREATE POLICY "auth_write_premade_itinerary"  ON premade_package_itinerary_days FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_premade_tiers"      ON premade_package_tiers          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_premade_inclusions" ON premade_package_inclusions      FOR ALL TO authenticated USING (true) WITH CHECK (true);
