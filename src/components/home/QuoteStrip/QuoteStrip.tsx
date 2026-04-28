import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { QUOTE, ATTRIBUTION } from "./constants";

export function QuoteStrip() {
    return (
        <section className="relative text-cream py-[clamp(40px,6vw,80px)] px-[clamp(20px,4vw,56px)] overflow-hidden">
            {/* Navy bg at z-10 — plane (z:20) floats above this */}
            <div className="absolute inset-0 bg-navy" style={{ zIndex: 10 }} />

            {/* Rings — left */}
            <div
                aria-hidden="true"
                className="absolute left-[-120px] top-3/4 -translate-y-1/2"
                style={{ zIndex: 11 }}
            >
                {[570, 440, 260, 90].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(255,255,255,${0.1 + i * 0.025})`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>
            {/* Rings — right */}
            <div
                aria-hidden="true"
                className="absolute right-[-180px] top-1/4 -translate-y-1/2"
                style={{ zIndex: 11 }}
            >
                {[760, 560, 360, 160].map((size, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            border: `1px solid rgba(255,255,255,${0.1 + i * 0.025})`,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    />
                ))}
            </div>

            {/* Text at z-30 — above the plane (z:20) */}
            <div className="max-w-[880px] mx-auto text-center relative" style={{ zIndex: 30 }}>
                <Reveal>
                    <p
                        className="font-display italic text-ochre text-[120px] leading-[0.6] mb-5"
                        aria-hidden="true"
                    >
                        "
                    </p>
                    <blockquote className="font-display font-light italic text-[clamp(24px,3vw,42px)] leading-[1.35] tracking-[-0.012em] mb-8">
                        {QUOTE}
                    </blockquote>
                    <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-cream/55">
                        {ATTRIBUTION}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
