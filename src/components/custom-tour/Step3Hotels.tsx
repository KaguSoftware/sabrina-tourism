"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { HotelCard } from "@/components/hotels/HotelCard/HotelCard";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { CUSTOM_TOUR_DRAFT_KEY } from "./types";
import type { CustomTourState } from "./types";
import type { HotelPublic } from "@/lib/db/hotels";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
  onBack: () => void;
  hotelsByRegion: Record<string, HotelPublic[]>;
}

type Region = (typeof REGIONS)[number];

function ordinal(n: number) {
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : n % 10 === 1
      ? "st"
      : n % 10 === 2
      ? "nd"
      : n % 10 === 3
      ? "rd"
      : "th";

  return `${n}${suffix}`;
}

function getSelectedRegions(destinations: string[]): Region[] {
  return destinations.filter((destination): destination is Region =>
    REGIONS.includes(destination as Region)
  );
}

export function Step3Hotels({ state, onChange, onNext, onBack, hotelsByRegion }: Props) {
  const t = useTranslations("customTour.step3");
  const selectedRegions = getSelectedRegions(state.destinations);
  const canProceed =
    selectedRegions.length > 0 &&
    selectedRegions.every((region, i) => Boolean((state.hotelIds ?? {})[region] ?? (i === 0 ? state.hotelId : null)));

  function selectedHotelId(region: Region, index: number) {
    return (state.hotelIds ?? {})[region] ?? (index === 0 ? state.hotelId : null);
  }

  function selectHotel(region: Region, hotelId: string) {
    const hotelIds = {
      ...(state.hotelIds ?? {}),
      [region]: hotelId,
    };

    onChange({
      hotelIds,
      hotelId: hotelIds[selectedRegions[0]] ?? hotelId,
    });
  }

  return (
    <div>
      <Kicker>{t("kicker")}</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        {t("heading")}
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        {t("sub")}
      </p>

      <div className="flex flex-col gap-12 mb-12">
        {selectedRegions.map((region, sectionIndex) => {
          const hotels = hotelsByRegion[region] ?? [];
          const regionSlug = REGION_SLUGS[region as keyof typeof REGION_SLUGS] ?? region.toLowerCase().replace(/\s+/g, "-");
          return (
            <section key={region}>
              <div className="mb-5">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre">
                  {t("ordinalArea", { ord: ordinal(sectionIndex + 1) })}
                </p>
                <h3 className="font-display text-[clamp(26px,3vw,36px)] tracking-tight text-ink">
                  {region}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {hotels.map((hotel) => {
                  const isSelected = selectedHotelId(region, sectionIndex) === hotel.id;
                  return (
                    <div key={`${region}:${hotel.id}`} className="flex flex-col">
                      <HotelCard
                        hotel={hotel}
                        selected={isSelected}
                        onSelect={() => selectHotel(region, hotel.id)}
                      />
                      <Link
                        href={`/regions/${regionSlug}/${hotel.slug}?from=custom-tour`}
                        style={{ color: "var(--color-ochre)" }}
                        onClick={() => {
                          window.sessionStorage.setItem(CUSTOM_TOUR_DRAFT_KEY, JSON.stringify(state));
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 bg-navy px-4 py-3 font-mono text-[12px] font-semibold tracking-[0.16em] uppercase shadow-[3px_4px_0_-1px_#c99a3f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-soft hover:shadow-[5px_6px_0_-1px_#c99a3f]"
                      >
                        {t("viewDetails")}
                        <em className="not-italic inline-block transition-transform duration-300">
                          &rarr;
                        </em>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-10">
        {t("moreHotels")}
      </p>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "transparent", color: "#1f1a14", fontWeight: 400, border: "1.5px solid #c99a3f" }}
        >
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: canProceed ? "pointer" : "not-allowed", transition: "background 0.2s, color 0.2s", backgroundColor: canProceed ? "#0b1a2e" : "transparent", color: canProceed ? "#c99a3f" : "#999", fontWeight: 600, border: canProceed ? "none" : "1.5px solid #c99a3f" }}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
