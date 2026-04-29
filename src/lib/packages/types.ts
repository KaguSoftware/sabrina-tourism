export type Region =
  | "Istanbul"
  | "Cappadocia"
  | "Aegean"
  | "Mediterranean"
  | "Black Sea"
  | "Eastern Anatolia";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Tier {
  name: "Essential" | "Signature" | "Private";
  vehicleClass: string;
  accommodation: string;
  groupSize: string;
  guideLanguages: string[];
  mealsIncluded: string;
  highlights: string[];
}

export interface Package {
  slug: string;
  name: string;
  region: Region;
  duration: string;
  durationDays: number;
  shortDescription: string;
  overview: string[];
  heroImage: string;
  cardImage?: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  tiers: [Tier, Tier, Tier];
  included: string[];
  notIncluded: string[];
  minPeople: number;
  maxPeople: number;
  availableFrom: string;
  availableTo: string;
}
