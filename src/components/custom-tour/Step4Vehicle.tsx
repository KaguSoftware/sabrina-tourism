"use client";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import type { CustomTourState } from "./types";
import type { Vehicle } from "@/lib/transport/types";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
  onBack: () => void;
  vehicles: Vehicle[];
}

export function Step4Vehicle({ state, onChange, onNext, onBack, vehicles }: Props) {
  const canProceed = !!state.vehicleId;

  function maxCapacity(v: Vehicle) {
    const m = v.capacity.match(/(\d+)\s*(?:–|-)\s*(\d+)/);
    return m ? parseInt(m[2], 10) : Infinity;
  }

  return (
    <div>
      <Kicker>Step 4 of 5</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        Chauffeur &amp; Vehicle
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        Choose your preferred vehicle class. All options include a licensed, English-speaking chauffeur.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-[760px]">
        {vehicles.map((v) => {
          const selected = state.vehicleId === v.id;
          const overCapacity = state.people > maxCapacity(v);
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => !overCapacity && onChange({ vehicleId: v.id })}
              disabled={overCapacity}
              title={overCapacity ? `Fits up to ${maxCapacity(v)} passengers` : undefined}
              className={`flex flex-col items-center gap-2 px-3 py-4 border rounded-xl transition-all duration-200 ${
                overCapacity
                  ? "opacity-40 cursor-not-allowed border-rule bg-cream-warm text-muted"
                  : selected
                  ? "bg-navy border-navy text-ochre ring-2 ring-ochre"
                  : "bg-cream-warm border-rule text-ink hover:border-ochre"
              }`}
            >
              <FleetIllustration vehicleId={v.id} className="w-full h-14" />
              <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ochre">{v.from}</span>
              <span className="text-[11px] text-muted text-center leading-tight">{v.capacity}</span>
              {overCapacity && (
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-terracotta">
                  Too small
                </span>
              )}
            </button>
          );
        })}
      </div>

      {state.vehicleId && (
        <div className="mb-10 p-4 bg-cream-warm border-l-2 border-ochre max-w-[480px]">
          {(() => {
            const v = vehicles.find((x) => x.id === state.vehicleId);
            return v ? (
              <p className="font-mono text-[12px] tracking-[0.14em] text-ink-soft leading-[1.6]">
                <span className="text-ink font-semibold">{v.label}</span> · {v.capacity} · {v.note} · From {v.from}
              </p>
            ) : null;
          })()}
        </div>
      )}

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
          <span>Review</span>
          <span className={`transition-transform duration-200 ${canProceed ? "group-hover:translate-x-1" : ""}`}>→</span>
        </button>
      </div>
    </div>
  );
}
