"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { savePremadePackage } from "@/app/admin/(authed)/fixed-dates/[id]/actions";
import { PremadeSchema, type PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";
import type { PremadePackageRaw } from "@/lib/db/premade-packages";
import { ErrorCallout } from "@/components/admin/PackageEditor/primitives";
import { Spinner } from "@/components/admin/Spinner/Spinner";
import { BasicsTab } from "./tabs/BasicsTab";
import { ImageryTab } from "./tabs/ImageryTab";
import { AccommodationTab } from "./tabs/AccommodationTab";
import { VehicleTab } from "./tabs/VehicleTab";
import { OverviewTab } from "./tabs/OverviewTab";
import { ItineraryTab } from "./tabs/ItineraryTab";
import { TiersTab } from "./tabs/TiersTab";
import { InclusionsTab } from "./tabs/InclusionsTab";
import { PricingTab } from "./tabs/PricingTab";
import { PremadeTranslationsTab } from "./tabs/TranslationsTab";
import type { TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";

const TABS = ["Basics", "Pricing", "Overview", "Itinerary", "Tiers", "Inclusions", "Imagery", "Accommodation", "Vehicle", "Translations"] as const;
type Tab = typeof TABS[number];
const TAB_LABEL_KEYS: Record<Tab, string> = {
  Basics: "basics",
  Pricing: "pricing",
  Overview: "overview",
  Itinerary: "itinerary",
  Tiers: "tiers",
  Inclusions: "inclusions",
  Imagery: "imagery",
  Accommodation: "accommodation",
  Vehicle: "vehicle",
  Translations: "translations",
};

function defaultValues(pkg?: PremadePackageRaw): PremadeFormValues {
  if (pkg) {
    const sorted = <T extends { sort_order: number }>(arr: T[]) => [...arr].sort((a, b) => a.sort_order - b.sort_order);
    return {
      id: pkg.id,
      name: pkg.name,
      start_date: pkg.start_date,
      end_date: pkg.end_date,
      destinations: pkg.destinations ?? [],
      short_description: pkg.short_description,
      hero_image: pkg.hero_image ?? "",
      card_image: pkg.card_image ?? "",
      accommodation_name: pkg.accommodation_name ?? "",
      accommodation_description: pkg.accommodation_description ?? "",
      accommodation_image_a: pkg.accommodation_image_a ?? "",
      accommodation_image_b: pkg.accommodation_image_b ?? "",
      vehicle_model: pkg.vehicle_model ?? "",
      vehicle_features: pkg.vehicle_features ?? [],
      gallery: sorted(pkg.premade_package_gallery ?? []).map((g) => ({ url: g.url })),
      dates: sorted(pkg.premade_package_dates ?? []).map((d) => ({ start_date: d.start_date, end_date: d.end_date })),
      is_published: pkg.is_published,
      region: pkg.region ?? "",
      duration: pkg.duration ?? "",
      min_people: pkg.min_people ?? null,
      max_people: pkg.max_people ?? null,
      available_from: pkg.available_from ?? "",
      available_to: pkg.available_to ?? "",
      overview: pkg.overview ?? "",
      tiers: sorted(pkg.premade_package_tiers ?? []).map((t) => ({
        tier_name: t.tier_name,
        vehicle_class: t.vehicle_class,
        accommodation: t.accommodation,
        hotel_id: t.hotel_id ?? null,
        group_size: t.group_size,
        guide_languages: t.guide_languages ?? [],
        meals_included: t.meals_included,
        highlights: t.highlights ?? [],
      })),
      itinerary: sorted(pkg.premade_package_itinerary_days ?? []).map((d) => ({
        day_number: d.day_number,
        title: d.title,
        description: d.description,
      })),
      included: (pkg.premade_package_inclusions ?? []).filter((i) => i.kind === "included").sort((a, b) => a.sort_order - b.sort_order).map((i) => ({ text: i.text, icon: i.icon ?? null })),
      not_included: (pkg.premade_package_inclusions ?? []).filter((i) => i.kind === "not_included").sort((a, b) => a.sort_order - b.sort_order).map((i) => ({ text: i.text, icon: i.icon ?? null })),
      price: pkg.price ?? null,
      currency: pkg.currency ?? "USD",
      season: (pkg.season ?? null) as PremadeFormValues["season"],
      price_1_person: pkg.price_1_person ?? null,
      price_2_people: pkg.price_2_people ?? null,
      price_baby: pkg.price_baby ?? null,
      price_single_room_supplement: pkg.price_single_room_supplement ?? null,
      price_per_child: pkg.price_per_child ?? null,
    };
  }
  return {
    name: "", start_date: "", end_date: "",
    dates: [], destinations: [], short_description: "",
    hero_image: "", card_image: "",
    accommodation_name: "", accommodation_description: "",
    accommodation_image_a: "", accommodation_image_b: "",
    vehicle_model: "", vehicle_features: [],
    gallery: [], is_published: false,
    region: "", season: null, duration: "",
    min_people: null, max_people: null,
    available_from: "", available_to: "",
    overview: "", tiers: [], itinerary: [],
    included: [], not_included: [],
    price: null, currency: "USD",
    price_1_person: null, price_2_people: null, price_baby: null, price_single_room_supplement: null, price_per_child: null,
  };
}

function collectErrors(errs: Record<string, unknown>): string[] {
  const msgs: string[] = [];
  function walk(obj: unknown) {
    if (!obj || typeof obj !== "object") return;
    const o = obj as Record<string, unknown>;
    if (typeof o.message === "string") { msgs.push(o.message); return; }
    for (const k of Object.keys(o)) walk(o[k]);
  }
  walk(errs);
  return msgs;
}

export interface PremadeHotelOption {
  id: string;
  name: string;
  region: string;
}

export function PremadeEditor({
  pkg,
  initialTranslations = {},
  availableHotels = [],
}: {
  pkg?: PremadePackageRaw;
  initialTranslations?: TranslationsState;
  availableHotels?: PremadeHotelOption[];
}) {
  const tabT = useTranslations("admin.tabs");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Basics");
  const [saving, setSaving] = useState(false);

  const methods = useForm<PremadeFormValues>({ resolver: zodResolver(PremadeSchema), defaultValues: defaultValues(pkg), mode: "onBlur" });
  const { handleSubmit, watch, formState: { isDirty, errors } } = methods;

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) { if (isDirty) { e.preventDefault(); e.returnValue = ""; } }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const name = watch("name");
  const formValues = watch();
  const errorMessages = collectErrors(errors as Record<string, unknown>);

  const onSubmit = handleSubmit(async (data) => {
    setSaving(true);
    try {
      const result = await savePremadePackage(data);
      if (result.error) { toast.error(result.error); return; }
      toast.success("Saved.");
      if (!pkg) router.push(`/admin/fixed-dates/${result.id}`);
      else router.refresh();
    } finally { setSaving(false); }
  });

  const SaveButton = ({ label = "Save" }: { label?: string }) => (
    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:opacity-80 disabled:opacity-60 min-w-28 justify-center">
      {saving ? <Spinner size="sm" /> : label}
    </button>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-rule mb-0">
          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">Group Tour</p>
            <h1 className="text-[28px] text-ink leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>{name || "New tour"}</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 pt-1"><SaveButton /></div>
        </div>

        <div className="sticky top-0 z-20 flex gap-3 px-4 py-4 overflow-x-auto" style={{ background: "#f5ede0" }}>
          {TABS.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className="px-5 py-3 font-mono text-[10px] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-150 rounded-md"
              style={activeTab === tab ? { background: "#1b4d5c", border: "1px solid #1b4d5c", color: "#f5ede0" } : { background: "#efe4d2", border: "1px solid #c5b99e", color: "#4a4036" }}
            >{tabT(TAB_LABEL_KEYS[tab])}</button>
          ))}
        </div>

        <div className="pt-8">
          {errorMessages.length > 0 && <ErrorCallout errors={errorMessages} />}
          {activeTab === "Basics" && <BasicsTab />}
          {activeTab === "Pricing" && <PricingTab />}
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Itinerary" && <ItineraryTab />}
          {activeTab === "Tiers" && <TiersTab availableHotels={availableHotels} />}
          {activeTab === "Inclusions" && <InclusionsTab />}
          {activeTab === "Imagery" && <ImageryTab />}
          {activeTab === "Accommodation" && <AccommodationTab />}
          {activeTab === "Vehicle" && <VehicleTab />}
          {activeTab === "Translations" && pkg?.id && (
            <PremadeTranslationsTab pkgId={pkg.id} formValues={formValues} initialTranslations={initialTranslations} />
          )}
          {activeTab === "Translations" && !pkg?.id && (
            <p className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">Save the package first to enable translations.</p>
          )}
        </div>

        <div className={`sticky bottom-0 left-0 right-0 z-20 border-t border-rule bg-cream/95 backdrop-blur-sm px-6 py-3 flex justify-end mt-12 transition-opacity duration-200 ${isDirty && activeTab !== "Translations" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <SaveButton label="Save changes" />
        </div>
      </form>
    </FormProvider>
  );
}
