-- Vehicle ids are admin-managed slugs. The app maps known ids to custom icons
-- and falls back gracefully for unknown ids, so the database should not block
-- new fleet rows.

ALTER TABLE transport_vehicles
  DROP CONSTRAINT IF EXISTS transport_vehicles_vehicle_id_check;
