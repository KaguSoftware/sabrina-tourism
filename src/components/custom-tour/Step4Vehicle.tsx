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
          disabled={!canProceed}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: canProceed ? "pointer" : "not-allowed", transition: "background 0.2s, color 0.2s", backgroundColor: canProceed ? "#0b1a2e" : "transparent", color: canProceed ? "#c99a3f" : "#999", fontWeight: 600, border: canProceed ? "none" : "1.5px solid #c99a3f" }}
        >
          Review →
        </button>
      </div>
    </div>
  );
}
