import Image from "next/image";
import { Star } from "lucide-react";
import { BaseCard } from "@/components/primitives/BaseCard/BaseCard";
import type { HotelPublic } from "@/lib/db/hotels";
import { REGION_SLUGS } from "@/lib/packages/constants";

interface HotelCardProps {
  hotel: HotelPublic;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const image = hotel.images[0] ?? hotel.bedroomImage;
  const regionSlug = REGION_SLUGS[hotel.region as keyof typeof REGION_SLUGS] ?? hotel.region.toLowerCase().replace(/\s+/g, "-");
  const starCount = Math.min(5, Math.max(0, hotel.stars));

  return (
    <BaseCard
      href={`/regions/${regionSlug}/${hotel.slug}`}
      ariaLabel={hotel.name}
      image={
        <>
          {image ? (
            <Image
              src={image}
              alt={hotel.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-navy-soft" />
          )}
          <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {hotel.region}
          </span>
        </>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
        {hotel.location}
        {hotel.bedrooms > 0 && (
          <>
            <span className="mx-1.5 text-rule">·</span>
            {hotel.bedrooms} {hotel.bedrooms === 1 ? "bedroom" : "bedrooms"}
          </>
        )}
      </p>
      <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
        {hotel.name}
      </h3>
      {starCount > 0 && (
        <div
          className="flex items-center gap-1 mb-3 text-ochre"
          aria-label={`${starCount} star hotel`}
        >
          {Array.from({ length: starCount }).map((_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={1.5} aria-hidden />
          ))}
        </div>
      )}
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
