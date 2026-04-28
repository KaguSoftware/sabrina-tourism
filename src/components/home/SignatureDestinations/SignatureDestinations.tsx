import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { SIGNATURE_DESTINATIONS } from "@/lib/signatures/signatures";
import { SECTION_HEADING } from "./constants";

export function SignatureDestinations() {
  return (
    <section className="relative z-10 py-[clamp(80px,10vw,130px)] px-[clamp(20px,4vw,56px)]">
      <div className="max-w-[1320px] mx-auto">
        <div className="mb-14">
          <Reveal>
            <Kicker>Signature destinations</Kicker>
          </Reveal>
          <Reveal delay={120}>
            <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em] max-w-[18ch]">
              {SECTION_HEADING}
            </GoldUnderlineHeading>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIGNATURE_DESTINATIONS.map((dest, i) => (
            <Reveal key={dest.name} delay={i * 80}>
              <Link
                href={`/packages?region=${encodeURIComponent(dest.region)}`}
                className="block group"
              >
                <div className="bg-[#fcf5ec] transition-all duration-380 ease-out group-hover:transform-[perspective(1000px)_rotateY(-4deg)_rotateX(3deg)_translateY(-6px)] group-hover:[box-shadow:14px_20px_0_-2px_#1b4d5c] border border-rule">
                  {/* Image */}
                  <div className="relative aspect-[3/4.2] overflow-hidden bg-navy-soft">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-1200 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  {/* Caption */}
                  <div className="pt-4 pb-4 px-4">
                    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-1.5">
                      {dest.kicker}
                    </p>
                    <h3 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-0.01em] mb-2.5">
                      {dest.name}
                    </h3>
                    <span className="inline-block font-mono text-[12px] tracking-[0.16em] uppercase relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-px after:bg-ochre after:w-[30%] after:transition-all after:duration-300 group-hover:after:w-full">
                      Itineraries →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
