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

export function Step1Destination({ state, onChange, onNext }: Props) {
  const today = new Date().toISOString().split("T")[0];

  function toggleDestination(id: string) {
    const next = state.destinations.includes(id)
      ? state.destinations.filter((d) => d !== id)
      : [...state.destinations, id];
    onChange({ destinations: next });
  }

  const canProceed = state.startDate && state.endDate && state.destinations.length > 0;

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
              className={`group relative overflow-hidden rounded-xl aspect-[4/3] transition-all duration-300 ${
                selected
                  ? "ring-3 ring-ochre shadow-[0_0_0_3px_#c99a3f]"
                  : "ring-1 ring-transparent hover:ring-ochre/50"
              }`}
            >
              <Image
                src={dest.image}
                alt={dest.label}
                fill
                className={`object-cover transition-transform duration-500 ${
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
            </button>
          );
        })}
      </div>

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
            {!state.startDate || !state.endDate ? "Select both dates" : "Select at least one destination"}
          </p>
        )}
      </div>
    </div>
  );
}
