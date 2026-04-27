export interface Airport {
  code: string;
  label: string;
}

export interface Vehicle {
  id: string;
  label: string;
  capacity: string;
  note: string;
  from: string;
}

export type TransferDirection = "pickup" | "dropoff";
