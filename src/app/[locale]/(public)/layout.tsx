import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const PaperPlanePath = dynamic(
  () => import("@/components/primitives/PaperPlanePath/PaperPlanePath").then((m) => m.PaperPlanePath),
  { loading: () => null },
);
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
      {/* <PaperPlanePath /> */}
      <main className="relative">{children}</main>
      <SiteFooter />
    </div>
  );
}
