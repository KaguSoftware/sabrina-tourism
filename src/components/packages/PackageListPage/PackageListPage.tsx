"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { FilterBar } from "@/components/packages/FilterBar/FilterBar";
import { PackageCard } from "@/components/packages/PackageCard/PackageCard";
import { PACKAGES } from "@/lib/packages/packages";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import { PAGE_HEADING, PAGE_LEDE } from "./constants";
import type { FilterState } from "@/components/packages/FilterBar/types";

export function PackageListPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<FilterState>({
        region: searchParams.get("region") ? searchParams.get("region")!.split(",") : [],
        people: parseInt(searchParams.get("people") ?? "0") || 0,
        date: searchParams.get("date") ?? "",
    });

    function updateFilters(patch: Partial<FilterState>) {
        const next = { ...filters, ...patch };
        setFilters(next);
        const params = new URLSearchParams();
        if (next.region.length) params.set("region", next.region.join(","));
        if (next.people) params.set("people", String(next.people));
        if (next.date) params.set("date", next.date);
        const qs = params.toString();
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }

    function clearFilters() {
        setFilters({ region: [], people: 0, date: "" });
        router.replace(pathname, { scroll: false });
    }

    const visible = useMemo(() => {
        return PACKAGES.filter((p) => {
            if (filters.people > 0) {
                if (
                    filters.people < p.minPeople ||
                    filters.people > p.maxPeople
                )
                    return false;
            }
            if (filters.date) {
                const d = new Date(filters.date);
                if (
                    d < new Date(p.availableFrom) ||
                    d > new Date(p.availableTo)
                )
                    return false;
            }
            if (filters.region.length && !filters.region.includes(p.region)) return false;
            return true;
        });
    }, [filters]);

    return (
        <>
            {/* Header — flat illustrated mosaic */}
            <section className="relative z-10 overflow-hidden bg-cream min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)]">
                <div className="absolute inset-0">
                    <Image src="/homepage.png" alt="Tours hero" fill className="object-cover object-center" priority />
                </div>
                <div className="absolute inset-0 bg-black/40" />

                {/* Text */}
                <div className="relative z-10 max-w-[1320px] mx-auto w-full">
                    <Reveal>
                        <Kicker light>Itineraries</Kicker>
                    </Reveal>
                    <Reveal delay={120}>
                        <GoldUnderlineHeading
                            as="h1"
                            className="text-[clamp(40px,6vw,80px)] mt-6 mb-6 tracking-[-0.025em] max-w-[14ch] text-cream"
                        >
                            {PAGE_HEADING}
                        </GoldUnderlineHeading>
                    </Reveal>
                    <Reveal delay={200}>
                        <p className="text-[clamp(15px,1.3vw,18px)] text-cream/80 leading-[1.6] max-w-[52ch]">
                            {PAGE_LEDE}
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Filter bar */}
            <FilterBar
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
            />

            {/* Results */}
            <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-14 pb-28">
                <p className="font-mono text-[13px] tracking-[0.16em] uppercase text-muted mb-10">
                    <span className="text-ochre font-display italic text-[18px] mr-1">
                        {visible.length}
                    </span>
                    {visible.length === 1 ? "itinerary" : "itineraries"}
                    {filters.region && (
                        <em className="not-italic text-ink">
                            {" "}
                            in {filters.region}
                        </em>
                    )}
                </p>

                {visible.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
                        {visible.map((pkg, i) => (
                            <Reveal key={pkg.slug} delay={i * 70}>
                                <PackageCard pkg={pkg} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <Reveal>
                        <div className="text-center max-w-[540px] mx-auto py-16 px-6">
                            <Kicker>No matches</Kicker>
                            <h3 className="font-display font-normal text-[clamp(24px,3vw,36px)] tracking-tight mt-4 mb-3">
                                No itinerary fits those filters — yet.
                            </h3>
                            <p className="text-ink-soft mb-8">
                                Tell us what you&#39;re imagining and we&#39;ll
                                draw it from scratch. Most of our private
                                journeys start this way.
                            </p>
                            <GoldButton
                                href={genericMessage()}
                                variant="solid"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Contact us via WhatsApp
                            </GoldButton>
                        </div>
                    </Reveal>
                )}
            </section>
        </>
    );
}
