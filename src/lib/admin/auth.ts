import { createServerClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  return {};
}
