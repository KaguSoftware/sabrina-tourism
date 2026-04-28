export type Region =
  | "Istanbul"
  | "Cappadocia"
  | "Aegean"
  | "Mediterranean"
  | "Black Sea"
  | "Eastern Anatolia";

export interface RegionHeroSVGProps {
  region: Region;
  className?: string;
}
