"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useFieldArray, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, X, Languages, Download } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Select } from "@/components/admin/Input/Select";
import { Button } from "@/components/admin/Button/Button";
import { Spinner } from "@/components/admin/Spinner/Spinner";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { TimePicker } from "@/components/primitives/TimePicker/TimePicker";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/locales";
import {
  voucherSchema,
  type VoucherPayload,
  type VoucherType,
  TRANSLATABLE_KEYS,
  DEFAULT_PAYMENT_NOTE_EN,
  DEFAULT_FOOTER_THANKS_EN,
  CURRENCY_SYMBOL,
} from "./schema";
import {
  fetchPackageDefaults,
  fetchDailyPackageDefaults,
  fetchHotelDefaults,
  fetchVehicleDefaults,
  translateVoucherFields,
  type PackageOption,
  type PackageDateOption,
  type VehicleOption,
} from "./actions";

const GUEST_ROLE_PREFIX = "guest_role_";

interface Props {
  packages: PackageOption[];
  dailyPackages: PackageOption[];
  hotels: PackageOption[];
  vehicles: VehicleOption[];
}

const TAB_META: Array<{ type: VoucherType; label: string; sublabel: string }> = [
  { type: "group", label: "Group", sublabel: "Premade packages" },
  { type: "daily", label: "Daily", sublabel: "Daily tours" },
  { type: "custom", label: "Custom", sublabel: "Manual entry" },
  { type: "hotel", label: "Hotel", sublabel: "Hotel stays" },
  { type: "transfer", label: "Transfer", sublabel: "Private chauffeur" },
];

const todayIso = () => new Date().toISOString().slice(0, 10);

function nightsBetween(startIso: string, endIso: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startIso) || !/^\d{4}-\d{2}-\d{2}$/.test(endIso)) return 0;
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

function fmtDateForDisplay(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const DEFAULT_VALUES: VoucherPayload = {
  voucherType: "group",
  voucherNumber: "",
  invoiceDate: todayIso(),
  paymentMethod: "Western Union",
  packageId: "",
  packageName: "",
  region: "",
  nightsDays: "",
  guests: [{ role: "Lead Guest", name: "", dateOfBirth: "", passport: "" }],
  checkIn: "",
  checkInTime: "14:00",
  checkOut: "",
  checkOutTime: "12:00",
  durationLabel: "",
  tourDate: "",
  tourStartTime: "09:00",
  tourEndTime: "17:00",
  pickupLocation: "",
  pickupDate: "",
  pickupTime: "",
  dropoffLocation: "",
  dropoffDate: "",
  dropoffTime: "",
  currency: "EUR",
  qty: 1,
  unitPrice: 0,
  itemDescriptor: "Boutique tour · scheduled departure · group package",
  paymentNote: DEFAULT_PAYMENT_NOTE_EN,
  footerThanks: DEFAULT_FOOTER_THANKS_EN,
  locale: "en",
};

// Descriptor copy that auto-updates when admin switches tabs (admin can still edit it).
const DESCRIPTOR_BY_TYPE: Record<VoucherType, string> = {
  group: "Boutique tour · scheduled departure · group package",
  daily: "Boutique day tour · private guide",
  custom: "Custom tour · bespoke itinerary",
  hotel: "Hotel stay · room reservation",
  transfer: "Private transfer · chauffeur service",
};

export function VoucherGenerator({ packages, dailyPackages, hotels, vehicles }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<VoucherPayload>({
    resolver: zodResolver(voucherSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "guests" });
  const [loadingPkg, startLoadingPkg] = useTransition();
  const [translating, setTranslating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [availableDates, setAvailableDates] = useState<PackageDateOption[]>([]);
  const [selectedDateIdx, setSelectedDateIdx] = useState<string>("");
  // Epoch counter — bumped on every tab switch or picker change. Async autofill
  // callbacks capture the epoch they started under and bail if it's stale, so a
  // late-arriving response can't overwrite fields the admin already moved on from.
  const autofillEpoch = useRef(0);
  const [contentLocale, setContentLocale] = useState<Locale>("en");

  const voucherType = watch("voucherType");
  const qty = watch("qty");
  const unitPrice = watch("unitPrice");
  const currency = watch("currency");
  const grandTotal = (Number(qty) || 0) * (Number(unitPrice) || 0);

  function switchTab(next: VoucherType) {
    if (next === voucherType) return;
    autofillEpoch.current += 1;
    setContentLocale("en");
    setValue("voucherType", next);
    // Clear source-driven and variant-specific fields so a previously translated
    // packageName / region / dates / pickup-dropoff don't bleed into the new tab.
    setValue("packageId", "");
    setValue("packageName", "");
    setValue("region", "");
    setValue("nightsDays", "");
    setValue("durationLabel", "");
    setValue("checkIn", "");
    setValue("checkInTime", "14:00");
    setValue("checkOut", "");
    setValue("checkOutTime", "12:00");
    setValue("tourDate", "");
    setValue("tourStartTime", "09:00");
    setValue("tourEndTime", "17:00");
    setValue("pickupLocation", "");
    setValue("pickupDate", "");
    setValue("pickupTime", "");
    setValue("dropoffLocation", "");
    setValue("dropoffDate", "");
    setValue("dropoffTime", "");
    setValue("unitPrice", 0);
    setValue("itemDescriptor", DESCRIPTOR_BY_TYPE[next]);
    setAvailableDates([]);
    setSelectedDateIdx("");
  }

  function onGroupPackageChange(packageId: string) {
    autofillEpoch.current += 1;
    const myEpoch = autofillEpoch.current;
    setValue("packageId", packageId);
    setAvailableDates([]);
    setSelectedDateIdx("");
    if (!packageId) return;
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;
    startLoadingPkg(async () => {
      const res = await fetchPackageDefaults(pkg.slug);
      if (autofillEpoch.current !== myEpoch) return; // stale — admin moved on
      if (res.error || !res.defaults) {
        toast.error(res.error ?? "Failed to load package defaults");
        return;
      }
      const d = res.defaults;
      setValue("packageName", d.packageName);
      setValue("region", d.region);
      if (d.duration) {
        setValue("nightsDays", d.duration);
        setValue("durationLabel", d.duration);
      }
      if (isCurrency(d.currency)) setValue("currency", d.currency);
      if (d.defaultUnitPrice != null) setValue("unitPrice", d.defaultUnitPrice);
      setAvailableDates(d.dates);
      toast.success(`Filled defaults from "${d.packageName}".`);
    });
  }

  function onDailyPackageChange(packageId: string) {
    autofillEpoch.current += 1;
    const myEpoch = autofillEpoch.current;
    setValue("packageId", packageId);
    if (!packageId) return;
    const pkg = dailyPackages.find((p) => p.id === packageId);
    if (!pkg) return;
    startLoadingPkg(async () => {
      const res = await fetchDailyPackageDefaults(pkg.slug);
      if (autofillEpoch.current !== myEpoch) return;
      if (res.error || !res.defaults) {
        toast.error(res.error ?? "Failed to load daily defaults");
        return;
      }
      const d = res.defaults;
      // Clear daily-specific fields first so prior selections don't bleed through
      // when the new tour record has empty time/date fields.
      setValue("tourDate", "");
      setValue("tourStartTime", "");
      setValue("tourEndTime", "");
      setValue("packageName", d.packageName);
      setValue("region", d.region);
      setValue("nightsDays", "1 day");
      if (isCurrency(d.currency)) setValue("currency", d.currency);
      if (d.defaultUnitPrice != null) setValue("unitPrice", d.defaultUnitPrice);
      if (d.tourDate) setValue("tourDate", d.tourDate, { shouldValidate: true });
      if (d.tourStartTime) setValue("tourStartTime", d.tourStartTime);
      if (d.tourEndTime) setValue("tourEndTime", d.tourEndTime);
      toast.success(`Filled defaults from "${d.packageName}".`);
    });
  }

  function onHotelChange(hotelId: string) {
    autofillEpoch.current += 1;
    const myEpoch = autofillEpoch.current;
    setValue("packageId", hotelId);
    if (!hotelId) return;
    const hotel = hotels.find((p) => p.id === hotelId);
    if (!hotel) return;
    startLoadingPkg(async () => {
      const res = await fetchHotelDefaults(hotel.slug);
      if (autofillEpoch.current !== myEpoch) return;
      if (res.error || !res.defaults) {
        toast.error(res.error ?? "Failed to load hotel defaults");
        return;
      }
      const d = res.defaults;
      setValue("packageName", d.packageName);
      setValue("region", d.region);
      if (d.checkInTime) setValue("checkInTime", d.checkInTime);
      if (d.checkOutTime) setValue("checkOutTime", d.checkOutTime);
      toast.success(`Filled defaults from "${d.packageName}".`);
    });
  }

  function onVehicleChange(vehicleId: string) {
    autofillEpoch.current += 1;
    const myEpoch = autofillEpoch.current;
    setValue("packageId", vehicleId);
    if (!vehicleId) return;
    startLoadingPkg(async () => {
      const res = await fetchVehicleDefaults(vehicleId);
      if (autofillEpoch.current !== myEpoch) return;
      if (res.error || !res.defaults) {
        toast.error(res.error ?? "Failed to load vehicle defaults");
        return;
      }
      const d = res.defaults;
      setValue("packageName", d.packageName);
      if (d.defaultUnitPrice != null) setValue("unitPrice", d.defaultUnitPrice);
      toast.success(`Filled defaults from "${d.packageName}".`);
    });
  }

  function onDateSetChange(idxStr: string) {
    // Bump the epoch: any in-flight package-defaults fetch from before this
    // scheduled-date pick must not land afterwards and overwrite the dates the
    // admin just chose.
    autofillEpoch.current += 1;
    setSelectedDateIdx(idxStr);
    if (idxStr === "") return;
    const idx = Number(idxStr);
    const range = availableDates[idx];
    if (!range) return;
    setValue("checkIn", range.startDate, { shouldValidate: true });
    setValue("checkOut", range.endDate, { shouldValidate: true });
    const nights = nightsBetween(range.startDate, range.endDate);
    if (nights > 0) {
      const label = `${nights} night${nights === 1 ? "" : "s"} · ${nights + 1} days`;
      setValue("nightsDays", label);
      setValue("durationLabel", `${nights} night${nights === 1 ? "" : "s"}`);
    }
  }

  async function onTranslate() {
    const v = getValues();
    const locale = v.locale as Locale;
    if (locale === "en") {
      toast.message("Select a non-English language first.");
      return;
    }
    if (contentLocale !== "en" && contentLocale !== locale) {
      toast.warning(
        `Form already in ${LOCALE_NAMES[contentLocale]}. The AI works best from English — re-translating may garble output.`,
      );
    }
    autofillEpoch.current += 1;
    const myEpoch = autofillEpoch.current;
    setTranslating(true);
    try {
      const fields: Record<string, string> = {};
      for (const k of TRANSLATABLE_KEYS) {
        const val = v[k];
        if (typeof val === "string") fields[k] = val;
      }
      v.guests.forEach((g, i) => {
        fields[`${GUEST_ROLE_PREFIX}${i}`] = g.role;
      });

      const res = await translateVoucherFields(fields, locale);
      // Bail if admin switched tabs (or triggered another autofill) mid-flight —
      // we don't want translated values to land in fields that have since been cleared.
      if (autofillEpoch.current !== myEpoch) return;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      const out = res.result ?? {};
      for (const k of TRANSLATABLE_KEYS) {
        const tv = out[k];
        if (typeof tv === "string") setValue(k, tv);
      }
      v.guests.forEach((_, i) => {
        const tv = out[`${GUEST_ROLE_PREFIX}${i}`];
        if (typeof tv === "string") setValue(`guests.${i}.role`, tv);
      });
      setContentLocale(locale);
      toast.success(`Translated to ${LOCALE_NAMES[locale]}.`);
    } catch (e) {
      console.error(e);
      toast.error("Translation failed.");
    } finally {
      setTranslating(false);
    }
  }

  async function onDownload(values: VoucherPayload) {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf/voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const message = await res.text();
        toast.error(message || "PDF generation failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sabrina-voucher-${values.voucherNumber.replace(/[^A-Za-z0-9-_]/g, "_") || "voucher"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Voucher downloaded.");
    } catch (e) {
      console.error(e);
      toast.error("Download failed.");
    } finally {
      setDownloading(false);
    }
  }

  const isMultiNight = voucherType === "group" || voucherType === "custom" || voucherType === "hotel";
  const isDaily = voucherType === "daily";
  const isTransfer = voucherType === "transfer";

  // Auto-derive duration / nights-days labels from check-in / check-out for the
  // multi-night tabs. Admin can still override either label by hand afterwards.
  const checkInWatch = watch("checkIn");
  const checkOutWatch = watch("checkOut");
  useEffect(() => {
    if (!isMultiNight) return;
    if (!checkInWatch || !checkOutWatch) return;
    const n = nightsBetween(checkInWatch, checkOutWatch);
    if (n <= 0) return;
    if (!getValues("durationLabel")) {
      setValue("durationLabel", `${n} night${n === 1 ? "" : "s"}`);
    }
    if (!getValues("nightsDays")) {
      setValue("nightsDays", `${n} night${n === 1 ? "" : "s"} · ${n + 1} days`);
    }
  }, [isMultiNight, checkInWatch, checkOutWatch, getValues, setValue]);

  function onValidationError(formErrors: FieldErrors<VoucherPayload>) {
    const first = firstErrorMessage(formErrors);
    toast.error(first || "Please fix the highlighted fields before downloading.");
  }

  return (
    <form onSubmit={handleSubmit(onDownload, onValidationError)} className="space-y-8 max-w-5xl">
      {/* TAB BAR */}
      <nav aria-label="Voucher type" className="flex flex-wrap gap-1 border-b border-rule">
        {TAB_META.map((tab) => {
          const active = tab.type === voucherType;
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => switchTab(tab.type)}
              className={`px-5 py-3 -mb-px border-b-2 transition-colors ${
                active
                  ? "border-ochre text-ink bg-cream-deep"
                  : "border-transparent text-ink-soft hover:text-ink hover:bg-cream-warm"
              }`}
            >
              <span className={`block font-mono text-[11px] tracking-[0.2em] uppercase ${active ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
              <span className="block font-sans text-[11px] text-muted mt-0.5">{tab.sublabel}</span>
            </button>
          );
        })}
      </nav>

      {/* SOURCE PICKER (per tab) */}
      {voucherType !== "custom" && (
        <section className="border border-rule bg-cream-warm p-6 space-y-5">
          <header className="flex items-center justify-between">
            <h2 className="font-display text-[18px] font-semibold text-ink">
              {voucherType === "group" && "Group package"}
              {voucherType === "daily" && "Daily tour"}
              {voucherType === "hotel" && "Hotel"}
              {voucherType === "transfer" && "Vehicle"}
            </h2>
            {loadingPkg && <Spinner />}
          </header>

          {voucherType === "group" && (
            packages.length > 0 ? (
              <FormField label="Pick a group package" hint="Auto-fills name, region, duration, currency, unit price. All fields stay editable.">
                <Select value={watch("packageId") ?? ""} onChange={(e) => onGroupPackageChange(e.target.value)}>
                  <option value="">— select a package —</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.isPublished ? "" : " (draft)"}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <p className="font-sans text-[14px] text-muted">No premade packages found — fill the fields manually below.</p>
            )
          )}

          {voucherType === "daily" && (
            dailyPackages.length > 0 ? (
              <FormField label="Pick a daily tour" hint="Auto-fills name, region, tour date, start/end time, price. All fields stay editable.">
                <Select value={watch("packageId") ?? ""} onChange={(e) => onDailyPackageChange(e.target.value)}>
                  <option value="">— select a tour —</option>
                  {dailyPackages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.isPublished ? "" : " (draft)"}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <p className="font-sans text-[14px] text-muted">No daily tours found — fill the fields manually below.</p>
            )
          )}

          {voucherType === "hotel" && (
            hotels.length > 0 ? (
              <FormField label="Pick a hotel" hint="Auto-fills name, region, check-in / check-out time. Unit price stays manual.">
                <Select value={watch("packageId") ?? ""} onChange={(e) => onHotelChange(e.target.value)}>
                  <option value="">— select a hotel —</option>
                  {hotels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.isPublished ? "" : " (draft)"}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <p className="font-sans text-[14px] text-muted">No hotels found — fill the fields manually below.</p>
            )
          )}

          {voucherType === "transfer" && (
            vehicles.length > 0 ? (
              <FormField label="Pick a vehicle" hint="Auto-fills vehicle label and suggested price from the fleet list.">
                <Select value={watch("packageId") ?? ""} onChange={(e) => onVehicleChange(e.target.value)}>
                  <option value="">— select a vehicle —</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} · {v.capacity} · from {v.fromPrice}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <p className="font-sans text-[14px] text-muted">No fleet vehicles found — fill the fields manually below.</p>
            )
          )}
        </section>
      )}

      {/* META */}
      <section className="border border-rule bg-cream-warm p-6 space-y-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Voucher meta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Voucher number" required error={errors.voucherNumber?.message}>
            <Input placeholder="062 / 2026" {...register("voucherNumber")} />
          </FormField>
          <FormField label="Invoice date" required error={errors.invoiceDate?.message}>
            <Controller
              control={control}
              name="invoiceDate"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} error={!!errors.invoiceDate} />
              )}
            />
          </FormField>
          <FormField label="Account · Payment" required error={errors.paymentMethod?.message}>
            <Input placeholder="Western Union" {...register("paymentMethod")} />
          </FormField>
        </div>
      </section>

      {/* HERO */}
      <section className="border border-rule bg-cream-warm p-6 space-y-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Hero block</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Item / Package name" required error={errors.packageName?.message}>
            <Input placeholder="İstanbul Pack" {...register("packageName")} />
          </FormField>
          <FormField label="Region" required error={errors.region?.message}>
            <Input placeholder="Istanbul · Marmara" {...register("region")} />
          </FormField>
          <FormField label={isDaily ? "Tour length label" : isTransfer ? "One-line tag" : "Nights / days label"}>
            <Input
              placeholder={isDaily ? "1 day · 8 hours" : isTransfer ? "One-way private transfer" : "5 nights · 6 days"}
              {...register("nightsDays")}
            />
          </FormField>
        </div>
      </section>

      {/* GUESTS */}
      <section className="border border-rule bg-cream-warm p-6 space-y-5">
        <header className="flex items-center justify-between">
          <h2 className="font-display text-[18px] font-semibold text-ink">Guests</h2>
          <Button
            type="button"
            variant="ghost"
            onClick={() => append({ role: "Companion", name: "", dateOfBirth: "", passport: "" })}
          >
            <Plus size={14} />
            Add guest
          </Button>
        </header>

        <div className="space-y-4">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-rule p-4 bg-cream space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">
                  Guest {i + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-terracotta hover:text-ink transition-colors"
                    aria-label="Remove guest"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Role" required error={errors.guests?.[i]?.role?.message}>
                  <Input placeholder="Lead Guest" {...register(`guests.${i}.role`)} />
                </FormField>
                <FormField label="Full name" required error={errors.guests?.[i]?.name?.message}>
                  <Input placeholder="Cherif Fkih Romdhane" {...register(`guests.${i}.name`)} />
                </FormField>
                <FormField label="Date of birth" required error={errors.guests?.[i]?.dateOfBirth?.message}>
                  <Controller
                    control={control}
                    name={`guests.${i}.dateOfBirth`}
                    render={({ field: f }) => (
                      <DatePicker value={f.value} onChange={f.onChange} error={!!errors.guests?.[i]?.dateOfBirth} />
                    )}
                  />
                </FormField>
                <FormField label="Passport" required error={errors.guests?.[i]?.passport?.message}>
                  <Input placeholder="U386475" {...register(`guests.${i}.passport`)} />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STAY — variant by voucherType */}
      {isMultiNight && (
        <section className="border border-rule bg-cream-warm p-6 space-y-5">
          <h2 className="font-display text-[18px] font-semibold text-ink">
            {voucherType === "hotel" ? "Stay" : "Stay · Check-in & Check-out"}
          </h2>

          {voucherType === "group" && availableDates.length > 0 && (
            <FormField label="Pick a scheduled departure" hint="Select one of the package's available date sets to auto-fill check-in, check-out, and duration. You can override any field below.">
              <Select value={selectedDateIdx} onChange={(e) => onDateSetChange(e.target.value)}>
                <option value="">— custom dates —</option>
                {availableDates.map((d, idx) => (
                  <option key={`${d.startDate}-${d.endDate}`} value={String(idx)}>
                    {fmtDateForDisplay(d.startDate)} → {fmtDateForDisplay(d.endDate)} ({nightsBetween(d.startDate, d.endDate)} nights)
                  </option>
                ))}
              </Select>
            </FormField>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Check-in" required error={errors.checkIn?.message}>
              <Controller
                control={control}
                name="checkIn"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} error={!!errors.checkIn} />
                )}
              />
            </FormField>
            <FormField label="Check-in time">
              <Controller
                control={control}
                name="checkInTime"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </FormField>
            <FormField label="Duration label" required error={errors.durationLabel?.message}>
              <Input placeholder="5 nights" {...register("durationLabel")} />
            </FormField>
            <FormField label="Check-out" required error={errors.checkOut?.message}>
              <Controller
                control={control}
                name="checkOut"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} min={watch("checkIn") || undefined} error={!!errors.checkOut} />
                )}
              />
            </FormField>
            <FormField label="Check-out time">
              <Controller
                control={control}
                name="checkOutTime"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </FormField>
          </div>
        </section>
      )}

      {isDaily && (
        <section className="border border-rule bg-cream-warm p-6 space-y-5">
          <h2 className="font-display text-[18px] font-semibold text-ink">Tour Date · Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Tour date" required error={errors.tourDate?.message}>
              <Controller
                control={control}
                name="tourDate"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} error={!!errors.tourDate} />
                )}
              />
            </FormField>
            <FormField label="Start time">
              <Controller
                control={control}
                name="tourStartTime"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </FormField>
            <FormField label="End time">
              <Controller
                control={control}
                name="tourEndTime"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </FormField>
          </div>
        </section>
      )}

      {isTransfer && (
        <section className="border border-rule bg-cream-warm p-6 space-y-5">
          <h2 className="font-display text-[18px] font-semibold text-ink">Pickup & Dropoff</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Pickup location" required error={errors.pickupLocation?.message}>
              <Input placeholder="Sabiha Gökçen Airport" {...register("pickupLocation")} />
            </FormField>
            <FormField label="Pickup date" required error={errors.pickupDate?.message}>
              <Controller
                control={control}
                name="pickupDate"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} error={!!errors.pickupDate} />
                )}
              />
            </FormField>
            <FormField label="Pickup time">
              <Controller
                control={control}
                name="pickupTime"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </FormField>
            <FormField label="Dropoff location" required error={errors.dropoffLocation?.message}>
              <Input placeholder="Karaköy · Hotel address" {...register("dropoffLocation")} />
            </FormField>
            <FormField label="Dropoff date">
              <Controller
                control={control}
                name="dropoffDate"
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} min={watch("pickupDate") || undefined} />
                )}
              />
            </FormField>
            <FormField label="Dropoff time">
              <Controller
                control={control}
                name="dropoffTime"
                render={({ field }) => <TimePicker value={field.value} onChange={field.onChange} />}
              />
            </FormField>
          </div>
        </section>
      )}

      {/* PRICE */}
      <section className="border border-rule bg-cream-warm p-6 space-y-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Price</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <FormField label="Currency" required>
            <Select {...register("currency")}>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="TRY">TRY (₺)</option>
            </Select>
          </FormField>
          <FormField label="Qty" required error={errors.qty?.message}>
            <Input
              type="number"
              min={1}
              step={1}
              {...register("qty", { setValueAs: (v) => (v === "" || v == null ? 0 : Number(v)) })}
            />
          </FormField>
          <FormField label="Unit price" required error={errors.unitPrice?.message}>
            <Input
              type="number"
              min={0}
              step={0.01}
              {...register("unitPrice", { setValueAs: (v) => (v === "" || v == null ? 0 : Number(v)) })}
            />
          </FormField>
          <FormField label="Grand total">
            <Input
              readOnly
              value={`${CURRENCY_SYMBOL[currency]} ${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </FormField>
        </div>
        <FormField label="Item descriptor (under item name)">
          <Input
            placeholder="Boutique tour · scheduled departure · group package"
            {...register("itemDescriptor")}
          />
        </FormField>
      </section>

      {/* NOTES */}
      <section className="border border-rule bg-cream-warm p-6 space-y-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Notes</h2>
        <FormField label="Payment note (italic banner)" required error={errors.paymentNote?.message}>
          <Textarea rows={2} {...register("paymentNote")} />
        </FormField>
        <FormField label="Footer thanks" required error={errors.footerThanks?.message}>
          <Textarea rows={2} {...register("footerThanks")} />
        </FormField>
      </section>

      {/* LANGUAGE + ACTIONS */}
      <section className="border border-rule bg-cream-warm p-6 space-y-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Output</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end">
          <FormField label="Language" hint="Static labels (e.g. 'VOUCHER', 'Check-in') come from a built-in dictionary. 'Translate with AI' translates the free-text fields you entered above.">
            <Controller
              control={control}
              name="locale"
              render={({ field }) => (
                <Select {...field}>
                  {LOCALES.map((l) => (
                    <option key={l} value={l}>
                      {LOCALE_NAMES[l]}
                    </option>
                  ))}
                </Select>
              )}
            />
          </FormField>
          <Button type="button" variant="ghost" onClick={onTranslate} disabled={translating}>
            <Languages size={14} />
            {translating ? "Translating…" : "Translate with AI"}
          </Button>
          <Button type="submit" variant="solid" disabled={downloading}>
            <Download size={14} />
            {downloading ? "Generating…" : "Download PDF"}
          </Button>
        </div>
      </section>
    </form>
  );
}

function isCurrency(v: string | undefined | null): v is VoucherPayload["currency"] {
  return v === "EUR" || v === "USD" || v === "GBP" || v === "TRY";
}

// Field-path prefixes shown in the validation toast. e.g. an error on
// `guests[2].name` surfaces as "Guest 3 — Name is required" instead of just
// "Name is required" with no context as to which guest row is invalid.
function firstErrorMessage(errors: unknown, path: string[] = []): string | null {
  if (!errors || typeof errors !== "object") return null;
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const node = value as { message?: string };
    if (typeof node.message === "string" && node.message.length > 0) {
      return formatErrorLabel([...path, key]) + node.message;
    }
    const nested = firstErrorMessage(value, [...path, key]);
    if (nested) return nested;
  }
  return null;
}

function formatErrorLabel(path: string[]): string {
  if (path.length === 0) return "";
  if (path[0] === "guests" && path.length >= 2) {
    const idx = Number(path[1]);
    if (Number.isFinite(idx)) return `Guest ${idx + 1} — `;
  }
  return "";
}
