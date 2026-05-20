import { getLocale } from "next-intl/server";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { KenBurnsImage } from "./KenBurnsImage";
interface HeroPanoramaProps {
  headlineTop: string;
  headlineEm: string;
  sub: string;
  kicker: string;
  ctaBrowse: string;
  ctaChauffeur: string;
}

export async function HeroPanorama({
  headlineTop,
  headlineEm,
  sub,
  kicker,
  ctaBrowse,
  ctaChauffeur,
}: HeroPanoramaProps) {
  const locale = await getLocale();
  const localePfx = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return (
    <section className="relative min-h-160 md:min-h-0 md:aspect-[1716/917] max-h-screen w-full flex items-center pt-32 md:pt-[clamp(120px,18vw,200px)] pb-16 px-[clamp(20px,4vw,56px)] overflow-hidden">
      {/* Illustrated background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <KenBurnsImage src="/Istanbul_Alternative1.webp" alt="Hero panorama" />
        <div className="absolute inset-0 bg-cream/50" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-5 inline-block max-w-200">
        <div
          className="absolute -left-5 -right-56 -inset-y-6 bg-black/20 rounded-xl"
          aria-hidden="true"
        />
        <Reveal delay={140}>
          <h1 className="font-display font-semibold text-[clamp(48px,7vw,96px)] leading-[0.9] tracking-[-0.04em] text-navy mb-7">
            {headlineTop}
            <br />
            <em className="text-ochre font-bold not-italic text-[clamp(44px,6.5vw,88px)]">
              {headlineEm}
            </em>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="text-[clamp(16px,1.5vw,19px)] leading-[1.6] text-navy max-w-130 mb-11">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={460}>
          <div className="flex gap-4 flex-wrap">
            <GoldButton href={`${localePfx}/packages`} variant="solid">
              {ctaBrowse}
            </GoldButton>
            <GoldButton href={`${localePfx}/transportation`} variant="ghost-navy">
              {ctaChauffeur}
            </GoldButton>
          </div>
        </Reveal>
      </div>

      {/* Decorative rings — bottom right (bigger, more layers) */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute right-[-140px] bottom-[-140px] z-[1]"
      >
        {[700, 540, 380, 220, 80].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px solid rgba(27,77,92,${0.05 + i * 0.015})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>
      {/* Diagonal hatch — top right */}
      <div
        aria-hidden="true"
        className="hidden sm:block deco-hatch"
        style={{
          top: 0,
          right: 0,
          width: 320,
          height: 320,
          color: "rgba(27,77,92,0.06)",
          zIndex: 1,
        }}
      />
      {/* Diagonal hatch — bottom left */}
      <div
        aria-hidden="true"
        className="hidden sm:block deco-hatch"
        style={{
          bottom: 0,
          left: 0,
          width: 260,
          height: 260,
          color: "rgba(201,154,63,0.06)",
          zIndex: 1,
        }}
      />
      {/* Rings — top left (smaller accent) */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute left-[-80px] top-[-80px] z-[1]"
      >
        {[380, 240, 110].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "1px solid rgba(201,154,63,0.07)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <div
        className="absolute left-[clamp(20px,4vw,56px)] bottom-10 z-[2] flex items-center gap-3.5 text-[11px] tracking-[0.24em] uppercase text-teal-deep/70"
        aria-hidden="true"
      >
        <span className="w-14 h-px bg-teal-deep/40 relative overflow-hidden">
          <span
            className="absolute inset-0 bg-ochre"
            style={{ animation: "cue-line 2.4s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
