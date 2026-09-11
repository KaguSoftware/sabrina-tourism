"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/admin/Input/Input";
import { Spinner } from "@/components/admin/Spinner/Spinner";
import type { TabIssue } from "@/lib/admin/tab-completeness";
import type { FlatFieldError } from "@/lib/admin/form-errors";

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
        checked ? "bg-ochre hover:bg-gold" : "bg-rule hover:bg-ink-soft/40"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} focus:outline-none focus:ring-2 focus:ring-ochre/30`}
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
            className="border border-rule hover:border-terracotta text-ink-soft hover:text-terracotta transition-colors p-2 rounded-sm"
            aria-label="Remove item"
            title="Remove item"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink border border-rule hover:border-ochre hover:text-ochre transition-colors mt-1 px-3 py-2 rounded-sm"
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
  title = "Confirm",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  busy = false,
  typeToConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  typeToConfirm?: string;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!open) setTyped("");
  }, [open]);

  if (!open) return null;

  const requireTyping = !!typeToConfirm;
  const canConfirm =
    !busy && (!requireTyping || typed.trim() === typeToConfirm);

  const confirmClasses = destructive
    ? "bg-transparent text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream hover:border-terracotta"
    : "bg-ochre text-navy border border-ochre hover:bg-gold";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={busy ? undefined : onClose}
    >
      <div
        className="bg-cream border border-rule p-8 max-w-sm w-[calc(100vw-24px)] mx-3 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          {destructive && (
            <AlertTriangle size={14} className="text-terracotta flex-shrink-0" />
          )}
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink font-semibold">
            {title}
          </p>
        </div>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-5">
          {message}
        </p>
        {requireTyping && (
          <div className="mb-6">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft mb-2">
              Type{" "}
              <span className="text-ink font-semibold">{typeToConfirm}</span>{" "}
              to confirm
            </p>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              disabled={busy}
              autoFocus
            />
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft hover:text-ink transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-24 justify-center ${confirmClasses}`}
          >
            {busy ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readiness panel — replaces ErrorCallout
// ---------------------------------------------------------------------------

export function ReadinessPanel({
  issues,
  onJumpToTab,
}: {
  issues: TabIssue[];
  onJumpToTab?: (tab: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div
        ref={ref}
        className="mb-6 border border-teal/40 bg-teal/10 p-4 rounded flex items-center gap-3"
      >
        <CheckCircle2 size={16} className="text-teal flex-shrink-0" />
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-teal font-semibold">
          Ready to publish — everything looks good
        </p>
      </div>
    );
  }

  const headline =
    errors.length > 0
      ? `Fix ${errors.length} ${errors.length === 1 ? "issue" : "issues"} before saving${
          warnings.length > 0
            ? ` · ${warnings.length} suggested ${warnings.length === 1 ? "improvement" : "improvements"}`
            : ""
        }`
      : `${warnings.length} suggested ${warnings.length === 1 ? "improvement" : "improvements"} — saving is allowed`;

  const headlineColor = errors.length > 0 ? "text-terracotta" : "text-ochre";
  const borderColor = errors.length > 0 ? "border-terracotta/40 bg-terracotta/10" : "border-ochre/40 bg-ochre/10";

  return (
    <div ref={ref} className={`mb-6 border ${borderColor} p-4 rounded`}>
      <div className="flex items-start gap-2 mb-3">
        {errors.length > 0 ? (
          <AlertCircle size={16} className="text-terracotta flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle size={16} className="text-ochre flex-shrink-0 mt-0.5" />
        )}
        <p className={`font-mono text-[11px] tracking-[0.18em] uppercase font-semibold ${headlineColor}`}>
          {headline}
        </p>
      </div>

      {errors.length > 0 && (
        <ul className="space-y-1 mb-3">
          {errors.map((issue, i) => (
            <li key={`e-${i}`} className="flex items-baseline gap-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-terracotta/70 min-w-[70px]">
                {issue.tab}
              </span>
              {onJumpToTab ? (
                <button
                  type="button"
                  onClick={() => onJumpToTab(issue.tab)}
                  className="font-sans text-[13px] text-terracotta hover:underline text-left min-w-0 break-words flex-1"
                >
                  {issue.message}
                </button>
              ) : (
                <span className="font-sans text-[13px] text-terracotta">{issue.message}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {warnings.length > 0 && (
        <ul className="space-y-1">
          {warnings.map((issue, i) => (
            <li key={`w-${i}`} className="flex items-baseline gap-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ochre/70 min-w-[70px]">
                {issue.tab}
              </span>
              {onJumpToTab ? (
                <button
                  type="button"
                  onClick={() => onJumpToTab(issue.tab)}
                  className="font-sans text-[13px] text-ink-soft hover:text-ink hover:underline text-left"
                >
                  {issue.message}
                </button>
              ) : (
                <span className="font-sans text-[13px] text-ink-soft">{issue.message}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error callout — the simpler panel used by the editors without a readiness
// model. Each entry is a link back to the field that produced it.
// ---------------------------------------------------------------------------

export function ErrorCallout({
  items,
  onJump,
}: {
  items: FlatFieldError[];
  onJump?: (path: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6 border border-terracotta/40 bg-terracotta/10 p-4 rounded">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={14} className="text-terracotta" />
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta font-semibold">
          Fix {items.length} {items.length === 1 ? "issue" : "issues"} before saving — click one to jump to it
        </p>
      </div>
      <ol className="space-y-1 list-decimal list-inside">
        {items.map((item, i) => (
          <li key={`${item.path}-${i}`} className="font-sans text-[13px] text-terracotta">
            {item.tab && (
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-terracotta/70 mr-2">
                {item.tab}
              </span>
            )}
            {onJump ? (
              <button
                type="button"
                onClick={() => onJump(item.path)}
                className="text-left hover:underline"
              >
                {item.message}
              </button>
            ) : (
              item.message
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
