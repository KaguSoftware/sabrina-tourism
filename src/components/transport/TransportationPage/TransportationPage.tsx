"use client";
import { useState } from "react";
import Image from "next/image";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { AirportForm } from "./AirportForm";
import { CustomForm } from "./CustomForm";
import type { TabMode } from "./types";
import type { Airport, Vehicle } from "@/lib/transport/types";

interface TransportationPageProps {
  heroHeadingTop: string;
  heroHeadingEm: string;
  heroSub: string;
  airports: Airport[];
  vehicles: Vehicle[];
}

export function TransportationPage({ heroHeadingTop, heroHeadingEm, heroSub, airports, vehicles }: TransportationPageProps) {
  const [mode, setMode] = useState<TabMode>("airport");
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] overflow-hidden text-cream">
        <div className="absolute inset-0">
          <Image src="/chauffer.png" alt="Chauffeur hero" fill className="object-cover object-right md:object-right" style={{ objectPosition: "right 70%" }} priority />
        </div>
        <div className="absolute inset-0 bg-white/70 md:bg-transparent" />
        <div aria-hidden="true" className="deco-hatch" style={{ top: 0, right: 0, width: 380, height: 380, color: "rgba(201,154,63,0.1)", zIndex: 1 }} />
        <div aria-hidden="true" className="deco-hatch" style={{ bottom: 0, left: 0, width: 300, height: 300, color: "rgba(255,255,255,0.04)", zIndex: 1 }} />
        <div aria-hidden="true" className="absolute right-[-160px] bottom-[-160px] z-1">
          {[640, 480, 320, 170, 60].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.04 + i * 0.012})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div aria-hidden="true" className="absolute left-[-100px] top-[-100px] z-1">
          {[420, 270, 130].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(201,154,63,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative z-7 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker className="kicker--dark">Private chauffeur</Kicker>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-display font-light text-[clamp(40px,7vw,96px)] leading-[0.98] tracking-[-0.025em] mt-6 mb-7 max-w-[16ch]">
              <span className="text-teal-deep">{heroHeadingTop}</span>
              <br />
              <em className="text-ochre font-light not-italic">{heroHeadingEm}</em>
            </h1>
          </Reveal>
          <Reveal delay={280}>
            <p className="text-navy/78 max-w-[56ch] text-[clamp(15px,1.4vw,18px)] leading-[1.6]">
              {heroSub}
            </p>
          </Reveal>
        </div>
      </section>

      {/* TABBED FORM */}
      <section className="relative px-[clamp(20px,4vw,56px)] py-[clamp(60px,8vw,100px)] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-cream z-5" />
        <div aria-hidden="true" className="absolute right-[-160px] top-1/2 -translate-y-1/2 z-5">
          {[920, 700, 500, 300, 110].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(201,154,63,${0.12 + i * 0.025})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div aria-hidden="true" className="absolute left-[-120px] bottom-[-80px] z-5">
          {[640, 440, 240].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(27,77,92,${0.13 + i * 0.03})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="max-w-[1320px] mx-auto relative z-7">
          <div className="relative inline-flex gap-4 border-b border-rule mb-12">
            {([["airport", "Airport Transfer"], ["custom", "Custom Chauffeur"]] as const).map(([val, label]) => (
              <button
                key={val}
                role="tab"
                aria-selected={mode === val}
                onClick={() => setMode(val)}
                className={`flex items-center gap-3 px-8 py-4.5 font-mono text-[13px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                  mode === val ? "text-ink" : "text-muted hover:text-ink-soft"
                }`}
              >
                {label}
              </button>
            ))}
            <span
              className="absolute bottom-0 h-0.5 bg-ochre w-1/2 transition-transform duration-[420ms] ease-out"
              style={{ transform: mode === "airport" ? "translateX(0)" : "translateX(100%)" }}
              aria-hidden="true"
            />
          </div>

          {mode === "airport"
            ? <AirportForm vehicleId={vehicleId} setVehicleId={setVehicleId} airports={airports} vehicles={vehicles} />
            : <CustomForm vehicleId={vehicleId} setVehicleId={setVehicleId} vehicles={vehicles} />}
        </div>
      </section>
    </>
  );
}
