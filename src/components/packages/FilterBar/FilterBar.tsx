"use client";
import { REGIONS, PEOPLE_OPTIONS } from "./constants";
import type { FilterBarProps } from "./types";

const pillBase = "font-sans text-[14px] px-5 py-2.5 rounded-full transition-all duration-200";
const pillActive = "bg-navy text-ochre font-semibold";
const pillInactive = "bg-gray-100 text-ink hover:bg-gray-200";

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const hasActive = !!(filters.region.length || filters.people || filters.date);

  return (
    <div className="relative z-20 sm:sticky sm:top-18 sm:z-40 bg-cream/95 backdrop-blur-md border-y border-rule">
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
                    backgroundColor: active ? "#0b1a2e" : "#f5ede0",
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
          <div className={`relative border-b transition-colors duration-200 ${filters.date ? "border-ochre" : "border-rule"}`}>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className={`bg-transparent border-0 font-sans text-[14px] px-0 py-1.5 focus:outline-none transition-colors duration-200 ${filters.date ? "text-ochre font-medium" : "text-ink"}`}
            />
            {filters.date && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ochre" />}
          </div>
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
                    backgroundColor: active ? "#0b1a2e" : "#f5ede0",
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
      <div className="hidden sm:flex max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-3.5 items-center gap-5 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Group</span>
          <div className="flex gap-2 flex-wrap">
            {PEOPLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ people: filters.people === Number(opt.value) ? 0 : Number(opt.value) })}
                className={`${pillBase} ${filters.people === Number(opt.value) ? pillActive : pillInactive}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <span className="w-px h-6 bg-rule" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Date</span>
          <div className={`relative border-b transition-colors duration-200 ${filters.date ? "border-ochre" : "border-rule"}`}>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className={`bg-transparent border-0 font-sans text-[14px] px-0 py-1.5 focus:outline-none transition-colors duration-200 ${filters.date ? "text-ochre font-medium" : "text-ink"}`}
            />
            {filters.date && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ochre" />}
          </div>
        </div>
        <span className="w-px h-6 bg-rule" aria-hidden="true" />
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">Region</span>
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  const next = filters.region.includes(r)
                    ? filters.region.filter((x) => x !== r)
                    : [...filters.region, r];
                  onChange({ region: next });
                }}
                className={`${pillBase} ${filters.region.includes(r) ? pillActive : pillInactive}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {hasActive && (
          <button onClick={onClear} className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre ml-auto whitespace-nowrap hover:text-terracotta transition-colors duration-200">
            Clear ×
          </button>
        )}
      </div>
    </div>
  );
}
