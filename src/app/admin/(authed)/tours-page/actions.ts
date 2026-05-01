"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { toursPageSchema, type ToursPageFormValues } from "./schema";

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
