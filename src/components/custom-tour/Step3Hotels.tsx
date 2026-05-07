"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { HotelSVG } from "@/components/illustrations/HotelSVG/HotelSVG";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { REGIONS, REGION_SLUGS } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";
import { CUSTOM_TOUR_DRAFT_KEY } from "./types";
import type { CustomTourState } from "./types";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
  onBack: () => void;
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

export function Step3Hotels({ state, onChange, onNext, onBack }: Props) {
  const t = useTranslations("customTour.step3");
  const tCommon = useTranslations("common");
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
        {selectedRegions.map((region, sectionIndex) => (
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
              {HOTELS[region].map((hotel) => {
                const selected = selectedHotelId(region, sectionIndex) === hotel.id;
                return (
                  <article
                    key={`${region}:${hotel.id}`}
                    className={`group overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] bg-[#fcf5ec] ${
                      selected
                        ? "border-ochre ring-[3px] ring-ochre ring-offset-2 ring-offset-cream shadow-[0_8px_32px_-6px_rgba(201,154,63,0.55)] motion-safe:scale-[1.02]"
                        : "border-rule shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] hover:[box-shadow:14px_20px_0_-2px_#1b4d5c]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectHotel(region, hotel.id)}
                      aria-pressed={selected}
                      aria-label={t("selectHotel", { name: hotel.name })}
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-[4/3.2] overflow-hidden bg-navy-soft">
                        <HotelSVG variant={hotel.svgVariant} className="absolute inset-0" />
                        <span className="absolute top-4 left-4 bg-navy/78 text-cream font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm">
                          {hotel.tags[0]}
                        </span>
                        <span className="absolute top-4 right-4 bg-ochre/90 text-navy font-mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
                          {hotel.tags[1]}
                        </span>
                        {selected && (
                          <span className="absolute bottom-3 left-3 bg-ochre text-navy font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 shadow-[0_2px_8px_-2px_rgba(11,26,46,0.4)] z-10">
                            {tCommon("selected")}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-display font-normal text-[18px] tracking-tight text-ink leading-tight">
                            {hotel.name}
                          </h4>
                        </div>
                        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ochre mb-2">
                          {hotel.location}
                        </p>
                        <p className="text-ink-soft text-[13px] leading-[1.5]">
                          {hotel.description}
                        </p>
                      </div>
                    </button>
                    <div className="px-4 pb-4 -mt-1">
                      <Link
                        href={`/regions/${REGION_SLUGS[region]}/${hotel.slug}?from=custom-tour`}
                        style={{ color: "var(--color-ochre)" }}
                        onClick={() => {
                          window.sessionStorage.setItem(CUSTOM_TOUR_DRAFT_KEY, JSON.stringify(state));
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 bg-navy px-4 py-3 font-mono text-[12px] font-semibold tracking-[0.16em] uppercase shadow-[3px_4px_0_-1px_#c99a3f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-soft hover:shadow-[5px_6px_0_-1px_#c99a3f]"
                      >
                        {t("viewDetails")}
                        <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </em>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
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
