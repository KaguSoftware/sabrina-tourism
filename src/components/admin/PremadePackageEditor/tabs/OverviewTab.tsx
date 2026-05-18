"use client";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Select } from "@/components/admin/Input/Select";
import { Textarea } from "@/components/admin/Input/Textarea";
import { SEASON_OPTIONS, type PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";

export function OverviewTab() {
  const { register, formState: { errors } } = useFormContext<PremadeFormValues>();
  const tl = useTranslations("admin.formLabels");
  const th = useTranslations("admin.formHints");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <FormField label={tl("region")} hint="e.g. Cappadocia">
        <Input {...register("region")} placeholder="e.g. Istanbul & Cappadocia" />
      </FormField>

      <FormField label={tl("season")}>
        <Select
          {...register("season", { setValueAs: (v) => (v === "" || v == null ? null : v) })}
        >
          <option value="">—</option>
          {SEASON_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </FormField>

      <FormField label={tl("duration")} hint="e.g. 7 days / 6 nights">
        <Input {...register("duration")} placeholder="e.g. 7 days / 6 nights" />
      </FormField>

      <FormField label={tl("minPeople")}>
        <Input
          type="number"
          min={1}
          {...register("min_people", { setValueAs: (v) => (v === "" || v === null ? null : Number(v)) })}
          placeholder="1"
        />
      </FormField>

      <FormField label={tl("maxPeople")}>
        <Input
          type="number"
          min={1}
          {...register("max_people", { setValueAs: (v) => (v === "" || v === null ? null : Number(v)) })}
          placeholder="8"
        />
      </FormField>

      <FormField label={tl("availableFrom")} hint={th("dateRangePublic")}>
        <Input type="date" {...register("available_from")} />
      </FormField>

      <FormField label={tl("availableTo")}>
        <Input type="date" {...register("available_to")} />
      </FormField>

      <div className="md:col-span-2">
        <FormField
          label={tl("overview")}
          hint={th("overviewParagraphs")}
          error={errors.overview?.message}
        >
          <Textarea rows={8} {...register("overview")} placeholder={"First paragraph...\n\nSecond paragraph..."} />
        </FormField>
      </div>
    </div>
  );
}
