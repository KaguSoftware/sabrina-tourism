import { z } from "zod";

const stepSchema = z.object({
  num: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
  icon: z.enum(["compass", "suitcase", "whatsapp"]),
});

export const homeContentSchema = z.object({
  hero: z.object({
    kicker: z.string().min(1, "Kicker is required"),
    headline_top: z.string().min(1, "Headline top is required"),
    headline_em: z.string().min(1, "Headline em is required"),
    sub: z.string().min(1, "Sub is required"),
    hero_image: z.string().nullable().optional(),
  }),
  about: z.object({
    heading: z.string().min(1, "Heading is required"),
    body: z.string().min(1, "Body is required"),
  }),
  how_it_works: z.object({
    section_heading: z.string().min(1, "Section heading is required"),
    steps: z.array(stepSchema).length(3),
  }),
  featured: z.object({
    section_heading: z.string().min(1, "Section heading is required"),
    featured_slugs: z.array(z.string()),
  }),
  quote: z.object({
    quote: z.string().min(1, "Quote is required"),
    attribution: z.string().min(1, "Attribution is required"),
  }),
});

export type HomeContentFormValues = z.infer<typeof homeContentSchema>;
