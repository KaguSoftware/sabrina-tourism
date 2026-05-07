import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { Button } from "@/components/admin/Button/Button";
import { DailyTable } from "./DailyTable";
import { getAdminDailyPackages } from "@/lib/db/daily-packages";
import { getAdminT } from "@/lib/admin/i18n";

export default async function DailyPage() {
  const { t } = await getAdminT();
  const packages = await getAdminDailyPackages();
  const rows = packages.map((p) => ({ id: p.id, slug: p.slug, name: p.name, region: p.region, isPublished: p.isPublished, sortOrder: p.sortOrder }));
  return (
    <>
      <PageHeader
        kicker={t("pages.daily.kicker")}
        title={t("pages.daily.title")}
        description={t("pages.daily.description")}
        actions={<Button href="/admin/daily/new" variant="solid">{t("pages.daily.new")}</Button>}
      />
      <DailyTable initialPackages={rows} />
    </>
  );
}
