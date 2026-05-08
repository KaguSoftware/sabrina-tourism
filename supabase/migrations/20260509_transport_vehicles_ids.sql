-- Allow the new vehicle ids ('car', 'minibus') alongside the legacy ones.
-- The old CHECK constraint only allowed sedan/suv/van/luxury, which made
-- inserting 'car' or 'minibus' fail with a check_violation.

ALTER TABLE transport_vehicles
  DROP CONSTRAINT IF EXISTS transport_vehicles_vehicle_id_check;

ALTER TABLE transport_vehicles
  ADD CONSTRAINT transport_vehicles_vehicle_id_check
    CHECK (vehicle_id IN ('car', 'luxury', 'minibus', 'sedan', 'suv', 'van'));
