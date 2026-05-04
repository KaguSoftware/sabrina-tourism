"use client";
import { useState } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { chauffeurMessage } from "@/lib/whatsapp/whatsapp";
import { TransportFormField, fieldCls } from "./TransportFormField";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import type { Vehicle } from "@/lib/transport/types";

interface CustomFormProps {
  vehicleId: string | null;
  setVehicleId: (id: string | null) => void;
  vehicles: Vehicle[];
}

export function CustomForm({ vehicleId, setVehicleId, vehicles }: CustomFormProps) {
  const [pickup, setPickup] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [destinations, setDestinations] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [luggage, setLuggage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const vClass = vehicles.find((v) => v.id === vehicleId);

  function maxCapacity(v: typeof vClass) {
    if (!v) return Infinity;
    const m = v.capacity.match(/(\d+)\s*(?:–|-)\s*(\d+)/);
    return m ? parseInt(m[2], 10) : Infinity;
  }

  const pax = parseInt(passengers, 10) || 1;
  const vehicleMissing = submitted && !vehicleId;
  const pickupMissing = submitted && !pickup.trim();
  const dateMissing = submitted && !startDate;
  const capacityError = vehicleId && pax > maxCapacity(vClass)
    ? `${vClass!.label} fits up to ${maxCapacity(vClass)} passengers.`
    : null;

  const canSubmit = !!vehicleId && !!pickup.trim() && !!startDate && !capacityError;

  const href = vehicleId ? chauffeurMessage({
    pickup: pickup || "—",
    destinations: destinations || "—",
    startDate: startDate || "—",
    endDate: endDate || undefined,
    pickupTime: pickupTime || undefined,
    passengers,
    luggage: luggage || undefined,
    vehicleClass: vClass ? `${vClass.label} (${vClass.capacity})` : vehicleId,
  }) : "#";

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-8">
        <TransportFormField label="Pickup location *" hint={pickupMissing ? "Required" : undefined}>
          <input type="text" value={pickup} placeholder="Hotel, address, neighbourhood"
            onChange={(e) => setPickup(e.target.value)}
            className={`${fieldCls} ${pickupMissing ? "border-terracotta" : ""}`} />
        </TransportFormField>

        <TransportFormField label="Pickup time" above>
          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <TransportFormField label="Start date *" hint={dateMissing ? "Required" : undefined}>
          <DatePicker value={startDate} onChange={setStartDate} min={today} error={dateMissing} />
        </TransportFormField>

        <TransportFormField label="End date">
          <DatePicker value={endDate} onChange={setEndDate} min={startDate || today} />
        </TransportFormField>

        <TransportFormField label="Passengers">
          <input type="number" min="1" max="14" value={passengers}
            onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <TransportFormField label="Luggage bags">
          <input type="number" min="0" max="20" value={luggage}
            onChange={(e) => setLuggage(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <div className="col-span-full flex flex-col sm:flex-row gap-6 items-start relative z-8">
          <div className="flex flex-col gap-1.5 min-w-40">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Vehicle class *</span>
            {vClass && <span className="text-[12px] text-muted">{vClass.capacity} · {vClass.from}</span>}
            {vehicleMissing && <p className="text-[12px] text-terracotta">Please select a vehicle class.</p>}
            {capacityError && <p className="text-[12px] text-terracotta">{capacityError}</p>}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vehicles.map((v) => {
              const overCapacity = pax > maxCapacity(vehicles.find((x) => x.id === v.id));
              return (
              <button
                key={v.id}
                type="button"
                onClick={() => !overCapacity && setVehicleId(v.id)}
                disabled={overCapacity}
                title={overCapacity ? `Fits up to ${maxCapacity(vehicles.find((x) => x.id === v.id))} passengers` : undefined}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-200 rounded-xl ${
                  overCapacity
                    ? "opacity-40 cursor-not-allowed border-rule bg-cream-warm text-muted"
                    : vehicleId === v.id
                    ? "bg-navy border-navy text-ochre ring-2 ring-ochre"
                    : "bg-cream-warm border-rule text-ink hover:border-ochre"
                }`}
              >
                <FleetIllustration vehicleId={v.id} className="w-full h-13" />
                <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ochre">{v.from}</span>
                <span className="text-[11px] text-muted">{v.capacity}</span>
              </button>
              );
            })}
          </div>
        </div>

        <TransportFormField label="Destinations & stops" span>
          <textarea
            value={destinations}
            placeholder="List your stops, e.g. Cappadocia → Konya → Antalya"
            onChange={(e) => setDestinations(e.target.value)}
            rows={3}
            className="bg-transparent border border-rule text-ink font-sans text-[16px] px-3 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200 resize-none"
          />
        </TransportFormField>
      </div>

      <Hairline className="my-12" />

      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1">
          <Kicker>Message preview</Kicker>
          <pre className="font-mono text-[13px] leading-[1.6] text-ink-soft whitespace-pre-wrap mt-3.5 p-4 bg-cream-warm border-l-2 border-ochre">
            {`Hey Sabrina — I'd like a private chauffeur. Pickup: ${pickup || "—"}.${pickupTime ? ` Pickup time: ${pickupTime}.` : ""} Destinations: ${destinations || "—"}. Dates: ${startDate || "—"}${endDate ? ` to ${endDate}` : ""}. Passengers: ${passengers}.${luggage ? ` Luggage: ${luggage} bag(s).` : ""} Vehicle: ${vClass ? vClass.label : "no vehicle selected"}. Could you quote?`}
          </pre>
        </div>
        <button
          type="button"
          onClick={() => { setSubmitted(true); if (!canSubmit) return; window.open(href, "_blank", "noopener,noreferrer"); }}
          style={{ backgroundColor: "#8B9A5B", color: "#c99a3f" }}
          className="inline-flex items-center gap-3.5 px-8 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-semibold shadow-[0_4px_32px_-6px_rgba(11,26,46,0.45)] transition-all duration-300 hover:shadow-[0_8px_40px_-6px_rgba(11,26,46,0.35)] hover:scale-[1.02] active:scale-[0.99] whitespace-nowrap group"
        >
          <span>Reserve via WhatsApp</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}
