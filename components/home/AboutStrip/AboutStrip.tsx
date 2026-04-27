import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { ABOUT_HEADING, ABOUT_BODY } from "./constants";

export function AboutStrip() {
  return (
    <section className="relative z-10 bg-cream py-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)]">
      <div className="max-w-[920px] mx-auto">
        <Reveal>
          <Kicker>About — Est. 2014</Kicker>
        </Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading
            as="h2"
            className="text-[clamp(28px,3.6vw,48px)] mt-6 mb-9 max-w-[22ch]"
          >
            {ABOUT_HEADING}
          </GoldUnderlineHeading>
        </Reveal>
        <Reveal delay={240}>
          <p className="text-[clamp(16px,1.4vw,19px)] leading-[1.65] text-ink-soft max-w-[65ch]">
            {ABOUT_BODY}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
