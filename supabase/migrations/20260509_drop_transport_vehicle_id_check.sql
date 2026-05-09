-- Let admins add new vehicle ids without changing the database schema.
ALTER TABLE transport_vehicles
  DROP CONSTRAINT IF EXISTS transport_vehicles_vehicle_id_check;
