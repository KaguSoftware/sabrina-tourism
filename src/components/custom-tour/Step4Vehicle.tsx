"use client";

import { useTranslations } from "next-intl";
import { AirportForm } from "@/components/transport/TransportationPage/AirportForm";
import { CustomForm } from "@/components/transport/TransportationPage/CustomForm";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import type { GuideType } from "@/components/transport/TransportationPage/guideOptions";
import type { CustomTourState } from "./types";
import type { Airport, Vehicle } from "@/lib/transport/types";

interface Props {
  state: CustomTourState;
  onChange: (patch: Partial<CustomTourState>) => void;
  onNext: () => void;
  onBack: () => void;
  airports: Airport[];
  vehicles: Vehicle[];
}

export function Step4Vehicle({
  state,
  onChange,
  onNext,
  onBack,
  airports,
  vehicles,
}: Props) {
  const t = useTranslations("customTour.step4");
  const selections = state.vehicleSelections ?? {};
  const selectedVehicleId =
    Object.entries(selections).find(([, count]) => count > 0)?.[0] ?? null;

  const canProceed =
    state.noDriverNeeded || state.airportTransferOnly || selectedVehicleId !== null;

  function setVehicleId(vehicleId: string | null) {
    onChange({ vehicleSelections: vehicleId ? { [vehicleId]: 1 } : {} });
  }

  return (
    <div>
      <Kicker>{t("kicker")}</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        {t("heading")}
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-10 max-w-[52ch]">
        {t("sub")}
      </p>

      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <label className="flex items-start gap-3 bg-cream-warm border border-rule p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={state.airportTransferOnly}
            onChange={(e) =>
              onChange({
                airportTransferOnly: e.target.checked,
                noDriverNeeded: e.target.checked ? false : state.noDriverNeeded,
              })
            }
            className="mt-1 h-4 w-4 accent-ochre"
          />
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase text-ink">
              {t("airportTransferOnly")}
            </span>
            <span className="text-[13px] leading-normal text-ink-soft">
              {t("airportTransferOnlyHint")}
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 bg-cream-warm border border-rule p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={state.noDriverNeeded}
            onChange={(e) =>
              onChange({
                noDriverNeeded: e.target.checked,
                airportTransferOnly: e.target.checked ? false : state.airportTransferOnly,
                vehicleSelections: e.target.checked ? {} : selections,
              })
            }
            className="mt-1 h-4 w-4 accent-ochre"
          />
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase text-ink">
              {t("noDriverNeeded")}
            </span>
            <span className="text-[13px] leading-normal text-ink-soft">
              {t("noDriverHint")}
            </span>
          </span>
        </label>
      </div>

      {!state.noDriverNeeded && (
        <div className="mb-12">
          {state.airportTransferOnly ? (
            <AirportForm
              vehicleId={selectedVehicleId}
              setVehicleId={setVehicleId}
              airports={airports}
              vehicles={vehicles}
              initialPassengers={state.people}
              guideNeeded={state.guideNeeded}
              setGuideNeeded={(guideNeeded) => onChange({ guideNeeded })}
              guideType={state.guideType as GuideType}
              setGuideType={(guideType) => onChange({ guideType })}
              guideLanguage={state.guideLanguage}
              setGuideLanguage={(guideLanguage) => onChange({ guideLanguage })}
            />
          ) : (
            <CustomForm
              vehicleId={selectedVehicleId}
              setVehicleId={setVehicleId}
              vehicles={vehicles}
              initialPassengers={state.people}
              guideNeeded={state.guideNeeded}
              setGuideNeeded={(guideNeeded) => onChange({ guideNeeded })}
              guideType={state.guideType as GuideType}
              setGuideType={(guideType) => onChange({ guideType })}
              guideLanguage={state.guideLanguage}
              setGuideLanguage={(guideLanguage) => onChange({ guideLanguage })}
            />
          )}
        </div>
      )}

      {state.noDriverNeeded && (
        <p className="mb-12 max-w-[760px] bg-cream-warm border border-rule px-4 py-3 text-[14px] text-ink-soft leading-[1.6]">
          {t("noDriverHint")}
        </p>
      )}

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "transparent", color: "#1f1a14", fontWeight: 400, border: "1.5px solid #c99a3f" }}
        >
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: canProceed ? "pointer" : "not-allowed", transition: "background 0.2s, color 0.2s", backgroundColor: canProceed ? "#0b1a2e" : "transparent", color: canProceed ? "#c99a3f" : "#999", fontWeight: 600, border: canProceed ? "none" : "1.5px solid #c99a3f" }}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
