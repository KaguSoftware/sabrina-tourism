"use client";
import { useState } from "react";
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
  const [raw, setRaw] = useState(String(state.people));

  function setPeople(next: number) {
    const clamped = Math.min(Math.max(next, 1), 99);
    onChange({ people: clamped });
    setRaw(String(clamped));
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
            value={raw}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") { setRaw(""); return; }
              const n = parseInt(val, 10);
              if (!isNaN(n) && n <= 99) { setRaw(val); onChange({ people: Math.max(n, 1) }); }
            }}
            onBlur={() => {
              const n = parseInt(raw, 10);
              setPeople(isNaN(n) || n < 1 ? 1 : n);
            }}
            className="font-display font-light text-[96px] leading-none text-navy tracking-tight text-center bg-transparent outline-none w-48 border-2 border-ochre/40 rounded-xl px-2 focus:border-ochre transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

        {state.people === 1 && (
          <label className="mt-6 flex items-center gap-3 bg-cream-warm border border-rule rounded-xl px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.singleRoom}
              onChange={(e) => onChange({ singleRoom: e.target.checked })}
              className="accent-ochre w-4 h-4"
            />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">
              {t("singleRoomOccupancy")}
            </span>
          </label>
        )}

        <div className="mt-6 w-full max-w-sm flex flex-col items-stretch gap-2">
          {state.children.map((child, idx) => (
            <div
              key={child.id}
              className="flex items-center gap-3 bg-cream-warm border border-rule rounded-xl px-4 py-2"
            >
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">
                {t("childAge")}
              </span>
              <input
                type="number"
                min={0}
                max={17}
                value={child.age}
                onChange={(e) => {
                  const nextChildren = state.children.map((c, i) =>
                    i === idx ? { ...c, age: e.target.value } : c
                  );
                  onChange({ children: nextChildren });
                }}
                className="flex-1 bg-transparent outline-none border border-ochre/40 rounded-md px-2 py-1 text-ink font-mono text-sm focus:border-ochre transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => {
                  onChange({ children: state.children.filter((_, i) => i !== idx) });
                }}
                aria-label={t("removeChild")}
                className="w-7 h-7 flex items-center justify-center text-ink hover:text-ochre transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange({
                children: [
                  ...state.children,
                  { id: crypto.randomUUID(), age: "" },
                ],
              });
            }}
            className="mt-2 font-mono text-[11px] tracking-[0.22em] uppercase text-ink border border-ochre rounded-xl px-4 py-2 hover:bg-navy hover:text-ochre transition-colors duration-200"
          >
            {t("addChildren")}
          </button>
        </div>
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
