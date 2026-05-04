"use client";
import { REGIONS, PEOPLE_OPTIONS } from "./constants";
import type { FilterBarProps } from "./types";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";


export function FilterBar({ filters, onChange, onClear: _onClear }: FilterBarProps) {

  return (
    <div className="relative z-7 sm:sticky sm:top-18 sm:z-40 border-y border-rule">
      {/* Mobile layout */}
      <div className="sm:hidden max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-3 flex flex-col gap-5">
        {/* Group */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Group</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {PEOPLE_OPTIONS.map((opt) => {
              const active = filters.people === Number(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange({ people: active ? 0 : Number(opt.value) })}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "14px",
                    padding: "10px 20px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s, color 0.2s",
                    backgroundColor: active ? "#8B9A5B" : "transparent",
                    color: active ? "#c99a3f" : "#1f1a14",
                    fontWeight: active ? 600 : 400,
                    border: active ? "none" : "1.5px solid #c99a3f",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Date */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Date</span>
          <DatePicker value={filters.date} onChange={(v) => onChange({ date: v })} placeholder="Any date" />
        </div>
        {/* Region — wrapping pills */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Region</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {(["All", ...REGIONS] as const).map((r) => {
              const isAll = r === "All";
              const active = isAll ? filters.region.length === 0 : filters.region.includes(r as typeof REGIONS[number]);
              return (
                <button
                  key={r}
                  onClick={() => {
                    if (isAll) { onChange({ region: [] }); return; }
                    const rr = r as typeof REGIONS[number];
                    const next = filters.region.includes(rr)
                      ? filters.region.filter((x) => x !== rr)
                      : [...filters.region, rr];
                    onChange({ region: next });
                  }}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "14px",
                    padding: "10px 20px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s, color 0.2s",
                    backgroundColor: active ? "#8B9A5B" : "transparent",
                    color: active ? "#c99a3f" : "#1f1a14",
                    fontWeight: active ? 600 : 400,
                    border: active ? "none" : "1.5px solid #c99a3f",
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex flex-col max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-3.5 gap-3">
        {/* Row 1: Group + Date */}
        <div className="flex items-center justify-center gap-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Group</span>
            <div className="flex gap-2">
              {PEOPLE_OPTIONS.map((opt) => {
                const active = filters.people === Number(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ people: active ? 0 : Number(opt.value) })}
                    style={{
                      fontFamily: "inherit",
                      fontSize: "14px",
                      padding: "10px 20px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 0.2s, color 0.2s",
                      backgroundColor: active ? "#8B9A5B" : "transparent",
                      color: active ? "#c99a3f" : "#1f1a14",
                      fontWeight: active ? 600 : 400,
                      border: active ? "none" : "1.5px solid #c99a3f",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <span className="w-px h-6 bg-rule" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Date</span>
            <DatePicker value={filters.date} onChange={(v) => onChange({ date: v })} placeholder="Any date" />
          </div>
        </div>
        {/* Row 2: Region centered */}
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">Region</span>
          <div className="flex gap-2 flex-wrap justify-center">
            {(["All", ...REGIONS] as const).map((r) => {
              const isAll = r === "All";
              const active = isAll ? filters.region.length === 0 : filters.region.includes(r as typeof REGIONS[number]);
              return (
                <button
                  key={r}
                  onClick={() => {
                    if (isAll) { onChange({ region: [] }); return; }
                    const rr = r as typeof REGIONS[number];
                    const next = filters.region.includes(rr)
                      ? filters.region.filter((x) => x !== rr)
                      : [...filters.region, rr];
                    onChange({ region: next });
                  }}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "14px",
                    padding: "10px 20px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s, color 0.2s",
                    backgroundColor: active ? "#8B9A5B" : "transparent",
                    color: active ? "#c99a3f" : "#1f1a14",
                    fontWeight: active ? 600 : 400,
                    border: active ? "none" : "1.5px solid #c99a3f",
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
