import { createServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { Button } from "@/components/admin/Button/Button";
import { PackagesTable } from "./PackagesTable";
import type { AdminPackageRow } from "./PackagesTable";

export default async function AdminPackagesPage() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("packages")
    .select("id, slug, name, region, card_image, is_published, is_featured, sort_order")
    .order("sort_order");

  const packages: AdminPackageRow[] = (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    region: row.region,
    cardImage: row.card_image ?? undefined,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  }));

  if (error) {
    console.error("[admin/packages] fetch error:", error);
  }

  return (
    <>
      <PageHeader
        kicker="Catalogue"
        title="Tours"
        description="Drag to reorder. Hard maximum of three featured at once."
        actions={
          <Button href="/admin/packages/new" variant="solid">
            + New tour
          </Button>
        }
      />
      <PackagesTable initialPackages={packages} />
    </>
  );
}
