import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { PremadePackageCard } from "@/components/premade-packages/PremadePackageCard/PremadePackageCard";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";
import { SECTION_HEADING } from "./constants";

interface SignatureDestinationsProps {
    packages: PremadePackagePublic[];
}

export function SignatureDestinations({ packages }: SignatureDestinationsProps) {
    return (
        <section className="relative z-10 py-[clamp(60px,8vw,100px)] px-[clamp(20px,4vw,56px)] overflow-hidden">
            {/* Rings — top-right (bigger, more layers) */}
            <div
                aria-hidden="true"
                className="hidden sm:block absolute right-[160px] top-[0px] -z-10"
            >
                {[700, 540, 380, 220, 80].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(201,154,63,${
                                0.3 + i * 0.014
                            })`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>

            {/* Diagonal hatch — bottom-right */}
            <div
                aria-hidden="true"
                className="hidden sm:block deco-hatch"
                style={{
                    bottom: -20,
                    left: 0,
                    width: 820,
                    height: 520,
                    color: "rgba(27,77,92,0.2)",
                }}
            />

            <div className="max-w-[1320px] mx-auto relative z-10">
                <div className="flex justify-between items-end gap-6 mb-12 flex-wrap">
                    <div>
                        <Reveal>
                            <Kicker>Our Group Packages</Kicker>
                        </Reveal>
                        <Reveal delay={120}>
                            <GoldUnderlineHeading
                                as="h2"
                                className="text-[clamp(36px,5vw,72px)] mt-4 tracking-[-0.02em] max-w-[18ch]"
                            >
                                {SECTION_HEADING}
                            </GoldUnderlineHeading>
                        </Reveal>
                    </div>
                    <Reveal delay={160}>
                        <Link
                            href="/packages#fixed-dates"
                            className="font-mono text-[13px] tracking-[0.16em] uppercase border-b border-ochre pb-1 transition-colors duration-200 hover:text-ochre group"
                        >
                            See all group packages{" "}
                            <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </em>
                        </Link>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
                    {packages.map((pkg, i) => (
                        <Reveal key={pkg.id} delay={i * 80}>
                            <PremadePackageCard pkg={pkg} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
