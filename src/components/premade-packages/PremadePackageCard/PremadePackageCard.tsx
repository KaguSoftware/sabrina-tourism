import Image from "next/image";
import { BaseCard } from "@/components/primitives/BaseCard/BaseCard";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

interface PremadePackageCardProps {
  pkg: PremadePackagePublic;
}

export function PremadePackageCard({ pkg }: PremadePackageCardProps) {
  return (
    <BaseCard
      href={`/tours/premade/${pkg.slug}`}
      ariaLabel={pkg.name}
      image={
        <>
          <Image
            src={pkg.cardImage}
            alt={pkg.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 bg-navy/80 backdrop-blur-sm px-3 py-2 flex flex-col gap-0.5">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ochre">Fixed Dates</span>
            <span className="font-mono text-[11px] tracking-[0.12em] text-cream">
              {formatDate(pkg.startDate)} — {formatDate(pkg.endDate)}
            </span>
          </div>
          {pkg.season && (
            <span className="absolute top-4 right-4 bg-ochre/90 text-navy font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
              {pkg.season}
            </span>
          )}
        </>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
        {pkg.destinations.join(" · ")}
      </p>
      <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
        {pkg.name}
      </h3>
      <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch]">
        {pkg.shortDescription}
      </p>
      <div className="flex flex-col gap-1 mb-4 border-l-2 border-ochre pl-3">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
          <span className="text-ink">Hotel:</span> {pkg.accommodation.name}
        </span>
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
          <span className="text-ink">Vehicle:</span> {pkg.vehicle.model}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between">
        {pkg.price != null ? (
          <p className="font-display italic text-[20px] text-ochre">
            ${pkg.price.toLocaleString()}
            <span className="font-sans not-italic text-[13px] text-muted ml-1">/ person</span>
          </p>
        ) : <div />}
        <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre">
          View details{" "}
          <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">→</em>
        </span>
      </div>
    </BaseCard>
  );
}
