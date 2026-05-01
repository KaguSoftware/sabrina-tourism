"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";

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

export async function saveHomeContent(raw: HomeContentFormValues): Promise<{ error?: string }> {
  const parsed = homeContentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { hero, about, how_it_works, featured, quote } = parsed.data;

  const supabase = await createServerClient();

  const upserts = [
    { id: "home_hero", data: hero },
    { id: "home_about", data: about },
    { id: "home_how_it_works", data: how_it_works },
    { id: "home_featured_heading", data: { section_heading: featured.section_heading, featured_slugs: featured.featured_slugs } },
    { id: "home_quote", data: quote },
  ];

  for (const row of upserts) {
    const { error } = await (supabase
      .from("site_content") as unknown as {
        upsert: (
          values: { id: string; data: unknown },
          opts: { onConflict: string },
        ) => Promise<{ error: { message: string } | null }>;
      })
      .upsert({ id: row.id, data: row.data }, { onConflict: "id" });

    if (error) {
      return { error: `Failed to save ${row.id}: ${error.message}` };
    }
  }

  revalidateTag("home", "max");
  revalidatePath("/", "page");

  return {};
}
