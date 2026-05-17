import { z } from "zod";

const InclusionItemSchema = z.object({
  text: z.string(),
  icon: z.string().nullable().optional(),
});

export const DAILY_SEASON_OPTIONS = ["Spring", "Summer", "Autumn", "Winter", "Year-round"] as const;
const SeasonSchema = z.enum(DAILY_SEASON_OPTIONS).nullable().optional();

export const DailySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  tour_date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  region: z.string().min(1, "Region is required"),
  season: SeasonSchema,
  vehicle: z.string(),
  driver: z.string(),
  price: z.number().min(0, "Price must be 0 or more"),
  currency: z.string(),
  short_description: z.string().min(1, "Short description is required"),
  hero_image: z.string(),
  card_image: z.string(),
  stops: z.array(z.object({
    place: z.string(),
    description: z.string(),
  })),
  included: z.array(InclusionItemSchema),
  not_included: z.array(InclusionItemSchema),
  gallery: z.array(z.object({ url: z.string() })),
  is_published: z.boolean(),
  // Pricing buckets
  price_1_person: z.number().min(0).nullable().optional(),
  price_2_people: z.number().min(0).nullable().optional(),
  price_baby: z.number().min(0).nullable().optional(),
  price_single_room_supplement: z.number().min(0).nullable().optional(),
  price_per_child: z.number().min(0).nullable().optional(),
});

export type DailyFormValues = z.infer<typeof DailySchema>;
