"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Server action
// ---------------------------------------------------------------------------

export async function savePackage(
  payload: PackageFormValues,
): Promise<{ error?: string; slug?: string }> {
  const parsed = PackageSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Validation failed" };
  }

  const data = parsed.data;

  // Compute slug from name
  const newSlug = slugify(data.name);
  if (!newSlug) return { error: "Name produces an empty slug. Use letters or numbers." };

  // If slug collision needs a suffix, generate one on new packages
  // (for updates the PL/pgSQL function handles uniqueness)
  let finalSlug = newSlug;
  if (!data.id) {
    finalSlug = await resolveUniqueSlug(newSlug);
  }

  const supabase = (await createServerClient()) as any;

  const rpcPayload = {
    ...data,
    slug: finalSlug,
    card_image: data.card_image ?? null,
  };

  const { data: returnedSlug, error } = await supabase.rpc("save_package", {
    p_data: rpcPayload,
  });

  if (error) {
    if (error.message?.includes("SLUG_CONFLICT")) {
      return { error: "Another tour already uses this name. Pick a different name." };
    }
    if (error.message?.includes("Cannot feature more than 3")) {
      return { error: "Maximum 3 featured packages. Unfeature another first." };
    }
    return { error: error.message ?? "Save failed" };
  }

  const slug = (returnedSlug as string) ?? finalSlug;

  revalidatePath(`/packages/${slug}`);
  revalidatePath(`/packages`);
  revalidatePath(`/`);
  revalidateTag("packages", "max");

  // If slug changed, also revalidate old path
  if (data.id && data.id !== slug) {
    // old slug is unknown here but Next.js will bust cache via revalidatePath('/')
  }

  return { slug };
}

async function resolveUniqueSlug(base: string): Promise<string> {
  const supabase = (await createServerClient()) as any;

  let candidate = base;
  let n = 2;
  while (true) {
    const { data } = await supabase
      .from("packages")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${n}`;
    n++;
  }
}

// Called after successful create to navigate — must be called from client via redirect
export async function redirectAfterCreate(slug: string): Promise<never> {
  redirect(`/admin/packages/${slug}`);
}
