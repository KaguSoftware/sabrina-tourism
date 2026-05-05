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

const GUEST_OPTIONS = [1, 2, 4, 6, 8, 10];

export function Step2People({ state, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <Kicker>Step 2 of 5</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        Number of Guests
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-12 max-w-[52ch]">
        How many guests will be joining? We&apos;ll use this to recommend the right vehicle and accommodation options.
      </p>

      {/* Big editable number */}
      <div className="flex flex-col items-center mb-10">
        <input
          type="number"
          min={1}
          max={99}
          value={state.people}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n) && n >= 1 && n <= 99) onChange({ people: n });
          }}
          className="font-display font-light text-[96px] leading-none text-navy tracking-tight text-center bg-transparent outline-none w-48 border-2 border-ochre/40 rounded-xl px-2 focus:border-ochre transition-colors duration-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mt-1">
          {state.people === 1 ? "guest" : "guests"}
        </span>
      </div>

      {/* Pill grid — same style as FilterBar */}
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {GUEST_OPTIONS.map((n) => {
          const active = state.people === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ people: n })}
              style={{
                fontFamily: "inherit",
                fontSize: "14px",
                padding: "10px 20px",
                borderRadius: "16px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s, color 0.2s",
                backgroundColor: active ? "#0b1a2e" : "transparent",
                color: active ? "#c99a3f" : "#1f1a14",
                fontWeight: active ? 600 : 400,
                border: active ? "none" : "1.5px solid #c99a3f",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "transparent", color: "#1f1a14", fontWeight: 400, border: "1.5px solid #c99a3f" }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "#0b1a2e", color: "#c99a3f", fontWeight: 600, border: "none" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
