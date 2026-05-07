import { notFound } from "next/navigation";
import { getDailyPackageRawById } from "@/lib/db/daily-packages";
import { loadDailyTranslations } from "@/lib/translations/content-actions";
import { DailyEditor } from "@/components/admin/DailyPackageEditor/DailyEditor";
import type { DailyPackageRaw } from "@/lib/db/daily-packages";

export default async function EditDailyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [pkg, translations] = await Promise.all([
    getDailyPackageRawById(id),
    loadDailyTranslations(id).catch(() => ({})),
  ]);
  if (!pkg) notFound();
  return <DailyEditor pkg={pkg as DailyPackageRaw} initialTranslations={translations} />;
}
