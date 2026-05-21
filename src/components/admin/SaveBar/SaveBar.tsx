"use client";

import { AlertCircle, Check } from "lucide-react";
import { Spinner } from "@/components/admin/Spinner/Spinner";

interface SaveBarProps {
  isDirty: boolean;
  saving: boolean;
  hasErrors?: boolean;
  errorCount?: number;
  label?: string;
  onClick?: () => void;
  /** If true, render as a sticky-bottom bar that fades in/out with dirty state. */
  sticky?: boolean;
}

export function SaveButton({
  isDirty,
  saving,
  hasErrors = false,
  errorCount = 0,
  label = "Save changes",
  onClick,
}: Omit<SaveBarProps, "sticky">) {
  let content: React.ReactNode = label;
  let cls = "bg-ochre text-navy border-ochre hover:bg-gold hover:border-gold hover:shadow-sm active:opacity-80";

  if (saving) {
    content = <Spinner size="sm" />;
  } else if (hasErrors) {
    content = (
      <>
        <AlertCircle size={13} />
        Fix {errorCount} {errorCount === 1 ? "issue" : "issues"} to save
      </>
    );
    cls = "bg-terracotta/15 text-terracotta border-terracotta/40 cursor-not-allowed";
  } else if (!isDirty) {
    content = (
      <>
        <Check size={13} />
        Saved
      </>
    );
    cls = "bg-cream-deep text-ink-soft border-rule cursor-default";
  }

  const disabled = saving || hasErrors || !isDirty;

  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium border transition-all duration-200 disabled:opacity-60 min-w-32 justify-center rounded-sm ${cls}`}
    >
      {content}
    </button>
  );
}

export function SaveBar({
  isDirty,
  saving,
  hasErrors = false,
  errorCount = 0,
  label,
  onClick,
  sticky = true,
}: SaveBarProps) {
  const visible = isDirty || hasErrors || saving;
  const statusText = saving
    ? "Saving…"
    : hasErrors
      ? `${errorCount} ${errorCount === 1 ? "issue" : "issues"} to fix`
      : isDirty
        ? "Unsaved changes"
        : "All changes saved";

  return (
    <div
      className={`${
        sticky ? "sticky bottom-0 left-0 right-0 z-20" : ""
      } border-t border-rule bg-cream/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between gap-4 mt-12 transition-opacity duration-200 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft">
        {statusText}
      </p>
      <SaveButton
        isDirty={isDirty}
        saving={saving}
        hasErrors={hasErrors}
        errorCount={errorCount}
        label={label}
        onClick={onClick}
      />
    </div>
  );
}
