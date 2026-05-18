import { z } from "zod";

export const hotelsPageSchema = z.object({
  kicker: z.string().optional(),
  page_heading: z.string().min(1, "Heading is required"),
  page_lede: z.string().optional(),
  property_singular: z.string().optional(),
  property_plural: z.string().optional(),
});

export type HotelsPageFormValues = z.infer<typeof hotelsPageSchema>;
