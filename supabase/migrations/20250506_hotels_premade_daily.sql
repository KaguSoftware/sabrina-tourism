-- =============================================================
-- Sabrina Tourism — Phase 1/2/3 Migration
-- Hotels, Fixed-Date (Premade) Packages, Daily Packages
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- Apply in Supabase SQL editor.
-- =============================================================


-- -------------------------------------------------------------
-- HOTELS
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS hotels (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        UNIQUE NOT NULL,
  name             text        NOT NULL,
  region           text        NOT NULL CHECK (region IN (
                                 'Istanbul','Cappadocia','Aegean',
                                 'Mediterranean','Black Sea','Eastern Anatolia'
                               )),
  description      text        NOT NULL,
  long_description text        NOT NULL,
  tag_a            text        NOT NULL,
  tag_b            text        NOT NULL,
  stars            int         NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 5),
  svg_variant      text        NOT NULL DEFAULT 'ottoman',
  location         text        NOT NULL,
  bedroom_image    text        NOT NULL DEFAULT '',
  check_in_time    text        NOT NULL DEFAULT '15:00',
  check_out_time   text        NOT NULL DEFAULT '12:00',
  languages        text[]      NOT NULL DEFAULT '{}',
  distance_km      numeric     NOT NULL DEFAULT 0,
  bedrooms         int         NOT NULL DEFAULT 1,
  bathrooms        int         NOT NULL DEFAULT 1,
  free_wifi        boolean     NOT NULL DEFAULT false,
  free_cancellation boolean    NOT NULL DEFAULT false,
  free_parking     boolean     NOT NULL DEFAULT false,
  bed_breakfast    boolean     NOT NULL DEFAULT false,
  balcony          boolean     NOT NULL DEFAULT false,
  washer           boolean     NOT NULL DEFAULT false,
  ac               boolean     NOT NULL DEFAULT false,
  tv               boolean     NOT NULL DEFAULT false,
  is_published     boolean     NOT NULL DEFAULT false,
  sort_order       int         NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_hotels ON hotels;
CREATE TRIGGER set_updated_at_hotels
  BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


CREATE TABLE IF NOT EXISTS hotel_amenities (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id    uuid        NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  text        text        NOT NULL,
  is_property boolean     NOT NULL DEFAULT false,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS hotel_room_types (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id    uuid        NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  name        text        NOT NULL,
  capacity    int         NOT NULL DEFAULT 2,
  beds        text        NOT NULL DEFAULT '',
  size        text        NOT NULL DEFAULT '',
  image_index int         NOT NULL DEFAULT 0,
  highlights  text[]      NOT NULL DEFAULT '{}',
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_hotel_room_types ON hotel_room_types;
CREATE TRIGGER set_updated_at_hotel_room_types
  BEFORE UPDATE ON hotel_room_types
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


CREATE TABLE IF NOT EXISTS hotel_images (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id    uuid        NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  url         text        NOT NULL,
  label       text        NOT NULL DEFAULT '',
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- FIXED-DATE (PREMADE) PACKAGES
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS premade_packages (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     text        UNIQUE NOT NULL,
  name                     text        NOT NULL,
  start_date               date        NOT NULL,
  end_date                 date        NOT NULL,
  destinations             text[]      NOT NULL DEFAULT '{}',
  hero_image               text        NOT NULL DEFAULT '',
  card_image               text        NOT NULL DEFAULT '',
  short_description        text        NOT NULL,
  accommodation_name       text        NOT NULL DEFAULT '',
  accommodation_description text       NOT NULL DEFAULT '',
  accommodation_image_a    text        NOT NULL DEFAULT '',
  accommodation_image_b    text        NOT NULL DEFAULT '',
  vehicle_model            text        NOT NULL DEFAULT '',
  vehicle_features         text[]      NOT NULL DEFAULT '{}',
  is_published             boolean     NOT NULL DEFAULT false,
  sort_order               int         NOT NULL DEFAULT 0,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_premade_packages ON premade_packages;
CREATE TRIGGER set_updated_at_premade_packages
  BEFORE UPDATE ON premade_packages
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


CREATE TABLE IF NOT EXISTS premade_package_gallery (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES premade_packages (id) ON DELETE CASCADE,
  url         text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- DAILY PACKAGES
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS daily_packages (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text        UNIQUE NOT NULL,
  name              text        NOT NULL,
  tour_date         date        NOT NULL,
  start_time        text        NOT NULL DEFAULT '08:00',
  end_time          text        NOT NULL DEFAULT '20:00',
  hero_image        text        NOT NULL DEFAULT '',
  card_image        text        NOT NULL DEFAULT '',
  vehicle           text        NOT NULL DEFAULT '',
  driver            text        NOT NULL DEFAULT '',
  price             numeric     NOT NULL DEFAULT 0,
  currency          text        NOT NULL DEFAULT 'USD',
  short_description text        NOT NULL,
  region            text        NOT NULL CHECK (region IN (
                                  'Istanbul','Cappadocia','Aegean',
                                  'Mediterranean','Black Sea','Eastern Anatolia'
                                )),
  is_published      boolean     NOT NULL DEFAULT false,
  sort_order        int         NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_daily_packages ON daily_packages;
CREATE TRIGGER set_updated_at_daily_packages
  BEFORE UPDATE ON daily_packages
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


CREATE TABLE IF NOT EXISTS daily_package_stops (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES daily_packages (id) ON DELETE CASCADE,
  stop_time   text        NOT NULL DEFAULT '',
  place       text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS daily_package_included (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES daily_packages (id) ON DELETE CASCADE,
  text        text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);


CREATE TABLE IF NOT EXISTS daily_package_gallery (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES daily_packages (id) ON DELETE CASCADE,
  url         text        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- -------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -------------------------------------------------------------

ALTER TABLE hotels                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_amenities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_room_types        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_images            ENABLE ROW LEVEL SECURITY;
ALTER TABLE premade_packages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE premade_package_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_packages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_package_stops     ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_package_included  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_package_gallery   ENABLE ROW LEVEL SECURITY;

-- Public reads
DROP POLICY IF EXISTS "public_read_hotels"                  ON hotels;
DROP POLICY IF EXISTS "public_read_hotel_amenities"         ON hotel_amenities;
DROP POLICY IF EXISTS "public_read_hotel_room_types"        ON hotel_room_types;
DROP POLICY IF EXISTS "public_read_hotel_images"            ON hotel_images;
DROP POLICY IF EXISTS "public_read_premade_packages"        ON premade_packages;
DROP POLICY IF EXISTS "public_read_premade_package_gallery" ON premade_package_gallery;
DROP POLICY IF EXISTS "public_read_daily_packages"          ON daily_packages;
DROP POLICY IF EXISTS "public_read_daily_package_stops"     ON daily_package_stops;
DROP POLICY IF EXISTS "public_read_daily_package_included"  ON daily_package_included;
DROP POLICY IF EXISTS "public_read_daily_package_gallery"   ON daily_package_gallery;

CREATE POLICY "public_read_hotels"                  ON hotels                  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_hotel_amenities"         ON hotel_amenities         FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_hotel_room_types"        ON hotel_room_types        FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_hotel_images"            ON hotel_images            FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_premade_packages"        ON premade_packages        FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_premade_package_gallery" ON premade_package_gallery FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_daily_packages"          ON daily_packages          FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_daily_package_stops"     ON daily_package_stops     FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_daily_package_included"  ON daily_package_included  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_daily_package_gallery"   ON daily_package_gallery   FOR SELECT TO anon USING (true);

-- Authenticated writes
DROP POLICY IF EXISTS "auth_write_hotels"                  ON hotels;
DROP POLICY IF EXISTS "auth_write_hotel_amenities"         ON hotel_amenities;
DROP POLICY IF EXISTS "auth_write_hotel_room_types"        ON hotel_room_types;
DROP POLICY IF EXISTS "auth_write_hotel_images"            ON hotel_images;
DROP POLICY IF EXISTS "auth_write_premade_packages"        ON premade_packages;
DROP POLICY IF EXISTS "auth_write_premade_package_gallery" ON premade_package_gallery;
DROP POLICY IF EXISTS "auth_write_daily_packages"          ON daily_packages;
DROP POLICY IF EXISTS "auth_write_daily_package_stops"     ON daily_package_stops;
DROP POLICY IF EXISTS "auth_write_daily_package_included"  ON daily_package_included;
DROP POLICY IF EXISTS "auth_write_daily_package_gallery"   ON daily_package_gallery;

CREATE POLICY "auth_write_hotels"                  ON hotels                  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_hotel_amenities"         ON hotel_amenities         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_hotel_room_types"        ON hotel_room_types        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_hotel_images"            ON hotel_images            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_premade_packages"        ON premade_packages        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_premade_package_gallery" ON premade_package_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_daily_packages"          ON daily_packages          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_daily_package_stops"     ON daily_package_stops     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_daily_package_included"  ON daily_package_included  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_write_daily_package_gallery"   ON daily_package_gallery   FOR ALL TO authenticated USING (true) WITH CHECK (true);
