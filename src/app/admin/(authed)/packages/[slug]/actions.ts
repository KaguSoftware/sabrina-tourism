"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient, createServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/cache/tags";
import { slugify } from "@/lib/utils/slug";
import { PackageSchema, type PackageFormValues } from "./schema";

async function requireAuth(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  return {};
}

// ---------------------------------------------------------------------------
// Server action
// ---------------------------------------------------------------------------

export async function savePackage(
  payload: PackageFormValues,
): Promise<{ error?: string; slug?: string }> {
  const auth = await requireAuth(); if (auth.error) return auth;
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

  const supabase = createServiceClient() as any;
  let previousSlug: string | null = null;
  if (data.id) {
    const { data: existing } = await supabase
      .from("packages")
      .select("slug")
      .eq("id", data.id)
      .maybeSingle();
    previousSlug = existing?.slug ?? null;
  }

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

  updateTag(tags.packages.all());
  updateTag(tags.packages.slugs());
  updateTag(tags.packages.featured());
  updateTag(tags.packages.bySlug(slug));
  if (previousSlug && previousSlug !== slug) {
    updateTag(tags.packages.bySlug(previousSlug));
  }

  return { slug };
}

async function resolveUniqueSlug(base: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any;
  const { data } = await supabase.from("packages").select("slug").like("slug", `${base}%`);
  const existing = new Set<string>((data ?? []).map((r: { slug: string }) => r.slug));
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

// Called after successful create to navigate — must be called from client via redirect
export async function redirectAfterCreate(slug: string): Promise<never> {
  redirect(`/admin/packages/${slug}`);
}
