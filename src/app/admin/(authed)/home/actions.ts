"use server";

import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { homeContentSchema, type HomeContentFormValues } from "./schema";

export async function saveHomeContent(raw: HomeContentFormValues): Promise<{ error?: string }> {
  const parsed = homeContentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  const { hero, about, how_it_works, featured, featured_hotels, quote } = parsed.data;

  const supabase = createServiceClient();

  const upserts = [
    { id: "home_hero", data: hero },
    { id: "home_about", data: about },
    { id: "home_how_it_works", data: how_it_works },
    { id: "home_featured_heading", data: { section_heading: featured.section_heading, featured_slugs: featured.featured_slugs } },
    { id: "home_featured_hotels_heading", data: featured_hotels },
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

  for (const row of upserts) {
    revalidateTag(tags.siteContent(row.id), "max");
  }

  return {};
}
