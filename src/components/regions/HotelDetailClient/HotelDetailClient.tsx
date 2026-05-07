"use client";
import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HotelCarousel } from "@/components/primitives/HotelCarousel/HotelCarousel";
import { HotelBookingPanel } from "@/components/primitives/HotelBookingPanel/HotelBookingPanel";
import type { HotelCardData } from "@/lib/regions/hotels";

interface HotelDetailClientProps {
  hotel: HotelCardData;
  region: string;
  slug: string;
  waPhone?: string;
}

export function HotelDetailClient({ hotel, region, slug, waPhone }: HotelDetailClientProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-[clamp(40px,6vw,80px)]">

      {/* Left — carousel + description */}
      <div>
        {/* Carousel — full column width, synced to selected room */}
        <Reveal>
          <div className="mb-10 relative" style={{ zIndex: 10 }}>
            <HotelCarousel
              images={hotel.images}
              hotelName={hotel.name}
              roomTypes={hotel.roomTypes}
              activeRoomIndex={selectedRoomIndex}
            />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-6">
            About this property
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-[clamp(16px,1.4vw,19px)] text-ink leading-[1.7] mb-10 max-w-[56ch]">
            {hotel.longDescription}
          </p>
        </Reveal>

        {/* Amenities */}
        <Reveal delay={160}>
          <div className="border border-rule p-6 mb-6">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5">
              Amenities &amp; highlights
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {hotel.amenities.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-ochre flex-shrink-0" />
                  <span className="text-[15px] text-ink leading-snug">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Property details */}
        <Reveal delay={180}>
          <div className="border border-rule p-6">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-5">
              Property details
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
              <Detail icon="bed" label={`${hotel.properties.bedrooms} bedroom${hotel.properties.bedrooms > 1 ? "s" : ""}`} />
              <Detail icon="bath" label={`${hotel.properties.bathrooms} bathroom${hotel.properties.bathrooms > 1 ? "s" : ""}`} />
              <Detail icon="map" label={`${hotel.properties.distanceKm} km from centre`} />
              <Detail icon="clock" label={`Check-in ${hotel.checkInTime}`} />
              <Detail icon="clock-out" label={`Check-out ${hotel.checkOutTime}`} />
              <Detail icon="lang" label={hotel.languages.join(", ")} />
              {hotel.properties.freeWifi && <Detail icon="wifi" label="Free Wi-Fi" />}
              {hotel.properties.freeCancellation && <Detail icon="check" label="Free cancellation" />}
              {hotel.properties.freeParking && <Detail icon="parking" label="Free parking" />}
              {hotel.properties.bedBreakfast && <Detail icon="coffee" label="Bed &amp; breakfast" />}
              {hotel.properties.balcony && <Detail icon="balcony" label="Balcony" />}
              {hotel.properties.washer && <Detail icon="washer" label="Washing machine" />}
              {hotel.properties.ac && <Detail icon="ac" label="Air conditioning" />}
              {hotel.properties.tv && <Detail icon="tv" label="Television" />}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Right — booking panel (sticky) */}
      <div className="lg:pt-2">
        <div className="lg:sticky lg:top-8">
          <Reveal>
            <HotelBookingPanel
              hotelName={hotel.name}
              region={region}
              roomTypes={hotel.roomTypes}
              selectedRoomIndex={selectedRoomIndex}
              onRoomSelect={setSelectedRoomIndex}
              waPhone={waPhone}
            />
          </Reveal>
          <Reveal delay={80}>
            <Link
              href={`/regions/${slug}`}
              className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted hover:text-ink transition-colors duration-200"
            >
              <span>←</span>
              <span>Back to {region} hotels</span>
            </Link>
          </Reveal>
        </div>
      </div>

    </div>
  );
}

/* ── small icon+label row ── */
function Detail({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-ink">
      <span className="text-ochre shrink-0">{ICONS[icon]}</span>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  bed: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M3 14h18"/><path d="M3 18h18"/><path d="M9 22v-4"/><path d="M15 22v-4"/></svg>,
  bath: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/></svg>,
  map: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  clock: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  "clock-out": <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l-3 3"/></svg>,
  lang: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  wifi: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  parking: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
  coffee: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  balcony: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  washer: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M12 6h.01"/></svg>,
  ac: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/></svg>,
  tv: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>,
};
