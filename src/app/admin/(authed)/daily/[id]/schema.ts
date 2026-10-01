import { z } from "zod";
import { normalizeTime } from "@/lib/daily/time-range";

const InclusionItemSchema = z.object({
  text: z.string(),
  icon: z.string().nullable().optional(),
});

export const DAILY_SEASON_OPTIONS = ["Spring", "Summer", "Autumn", "Winter", "Year-round"] as const;
const SeasonSchema = z.enum(DAILY_SEASON_OPTIONS).nullable().optional();

export const DailySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  // Required for shared tours only — private day tours let the guest pick the date.
  tour_date: z.string(),
  is_private: z.boolean(),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  region: z.string().min(1, "Region is required"),
  season: SeasonSchema,
  vehicle: z.string(),
  driver: z.string(),
  price: z.number("Price is required").min(0, "Price must be 0 or more"),
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
  gallery: z.array(z.object({ url: z.string(), label: z.string() })),
  is_published: z.boolean(),
  // Pricing buckets
  price_1_person: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_2_people: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_baby: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_single_room_supplement: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
  price_per_child: z.number("Must be a number").min(0, "Must be 0 or more").nullable().optional(),
}).superRefine((data, ctx) => {
  if (!data.is_private && !data.tour_date) {
    ctx.addIssue({ code: "custom", path: ["tour_date"], message: "Date is required" });
  }
  const start = normalizeTime(data.start_time);
  const end = normalizeTime(data.end_time);
  if (start && end && start === end) {
    ctx.addIssue({ code: "custom", path: ["end_time"], message: "End time must be different from the start time" });
  }
});

export type DailyFormValues = z.infer<typeof DailySchema>;
