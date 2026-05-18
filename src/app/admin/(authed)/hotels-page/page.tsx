import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { HotelsPageEditor } from "./HotelsPageEditor";
import { createServerClient } from "@/lib/supabase/server";
import { loadSiteContentTranslations } from "@/lib/translations/content-actions";

export default async function AdminHotelsPageEditor() {
  const supabase = (await createServerClient()) as any;

  const [{ data }, initialTranslations] = await Promise.all([
    supabase
      .from("site_content")
      .select("data")
      .eq("id", "hotels_page")
      .maybeSingle(),
    loadSiteContentTranslations("hotels_page"),
  ]);

  const content = data?.data ?? {};

  return (
    <>
      <PageHeader
        kicker="Properties"
        title="Hotels page"
        description="Edit the hero copy on the public hotels listing page."
      />
      <HotelsPageEditor data={content} initialTranslations={initialTranslations} />
    </>
  );
}
