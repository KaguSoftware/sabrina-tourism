-- Add translation columns for tier display fields
ALTER TABLE premade_package_tiers
  ADD COLUMN IF NOT EXISTS tier_name_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS vehicle_class_translations   jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS group_size_translations      jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS meals_included_translations  jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS guide_languages_translations jsonb NOT NULL DEFAULT '{}';
