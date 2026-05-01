import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";

export function PackageCTAStrip({
  packageName,
  tierName,
  waHref,
  seedDate,
  seedPeople,
}: {
  packageName: string;
  tierName: string;
  waHref: string;
  seedDate?: string;
  seedPeople?: string;
}) {
  return (
    <section className="bg-navy text-cream py-[clamp(80px,12vw,160px)] px-[clamp(20px,4vw,56px)] relative z-10 overflow-hidden">
      <div aria-hidden="true" className="absolute right-[-180px] top-1/2 -translate-y-1/2 -z-10">
        {[680, 520, 360, 210, 80].map((size, i) => (
          <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.04 + i * 0.012})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute left-[-140px] top-1/2 -translate-y-1/2 -z-10">
        {[440, 290, 140].map((size, i) => (
          <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(201,154,63,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
      </div>
      <div aria-hidden="true" className="deco-hatch" style={{ top: 0, left: 0, width: 360, height: 360, color: "rgba(201,154,63,0.08)" }} />
      <div aria-hidden="true" className="deco-hatch" style={{ bottom: 0, right: 0, width: 280, height: 280, color: "rgba(255,255,255,0.03)" }} />
      <div className="max-w-[1320px] mx-auto relative z-10">
        <Reveal><Kicker className="kicker--light">Reserve</Kicker></Reveal>
        <Reveal delay={120}>
          <GoldUnderlineHeading as="h2" className="text-[clamp(40px,6vw,84px)] mt-6 mb-7 tracking-[-0.02em]">
            {packageName}, {tierName} tier.
          </GoldUnderlineHeading>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-cream/78 text-[17px] max-w-[56ch] mb-10 leading-relaxed">
            We&#39;ll confirm dates, group size, and the small details — usually within the hour.
            {seedDate && <> &nbsp;·&nbsp; <em className="text-ochre not-italic">Date: {seedDate}</em></>}
            {seedPeople && <> &nbsp;·&nbsp; <em className="text-ochre not-italic">Group: {seedPeople}</em></>}
          </p>
        </Reveal>
        <Reveal delay={280}>
          <GoldButton href={waHref} variant="solid" target="_blank" rel="noopener noreferrer" className="text-[14px] px-8 py-5">
            Reserve via WhatsApp
          </GoldButton>
        </Reveal>
      </div>
    </section>
  );
}
