"use client";
import { useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { AIRPORTS, VEHICLES } from "@/lib/transport/transport";
import { transferMessage } from "@/lib/whatsapp/whatsapp";
import { FormField, fieldCls, selectCls } from "./FormField";
import { VehiclePicker } from "./VehiclePicker";

export function AirportForm({ vehicleId, setVehicleId }: { vehicleId: string | null; setVehicleId: (id: string | null) => void }) {
  const [airport, setAirport] = useState(AIRPORTS[0].label);
  const [direction, setDirection] = useState<"pickup" | "dropoff">("pickup");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const vClass = VEHICLES.find((v) => v.id === vehicleId);

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

        <VehiclePicker
          vehicleId={vehicleId}
          onSelect={setVehicleId}
          showError={submitted && !vehicleId}
        />
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
