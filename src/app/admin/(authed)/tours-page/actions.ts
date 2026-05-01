"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";

export const toursPageSchema = z.object({
  kicker: z.string().min(1, "Kicker is required"),
  page_heading: z.string().min(1, "Heading is required"),
  page_lede: z.string().min(1, "Lede is required"),
  hero_image: z.string().nullable().optional(),
});

export type ToursPageFormValues = z.infer<typeof toursPageSchema>;

export async function saveToursPage(raw: ToursPageFormValues): Promise<{ error?: string }> {
  const parsed = toursPageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const supabase = await createServerClient();

  const { error } = await (supabase
    .from("site_content") as any)
    .upsert({ id: "tours_hero", data: parsed.data }, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/packages");
  return {};
}
