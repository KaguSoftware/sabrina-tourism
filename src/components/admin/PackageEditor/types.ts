import type { PackageFormValues } from "@/app/admin/(authed)/packages/[slug]/actions";

export type { PackageFormValues };

export const TABS = ["Basics", "Overview", "Itinerary", "Tiers", "Gallery", "Inclusions"] as const;
export type Tab = (typeof TABS)[number];

export const REGIONS = [
  "Istanbul",
  "Cappadocia",
  "Aegean",
  "Mediterranean",
  "Black Sea",
  "Eastern Anatolia",
] as const;

export const TIER_NAMES = ["Essential", "Signature", "Private"] as const;
