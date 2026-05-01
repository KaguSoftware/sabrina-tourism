-- =============================================================
-- Sabrina Tourism — Supabase Schema
-- Paste this entire file into the Supabase SQL editor and run.
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS / CREATE OR REPLACE.
-- =============================================================


-- -------------------------------------------------------------
-- 1. STORAGE BUCKET
-- -------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;


-- -------------------------------------------------------------
-- 2. HELPER: updated_at auto-bump
-- -------------------------------------------------------------

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- -------------------------------------------------------------
-- 3. TABLES
-- -------------------------------------------------------------

-- 3a. site_content — singleton key/value store for page-level copy
CREATE TABLE IF NOT EXISTS site_content (
  id          text PRIMARY KEY,  -- e.g. 'home_hero', 'home_about', 'home_how_it_works',
                                 --      'home_quote', 'home_featured_heading',
                                 --      'tours_hero', 'transport_hero'
  data        jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_site_content ON site_content;
CREATE TRIGGER set_updated_at_site_content
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3b. packages
CREATE TABLE IF NOT EXISTS packages (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text        UNIQUE NOT NULL,
  name              text        NOT NULL,
  region            text        NOT NULL CHECK (region IN (
                                  'Istanbul',
                                  'Cappadocia',
                                  'Aegean',
                                  'Mediterranean',
                                  'Black Sea',
                                  'Eastern Anatolia'
                                )),
  duration          text        NOT NULL,
  duration_days     int         NOT NULL,
  short_description text        NOT NULL,
  overview          text        NOT NULL, -- paragraphs separated by blank lines
  hero_image        text        NOT NULL, -- Supabase Storage path
  card_image        text,
  min_people        int         NOT NULL DEFAULT 1,
  max_people        int         NOT NULL DEFAULT 8,
  available_from    date        NOT NULL,
  available_to      date        NOT NULL,
  is_published      boolean     NOT NULL DEFAULT false,
  is_featured       boolean     NOT NULL DEFAULT false,
  sort_order        int         NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_packages ON packages;
CREATE TRIGGER set_updated_at_packages
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3c. featured-cap enforcement — max 3 featured packages
CREATE OR REPLACE FUNCTION enforce_featured_cap()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_featured = true THEN
    IF (
      SELECT COUNT(*) FROM packages
      WHERE is_featured = true
        AND id IS DISTINCT FROM NEW.id  -- exclude the row being updated
    ) >= 3 THEN
      RAISE EXCEPTION 'Cannot feature more than 3 packages — please unfeature one first';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_featured_cap_trigger ON packages;
CREATE TRIGGER enforce_featured_cap_trigger
  BEFORE INSERT OR UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION enforce_featured_cap();


-- 3d. package_slug_history — old-URL redirects
CREATE TABLE IF NOT EXISTS package_slug_history (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  old_slug    text        UNIQUE NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- 3e. package_itinerary_days
CREATE TABLE IF NOT EXISTS package_itinerary_days (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  day_number  int         NOT NULL,
  title       text        NOT NULL,
  description text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_package_itinerary_days ON package_itinerary_days;
CREATE TRIGGER set_updated_at_package_itinerary_days
  BEFORE UPDATE ON package_itinerary_days
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3f. package_tiers
CREATE TABLE IF NOT EXISTS package_tiers (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id       uuid        NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  tier_name        text        NOT NULL CHECK (tier_name IN ('Essential', 'Signature', 'Private')),
  vehicle_class    text        NOT NULL,
  accommodation    text        NOT NULL,
  group_size       text        NOT NULL,
  guide_languages  text[]      NOT NULL DEFAULT '{}',
  meals_included   text        NOT NULL,
  highlights       text[]      NOT NULL DEFAULT '{}',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (package_id, tier_name)
);

DROP TRIGGER IF EXISTS set_updated_at_package_tiers ON package_tiers;
CREATE TRIGGER set_updated_at_package_tiers
  BEFORE UPDATE ON package_tiers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3g. package_gallery
CREATE TABLE IF NOT EXISTS package_gallery (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  image_path  text        NOT NULL, -- Supabase Storage path
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_package_gallery ON package_gallery;
CREATE TRIGGER set_updated_at_package_gallery
  BEFORE UPDATE ON package_gallery
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3h. package_inclusions
CREATE TABLE IF NOT EXISTS package_inclusions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  kind        text        NOT NULL CHECK (kind IN ('included', 'not_included')),
  text        text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_package_inclusions ON package_inclusions;
CREATE TRIGGER set_updated_at_package_inclusions
  BEFORE UPDATE ON package_inclusions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3i. transport_airports
CREATE TABLE IF NOT EXISTS transport_airports (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text        UNIQUE NOT NULL,
  label       text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_transport_airports ON transport_airports;
CREATE TRIGGER set_updated_at_transport_airports
  BEFORE UPDATE ON transport_airports
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- 3j. transport_vehicles
CREATE TABLE IF NOT EXISTS transport_vehicles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  text        UNIQUE NOT NULL CHECK (vehicle_id IN ('sedan', 'suv', 'van', 'luxury')),
  label       text        NOT NULL,
  capacity    text        NOT NULL,
  note        text        NOT NULL,
  from_price  text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_transport_vehicles ON transport_vehicles;
CREATE TRIGGER set_updated_at_transport_vehicles
  BEFORE UPDATE ON transport_vehicles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- -------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- -------------------------------------------------------------

ALTER TABLE site_content            ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages                ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_slug_history    ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_itinerary_days  ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_tiers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_gallery         ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_inclusions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_airports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_vehicles      ENABLE ROW LEVEL SECURITY;

-- Public SELECT (anonymous read)
DROP POLICY IF EXISTS "public_read_site_content"           ON site_content;
DROP POLICY IF EXISTS "public_read_packages"               ON packages;
DROP POLICY IF EXISTS "public_read_package_slug_history"   ON package_slug_history;
DROP POLICY IF EXISTS "public_read_package_itinerary_days" ON package_itinerary_days;
DROP POLICY IF EXISTS "public_read_package_tiers"          ON package_tiers;
DROP POLICY IF EXISTS "public_read_package_gallery"        ON package_gallery;
DROP POLICY IF EXISTS "public_read_package_inclusions"     ON package_inclusions;
DROP POLICY IF EXISTS "public_read_transport_airports"     ON transport_airports;
DROP POLICY IF EXISTS "public_read_transport_vehicles"     ON transport_vehicles;

CREATE POLICY "public_read_site_content"           ON site_content            FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_packages"               ON packages                FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_package_slug_history"   ON package_slug_history    FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_package_itinerary_days" ON package_itinerary_days  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_package_tiers"          ON package_tiers           FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_package_gallery"        ON package_gallery         FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_package_inclusions"     ON package_inclusions      FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_transport_airports"     ON transport_airports      FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_transport_vehicles"     ON transport_vehicles      FOR SELECT TO anon USING (true);

-- Authenticated write (admin)
DROP POLICY IF EXISTS "auth_write_site_content"           ON site_content;
DROP POLICY IF EXISTS "auth_write_packages"               ON packages;
DROP POLICY IF EXISTS "auth_write_package_slug_history"   ON package_slug_history;
DROP POLICY IF EXISTS "auth_write_package_itinerary_days" ON package_itinerary_days;
DROP POLICY IF EXISTS "auth_write_package_tiers"          ON package_tiers;
DROP POLICY IF EXISTS "auth_write_package_gallery"        ON package_gallery;
DROP POLICY IF EXISTS "auth_write_package_inclusions"     ON package_inclusions;
DROP POLICY IF EXISTS "auth_write_transport_airports"     ON transport_airports;
DROP POLICY IF EXISTS "auth_write_transport_vehicles"     ON transport_vehicles;

CREATE POLICY "auth_write_site_content"           ON site_content            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_packages"               ON packages                FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_package_slug_history"   ON package_slug_history    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_package_itinerary_days" ON package_itinerary_days  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_package_tiers"          ON package_tiers           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_package_gallery"        ON package_gallery         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_package_inclusions"     ON package_inclusions      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_transport_airports"     ON transport_airports      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_transport_vehicles"     ON transport_vehicles      FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage: media bucket policies
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
DROP POLICY IF EXISTS "auth_write_media"  ON storage.objects;
DROP POLICY IF EXISTS "auth_update_media" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_media" ON storage.objects;

CREATE POLICY "public_read_media"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'media');

CREATE POLICY "auth_write_media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "auth_update_media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "auth_delete_media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media');


-- -------------------------------------------------------------
-- 5. save_package — atomic upsert of a package and all children
-- -------------------------------------------------------------
-- Call via: SELECT save_package($1::jsonb)
-- The JSON shape mirrors PackageEditorPayload in actions.ts.
-- Returns the (possibly new) slug.

CREATE OR REPLACE FUNCTION save_package(p_data jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id            uuid;
  v_old_slug      text;
  v_new_slug      text;
  v_existing_id   uuid;
  v_tier          jsonb;
  v_day           jsonb;
  v_img           jsonb;
  v_inc           jsonb;
  v_i             int;
BEGIN
  v_new_slug := p_data->>'slug';

  -- ── Determine if this is an INSERT or UPDATE ──────────────────────────
  IF p_data->>'id' IS NOT NULL THEN
    -- UPDATE path
    v_id := (p_data->>'id')::uuid;

    SELECT slug INTO v_old_slug FROM packages WHERE id = v_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Package not found: %', v_id;
    END IF;

    -- Check slug uniqueness against OTHER packages
    IF v_new_slug <> v_old_slug THEN
      SELECT id INTO v_existing_id FROM packages WHERE slug = v_new_slug AND id <> v_id;
      IF FOUND THEN
        RAISE EXCEPTION 'SLUG_CONFLICT: Another tour already uses this name. Pick a different name.';
      END IF;

      -- Remove any history row for THIS package that matches the new slug
      -- (rename-back case — prevents redirect loop)
      DELETE FROM package_slug_history
        WHERE package_id = v_id AND old_slug = v_new_slug;

      -- Record the old slug in history
      INSERT INTO package_slug_history (package_id, old_slug)
        VALUES (v_id, v_old_slug)
        ON CONFLICT (old_slug) DO NOTHING;
    END IF;

    UPDATE packages SET
      slug              = v_new_slug,
      name              = p_data->>'name',
      region            = p_data->>'region',
      duration          = p_data->>'duration',
      duration_days     = (p_data->>'duration_days')::int,
      short_description = p_data->>'short_description',
      overview          = p_data->>'overview',
      hero_image        = p_data->>'hero_image',
      card_image        = p_data->>'card_image',
      min_people        = (p_data->>'min_people')::int,
      max_people        = (p_data->>'max_people')::int,
      available_from    = (p_data->>'available_from')::date,
      available_to      = (p_data->>'available_to')::date,
      is_published      = (p_data->>'is_published')::boolean,
      is_featured       = (p_data->>'is_featured')::boolean
    WHERE id = v_id;

  ELSE
    -- INSERT path
    SELECT id INTO v_existing_id FROM packages WHERE slug = v_new_slug;
    IF FOUND THEN
      RAISE EXCEPTION 'SLUG_CONFLICT: Another tour already uses this name. Pick a different name.';
    END IF;

    INSERT INTO packages (
      slug, name, region, duration, duration_days,
      short_description, overview, hero_image, card_image,
      min_people, max_people, available_from, available_to,
      is_published, is_featured, sort_order
    ) VALUES (
      v_new_slug,
      p_data->>'name',
      p_data->>'region',
      p_data->>'duration',
      (p_data->>'duration_days')::int,
      p_data->>'short_description',
      p_data->>'overview',
      p_data->>'hero_image',
      p_data->>'card_image',
      (p_data->>'min_people')::int,
      (p_data->>'max_people')::int,
      (p_data->>'available_from')::date,
      (p_data->>'available_to')::date,
      (p_data->>'is_published')::boolean,
      (p_data->>'is_featured')::boolean,
      COALESCE((SELECT MAX(sort_order) + 1 FROM packages), 0)
    )
    RETURNING id INTO v_id;
  END IF;

  -- ── Itinerary ─────────────────────────────────────────────────────────
  DELETE FROM package_itinerary_days WHERE package_id = v_id;
  v_i := 0;
  FOR v_day IN SELECT * FROM jsonb_array_elements(p_data->'itinerary') LOOP
    INSERT INTO package_itinerary_days (package_id, day_number, title, description, sort_order)
    VALUES (v_id, v_i + 1, v_day->>'title', v_day->>'description', v_i);
    v_i := v_i + 1;
  END LOOP;

  -- ── Tiers ─────────────────────────────────────────────────────────────
  FOR v_tier IN SELECT * FROM jsonb_array_elements(p_data->'tiers') LOOP
    INSERT INTO package_tiers (
      package_id, tier_name, vehicle_class, accommodation,
      group_size, guide_languages, meals_included, highlights
    ) VALUES (
      v_id,
      v_tier->>'tier_name',
      v_tier->>'vehicle_class',
      v_tier->>'accommodation',
      v_tier->>'group_size',
      ARRAY(SELECT jsonb_array_elements_text(v_tier->'guide_languages')),
      v_tier->>'meals_included',
      ARRAY(SELECT jsonb_array_elements_text(v_tier->'highlights'))
    )
    ON CONFLICT (package_id, tier_name) DO UPDATE SET
      vehicle_class   = EXCLUDED.vehicle_class,
      accommodation   = EXCLUDED.accommodation,
      group_size      = EXCLUDED.group_size,
      guide_languages = EXCLUDED.guide_languages,
      meals_included  = EXCLUDED.meals_included,
      highlights      = EXCLUDED.highlights;
  END LOOP;

  -- ── Gallery ───────────────────────────────────────────────────────────
  DELETE FROM package_gallery WHERE package_id = v_id;
  v_i := 0;
  FOR v_img IN SELECT * FROM jsonb_array_elements(p_data->'gallery') LOOP
    INSERT INTO package_gallery (package_id, image_path, sort_order)
    VALUES (v_id, v_img->>'path', v_i);
    v_i := v_i + 1;
  END LOOP;

  -- ── Inclusions ────────────────────────────────────────────────────────
  DELETE FROM package_inclusions WHERE package_id = v_id;
  v_i := 0;
  FOR v_inc IN SELECT * FROM jsonb_array_elements(p_data->'included') LOOP
    INSERT INTO package_inclusions (package_id, kind, text, sort_order)
    VALUES (v_id, 'included', v_inc->>'text', v_i);
    v_i := v_i + 1;
  END LOOP;
  v_i := 0;
  FOR v_inc IN SELECT * FROM jsonb_array_elements(p_data->'not_included') LOOP
    INSERT INTO package_inclusions (package_id, kind, text, sort_order)
    VALUES (v_id, 'not_included', v_inc->>'text', v_i);
    v_i := v_i + 1;
  END LOOP;

  RETURN v_new_slug;
END;
$$;

-- Grant execute to authenticated role so it can be called via RPC
GRANT EXECUTE ON FUNCTION save_package(jsonb) TO authenticated;


-- -------------------------------------------------------------
-- SEED DATA — populated by the seed script in /scripts/seed.ts
-- -------------------------------------------------------------
