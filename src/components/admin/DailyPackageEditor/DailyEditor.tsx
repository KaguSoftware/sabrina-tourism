"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saveDailyPackage } from "@/app/admin/(authed)/daily/[id]/actions";
import { DailySchema, type DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";
import type { DailyPackageRaw } from "@/lib/db/daily-packages";
import { ErrorCallout } from "@/components/admin/PackageEditor/primitives";
import { BasicsTab } from "./tabs/BasicsTab";
import { ImageryTab } from "./tabs/ImageryTab";
import { ItineraryTab } from "./tabs/ItineraryTab";
import { InclusionsTab } from "./tabs/InclusionsTab";
import { DailyTranslationsTab } from "./tabs/TranslationsTab";
import type { TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";

const TABS = ["Basics", "Imagery", "Itinerary", "Inclusions", "Translations"] as const;
type Tab = typeof TABS[number];
const TAB_LABEL_KEYS: Record<Tab, string> = {
  Basics: "basics",
  Imagery: "imagery",
  Itinerary: "itinerary",
  Inclusions: "inclusions",
  Translations: "translations",
};

function defaultValues(pkg?: DailyPackageRaw): DailyFormValues {
  if (pkg) {
    const sorted = <T extends { sort_order: number }>(arr: T[]) => [...arr].sort((a, b) => a.sort_order - b.sort_order);
    return {
      id: pkg.id,
      name: pkg.name,
      tour_date: pkg.tour_date,
      start_time: pkg.start_time,
      end_time: pkg.end_time,
      region: pkg.region,
      vehicle: pkg.vehicle ?? "",
      driver: pkg.driver ?? "",
      price: pkg.price,
      currency: pkg.currency ?? "USD",
      short_description: pkg.short_description,
      hero_image: pkg.hero_image ?? "",
      card_image: pkg.card_image ?? "",
      stops: sorted(pkg.daily_package_stops ?? []).map((s) => ({ place: s.place, description: s.description })),
      included: sorted(pkg.daily_package_included ?? []).map((i) => ({ text: i.text })),
      gallery: sorted(pkg.daily_package_gallery ?? []).map((g) => ({ url: g.url })),
      is_published: pkg.is_published,
    };
  }
  return {
    name: "", tour_date: "", start_time: "", end_time: "",
    region: "Istanbul", vehicle: "", driver: "",
    price: 0, currency: "USD", short_description: "",
    hero_image: "", card_image: "",
    stops: [], included: [], gallery: [], is_published: false,
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

interface Props {
  pkg?: DailyPackageRaw;
  initialTranslations?: TranslationsState;
}

export function DailyEditor({ pkg, initialTranslations = {} }: Props) {
  const tabT = useTranslations("admin.tabs");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Basics");
  const [saving, setSaving] = useState(false);

  const methods = useForm<DailyFormValues>({ resolver: zodResolver(DailySchema), defaultValues: defaultValues(pkg), mode: "onBlur" });
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
      const result = await saveDailyPackage(data);
      if (result.error) { toast.error(result.error); return; }
      toast.success("Saved.");
      if (!pkg) router.push(`/admin/daily/${result.id}`);
      else router.refresh();
    } finally { setSaving(false); }
  });

  const SaveButton = ({ label = "Save" }: { label?: string }) => (
    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:scale-[0.97] disabled:opacity-60">
      {saving ? "Saving…" : label}
    </button>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-rule mb-0">
          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">Daily Tour</p>
            <h1 className="text-[28px] text-ink leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>{name || "New daily tour"}</h1>
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
          {activeTab === "Imagery" && <ImageryTab />}
          {activeTab === "Itinerary" && <ItineraryTab />}
          {activeTab === "Inclusions" && <InclusionsTab />}
          {activeTab === "Translations" && pkg?.id && (
            <DailyTranslationsTab
              pkgId={pkg.id}
              formValues={formValues}
              initialTranslations={initialTranslations}
            />
          )}
          {activeTab === "Translations" && !pkg?.id && (
            <p className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">Save the package first to enable translations.</p>
          )}
        </div>

        {isDirty && activeTab !== "Translations" && (
          <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-rule bg-cream/95 backdrop-blur-sm px-6 py-3 flex justify-end mt-12">
            <SaveButton label="Save changes" />
          </div>
        )}
      </form>
    </FormProvider>
  );
}
