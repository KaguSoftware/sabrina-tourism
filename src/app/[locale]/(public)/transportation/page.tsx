import type { Metadata } from "next";
import { TransportationPage } from "@/components/transport/TransportationPage/TransportationPage";
import { getSiteContent } from "@/lib/db/site-content";
import { getAirports, getVehicles } from "@/lib/db/transport";

export const revalidate = 604800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const path = "/transportation";
  const localePath = locale === "en" ? path : `/${locale}${path}`;
  const title = "Private Chauffeur & Airport Transfer — Sabrina Turizm";
  const description =
    "Mercedes E-Class, V-Class and S-Class. English-speaking, licensed chauffeurs across Türkiye. Airport transfers and custom routes.";
  return {
    title,
    description,
    alternates: { canonical: localePath },
    openGraph: {
      title,
      description,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function TransportationRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [hero, airportRows, vehicleRows] = await Promise.all([
    getSiteContent("transport_hero", locale),
    getAirports(),
    getVehicles(),
  ]);

  const airports = airportRows.map((a) => ({ code: a.code, label: a.label }));
  const vehicles = vehicleRows.map((v) => ({
    id: v.vehicle_id,
    label: v.label,
    capacity: v.capacity,
    luggageCapacity: 6,
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
