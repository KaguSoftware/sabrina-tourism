"use client";

import { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import { INCLUSION_ICONS, getInclusionIcon } from "@/lib/icons/inclusion-icons";

interface Props {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  size?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_REGISTRY = LucideIcons as unknown as Record<string, any>;

function renderLucide(lucideName: string, size = 16) {
  const Cmp = ICON_REGISTRY[lucideName];
  if (!Cmp) return null;
  return <Cmp size={size} />;
}

export function InclusionIconPicker({ value, onChange, size = 16 }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getInclusionIcon(value);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 border border-rule bg-cream hover:bg-cream-deep transition-colors rounded-sm text-ink-soft"
        title={current?.label ?? "Pick icon"}
        aria-label={current?.label ?? "Pick icon"}
      >
        {current ? renderLucide(current.lucide, size) : <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted">Icon</span>}
      </button>

      {open && (
        <div
          className="absolute z-50 top-[calc(100%+6px)] left-0 w-[280px] bg-cream border border-rule shadow-xl p-3 rounded-sm"
          style={{ background: "#f5ede0" }}
        >
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className={`flex items-center justify-center w-10 h-10 border border-rule hover:bg-cream-deep transition-colors rounded-sm ${value ? "" : "bg-ochre/20 border-ochre"}`}
              title="None"
            >
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-soft">None</span>
            </button>
            {INCLUSION_ICONS.map((icon) => {
              const selected = icon.key === value;
              return (
                <button
                  key={icon.key}
                  type="button"
                  onClick={() => { onChange(icon.key); setOpen(false); }}
                  title={icon.label}
                  className={`flex items-center justify-center w-10 h-10 border transition-colors rounded-sm ${selected ? "bg-ochre/20 border-ochre text-ink" : "border-rule hover:bg-cream-deep text-ink-soft"}`}
                >
                  {renderLucide(icon.lucide, 16)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
