import Image from "next/image";
import { Star } from "lucide-react";
import { BaseCard } from "@/components/primitives/BaseCard/BaseCard";
import type { HotelPublic } from "@/lib/db/hotels";
import { REGION_SLUGS } from "@/lib/packages/constants";

interface HotelCardProps {
  hotel: HotelPublic;
  selected?: boolean;
  onSelect?: () => void;
  /** When true, the card omits its own lift/scale transform so a parent can animate the card + adjacent elements as one unit. Border, ring, and selected-badge indicators are preserved. */
  flat?: boolean;
}

export function HotelCard({ hotel, selected, onSelect, flat }: HotelCardProps) {
  const image = hotel.images[0] ?? hotel.bedroomImage;
  const regionSlug = REGION_SLUGS[hotel.region as keyof typeof REGION_SLUGS] ?? hotel.region.toLowerCase().replace(/\s+/g, "-");
  const starCount = Math.min(5, Math.max(0, hotel.stars));

  const cardBody = (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
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
        {selected && (
          <span className="absolute bottom-3 left-3 bg-ochre text-navy font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 shadow-[0_2px_8px_-2px_rgba(11,26,46,0.4)] z-10">
            Selected
          </span>
        )}
      </div>
      <div className="px-4 pt-5 pb-5 flex flex-col flex-1">
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
        {!onSelect && (
          <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre w-fit">
            View hotel{" "}
            <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </em>
          </span>
        )}
      </div>
    </div>
  );

  if (onSelect) {
    const selectedClasses = flat
      ? "border-ochre ring-2 ring-ochre ring-offset-2 shadow-[0_8px_32px_-6px_rgba(201,154,63,0.55)]"
      : "border-ochre ring-2 ring-ochre ring-offset-2 shadow-[0_8px_32px_-6px_rgba(201,154,63,0.55)] scale-[1.02]";
    const idleClasses = flat
      ? "border-rule shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none"
      : "border-rule shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] hover:[box-shadow:14px_20px_0_-2px_#1b4d5c]";
    return (
      <div
        className={`group overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] bg-[#fcf5ec] ${
          selected ? selectedClasses : idleClasses
        }`}
      >
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          aria-label={`Select ${hotel.name}`}
          className="block w-full text-left"
        >
          {cardBody}
        </button>
      </div>
    );
  }

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
