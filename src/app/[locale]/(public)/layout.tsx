import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { PaperPlanePath } from "@/components/primitives/PaperPlanePath/PaperPlanePath";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { getAllHotels, type HotelPublic } from "@/lib/db/hotels";
import { REGIONS } from "@/lib/packages/constants";
import type { Region } from "@/components/layout/SiteHeader/NavHotel";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hotels = await getAllHotels();

  const hotelsByRegion = Object.fromEntries(
    REGIONS.map((region) => [
      region,
      hotels.filter((h: HotelPublic) => h.region === region),
    ])
  ) as Record<Region, HotelPublic[]>;

  return (
    <div className="relative overflow-x-hidden overflow-y-clip">
      <ScrollToTop />
      <SiteHeader hotelsByRegion={hotelsByRegion} />
      <PaperPlanePath />
      <main className="relative">{children}</main>
      <SiteFooter />
    </div>
  );
}
