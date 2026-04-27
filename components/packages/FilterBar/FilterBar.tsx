"use client";
import { REGIONS, PEOPLE_OPTIONS } from "./constants";
import type { FilterBarProps } from "./types";

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const hasActive = !!(filters.region || filters.people || filters.date);

  return (
    <div className="sticky top-[72px] z-40 bg-cream/92 backdrop-blur-md border-y border-rule">
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
                    ? "bg-navy text-cream border-navy"
                    : "border-rule text-ink-soft hover:border-ochre"
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
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="bg-transparent border-0 border-b border-rule font-sans text-[14px] text-ink px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors duration-200"
          />
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
                    ? "bg-navy text-cream border-navy"
                    : "border-rule text-ink-soft hover:border-ochre"
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
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre ml-auto whitespace-nowrap"
          >
            Clear ×
          </button>
        )}
      </div>
    </div>
  );
}
