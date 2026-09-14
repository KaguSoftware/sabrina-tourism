import { getAdminHotels } from "@/lib/db/hotels";
import { PremadeEditor } from "@/components/admin/PremadePackageEditor/PremadeEditor";

export const dynamic = "force-dynamic";

export default async function NewPremadePage() {
  const hotels = await getAdminHotels();
  const availableHotels = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    region: h.region,
  }));
  return <PremadeEditor availableHotels={availableHotels} />;
}
