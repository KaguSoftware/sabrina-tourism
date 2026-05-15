import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { Button } from "@/components/admin/Button/Button";
import { HotelsTable } from "./HotelsTable";
import { getAdminHotels } from "@/lib/db/hotels";
import { getAdminT } from "@/lib/admin/i18n";

export default async function AdminHotelsPage() {
  const { t } = await getAdminT();
  const hotels = await getAdminHotels();
  return (
    <>
      <PageHeader
        kicker={t("pages.hotels.kicker")}
        title={t("pages.hotels.title")}
        description={t("pages.hotels.description")}
        actions={<Button href="/admin/hotels/new" variant="solid" shape="pill">{t("pages.hotels.new")}</Button>}
      />
      <HotelsTable initialHotels={hotels} />
    </>
  );
}
