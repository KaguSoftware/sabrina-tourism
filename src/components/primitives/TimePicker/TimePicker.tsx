"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [activeColumn, setActiveColumn] = useState<"hour" | "minute">("hour");
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

  const parsedHour = value ? parseInt(value.split(":")[0], 10) : null;
  const parsedMinute = value ? parseInt(value.split(":")[1], 10) : null;

  // Local selections give immediate gold highlight without waiting for parent re-render
  const [localHour, setLocalHour] = useState<number | null>(parsedHour);
  const [localMinute, setLocalMinute] = useState<number | null>(parsedMinute);

  // Keep local state in sync when value changes from outside
  useEffect(() => {
    setLocalHour(parsedHour);
    setLocalMinute(parsedMinute);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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

  // Focus the panel on open so it receives keyboard events.
  useEffect(() => {
    if (open && !isClosing && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open, isClosing]);

  function onPanelKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setActiveColumn((c) => (c === "hour" ? "minute" : "hour"));
      return;
    }
    if (e.key === "Tab") {
      // Allow shift+tab to go back to hours, tab to advance to minutes once.
      if (activeColumn === "hour" && !e.shiftKey) {
        e.preventDefault();
        setActiveColumn("minute");
      } else if (activeColumn === "minute" && e.shiftKey) {
        e.preventDefault();
        setActiveColumn("hour");
      }
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      if (activeColumn === "hour") {
        const currentIdx = localHour === null ? 0 : HOURS.indexOf(localHour);
        const nextIdx = (currentIdx + delta + HOURS.length) % HOURS.length;
        const nextH = HOURS[nextIdx];
        setLocalHour(nextH);
        const m = localMinute ?? 0;
        onChange(`${pad(nextH)}:${pad(m)}`);
      } else {
        const currentIdx = localMinute === null ? 0 : Math.max(0, MINUTES.indexOf(localMinute));
        const nextIdx = (currentIdx + delta + MINUTES.length) % MINUTES.length;
        const nextM = MINUTES[nextIdx];
        setLocalMinute(nextM);
        const h = localHour ?? 0;
        onChange(`${pad(h)}:${pad(nextM)}`);
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Confirm current selection (commit and close).
      const h = localHour ?? 0;
      const m = localMinute ?? 0;
      setLocalHour(h);
      setLocalMinute(m);
      onChange(`${pad(h)}:${pad(m)}`);
      closePanel();
      triggerRef.current?.focus();
      return;
    }
  }

  function handleTriggerMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    if (disabled) return;
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX });
    }
    if (open && !isClosing) {
      closePanel();
    } else if (!open) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsClosing(false);
      setOpen(true);
    }
  }

  function selectHour(h: number) {
    setLocalHour(h);
    setActiveColumn("hour");
    const m = localMinute ?? 0;
    onChange(`${pad(h)}:${pad(m)}`);
  }

  function selectMinute(m: number) {
    setLocalMinute(m);
    setActiveColumn("minute");
    const h = localHour ?? 0;
    onChange(`${pad(h)}:${pad(m)}`);
    closePanel();
  }

  const displayValue =
    localHour !== null && localMinute !== null
      ? `${pad(localHour)}:${pad(localMinute)}`
      : "";

  const triggerCls = [
    "w-full flex items-center justify-between gap-2 bg-transparent border-0 border-b py-2.5 text-left transition-colors duration-200 focus:outline-none",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    displayValue ? "border-ochre" : "border-rule",
  ].join(" ");

  const panel = open ? (
    <div
      ref={panelRef}
      role="dialog"
      tabIndex={-1}
      onKeyDown={onPanelKeyDown}
      style={{ position: "absolute", top: panelPos.top, left: panelPos.left, zIndex: 9999, outline: "none" }}
      className={`bg-cream border border-rule shadow-[0_8px_32px_-8px_rgba(31,26,20,0.18)] select-none w-52 ${isClosing ? "picker-exit" : "picker-enter"}`}
    >
      <div className="grid grid-cols-2 divide-x divide-rule">
        {/* Hours */}
        <div>
          <div className={`px-3 py-2 border-b border-rule ${activeColumn === "hour" ? "bg-ochre/5" : ""}`}>
            <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${activeColumn === "hour" ? "text-ochre" : "text-muted"}`}>Hour</span>
          </div>
          <div className="overflow-y-auto max-h-48">
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => selectHour(h)}
                className={[
                  "w-full px-3 py-2 text-left font-mono text-[13px] transition-colors duration-150",
                  localHour === h
                    ? "bg-ochre/10 text-ochre font-semibold"
                    : "text-ink hover:bg-ochre/10",
                ].join(" ")}
              >
                {pad(h)}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes */}
        <div>
          <div className={`px-3 py-2 border-b border-rule ${activeColumn === "minute" ? "bg-ochre/5" : ""}`}>
            <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${activeColumn === "minute" ? "text-ochre" : "text-muted"}`}>Minute</span>
          </div>
          <div className="overflow-y-auto max-h-48">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => selectMinute(m)}
                className={[
                  "w-full px-3 py-2 text-left font-mono text-[13px] transition-colors duration-150",
                  localMinute === m
                    ? "bg-ochre/10 text-ochre font-semibold"
                    : "text-ink hover:bg-ochre/10",
                ].join(" ")}
              >
                {pad(m)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={triggerCls}
        onMouseDown={handleTriggerMouseDown}
      >
        <span className={`font-sans text-[16px] ${displayValue ? "text-ink" : "text-muted"}`}>
          {displayValue || placeholder}
        </span>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={`shrink-0 ${displayValue ? "text-ochre" : "text-muted"}`}>
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.1" />
          <path d="M7.5 4.5v3.25l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {typeof window !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}
