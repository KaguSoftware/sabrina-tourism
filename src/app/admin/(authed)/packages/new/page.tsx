import { getAdminHotels } from "@/lib/db/hotels";
import { PackageEditor } from "@/components/admin/PackageEditor/PackageEditor";

export default async function AdminNewPackagePage() {
  const hotels = await getAdminHotels();
  const availableHotels = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    region: h.region,
  }));
  return <PackageEditor availableHotels={availableHotels} />;
}
