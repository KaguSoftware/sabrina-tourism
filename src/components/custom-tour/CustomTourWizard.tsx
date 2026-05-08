"use client";

import { useEffect, useRef, useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { Step1Destination } from "./Step1Destination";
import { Step2People } from "./Step2People";
import { Step4Vehicle } from "./Step4Vehicle";
import { Step5Review } from "./Step5Review";
import { CUSTOM_TOUR_DRAFT_KEY, INITIAL_STATE } from "./types";
import type { CustomTourState } from "./types";
import type { Vehicle } from "@/lib/transport/types";

interface Props {
  vehicles: Vehicle[];
}

export function CustomTourWizard({ vehicles }: Props) {
  const wizardHeaderRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CustomTourState>(INITIAL_STATE);

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
    window.sessionStorage.setItem(CUSTOM_TOUR_DRAFT_KEY, JSON.stringify(state));
  }, [state]);

  function patch(update: Partial<CustomTourState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, 3));
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
          <Step4Vehicle state={state} onChange={patch} onNext={next} onBack={back} vehicles={vehicles} />
        )}
        {step === 3 && (
          <Step5Review state={state} onBack={back} onConfirm={() => {}} vehicles={vehicles} />
        )}
      </div>
    </section>
  );
}
