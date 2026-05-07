import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { Button } from "@/components/admin/Button/Button";
import { FixedDatesTable } from "./FixedDatesTable";
import { getAdminPremadePackages } from "@/lib/db/premade-packages";
import { getAdminT } from "@/lib/admin/i18n";

export default async function FixedDatesPage() {
  const { t } = await getAdminT();
  const packages = await getAdminPremadePackages();
  const rows = packages.map((p) => ({ id: p.id, slug: p.slug, name: p.name, isPublished: p.isPublished, sortOrder: p.sortOrder }));
  return (
    <>
      <PageHeader
        kicker={t("pages.fixedDates.kicker")}
        title={t("pages.fixedDates.title")}
        description={t("pages.fixedDates.description")}
        actions={<Button href="/admin/fixed-dates/new" variant="solid">{t("pages.fixedDates.new")}</Button>}
      />
      <FixedDatesTable initialPackages={rows} />
    </>
  );
}
