import { notFound } from "next/navigation";
import { getPackageRawBySlug } from "@/lib/db/packages";
import { PackageEditor } from "@/components/admin/PackageEditor/PackageEditor";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminPackageEditPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageRawBySlug(slug);

  if (!pkg) notFound();

  return <PackageEditor pkg={pkg} />;
}
