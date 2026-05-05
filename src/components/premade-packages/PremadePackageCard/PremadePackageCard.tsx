import Image from "next/image";
import Link from "next/link";
import type { PremadePackage } from "@/lib/premade-packages/data";
import { formatDate } from "@/lib/premade-packages/data";

interface PremadePackageCardProps {
  pkg: PremadePackage;
}

export function PremadePackageCard({ pkg }: PremadePackageCardProps) {
  return (
    <Link href={`/tours/premade/${pkg.id}`} className="block group">
      <div className="bg-[#fcf5ec] transition-all duration-380 ease-out shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none group-hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] group-hover:[box-shadow:14px_20px_0_-2px_#1b4d5c] border border-rule">
        {/* Image */}
        <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
          <Image
            src={pkg.cardImage}
            alt={pkg.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Dates badge */}
          <div className="absolute top-4 left-4 bg-navy/80 backdrop-blur-sm px-3 py-2 flex flex-col gap-0.5">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre">Fixed Dates</span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-cream">
              {formatDate(pkg.startDate)} — {formatDate(pkg.endDate)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="pt-5 pb-5 px-4">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
            {pkg.destinations.join(" · ")}
          </p>
          <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
            {pkg.name}
          </h3>
          <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch]">
            {pkg.shortDescription}
          </p>
          {/* Hotel + vehicle line */}
          <div className="flex flex-col gap-1 mb-4 border-l-2 border-ochre pl-3">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
              <span className="text-ink">Hotel:</span> {pkg.accommodation.name}
            </span>
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
              <span className="text-ink">Vehicle:</span> {pkg.vehicle.model}
            </span>
          </div>
          <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre">
            View details{" "}
            <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </em>
          </span>
        </div>
      </div>
    </Link>
  );
}
