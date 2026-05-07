"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saveHotel } from "@/app/admin/(authed)/hotels/[id]/actions";
import { HotelSchema, type HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";
import type { HotelRow } from "@/lib/db/hotels";
import { ErrorCallout } from "@/components/admin/PackageEditor/primitives";
import { BasicsTab } from "./tabs/BasicsTab";
import { PropertiesTab } from "./tabs/PropertiesTab";
import { AmenitiesTab } from "./tabs/AmenitiesTab";
import { RoomTypesTab } from "./tabs/RoomTypesTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { HotelTranslationsTab } from "./tabs/TranslationsTab";
import type { TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";

const TABS = ["Basics", "Properties", "Amenities", "Room Types", "Gallery", "Translations"] as const;
type Tab = typeof TABS[number];
const TAB_LABEL_KEYS: Record<Tab, string> = {
  Basics: "basics",
  Properties: "properties",
  Amenities: "amenities",
  "Room Types": "roomTypes",
  Gallery: "gallery",
  Translations: "translations",
};

function defaultValues(hotel?: HotelRow): HotelFormValues {
  if (hotel) {
    const sorted = <T extends { sort_order: number }>(arr: T[]) => [...arr].sort((a, b) => a.sort_order - b.sort_order);
    return {
      id: hotel.id,
      name: hotel.name,
      region: hotel.region as HotelFormValues["region"],
      description: hotel.description,
      long_description: hotel.long_description,
      tag_a: hotel.tag_a,
      tag_b: hotel.tag_b,
      svg_variant: hotel.svg_variant,
      location: hotel.location,
      check_in_time: hotel.check_in_time,
      check_out_time: hotel.check_out_time,
      languages: hotel.languages ?? [],
      distance_km: hotel.distance_km,
      bedrooms: hotel.bedrooms,
      bathrooms: hotel.bathrooms,
      free_wifi: hotel.free_wifi,
      free_cancellation: hotel.free_cancellation,
      free_parking: hotel.free_parking,
      bed_breakfast: hotel.bed_breakfast,
      balcony: hotel.balcony,
      washer: hotel.washer,
      ac: hotel.ac,
      tv: hotel.tv,
      is_published: hotel.is_published,
      amenities: sorted(hotel.hotel_amenities ?? []).filter((a) => !a.is_property).map((a) => ({ text: a.text })),
      room_types: sorted(hotel.hotel_room_types ?? []).map((r) => ({ id: r.id, name: r.name, capacity: r.capacity, beds: r.beds, size: r.size, image_index: r.image_index, highlights: r.highlights ?? [] })),
      images: sorted(hotel.hotel_images ?? []).map((i) => ({ id: i.id, url: i.url, label: i.label })),
    };
  }
  return {
    name: "", region: "Istanbul", description: "", long_description: "",
    tag_a: "", tag_b: "", svg_variant: "ottoman", location: "",
    check_in_time: "15:00", check_out_time: "12:00", languages: [],
    distance_km: 0, bedrooms: 1, bathrooms: 1,
    free_wifi: false, free_cancellation: false, free_parking: false,
    bed_breakfast: false, balcony: false, washer: false, ac: false, tv: false,
    is_published: false, amenities: [], room_types: [], images: [],
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

export function HotelEditor({ hotel, initialTranslations = {} }: { hotel?: HotelRow; initialTranslations?: TranslationsState }) {
  const t = useTranslations("admin.editor");
  const tabT = useTranslations("admin.tabs");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Basics");
  const [saving, setSaving] = useState(false);

  const methods = useForm<HotelFormValues>({ resolver: zodResolver(HotelSchema), defaultValues: defaultValues(hotel), mode: "onBlur" });
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
      const result = await saveHotel(data);
      if (result.error) { toast.error(result.error); return; }
      toast.success("Saved.");
      if (!hotel) router.push(`/admin/hotels/${result.id}`);
      else router.refresh();
    } finally { setSaving(false); }
  });

  const SaveButton = ({ label = t("save") }: { label?: string }) => (
    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:scale-[0.97] disabled:opacity-60">
      {saving ? t("saving") : label}
    </button>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-rule mb-0">
          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">{t("hotel")}</p>
            <h1 className="text-[28px] text-ink leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>{name || t("newHotel")}</h1>
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
          {activeTab === "Properties" && <PropertiesTab />}
          {activeTab === "Amenities" && <AmenitiesTab />}
          {activeTab === "Room Types" && <RoomTypesTab />}
          {activeTab === "Gallery" && <GalleryTab />}
          {activeTab === "Translations" && hotel?.id && (
            <HotelTranslationsTab hotelId={hotel.id} formValues={formValues} initialTranslations={initialTranslations} />
          )}
          {activeTab === "Translations" && !hotel?.id && (
            <p className="font-mono text-[12px] tracking-[0.14em] uppercase text-muted">{t("saveHotelFirst")}</p>
          )}
        </div>

        {isDirty && activeTab !== "Translations" && (
          <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-rule bg-cream/95 backdrop-blur-sm px-6 py-3 flex justify-end mt-12">
            <SaveButton label={t("saveChanges")} />
          </div>
        )}
      </form>
    </FormProvider>
  );
}
