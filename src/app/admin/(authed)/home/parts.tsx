"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";

/**
 * Collapsible section card used by the home page editor. Extracted from
 * HomeEditor so each Section body can live in its own file.
 */
export function Section({
  title,
  kicker,
  open,
  onToggle,
  children,
}: {
  title: string;
  kicker: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`border bg-cream-warm ${open ? "border-rule border-l-2 border-l-ochre" : "border-rule"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-cream-deep transition-colors duration-150"
      >
        <div className="space-y-1">
          <Kicker>{kicker}</Kicker>
          <p className="font-display text-[18px] font-semibold tracking-tight text-ink">{title}</p>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-ochre shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-ochre shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-8 pt-2 border-t border-rule space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  return (
    <span className={`font-mono text-[10px] tracking-[0.14em] tabular-nums ${len > max ? "text-terracotta" : "text-muted"}`}>
      {len}/{max}
    </span>
  );
}
