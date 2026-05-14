"use client";
import { useFormContext, Controller } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Select } from "@/components/admin/Input/Select";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Toggle } from "@/components/admin/PackageEditor/primitives";
import { DatePicker } from "@/components/primitives/DatePicker/DatePicker";
import { DAILY_SEASON_OPTIONS, type DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";

const REGIONS = ["Istanbul", "Cappadocia", "Aegean", "Mediterranean", "Black Sea", "Eastern Anatolia"] as const;

export function BasicsTab() {
  const { register, control, watch, formState: { errors } } = useFormContext<DailyFormValues>();
  const isPublished = watch("is_published");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-2">
        <FormField label="Tour name" required error={errors.name?.message}>
          <Input {...register("name")} placeholder="e.g. Bosphorus Sunrise Cruise" />
        </FormField>
      </div>

      <FormField label="Tour date" required error={errors.tour_date?.message}>
        <Controller
          name="tour_date"
          control={control}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} placeholder="Select tour date" error={!!errors.tour_date} />
          )}
        />
      </FormField>
      <FormField label="Region" required error={errors.region?.message}>
        <Select {...register("region")}>{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</Select>
      </FormField>

      <FormField label="Season">
        <Select {...register("season", { setValueAs: (v) => (v === "" || v == null ? null : v) })}>
          <option value="">—</option>
          {DAILY_SEASON_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </FormField>

      <FormField label="Start time" required error={errors.start_time?.message}>
        <Input {...register("start_time")} placeholder="08:00" />
      </FormField>
      <FormField label="End time" required error={errors.end_time?.message}>
        <Input {...register("end_time")} placeholder="18:00" />
      </FormField>

      <FormField label="Vehicle" error={errors.vehicle?.message}>
        <Input {...register("vehicle")} placeholder="e.g. Catamaran, Minibus" />
      </FormField>
      <FormField label="Driver / Guide" error={errors.driver?.message}>
        <Input {...register("driver")} placeholder="e.g. Licensed guide" />
      </FormField>

      <FormField label="Price" required error={errors.price?.message}>
        <Input type="number" min={0} step={0.01} {...register("price", { valueAsNumber: true })} />
      </FormField>
      <FormField label="Currency">
        <Select {...register("currency")}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="TRY">TRY</option>
          <option value="GBP">GBP</option>
        </Select>
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Short description" hint="~200 chars — shown on cards" required error={errors.short_description?.message}>
          <Textarea rows={3} {...register("short_description")} />
        </FormField>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium">Published</p>
        <Controller name="is_published" control={control} render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} />} />
        {isPublished && <p className="font-mono text-[10px] text-ochre tracking-wide">Visible on the public site.</p>}
      </div>
    </div>
  );
}
