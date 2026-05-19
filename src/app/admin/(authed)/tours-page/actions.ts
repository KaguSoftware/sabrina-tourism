"use server";

import { updateTag } from "next/cache";
import { saveSiteContentData } from "@/lib/db/site-content";
import { tags } from "@/lib/cache/tags";
import { toursPageSchema, type ToursPageFormValues } from "./schema";

export async function saveToursPage(raw: ToursPageFormValues): Promise<{ error?: string }> {
  const parsed = toursPageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { error } = await saveSiteContentData("tours_hero", parsed.data);
  if (error) return { error };

  updateTag(tags.siteContent("tours_hero"));
  return {};
}
