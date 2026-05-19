"use server";

import { updateTag, revalidatePath } from "next/cache";
import { saveSiteContentData } from "@/lib/db/site-content";
import { tags } from "@/lib/cache/tags";
import { requireAdmin } from "@/lib/admin/auth";
import { hotelsPageSchema, type HotelsPageFormValues } from "./schema";

export async function saveHotelsPage(raw: HotelsPageFormValues): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if (auth.error) return auth;

  const parsed = hotelsPageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { error } = await saveSiteContentData("hotels_page", parsed.data);
  if (error) return { error };

  updateTag(tags.siteContent("hotels_page"));
  revalidatePath("/", "layout");
  revalidatePath("/admin/hotels-page");
  return {};
}
