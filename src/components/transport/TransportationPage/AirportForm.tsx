"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { transferMessage } from "@/lib/whatsapp/whatsapp";
import { TransportFormField, fieldCls, selectCls } from "./TransportFormField";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { GUIDE_LANGUAGES } from "./guideOptions";
import type { GuideType } from "./guideOptions";
import type { Airport, Vehicle } from "@/lib/transport/types";

interface AirportFormProps {
  vehicleId: string | null;
  setVehicleId: (id: string | null) => void;
  airports: Airport[];
  vehicles: Vehicle[];
}

export function AirportForm({ vehicleId, setVehicleId, airports, vehicles }: AirportFormProps) {
  const t = useTranslations("transport.form");
  const [airport, setAirport] = useState(airports[0]?.label ?? "");
  const [direction, setDirection] = useState<"pickup" | "dropoff" | "both">("pickup");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [flightNumber, setFlightNumber] = useState("");
  const [luggage, setLuggage] = useState("");
  const [childSeat, setChildSeat] = useState(false);
  const [meetAndGreet, setMeetAndGreet] = useState(false);
  const [guideNeeded, setGuideNeeded] = useState(false);
  const [guideType, setGuideType] = useState<GuideType>("assistant");
  const [guideLanguage, setGuideLanguage] = useState("English");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const vClass = vehicles.find((v) => v.id === vehicleId);
  const [vehicleQty, setVehicleQty] = useState<Record<string, number>>({});

  function maxCapacity(v: typeof vClass) {
    if (!v) return Infinity;
    const nums = v.capacity.match(/\d+/g);
    return nums ? parseInt(nums[nums.length - 1], 10) : Infinity;
  }

  const pax = parseInt(passengers, 10) || 1;
  const bags = parseInt(luggage, 10) || 0;
  const singleVehicleCapacity = maxCapacity(vClass);
  const singleLuggageCapacity = vClass?.luggageCapacity ?? Infinity;
  const needsMultiVehicle = vehicleId && (pax > singleVehicleCapacity || bags > singleLuggageCapacity);
  const totalVehicleCapacity = Object.entries(vehicleQty).reduce((sum, [id, qty]) => {
    const v = vehicles.find((x) => x.id === id);
    return sum + (v ? maxCapacity(v) * qty : 0);
  }, 0);
  const totalLuggageCapacity = Object.entries(vehicleQty).reduce((sum, [id, qty]) => {
    const v = vehicles.find((x) => x.id === id);
    return sum + (v ? (v.luggageCapacity ?? 0) * qty : 0);
  }, 0);
  const multiVehicleSelected = Object.values(vehicleQty).some((q) => q > 0);
  const multiVehicleCoversPax = totalVehicleCapacity >= pax;
  const multiVehicleCoversbags = totalLuggageCapacity >= bags;
  const multiVehicleCoversAll = multiVehicleCoversPax && multiVehicleCoversbags;
  const luggageExceedsSingle = vehicleId && bags > 0 && bags > singleLuggageCapacity && !needsMultiVehicle;
  const luggageExceedsMulti = needsMultiVehicle && multiVehicleSelected && bags > 0 && !multiVehicleCoversbags;

  const vehicleMissing = submitted && !vehicleId;
  const dateMissing = submitted && !date;
  const timeMissing = submitted && !time;

  const canSubmit = !!vehicleId && !!date && !!time && !!destination.trim() &&
    (direction !== "both" || (!!returnDate && !!returnTime)) &&
    (!needsMultiVehicle || multiVehicleCoversAll);

  function setQty(id: string, delta: number) {
    setVehicleQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  }

  const vehicleSummary = needsMultiVehicle && multiVehicleSelected
    ? Object.entries(vehicleQty).filter(([, q]) => q > 0)
        .map(([id, q]) => { const v = vehicles.find((x) => x.id === id); return v ? `${q}× ${v.label}` : ""; })
        .filter(Boolean).join(", ")
    : vClass ? `${vClass.label} (${vClass.capacity})` : String(vehicleId);

  const href = vehicleId ? transferMessage({
    airport,
    direction,
    destination: destination || "—",
    date: date || "—",
    time: time || "—",
    passengers,
    vehicleClass: vehicleSummary,
    flightNumber: flightNumber || undefined,
    luggage: luggage || undefined,
    childSeat: childSeat || undefined,
    meetAndGreet: meetAndGreet || undefined,
    guideNeeded,
    guideType,
    guideLanguage,
    returnDate: direction === "both" ? (returnDate || "—") : undefined,
    returnTime: direction === "both" ? (returnTime || "—") : undefined,
    returnFlightNumber: direction === "both" ? (returnFlightNumber || undefined) : undefined,
  }) : "#";

  return (
    <div className="space-y-10">

      {/* ── Section 1: Trip basics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        <TransportFormField label={t("airport")}>
          <select value={airport} onChange={(e) => setAirport(e.target.value)} className={selectCls}>
            {airports.map((a) => <option key={a.code} value={a.label}>{a.label}</option>)}
          </select>
        </TransportFormField>

        <TransportFormField label={t("direction")}>
          <div className="flex gap-2 h-full">
            {(["pickup", "both", "dropoff"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                style={direction === d
                  ? { backgroundColor: "#0b1a2e", color: "#c99a3f", border: "1.5px solid #0b1a2e", fontWeight: 600, borderRadius: "16px" }
                  : { backgroundColor: "#f5ede0", color: "#1f1a14", border: "1.5px solid #c99a3f", fontWeight: 400, borderRadius: "16px" }}
                className="flex-1 font-mono text-[11px] tracking-[0.08em] uppercase transition-all duration-200 px-2 py-[10px]"
              >
                {d === "pickup" ? t("pickup") : d === "dropoff" ? t("dropoff") : t("bothWays")}
              </button>
            ))}
          </div>
        </TransportFormField>

        <TransportFormField label={t("areaHotel")}>
          <input type="text" value={destination} placeholder={t("areaPlaceholder")}
            onChange={(e) => setDestination(e.target.value)} className={fieldCls} />
        </TransportFormField>

        <TransportFormField label={t("passengers")}>
          <input type="number" min="1" value={passengers}
            onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
        </TransportFormField>
      </div>

      {/* ── Section 2: Schedule ── */}
      <div>
        {/* Pick-up leg label when both-ways */}
        {direction === "both" && (
          <div className="flex items-center gap-4 mb-5">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ochre whitespace-nowrap">{t("pickupLeg")}</span>
            <div className="flex-1 h-px bg-ochre/30" />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          <TransportFormField label={direction === "both" ? t("pickupDate") : t("date")} hint={dateMissing ? t("requiredHint") : undefined}>
            <DatePicker value={date} onChange={setDate} min={today} error={dateMissing} />
          </TransportFormField>
          <TransportFormField label={direction === "both" ? t("pickupTime") : t("time")} above hint={timeMissing ? t("requiredHint") : undefined}>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className={`${fieldCls} ${timeMissing ? "border-terracotta" : ""}`} />
          </TransportFormField>
          <TransportFormField label={direction === "both" ? t("pickupFlightNumber") : t("flightNumber")}>
            <input type="text" value={flightNumber} placeholder={t("flightPlaceholder")}
              onChange={(e) => setFlightNumber(e.target.value)} className={fieldCls} />
          </TransportFormField>
        </div>

        {/* Return leg */}
        {direction === "both" && (
          <>
            <div className="flex items-center gap-4 mt-8 mb-5">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ochre whitespace-nowrap">{t("returnLeg")}</span>
              <div className="flex-1 h-px bg-ochre/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              <TransportFormField label={t("returnDate")}>
                <DatePicker value={returnDate} onChange={setReturnDate} min={date || today} />
              </TransportFormField>
              <TransportFormField label={t("returnTime")} above>
                <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className={fieldCls} />
              </TransportFormField>
              <TransportFormField label={t("returnFlightNumber")}>
                <input type="text" value={returnFlightNumber} placeholder={t("returnFlightPlaceholder")}
                  onChange={(e) => setReturnFlightNumber(e.target.value)} className={fieldCls} />
              </TransportFormField>
            </div>
          </>
        )}
      </div>

      {/* ── Section 3: Vehicle ── */}
      <div className="flex flex-col sm:flex-row gap-6 items-start relative z-8">
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("vehicleClass")}</span>
          {vClass && !needsMultiVehicle && <span className="text-[12px] text-muted">{vClass.capacity} · {vClass.from}</span>}
          {vehicleMissing && <p className="text-[12px] text-terracotta">{t("vehicleMissing")}</p>}
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vehicles.map((v) => {
            const cap = maxCapacity(vehicles.find((x) => x.id === v.id));
            const overCapacity = pax > cap;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => { setVehicleId(v.id); if (!overCapacity) setVehicleQty({}); }}
                aria-pressed={vehicleId === v.id}
                title={overCapacity ? t("fitsUpToUseMulti", { n: cap }) : undefined}
                className={`relative flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] rounded-xl before:absolute before:top-0 before:left-0 before:right-0 before:h-0.75 before:rounded-t-xl before:transition-opacity before:duration-300 ${
                  vehicleId === v.id
                    ? "bg-navy border-navy text-ochre ring-[3px] ring-ochre ring-offset-2 ring-offset-cream shadow-[0_8px_28px_-6px_rgba(201,154,63,0.5)] motion-safe:scale-[1.02] before:bg-ochre before:opacity-100"
                    : overCapacity
                    ? "opacity-50 border-rule bg-cream-warm text-muted hover:opacity-80 hover:border-ochre/40 before:opacity-0"
                    : "bg-cream-warm border-rule text-ink hover:border-ochre before:opacity-0"
                }`}
              >
                {vehicleId === v.id && (
                  <span aria-hidden className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ochre motion-safe:animate-pulse" />
                )}
                <FleetIllustration vehicleId={v.id} className="w-full h-13" selected={vehicleId === v.id} />
                <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
                <span className={`font-mono text-[10px] tracking-[0.18em] uppercase ${vehicleId === v.id ? "text-cream" : "text-ochre"}`}>{v.from}</span>
                <span className={`text-[11px] ${vehicleId === v.id ? "text-cream/70" : "text-muted"}`}>{v.capacity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {needsMultiVehicle && (
        <div className="border border-ochre/30 bg-ochre/5 p-4 space-y-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre mb-1">{t("addVehicles")}</p>
            <p className="font-sans text-[13px] text-ink-soft leading-snug">
              {t("addVehiclesHint", { label: vClass?.label ?? "", pax: singleVehicleCapacity, bags: singleLuggageCapacity, totalPax: pax, totalBags: bags })}
            </p>
            {multiVehicleSelected && (
              <div className="mt-2 flex flex-col gap-1">
                {!multiVehicleCoversPax ? (
                  <p className="font-mono text-[11px] text-terracotta tracking-wide">
                    {pax - totalVehicleCapacity > 1
                      ? t("seatsNeededPlural", { total: totalVehicleCapacity, pax, needed: pax - totalVehicleCapacity })
                      : t("seatsNeeded", { total: totalVehicleCapacity, pax, needed: pax - totalVehicleCapacity })}
                  </p>
                ) : (
                  <p className="font-mono text-[11px] text-ochre tracking-wide">
                    {t("seatsCovered", { total: totalVehicleCapacity, pax })}
                  </p>
                )}
                {bags > 0 && (!multiVehicleCoversbags ? (
                  <p className="font-mono text-[11px] text-terracotta tracking-wide">
                    {bags - totalLuggageCapacity > 1
                      ? t("bagsNeededPlural", { total: totalLuggageCapacity, bags, needed: bags - totalLuggageCapacity })
                      : t("bagsNeeded", { total: totalLuggageCapacity, bags, needed: bags - totalLuggageCapacity })}
                  </p>
                ) : (
                  <p className="font-mono text-[11px] text-ochre tracking-wide">
                    {t("bagsCovered", { total: totalLuggageCapacity, bags })}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vehicles.map((v) => {
              const cap = maxCapacity(v);
              const qty = vehicleQty[v.id] ?? 0;
              return (
                <div key={v.id} className="flex flex-col items-center gap-2 p-3 border border-rule bg-cream rounded-xl">
                  <FleetIllustration vehicleId={v.id} className="w-full h-10" />
                  <span className="font-display text-[13px] tracking-tight text-ink">{v.label}</span>
                  <span className="font-mono text-[10px] text-muted">{v.capacity}</span>
                  <span className="font-mono text-[10px] text-muted">{v.luggageCapacity} {t("bags")}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button type="button" onClick={() => setQty(v.id, -1)}
                      className="w-7 h-7 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-base leading-none">−</button>
                    <span className="font-mono text-[14px] text-ink min-w-[1.5ch] text-center">{qty}</span>
                    <button type="button" onClick={() => setQty(v.id, 1)}
                      className="w-7 h-7 border border-rule flex items-center justify-center text-ink-soft hover:border-ochre hover:text-ochre transition-colors text-base leading-none">+</button>
                  </div>
                  {qty > 0 && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-mono text-[10px] text-ochre">{qty * cap} {t("seats")}</span>
                      <span className="font-mono text-[10px] text-ochre">{qty * v.luggageCapacity} {t("bags")}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Section 4: Add-ons ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        <TransportFormField
          label={t("luggageBags")}
          hint={vehicleId && !luggageExceedsSingle && !luggageExceedsMulti ? t("bagsPerVehicle", { n: singleLuggageCapacity }) : undefined}
          hintError={
            luggageExceedsMulti
              ? t("exceedsMulti", { n: totalLuggageCapacity })
              : luggageExceedsSingle
              ? t("exceedsSingle", { label: vClass!.label, n: singleLuggageCapacity })
              : undefined
          }
        >
          <input
            type="number" min="0" max="20" value={luggage}
            onChange={(e) => setLuggage(e.target.value)}
            className={`${fieldCls} ${luggageExceedsSingle || luggageExceedsMulti ? "border-terracotta" : ""}`}
          />
        </TransportFormField>

        <div className="flex flex-col justify-end gap-4 pb-2.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={childSeat} onChange={(e) => setChildSeat(e.target.checked)}
              className="w-4 h-4 accent-ochre" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">{t("childSeat")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={meetAndGreet} onChange={(e) => setMeetAndGreet(e.target.checked)}
              className="w-4 h-4 accent-ochre" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">{t("meetAndGreet")}</span>
          </label>
        </div>

        <div className="flex flex-col justify-end gap-4 pb-2.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={guideNeeded} onChange={(e) => setGuideNeeded(e.target.checked)}
              className="w-4 h-4 accent-ochre" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">{t("guideNeeded")}</span>
          </label>
        </div>

        {guideNeeded && (
          <>
            <TransportFormField label={t("guideType")}>
              <select value={guideType} onChange={(e) => setGuideType(e.target.value as GuideType)} className={selectCls}>
                <option value="assistant">{t("guideAssistant")}</option>
                <option value="certified guide">{t("guideCertified")}</option>
              </select>
            </TransportFormField>
            <TransportFormField label={t("guideLanguage")}>
              <select value={guideLanguage} onChange={(e) => setGuideLanguage(e.target.value)} className={selectCls}>
                {GUIDE_LANGUAGES.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </TransportFormField>
          </>
        )}
      </div>

      <Hairline className="my-12" />

      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1">
          <Kicker>{t("messagePreview")}</Kicker>
          <pre className="font-mono text-[13px] leading-[1.6] text-ink-soft whitespace-pre-wrap mt-3.5 p-4 bg-cream-warm border-l-2 border-ochre">
            {direction === "both"
              ? [
                  t("airportBothWaysIntro", {
                    airport,
                    passengers,
                    vehicle: vClass ? vClass.label : t("noVehicleSelected"),
                    destination: destination || "—",
                  }),
                  t("airportPickupSummary", {
                    airport,
                    date: date || "—",
                    time: time || "—",
                    flight: flightNumber ? ` (${t("flightInline", { value: flightNumber })})` : "",
                  }),
                  t("airportReturnSummary", {
                    airport,
                    date: returnDate || "—",
                    time: returnTime || "—",
                    flight: returnFlightNumber ? ` (${t("flightInline", { value: returnFlightNumber })})` : "",
                  }),
                  luggage ? t("luggageSummary", { value: luggage }) : "",
                  childSeat ? t("childSeatSummary") : "",
                  meetAndGreet ? t("meetAndGreetSummary") : "",
                  guideNeeded ? t("guideSummary", { type: guideType, language: guideLanguage }) : "",
                  t("couldYouQuote"),
                ].filter(Boolean).join(" ")
              : [
                  t("airportOneWayIntro", {
                    direction: direction === "pickup" ? t("pickupFrom") : t("dropoffTo"),
                    airport,
                    date: date || "—",
                    time: time || "—",
                    passengers,
                    vehicle: vClass ? vClass.label : t("noVehicleSelected"),
                    destination: destination || "—",
                  }),
                  flightNumber ? t("flightSummary", { value: flightNumber }) : "",
                  luggage ? t("luggageSummary", { value: luggage }) : "",
                  childSeat ? t("childSeatSummary") : "",
                  meetAndGreet ? t("meetAndGreetSummary") : "",
                  guideNeeded ? t("guideSummary", { type: guideType, language: guideLanguage }) : "",
                  t("couldYouQuote"),
                ].filter(Boolean).join(" ")
            }
          </pre>
        </div>
        <p className="font-mono text-[11px] tracking-[0.12em] text-muted leading-[1.6] max-w-[46ch]">
          {t("driverHours")}
        </p>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => { setSubmitted(true); if (!canSubmit) return; window.open(href, "_blank", "noopener,noreferrer"); }}
          style={canSubmit ? { backgroundColor: "#0b1a2e", color: "#c99a3f" } : { backgroundColor: "#d6cfc7", color: "#9a9087", cursor: "not-allowed" }}
          className="inline-flex items-center gap-3.5 px-8 py-5 font-mono text-[13px] tracking-[0.16em] uppercase font-semibold transition-all duration-300 whitespace-nowrap group shadow-none disabled:shadow-none enabled:shadow-[0_4px_32px_-6px_rgba(11,26,46,0.45)] enabled:hover:shadow-[0_8px_40px_-6px_rgba(11,26,46,0.35)] enabled:hover:scale-[1.02] enabled:active:scale-[0.99]"
        >
          <span>{t("reserveWhatsapp")}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}
