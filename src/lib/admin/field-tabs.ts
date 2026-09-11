/**
 * Maps each form field to the editor tab that holds it, so a blocked save can
 * open the right tab and scroll to the offending input.
 *
 * Keys are root field names (the part before the first dot), which is enough:
 * every element of `tiers[]` lives on the Tiers tab, and so on. Anything not
 * listed falls back to the editor's first tab.
 *
 * These maps have to match where each field is actually rendered. A wrong entry
 * is worse than a missing one: the readiness panel labels the issue with the
 * wrong tab, and clicking it opens a tab that has no such field — leaving the
 * admin with a blocking error and nowhere to fix it. When a field moves between
 * tabs, move it here too.
 *
 * Fields driven by `setValue` rather than `register` (image uploaders, date
 * pickers, tag lists) have no `name` in the DOM, so their container also needs
 * `data-field="<path>"` for the scroll-to-field jump to land.
 */

export const PREMADE_FIELD_TAB = {
  name: "Basics",
  dates: "Basics",
  destinations: "Basics",
  short_description: "Basics",
  currency: "Basics",
  is_published: "Basics",
  region: "Overview",
  season: "Overview",
  duration: "Overview",
  min_people: "Overview",
  max_people: "Overview",
  available_from: "Overview",
  available_to: "Overview",
  overview: "Overview",
  price_1_person: "Overview",
  price_baby: "Overview",
  itinerary: "Itinerary",
  tiers: "Tiers",
  included: "Inclusions",
  not_included: "Inclusions",
  hero_image: "Imagery",
  card_image: "Imagery",
  gallery: "Imagery",
  accommodation_name: "Accommodation",
  accommodation_description: "Accommodation",
  accommodation_image_a: "Accommodation",
  accommodation_image_b: "Accommodation",
  vehicle_model: "Vehicle",
  vehicle_features: "Vehicle",
} as const;

export const DAILY_FIELD_TAB = {
  name: "Basics",
  tour_date: "Basics",
  start_time: "Basics",
  end_time: "Basics",
  region: "Basics",
  season: "Basics",
  vehicle: "Basics",
  driver: "Basics",
  short_description: "Basics",
  price: "Basics",
  currency: "Basics",
  is_published: "Basics",
  price_1_person: "Pricing",
  price_2_people: "Pricing",
  price_baby: "Pricing",
  price_single_room_supplement: "Pricing",
  price_per_child: "Pricing",
  hero_image: "Imagery",
  card_image: "Imagery",
  gallery: "Imagery",
  stops: "Itinerary",
  included: "Inclusions",
  not_included: "Inclusions",
} as const;

export const HOTEL_FIELD_TAB = {
  name: "Basics",
  region: "Basics",
  description: "Basics",
  long_description: "Basics",
  tag_a: "Basics",
  tag_b: "Basics",
  svg_variant: "Basics",
  location: "Basics",
  check_in_time: "Basics",
  check_out_time: "Basics",
  languages: "Basics",
  is_published: "Basics",
  stars: "Properties",
  distance_km: "Properties",
  bedrooms: "Properties",
  bathrooms: "Properties",
  free_wifi: "Properties",
  free_cancellation: "Properties",
  free_parking: "Properties",
  bed_breakfast: "Properties",
  balcony: "Properties",
  washer: "Properties",
  ac: "Properties",
  tv: "Properties",
  amenities: "Amenities",
  room_types: "Room Types",
  images: "Gallery",
} as const;
