"use client";
import { useState } from "react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseYMD(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShort(s: string) {
  return parseYMD(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function firstWeekday(y: number, m: number) {
  return (new Date(y, m, 1).getDay() + 6) % 7;
}

type Selection = { checkIn: string; checkOut: string };

function MonthGrid({
  year,
  month,
  today,
  minYMD,
  selection,
  hovered,
  onHover,
  onSelect,
}: {
  year: number;
  month: number;
  today: string;
  minYMD: string;
  selection: Selection;
  hovered: string;
  onHover: (ymd: string) => void;
  onSelect: (ymd: string) => void;
}) {
  const total = daysInMonth(year, month);
  const offset = firstWeekday(year, month);

  function classify(day: number) {
    const ymd = toYMD(new Date(year, month, day));
    const isPast = ymd < minYMD;
    const isCheckIn = ymd === selection.checkIn;
    const isCheckOut = ymd === selection.checkOut;
    const rangeEnd = selection.checkOut || hovered;
    const inRange =
      selection.checkIn &&
      rangeEnd &&
      ymd > selection.checkIn &&
      ymd < rangeEnd;
    const isToday = ymd === today;
    return { ymd, isPast, isCheckIn, isCheckOut, inRange, isToday };
  }

  return (
    <div>
      <p className="font-display text-[15px] tracking-tight text-ink text-center mb-3">
        {MONTHS[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <span key={d} className="text-center font-mono text-[9px] tracking-widest uppercase text-muted py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: total }).map((_, i) => {
          const day = i + 1;
          const { ymd, isPast, isCheckIn, isCheckOut, inRange, isToday } = classify(day);
          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => !isPast && onSelect(ymd)}
              onMouseEnter={() => !isPast && onHover(ymd)}
              onMouseLeave={() => onHover("")}
              className={[
                "relative h-9 flex items-center justify-center text-[13px] transition-colors duration-100",
                isPast ? "cursor-not-allowed" : "cursor-pointer",
                inRange ? "bg-ochre/15" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150 z-10 relative",
                  isPast
                    ? "text-muted/35"
                    : isCheckIn || isCheckOut
                    ? "bg-navy text-ochre font-semibold"
                    : isToday
                    ? "border border-ochre text-ink hover:bg-ochre/10"
                    : "text-ink hover:bg-ochre/20",
                ].join(" ")}
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HotelAvailabilityCalendar({ hotelName, region, waPhone }: { hotelName: string; region: string; waPhone?: string }) {
  const today = toYMD(new Date());
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selection, setSelection] = useState<Selection>({ checkIn: "", checkOut: "" });
  const [hovered, setHovered] = useState("");

  const secondMonth = addMonths(cursor, 1);

  function handleSelect(ymd: string) {
    if (!selection.checkIn || (selection.checkIn && selection.checkOut)) {
      setSelection({ checkIn: ymd, checkOut: "" });
    } else {
      if (ymd <= selection.checkIn) {
        setSelection({ checkIn: ymd, checkOut: "" });
      } else {
        setSelection({ checkIn: selection.checkIn, checkOut: ymd });
      }
    }
  }

  function clearSelection() {
    setSelection({ checkIn: "", checkOut: "" });
  }

  const nights =
    selection.checkIn && selection.checkOut
      ? Math.round(
          (parseYMD(selection.checkOut).getTime() - parseYMD(selection.checkIn).getTime()) /
            86_400_000
        )
      : 0;

  const waMessage = selection.checkIn && selection.checkOut
    ? `Hi, I'd like to check availability at ${hotelName} in ${region} — check-in ${formatShort(selection.checkIn)}, check-out ${formatShort(selection.checkOut)} (${nights} night${nights !== 1 ? "s" : ""}).`
    : `Hi, I'd like to check availability at ${hotelName} in ${region}.`;

  const waHref = `https://wa.me/${waPhone ?? ""}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="border border-rule p-6">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mb-1">
        Check availability
      </p>
      <p className="text-[13px] text-ink-soft mb-5">
        {!selection.checkIn
          ? "Select a check-in date."
          : !selection.checkOut
          ? "Now select a check-out date."
          : `${nights} night${nights !== 1 ? "s" : ""} · ${formatShort(selection.checkIn)} → ${formatShort(selection.checkOut)}`}
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, -1))}
          disabled={toYMD(cursor) <= today.slice(0, 7) + "-01"}
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink transition-colors"
          aria-label="Next month"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Two-month grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MonthGrid
          year={cursor.getFullYear()}
          month={cursor.getMonth()}
          today={today}
          minYMD={today}
          selection={selection}
          hovered={hovered}
          onHover={setHovered}
          onSelect={handleSelect}
        />
        <MonthGrid
          year={secondMonth.getFullYear()}
          month={secondMonth.getMonth()}
          today={today}
          minYMD={today}
          selection={selection}
          hovered={hovered}
          onHover={setHovered}
          onSelect={handleSelect}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 mb-5">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-muted">
          <span className="w-3 h-3 rounded-full bg-navy inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-muted">
          <span className="w-3 h-3 rounded-full bg-ochre/30 inline-block" />
          Range
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: "#0b1a2e", color: "#c99a3f" }}
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[12px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_-6px_rgba(11,26,46,0.4)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-whatsapp.svg"
            alt=""
            aria-hidden="true"
            width="14"
            height="14"
            style={{ filter: "brightness(0) saturate(100%) invert(68%) sepia(50%) saturate(500%) hue-rotate(5deg) brightness(95%)" }}
          />
          {selection.checkIn && selection.checkOut ? "Send availability request" : "Enquire via WhatsApp"}
        </a>
        {(selection.checkIn || selection.checkOut) && (
          <button
            type="button"
            onClick={clearSelection}
            className="font-mono text-[10px] tracking-widest uppercase text-muted hover:text-ink transition-colors text-center py-1"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}
