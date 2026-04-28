"use client";
import { REGIONS, PEOPLE_OPTIONS } from "./constants";
import type { FilterBarProps } from "./types";

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const hasActive = !!(filters.region.length || filters.people || filters.date);

  return (
    <div className="sticky top-[72px] z-40 bg-cream/95 backdrop-blur-md border-y border-rule">
      {/* Mobile layout */}
      <div className="sm:hidden max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-3 flex flex-col gap-2.5">
        {/* Row 1: Group */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">Group</span>
          <div className="flex gap-1.5 flex-wrap">
            {PEOPLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ people: filters.people === Number(opt.value) ? 0 : Number(opt.value) })}
                className={`font-mono text-[12px] tracking-widest uppercase px-3 py-2 border text-center min-w-9 transition-all duration-200 ${
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
        {/* Row 2: Date */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">Date</span>
          <div className={`relative border-b transition-colors duration-200 ${filters.date ? "border-ochre" : "border-rule"}`}>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className={`bg-transparent border-0 font-sans text-[14px] px-0 py-1.5 focus:outline-none transition-colors duration-200 ${
                filters.date ? "text-ochre font-medium" : "text-ink"
              }`}
            />
            {filters.date && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ochre" />}
          </div>
        </div>
        {/* Row 3: Region pills */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Region</span>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  const next = filters.region.includes(r)
                    ? filters.region.filter((x) => x !== r)
                    : [...filters.region, r];
                  onChange({ region: next });
                }}
                className={`font-sans text-[13px] px-4 py-2 rounded-full transition-all duration-200 ${
                  filters.region.includes(r)
                    ? "bg-navy text-ochre font-semibold"
                    : "bg-gray-200 text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {hasActive && (
          <button onClick={onClear} className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre whitespace-nowrap hover:text-terracotta transition-colors duration-200 self-start">
            Clear ×
          </button>
        )}
      </div>

      {/* Desktop layout — unchanged */}
      <div className="hidden sm:flex max-w-330 mx-auto px-[clamp(20px,4vw,56px)] py-3.5 items-center gap-5 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Group</span>
          <div className="flex gap-1.5 flex-wrap">
            {PEOPLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ people: filters.people === Number(opt.value) ? 0 : Number(opt.value) })}
                className={`font-mono text-[12px] tracking-widest uppercase px-3 py-2 border transition-all duration-200 ${
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
        <span className="w-px h-6 bg-rule" aria-hidden="true" />
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
            {filters.date && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ochre" />}
          </div>
        </div>
        <span className="w-px h-6 bg-rule" aria-hidden="true" />
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted shrink-0">Region</span>
          <div className="flex gap-1.5 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  const next = filters.region.includes(r)
                    ? filters.region.filter((x) => x !== r)
                    : [...filters.region, r];
                  onChange({ region: next });
                }}
                className={`font-mono text-[12px] tracking-widest uppercase px-3 py-2 border transition-all duration-200 ${
                  filters.region.includes(r)
                    ? "bg-teal-deep text-cream border-teal-deep font-semibold"
                    : "border-rule text-ink-soft hover:border-ochre hover:text-ink"
                }`}
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
