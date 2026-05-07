-- Add translations JSONB column to all content tables
-- Shape: { "tr": "...", "ar": "...", "es": "...", "it": "..." }
-- Each text field gets its own translations column named <field>_translations

-- daily_packages
ALTER TABLE daily_packages
  ADD COLUMN IF NOT EXISTS name_translations              jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS short_description_translations jsonb NOT NULL DEFAULT '{}';

-- daily_package_stops
ALTER TABLE daily_package_stops
  ADD COLUMN IF NOT EXISTS place_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_translations jsonb NOT NULL DEFAULT '{}';

-- daily_package_included
ALTER TABLE daily_package_included
  ADD COLUMN IF NOT EXISTS text_translations jsonb NOT NULL DEFAULT '{}';

-- premade_packages
ALTER TABLE premade_packages
  ADD COLUMN IF NOT EXISTS name_translations                     jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS short_description_translations        jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS overview_translations                 jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS accommodation_name_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS accommodation_description_translations jsonb NOT NULL DEFAULT '{}';

-- premade_package_itinerary_days
ALTER TABLE premade_package_itinerary_days
  ADD COLUMN IF NOT EXISTS title_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_translations jsonb NOT NULL DEFAULT '{}';

-- premade_package_tiers
ALTER TABLE premade_package_tiers
  ADD COLUMN IF NOT EXISTS highlights_translations jsonb NOT NULL DEFAULT '{}';

-- premade_package_inclusions
ALTER TABLE premade_package_inclusions
  ADD COLUMN IF NOT EXISTS text_translations jsonb NOT NULL DEFAULT '{}';

-- hotels
ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS name_translations             jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_translations      jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS long_description_translations jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tag_a_translations            jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tag_b_translations            jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS location_translations         jsonb NOT NULL DEFAULT '{}';

-- hotel_amenities
ALTER TABLE hotel_amenities
  ADD COLUMN IF NOT EXISTS text_translations jsonb NOT NULL DEFAULT '{}';

-- hotel_room_types
ALTER TABLE hotel_room_types
  ADD COLUMN IF NOT EXISTS name_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS beds_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS size_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS highlights_translations jsonb NOT NULL DEFAULT '{}';
