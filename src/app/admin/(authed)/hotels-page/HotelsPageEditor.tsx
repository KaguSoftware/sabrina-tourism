"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Spinner } from "@/components/admin/Spinner/Spinner";
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
    formState: { errors, isSubmitting },
  } = useForm<HotelsPageFormValues>({
    resolver: zodResolver(hotelsPageSchema),
    defaultValues: {
      kicker: data.kicker ?? "Our hotels",
      page_heading: data.page_heading ?? "Curated stays across Türkiye",
      page_lede: data.page_lede ?? "Every property is hand-selected for its character, location, and the experience it delivers — from boutique cave hotels to waterfront retreats.",
      property_singular: data.property_singular ?? "property",
      property_plural: data.property_plural ?? "properties",
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      const result = await saveHotelsPage(values);
      if (result.error) toast.error(result.error);
      else toast.success("Saved.");
    },
    (errs) => {
      const first = Object.values(errs)[0];
      toast.error((first as any)?.message ?? "Please fix the errors above.");
    },
  );

  const translationFields = [
    { key: "kicker", label: "Kicker", englishValue: watch("kicker") ?? "" },
    { key: "page_heading", label: "Heading", englishValue: watch("page_heading") },
    { key: "page_lede", label: "Lede", englishValue: watch("page_lede") ?? "", multiline: true },
    { key: "property_singular", label: "Property (singular)", englishValue: watch("property_singular") ?? "" },
    { key: "property_plural", label: "Property (plural)", englishValue: watch("property_plural") ?? "" },
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:opacity-80 disabled:opacity-60 min-w-28 justify-center"
            >
              {isSubmitting ? <Spinner size="sm" /> : "Save"}
            </button>
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:opacity-80 disabled:opacity-60 min-w-28 justify-center"
            >
              {isSubmitting ? <Spinner size="sm" /> : "Save"}
            </button>
          </div>
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
