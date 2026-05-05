export interface DailyStop {
  time: string;
  place: string;
  description: string;
}

export interface DailyPackage {
  id: string;
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
  included: string[];
  region: string;
}
