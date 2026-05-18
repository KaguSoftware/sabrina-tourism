"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { Spinner } from "@/components/admin/Spinner/Spinner";
import { SiteContentTranslationsTab } from "@/components/admin/SiteContentTranslationsTab";
import type { TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveToursPage } from "./actions";
import { toursPageSchema, type ToursPageFormValues } from "./schema";
import type { ToursHeroData } from "@/lib/supabase/types";

type ToursTab = "edit" | "translations";

interface ToursPageEditorProps {
  data: ToursHeroData & { kicker?: string };
  initialTranslations: TranslationsState;
}

export function ToursPageEditor({ data, initialTranslations }: ToursPageEditorProps) {
  const [activeTab, setActiveTab] = useState<ToursTab>("edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ToursPageFormValues>({
    resolver: zodResolver(toursPageSchema),
    defaultValues: {
      kicker: (data as any).kicker ?? "Explore",
      page_heading: data.page_heading ?? "",
      page_lede: data.page_lede ?? "",
      hero_image: (data as any).hero_image ?? null,
    },
  });

  const heroImage = watch("hero_image");

  const onSubmit = handleSubmit(
    async (values) => {
      const result = await saveToursPage(values);
      if (result.error) toast.error(result.error);
      else toast.success("Saved.");
    },
    (errs) => {
      const first = Object.values(errs)[0];
      const msg = (first as any)?.message ?? "Please fix the errors above.";
      toast.error(msg);
    },
  );

  const translationFields = [
    { key: "kicker", label: "Kicker", englishValue: watch("kicker") },
    { key: "page_heading", label: "Heading", englishValue: watch("page_heading") },
    { key: "page_lede", label: "Lede", englishValue: watch("page_lede"), multiline: true },
  ];

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-rule mb-8">
        {(["edit", "translations"] as ToursTab[]).map((tab) => (
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
          <FormField label="Kicker" hint="Small label above the heading" required error={errors.kicker?.message}>
            <Input {...register("kicker")} placeholder="e.g. Explore" />
          </FormField>

          <FormField label="Heading" required error={errors.page_heading?.message}>
            <Input {...register("page_heading")} placeholder="e.g. All tours" />
          </FormField>

          <FormField label="Lede" hint="Subtitle / intro below the heading" required error={errors.page_lede?.message}>
            <Textarea rows={3} {...register("page_lede")} />
          </FormField>

          <FormField label="Hero image" hint="16:9 — used as the tours listing page banner">
            <ImageUploader
              value={heroImage ?? null}
              onChange={(p) => setValue("hero_image", p)}
              folder="tours-page"
              aspectRatio="16/9"
            />
            <ImagePresetPicker
              value={heroImage ?? ""}
              onChange={(u) => setValue("hero_image", u, { shouldDirty: true })}
            />
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
          contentKey="tours_hero"
          fields={translationFields}
          initialTranslations={initialTranslations}
        />
      )}
    </div>
  );
}
