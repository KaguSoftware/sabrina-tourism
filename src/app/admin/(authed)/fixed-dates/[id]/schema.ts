import { z } from "zod";

const TierSchema = z.object({
  tier_name: z.string().min(1, "Tier name required"),
  vehicle_class: z.string(),
  accommodation: z.string(),
  hotel_id: z.string().uuid().nullable().optional(),
  group_size: z.string(),
  guide_languages: z.array(z.string()),
  meals_included: z.string(),
  highlights: z.array(z.string()),
});

const ItineraryDaySchema = z.object({
  day_number: z.number().int().min(1),
  title: z.string().min(1, "Day title required"),
  description: z.string(),
});

const InclusionItemSchema = z.object({
  text: z.string(),
  icon: z.string().nullable().optional(),
});

export const SEASON_OPTIONS = ["Spring", "Summer", "Autumn", "Winter", "Year-round"] as const;
const SeasonSchema = z.enum(SEASON_OPTIONS).nullable().optional();

export const PremadeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  start_date: z.string(),
  end_date: z.string(),
  dates: z.array(z.object({ start_date: z.string().min(1, "Start date required"), end_date: z.string().min(1, "End date required") })),
  destinations: z.array(z.string()),
  short_description: z.string().min(1, "Short description is required"),
  hero_image: z.string(),
  card_image: z.string(),
  accommodation_name: z.string(),
  accommodation_description: z.string(),
  accommodation_image_a: z.string(),
  accommodation_image_b: z.string(),
  vehicle_model: z.string(),
  vehicle_features: z.array(z.string()),
  gallery: z.array(z.object({ url: z.string() })),
  is_published: z.boolean(),
  // Rich fields
  region: z.string(),
  season: SeasonSchema,
  duration: z.string(),
  min_people: z.number().int().min(1).nullable(),
  max_people: z.number().int().min(1).nullable(),
  available_from: z.string(),
  available_to: z.string(),
  overview: z.string(),
  tiers: z.array(TierSchema),
  itinerary: z.array(ItineraryDaySchema),
  included: z.array(InclusionItemSchema),
  not_included: z.array(InclusionItemSchema),
  price: z.number().min(0).nullable(),
  currency: z.string(),
  // Pricing buckets
  price_1_person: z.number().min(0).nullable().optional(),
  price_2_people: z.number().min(0).nullable().optional(),
  price_3_people: z.number().min(0).nullable().optional(),
  price_baby: z.number().min(0).nullable().optional(),
});

export type PremadeFormValues = z.infer<typeof PremadeSchema>;
