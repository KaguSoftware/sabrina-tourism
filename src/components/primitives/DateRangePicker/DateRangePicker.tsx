"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
}

export function DateRangePicker({ start, end, onChange, min, placeholder = "Select dates", error, className }: DateRangePickerProps) {
  const todayYMD = toYMD(new Date());
  const minYMD = min ?? todayYMD;

  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  const [cursor, setCursor] = useState(() => {
    const d = parseYMD(start) ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  function handleSelect(ymd: string) {
    if (!start || (start && end)) {
      onChange(ymd, "");
    } else {
      if (ymd <= start) {
        onChange(ymd, "");
      } else {
        onChange(start, ymd);
        setOpen(false);
        setHovered("");
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
  const rangeEnd = end || hovered;

  const triggerCls = [
    "w-full flex items-center justify-between gap-2 bg-transparent border-0 border-b py-2.5 text-left transition-colors duration-200 focus:outline-none cursor-pointer",
    error ? "border-terracotta" : (start || end) ? "border-ochre" : "border-rule",
    className ?? "",
  ].join(" ");

  const panel = open ? (
    <div
      ref={panelRef}
      style={{ position: "absolute", top: panelPos.top, left: panelPos.left, zIndex: 9999 }}
      className="bg-cream border border-rule shadow-[0_8px_32px_-8px_rgba(31,26,20,0.2)] p-4 w-72 select-none"
    >
      {/* hint */}
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted mb-3 text-center">
        {!start || (start && end) ? "Click a start date" : "Now click an end date"}
      </p>

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

      {/* day grid — single month */}
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
          <button type="button" onClick={() => { onChange("", ""); setHovered(""); }}
            className="font-mono text-[10px] tracking-widest uppercase text-muted hover:text-terracotta transition-colors">
            Clear
          </button>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button ref={triggerRef} type="button" className={triggerCls} onClick={openPicker}>
        <span className={`font-sans text-[16px] ${(start || end) ? "text-ink" : "text-muted"}`}>{label}</span>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={`shrink-0 ${(start || end) ? "text-ochre" : "text-muted"}`}>
          <rect x="0.75" y="2.75" width="13.5" height="11.5" rx="1.25" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M0.75 6h13.5" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M4.5 1v3M10.5 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </button>
      {typeof window !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}
