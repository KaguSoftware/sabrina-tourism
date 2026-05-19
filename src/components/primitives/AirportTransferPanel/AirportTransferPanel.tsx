"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/lib/currency/context";
import { formatPrice, parseEurAmount } from "@/lib/currency/format";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { TimePicker } from "@/components/primitives/TimePicker/TimePicker";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { InfoTooltip } from "@/components/primitives/InfoTooltip/InfoTooltip";
import { GUIDE_LANGUAGES } from "@/components/transport/TransportationPage/guideOptions";
import type { GuideType } from "@/components/transport/TransportationPage/guideOptions";
import type { Airport, Vehicle } from "@/lib/transport/types";

export interface TransferDetails {
  airport: string;
  direction: "pickup" | "dropoff" | "both";
  date: string;
  time: string;
  returnDate?: string;
  returnTime?: string;
  flightNumber?: string;
  returnFlightNumber?: string;
  passengers: string;
  luggage?: string;
  vehicleSummary: string;
  childSeat: boolean;
  meetAndGreet: boolean;
  guideNeeded: boolean;
  guideType?: string;
  guideLanguage?: string;
}

interface AirportTransferPanelProps {
  airports: Airport[];
  vehicles: Vehicle[];
  hotelName: string;
  onSave: (details: TransferDetails) => void;
}

function maxCap(capacity: string) {
  const nums = capacity.match(/\d+/g);
  return nums ? parseInt(nums[nums.length - 1], 10) : Infinity;
}

const labelCls = "font-mono text-[9px] tracking-[0.22em] uppercase text-muted mb-1 block";
const selectCls = "w-full bg-cream-deep border border-rule px-2 py-1.5 text-[11px] text-ink focus:outline-none focus:border-ochre transition-colors duration-150";
const fieldCls  = "w-full bg-cream-deep border border-rule px-2 py-1.5 text-[11px] text-ink focus:outline-none focus:border-ochre transition-colors duration-150";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export function AirportTransferPanel({ airports, vehicles, hotelName, onSave }: AirportTransferPanelProps) {
  const t = useTranslations("transport.form");
  const formLocale = useLocale();
  const { currency, rates } = useCurrency();

  const displayFromPrice = (raw: string) => {
    const eur = parseEurAmount(raw);
    return eur === null ? raw : `From ${formatPrice(eur, currency, rates, formLocale)}`;
  };

  const today = new Date().toISOString().split("T")[0];

  const [airport, setAirport] = useState(airports[0]?.label ?? "");
  const [direction, setDirection] = useState<"pickup" | "dropoff" | "both">("pickup");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [luggage, setLuggage] = useState("");
  const [childSeat, setChildSeat] = useState(false);
  const [meetAndGreet, setMeetAndGreet] = useState(false);
  const [guideNeeded, setGuideNeeded] = useState(false);
  const [guideType, setGuideType] = useState<GuideType>("assistant");
  const [guideLanguage, setGuideLanguage] = useState("English");
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [vehicleQty, setVehicleQty] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const vClass = vehicles.find((v) => v.id === vehicleId);
  const pax = parseInt(passengers, 10) || 1;
  const bags = parseInt(luggage, 10) || 0;
  const singleCap = vClass ? maxCap(vClass.capacity) : Infinity;
  const singleLugCap = vClass?.luggageCapacity ?? Infinity;
  const needsMulti = vehicleId && (pax > singleCap || bags > singleLugCap);
  const totalVehCap = Object.entries(vehicleQty).reduce((s, [id, q]) => {
    const v = vehicles.find((x) => x.id === id);
    return s + (v ? maxCap(v.capacity) * q : 0);
  }, 0);
  const totalLugCap = Object.entries(vehicleQty).reduce((s, [id, q]) => {
    const v = vehicles.find((x) => x.id === id);
    return s + (v ? (v.luggageCapacity ?? 0) * q : 0);
  }, 0);
  const multiSelected = Object.values(vehicleQty).some((q) => q > 0);
  const multiCoversAll = totalVehCap >= pax && totalLugCap >= bags;

  function setQty(id: string, delta: number) {
    setVehicleQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  }

  const vehicleSummary = needsMulti && multiSelected
    ? Object.entries(vehicleQty).filter(([, q]) => q > 0)
        .map(([id, q]) => { const v = vehicles.find((x) => x.id === id); return v ? `${q}× ${v.label}` : ""; })
        .filter(Boolean).join(", ")
    : vClass ? `${vClass.label} (${vClass.capacity})` : "";

  const canSubmit = !!vehicleId && !!date && !!time &&
    (direction !== "both" || (!!returnDate && !!returnTime)) &&
    (!needsMulti || multiCoversAll);

  return (
    <div className="border border-rule bg-cream flex flex-col">

      {/* Header */}
      <div className="border-b border-rule px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ochre">Airport Transfer</p>
          <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted mt-0.5">to / from {hotelName}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* Row 1: Airport + Direction + Passengers + Luggage */}
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-2">
            <Field label={t("airport")}>
              <select value={airport} onChange={(e) => setAirport(e.target.value)} className={selectCls}>
                {airports.map((a) => <option key={a.code} value={a.label}>{a.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label={t("direction")}>
            <select value={direction} onChange={(e) => setDirection(e.target.value as typeof direction)} className={selectCls}>
              <option value="pickup">{t("pickup")}</option>
              <option value="dropoff">{t("dropoff")}</option>
              <option value="both">{t("bothWays")}</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2 col-span-1">
            <Field label={t("passengers")}>
              <input type="number" min="1" value={passengers} onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
            </Field>
            <Field label={t("luggageBags")}>
              <input type="number" min="0" max="20" value={luggage} onChange={(e) => setLuggage(e.target.value)} className={fieldCls} />
            </Field>
          </div>
        </div>

        {/* Row 2: Pick-up leg */}
        <div>
          {direction === "both" && (
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ochre whitespace-nowrap">{t("pickupLeg")}</span>
              <div className="flex-1 h-px bg-ochre/30" />
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            <Field label={direction === "both" ? t("pickupDate") : t("date")}>
              <DatePicker value={date} onChange={setDate} min={today} error={submitted && !date} />
            </Field>
            <Field label={direction === "both" ? t("pickupTime") : t("time")}>
              <TimePicker value={time} onChange={setTime} placeholder={t("time")} />
            </Field>
            <Field label={direction === "both" ? t("pickupFlightNumber") : t("flightNumber")}>
              <input type="text" value={flightNumber} placeholder={t("flightPlaceholder")} onChange={(e) => setFlightNumber(e.target.value)} className={fieldCls} />
            </Field>
          </div>
        </div>

        {/* Row 3: Return leg */}
        {direction === "both" && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ochre whitespace-nowrap">{t("returnLeg")}</span>
              <div className="flex-1 h-px bg-ochre/30" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label={t("returnDate")}>
                <DatePicker value={returnDate} onChange={setReturnDate} min={date || today} />
              </Field>
              <Field label={t("returnTime")}>
                <TimePicker value={returnTime} onChange={setReturnTime} placeholder={t("returnTime")} />
              </Field>
              <Field label={t("returnFlightNumber")}>
                <input type="text" value={returnFlightNumber} placeholder={t("returnFlightPlaceholder")} onChange={(e) => setReturnFlightNumber(e.target.value)} className={fieldCls} />
              </Field>
            </div>
          </div>
        )}

        {/* Row 4: Vehicles */}
        <div>
          <p className={labelCls}>
            {t("vehicleClass")} <span className="text-terracotta">*</span>
            {submitted && !vehicleId && <span className="ml-2 text-terracotta">{t("vehicleMissing")}</span>}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {vehicles.map((v) => {
              const cap = maxCap(v.capacity);
              const overCap = pax > cap;
              const isSelected = vehicleId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { setVehicleId(v.id); if (!overCap) setVehicleQty({}); }}
                  title={overCap ? t("fitsUpToUseMulti", { n: cap }) : undefined}
                  className={[
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg border-2 transition-all duration-150",
                    isSelected ? "border-ochre bg-ochre/10 shadow-[0_0_12px_-2px_rgba(201,154,63,0.35)]" : overCap ? "border-rule opacity-50" : "border-rule hover:border-ochre/40",
                  ].join(" ")}
                >
                  <FleetIllustration vehicleId={v.id} className="w-full h-10" selected={isSelected} />
                  <p className={`font-display text-[11px] ${isSelected ? "text-ochre" : "text-ink"}`}>{v.label}</p>
                  <p className="font-mono text-[8px] tracking-widest uppercase text-muted">{v.capacity}</p>
                  <p className={`font-mono text-[8px] tracking-widest uppercase ${isSelected ? "text-ochre" : "text-muted"}`}>{displayFromPrice(v.from)}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-vehicle */}
        {needsMulti && (
          <div className="border border-ochre/30 bg-ochre/5 p-3 space-y-2">
            <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-ochre">{t("addVehicles")}</p>
            <p className="font-sans text-[10px] text-ink-soft leading-snug">
              {t("addVehiclesHint", { label: vClass?.label ?? "", pax: singleCap, bags: singleLugCap, totalPax: pax, totalBags: bags })}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {vehicles.map((v) => {
                const qty = vehicleQty[v.id] ?? 0;
                return (
                  <div key={v.id} className="flex flex-col items-center gap-1 p-2 border border-rule bg-cream">
                    <FleetIllustration vehicleId={v.id} className="w-full h-8" />
                    <p className="font-display text-[10px] text-ink">{v.label}</p>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => setQty(v.id, -1)} className="w-5 h-5 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-xs leading-none">−</button>
                      <span className="font-mono text-[11px] text-ink min-w-[1.5ch] text-center">{qty}</span>
                      <button type="button" onClick={() => setQty(v.id, 1)} className="w-5 h-5 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-xs leading-none">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {multiSelected && (
              <div className="flex gap-4">
                <p className={`font-mono text-[9px] tracking-wide ${totalVehCap >= pax ? "text-ochre" : "text-terracotta"}`}>
                  {totalVehCap >= pax ? t("seatsCovered", { total: totalVehCap, pax }) : t("seatsNeeded", { total: totalVehCap, pax, needed: pax - totalVehCap })}
                </p>
                {bags > 0 && (
                  <p className={`font-mono text-[9px] tracking-wide ${totalLugCap >= bags ? "text-ochre" : "text-terracotta"}`}>
                    {totalLugCap >= bags ? t("bagsCovered", { total: totalLugCap, bags }) : t("bagsNeeded", { total: totalLugCap, bags, needed: bags - totalLugCap })}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Row 5: Add-ons + Guide */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={childSeat} onChange={(e) => setChildSeat(e.target.checked)} className="w-3 h-3 accent-ochre" />
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink">{t("childSeat")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={meetAndGreet} onChange={(e) => setMeetAndGreet(e.target.checked)} className="w-3 h-3 accent-ochre" />
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink">{t("meetAndGreet")}</span>
            <InfoTooltip text={t("tooltipMeetAndGreet")} />
          </label>
          <label className="flex items-center gap-2 cursor-pointer col-span-2">
            <input type="checkbox" checked={guideNeeded} onChange={(e) => setGuideNeeded(e.target.checked)} className="w-3 h-3 accent-ochre" />
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink">{t("guideNeeded")}</span>
            <InfoTooltip text={t("tooltipGuideNeeded")} />
          </label>
          {guideNeeded && (
            <>
              <Field label={t("guideType")}>
                <select value={guideType} onChange={(e) => setGuideType(e.target.value as GuideType)} className={selectCls}>
                  <option value="assistant">{t("guideAssistant")}</option>
                  <option value="certified guide">{t("guideCertified")}</option>
                </select>
              </Field>
              <Field label={t("guideLanguage")}>
                <select value={guideLanguage} onChange={(e) => setGuideLanguage(e.target.value)} className={selectCls}>
                  {GUIDE_LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </Field>
            </>
          )}
        </div>

        <p className="font-mono text-[9px] tracking-[0.12em] text-muted leading-[1.5]">{t("driverHours")}</p>
      </div>

      {/* Save button */}
      <div className="border-t border-rule p-4 mt-auto">
        {saved ? (
          <div className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-ochre/10 border border-ochre/40">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
              <path d="M1 5L4.5 8.5L11 1" stroke="#c99a3f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ochre">Transfer details saved</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              setSubmitted(true);
              if (!canSubmit) return;
              onSave({
                airport,
                direction,
                date,
                time,
                returnDate: direction === "both" ? returnDate : undefined,
                returnTime: direction === "both" ? returnTime : undefined,
                flightNumber: flightNumber || undefined,
                returnFlightNumber: direction === "both" ? (returnFlightNumber || undefined) : undefined,
                passengers,
                luggage: luggage || undefined,
                vehicleSummary,
                childSeat,
                meetAndGreet,
                guideNeeded,
                guideType: guideNeeded ? guideType : undefined,
                guideLanguage: guideNeeded ? guideLanguage : undefined,
              });
              setSaved(true);
            }}
            style={canSubmit ? { backgroundColor: "#0b1a2e", color: "#c99a3f" } : { backgroundColor: "#d6cfc7", color: "#9a9087", cursor: "not-allowed" }}
            className="inline-flex items-center justify-center gap-2 w-full px-3 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase font-semibold transition-all duration-300"
          >
            {canSubmit ? "Save transfer details" : "Save Transfer Details"}
          </button>
        )}
        {saved && (
          <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-center text-muted">
            Transfer details will be included in your WhatsApp enquiry
          </p>
        )}
      </div>
    </div>
  );
}
