"use client";
import { useTranslations } from "next-intl";
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

function parseMaxCapacity(v: Vehicle): number {
  const m = v.capacity.match(/(\d+)\s*(?:–|-)\s*(\d+)/);
  return m ? parseInt(m[2], 10) : Infinity;
}

export function Step4Vehicle({ state, onChange, onNext, onBack, vehicles }: Props) {
  const t = useTranslations("customTour.step4");
  const guideType = state.guideType ?? "assistant";
  const guideLanguage = state.guideLanguage ?? "English";
  const selections = state.vehicleSelections ?? {};

  const largestCapacity = Math.max(...vehicles.map(parseMaxCapacity).filter(isFinite));
  const isLargeGroup = !state.noDriverNeeded && state.people > largestCapacity;

  // In large-group mode: total seated = sum of (count × capacity)
  const totalSeated = isLargeGroup
    ? vehicles.reduce((sum, v) => sum + (selections[v.id] ?? 0) * parseMaxCapacity(v), 0)
    : 0;
  const seatsCovered = isLargeGroup ? totalSeated >= state.people : false;

  // In single-vehicle mode: exactly one vehicle must be selected with count ≥ 1
  const singleSelected = !isLargeGroup
    ? vehicles.find((v) => (selections[v.id] ?? 0) >= 1) ?? null
    : null;

  const canProceed = state.noDriverNeeded || (isLargeGroup ? seatsCovered : singleSelected !== null);

  function setCount(vehicleId: string, delta: number) {
    const current = selections[vehicleId] ?? 0;
    const next = Math.max(0, current + delta);
    const updated = { ...selections };
    if (next === 0) {
      delete updated[vehicleId];
    } else {
      updated[vehicleId] = next;
    }
    onChange({ vehicleSelections: updated });
  }

  function selectSingle(vehicleId: string) {
    // In normal mode clicking a card toggles it exclusively
    const already = (selections[vehicleId] ?? 0) >= 1;
    onChange({ vehicleSelections: already ? {} : { [vehicleId]: 1 } });
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

      <label className="mb-6 flex max-w-[760px] items-start gap-3 bg-cream-warm border border-rule p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={state.noDriverNeeded}
          onChange={(e) =>
            onChange({
              noDriverNeeded: e.target.checked,
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

      {isLargeGroup && (
        <div className="mb-6 max-w-[760px] bg-amber-50 border border-ochre/50 rounded-xl px-5 py-4">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre mb-1">
            {t("largeGroupNotice", { n: largestCapacity })}
          </p>
          <p className="text-[13px] text-ink-soft leading-normal">
            {t("largeGroupHint")}
          </p>
        </div>
      )}

      {/* Vehicle cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-w-[760px]">
        {vehicles.map((v) => {
          const cap = parseMaxCapacity(v);
          const count = selections[v.id] ?? 0;
          const selected = count >= 1;
          const unavailable = state.noDriverNeeded;
          // In single mode, grey out cars that are too small for the group
          const tooSmall = !isLargeGroup && state.people > cap;

          if (isLargeGroup) {
            // Large-group mode: stepper on each card
            return (
              <div
                key={v.id}
                className={`relative flex flex-col items-center gap-2 px-3 py-4 rounded-xl transition-all duration-300 ${
                  unavailable
                    ? "opacity-45 cursor-not-allowed border border-rule bg-cream/55 text-muted"
                    : selected
                    ? "bg-navy border border-ochre text-ochre shadow-[0_8px_28px_-6px_rgba(201,154,63,0.4)]"
                    : "bg-cream-warm border border-rule text-ink"
                }`}
              >
                <FleetIllustration vehicleId={v.id} className="w-full h-14" selected={selected} variant="custom" />
                <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
                <span className={`font-mono text-[10px] tracking-[0.18em] uppercase ${selected ? "text-cream" : "text-ochre"}`}>
                  {t("from", { price: v.from })}
                </span>
                <span className={`text-[11px] text-center leading-tight ${selected ? "text-cream/70" : "text-muted"}`}>
                  {v.capacity}
                </span>
                {/* Stepper */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    disabled={unavailable || count === 0}
                    onClick={() => setCount(v.id, -1)}
                    className="w-7 h-7 flex items-center justify-center border border-ochre/60 rounded text-sm hover:bg-ochre/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Remove one ${v.label}`}
                  >
                    −
                  </button>
                  <span className={`w-5 text-center font-mono text-[14px] font-semibold ${selected ? "text-ochre" : "text-muted"}`}>
                    {count}
                  </span>
                  <button
                    type="button"
                    disabled={unavailable}
                    onClick={() => setCount(v.id, 1)}
                    className="w-7 h-7 flex items-center justify-center border border-ochre/60 rounded text-sm hover:bg-ochre/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Add one ${v.label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          }

          // Normal single-select mode
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => !unavailable && !tooSmall && selectSingle(v.id)}
              disabled={unavailable || tooSmall}
              aria-pressed={selected}
              title={tooSmall ? t("fitsUpTo", { n: cap }) : undefined}
              className={`relative flex flex-col items-center gap-2 px-3 py-4 border rounded-xl transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.75 before:rounded-t-xl before:transition-opacity before:duration-300 ${
                unavailable || tooSmall
                  ? "opacity-45 cursor-not-allowed border-rule bg-cream/55 text-muted before:opacity-0"
                  : selected
                  ? "bg-navy border-ochre text-ochre ring-[1px] ring-ochre ring-offset-0 shadow-[0_8px_28px_-6px_rgba(201,154,63,0.5)] motion-safe:scale-[1.02] before:bg-ochre before:opacity-100"
                  : "bg-cream-warm border-rule text-ink hover:border-ochre before:opacity-0"
              }`}
            >
              {selected && (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ochre motion-safe:animate-pulse"
                />
              )}
              <FleetIllustration vehicleId={v.id} className="w-full h-14" selected={selected} variant="custom" />
              <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
              <span className={`font-mono text-[10px] tracking-[0.18em] uppercase ${selected ? "text-cream" : "text-ochre"}`}>
                {t("from", { price: v.from })}
              </span>
              <span className={`text-[11px] text-center leading-tight ${selected ? "text-cream/70" : "text-muted"}`}>
                {v.capacity}
              </span>
              {tooSmall && (
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-terracotta">
                  {t("tooSmall")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Seat coverage bar — large group mode */}
      {isLargeGroup && !state.noDriverNeeded && (
        <div className="mb-10 max-w-[760px]">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
              {t("seatCoverage")}
            </span>
            <span className={`font-mono text-[12px] font-semibold ${seatsCovered ? "text-emerald-600" : "text-terracotta"}`}>
              {totalSeated} / {state.people}
            </span>
          </div>
          <div className="h-2 bg-rule rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${seatsCovered ? "bg-emerald-500" : "bg-ochre"}`}
              style={{ width: `${Math.min(100, (totalSeated / state.people) * 100)}%` }}
            />
          </div>
          {!seatsCovered && totalSeated > 0 && (
            <p className="mt-1 text-[12px] text-terracotta">
              {t("seatsShort", { n: state.people - totalSeated })}
            </p>
          )}
          {seatsCovered && (
            <p className="mt-1 text-[12px] text-emerald-600">
              {t("seatsCoveredOk")}
            </p>
          )}
        </div>
      )}

      {/* Selected vehicle info — normal mode */}
      {singleSelected && !state.noDriverNeeded && (
        <div className="mb-10 p-4 bg-cream-warm border-l-2 border-ochre max-w-120">
          <p className="font-mono text-[12px] tracking-[0.14em] text-ink-soft leading-[1.6]">
            <span className="text-ink font-semibold">{singleSelected.label}</span> · {singleSelected.capacity} · {singleSelected.note} · {t("from", { price: singleSelected.from })}
          </p>
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
              {t("addGuide")}
            </span>
            <span className="text-[13px] leading-normal text-ink-soft">
              {t("guideHint")}
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
              {t("guideType")}
            </span>
            <select
              value={guideType}
              onChange={(e) =>
                onChange({ guideType: e.target.value as CustomTourState["guideType"] })
              }
              disabled={!state.guideNeeded}
              className="h-11 border border-rule bg-cream px-3 font-mono text-[12px] tracking-[0.12em] uppercase text-ink disabled:cursor-not-allowed"
            >
              <option value="assistant">{t("guideAssistant")}</option>
              <option value="certified guide">{t("guideCertified")}</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
              {t("language")}
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

      <p
        style={{ backgroundColor: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" }}
        className="mb-10 max-w-[760px] border px-4 py-3 font-mono text-[11px] tracking-[0.12em] leading-[1.6]"
      >
        {t("driverHours")}
      </p>

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
