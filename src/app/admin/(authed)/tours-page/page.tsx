import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { ToursPageEditor } from "./ToursPageEditor";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin/i18n";
import { loadSiteContentTranslations } from "@/lib/translations/content-actions";

export default async function AdminToursPageEditor() {
  const { t } = await getAdminT();
  const supabase = (await createServerClient()) as any;

  const [{ data }, initialTranslations] = await Promise.all([
    supabase
      .from("site_content")
      .select("data")
      .eq("id", "tours_hero")
      .maybeSingle(),
    loadSiteContentTranslations("tours_hero"),
  ]);

  const content = data?.data ?? {
    kicker: "Explore",
    page_heading: "",
    page_lede: "",
    hero_image: null,
  };

  return (
    <>
      <PageHeader
        kicker={t("pages.toursPage.kicker")}
        title={t("pages.toursPage.title")}
        description={t("pages.toursPage.description")}
      />
      <ToursPageEditor data={content} initialTranslations={initialTranslations} />
    </>
  );
}
