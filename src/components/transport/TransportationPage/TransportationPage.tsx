"use client";
import { useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Reveal } from "@/components/primitives/Reveal/Reveal";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { TransportHeroSVG } from "@/components/illustrations/TransportHeroSVG/TransportHeroSVG";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { AIRPORTS, VEHICLES } from "@/lib/transport/transport";
import { transferMessage, chauffeurMessage } from "@/lib/whatsapp/whatsapp";
import {
  HERO_HEADING_TOP,
  HERO_HEADING_EM,
  HERO_SUB,
} from "./constants";
import type { TabMode } from "./types";

function FormField({
  label,
  children,
  hint,
  span,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  span?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2.5 ${span ? "col-span-full" : ""}`}>
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

const fieldCls =
  "bg-transparent border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";
const selectCls =
  "bg-cream border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";

function AirportForm({ vehicleId, setVehicleId }: { vehicleId: string | null; setVehicleId: (id: string | null) => void }) {
  const [airport, setAirport] = useState(AIRPORTS[0].label);
  const [direction, setDirection] = useState<"pickup" | "dropoff">("pickup");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const vClass = VEHICLES.find((v) => v.id === vehicleId);
  const vehicleMissing = submitted && !vehicleId;

  const href = vehicleId ? transferMessage({
    airport,
    direction,
    destination: destination || "—",
    date: date || "—",
    time: time || "—",
    passengers,
    vehicleClass: vClass ? `${vClass.label} (${vClass.capacity})` : vehicleId,
  }) : "#";

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-8">
        <FormField label="Airport">
          <select value={airport} onChange={(e) => setAirport(e.target.value)} className={selectCls}>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.label}>{a.label}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Direction">
          <div className="flex gap-2">
            {(["pickup", "dropoff"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                style={
                  direction === d
                    ? { backgroundColor: "#0b1a2e", color: "#c99a3f", border: "1.5px solid #0b1a2e", fontWeight: 600, padding: "10px 20px", borderRadius: "16px" }
                    : { backgroundColor: "#f5ede0", color: "#1f1a14", border: "1.5px solid #c99a3f", fontWeight: 400, padding: "10px 20px", borderRadius: "16px" }
                }
                className="flex-1 font-mono text-[12px] tracking-[0.1em] uppercase transition-all duration-200"
              >
                {d === "pickup" ? "Pick-up" : "Drop-off"}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Area / Hotel">
          <input type="text" value={destination} placeholder="e.g. Sultanahmet, Istanbul"
            onChange={(e) => setDestination(e.target.value)} className={fieldCls} />
        </FormField>

        <FormField label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldCls} />
        </FormField>

        <FormField label="Time">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={fieldCls} />
        </FormField>

        <FormField label="Passengers">
          <input type="number" min="1" max="14" value={passengers}
            onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
        </FormField>

        <div className="col-span-full flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Vehicle class *</span>
            {vClass && <span className="text-[12px] text-muted">{vClass.capacity} · {vClass.from}</span>}
            {vehicleMissing && <p className="text-[12px] text-terracotta">Please select a vehicle class.</p>}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleId(v.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-200 rounded-xl ${
                  vehicleId === v.id
                    ? "bg-navy border-navy text-ochre ring-2 ring-ochre"
                    : "bg-cream-warm border-rule text-ink hover:border-ochre"
                }`}
              >
                <FleetIllustration vehicleId={v.id as "sedan"|"suv"|"van"|"luxury"} className="w-full h-[52px]" />
                <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ochre">{v.from}</span>
                <span className="text-[11px] text-muted">{v.capacity}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Hairline className="my-12" />

      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1">
          <Kicker>Message preview</Kicker>
          <pre className="font-mono text-[13px] leading-[1.6] text-ink-soft whitespace-pre-wrap mt-3.5 p-4 bg-cream-warm border-l-2 border-ochre">
            {`Hello Meridian — I'd like a ${direction === "pickup" ? "pickup from" : "drop-off to"} ${airport} on ${date || "—"} at ${time || "—"} for ${passengers} passenger(s), ${vClass ? vClass.label : "no vehicle selected"}. Area / Hotel: ${destination || "—"}. Could you quote?`}
          </pre>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(true);
            if (!vehicleId) return;
            window.open(href, "_blank", "noopener,noreferrer");
          }}
          className="inline-flex items-center gap-3.5 bg-ochre text-navy px-8 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-medium transition-colors duration-300 hover:bg-gold whitespace-nowrap group"
        >
          <span>Reserve via WhatsApp</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}

function CustomForm({ vehicleId, setVehicleId }: { vehicleId: string | null; setVehicleId: (id: string | null) => void }) {
  const [pickup, setPickup] = useState("");
  const [destinations, setDestinations] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const vClass = VEHICLES.find((v) => v.id === vehicleId);
  const vehicleMissing = submitted && !vehicleId;
  const href = vehicleId ? chauffeurMessage({
    pickup: pickup || "—",
    destinations: destinations || "—",
    startDate: startDate || "—",
    endDate: endDate || undefined,
    passengers,
    vehicleClass: vClass ? `${vClass.label} (${vClass.capacity})` : vehicleId,
  }) : "#";

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-8">
        <FormField label="Pickup location">
          <input type="text" value={pickup} placeholder="Hotel, address, neighbourhood"
            onChange={(e) => setPickup(e.target.value)} className={fieldCls} />
        </FormField>

        <FormField label="Start date">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={fieldCls} />
        </FormField>

        <FormField label="End date (optional)">
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={fieldCls} />
        </FormField>

        <FormField label="Passengers">
          <input type="number" min="1" max="14" value={passengers}
            onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
        </FormField>

        <div className="col-span-full flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Vehicle class *</span>
            {vClass && <span className="text-[12px] text-muted">{vClass.capacity} · {vClass.from}</span>}
            {vehicleMissing && <p className="text-[12px] text-terracotta">Please select a vehicle class.</p>}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleId(v.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-200 rounded-xl ${
                  vehicleId === v.id
                    ? "bg-navy border-navy text-ochre ring-2 ring-ochre"
                    : "bg-cream-warm border-rule text-ink hover:border-ochre"
                }`}
              >
                <FleetIllustration vehicleId={v.id as "sedan"|"suv"|"van"|"luxury"} className="w-full h-[52px]" />
                <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ochre">{v.from}</span>
                <span className="text-[11px] text-muted">{v.capacity}</span>
              </button>
            ))}
          </div>
        </div>

        <FormField label="Destinations & stops" span>
          <textarea
            value={destinations}
            placeholder="List your stops, e.g. Cappadocia → Konya → Antalya"
            onChange={(e) => setDestinations(e.target.value)}
            rows={3}
            className="bg-transparent border border-rule text-ink font-sans text-[16px] px-3 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200 resize-none"
          />
        </FormField>
      </div>

      <Hairline className="my-12" />

      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1">
          <Kicker>Message preview</Kicker>
          <pre className="font-mono text-[13px] leading-[1.6] text-ink-soft whitespace-pre-wrap mt-3.5 p-4 bg-cream-warm border-l-2 border-ochre">
            {`Hello Meridian — I'd like a private chauffeur. Pickup: ${pickup || "—"}. Destinations: ${destinations || "—"}. Dates: ${startDate || "—"}${endDate ? ` to ${endDate}` : ""}. Passengers: ${passengers}. Vehicle: ${vClass ? vClass.label : "no vehicle selected"}. Could you quote?`}
          </pre>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(true);
            if (!vehicleId) return;
            window.open(href, "_blank", "noopener,noreferrer");
          }}
          className="inline-flex items-center gap-3.5 bg-ochre text-navy px-8 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-medium transition-colors duration-300 hover:bg-gold whitespace-nowrap group"
        >
          <span>Reserve via WhatsApp</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}

export function TransportationPage() {
  const [mode, setMode] = useState<TabMode>("airport");
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  return (
    <main>
      {/* HERO */}
      <section className="relative z-10 min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] overflow-hidden text-cream">
        <div className="absolute inset-0">
          <TransportHeroSVG className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/85" />
        {/* Diagonal hatch — top-right */}
        <div aria-hidden="true" className="deco-hatch" style={{ top: 0, right: 0, width: 380, height: 380, color: "rgba(201,154,63,0.1)" }} />
        {/* Diagonal hatch — bottom-left */}
        <div aria-hidden="true" className="deco-hatch" style={{ bottom: 0, left: 0, width: 300, height: 300, color: "rgba(255,255,255,0.04)" }} />
        {/* Rings — bottom-right (bigger, more layers) */}
        <div aria-hidden="true" className="absolute right-[-160px] bottom-[-160px] -z-10">
          {[640, 480, 320, 170, 60].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.04 + i * 0.012})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        {/* Rings — top-left accent */}
        <div aria-hidden="true" className="absolute left-[-100px] top-[-100px] -z-10">
          {[420, 270, 130].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(201,154,63,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <Reveal>
            <Kicker className="kicker--light">Private chauffeur</Kicker>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="font-display font-light text-[clamp(40px,7vw,96px)] leading-[0.98] tracking-[-0.025em] mt-6 mb-7 max-w-[16ch]">
              {HERO_HEADING_TOP}
              <br />
              <em className="text-ochre font-light not-italic">{HERO_HEADING_EM}</em>
            </h1>
          </Reveal>
          <Reveal delay={280}>
            <p className="text-cream/78 max-w-[56ch] text-[clamp(15px,1.4vw,18px)] leading-[1.6]">
              {HERO_SUB}
            </p>
          </Reveal>
        </div>
      </section>

      {/* TABBED FORM */}
      <section className="relative z-10 bg-cream px-[clamp(20px,4vw,56px)] py-[clamp(60px,8vw,100px)] overflow-hidden">
        {/* Rings — right side */}
        <div aria-hidden="true" className="absolute right-[-160px] top-1/2 -translate-y-1/2 -z-10">
          {[920, 700, 500, 300, 110].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(201,154,63,${0.12 + i * 0.025})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        {/* Rings — left side accent */}
        <div aria-hidden="true" className="absolute left-[-120px] bottom-[-80px] -z-10">
          {[640, 440, 240].map((size, i) => (
            <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(27,77,92,${0.13 + i * 0.03})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="max-w-[1320px] mx-auto relative z-10">
          {/* Tabs */}
          <div className="relative inline-flex gap-4 border-b border-rule mb-12">
            {([["airport", "Airport Transfer"], ["custom", "Custom Chauffeur"]] as const).map(
              ([val, label]) => (
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
              )
            )}
            {/* animated rail */}
            <span
              className="absolute bottom-0 h-0.5 bg-ochre w-1/2 transition-transform duration-[420ms] ease-out"
              style={{ transform: mode === "airport" ? "translateX(0)" : "translateX(100%)" }}
              aria-hidden="true"
            />
          </div>

          {mode === "airport"
            ? <AirportForm vehicleId={vehicleId} setVehicleId={setVehicleId} />
            : <CustomForm vehicleId={vehicleId} setVehicleId={setVehicleId} />}
        </div>
      </section>

    </main>
  );
}
