"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCurrency } from "@/lib/currency/context";
import { formatPrice, parseEurAmount } from "@/lib/currency/format";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { Hairline } from "@/components/primitives/Hairline/Hairline";
import { FleetIllustration } from "@/components/illustrations/FleetIllustration/FleetIllustration";
import { TransportFormField, fieldCls, selectCls } from "./TransportFormField";
import { DateRangePicker } from "@/components/primitives/DateRangePicker/DateRangePicker";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { TimePicker } from "@/components/primitives/TimePicker/TimePicker";
import { GUIDE_LANGUAGES } from "./guideOptions";
import type { GuideType } from "./guideOptions";
import type { Vehicle } from "@/lib/transport/types";
import { InfoTooltip } from "@/components/primitives/InfoTooltip/InfoTooltip";

interface CustomFormProps {
  vehicleId: string | null;
  setVehicleId: (id: string | null) => void;
  vehicles: Vehicle[];
  initialPassengers?: number;
  guideNeeded?: boolean;
  setGuideNeeded?: (value: boolean) => void;
  guideType?: GuideType;
  setGuideType?: (value: GuideType) => void;
  guideLanguage?: string;
  setGuideLanguage?: (value: string) => void;
}

// vehicle_id → quantity for multi-vehicle mode
type VehicleQty = Record<string, number>;

export function CustomForm({
  vehicleId,
  setVehicleId,
  vehicles,
  initialPassengers = 2,
  guideNeeded: guideNeededProp,
  setGuideNeeded: setGuideNeededProp,
  guideType: guideTypeProp,
  setGuideType: setGuideTypeProp,
  guideLanguage: guideLanguageProp,
  setGuideLanguage: setGuideLanguageProp,
}: CustomFormProps) {
  const t = useTranslations("transport.form");
  const formLocale = useLocale();
  const { currency, rates } = useCurrency();
  const displayFromPrice = (raw: string) => {
    const eur = parseEurAmount(raw);
    return eur === null ? raw : `From ${formatPrice(eur, currency, rates, formLocale)}`;
  };
  const [pickup, setPickup] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [destinations, setDestinations] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [oneDay, setOneDay] = useState(false);
  const [passengers, setPassengers] = useState(String(initialPassengers));
  const [luggage, setLuggage] = useState("");
  const [localGuideNeeded, setLocalGuideNeeded] = useState(false);
  const [localGuideType, setLocalGuideType] = useState<GuideType>("assistant");
  const [localGuideLanguage, setLocalGuideLanguage] = useState("English");
  const [submitted, setSubmitted] = useState(false);
  const [vehicleQty, setVehicleQty] = useState<VehicleQty>({});
  const guideNeeded = guideNeededProp ?? localGuideNeeded;
  const setGuideNeeded = setGuideNeededProp ?? setLocalGuideNeeded;
  const guideType = guideTypeProp ?? localGuideType;
  const setGuideType = setGuideTypeProp ?? setLocalGuideType;
  const guideLanguage = guideLanguageProp ?? localGuideLanguage;
  const setGuideLanguage = setGuideLanguageProp ?? setLocalGuideLanguage;

  const today = new Date().toISOString().split("T")[0];
  const availableVehicles = vehicles.filter((v) => v.id === "van");
  const vClass = availableVehicles.find((v) => v.id === vehicleId) ?? vehicles.find((v) => v.id === vehicleId);

  function maxCapacity(v: typeof vClass) {
    if (!v) return Infinity;
    const nums = v.capacity.match(/\d+/g);
    return nums ? parseInt(nums[nums.length - 1], 10) : Infinity;
  }

  const pax = parseInt(passengers, 10) || 1;
  const bags = parseInt(luggage, 10) || 0;

  // total capacity from all selected vehicles
  const totalVehicleCapacity = Object.entries(vehicleQty).reduce((sum, [id, qty]) => {
    const v = vehicles.find((x) => x.id === id);
    return sum + (v ? maxCapacity(v) * qty : 0);
  }, 0);
  const totalLuggageCapacity = Object.entries(vehicleQty).reduce((sum, [id, qty]) => {
    const v = vehicles.find((x) => x.id === id);
    return sum + (v ? (v.luggageCapacity ?? 0) * qty : 0);
  }, 0);

  const singleVehicleCapacity = maxCapacity(vClass);
  const singleLuggageCapacity = vClass?.luggageCapacity ?? Infinity;
  const needsMultiVehicle = vehicleId && (pax > singleVehicleCapacity || bags > singleLuggageCapacity);
  const multiVehicleSelected = Object.values(vehicleQty).some((q) => q > 0);
  const multiVehicleCoversPax = totalVehicleCapacity >= pax;
  const multiVehicleCoversBags = totalLuggageCapacity >= bags;
  const multiVehicleCoversAll = multiVehicleCoversPax && multiVehicleCoversBags;
  const luggageExceedsSingle = vehicleId && bags > 0 && bags > singleLuggageCapacity && !needsMultiVehicle;
  const luggageExceedsMulti = needsMultiVehicle && multiVehicleSelected && bags > 0 && !multiVehicleCoversBags;

  const vehicleMissing = submitted && !vehicleId;
  const pickupMissing = submitted && !pickup.trim();
  const dateMissing = submitted && !startDate;
  const capacityError = vehicleId && pax > singleVehicleCapacity && !needsMultiVehicle
    ? t("vehicleCapacityError", { label: vClass!.label, n: singleVehicleCapacity })
    : null;

  const canSubmit = !!vehicleId && !!pickup.trim() && !!startDate && !!destinations.trim() &&
    (!needsMultiVehicle || multiVehicleCoversAll);

  // build vehicle summary string for WA message
  const vehicleSummary = needsMultiVehicle && multiVehicleSelected
    ? Object.entries(vehicleQty)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => { const v = vehicles.find((x) => x.id === id); return v ? `${q}× ${v.label}` : ""; })
        .filter(Boolean).join(", ")
    : vClass ? `${vClass.label} (${vClass.capacity})` : String(vehicleId);

  function setQty(id: string, delta: number) {
    setVehicleQty((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) };
      return next;
    });
  }

  const previewMessage = [
    t("privateChauffeurIntro"),
    t("pickupSummary", { value: pickup || "—" }),
    pickupTime ? t("pickupTimeSummary", { value: pickupTime }) : "",
    t("destinationsSummary", { value: destinations || "—" }),
    t("datesSummary", {
      start: startDate || "—",
      end: endDate && endDate !== startDate ? ` to ${endDate}` : "",
    }),
    t("passengersSummary", { value: passengers }),
    luggage ? t("luggageSummary", { value: luggage }) : "",
    t("vehicleSummary", {
      value: vehicleId ? vehicleSummary : t("noVehicleSelected"),
    }),
    guideNeeded ? t("guideSummary", { type: guideType, language: guideLanguage }) : "",
    t("couldYouQuote"),
  ].filter(Boolean).join(" ");
  const waNum = process.env.NEXT_PUBLIC_WA_PHONE?.replace(/[^\d+]/g, "") ?? "";
  const href = vehicleId ? `https://wa.me/${waNum}?text=${encodeURIComponent(previewMessage)}` : "#";

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-8">
        {/* Row 1: Pickup, Time, Dates */}
        <TransportFormField label={t("pickupLocation")} hint={pickupMissing ? t("requiredHint") : undefined}>
          <input type="text" value={pickup} placeholder={t("pickupLocationPlaceholder")}
            onChange={(e) => setPickup(e.target.value)}
            className={`${fieldCls} ${pickupMissing ? "border-terracotta" : ""}`} />
        </TransportFormField>

        <TransportFormField label={t("pickupTimeOptional")} above>
          <TimePicker value={pickupTime} onChange={setPickupTime} placeholder={t("pickupTimeOptional")} />
        </TransportFormField>

        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("dates")}</span>
          <label className="flex items-center gap-1.5 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={oneDay}
              onChange={(e) => {
                setOneDay(e.target.checked);
                if (e.target.checked && startDate) setEndDate(startDate);
                if (!e.target.checked) setEndDate("");
              }}
              className="h-3 w-3 accent-ochre"
            />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">{t("oneDay")}</span>
          </label>
          {oneDay ? (
            <DatePicker
              value={startDate}
              onChange={(d) => { setStartDate(d); setEndDate(d); }}
              min={today}
              error={dateMissing}
              placeholder={t("selectDate")}
            />
          ) : (
            <DateRangePicker
              start={startDate}
              end={endDate}
              onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
              min={today}
              error={dateMissing}
              placeholder={t("dateRangePlaceholder")}
            />
          )}
          {dateMissing && <span className="text-[12px] text-terracotta">{t("requiredHint")}</span>}
        </div>

        {/* Row 2: Passengers, Luggage, Destinations */}
        <TransportFormField label={t("passengers")}>
          <input type="number" min="1" value={passengers}
            onChange={(e) => setPassengers(e.target.value)} className={fieldCls} />
        </TransportFormField>

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

        <div className="col-span-full flex flex-col sm:flex-row gap-6 items-start relative z-8">
          <div className="flex flex-col gap-1.5 min-w-40">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted">{t("vehicleClass")}</span>
            {vClass && !needsMultiVehicle && <span className="text-[12px] text-muted">{vClass.capacity} · {displayFromPrice(vClass.from)}</span>}
            {vehicleMissing && <p className="text-[12px] text-terracotta">{t("vehicleMissing")}</p>}
            {capacityError && <p className="text-[12px] text-terracotta">{capacityError}</p>}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableVehicles.map((v) => {
              const cap = maxCapacity(availableVehicles.find((x) => x.id === v.id));
              const overCapacity = pax > cap;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { setVehicleId(v.id); if (!overCapacity) setVehicleQty({}); }}
                  aria-pressed={vehicleId === v.id}
                  title={overCapacity ? t("fitsUpToUseMulti", { n: cap }) : undefined}
                  className={`relative flex flex-col items-center gap-1.5 px-3 py-3 border transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] rounded-xl ${
                    vehicleId === v.id
                      ? "bg-navy border-navy text-ochre ring-[3px] ring-ochre ring-offset-2 ring-offset-cream shadow-[0_8px_28px_-6px_rgba(201,154,63,0.5)] motion-safe:scale-[1.02]"
                      : overCapacity
                      ? "opacity-50 border-rule bg-cream-warm text-muted hover:opacity-80 hover:border-ochre/40"
                      : "bg-cream-warm border-rule text-ink hover:border-ochre"
                  }`}
                >
                  {vehicleId === v.id && (
                    <span aria-hidden className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ochre motion-safe:animate-pulse" />
                  )}
                  <FleetIllustration vehicleId={v.id} className="w-full h-24" selected={vehicleId === v.id} />
                  <span className="font-display font-normal text-[15px] tracking-tight">{v.label}</span>
                  <span className={`font-mono text-[10px] tracking-[0.18em] uppercase text-ochre`}>{displayFromPrice(v.from)}</span>
                  <span className={`text-[11px] text-muted`}>{v.capacity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-vehicle builder — shown when passengers or bags exceed single vehicle capacity */}
        {needsMultiVehicle && (
          <div className="col-span-full border border-ochre/30 bg-ochre/5 p-4 space-y-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ochre mb-1">
                {t("addVehicles")}
              </p>
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
                  {bags > 0 && (!multiVehicleCoversBags ? (
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
              {availableVehicles.map((v) => {
                const cap = maxCapacity(v);
                const qty = vehicleQty[v.id] ?? 0;
                return (
                  <div key={v.id} className="flex flex-col items-center gap-2 p-3 border border-rule bg-cream rounded-xl">
                    <FleetIllustration vehicleId={v.id} className="w-full h-16" />
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

        <TransportFormField label={t("destinationsStops")} span>
          <textarea
            value={destinations}
            placeholder={t("destinationsStopsTextareaPlaceholder")}
            onChange={(e) => setDestinations(e.target.value)}
            rows={3}
            className="bg-transparent border border-rule text-ink font-sans text-[16px] px-3 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200 resize-none"
          />
        </TransportFormField>

        <div className="col-span-full grid grid-cols-1 sm:grid-cols-[auto_minmax(180px,260px)_minmax(180px,260px)] gap-6 items-end justify-start">
          <label className="flex items-center gap-3 cursor-pointer pb-2.5 sm:whitespace-nowrap">
            <input
              type="checkbox"
              checked={guideNeeded}
              onChange={(e) => setGuideNeeded(e.target.checked)}
              className="w-4 h-4 accent-ochre"
            />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">
              {t("guideNeeded")}
            </span>
            <InfoTooltip text={t("tooltipGuideNeeded")} />
          </label>

          <TransportFormField label={t("guideType")} tooltip={
            guideType === "assistant" ? t("tooltipGuideAssistant") : t("tooltipGuideCertified")
          }>
            <select
              value={guideType}
              onChange={(e) => setGuideType(e.target.value as GuideType)}
              disabled={!guideNeeded}
              className={`${selectCls} ${guideNeeded ? "" : "opacity-45 cursor-not-allowed"}`}
            >
              <option value="assistant">{t("guideAssistant")}</option>
              <option value="certified guide">{t("guideCertified")}</option>
            </select>
          </TransportFormField>

          <TransportFormField label={t("guideLanguage")}>
            <select
              value={guideLanguage}
              onChange={(e) => setGuideLanguage(e.target.value)}
              disabled={!guideNeeded}
              className={`${selectCls} ${guideNeeded ? "" : "opacity-45 cursor-not-allowed"}`}
            >
              {GUIDE_LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </TransportFormField>
        </div>
      </div>

      <Hairline className="my-12" />

      <div className="flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1">
          <Kicker>{t("messagePreview")}</Kicker>
          <pre className="font-mono text-[13px] leading-[1.6] text-ink-soft whitespace-pre-wrap mt-3.5 p-4 bg-cream-warm border-l-2 border-ochre">
            {previewMessage}
          </pre>
        </div>
        <p
          style={{
            backgroundColor: "#fff1f2",
            borderColor: "#fecdd3",
            color: "#9f1239",
          }}
          className="border px-4 py-3 font-mono text-[11px] tracking-[0.12em] leading-[1.6] max-w-[46ch]"
        >
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
