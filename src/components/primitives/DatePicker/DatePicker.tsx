"use client";
import { useState, useRef, useEffect, useCallback } from "react";
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
  max,
  placeholder = "Select a date",
  className,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
}) {
  const today = new Date();
  // Picker opens at value's month if set; otherwise at max's month if provided
  // (so a "DOB max = 18 years ago" picker doesn't open in the current year and
  // force the admin to page back through hundreds of months); otherwise today.
  const initial =
    parseYMD(value) ?? parseYMD(max ?? "") ?? today;
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [focusedDay, setFocusedDay] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closePanel = useCallback(() => {
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 180);
  }, []);

  const recomputePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPanelPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
  }, []);

  useEffect(() => {
    const d = parseYMD(value);
    if (d) setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [value]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) closePanel();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, closePanel]);

  // Re-run position computation on scroll/resize while panel is open.
  useEffect(() => {
    if (!open) return;
    const onScroll = () => recomputePosition();
    const onResize = () => recomputePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open, recomputePosition]);

  // Move focus into the panel when it opens so keyboard events are captured.
  useEffect(() => {
    if (open && !isClosing && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open, isClosing]);

  function openPicker() {
    recomputePosition();
    if (open && !isClosing) {
      closePanel();
    } else if (!open) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsClosing(false);
      setOpen(true);
      // Seed focused day: selected value's day if visible, else today if visible, else 1
      const selected = parseYMD(value);
      const cursorY = cursor.getFullYear();
      const cursorM = cursor.getMonth();
      let seed = 1;
      if (selected && selected.getFullYear() === cursorY && selected.getMonth() === cursorM) {
        seed = selected.getDate();
      } else if (today.getFullYear() === cursorY && today.getMonth() === cursorM) {
        seed = today.getDate();
      }
      setFocusedDay(seed);
    }
  }

  const minDate = parseYMD(min ?? "") ?? null;
  const maxDate = parseYMD(max ?? "") ?? null;

  function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
  function firstWeekday(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const totalDays = daysInMonth(year, month);
  const startOffset = firstWeekday(year, month);

  function select(day: number) {
    onChange(toYMD(new Date(year, month, day)));
    closePanel();
  }

  function isDisabled(day: number) {
    const d = new Date(year, month, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  }

  function isSelected(day: number) {
    return value === toYMD(new Date(year, month, day));
  }

  function isToday(day: number) {
    return toYMD(new Date(year, month, day)) === toYMD(today);
  }

  function clampToMonth(d: Date): Date {
    // Returns a date clamped to min/max if they are set.
    if (minDate && d < minDate) return new Date(minDate);
    if (maxDate && d > maxDate) return new Date(maxDate);
    return d;
  }

  function moveFocus(deltaDays: number) {
    const base = new Date(year, month, focusedDay ?? 1);
    const next = new Date(base.getFullYear(), base.getMonth(), base.getDate() + deltaDays);
    const clamped = clampToMonth(next);
    setCursor(new Date(clamped.getFullYear(), clamped.getMonth(), 1));
    setFocusedDay(clamped.getDate());
  }

  function onPanelKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveFocus(-1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveFocus(1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(-7);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveFocus(7);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      if (focusedDay !== null && !isDisabled(focusedDay)) {
        e.preventDefault();
        select(focusedDay);
      }
      return;
    }
  }

  const triggerCls = [
    "w-full flex items-center gap-2 bg-transparent border-0 border-b py-2.5 text-left transition-colors duration-200 focus:outline-none cursor-pointer",
    error ? "border-terracotta" : value ? "border-ochre" : "border-rule",
    className ?? "",
  ].join(" ");

  const panel = open ? (
    <div
      ref={panelRef}
      role="dialog"
      tabIndex={-1}
      onKeyDown={onPanelKeyDown}
      style={{ position: "absolute", top: panelPos.top, left: panelPos.left, zIndex: 9999, outline: "none" }}
      className={`bg-cream border border-rule shadow-[0_8px_32px_-8px_rgba(31,26,20,0.18)] p-4 w-72 select-none ${isClosing ? "picker-exit" : "picker-enter"}`}
    >
      {/* Header — year-prev, month-prev, label, month-next, year-next */}
      <div className="flex items-center justify-between mb-3 gap-1">
        <button type="button" aria-label="Previous year" onClick={() => setCursor(new Date(year - 1, month, 1))} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L1 6l5 5M11 1L6 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button type="button" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="font-display text-[15px] tracking-tight text-ink flex-1 text-center">{MONTHS[month]} {year}</span>
        <button type="button" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button type="button" aria-label="Next year" onClick={() => setCursor(new Date(year + 1, month, 1))} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l5 5-5 5M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
          const focused = focusedDay === day;
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => select(day)}
              onMouseEnter={() => setFocusedDay(day)}
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
                focused ? "bg-ochre/15 text-ink ring-1 ring-ochre/40" :
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
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={`shrink-0 ${value ? "text-ochre" : "text-muted"}`}>
          <rect x="0.75" y="2.75" width="13.5" height="11.5" rx="1.25" stroke="currentColor" strokeWidth="1.1" />
          <path d="M0.75 6h13.5" stroke="currentColor" strokeWidth="1.1" />
          <path d="M4.5 1v3M10.5 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        <span className={`font-sans text-[16px] ${value ? "text-ink" : "text-muted"}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>
      {typeof window !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}
