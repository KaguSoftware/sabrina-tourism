import { createServerClient } from "@/lib/supabase/server";
import { isAllowedAdminEmail } from "@/lib/admin/allowlist";

export async function requireAdmin(): Promise<{ error?: string }> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!isAllowedAdminEmail(user.email)) return { error: "Unauthorized" };
  return {};
}
