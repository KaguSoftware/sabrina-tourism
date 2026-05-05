"use client";
import { useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { Step1Destination } from "./Step1Destination";
import { Step2People } from "./Step2People";
import { Step3Hotels } from "./Step3Hotels";
import { Step4Vehicle } from "./Step4Vehicle";
import { Step5Review } from "./Step5Review";
import { INITIAL_STATE } from "./types";
import type { CustomTourState } from "./types";
import type { Vehicle } from "@/lib/transport/types";

interface Props {
  vehicles: Vehicle[];
}

export function CustomTourWizard({ vehicles }: Props) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CustomTourState>(INITIAL_STATE);

  function patch(update: Partial<CustomTourState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="relative px-[clamp(20px,4vw,56px)] py-[clamp(60px,8vw,100px)]">
      <div className="max-w-[1040px] mx-auto">
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
