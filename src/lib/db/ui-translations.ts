import { unstable_cache } from "next/cache";
import { createAnonClient, createServiceClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/locales";

const TAG = "ui-translations";

// ui_translations is not in the generated Database types yet; cast to any to bypass
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export const getUIMessages = unstable_cache(
  async (locale: string): Promise<Record<string, unknown> | null> => {
    const sb = createAnonClient() as AnyClient;
    const { data } = await sb
      .from("ui_translations")
      .select("data")
      .eq("locale", locale)
      .single();
    return (data?.data as Record<string, unknown>) ?? null;
  },
  [TAG],
  { tags: [TAG] }
);

export async function loadAllUIMessages(): Promise<Record<string, Record<string, unknown>>> {
  const sb = createAnonClient() as AnyClient;
  const { data } = await sb.from("ui_translations").select("locale, data");
  const result: Record<string, Record<string, unknown>> = {};
  for (const row of ((data ?? []) as Array<{ locale: string; data: unknown }>)) {
    result[row.locale] = row.data as Record<string, unknown>;
  }
  return result;
}

export async function saveUIMessages(
  locale: Locale,
  messages: Record<string, unknown>
): Promise<{ error?: string }> {
  const sb = createServiceClient() as AnyClient;
  const { error } = await sb
    .from("ui_translations")
    .upsert({ locale, data: messages }, { onConflict: "locale" });
  if (error) return { error: (error as { message: string }).message };
  return {};
}

export async function saveAllUIMessages(
  allMessages: Record<string, Record<string, unknown>>
): Promise<{ error?: string }> {
  const sb = createServiceClient() as AnyClient;
  const rows = Object.entries(allMessages).map(([locale, data]) => ({ locale, data }));
  const { error } = await sb
    .from("ui_translations")
    .upsert(rows, { onConflict: "locale" });
  if (error) return { error: (error as { message: string }).message };
  return {};
}
