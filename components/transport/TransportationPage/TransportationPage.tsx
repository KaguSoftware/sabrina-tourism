"use client";
import { useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
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
  FLEET_HEADING,
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

function AirportForm() {
  const [airport, setAirport] = useState(AIRPORTS[0].label);
  const [direction, setDirection] = useState<"pickup" | "dropoff">("pickup");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const vClass = VEHICLES.find((v) => v.id === vehicleId);
  const vehicleMissing = submitted && !vehicleId;

  const href = vehicleId ? transferMessage({
    airport,
    direction,
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
                className={`flex-1 font-mono text-[12px] tracking-[0.1em] uppercase py-2.5 border transition-all duration-200 ${
                  direction === d
                    ? "bg-teal-deep text-cream border-teal-deep"
                    : "border-rule text-ink-soft hover:border-ochre"
                }`}
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

        <FormField label="Vehicle class *" hint={vClass ? `${vClass.capacity} · ${vClass.from}` : ""} span>
          <div className="flex flex-wrap gap-2 mt-1">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleId(v.id)}
                className={`font-mono text-[12px] tracking-[0.1em] uppercase px-4 py-2.5 border transition-all duration-200 ${
                  vehicleId === v.id
                    ? "bg-teal-deep text-cream border-teal-deep"
                    : "border-rule text-ink-soft hover:border-ochre"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          {vehicleMissing && (
            <p className="text-[12px] text-terracotta mt-1">Please select a vehicle class.</p>
          )}
        </FormField>
      </div>

      <Hairline className="my-12" />

      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1">
          <Kicker>Message preview</Kicker>
          <pre className="font-mono text-[13px] leading-[1.6] text-ink-soft whitespace-pre-wrap mt-3.5 p-4 bg-cream-warm border-l-2 border-ochre">
            {`Hello Meridian — I'd like a ${direction === "pickup" ? "pickup from" : "drop-off to"} ${airport} on ${date || "—"} at ${time || "—"} for ${passengers} passenger(s), ${vClass ? vClass.label : "no vehicle selected"}. Could you quote?`}
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

function CustomForm() {
  const [pickup, setPickup] = useState("");
  const [destinations, setDestinations] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [vehicleId, setVehicleId] = useState<string | null>(null);
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

        <FormField label="Vehicle class *" hint={vClass ? `${vClass.capacity} · ${vClass.from}` : ""} span>
          <div className="flex flex-wrap gap-2 mt-1">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleId(v.id)}
                className={`font-mono text-[12px] tracking-[0.1em] uppercase px-4 py-2.5 border transition-all duration-200 ${
                  vehicleId === v.id
                    ? "bg-teal-deep text-cream border-teal-deep"
                    : "border-rule text-ink-soft hover:border-ochre"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          {vehicleMissing && (
            <p className="text-[12px] text-terracotta mt-1">Please select a vehicle class.</p>
          )}
        </FormField>

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

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end pb-20 px-[clamp(20px,4vw,56px)] overflow-hidden text-cream">
        <div className="absolute inset-0">
          <TransportHeroSVG className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/85" />
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
      <section className="bg-cream px-[clamp(20px,4vw,56px)] py-[clamp(60px,8vw,100px)]">
        <div className="max-w-[1320px] mx-auto">
          {/* Tabs */}
          <div className="relative inline-flex border-b border-rule mb-12">
            {([["airport", "A · Airport transfer"], ["custom", "B · Custom chauffeur"]] as const).map(
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

          {mode === "airport" ? <AirportForm /> : <CustomForm />}
        </div>
      </section>

      {/* FLEET */}
      <section className="px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,130px)]">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-14">
            <Reveal><Kicker>The fleet</Kicker></Reveal>
            <Reveal delay={120}>
              <GoldUnderlineHeading as="h2" className="text-[clamp(32px,4.6vw,64px)] mt-4 tracking-[-0.02em]">
                {FLEET_HEADING}
              </GoldUnderlineHeading>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-rule">
            {VEHICLES.map((v, i) => (
              <Reveal
                key={v.id}
                delay={i * 80}
                className="px-7 py-8 border-b border-r border-rule last:border-r-0 even:lg:border-r-0 [&:nth-child(4)]:border-r-0 group hover:bg-cream-warm transition-colors duration-200"
              >
                <FleetIllustration vehicleId={v.id as "sedan"|"suv"|"van"|"luxury"} className="w-full h-[100px] mb-5" />
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-2.5">
                  {v.from}
                </p>
                <h3 className="font-display font-normal text-[28px] tracking-tight mb-4">
                  {v.label}
                </h3>
                <Hairline className="w-8 h-px bg-ochre mb-4 opacity-100" />
                <p className="text-[14px] text-ink mb-1">{v.capacity}</p>
                <p className="text-[13px] text-muted">{v.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
