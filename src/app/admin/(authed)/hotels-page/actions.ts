"use server";

import { updateTag, revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { hotelsPageSchema, type HotelsPageFormValues } from "./schema";

export async function saveHotelsPage(raw: HotelsPageFormValues): Promise<{ error?: string }> {
  const parsed = hotelsPageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const supabase = createServiceClient();

  const { error } = await (supabase
    .from("site_content") as any)
    .upsert({ id: "hotels_page", data: parsed.data }, { onConflict: "id" });

  if (error) return { error: error.message };

  updateTag(tags.siteContent("hotels_page"));
  revalidatePath("/", "layout");
  revalidatePath("/admin/hotels-page");
  return {};
}
