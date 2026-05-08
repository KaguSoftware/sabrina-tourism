"use client";
import { useLocale, useTranslations } from "next-intl";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { TripMapSVG } from "@/components/illustrations/TripMapSVG/TripMapSVG";
import { REGIONS } from "@/lib/packages/constants";
import { HOTELS } from "@/lib/regions/hotels";
import { DESTINATIONS } from "./types";
import type { CustomTourState } from "./types";
import type { Vehicle } from "@/lib/transport/types";

interface Props {
  state: CustomTourState;
  onBack: () => void;
  onConfirm: () => void;
  vehicles: Vehicle[];
}

function formatDate(s: string, locale: string) {
  if (!s) return "—";
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-4 border-b border-rule last:border-0">
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted sm:w-44 flex-shrink-0">
        {label}
      </span>
      <span className="font-display font-normal text-[17px] tracking-tight text-ink">
        {value}
      </span>
    </div>
  );
}

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

function findHotel(id: string | null) {
  if (!id) return null;

  for (const region of REGIONS) {
    const hotel = HOTELS[region].find((item) => item.id === id);
    if (hotel) return { ...hotel, region };
  }

  return null;
}

function getSelectedRegions(destinations: string[]) {
  return destinations.filter((destination): destination is (typeof REGIONS)[number] =>
    REGIONS.includes(destination as (typeof REGIONS)[number])
  );
}

export function Step5Review({ state, onBack, onConfirm, vehicles }: Props) {
  const locale = useLocale();
  const t = useTranslations("customTour.step5");
  const whatsappT = useTranslations("whatsapp");
  const selectedRegions = getSelectedRegions(state.destinations);
  const destLabels = state.destinations
    .map((id) => DESTINATIONS.find((d) => d.id === id)?.label ?? id)
    .join(", ");
  const destinationBreakdown =
    state.destinations.length > 1
      ? state.destinations
          .map((id, i) => {
            const destination = DESTINATIONS.find((d) => d.id === id);
            const days = (state.destinationDays ?? {})[id];
            return `${ordinal(i + 1)} ${destination?.label ?? id}${
              days ? `: ${days} day${days === "1" ? "" : "s"}` : ""
            }`;
          })
          .join("; ")
      : "";

  const hotelBreakdown = selectedRegions
    .map((region, i) => {
      const hotelId = (state.hotelIds ?? {})[region] ?? (i === 0 ? state.hotelId : null);
      const hotel = findHotel(hotelId);
      const regionLabel =
        selectedRegions.length > 1 ? `${ordinal(i + 1)} ${region}` : region;
      return `${regionLabel}: ${
        hotel ? `${hotel.name} (${hotel.location})` : "—"
      }`;
    })
    .join("; ");
  const vehicle = vehicles.find((v) => v.id === state.vehicleId);
  const guideType = state.guideType ?? "assistant";
  const guideLanguage = state.guideLanguage ?? "English";

  const duration = (() => {
    if (!state.startDate || !state.endDate) return "—";
    const [sy, sm, sd] = state.startDate.split("-").map(Number);
    const [ey, em, ed] = state.endDate.split("-").map(Number);
    const diff = Math.round(
      (new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return diff === 1 ? t("night", { n: diff }) : t("nights", { n: diff });
  })();

  const whatsappMessage = [
    whatsappT("customTourIntro"),
    t("whatsappDestinations", { value: destLabels }),
    destinationBreakdown ? t("whatsappDestinationOrder", { value: destinationBreakdown }) : "",
    t("whatsappDates", {
      start: formatDate(state.startDate, locale),
      end: formatDate(state.endDate, locale),
      duration,
    }),
    t("whatsappGuests", { value: state.people }),
    t("whatsappHotels", { value: hotelBreakdown || "—" }),
    t("whatsappVehicle", {
      value: state.noDriverNeeded
        ? t("noDriver")
        : state.airportTransferOnly
        ? t("airportTransferOnly")
        : `${vehicle?.label ?? "—"} (${vehicle?.capacity ?? "—"})`,
    }),
    t("whatsappTravelGuide", {
      value: state.guideNeeded
        ? t("whatsappGuideValue", { type: guideType, language: guideLanguage })
        : t("notNeeded"),
    }),
    t("whatsappConfirmQuote"),
  ].filter(Boolean).join(" ");

  const waNum = process.env.NEXT_PUBLIC_WA_PHONE?.replace(/[^\d+]/g, "") ?? "";
  const waHref = `https://wa.me/${waNum}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div>
      <Kicker>{t("kicker")}</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        {t("heading")}
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        {t("sub")}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-8 lg:gap-10 mb-10 items-start">
      <div className="bg-cream-warm border border-rule rounded-xl p-6">
        <h3 className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
          {t("bookingSummary")}
        </h3>
        <Row label={t("destinations")} value={destLabels || "—"} />
        {destinationBreakdown && (
          <Row label={t("destinationDays")} value={destinationBreakdown} />
        )}
        <Row label={t("startDate")} value={formatDate(state.startDate, locale)} />
        <Row label={t("finishDate")} value={formatDate(state.endDate, locale)} />
        <Row label={t("duration")} value={duration} />
        <Row label={t("guests")} value={`${state.people} ${state.people === 1 ? t("person") : t("people")}`} />
        <Row label={t("hotels")} value={hotelBreakdown || "—"} />
        <Row
          label={t("vehicle")}
          value={
            state.noDriverNeeded
              ? t("noDriver")
              : state.airportTransferOnly
              ? t("airportTransferOnly")
              : vehicle
              ? `${vehicle.label} · ${vehicle.capacity}`
              : "—"
          }
        />
        <Row
          label={t("travelGuide")}
          value={
            state.guideNeeded
              ? `${guideType} · ${guideLanguage}`
              : t("notNeeded")
          }
        />
      </div>

        <div className="bg-cream border border-rule rounded-xl p-6 lg:sticky lg:top-24">
          <h3 className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mb-4">
            {t("tripMap")}
          </h3>
          <TripMapSVG
            destinations={state.destinations}
            destinationDays={state.destinationDays ?? {}}
            emptyLabel={t("tripMapEmpty")}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "transparent", color: "#1f1a14", fontWeight: 400, border: "1.5px solid #c99a3f" }}
        >
          {t("back")}
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onConfirm}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "#0b1a2e", color: "#c99a3f", fontWeight: 600, border: "none", textDecoration: "none" }}
        >
          {t("confirm")}
        </a>
      </div>
    </div>
  );
}
