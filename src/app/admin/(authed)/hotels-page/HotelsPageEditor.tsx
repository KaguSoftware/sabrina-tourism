"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { SaveBar, SaveButton } from "@/components/admin/SaveBar/SaveBar";
import { toastSaved, toastError } from "@/lib/admin/toast";
import { SiteContentTranslationsTab } from "@/components/admin/SiteContentTranslationsTab";
import type { TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveHotelsPage } from "./actions";
import { hotelsPageSchema, type HotelsPageFormValues } from "./schema";
import type { HotelsPageData } from "@/lib/supabase/types";

type Tab = "edit" | "translations";

interface Props {
  data: HotelsPageData;
  initialTranslations: TranslationsState;
}

export function HotelsPageEditor({ data, initialTranslations }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("edit");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<HotelsPageFormValues>({
    resolver: zodResolver(hotelsPageSchema),
    defaultValues: {
      kicker: data.kicker ?? "Our hotels",
      page_heading: data.page_heading ?? "Curated stays across Türkiye",
      page_lede: data.page_lede ?? "Every property is hand-selected for its character, location, and the experience it delivers — from boutique cave hotels to waterfront retreats.",
      property_singular: data.property_singular ?? "property",
      property_plural: data.property_plural ?? "properties",
      region_index_kicker: data.region_index_kicker ?? "Where you stay",
      region_index_heading: data.region_index_heading ?? "Partnered Hotels",
      region_index_lede: data.region_index_lede ?? "{count} curated properties across Türkiye, organised by region — from Bosphorus terraces to cave suites in Cappadocia.",
      region_section_heading_template: data.region_section_heading_template ?? "Hotels in {region}",
      region_section_cta_label: data.region_section_cta_label ?? "View region",
      region_card_eyebrow_label: data.region_card_eyebrow_label ?? "Partnered Hotel",
      region_card_stay_label: data.region_card_stay_label ?? "Curated Stay",
      hotel_card_cta_label: data.hotel_card_cta_label ?? "View hotel",
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      const result = await saveHotelsPage(values);
      if (result.error) toastError("save hotels page", result.error);
      else toastSaved("hotels page");
    },
    (errs) => {
      const count = Object.keys(errs).length;
      const first = Object.values(errs)[0];
      const msg = (first as { message?: string })?.message ?? `${count} ${count === 1 ? "field needs" : "fields need"} attention`;
      toastError("save", msg);
    },
  );

  const errorCount = Object.keys(errors).length;

  const translationFields = [
    { key: "kicker", label: "Kicker", englishValue: watch("kicker") ?? "" },
    { key: "page_heading", label: "Heading", englishValue: watch("page_heading") },
    { key: "page_lede", label: "Lede", englishValue: watch("page_lede") ?? "", multiline: true },
    { key: "property_singular", label: "Property (singular)", englishValue: watch("property_singular") ?? "" },
    { key: "property_plural", label: "Property (plural)", englishValue: watch("property_plural") ?? "" },
    { key: "region_index_kicker", label: "Region index kicker", englishValue: watch("region_index_kicker") ?? "" },
    { key: "region_index_heading", label: "Region index heading", englishValue: watch("region_index_heading") ?? "" },
    { key: "region_index_lede", label: "Region index lede", englishValue: watch("region_index_lede") ?? "", multiline: true },
    { key: "region_section_heading_template", label: "Region section heading", englishValue: watch("region_section_heading_template") ?? "" },
    { key: "region_section_cta_label", label: "Region section CTA", englishValue: watch("region_section_cta_label") ?? "" },
    { key: "region_card_eyebrow_label", label: "Region card eyebrow", englishValue: watch("region_card_eyebrow_label") ?? "" },
    { key: "region_card_stay_label", label: "Region card stay label", englishValue: watch("region_card_stay_label") ?? "" },
    { key: "hotel_card_cta_label", label: "Hotel card CTA", englishValue: watch("hotel_card_cta_label") ?? "" },
  ];

  return (
    <div>
      <div className="flex gap-1 border-b border-rule mb-8">
        {(["edit", "translations"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[11px] tracking-[0.16em] uppercase px-5 py-3 border-b-2 transition-colors duration-150 ${
              activeTab === tab
                ? "border-ochre text-ink font-bold"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "edit" ? "Edit" : "Translations"}
          </button>
        ))}
      </div>

      {activeTab === "edit" && (
        <form onSubmit={onSubmit} noValidate className="space-y-8">
          <div className="flex justify-end">
            <SaveButton
              isDirty={isDirty}
              saving={isSubmitting}
              hasErrors={errorCount > 0}
              errorCount={errorCount}
            />
          </div>

          <FormField label="Kicker" hint="Small label above the heading">
            <Input {...register("kicker")} placeholder="Our hotels" />
          </FormField>

          <FormField label="Heading" required error={errors.page_heading?.message}>
            <Input {...register("page_heading")} placeholder="Curated stays across Türkiye" />
          </FormField>

          <FormField label="Lede" hint="Subtitle below the heading">
            <Textarea rows={3} {...register("page_lede")} />
          </FormField>

          <FormField label="Property count label (singular)" hint='e.g. "property"'>
            <Input {...register("property_singular")} placeholder="property" />
          </FormField>

          <FormField label="Property count label (plural)" hint='e.g. "properties"'>
            <Input {...register("property_plural")} placeholder="properties" />
          </FormField>

          <div className="border-t border-rule pt-8 space-y-5">
            <h2 className="font-display text-[18px] font-semibold text-ink">Region index page</h2>

            <FormField label="Region index kicker" hint='Shown above the heading on /regions.'>
              <Input {...register("region_index_kicker")} placeholder="Where you stay" />
            </FormField>

            <FormField label="Region index heading">
              <Input {...register("region_index_heading")} placeholder="Partnered Hotels" />
            </FormField>

            <FormField label="Region index lede" hint='Use {count} where the hotel count should appear.'>
              <Textarea rows={3} {...register("region_index_lede")} />
            </FormField>

            <FormField label="Region section heading" hint='Use {region} where the region name should appear.'>
              <Input {...register("region_section_heading_template")} placeholder="Hotels in {region}" />
            </FormField>

            <FormField label="Region CTA label" hint='Arrow is rendered automatically.'>
              <Input {...register("region_section_cta_label")} placeholder="View region" />
            </FormField>

            <FormField label="Region card eyebrow">
              <Input {...register("region_card_eyebrow_label")} placeholder="Partnered Hotel" />
            </FormField>

            <FormField label="Region card stay label">
              <Input {...register("region_card_stay_label")} placeholder="Curated Stay" />
            </FormField>

            <FormField label="Hotel card CTA label" hint='Arrow is rendered automatically.'>
              <Input {...register("hotel_card_cta_label")} placeholder="View hotel" />
            </FormField>
          </div>

          <SaveBar
            isDirty={isDirty}
            saving={isSubmitting}
            hasErrors={errorCount > 0}
            errorCount={errorCount}
          />
        </form>
      )}

      {activeTab === "translations" && (
        <SiteContentTranslationsTab
          contentKey="hotels_page"
          fields={translationFields}
          initialTranslations={initialTranslations}
        />
      )}
    </div>
  );
}
