import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({ label, hint, error, children, required }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[11px] tracking-[0.25em] uppercase text-ink-soft font-medium mb-1">
        {label}
        {required && <span className="text-ochre ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="font-sans text-[12px] text-muted">{hint}</p>
      )}
      {error && (
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}
