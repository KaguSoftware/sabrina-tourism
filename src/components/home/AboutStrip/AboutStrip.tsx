import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
interface AboutStripProps {
  heading: string;
  body: string;
}

export function AboutStrip({ heading, body }: AboutStripProps) {
    return (
        <section className="relative z-10 bg-cream py-[clamp(60px,9vw,120px)] px-[clamp(20px,4vw,56px)] overflow-hidden">
            {/* Concentric rings — bottom-left */}
            <div
                aria-hidden="true"
                className="absolute left-[30px] bottom-[-160px] -z-10"
            >
                {[980, 760, 540, 320, 130].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(27,77,92,${
                                0.2 + i * 0.03
                            })`,
                            top: "50%",
                            left: "20%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>
            {/* Rings — top-right accent */}
            <div
                aria-hidden="true"
                className="absolute right-[80px] top-[50px] -z-10"
            >
                {[680, 480, 280, 110].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(201,154,63,${
                                0.3 + i * 0.025
                            })`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>

            <div className="max-w-[920px] mx-auto relative z-10">
                <Reveal>
                    <Kicker>About — Est. 2014</Kicker>
                </Reveal>
                <Reveal delay={120}>
                    <GoldUnderlineHeading
                        as="h2"
                        className="text-[clamp(32px,4.2vw,58px)] mt-6 mb-8 max-w-[22ch]"
                    >
                        {heading}
                    </GoldUnderlineHeading>
                </Reveal>
                <Reveal delay={240}>
                    <p className="text-[clamp(17px,1.5vw,21px)] leading-[1.7] text-ink-soft max-w-[65ch]">
                        {body}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
