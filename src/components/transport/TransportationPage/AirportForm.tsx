"use client";
import { useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { transferMessage } from "@/lib/whatsapp/whatsapp";
import { TransportFormField, fieldCls, selectCls } from "./TransportFormField";
import type { Airport, Vehicle } from "@/lib/transport/types";

interface AirportFormProps {
  vehicleId: string | null;
  setVehicleId: (id: string | null) => void;
  airports: Airport[];
  vehicles: Vehicle[];
}

export function AirportForm({ vehicleId, setVehicleId, airports, vehicles }: AirportFormProps) {
  const [airport, setAirport] = useState(airports[0]?.label ?? "");
  const [direction, setDirection] = useState<"pickup" | "dropoff">("pickup");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const vClass = vehicles.find((v) => v.id === vehicleId);
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
        <TransportFormField label="Airport">
          <select value={airport} onChange={(e) => setAirport(e.target.value)} className={selectCls}>
            {airports.map((a) => <option key={a.code} value={a.label}>{a.label}</option>)}
          </select>
        </TransportFormField>

        <TransportFormField label="Direction">
          <div className="flex gap-2">
            {(["pickup", "dropoff"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                style={direction === d
                  ? { backgroundColor: "#0b1a2e", color: "#c99a3f", border: "1.5px solid #0b1a2e", fontWeight: 600, padding: "10px 20px", borderRadius: "16px" }
                  : { backgroundColor: "#f5ede0", color: "#1f1a14", border: "1.5px solid #c99a3f", fontWeight: 400, padding: "10px 20px", borderRadius: "16px" }}
                className="flex-1 font-mono text-[12px] tracking-[0.1em] uppercase transition-all duration-200"
              >
                {d === "pickup" ? "Pick-up" : "Drop-off"}
              </button>
            ))}
          </div>
        </TransportFormField>

        <TransportFormField label="Area / Hotel">
          <input type="text" value={destination} placeholder="e.g. Sultanahmet, Istanbul"
            onChange={(e) => setDestination(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <TransportFormField label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <TransportFormField label="Time" above>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <TransportFormField label="Passengers">
          <input type="number" min="1" max="14" value={passengers}
            onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <div className="col-span-full flex flex-col sm:flex-row gap-6 items-start relative z-8">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Vehicle class *</span>
            {vClass && <span className="text-[12px] text-muted">{vClass.capacity} · {vClass.from}</span>}
            {vehicleMissing && <p className="text-[12px] text-terracotta">Please select a vehicle class.</p>}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicleId(v.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-200 rounded-xl ${
                  vehicleId === v.id ? "bg-navy border-navy text-ochre ring-2 ring-ochre" : "bg-cream-warm border-rule text-ink hover:border-ochre"
                }`}
              >
                <FleetIllustration vehicleId={v.id as "sedan" | "suv" | "van" | "luxury"} className="w-full h-[52px]" />
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
            {`Hey Sabrina — I'd like a ${direction === "pickup" ? "pickup from" : "drop-off to"} ${airport} on ${date || "—"} at ${time || "—"} for ${passengers} passenger(s), ${vClass ? vClass.label : "no vehicle selected"}. Area / Hotel: ${destination || "—"}. Could you quote?`}
          </pre>
        </div>
        <button
          type="button"
          onClick={() => { setSubmitted(true); if (!vehicleId) return; window.open(href, "_blank", "noopener,noreferrer"); }}
          className="inline-flex items-center gap-3.5 bg-ochre text-navy px-8 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-medium transition-colors duration-300 hover:bg-gold whitespace-nowrap group"
        >
          <span>Reserve via WhatsApp</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}
