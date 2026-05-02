"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseYMD(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(s: string) {
  const d = parseYMD(s);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function DatePicker({
  value,
  onChange,
  min,
  placeholder = "Select a date",
  className,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
}) {
  const today = new Date();
  const initial = parseYMD(value) ?? today;
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = parseYMD(value);
    if (d) setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function openPicker() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    }
    setOpen((o) => !o);
  }

  const minDate = parseYMD(min ?? "") ?? null;

  function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
  function firstWeekday(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const totalDays = daysInMonth(year, month);
  const startOffset = firstWeekday(year, month);

  function select(day: number) {
    onChange(toYMD(new Date(year, month, day)));
    setOpen(false);
  }

  function isDisabled(day: number) {
    if (!minDate) return false;
    return new Date(year, month, day) < minDate;
  }

  function isSelected(day: number) {
    return value === toYMD(new Date(year, month, day));
  }

  function isToday(day: number) {
    return toYMD(new Date(year, month, day)) === toYMD(today);
  }

  const triggerCls = [
    "w-full flex items-center justify-between gap-2 bg-transparent border-0 border-b py-2.5 text-left transition-colors duration-200 focus:outline-none cursor-pointer",
    error ? "border-terracotta" : value ? "border-ochre" : "border-rule",
    className ?? "",
  ].join(" ");

  const panel = open ? (
    <div
      ref={panelRef}
      style={{ position: "absolute", top: panelPos.top, left: panelPos.left, zIndex: 9999 }}
      className="bg-cream border border-rule shadow-[0_8px_32px_-8px_rgba(31,26,20,0.18)] p-4 w-72 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="font-display text-[15px] tracking-tight text-ink">{MONTHS[month]} {year}</span>
        <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <span key={d} className="text-center font-mono text-[10px] tracking-widest uppercase text-muted py-1">{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: startOffset }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const tod = isToday(day);
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => select(day)}
              className={[
                "h-8 w-full flex items-center justify-center font-sans text-[13px] transition-colors duration-150",
                disabled ? "text-muted/40 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              <span className={[
                "w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150",
                disabled ? "" :
                selected ? "bg-navy text-ochre font-semibold" :
                tod ? "border border-ochre text-ink hover:bg-ochre/10" :
                "text-ink hover:bg-ochre/15",
              ].join(" ")}>
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button ref={triggerRef} type="button" className={triggerCls} onClick={openPicker}>
        <span className={`font-sans text-[16px] ${value ? "text-ink" : "text-muted"}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={`shrink-0 ${value ? "text-ochre" : "text-muted"}`}>
          <rect x="0.75" y="2.75" width="13.5" height="11.5" rx="1.25" stroke="currentColor" strokeWidth="1.1" />
          <path d="M0.75 6h13.5" stroke="currentColor" strokeWidth="1.1" />
          <path d="M4.5 1v3M10.5 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </button>
      {typeof window !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}
