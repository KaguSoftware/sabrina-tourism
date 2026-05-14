import Image from "next/image";
import { BaseCard } from "@/components/primitives/BaseCard/BaseCard";
import type { HotelCardData } from "@/lib/regions/hotels";

export type { HotelCardData };

export function HotelCard({ hotel, regionSlug }: { hotel: HotelCardData; regionSlug: string }) {
  return (
    <BaseCard
      href={`/regions/${regionSlug}/${hotel.slug}`}
      ariaLabel={hotel.name}
      image={
        <>
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {hotel.tags[0]}
          </span>
          <span className="absolute top-4 right-4 bg-ochre/90 text-navy font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
            {hotel.tags[1]}
          </span>
        </>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
        Partnered Hotel
        <span className="mx-1.5 text-rule">·</span>
        <em className="text-ochre not-italic">Curated Stay</em>
      </p>
      <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
        {hotel.name}
      </h3>
      <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch] flex-1">
        {hotel.description}
      </p>
      <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre w-fit">
        View hotel{" "}
        <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </em>
      </span>
    </BaseCard>
  );
}
