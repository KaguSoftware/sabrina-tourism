"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

export interface DateRangePickerHandle {
  open: () => void;
  toggle: () => void;
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseYMD(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatShort(s: string) {
  const d = parseYMD(s);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }
function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }

export interface DateRangePickerProps {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
  min?: string;
  placeholder?: string;
  error?: boolean;
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  clearLabel?: string;
  startDateLabel?: string;
  endDateLabel?: string;
  selectStartLabel?: string;
}

export const DateRangePicker = forwardRef<DateRangePickerHandle, DateRangePickerProps>(function DateRangePicker({ start, end, onChange, min, placeholder = "Select dates", error, className, containerRef, clearLabel = "Clear", startDateLabel = "Start date", endDateLabel = "End date", selectStartLabel = "Select a starting date" }: DateRangePickerProps, ref) {
  const todayYMD = toYMD(new Date());
  const minYMD = min ?? todayYMD;

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState<"start" | "end">("start");
  const [hovered, setHovered] = useState("");
  const [cursor, setCursor] = useState(() => {
    const d = parseYMD(start) ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<"start" | "end">("start");

  function closePicker() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 180);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      const insideContainer = containerRef?.current?.contains(target);
      if (!insideTrigger && !insidePanel && !insideContainer) closePicker();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, containerRef]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePicker();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function openPicker() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    }
    setMode(!start || (start && end) ? "start" : "end");
    setOpen(true);
    setClosing(false);
  }

  useImperativeHandle(ref, () => ({
    open: openPicker,
    toggle: () => { if (open) closePicker(); else openPicker(); },
  }));

  function handleSelect(ymd: string) {
    if (mode === "start") {
      modeRef.current = "end";
      onChange(ymd, "");
      setMode("end");
    } else {
      if (ymd <= start) {
        modeRef.current = "end";
        onChange(ymd, "");
        setMode("end");
      } else {
        modeRef.current = "end";
        onChange(start, ymd);
        setHovered("");
        setMode("end");
        closePicker();
      }
    }
  }

  const nights = start && end
    ? Math.round((parseYMD(end)!.getTime() - parseYMD(start)!.getTime()) / 86_400_000)
    : 0;

  const label = start && end
    ? `${formatShort(start)} → ${formatShort(end)}  ·  ${nights} night${nights !== 1 ? "s" : ""}`
    : start
    ? `${formatShort(start)} → pick end date`
    : placeholder;

  // single month grid
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const total = daysInMonth(year, month);
  const offset = firstWeekday(year, month);
  const rangeEnd = end || (mode === "end" ? hovered : "");

  const triggerCls = [
    "w-full flex items-center gap-2 bg-transparent border-0 border-b py-2.5 text-left transition-colors duration-200 focus:outline-none cursor-pointer",
    error ? "border-terracotta" : (start || end) ? "border-ochre" : "border-rule",
    className ?? "",
  ].join(" ");

  const panel = open ? (
    <div
      ref={panelRef}
      onClick={(e) => e.stopPropagation()}
      style={{ position: "absolute", top: panelPos.top, left: panelPos.left, zIndex: 9999 }}
      className={`bg-cream border border-rule shadow-[0_8px_32px_-8px_rgba(31,26,20,0.2)] p-4 w-72 select-none ${closing ? "datepicker-exit" : "datepicker-enter"}`}
    >
      {/* start / end toggle buttons */}
      <div className="flex mb-4 gap-1.5">
        {!start ? (
          <div className="flex-1 flex items-center px-2.5 py-2 border border-ochre">
            <span className="font-sans text-[15px] font-medium text-ink">
              {selectStartLabel}
            </span>
          </div>
        ) : (
          <>
            {(["start", "end"] as const).map((tab) => {
              const isActive = mode === tab;
              const value = tab === "start" ? start : end;
              const labelText = tab === "start" ? startDateLabel : endDateLabel;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMode(tab)}
                  aria-pressed={isActive}
                  className={`relative flex-1 text-left px-2.5 py-1.5 border transition-all duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:transition-opacity before:duration-200 ${
                    isActive
                      ? "bg-navy border-ochre before:bg-ochre before:opacity-100"
                      : "bg-transparent border-rule hover:border-ochre/60 before:opacity-0"
                  }`}
                >
                  <span className={`font-mono text-[9px] tracking-[0.18em] uppercase block mb-0.5 ${isActive ? "text-ochre/70" : "text-muted"}`}>
                    {labelText}
                  </span>
                  <span className={`font-sans text-[12px] font-medium ${isActive ? "text-ochre" : value ? "text-ink" : "text-muted"}`}>
                    {value ? formatShort(value) : "—"}
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* month nav */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setCursor((c) => addMonths(c, -1))}
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="font-sans text-[14px] font-medium text-ink">{MONTHS[month]} {year}</span>
        <button type="button" onClick={() => setCursor((c) => addMonths(c, 1))}
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <span key={d} className="text-center font-mono text-[9px] tracking-widest uppercase text-muted py-1">{d}</span>
        ))}
      </div>

      {/* day grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: total }).map((_, i) => {
          const day = i + 1;
          const ymd = toYMD(new Date(year, month, day));
          const isPast = ymd < minYMD;
          const isStart = ymd === start;
          const isEnd = ymd === end;
          const inRange = !!(start && rangeEnd && ymd > start && ymd < rangeEnd);
          const isToday = ymd === todayYMD;
          const isEdge = isStart || isEnd;

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => !isPast && handleSelect(ymd)}
              onMouseEnter={() => !isPast && setHovered(ymd)}
              onMouseLeave={() => setHovered("")}
              style={
                inRange
                  ? { backgroundColor: "rgba(201,154,63,0.18)" }
                  : isStart && (end || hovered)
                  ? { background: "linear-gradient(to right, transparent 50%, rgba(201,154,63,0.18) 50%)" }
                  : (isEnd && start)
                  ? { background: "linear-gradient(to left, transparent 50%, rgba(201,154,63,0.18) 50%)" }
                  : undefined
              }
              className={[
                "relative h-8 flex items-center justify-center text-[12px] transition-colors duration-75",
                isPast ? "cursor-not-allowed" : "cursor-pointer",
                isStart && (end || hovered) ? "rounded-l-full" : "",
                isEnd ? "rounded-r-full" : "",
              ].join(" ")}
            >
              <span className={[
                "w-7 h-7 flex items-center justify-center rounded-full z-10 relative transition-colors duration-100",
                isPast ? "text-muted/35" :
                isEdge ? "bg-navy text-ochre font-semibold" :
                inRange ? "text-ink" :
                isToday ? "border border-ochre text-ink hover:bg-ochre/10" :
                "text-ink hover:bg-ochre/20",
              ].join(" ")}>
                {day}
              </span>
            </button>
          );
        })}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-rule">
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
          {start && end ? `${nights} night${nights !== 1 ? "s" : ""}` : ""}
        </span>
        {(start || end) && (
          <button
            type="button"
            onClick={() => { modeRef.current = "start"; onChange("", ""); setHovered(""); setMode("start"); }}
            className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink border border-rule hover:border-terracotta hover:text-terracotta transition-colors duration-200 px-3 py-1.5"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button ref={triggerRef} type="button" className={triggerCls} onClick={(e) => { if (e.target === triggerRef.current || triggerRef.current?.contains(e.target as Node)) { if (open) closePicker(); else openPicker(); } }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={`shrink-0 ${(start || end) ? "text-ochre" : "text-muted"}`}>
          <rect x="0.75" y="2.75" width="13.5" height="11.5" rx="1.25" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M0.75 6h13.5" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M4.5 1v3M10.5 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
        <span className={`font-sans text-[16px] ${(start || end) ? "text-ink" : "text-muted"}`}>{label}</span>
      </button>
      {typeof window !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
});
