import { HeroPanoramaSVG } from "@/components/illustrations/HeroPanoramaSVG/HeroPanoramaSVG";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { HERO_HEADLINE_TOP, HERO_HEADLINE_EM, HERO_SUB, HERO_KICKER } from "./constants";

export function HeroPanorama() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 px-[clamp(20px,4vw,56px)] overflow-hidden">
      {/* Illustrated background */}
      <div className="absolute inset-0 z-0">
        <HeroPanoramaSVG className="w-full h-full" />
      </div>

      {/* Veil */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/50 via-navy/20 to-navy/70" />

      {/* Content */}
      <div className="relative z-[2] max-w-[920px] w-full">
        <Reveal>
          <span className="inline-block font-mono text-[11px] tracking-[0.3em] uppercase text-ochre pb-2 border-b border-ochre mb-7">
            {HERO_KICKER}
          </span>
        </Reveal>
        <Reveal delay={140}>
          <h1 className="font-display font-light text-[clamp(56px,10.5vw,148px)] leading-[0.93] tracking-[-0.035em] text-cream mb-7">
            {HERO_HEADLINE_TOP}
            <br />
            <em className="text-ochre font-light not-italic">{HERO_HEADLINE_EM}</em>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="text-[clamp(16px,1.5vw,19px)] leading-[1.6] text-cream/82 max-w-[520px] mb-11">
            {HERO_SUB}
          </p>
        </Reveal>
        <Reveal delay={460}>
          <div className="flex gap-4 flex-wrap">
            <GoldButton href="/packages" variant="solid">
              Browse tours
            </GoldButton>
            <GoldButton href="/transportation" variant="ghost">
              Book a chauffeur
            </GoldButton>
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute left-[clamp(20px,4vw,56px)] bottom-10 z-[2] flex items-center gap-3.5 text-[11px] tracking-[0.24em] uppercase text-cream/70"
        aria-hidden="true"
      >
        <span>Scroll</span>
        <span className="w-14 h-px bg-cream/50 relative overflow-hidden">
          <span
            className="absolute inset-0 bg-ochre"
            style={{ animation: "cue-line 2.4s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
