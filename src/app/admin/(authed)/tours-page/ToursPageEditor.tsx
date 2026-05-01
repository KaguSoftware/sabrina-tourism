"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { saveToursPage, toursPageSchema, type ToursPageFormValues } from "./actions";
import type { ToursHeroData } from "@/lib/supabase/types";

interface ToursPageEditorProps {
  data: ToursHeroData & { kicker?: string };
}

export function ToursPageEditor({ data }: ToursPageEditorProps) {
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

  const onSubmit = handleSubmit(async (values) => {
    const result = await saveToursPage(values);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Saved.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
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
      </FormField>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
