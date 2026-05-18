export interface PackageMessageContext {
  name: string;
  tier: string;
  date: string;
  count: string | number;
  childrenAges?: string[];
  singleRoom?: boolean;
}

export interface TransferMessageContext {
  airport: string;
  direction: "pickup" | "dropoff" | "both";
  destination: string;
  date: string;
  time: string;
  passengers: string | number;
  vehicleClass: string;
  flightNumber?: string;
  luggage?: string | number;
  childSeat?: boolean;
  meetAndGreet?: boolean;
  guideNeeded?: boolean;
  guideType?: "assistant" | "certified guide";
  guideLanguage?: string;
  notes?: string;
  // return leg (both-ways only)
  returnDate?: string;
  returnTime?: string;
  returnFlightNumber?: string;
}

export interface ChauffeurMessageContext {
  pickup: string;
  destinations: string;
  startDate: string;
  endDate?: string;
  pickupTime?: string;
  passengers: string | number;
  luggage?: string | number;
  vehicleClass: string;
  guideNeeded?: boolean;
  guideType?: "assistant" | "certified guide";
  guideLanguage?: string;
  notes?: string;
}
