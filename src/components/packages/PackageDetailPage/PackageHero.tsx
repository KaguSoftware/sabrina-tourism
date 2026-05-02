import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import type { Package } from "@/lib/packages/types";

export function PackageHero({ pkg }: { pkg: Package }) {
  return (
    <section className="relative min-h-[86vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] overflow-hidden text-cream">
      <div className="absolute inset-0 z-[-1]">
        <Image src={pkg.heroImage} alt={pkg.region} fill priority className="object-cover" sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/85" />
      <div className="relative z-10 max-w-[1320px] mx-auto w-full">
        <Reveal>
          <span className="block font-mono text-[12px] tracking-[0.18em] uppercase text-cream/70 mb-7">
            <Link href="/packages" className="text-ochre hover:underline">Itineraries</Link>
            <span className="mx-2 opacity-50">/</span>
            {pkg.region}
          </span>
        </Reveal>
        <Reveal delay={140}>
          <Kicker className="kicker--light mb-5">
            {pkg.region.toUpperCase()} · {pkg.duration.toUpperCase()}
          </Kicker>
        </Reveal>
        <div className="inline-block backdrop-blur-[1px] bg-black/30 rounded-3xl px-[5%] py-5">
          <Reveal delay={260}>
            <h1 className="font-display font-light text-[clamp(48px,8vw,120px)] leading-[0.96] tracking-[-0.03em] mb-7 max-w-[16ch]">
              {pkg.name}
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="font-display italic font-light text-[clamp(18px,2vw,26px)] text-cream/88 max-w-[36ch] leading-[1.4]">
              {pkg.shortDescription}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
