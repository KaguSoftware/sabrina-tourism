"use client";

const STEPS = [
  "Destination & Dates",
  "No. of Guests",
  "Chauffeur",
  "Review",
];

interface StepIndicatorProps {
  current: number;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="mb-14 overflow-x-auto pb-2 px-1">
      <div className="mx-auto flex w-max items-center gap-0">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5 pt-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[12px] tracking-[0.12em] transition-all duration-300 ${
                    done
                      ? "bg-ochre text-navy"
                      : active
                      ? "bg-navy text-ochre outline-2 outline-offset-2 outline-ochre"
                      : "bg-transparent border-2 border-ink/25 text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-200 ${
                    active ? "text-ink" : done ? "text-ochre" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-10 sm:w-16 h-px mx-2 mt-[-14px] transition-colors duration-300 flex-shrink-0 ${
                    done ? "bg-ochre" : "bg-rule"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
