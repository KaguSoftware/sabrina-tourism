"use client";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("customTour.step2");
  function setPeople(next: number) {
    onChange({ people: Math.min(Math.max(next, 1), 99) });
  }

  return (
    <div>
      <Kicker>{t("kicker")}</Kicker>
      <GoldUnderlineHeading as="h2" className="text-[clamp(28px,3.5vw,44px)] mt-4 mb-3 tracking-tight text-ink">
        {t("heading")}
      </GoldUnderlineHeading>
      <p className="text-ink-soft text-[15px] leading-[1.6] mb-12 max-w-[52ch]">
        {t("sub")}
      </p>

      <div className="flex flex-col items-center mb-14">
        <div className="flex items-center justify-center gap-4">
          <input
            type="number"
            min={1}
            max={99}
            value={state.people}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (!isNaN(n)) setPeople(n);
            }}
            className="font-display font-light text-[96px] leading-none text-navy tracking-tight text-center bg-transparent outline-none w-48 border-2 border-ochre/40 rounded-xl px-2 focus:border-ochre transition-colors duration-200"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setPeople(state.people + 1)}
              className="w-10 h-10 border border-ochre text-ink hover:bg-navy hover:text-ochre transition-colors duration-200 flex items-center justify-center"
              aria-label={t("increaseGuests")}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => setPeople(state.people - 1)}
              className="w-10 h-10 border border-ochre text-ink hover:bg-navy hover:text-ochre transition-colors duration-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={t("decreaseGuests")}
              disabled={state.people <= 1}
            >
              ↓
            </button>
          </div>
        </div>
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted mt-1">
          {state.people === 1 ? t("guest") : t("guests")}
        </span>
      </div>

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
          style={{ fontFamily: "inherit", fontSize: "14px", padding: "10px 28px", borderRadius: "16px", cursor: "pointer", transition: "background 0.2s, color 0.2s", backgroundColor: "#0b1a2e", color: "#c99a3f", fontWeight: 600, border: "none" }}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
