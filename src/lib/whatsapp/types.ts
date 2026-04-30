export interface PackageMessageContext {
  name: string;
  tier: string;
  date: string;
  count: string | number;
}

export interface TransferMessageContext {
  airport: string;
  direction: "pickup" | "dropoff";
  destination: string;
  date: string;
  time: string;
  passengers: string | number;
  vehicleClass: string;
  notes?: string;
}

export interface ChauffeurMessageContext {
  pickup: string;
  destinations: string;
  startDate: string;
  endDate?: string;
  passengers: string | number;
  vehicleClass: string;
  notes?: string;
}
