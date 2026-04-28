"use client";
import { REGIONS, PEOPLE_OPTIONS } from "./constants";
import type { FilterBarProps } from "./types";

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const hasActive = !!(filters.region || filters.people || filters.date);

  return (
    <div className="sticky top-[72px] z-40 bg-cream/95 backdrop-blur-md border-y border-rule">
      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-3.5 flex items-center gap-5 flex-wrap">

        {/* Group size */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Group</span>
          <div className="flex gap-1.5 flex-wrap">
            {PEOPLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  onChange({ people: filters.people === Number(opt.value) ? 0 : Number(opt.value) })
                }
                className={`font-mono text-[12px] tracking-[0.1em] uppercase px-3 py-2 border transition-all duration-200 ${
                  filters.people === Number(opt.value)
                    ? "bg-teal-deep text-cream border-teal-deep font-semibold"
                    : "border-rule text-ink-soft hover:border-ochre hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <span className="w-px h-6 bg-rule hidden sm:block" aria-hidden="true" />

        {/* Date */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Date</span>
          <div className={`relative border-b transition-colors duration-200 ${filters.date ? "border-ochre" : "border-rule"}`}>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className={`bg-transparent border-0 font-sans text-[14px] px-0 py-1.5 focus:outline-none transition-colors duration-200 ${
                filters.date ? "text-ochre font-medium" : "text-ink"
              }`}
            />
            {filters.date && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ochre" />
            )}
          </div>
        </div>

        <span className="w-px h-6 bg-rule hidden sm:block" aria-hidden="true" />

        {/* Region */}
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">Region</span>
          <div className="flex gap-1.5 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => onChange({ region: filters.region === r ? "" : r })}
                className={`font-mono text-[12px] tracking-[0.1em] uppercase px-3 py-2 border transition-all duration-200 ${
                  filters.region === r
                    ? "bg-teal-deep text-cream border-teal-deep font-semibold"
                    : "border-rule text-ink-soft hover:border-ochre hover:text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Clear */}
        {hasActive && (
          <button
            onClick={onClear}
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre ml-auto whitespace-nowrap hover:text-terracotta transition-colors duration-200"
          >
            Clear ×
          </button>
        )}
      </div>
    </div>
  );
}
