"use client";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Select } from "@/components/admin/Input/Select";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Toggle } from "@/components/admin/PackageEditor/primitives";
import type { HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";

const REGIONS = ["Istanbul","Cappadocia","Aegean","Mediterranean","Black Sea","Eastern Anatolia"] as const;
const SVG_VARIANTS = ["ottoman","mansion","cave","aegean","coastal","chalet"] as const;

export function BasicsTab() {
  const t = useTranslations("admin.editor");
  const { register, control, watch, formState: { errors } } = useFormContext<HotelFormValues>();
  const isPublished = watch("is_published");
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: "languages" as never });
  const languages = watch("languages") as string[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-2">
        <FormField label="Name" required error={errors.name?.message}><Input {...register("name")} placeholder="e.g. Bosphorus Manor" /></FormField>
      </div>

      <FormField label="Region" required error={errors.region?.message}>
        <Select {...register("region")}>{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</Select>
      </FormField>

      <FormField label="Location" required error={errors.location?.message}><Input {...register("location")} placeholder="e.g. Beşiktaş, Istanbul" /></FormField>

      <FormField label="Tag 1" required error={errors.tag_a?.message}><Input {...register("tag_a")} placeholder="e.g. Boutique" /></FormField>
      <FormField label="Tag 2" required error={errors.tag_b?.message}><Input {...register("tag_b")} placeholder="e.g. Waterfront" /></FormField>

      <FormField label="Style / Illustration" required error={errors.svg_variant?.message}>
        <Select {...register("svg_variant")}>{SVG_VARIANTS.map((v) => <option key={v} value={v}>{v}</option>)}</Select>
      </FormField>

      <FormField label="Check-in time" required error={errors.check_in_time?.message}><Input {...register("check_in_time")} placeholder="15:00" /></FormField>
      <FormField label="Check-out time" required error={errors.check_out_time?.message}><Input {...register("check_out_time")} placeholder="12:00" /></FormField>

      <div className="md:col-span-2">
        <FormField label="Languages spoken">
          <div className="space-y-2">
            {languages.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input {...register(`languages.${i}` as const)} placeholder="e.g. English" className="flex-1" />
                <button type="button" onClick={() => removeLang(i)} className="text-ink-soft hover:text-terracotta transition-colors p-1"><X size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => appendLang("" as never)} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors">
              <Plus size={12} /> {t("addLanguage")}
            </button>
          </div>
        </FormField>
      </div>

      <div className="md:col-span-2">
        <FormField label="Short description" hint="~200 chars — used on cards" required error={errors.description?.message}>
          <Textarea rows={3} {...register("description")} />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <FormField label="Long description" hint="Full text shown on the detail page" required error={errors.long_description?.message}>
          <Textarea rows={7} {...register("long_description")} />
        </FormField>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium">{t("published")}</p>
        <Controller name="is_published" control={control} render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} />} />
        {isPublished && <p className="font-mono text-[10px] text-ochre tracking-wide">{t("visibleOnPublicSite")}</p>}
      </div>
    </div>
  );
}
