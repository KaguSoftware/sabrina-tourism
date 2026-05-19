import { z } from "zod";

export const hotelsPageSchema = z.object({
  kicker: z.string().optional(),
  page_heading: z.string().min(1, "Heading is required"),
  page_lede: z.string().optional(),
  property_singular: z.string().optional(),
  property_plural: z.string().optional(),
  region_index_kicker: z.string().optional(),
  region_index_heading: z.string().optional(),
  region_index_lede: z.string().optional(),
  region_section_heading_template: z.string().optional(),
  region_section_cta_label: z.string().optional(),
  region_card_eyebrow_label: z.string().optional(),
  region_card_stay_label: z.string().optional(),
  hotel_card_cta_label: z.string().optional(),
});

export type HotelsPageFormValues = z.infer<typeof hotelsPageSchema>;
