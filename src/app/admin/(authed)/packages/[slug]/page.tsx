import { notFound } from "next/navigation";
import { getPackageRawBySlug } from "@/lib/db/packages";
import { getAdminHotels } from "@/lib/db/hotels";
import { PackageEditor } from "@/components/admin/PackageEditor/PackageEditor";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminPackageEditPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageRawBySlug(slug);

  if (!pkg) notFound();

  const hotels = await getAdminHotels();
  const availableHotels = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    region: h.region,
  }));

  return <PackageEditor pkg={pkg} availableHotels={availableHotels} />;
}
