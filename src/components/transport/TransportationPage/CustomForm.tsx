"use client";
import { useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { VEHICLES } from "@/lib/transport/transport";
import { chauffeurMessage } from "@/lib/whatsapp/whatsapp";
import { FormField, fieldCls } from "./FormField";
import { VehiclePicker } from "./VehiclePicker";

export function CustomForm({ vehicleId, setVehicleId }: { vehicleId: string | null; setVehicleId: (id: string | null) => void }) {
  const [pickup, setPickup] = useState("");
  const [destinations, setDestinations] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const vClass = VEHICLES.find((v) => v.id === vehicleId);

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

        <VehiclePicker
          vehicleId={vehicleId}
          onSelect={setVehicleId}
          showError={submitted && !vehicleId}
        />

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
