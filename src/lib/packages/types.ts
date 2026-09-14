/**
 * The `Package` / `Tier` / `ItineraryDay` shapes that used to live here belonged
 * to the legacy `packages` tables, dropped in
 * `supabase/migrations/20260911_drop_legacy_packages.sql`. Fixed-date and daily
 * tours derive their types from their own zod schemas instead.
 */

export type Region =
  | "Istanbul"
  | "Cappadocia"
  | "Aegean"
  | "Mediterranean"
  | "Black Sea"
  | "Eastern Anatolia";
