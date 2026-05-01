import { Kicker } from "@/components/primitives/Kicker/Kicker";
import type { Package } from "@/lib/packages/types";

export function PackageIncludes({ included, notIncluded }: Pick<Package, "included" | "notIncluded">) {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div>
          <Kicker>Included</Kicker>
          <ul className="list-none p-0 mt-6">
            {included.map((x, i) => (
              <li key={i} className="flex gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                <span className="font-display italic text-ochre text-[18px] w-4 flex-shrink-0">✓</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Kicker>Not included</Kicker>
          <ul className="list-none p-0 mt-6">
            {notIncluded.map((x, i) => (
              <li key={i} className="flex gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                <span className="text-muted text-[18px] w-4 flex-shrink-0">×</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
