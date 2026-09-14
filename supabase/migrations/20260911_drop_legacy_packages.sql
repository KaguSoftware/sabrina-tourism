-- Drops the legacy `packages` feature.
--
-- Superseded by `premade_packages` (the fixed-dates editor) and `daily_packages`.
-- The admin section for these tables was removed from the sidebar some time ago,
-- leaving the rows editable only by direct URL; this migration removes the
-- backing schema along with the last of the application code.
--
-- SCOPE: only the legacy `packages` tree. Explicitly NOT touched:
--   premade_packages + premade_package_*   (fixed-dates — actively used)
--   daily_packages   + daily_package_*     (daily tours — actively used)
--   hotels, hotel_*, site_content, transport_*, ui_translations
--   trigger_set_updated_at()               (shared by every table above)
--
-- Data removed: 9 packages, 38 itinerary days, 27 tiers, 28 gallery rows,
-- 48 inclusions, 0 slug-history rows. Backed up to
-- backups/legacy-packages-backup-20260911.json before this was applied.
--
-- Storage is NOT touched: images under the `packages/` prefix in the `media`
-- bucket are left in place. Delete them separately if you want them gone.

-- 1. Triggers. These would drop with their table, but naming them makes the
--    intent explicit and keeps this readable as a record of what existed.
DROP TRIGGER IF EXISTS enforce_featured_cap_trigger ON packages;
DROP TRIGGER IF EXISTS set_updated_at_packages              ON packages;
DROP TRIGGER IF EXISTS set_updated_at_package_itinerary_days ON package_itinerary_days;
DROP TRIGGER IF EXISTS set_updated_at_package_tiers         ON package_tiers;
DROP TRIGGER IF EXISTS set_updated_at_package_gallery       ON package_gallery;
DROP TRIGGER IF EXISTS set_updated_at_package_inclusions    ON package_inclusions;

-- 2. Functions used only by this feature.
--    `trigger_set_updated_at()` is deliberately left alone — it is shared.
DROP FUNCTION IF EXISTS save_package(jsonb);
DROP FUNCTION IF EXISTS enforce_featured_cap();

-- 3. Tables, children before parent.
--    No CASCADE on purpose: if something outside this feature still references
--    `packages`, this migration should fail loudly rather than silently drop it.
DROP TABLE IF EXISTS package_slug_history;
DROP TABLE IF EXISTS package_inclusions;
DROP TABLE IF EXISTS package_gallery;
DROP TABLE IF EXISTS package_tiers;
DROP TABLE IF EXISTS package_itinerary_days;
DROP TABLE IF EXISTS packages;
