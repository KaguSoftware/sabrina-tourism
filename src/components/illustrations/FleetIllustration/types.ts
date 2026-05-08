export type VehicleId = "sedan" | "suv" | "van" | "minibus" | "luxury";

export interface FleetIllustrationProps {
  vehicleId: VehicleId | string;
  className?: string;
}
