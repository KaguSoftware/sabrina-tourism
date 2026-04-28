import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { QUOTE, ATTRIBUTION } from "./constants";

export function QuoteStrip() {
  return (
    <section className="relative z-10 bg-navy text-cream py-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)]">
      <div className="max-w-[880px] mx-auto text-center">
        <Reveal>
          <p className="font-display italic text-ochre text-[120px] leading-[0.6] mb-5" aria-hidden="true">
            "
          </p>
          <blockquote className="font-display font-light italic text-[clamp(22px,2.6vw,36px)] leading-[1.35] tracking-[-0.012em] mb-8">
            {QUOTE}
          </blockquote>
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-cream/55">
            {ATTRIBUTION}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
