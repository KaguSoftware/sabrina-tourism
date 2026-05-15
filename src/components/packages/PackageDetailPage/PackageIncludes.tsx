import { LUCIDE_REGISTRY, type LucideIcon } from "@/lib/icons/lucide-registry";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { getInclusionIcon } from "@/lib/icons/inclusion-icons";
import type { Package } from "@/lib/packages/types";

function InclusionIcon({ name, fallback }: { name: string | null; fallback: string }) {
  const def = getInclusionIcon(name);
  const Component = (def ? LUCIDE_REGISTRY[def.lucide] : LUCIDE_REGISTRY[fallback]) as LucideIcon | undefined;
  if (!Component) return null;
  return <Component size={16} strokeWidth={1.75} />;
}

export function PackageIncludes({ included, notIncluded }: Pick<Package, "included" | "notIncluded">) {
  return (
    <section className="relative z-10 max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-[clamp(80px,10vw,130px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div>
          <Kicker>Included</Kicker>
          <ul className="list-none p-0 mt-6">
            {included.map((x, i) => (
              <li key={i} className="flex items-center gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                <span className="text-ochre flex-shrink-0 w-4 flex items-center justify-center">
                  <InclusionIcon name={x.icon} fallback="Check" />
                </span>
                {x.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Kicker>Not included</Kicker>
          <ul className="list-none p-0 mt-6">
            {notIncluded.map((x, i) => (
              <li key={i} className="flex items-center gap-4 py-3.5 border-b border-rule text-[15px] text-ink-soft">
                <span className="text-muted flex-shrink-0 w-4 flex items-center justify-center">
                  <InclusionIcon name={x.icon} fallback="X" />
                </span>
                {x.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
