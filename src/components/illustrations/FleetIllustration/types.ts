export type VehicleId = "sedan" | "suv" | "van" | "luxury" | "minibus";

export interface FleetIllustrationProps {
  vehicleId: VehicleId;
  className?: string;
}
