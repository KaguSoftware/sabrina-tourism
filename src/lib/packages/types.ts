export type Region =
  | "Istanbul"
  | "Cappadocia"
  | "Aegean"
  | "Mediterranean"
  | "Black Sea"
  | "Eastern Anatolia";

export type Season = "Spring" | "Summer" | "Autumn" | "Winter" | "Year-round";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface TierHotelSummary {
  id: string;
  slug: string;
  name: string;
  region: string;
  stars: number;
  description: string;
  bedroomImage: string;
}

export interface Tier {
  name: "Essential" | "Signature" | "Private";
  vehicleClass: string;
  accommodation: string;
  hotelId: string | null;
  hotel: TierHotelSummary | null;
  groupSize: string;
  guideLanguages: string[];
  mealsIncluded: string;
  highlights: string[];
}

export interface InclusionItem {
  text: string;
  icon: string | null;
}

export interface Package {
  slug: string;
  name: string;
  region: Region;
  season: Season | null;
  duration: string;
  durationDays: number;
  shortDescription: string;
  overview: string[];
  heroImage: string;
  cardImage?: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  tiers: [Tier, Tier, Tier];
  included: InclusionItem[];
  notIncluded: InclusionItem[];
  minPeople: number;
  maxPeople: number;
  availableFrom: string;
  availableTo: string;
}
