export type VehicleId = "car" | "minibus" | "luxury" | "sedan" | "suv" | "van";

export interface FleetIllustrationProps {
  vehicleId: VehicleId | string;
  className?: string;
  selected?: boolean;
  variant?: "default" | "custom";
}
