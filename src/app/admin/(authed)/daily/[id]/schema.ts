import { z } from "zod";

export const DailySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  tour_date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  region: z.string().min(1, "Region is required"),
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
  included: z.array(z.object({ text: z.string() })),
  gallery: z.array(z.object({ url: z.string() })),
  is_published: z.boolean(),
});

export type DailyFormValues = z.infer<typeof DailySchema>;
