import { TransportationPage } from "@/components/transport/TransportationPage/TransportationPage";
import { getSiteContent } from "@/lib/db/site-content";
import { getAirports, getVehicles } from "@/lib/db/transport";

export const revalidate = 60;

export const metadata = {
  title: "Private Chauffeur & Airport Transfer — Meridian & Co.",
  description:
    "Mercedes E-Class, V-Class and S-Class. English-speaking, licensed chauffeurs across Türkiye. Airport transfers and custom routes.",
};

export default async function TransportationRoute() {
  const [hero, airportRows, vehicleRows] = await Promise.all([
    getSiteContent("transport_hero"),
    getAirports(),
    getVehicles(),
  ]);

  const airports = airportRows.map((a) => ({ code: a.code, label: a.label }));
  const vehicles = vehicleRows.map((v) => ({
    id: v.vehicle_id,
    label: v.label,
    capacity: v.capacity,
    note: v.note,
    from: v.from_price,
  }));

  return (
    <TransportationPage
      heroHeadingTop={hero.hero_heading_top}
      heroHeadingEm={hero.hero_heading_em}
      heroSub={hero.hero_sub}
      airports={airports}
      vehicles={vehicles}
    />
  );
}
