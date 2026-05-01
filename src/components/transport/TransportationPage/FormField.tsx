export function FormField({
  label,
  children,
  hint,
  span,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  span?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2.5 ${span ? "col-span-full" : ""}`}>
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export const fieldCls =
  "bg-transparent border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";

export const selectCls =
  "bg-cream border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";
