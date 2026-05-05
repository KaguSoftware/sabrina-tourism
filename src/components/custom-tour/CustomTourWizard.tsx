"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StepIndicator } from "./StepIndicator";
import { Step1Destination } from "./Step1Destination";
import { Step2People } from "./Step2People";
import { Step3Hotels } from "./Step3Hotels";
import { Step4Vehicle } from "./Step4Vehicle";
import { Step5Review } from "./Step5Review";
import { CUSTOM_TOUR_DRAFT_KEY, INITIAL_STATE } from "./types";
import type { CustomTourState } from "./types";
import type { Vehicle } from "@/lib/transport/types";

interface Props {
  vehicles: Vehicle[];
}

export function CustomTourWizard({ vehicles }: Props) {
  const searchParams = useSearchParams();
  const shouldRestoreHotelsStep = searchParams.get("step") === "hotels";
  const wizardHeaderRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CustomTourState>(INITIAL_STATE);
  const [draftChecked, setDraftChecked] = useState(!shouldRestoreHotelsStep);

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
    if (!shouldRestoreHotelsStep) {
      setDraftChecked(true);
      return;
    }

    try {
      const draft = window.sessionStorage.getItem(CUSTOM_TOUR_DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft) as Partial<CustomTourState>;
        setState({ ...INITIAL_STATE, ...parsed });
      }
    } catch {
      window.sessionStorage.removeItem(CUSTOM_TOUR_DRAFT_KEY);
    }

    setStep(2);
    setDraftChecked(true);
    scrollWizardHeaderIntoView();
  }, [shouldRestoreHotelsStep]);

  useEffect(() => {
    if (!draftChecked) return;

    window.sessionStorage.setItem(CUSTOM_TOUR_DRAFT_KEY, JSON.stringify(state));
  }, [draftChecked, state]);

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

  return (
    <section id="custom-tour-wizard" className="relative z-10 min-h-screen px-[clamp(20px,4vw,56px)] py-[clamp(60px,8vw,100px)]">
      <div ref={wizardHeaderRef} className="relative z-10 max-w-[1040px] mx-auto">
        <StepIndicator current={step} />

        {step === 0 && (
          <Step1Destination state={state} onChange={patch} onNext={next} />
        )}
        {step === 1 && (
          <Step2People state={state} onChange={patch} onNext={next} onBack={back} />
        )}
        {step === 2 && (
          <Step3Hotels state={state} onChange={patch} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <Step4Vehicle state={state} onChange={patch} onNext={next} onBack={back} vehicles={vehicles} />
        )}
        {step === 4 && (
          <Step5Review state={state} onBack={back} onConfirm={() => {}} vehicles={vehicles} />
        )}
      </div>
    </section>
  );
}
