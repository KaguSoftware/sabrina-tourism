"use client";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { DESTINATIONS, SAMPLE_HOTELS } from "./types";
import type { CustomTourState } from "./types";
import type { Vehicle } from "@/lib/transport/types";

interface Props {
  state: CustomTourState;
  onBack: () => void;
  onConfirm: () => void;
  vehicles: Vehicle[];
}

function formatDate(s: string) {
  if (!s) return "—";
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
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

export function Step5Review({ state, onBack, onConfirm, vehicles }: Props) {
  const destLabels = state.destinations
    .map((id) => DESTINATIONS.find((d) => d.id === id)?.label ?? id)
    .join(", ");

  const hotel = SAMPLE_HOTELS.find((h) => h.id === state.hotelId);
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
    return `${diff} night${diff !== 1 ? "s" : ""}`;
  })();

  const whatsappMessage = [
    "Hey Sabrina — I'd like to book a custom tour package.",
    `Destinations: ${destLabels}.`,
    `Dates: ${formatDate(state.startDate)} to ${formatDate(state.endDate)} (${duration}).`,
    `Guests: ${state.people}.`,
    `Hotel: ${hotel?.name ?? "—"} (${hotel?.location ?? "—"}).`,
    `Vehicle: ${
      state.noDriverNeeded
        ? "No driver needed"
        : `${vehicle?.label ?? "—"} (${vehicle?.capacity ?? "—"})`
    }.`,
    `Travel guide: ${
      state.guideNeeded
        ? `${guideType} in ${guideLanguage}`
        : "Not needed"
    }.`,
    "Could you confirm availability and provide a quote?",
  ].join(" ");

  const waNum = process.env.NEXT_PUBLIC_WA_PHONE?.replace(/[^\d+]/g, "") ?? "";
  const waHref = `https://wa.me/${waNum}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div>
      <Kicker>Step 5 of 5</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        Review Your Itinerary
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        Everything looks good? Hit confirm to send your request directly to our team via WhatsApp.
      </p>

      <div className="max-w-[600px] bg-cream-warm border border-rule rounded-xl p-6 mb-10">
        <h3 className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
          Booking Summary
        </h3>
        <Row label="Destinations" value={destLabels || "—"} />
        <Row label="Start Date" value={formatDate(state.startDate)} />
        <Row label="Finish Date" value={formatDate(state.endDate)} />
        <Row label="Duration" value={duration} />
        <Row label="Guests" value={`${state.people} ${state.people === 1 ? "person" : "people"}`} />
        <Row label="Hotel" value={hotel ? `${hotel.name}, ${hotel.location}` : "—"} />
        <Row
          label="Vehicle"
          value={
            state.noDriverNeeded
              ? "No driver needed"
              : vehicle
              ? `${vehicle.label} · ${vehicle.capacity}`
              : "—"
          }
        />
        <Row
          label="Travel Guide"
          value={
            state.guideNeeded
              ? `${guideType} · ${guideLanguage}`
              : "Not needed"
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "transparent", color: "#1f1a14", fontWeight: 400, border: "1.5px solid #c99a3f" }}
        >
          ← Back
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onConfirm}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "#0b1a2e", color: "#c99a3f", fontWeight: 600, border: "none", textDecoration: "none" }}
        >
          Confirm via WhatsApp →
        </a>
      </div>
    </div>
  );
}
