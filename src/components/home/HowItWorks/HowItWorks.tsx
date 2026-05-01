"use client";
import { useRef, useEffect, useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import type { Step } from "./types";

function CompassIcon({ animate }: { animate: boolean }) {
    return (
        <svg
            viewBox="0 0 120 120"
            className="w-[100px] h-[100px]"
            aria-hidden="true"
        >
            <circle
                cx="60"
                cy="60"
                r="48"
                fill="#efe4d2"
                stroke="#1b4d5c"
                strokeWidth="2.5"
            />
            <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke="#1b4d5c"
                strokeWidth="1"
                strokeDasharray="2 6"
            />
            <text
                x="60"
                y="22"
                textAnchor="middle"
                fontFamily="var(--font-fraunces),serif"
                fontSize="10"
                fill="#1b4d5c"
            >
                N
            </text>
            <text
                x="60"
                y="107"
                textAnchor="middle"
                fontFamily="var(--font-fraunces),serif"
                fontSize="10"
                fill="#1b4d5c"
            >
                S
            </text>
            <text
                x="13"
                y="64"
                textAnchor="middle"
                fontFamily="var(--font-fraunces),serif"
                fontSize="10"
                fill="#1b4d5c"
            >
                W
            </text>
            <text
                x="107"
                y="64"
                textAnchor="middle"
                fontFamily="var(--font-fraunces),serif"
                fontSize="10"
                fill="#1b4d5c"
            >
                E
            </text>
            <g
                style={{
                    transformOrigin: "60px 60px",
                    animation: animate
                        ? "compass-spin 1400ms cubic-bezier(0.22,0.61,0.36,1) forwards"
                        : undefined,
                    transform: animate ? undefined : "rotate(140deg)",
                }}
            >
                <polygon
                    points="60,28 64,60 60,92 56,60"
                    fill="#c46b4f"
                    stroke="#1b4d5c"
                    strokeWidth="1.5"
                />
                <polygon points="60,28 64,60 56,60" fill="#c46b4f" />
                <circle cx="60" cy="60" r="4" fill="#1b4d5c" />
            </g>
        </svg>
    );
}

function SuitcaseIcon({ animate }: { animate: boolean }) {
    return (
        <svg
            viewBox="0 0 120 120"
            className="w-[100px] h-[100px]"
            aria-hidden="true"
        >
            <ellipse
                cx="60"
                cy="107"
                rx="42"
                ry="4"
                fill="#1b4d5c"
                style={{
                    opacity: animate ? 0.35 : 0,
                    transition: "opacity 800ms ease 200ms",
                }}
            />
            <rect
                x="20"
                y="48"
                width="80"
                height="56"
                rx="8"
                fill="#c99a3f"
                stroke="#1b4d5c"
                strokeWidth="2.5"
            />
            <rect
                x="36"
                y="60"
                width="48"
                height="32"
                rx="2"
                fill="#f5ede0"
                stroke="#1b4d5c"
                strokeWidth="1.5"
            />
            <line
                x1="36"
                y1="74"
                x2="84"
                y2="74"
                stroke="#1b4d5c"
                strokeWidth="1.5"
                strokeDasharray="3 3"
            />
            <g
                style={{
                    transformOrigin: "60px 50px",
                    transform: animate
                        ? "rotate(-24deg) translate(-2px,-4px)"
                        : "rotate(0deg)",
                    transition:
                        "transform 900ms cubic-bezier(0.34,1.56,0.64,1)",
                }}
            >
                <rect
                    x="20"
                    y="44"
                    width="80"
                    height="12"
                    rx="4"
                    fill="#c46b4f"
                    stroke="#1b4d5c"
                    strokeWidth="2.5"
                />
                <rect
                    x="50"
                    y="34"
                    width="20"
                    height="14"
                    rx="3"
                    fill="#c46b4f"
                    stroke="#1b4d5c"
                    strokeWidth="2.5"
                />
            </g>
        </svg>
    );
}

function WhatsAppIcon({ animate }: { animate: boolean }) {
    return (
        <svg
            viewBox="0 0 120 120"
            className="w-[100px] h-[100px]"
            aria-hidden="true"
        >
            <rect x="10" y="24" width="88" height="62" rx="12" fill="#1b4d5c" />
            <circle cx="60" cy="55" r="22" fill="#25d366" />
            <path
                d="M60 37 C49.5 37 41 45.5 41 56 C41 59.5 42 62.8 43.8 65.5 L42 72 L49 70.3 C51.6 71.8 54.7 72.7 58 72.7 C68.5 72.7 77 64.2 77 53.7 C77 43.2 68.5 37 60 37Z"
                fill="white"
                strokeDasharray="300"
                strokeDashoffset={animate ? 0 : 300}
                style={{
                    transition: animate
                        ? "stroke-dashoffset 1100ms ease 200ms"
                        : undefined,
                }}
            />
            <path
                d="M53 49.5 C53 49.5 51.5 52 52 54 C52.5 56 55 58.5 57 60 C59 61.5 62 63 64 63 C66 63 67.5 61.5 67.5 61.5 L65.5 58 L62.5 59 L60 56.5 L61 54 L58 51.5 Z"
                fill="#25d366"
            />
            <rect
                x="18"
                y="96"
                width="24"
                height="8"
                rx="2"
                fill="#c99a3f"
                opacity={animate ? 1 : 0}
                style={{ transition: "opacity 400ms ease 600ms" }}
            />
            <rect
                x="48"
                y="96"
                width="54"
                height="8"
                rx="2"
                fill="#c99a3f"
                opacity={animate ? 0.5 : 0}
                style={{ transition: "opacity 400ms ease 700ms" }}
            />
        </svg>
    );
}

function StepCard({ step, index }: { step: Step; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    setAnimate(true);
                    io.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={ref} className="pt-9 border-t border-rule relative">
            <span className="absolute top-0 left-0 w-8 h-px bg-ochre -translate-y-px" />
            <div className="mb-5">
                {step.icon === "compass" && <CompassIcon animate={animate} />}
                {step.icon === "suitcase" && <SuitcaseIcon animate={animate} />}
                {step.icon === "whatsapp" && <WhatsAppIcon animate={animate} />}
            </div>
            <span className="font-display italic text-ochre text-[24px] leading-none">
                {step.num}
            </span>
            <h3 className="font-display font-normal text-[clamp(22px,2.4vw,28px)] tracking-tight mt-3 mb-3.5">
                {step.heading}
            </h3>
            <p className="text-ink-soft text-[15px] leading-relaxed max-w-[38ch]">
                {step.body}
            </p>
        </div>
    );
}

interface HowItWorksProps {
    sectionHeading: string;
    steps: Step[];
}

export function HowItWorks({ sectionHeading, steps }: HowItWorksProps) {
    return (
        <section className="relative py-[clamp(60px,8vw,100px)] px-[clamp(20px,4vw,56px)] overflow-hidden">
            {/* Section background */}
            <div aria-hidden="true" className="absolute inset-0 bg-cream z-5" />
            {/* Diagonal hatch — top-left */}
            <div
                aria-hidden="true"
                className="deco-hatch"
                style={{
                    top: 0,
                    left: 0,
                    width: 980,
                    height: 320,
                    color: "rgba(201,154,63,0.25)",
                    zIndex: 5,
                }}
            />
            {/* Diagonal hatch — bottom-right */}
            <div
                aria-hidden="true"
                className="deco-hatch"
                style={{
                    bottom: 0,
                    right: 0,
                    width: 300,
                    height: 300,
                    color: "rgba(27,77,92,0.06)",
                    zIndex: 5,
                }}
            />
            {/* Rings — right side (bigger, more layers) */}
            <div
                aria-hidden="true"
                className="absolute right-[-160px] top-1/2 -translate-y-1/2 z-5"
            >
                {[660, 500, 340, 190, 70].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(27,77,92,${
                                0.05 + i * 0.014
                            })`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>
            {/* Rings — left side accent */}
            <div
                aria-hidden="true"
                className="absolute left-[-120px] top-1/2 -translate-y-1/2 z-5"
            >
                {[420, 270, 130].map((size, i) => (
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

            <div className="max-w-[1320px] mx-auto relative z-7">
                <div className="mb-12">
                    <Reveal>
                        <Kicker>How it works</Kicker>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[clamp(24px,4vw,64px)] border-t border-rule">
                    {steps.map((step, i) => (
                        <Reveal key={step.num} delay={i * 100}>
                            <StepCard step={step} index={i} />
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={320} className="mt-14">
                    <GoldButton
                        href={genericMessage()}
                        variant="solid"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Start a conversation
                    </GoldButton>
                </Reveal>
            </div>
        </section>
    );
}
