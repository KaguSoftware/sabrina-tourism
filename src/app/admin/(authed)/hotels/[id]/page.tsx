import { notFound } from "next/navigation";
import { getHotelRawById } from "@/lib/db/hotels";
import { loadHotelTranslations } from "@/lib/translations/content-actions";
import { HotelEditor } from "@/components/admin/HotelEditor/HotelEditor";

export default async function AdminHotelEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [hotel, translations] = await Promise.all([
    getHotelRawById(id),
    loadHotelTranslations(id).catch(() => ({})),
  ]);
  if (!hotel) notFound();
  return <HotelEditor hotel={hotel} initialTranslations={translations} />;
}
