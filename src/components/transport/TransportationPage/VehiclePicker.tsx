"use client";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { VEHICLES } from "@/lib/transport/transport";

export function VehiclePicker({
  vehicleId,
  onSelect,
  showError,
}: {
  vehicleId: string | null;
  onSelect: (id: string) => void;
  showError: boolean;
}) {
  const vClass = VEHICLES.find((v) => v.id === vehicleId);

  return (
    <div className="col-span-full flex flex-col sm:flex-row gap-6 items-start">
      <div className="flex flex-col gap-1.5 min-w-[160px]">
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">Vehicle class *</span>
        {vClass && <span className="text-[12px] text-muted">{vClass.capacity} · {vClass.from}</span>}
        {showError && <p className="text-[12px] text-terracotta">Please select a vehicle class.</p>}
      </div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {VEHICLES.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            className={`flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-200 rounded-xl ${
              vehicleId === v.id
                ? "bg-navy border-navy text-ochre ring-2 ring-ochre"
                : "bg-cream-warm border-rule text-ink hover:border-ochre"
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
  );
}
