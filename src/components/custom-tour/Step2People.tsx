"use client";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import type { CustomTourState } from "./types";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2People({ state, onChange, onNext, onBack }: Props) {
  function adjust(delta: number) {
    const next = Math.max(1, Math.min(20, state.people + delta));
    onChange({ people: next });
  }

  return (
    <div>
      <Kicker>Step 2 of 5</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        Group Size
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-12 max-w-[52ch]">
        How many guests will be joining? We&apos;ll use this to recommend the right vehicle and accommodation options.
      </p>

      <div className="flex items-center gap-6 mb-14">
        <button
          type="button"
          onClick={() => adjust(-1)}
          disabled={state.people <= 1}
          className="w-12 h-12 rounded-full border border-rule flex items-center justify-center font-mono text-[20px] text-ink transition-all duration-200 hover:border-ochre hover:text-ochre disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Decrease"
        >
          −
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="font-display font-light text-[72px] leading-none text-navy tracking-tight">
            {state.people}
          </span>
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
            {state.people === 1 ? "guest" : "guests"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => adjust(1)}
          disabled={state.people >= 20}
          className="w-12 h-12 rounded-full border border-rule flex items-center justify-center font-mono text-[20px] text-ink transition-all duration-200 hover:border-ochre hover:text-ochre disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase"
        >
          +
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2 mb-14">
        {[1, 2, 4, 6, 8, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange({ people: n })}
            className={`px-4 py-2 font-mono text-[12px] tracking-[0.14em] uppercase border transition-all duration-150 ${
              state.people === n
                ? "bg-navy text-ochre border-navy"
                : "border-rule text-ink-soft hover:border-ochre hover:text-ink"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

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
          className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-ochre font-mono text-[13px] tracking-[0.16em] uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] group"
        >
          <span>Next</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}
