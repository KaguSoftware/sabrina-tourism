"use client";
import Image from "next/image";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { DESTINATIONS } from "./types";
import type { CustomTourState } from "./types";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
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

function getSelectedTripDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return null;

  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return diff >= 0 ? diff + 1 : null;
}

export function Step1Destination({ state, onChange, onNext }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const needsDestinationDays = state.destinations.length > 1;
  const selectedTripDays = getSelectedTripDays(state.startDate, state.endDate);
  const destinationDayTotal = state.destinations.reduce((sum, id) => {
    const days = parseInt((state.destinationDays ?? {})[id] ?? "", 10);
    return sum + (Number.isFinite(days) ? days : 0);
  }, 0);
  const destinationDaysOver =
    needsDestinationDays &&
    selectedTripDays !== null &&
    destinationDayTotal > selectedTripDays;
  const destinationDaysUnder =
    needsDestinationDays &&
    selectedTripDays !== null &&
    destinationDayTotal > 0 &&
    destinationDayTotal < selectedTripDays;

  function toggleDestination(id: string) {
    const next = state.destinations.includes(id)
      ? state.destinations.filter((d) => d !== id)
      : [...state.destinations, id];
    const destinationDays = Object.fromEntries(
      Object.entries(state.destinationDays ?? {}).filter(([key]) => next.includes(key))
    );
    const hotelIds = Object.fromEntries(
      Object.entries(state.hotelIds ?? {}).filter(([key]) => next.includes(key))
    );

    onChange({ destinations: next, destinationDays, hotelIds });
  }

  function moveDestination(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= state.destinations.length) return;

    const destinations = [...state.destinations];
    [destinations[index], destinations[target]] = [destinations[target], destinations[index]];
    onChange({ destinations });
  }

  function setDestinationDays(id: string, days: string) {
    onChange({
      destinationDays: {
        ...(state.destinationDays ?? {}),
        [id]: days,
      },
    });
  }

  const hasDestinationDays =
    !needsDestinationDays ||
    (state.destinations.every((id) => {
      const days = parseInt((state.destinationDays ?? {})[id] ?? "", 10);
      return Number.isFinite(days) && days > 0;
    }) &&
      selectedTripDays !== null &&
      destinationDayTotal === selectedTripDays);

  const canProceed =
    state.startDate &&
    state.endDate &&
    state.destinations.length > 0 &&
    hasDestinationDays;

  return (
    <div>
      <Kicker>Step 1 of 5</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        Destination &amp; Dates
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        Choose when you&apos;d like to travel and which regions you want to explore.
      </p>

      {/* Date pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-[560px]">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
            Start Date
          </label>
          <DatePicker
            value={state.startDate}
            onChange={(v) => onChange({ startDate: v, endDate: state.endDate && v > state.endDate ? "" : state.endDate })}
            min={today}
            placeholder="Arrival date"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
            Finish Date
          </label>
          <DatePicker
            value={state.endDate}
            onChange={(v) => onChange({ endDate: v })}
            min={state.startDate || today}
            placeholder="Departure date"
          />
        </div>
      </div>

      {/* Destination grid */}
      <h3 className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mb-5">
        Select your destinations <span className="text-terracotta">*</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {DESTINATIONS.map((dest) => {
          const selected = state.destinations.includes(dest.id);
          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => toggleDestination(dest.id)}
              className="group relative aspect-[4/3] text-left focus:outline-none"
            >
              <div
                className={`relative h-full overflow-hidden bg-[#fcf5ec] transition-all duration-380 ease-out shadow-[4px_6px_0_-1px_#1b4d5c] sm:shadow-none group-hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] group-hover:[box-shadow:14px_20px_0_-2px_#1b4d5c] border border-rule ${
                  selected ? "ring-3 ring-ochre shadow-[0_0_0_3px_#c99a3f]" : ""
                }`}
              >
                <Image
                  src={dest.image}
                  alt={dest.label}
                  fill
                  className={`object-cover transition-transform duration-1200 ease-out ${
                    selected ? "scale-105" : "group-hover:scale-105"
                  }`}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    selected ? "bg-navy/50" : "bg-black/30 group-hover:bg-black/20"
                  }`}
                />
                {selected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-ochre flex items-center justify-center">
                    <span className="text-navy text-[12px] font-bold leading-none">✓</span>
                  </div>
                )}
                <span className="absolute bottom-0 left-0 right-0 p-3 font-display text-[clamp(14px,1.6vw,18px)] font-light text-cream leading-tight">
                  {dest.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {needsDestinationDays && (
        <div className="w-full bg-cream-warm border border-rule p-5 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <h3 className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
              Days by destination <span className="text-terracotta">*</span>
            </h3>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
              {selectedTripDays === null
                ? "Select dates first"
                : `${destinationDayTotal}/${selectedTripDays} days assigned`}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {state.destinations.map((id, i) => {
              const destination = DESTINATIONS.find((dest) => dest.id === id);
              return (
                <div
                  key={id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_96px] gap-4 items-center border-b border-rule last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveDestination(i, -1)}
                      disabled={i === 0}
                      className="w-8 h-8 border border-ochre text-ink hover:bg-navy hover:text-ochre transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Move ${destination?.label ?? id} earlier`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDestination(i, 1)}
                      disabled={i === state.destinations.length - 1}
                      className="w-8 h-8 border border-ochre text-ink hover:bg-navy hover:text-ochre transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Move ${destination?.label ?? id} later`}
                    >
                      ↓
                    </button>
                  </div>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre">
                      {ordinal(i + 1)} area
                    </span>
                    <span className="font-display text-[20px] tracking-tight text-ink">
                      {destination?.label ?? id}
                    </span>
                  </span>
                  <label className="flex flex-col gap-1">
                    <span className="sr-only">Days in {destination?.label ?? id}</span>
                    <input
                      type="number"
                      min={1}
                      value={(state.destinationDays ?? {})[id] ?? ""}
                      onChange={(e) => setDestinationDays(id, e.target.value)}
                      placeholder="Days"
                      className="h-11 border border-rule bg-cream px-3 text-center font-mono text-[13px] tracking-[0.12em] uppercase text-ink focus:outline-none focus:border-ochre transition-colors duration-200"
                    />
                  </label>
                </div>
              );
            })}
          </div>
          {(destinationDaysOver || destinationDaysUnder) && (
            <p
              className={`mt-4 border px-4 py-3 font-mono text-[12px] tracking-[0.14em] uppercase ${
                destinationDaysOver
                  ? "border-terracotta bg-terracotta/10 text-terracotta"
                  : "border-ochre bg-ochre/12 text-ink"
              }`}
            >
              {destinationDaysOver
                ? "You've selected fewer travel days than that. Reduce the area days or extend your finish date."
                : `${selectedTripDays - destinationDayTotal} day${
                    selectedTripDays - destinationDayTotal === 1 ? "" : "s"
                  } left to assign.`}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          style={{
            fontFamily: "inherit",
            fontSize: "14px",
            padding: "10px 28px",
            borderRadius: "16px",
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "background 0.2s, color 0.2s",
            backgroundColor: canProceed ? "#0b1a2e" : "transparent",
            color: canProceed ? "#c99a3f" : "#999",
            fontWeight: 600,
            border: canProceed ? "none" : "1.5px solid #c99a3f",
          }}
        >
          Next →
        </button>
        {!canProceed && (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
            {!state.startDate || !state.endDate
              ? "Select both dates"
              : state.destinations.length === 0
              ? "Select at least one destination"
              : selectedTripDays === null
              ? "Select a valid date range"
              : destinationDaysOver
              ? "You've selected fewer travel days than that"
              : `Assign exactly ${selectedTripDays} travel days`}
          </p>
        )}
      </div>
    </div>
  );
}
