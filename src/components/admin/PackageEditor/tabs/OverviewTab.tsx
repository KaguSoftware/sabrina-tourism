"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Textarea } from "@/components/admin/Input/Textarea";
import type { PackageFormValues } from "../types";

export function OverviewTab() {
  const { register, formState: { errors } } = useFormContext<PackageFormValues>();

  return (
    <FormField
      label="Overview paragraphs"
      hint="Separate paragraphs with a blank line. Each paragraph becomes a block on the detail page."
      error={errors.overview?.message}
      required
    >
      <Textarea rows={14} {...register("overview")} />
    </FormField>
  );
}
