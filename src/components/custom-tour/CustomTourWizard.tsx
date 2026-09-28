"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { Step1Destination } from "./Step1Destination";
import { Step2People } from "./Step2People";
import { Step3Hotels } from "./Step3Hotels";
import { Step4Vehicle } from "./Step4Vehicle";
import { Step5Review } from "./Step5Review";
import { CUSTOM_TOUR_DRAFT_KEY, INITIAL_STATE } from "./types";
import type { CustomTourState } from "./types";
import type { Airport, Vehicle } from "@/lib/transport/types";
import type { HotelPublic } from "@/lib/db/hotels";

interface Props {
  airports: Airport[];
  vehicles: Vehicle[];
  hotelsByRegion: Record<string, HotelPublic[]>;
}

export function CustomTourWizard({ airports, vehicles, hotelsByRegion }: Props) {
  const t = useTranslations("customTour");
  const wizardHeaderRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CustomTourState>(INITIAL_STATE);
  // Bumped on reset so the step components remount and drop any local state.
  const [resetCount, setResetCount] = useState(0);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const hasProgress = step > 0 || JSON.stringify(state) !== JSON.stringify(INITIAL_STATE);

  function scrollWizardHeaderIntoView() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const header = wizardHeaderRef.current;
        if (!header) return;

        const top = header.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    });
  }

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CUSTOM_TOUR_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { step?: number; state?: CustomTourState };
        if (parsed.state) setState({ ...INITIAL_STATE, ...parsed.state });
        if (typeof parsed.step === "number") setStep(parsed.step);
      }
    } catch {
      // ignore corrupt draft
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_TOUR_DRAFT_KEY, JSON.stringify({ step, state }));
  }, [step, state]);

  function patch(update: Partial<CustomTourState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, 4));
    scrollWizardHeaderIntoView();
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    scrollWizardHeaderIntoView();
  }

  function resetTrip() {
    window.localStorage.removeItem(CUSTOM_TOUR_DRAFT_KEY);
    setState(INITIAL_STATE);
    setStep(0);
    setResetCount((n) => n + 1);
    setConfirmingReset(false);
    scrollWizardHeaderIntoView();
  }

  useEffect(() => {
    if (!confirmingReset) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirmingReset(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmingReset]);

  return (
    <section id="custom-tour-wizard" className="relative z-10 min-h-screen px-[clamp(20px,4vw,56px)] py-[clamp(60px,8vw,100px)]">
      <div
        ref={wizardHeaderRef}
        className={`relative z-10 mx-auto ${step === 2 || step === 3 ? "max-w-[1320px]" : "max-w-[1040px]"}`}
      >
        <div className="flex justify-end mb-4 min-h-9">
          {hasProgress && (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="inline-flex items-center gap-2 border border-rule px-3.5 py-2 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft hover:border-terracotta hover:text-terracotta transition-colors duration-200"
            >
              <RotateCcw size={13} strokeWidth={1.8} aria-hidden />
              {t("startOver")}
            </button>
          )}
        </div>

        <StepIndicator current={step} />

        <div key={resetCount}>
          {step === 0 && (
            <Step1Destination state={state} onChange={patch} onNext={next} />
          )}
          {step === 1 && (
            <Step2People state={state} onChange={patch} onNext={next} onBack={back} />
          )}
          {step === 2 && (
            <Step3Hotels state={state} onChange={patch} onNext={next} onBack={back} hotelsByRegion={hotelsByRegion} />
          )}
          {step === 3 && (
            <Step4Vehicle state={state} onChange={patch} onNext={next} onBack={back} airports={airports} vehicles={vehicles} />
          )}
          {step === 4 && (
            <Step5Review state={state} onBack={back} onConfirm={resetTrip} vehicles={vehicles} hotelsByRegion={hotelsByRegion} />
          )}
        </div>
      </div>

      {confirmingReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
          onClick={() => setConfirmingReset(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="discard-trip-title"
            aria-describedby="discard-trip-body"
            className="bg-cream border border-rule p-8 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="discard-trip-title" className="font-display text-[24px] leading-tight tracking-tight text-ink mb-3">
              {t("discardTitle")}
            </p>
            <p id="discard-trip-body" className="text-[14px] text-ink-soft leading-[1.6] mb-8">
              {t("discardBody")}
            </p>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmingReset(false)}
                className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft hover:text-ink transition-colors"
              >
                {t("keepEditing")}
              </button>
              <button
                type="button"
                onClick={resetTrip}
                className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase border border-terracotta/50 text-terracotta hover:bg-terracotta hover:text-cream transition-colors duration-200"
              >
                {t("discardConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
