import { z } from "zod";

const stepSchema = z.object({
  num: z.string(),
  heading: z.string(),
  body: z.string(),
  icon: z.enum(["compass", "suitcase", "whatsapp"]),
});

export const homeContentSchema = z.object({
  hero: z.object({
    kicker: z.string(),
    headline_top: z.string(),
    headline_em: z.string(),
    sub: z.string(),
    hero_image: z.string().nullable().optional(),
    cta_browse: z.string().optional(),
    cta_chauffeur: z.string().optional(),
  }),
  about: z.object({
    heading: z.string(),
    body: z.string(),
    kicker: z.string().optional(),
  }),
  how_it_works: z.object({
    section_heading: z.string(),
    steps: z.array(stepSchema),
  }),
  featured: z.object({
    section_heading: z.string(),
    featured_slugs: z.array(z.string()),
    kicker: z.string().optional(),
    cta_label: z.string().optional(),
  }),
  featured_hotels: z.object({
    section_heading: z.string(),
    kicker: z.string().optional(),
    cta_label: z.string().optional(),
  }),
  group_packages: z.object({
    kicker: z.string().optional(),
    cta_label: z.string().optional(),
  }),
  quote: z.object({
    quote: z.string(),
    attribution: z.string(),
  }),
});

export type HomeContentFormValues = z.infer<typeof homeContentSchema>;
