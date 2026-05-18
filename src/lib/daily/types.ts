export interface DailyStop {
  time: string;
  place: string;
  description: string;
}

export interface DailyInclusionItem {
  text: string;
  icon: string | null;
}

export interface DailyPricing {
  onePerson: number | null;
  twoPeople: number | null;
  baby: number | null;
  singleRoomSupplement?: number | null;
  pricePerChild?: number | null;
}

export interface DailyPackage {
  id: string;
  slug?: string;
  name: string;
  date: string; // ISO date string e.g. "2026-06-14"
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "22:00"
  heroImage: string;
  cardImage: string;
  groupImages: string[]; // landmark/destination images
  vehicle: string;
  driver: string;
  price: number;
  currency: string;
  shortDescription: string;
  stops: DailyStop[];
  included: DailyInclusionItem[];
  notIncluded: DailyInclusionItem[];
  region: string;
  season: string | null;
  pricing: DailyPricing | null;
}
