"use server";

import { updateTag, revalidatePath } from "next/cache";
import { saveSiteContentData } from "@/lib/db/site-content";
import { tags } from "@/lib/cache/tags";
import { requireAdmin } from "@/lib/admin/auth";
import type { SiteContentKey, SiteContentDataMap } from "@/lib/supabase/types";
import { homeContentSchema, type HomeContentFormValues } from "./schema";

export async function saveHomeContent(raw: HomeContentFormValues): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if (auth.error) return auth;

  const parsed = homeContentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { hero, about, how_it_works, featured, featured_hotels, group_packages, quote } = parsed.data;

  const upserts = [
    { id: "home_hero", data: hero },
    { id: "home_about", data: about },
    { id: "home_how_it_works", data: how_it_works },
    { id: "home_featured_heading", data: featured },
    { id: "home_featured_hotels_heading", data: featured_hotels },
    { id: "home_group_packages", data: group_packages },
    { id: "home_quote", data: quote },
  ];

  for (const row of upserts) {
    const key = row.id as SiteContentKey;
    const { error } = await saveSiteContentData(key, row.data as SiteContentDataMap[typeof key]);

    if (error) {
      return { error: `Failed to save ${row.id}: ${error}` };
    }
  }

  for (const row of upserts) {
    updateTag(tags.siteContent(row.id));
  }
  revalidatePath("/", "layout");

  return {};
}
