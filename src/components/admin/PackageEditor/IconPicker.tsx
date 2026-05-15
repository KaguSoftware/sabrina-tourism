"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { LUCIDE_REGISTRY, type LucideIcon } from "@/lib/icons/lucide-registry";
import { INCLUSION_ICONS, getInclusionIcon } from "@/lib/icons/inclusion-icons";

const ICON_REGISTRY = LUCIDE_REGISTRY;

function resolveIcon(lucideName: string): LucideIcon | null {
  const Comp = ICON_REGISTRY[lucideName];
  return Comp ?? null;
}

function LucideGlyph({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = resolveIcon(name);
  return Icon ? createElement(Icon, { size }) : null;
}

interface IconPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  variant?: "included" | "not_included";
}

export function IconPicker({ value, onChange, variant = "included" }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selected = getInclusionIcon(value);
  const placeholderName = variant === "included" ? "CirclePlus" : "CircleMinus";
  const activeIconName = selected ? selected.lucide : placeholderName;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={selected ? selected.label : "Choose icon"}
        aria-label={selected ? `Icon: ${selected.label}` : "Choose icon"}
        className={`flex items-center justify-center w-9 h-9 rounded-sm border transition-colors ${
          selected
            ? "border-ochre bg-ochre/10 text-ink"
            : "border-rule bg-cream-deep text-ink-soft hover:border-ochre hover:text-ink"
        }`}
      >
        <LucideGlyph name={activeIconName} size={16} />
      </button>
      {open && (
        <div className="absolute z-30 top-full right-0 mt-1 w-72 bg-cream border border-rule shadow-xl p-3 rounded-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft font-medium">
              Choose icon
            </p>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="font-mono text-[10px] tracking-[0.16em] uppercase text-terracotta hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-6 gap-1.5 max-h-64 overflow-y-auto">
            {INCLUSION_ICONS.map((def) => {
              const active = value === def.key;
              return (
                <button
                  key={def.key}
                  type="button"
                  title={def.label}
                  onClick={() => {
                    onChange(def.key);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-center aspect-square rounded-sm border transition-colors ${
                    active
                      ? "border-ochre bg-ochre/20 text-ink"
                      : "border-transparent text-ink-soft hover:bg-cream-deep hover:text-ink"
                  }`}
                >
                  <LucideGlyph name={def.lucide} size={16} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
