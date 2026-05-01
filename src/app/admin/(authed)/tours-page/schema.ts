import { z } from "zod";

export const toursPageSchema = z.object({
  kicker: z.string().min(1, "Kicker is required"),
  page_heading: z.string().min(1, "Heading is required"),
  page_lede: z.string().min(1, "Lede is required"),
  hero_image: z.string().nullable().optional(),
});

export type ToursPageFormValues = z.infer<typeof toursPageSchema>;
