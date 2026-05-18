"use client";
import { InfoTooltip } from "@/components/primitives/InfoTooltip/InfoTooltip";

export const fieldCls =
  "bg-cream border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";
export const selectCls =
  "bg-cream border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";

export function TransportFormField({
  label,
  children,
  hint,
  hintError,
  span,
  above,
  tooltip,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  hintError?: string;
  span?: boolean;
  above?: boolean;
  tooltip?: string;
}) {
  return (
    <label className={`flex flex-col gap-2.5 ${span ? "col-span-full" : ""} ${above ? "relative z-8" : ""}`}>
      <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </span>
      {children}
      {hintError && <span className="text-[12px] text-terracotta">{hintError}</span>}
      {hint && !hintError && <span className="text-[12px] text-muted">{hint}</span>}
    </label>
  );
}
