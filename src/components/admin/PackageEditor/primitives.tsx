"use client";

import { useRef } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/admin/Input/Input";

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        checked ? "bg-ochre" : "bg-rule"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-cream transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Simple list editor (inclusions, etc.)
// ---------------------------------------------------------------------------

export function ListEditor({
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
}: {
  items: { text: string }[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item.text}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="text-ink-soft hover:text-terracotta transition-colors p-1"
            aria-label="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors mt-1"
      >
        <Plus size={12} /> Add item
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confirm dialog
// ---------------------------------------------------------------------------

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-cream border border-rule p-8 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink font-semibold mb-3">
          Confirm
        </p>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-8">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-transparent text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error callout
// ---------------------------------------------------------------------------

export function ErrorCallout({ errors }: { errors: string[] }) {
  const firstRef = useRef<HTMLDivElement>(null);
  if (errors.length === 0) return null;
  return (
    <div
      ref={firstRef}
      className="mb-6 border border-terracotta/40 bg-terracotta/10 p-4 rounded"
    >
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta font-semibold mb-2">
        Fix these errors before saving
      </p>
      <ul className="space-y-1">
        {errors.map((e, i) => (
          <li key={i} className="font-sans text-[13px] text-terracotta">
            {e}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => firstRef.current?.scrollIntoView({ behavior: "smooth" })}
        className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-terracotta underline"
      >
        Jump to first error ↑
      </button>
    </div>
  );
}
