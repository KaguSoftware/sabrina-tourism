import Image from "next/image";
import Link from "next/link";
import type { HotelPublic } from "@/lib/db/hotels";
import { REGION_SLUGS } from "@/lib/packages/constants";

interface HotelCardProps {
  hotel: HotelPublic;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const image = hotel.images[0] ?? hotel.bedroomImage;
  const regionSlug = REGION_SLUGS[hotel.region as keyof typeof REGION_SLUGS] ?? hotel.region.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/regions/${regionSlug}/${hotel.slug}`} className="block group">
      <div className="bg-[#fcf5ec] transition-all duration-380 ease-out shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none group-hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] group-hover:[box-shadow:14px_20px_0_-2px_#1b4d5c] border border-rule">
        {/* Image */}
        <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
          {image ? (
            <Image
              src={image}
              alt={hotel.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 420px"
            />
          ) : (
            <div className="absolute inset-0 bg-navy-soft" />
          )}
          {/* Region badge */}
          <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {hotel.region}
          </span>
        </div>

        {/* Body */}
        <div className="pt-5 pb-5 px-4">
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
          <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch]">
            {hotel.description}
          </p>
          <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre">
            View hotel{" "}
            <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </em>
          </span>
        </div>
      </div>
    </Link>
  );
}
