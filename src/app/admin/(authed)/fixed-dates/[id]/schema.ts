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
  price_2_people: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_single_room_supplement: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_per_child: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
});

const ItineraryDaySchema = z.object({
  day_number: z.number("Day number is required").int().min(1, "Day number must be at least 1"),
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
  // When true the guest picks their own departure date on the public page, so
  // fixed departures are neither required nor saved.
  flexible_departure: z.boolean(),
  // Departures live in `dates`. The legacy top-level start_date/end_date columns
  // are derived from this array server-side and are no longer part of the form.
  // Row completeness is checked in superRefine below, since it only applies to
  // fixed-departure tours.
  dates: z.array(
    z.object({
      start_date: z.string(),
      end_date: z.string(),
    }),
  ),
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
  min_people: z.number("Min people must be a number").int().min(1, "Min people must be at least 1").nullable(),
  max_people: z.number("Max people must be a number").int().min(1, "Max people must be at least 1").nullable(),
  available_from: z.string(),
  available_to: z.string(),
  overview: z.string(),
  tiers: z.array(TierSchema),
  itinerary: z.array(ItineraryDaySchema),
  included: z.array(InclusionItemSchema),
  not_included: z.array(InclusionItemSchema),
  currency: z.string(),
  // Package-level pricing buckets retained for legacy/out-of-scope fields.
  // The double-room, single-room supplement, per-child and starts-from
  // prices have moved to TierSchema.
  price_1_person: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_baby: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.flexible_departure) return;
  if (data.dates.length === 0) {
    ctx.addIssue({ code: "custom", path: ["dates"], message: "Add at least one departure date" });
    return;
  }
  data.dates.forEach((d, i) => {
    if (!d.start_date) ctx.addIssue({ code: "custom", path: ["dates", i, "start_date"], message: "Start date required" });
    if (!d.end_date) ctx.addIssue({ code: "custom", path: ["dates", i, "end_date"], message: "End date required" });
  });
});

export type PremadeFormValues = z.infer<typeof PremadeSchema>;
