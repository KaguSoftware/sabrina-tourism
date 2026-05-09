-- Vehicle ids are admin-managed slugs. Keep them unconstrained so new fleet
-- rows can be added without another migration.
ALTER TABLE transport_vehicles
  DROP CONSTRAINT IF EXISTS transport_vehicles_vehicle_id_check;

-- Insert the minibus entry (no-op if already present)
INSERT INTO transport_vehicles (vehicle_id, label, capacity, note, from_price, sort_order)
VALUES ('minibus', 'Minibus', '1–16 guests', 'Mercedes Sprinter', 'from €280', 5)
ON CONFLICT (vehicle_id) DO NOTHING;
