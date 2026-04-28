export type VehicleId = "sedan" | "suv" | "van" | "luxury";

export interface FleetIllustrationProps {
  vehicleId: VehicleId;
  className?: string;
}
