"use client";
import Image from "next/image";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { SAMPLE_HOTELS } from "./types";
import type { CustomTourState } from "./types";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
  onBack: () => void;
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#c99a3f" }} className="text-[13px] leading-none">★</span>
      ))}
    </div>
  );
}

export function Step3Hotels({ state, onChange, onNext, onBack }: Props) {
  const canProceed = !!state.hotelId;

  return (
    <div>
      <Kicker>Step 3 of 5</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        Accommodation
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        Select your preferred hotel. Our concierge team will confirm availability and arrange the booking.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12 max-w-[760px]">
        {SAMPLE_HOTELS.map((hotel) => {
          const selected = state.hotelId === hotel.id;
          return (
            <button
              key={hotel.id}
              type="button"
              onClick={() => onChange({ hotelId: hotel.id })}
              className={`group text-left overflow-hidden rounded-xl border transition-all duration-300 ${
                selected
                  ? "border-ochre ring-2 ring-ochre shadow-[0_4px_24px_-4px_rgba(201,154,63,0.3)]"
                  : "border-rule hover:border-ochre/60"
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {selected && (
                  <div className="absolute inset-0 bg-navy/30" />
                )}
                {selected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-ochre flex items-center justify-center">
                    <span className="text-navy text-[13px] font-bold leading-none">✓</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-normal text-[18px] tracking-tight text-ink leading-tight">
                    {hotel.name}
                  </h3>
                  <StarRow count={hotel.stars} />
                </div>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ochre mb-2">
                  {hotel.location}
                </p>
                <p className="text-ink-soft text-[13px] leading-[1.5]">
                  {hotel.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted mb-10">
        More hotels available on request — our team will tailor options to your itinerary.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-4 font-mono text-[13px] tracking-[0.16em] uppercase border border-rule text-ink-soft hover:border-ink transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`inline-flex items-center gap-3 px-8 py-4 font-mono text-[13px] tracking-[0.16em] uppercase transition-all duration-200 group ${
            canProceed
              ? "bg-navy text-ochre hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
              : "bg-cream-warm text-muted border border-rule cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <span className={`transition-transform duration-200 ${canProceed ? "group-hover:translate-x-1" : ""}`}>→</span>
        </button>
      </div>
    </div>
  );
}
