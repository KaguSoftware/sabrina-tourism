import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { Button } from "@/components/admin/Button/Button";
import { PackagesTable } from "./PackagesTable";
import type { AdminPackageRow } from "./PackagesTable";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin/i18n";

export default async function AdminPackagesPage() {
  const { t } = await getAdminT();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createServerClient()) as any;

  const { data, error } = await supabase
    .from("packages")
    .select("id, slug, name, region, card_image, is_published, is_featured, sort_order")
    .order("sort_order");

  if (error) {
    console.error("[admin/packages] fetch error:", error);
  }

  const packages: AdminPackageRow[] = (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    region: row.region,
    cardImage: row.card_image ?? undefined,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  }));

  return (
    <>
      <PageHeader
        kicker={t("pages.packages.kicker")}
        title={t("pages.packages.title")}
        description={t("pages.packages.description")}
        actions={
          <Button href="/admin/packages/new" variant="solid">
            {t("pages.packages.new")}
          </Button>
        }
      />
      <PackagesTable initialPackages={packages} />
    </>
  );
}
