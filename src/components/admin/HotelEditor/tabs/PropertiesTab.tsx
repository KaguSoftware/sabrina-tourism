"use client";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import type { HotelFormValues } from "@/app/admin/(authed)/hotels/[id]/schema";

const BOOLEAN_PROPS: { key: keyof HotelFormValues; labelKey: string }[] = [
  { key: "free_wifi", labelKey: "freeWifi" },
  { key: "free_cancellation", labelKey: "freeCancellation" },
  { key: "free_parking", labelKey: "freeParking" },
  { key: "bed_breakfast", labelKey: "bedBreakfast" },
  { key: "balcony", labelKey: "balcony" },
  { key: "washer", labelKey: "washer" },
  { key: "ac", labelKey: "ac" },
  { key: "tv", labelKey: "tv" },
];

export function PropertiesTab() {
  const t = useTranslations("admin.editor");
  const { register, control, formState: { errors } } = useFormContext<HotelFormValues>();

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FormField label="Bedrooms" required error={errors.bedrooms?.message}>
          <Input type="number" min={1} {...register("bedrooms", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Bathrooms" required error={errors.bathrooms?.message}>
          <Input type="number" min={1} {...register("bathrooms", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Distance to centre (km)" required error={errors.distance_km?.message}>
          <Input type="number" min={0} step={0.1} {...register("distance_km", { valueAsNumber: true })} />
        </FormField>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-5">{t("includedFeatures")}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BOOLEAN_PROPS.map(({ key, labelKey }) => (
            <div key={key} className="flex items-center gap-3 p-3 border border-rule">
              <Controller name={key as keyof HotelFormValues} control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 accent-ochre cursor-pointer shrink-0"
                  />
                )}
              />
              <span className="font-sans text-[14px] text-ink">{t(`features.${labelKey}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
