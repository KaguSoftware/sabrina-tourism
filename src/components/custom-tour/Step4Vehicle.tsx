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

const GUIDE_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Arabic",
  "Chinese",
  "Russian",
  "Portuguese",
  "Japanese",
];

export function Step4Vehicle({ state, onChange, onNext, onBack, vehicles }: Props) {
  const canProceed = state.noDriverNeeded || !!state.vehicleId;
  const guideType = state.guideType ?? "assistant";
  const guideLanguage = state.guideLanguage ?? "English";

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

      <label className="mb-6 flex max-w-[760px] items-start gap-3 bg-cream-warm border border-rule p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={state.noDriverNeeded}
          onChange={(e) =>
            onChange({
              noDriverNeeded: e.target.checked,
              vehicleId: e.target.checked ? null : state.vehicleId,
            })
          }
          className="mt-1 h-4 w-4 accent-ochre"
        />
        <span className="flex flex-col gap-1">
          <span className="font-mono text-[12px] tracking-[0.16em] uppercase text-ink">
            No driver needed
          </span>
          <span className="text-[13px] leading-[1.5] text-ink-soft">
            Skip vehicle selection if you already have transport arranged.
          </span>
        </span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-[760px]">
        {vehicles.map((v) => {
          const selected = state.vehicleId === v.id;
          const overCapacity = state.people > maxCapacity(v);
          const unavailable = state.noDriverNeeded || overCapacity;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => !unavailable && onChange({ vehicleId: v.id })}
              disabled={unavailable}
              title={
                state.noDriverNeeded
                  ? "No driver needed"
                  : overCapacity
                  ? `Fits up to ${maxCapacity(v)} passengers`
                  : undefined
              }
              className={`flex flex-col items-center gap-2 px-3 py-4 border rounded-xl transition-all duration-200 ${
                unavailable
                  ? "opacity-45 cursor-not-allowed border-rule bg-cream/55 text-muted"
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

      {state.vehicleId && !state.noDriverNeeded && (
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

      <div className="mb-12 max-w-[760px] bg-cream-warm border border-rule p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.guideNeeded}
            onChange={(e) => onChange({ guideNeeded: e.target.checked })}
            className="mt-1 h-4 w-4 accent-ochre"
          />
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase text-ink">
              Add a travel guide
            </span>
            <span className="text-[13px] leading-[1.5] text-ink-soft">
              Choose support level and preferred language for your itinerary.
            </span>
          </span>
        </label>

        <div
          className={`mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-200 ${
            state.guideNeeded ? "opacity-100" : "opacity-45"
          }`}
        >
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
              Guide type
            </span>
            <select
              value={guideType}
              onChange={(e) =>
                onChange({
                  guideType: e.target.value as CustomTourState["guideType"],
                })
              }
              disabled={!state.guideNeeded}
              className="h-11 border border-rule bg-cream px-3 font-mono text-[12px] tracking-[0.12em] uppercase text-ink disabled:cursor-not-allowed"
            >
              <option value="assistant">Assistant</option>
              <option value="certified guide">Certified guide</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
              Language
            </span>
            <select
              value={guideLanguage}
              onChange={(e) => onChange({ guideLanguage: e.target.value })}
              disabled={!state.guideNeeded}
              className="h-11 border border-rule bg-cream px-3 font-mono text-[12px] tracking-[0.12em] uppercase text-ink disabled:cursor-not-allowed"
            >
              {GUIDE_LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>
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
          disabled={!canProceed}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: canProceed ? "pointer" : "not-allowed", transition: "background 0.2s, color 0.2s", backgroundColor: canProceed ? "#0b1a2e" : "transparent", color: canProceed ? "#c99a3f" : "#999", fontWeight: 600, border: canProceed ? "none" : "1.5px solid #c99a3f" }}
        >
          Review →
        </button>
      </div>
    </div>
  );
}
