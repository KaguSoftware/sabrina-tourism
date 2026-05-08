UPDATE transport_vehicles
SET label = CASE vehicle_id
  WHEN 'car' THEN 'Van'
  WHEN 'minibus' THEN 'Bus'
  WHEN 'luxury' THEN 'Minibus'
  ELSE label
END
WHERE vehicle_id IN ('car', 'minibus', 'luxury');
