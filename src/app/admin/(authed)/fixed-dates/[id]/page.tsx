import { notFound } from "next/navigation";
import { getPremadePackageRawById } from "@/lib/db/premade-packages";
import { loadPremadeTranslations } from "@/lib/translations/content-actions";
import { PremadeEditor } from "@/components/admin/PremadePackageEditor/PremadeEditor";
import type { PremadePackageRaw } from "@/lib/db/premade-packages";

export default async function EditPremadePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [pkg, translations] = await Promise.all([
    getPremadePackageRawById(id),
    loadPremadeTranslations(id).catch(() => ({})),
  ]);
  if (!pkg) notFound();
  return <PremadeEditor pkg={pkg as PremadePackageRaw} initialTranslations={translations} />;
}
