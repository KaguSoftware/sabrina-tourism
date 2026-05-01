import { z } from "zod";

const TierSchema = z.object({
  tier_name: z.enum(["Essential", "Signature", "Private"]),
  vehicle_class: z.string().min(1, "Required"),
  accommodation: z.string().min(1, "Required"),
  group_size: z.string().min(1, "Required"),
  guide_languages: z.array(z.string()),
  meals_included: z.string().min(1, "Required"),
  highlights: z.array(z.string()),
});

export const PackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  region: z.enum([
    "Istanbul",
    "Cappadocia",
    "Aegean",
    "Mediterranean",
    "Black Sea",
    "Eastern Anatolia",
  ]),
  duration: z.string().min(1, "Duration label is required"),
  duration_days: z.number().int().min(1),
  short_description: z.string().min(1, "Short description is required").max(300),
  overview: z.string().min(1, "Overview is required"),
  hero_image: z.string().min(1, "Hero image is required"),
  card_image: z.string().nullable().optional(),
  min_people: z.number().int().min(1),
  max_people: z.number().int().min(1),
  available_from: z.string().min(1, "Available from is required"),
  available_to: z.string().min(1, "Available to is required"),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  itinerary: z.array(
    z.object({
      title: z.string().min(1, "Day title is required"),
      description: z.string().min(1, "Day description is required"),
    }),
  ),
  tiers: z.tuple([TierSchema, TierSchema, TierSchema]),
  gallery: z.array(z.object({ path: z.string() })),
  included: z.array(z.object({ text: z.string().min(1) })),
  not_included: z.array(z.object({ text: z.string().min(1) })),
});

export type PackageFormValues = z.infer<typeof PackageSchema>;
