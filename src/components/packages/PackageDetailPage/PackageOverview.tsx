"use client";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import type { Package } from "@/lib/packages/types";

function prettyMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function PackageOverview({ pkg }: { pkg: Package }) {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,130px)] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[clamp(40px,6vw,100px)]">
      <div>
        <Reveal>
          <Kicker>The route, in brief</Kicker>
        </Reveal>
        <Reveal delay={120}>
          <ul className="mt-6 list-none p-0">
            {[
              ["Duration", pkg.duration],
              ["Region", pkg.region],
              ["Group size", `${pkg.minPeople}–${pkg.maxPeople} guests`],
              ["Available", `${prettyMonth(pkg.availableFrom)} – ${prettyMonth(pkg.availableTo)}`],
            ].map(([label, val]) => (
              <li key={label} className="flex justify-between gap-4 py-3.5 border-b border-rule text-[14px]">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">{label}</span>
                <em className="not-italic text-ink text-right">{val}</em>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <div>
        {pkg.overview.map((para, i) => (
          <Reveal key={i} delay={i * 80}>
            <p className={`text-[clamp(16px,1.4vw,19px)] leading-[1.7] text-ink-soft mb-6 max-w-[60ch] ${i === 0 ? "first-letter:font-display first-letter:italic first-letter:text-[4em] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-3.5 first-letter:pt-2 first-letter:text-ochre" : ""}`}>
              {para}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
