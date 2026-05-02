import Image from "next/image";
import Link from "next/link";
import type { PackageCardProps } from "./types";
import { CARD_IMAGE_SIZES } from "./constants";

export function PackageCard({ pkg, filterParams }: PackageCardProps) {
  const href = filterParams ? `/packages/${pkg.slug}?${filterParams}` : `/packages/${pkg.slug}`;
  return (
    <Link href={href} className="block group">
      {/* 3-D tilt card on hover */}
      <div
        className="bg-[#fcf5ec] transition-all duration-380 ease-out shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none group-hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] group-hover:[box-shadow:14px_20px_0_-2px_#1b4d5c] border border-rule"
      >
        {/* Image */}
        <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
          <Image
            src={pkg.cardImage ?? pkg.heroImage}
            alt={pkg.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
            sizes={CARD_IMAGE_SIZES}
          />
          {/* Region badge */}
          <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {pkg.region}
          </span>
        </div>

        {/* Body */}
        <div className="pt-5 pb-5 px-4">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
            {pkg.duration}
            <span className="mx-1.5 text-rule">·</span>
            From <em className="text-ochre not-italic">Essential</em>
          </p>
          <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
            {pkg.name}
          </h3>
          <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch]">
            {pkg.shortDescription}
          </p>
          <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre">
            Read itinerary{" "}
            <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </em>
          </span>
        </div>
      </div>
    </Link>
  );
}
