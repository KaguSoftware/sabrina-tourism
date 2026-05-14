import Image from "next/image";
import { BaseCard } from "@/components/primitives/BaseCard/BaseCard";
import type { PackageCardProps } from "./types";
import { CARD_IMAGE_SIZES } from "./constants";

export function PackageCard({ pkg, filterParams, priority = false }: PackageCardProps) {
  const href = filterParams ? `/packages/${pkg.slug}?${filterParams}` : `/packages/${pkg.slug}`;
  return (
    <BaseCard
      href={href}
      ariaLabel={pkg.name}
      image={
        <>
          <Image
            src={pkg.cardImage ?? pkg.heroImage}
            alt={pkg.name}
            fill
            {...(priority ? { priority: true, fetchPriority: "high" as const } : { loading: "lazy" as const })}
            className="object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.06]"
            sizes={CARD_IMAGE_SIZES}
          />
          <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {pkg.region}
          </span>
          {pkg.season && (
            <span className="absolute top-4 right-4 bg-ochre/90 text-navy font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
              {pkg.season}
            </span>
          )}
        </>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mb-2.5">
        {pkg.duration}
        <span className="mx-1.5 text-rule">·</span>
        From <em className="text-ochre not-italic">Essential</em>
      </p>
      <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
        {pkg.name}
      </h3>
      <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch] flex-1">
        {pkg.shortDescription}
      </p>
      <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre w-fit">
        Read itinerary{" "}
        <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
          →
        </em>
      </span>
    </BaseCard>
  );
}
