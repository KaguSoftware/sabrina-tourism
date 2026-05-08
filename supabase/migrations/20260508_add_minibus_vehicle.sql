-- Widen the vehicle_id check constraint to include 'minibus'
ALTER TABLE transport_vehicles
  DROP CONSTRAINT IF EXISTS transport_vehicles_vehicle_id_check;

ALTER TABLE transport_vehicles
  ADD CONSTRAINT transport_vehicles_vehicle_id_check
  CHECK (vehicle_id IN ('sedan', 'suv', 'van', 'luxury', 'minibus'));

-- Insert the minibus entry (no-op if already present)
INSERT INTO transport_vehicles (vehicle_id, label, capacity, note, from_price, sort_order)
VALUES ('minibus', 'Bus', '1–16 guests', 'Mercedes Sprinter', 'from €280', 5)
ON CONFLICT (vehicle_id) DO NOTHING;
