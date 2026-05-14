import Image from "next/image";
import { BaseCard } from "@/components/primitives/BaseCard/BaseCard";
import type { DailyPackage } from "@/lib/daily/types";

export function DailyPackageCard({ pkg }: { pkg: DailyPackage }) {
  return (
    <BaseCard
      href={`/tours/daily/${pkg.slug ?? pkg.id}`}
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
          <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
            {pkg.region}
          </span>
          <span className="absolute bottom-4 left-4 bg-ochre text-navy font-mono text-[11px] tracking-[0.18em] uppercase px-3 py-1.5">
            {pkg.startTime} – {pkg.endTime}
          </span>
        </>
      }
    >
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ochre mb-3">
        {pkg.startTime} – {pkg.endTime}
      </p>
      <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.012em] leading-[1.1] mb-2.5">
        {pkg.name}
      </h3>
      <p className="text-[15px] text-ink-soft leading-[1.55] mb-4 max-w-[38ch]">
        {pkg.shortDescription}
      </p>
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-4">
        <span className="text-ink">Vehicle:</span> {pkg.vehicle}
      </p>
      <div className="flex gap-2 mb-5">
        {pkg.groupImages.slice(0, 3).map((src, i) => (
          <div
            key={i}
            className="relative w-[60px] h-[45px] overflow-hidden shrink-0 border border-rule"
          >
            <Image src={src} alt="" fill className="object-cover" sizes="60px" />
          </div>
        ))}
        {pkg.groupImages.length > 3 && (
          <div className="relative w-[60px] h-[45px] overflow-hidden shrink-0 border border-rule bg-navy/10 flex items-center justify-center">
            <span className="font-mono text-[11px] text-muted">
              +{pkg.groupImages.length - 3}
            </span>
          </div>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <p className="font-display italic text-[20px] text-ochre">
          {pkg.currency} {pkg.price.toLocaleString()}
          <span className="font-sans not-italic text-[13px] text-muted ml-1">
            / person
          </span>
        </p>
        <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase border-b border-ochre pb-0.5 transition-colors duration-200 group-hover:text-ochre">
          View experience{" "}
          <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </em>
        </span>
      </div>
    </BaseCard>
  );
}
