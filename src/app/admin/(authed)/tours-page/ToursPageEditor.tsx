"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { SaveBar, SaveButton } from "@/components/admin/SaveBar/SaveBar";
import { toastSaved, toastError } from "@/lib/admin/toast";
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
    formState: { errors, isSubmitting, isDirty },
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
      if (result.error) toastError("save tours page", result.error);
      else toastSaved("tours page");
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
            <SaveButton
              isDirty={isDirty}
              saving={isSubmitting}
              hasErrors={errorCount > 0}
              errorCount={errorCount}
            />
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
          contentKey="tours_hero"
          fields={translationFields}
          initialTranslations={initialTranslations}
        />
      )}
    </div>
  );
}
