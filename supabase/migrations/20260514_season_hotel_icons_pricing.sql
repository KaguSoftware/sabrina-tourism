-- =============================================================
-- Sabrina Tourism — Season, Tier Hotels, Inclusion Icons, Pricing Buckets
-- Adds:
--   • season column on packages / premade_packages / daily_packages
--   • hotel_id FK on package_tiers / premade_package_tiers
--   • icon column on package_inclusions / premade_package_inclusions
--   • daily_package_not_included table (parallel to daily_package_included)
--   • icon column on daily_package_included / daily_package_not_included
--   • 4-bucket pricing columns on premade_packages / daily_packages
--   • Updates save_package() to persist season + tier.hotel_id + inclusion.icon
-- Safe to re-run: uses IF NOT EXISTS / DROP IF EXISTS.
-- =============================================================


-- -------------------------------------------------------------
-- Season columns
-- -------------------------------------------------------------

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS season text
    CHECK (season IS NULL OR season IN ('Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'));

ALTER TABLE premade_packages
  ADD COLUMN IF NOT EXISTS season text
    CHECK (season IS NULL OR season IN ('Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'));

ALTER TABLE daily_packages
  ADD COLUMN IF NOT EXISTS season text
    CHECK (season IS NULL OR season IN ('Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'));


-- -------------------------------------------------------------
-- Tier hotel link
-- -------------------------------------------------------------

ALTER TABLE package_tiers
  ADD COLUMN IF NOT EXISTS hotel_id uuid REFERENCES hotels (id) ON DELETE SET NULL;

ALTER TABLE premade_package_tiers
  ADD COLUMN IF NOT EXISTS hotel_id uuid REFERENCES hotels (id) ON DELETE SET NULL;


-- -------------------------------------------------------------
-- Inclusion icons (lucide-react icon name, e.g. 'plane', 'hotel')
-- -------------------------------------------------------------

ALTER TABLE package_inclusions
  ADD COLUMN IF NOT EXISTS icon text;

ALTER TABLE premade_package_inclusions
  ADD COLUMN IF NOT EXISTS icon text;

ALTER TABLE daily_package_included
  ADD COLUMN IF NOT EXISTS icon text;


-- -------------------------------------------------------------
-- daily_package_not_included (mirrors daily_package_included)
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS daily_package_not_included (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES daily_packages (id) ON DELETE CASCADE,
  text        text        NOT NULL,
  text_translations jsonb,
  icon        text,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daily_package_not_included
  ADD COLUMN IF NOT EXISTS text_translations jsonb;

ALTER TABLE daily_package_not_included ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_daily_package_not_included" ON daily_package_not_included;
DROP POLICY IF EXISTS "auth_write_daily_package_not_included"  ON daily_package_not_included;

CREATE POLICY "public_read_daily_package_not_included" ON daily_package_not_included FOR SELECT TO anon          USING (true);
CREATE POLICY "auth_write_daily_package_not_included"  ON daily_package_not_included FOR ALL    TO authenticated USING (true) WITH CHECK (true);


-- -------------------------------------------------------------
-- 4-bucket pricing on premade + daily packages
-- -------------------------------------------------------------

ALTER TABLE premade_packages
  ADD COLUMN IF NOT EXISTS price_1_person  numeric,
  ADD COLUMN IF NOT EXISTS price_2_people  numeric,
  ADD COLUMN IF NOT EXISTS price_3_people  numeric,
  ADD COLUMN IF NOT EXISTS price_baby      numeric;

ALTER TABLE daily_packages
  ADD COLUMN IF NOT EXISTS price_1_person  numeric,
  ADD COLUMN IF NOT EXISTS price_2_people  numeric,
  ADD COLUMN IF NOT EXISTS price_3_people  numeric,
  ADD COLUMN IF NOT EXISTS price_baby      numeric;


-- -------------------------------------------------------------
-- save_package — extended to persist season, tier.hotel_id, inclusion.icon
-- -------------------------------------------------------------

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

  IF p_data->>'id' IS NOT NULL THEN
    v_id := (p_data->>'id')::uuid;

    SELECT slug INTO v_old_slug FROM packages WHERE id = v_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Package not found: %', v_id;
    END IF;

    IF v_new_slug <> v_old_slug THEN
      SELECT id INTO v_existing_id FROM packages WHERE slug = v_new_slug AND id <> v_id;
      IF FOUND THEN
        RAISE EXCEPTION 'SLUG_CONFLICT: Another tour already uses this name. Pick a different name.';
      END IF;

      DELETE FROM package_slug_history
        WHERE package_id = v_id AND old_slug = v_new_slug;

      INSERT INTO package_slug_history (package_id, old_slug)
        VALUES (v_id, v_old_slug)
        ON CONFLICT (old_slug) DO NOTHING;
    END IF;

    UPDATE packages SET
      slug              = v_new_slug,
      name              = p_data->>'name',
      region            = p_data->>'region',
      season            = NULLIF(p_data->>'season', ''),
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
    SELECT id INTO v_existing_id FROM packages WHERE slug = v_new_slug;
    IF FOUND THEN
      RAISE EXCEPTION 'SLUG_CONFLICT: Another tour already uses this name. Pick a different name.';
    END IF;

    INSERT INTO packages (
      slug, name, region, season, duration, duration_days,
      short_description, overview, hero_image, card_image,
      min_people, max_people, available_from, available_to,
      is_published, is_featured, sort_order
    ) VALUES (
      v_new_slug,
      p_data->>'name',
      p_data->>'region',
      NULLIF(p_data->>'season', ''),
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

  -- Itinerary
  DELETE FROM package_itinerary_days WHERE package_id = v_id;
  v_i := 0;
  FOR v_day IN SELECT * FROM jsonb_array_elements(p_data->'itinerary') LOOP
    INSERT INTO package_itinerary_days (package_id, day_number, title, description, sort_order)
    VALUES (v_id, v_i + 1, v_day->>'title', v_day->>'description', v_i);
    v_i := v_i + 1;
  END LOOP;

  -- Tiers (incl. hotel_id)
  FOR v_tier IN SELECT * FROM jsonb_array_elements(p_data->'tiers') LOOP
    INSERT INTO package_tiers (
      package_id, tier_name, vehicle_class, accommodation, hotel_id,
      group_size, guide_languages, meals_included, highlights
    ) VALUES (
      v_id,
      v_tier->>'tier_name',
      v_tier->>'vehicle_class',
      v_tier->>'accommodation',
      NULLIF(v_tier->>'hotel_id', '')::uuid,
      v_tier->>'group_size',
      ARRAY(SELECT jsonb_array_elements_text(v_tier->'guide_languages')),
      v_tier->>'meals_included',
      ARRAY(SELECT jsonb_array_elements_text(v_tier->'highlights'))
    )
    ON CONFLICT (package_id, tier_name) DO UPDATE SET
      vehicle_class   = EXCLUDED.vehicle_class,
      accommodation   = EXCLUDED.accommodation,
      hotel_id        = EXCLUDED.hotel_id,
      group_size      = EXCLUDED.group_size,
      guide_languages = EXCLUDED.guide_languages,
      meals_included  = EXCLUDED.meals_included,
      highlights      = EXCLUDED.highlights;
  END LOOP;

  -- Gallery
  DELETE FROM package_gallery WHERE package_id = v_id;
  v_i := 0;
  FOR v_img IN SELECT * FROM jsonb_array_elements(p_data->'gallery') LOOP
    INSERT INTO package_gallery (package_id, image_path, sort_order)
    VALUES (v_id, v_img->>'path', v_i);
    v_i := v_i + 1;
  END LOOP;

  -- Inclusions (incl. icon)
  DELETE FROM package_inclusions WHERE package_id = v_id;
  v_i := 0;
  FOR v_inc IN SELECT * FROM jsonb_array_elements(p_data->'included') LOOP
    INSERT INTO package_inclusions (package_id, kind, text, icon, sort_order)
    VALUES (v_id, 'included', v_inc->>'text', NULLIF(v_inc->>'icon', ''), v_i);
    v_i := v_i + 1;
  END LOOP;
  v_i := 0;
  FOR v_inc IN SELECT * FROM jsonb_array_elements(p_data->'not_included') LOOP
    INSERT INTO package_inclusions (package_id, kind, text, icon, sort_order)
    VALUES (v_id, 'not_included', v_inc->>'text', NULLIF(v_inc->>'icon', ''), v_i);
    v_i := v_i + 1;
  END LOOP;

  RETURN v_new_slug;
END;
$$;

GRANT EXECUTE ON FUNCTION save_package(jsonb) TO authenticated;
