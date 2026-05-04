export interface Airport {
  code: string;
  label: string;
}

import type { VehicleId } from "@/lib/supabase/types";

export interface Vehicle {
  id: VehicleId;
  label: string;
  capacity: string;
  note: string;
  from: string;
}

export type TransferDirection = "pickup" | "dropoff";
