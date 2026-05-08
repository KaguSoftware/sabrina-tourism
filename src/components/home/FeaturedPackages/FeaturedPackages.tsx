import Link from "next/link";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { DailyPackageCard } from "@/components/daily/DailyPackageCard/DailyPackageCard";
import type { DailyPackage } from "@/lib/daily/types";

interface FeaturedPackagesProps {
  sectionHeading: string;
  packages: DailyPackage[];
}

export function FeaturedPackages({ sectionHeading, packages }: FeaturedPackagesProps) {
    return (
        <section className="relative z-10  py-[clamp(60px,8vw,100px)] px-[clamp(20px,4vw,56px)] overflow-hidden">
            {/* Diagonal hatch — top-right */}
            <div
                aria-hidden="true"
                className="hidden sm:block deco-hatch"
                style={{
                    top: 0,
                    right: 0,
                    width: 850,
                    height: 500,
                    color: "rgba(201,154,63,0.25)",
                }}
            />

            {/* Rings — bottom-right */}
            <div
                aria-hidden="true"
                className="hidden sm:block absolute right-[-140px] bottom-[-140px] -z-10"
            >
                {[960, 720, 500, 290, 110].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(201,154,63,${
                                0.18 + i * 0.28
                            })`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>

            <div className="max-w-[1320px] mx-auto relative z-10">
                {/* Head */}
                <div className="flex justify-between items-end gap-6 mb-12 flex-wrap">
                    <div>
                        <Reveal>
                            <Kicker>Our Daily Packages</Kicker>
                        </Reveal>
                        <Reveal delay={120}>
                            <GoldUnderlineHeading
                                as="h2"
                                className="text-[clamp(36px,5vw,72px)] mt-4 tracking-[-0.02em] max-w-[18ch]"
                            >
                                {sectionHeading}
                            </GoldUnderlineHeading>
                        </Reveal>
                    </div>
                    <Reveal delay={160}>
                        <Link
                            href="/packages#daily"
                            className="font-mono text-[13px] tracking-[0.16em] uppercase border-b border-ochre pb-1 transition-colors duration-200 hover:text-ochre group"
                        >
                            See all daily packages{" "}
                            <em className="not-italic inline-block transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </em>
                        </Link>
                    </Reveal>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(20px,2.5vw,36px)]">
                    {packages.map((pkg, i) => (
                        <Reveal key={pkg.id} delay={i * 80}>
                            <DailyPackageCard pkg={pkg} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
