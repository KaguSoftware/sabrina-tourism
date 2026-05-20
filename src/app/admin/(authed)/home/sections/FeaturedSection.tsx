"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Section } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function FeaturedSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register, formState: { errors } } = useFormContext<HomeContentFormValues>();

  return (
    <Section kicker="Section 5" title="Featured daily packages section" open={open} onToggle={onToggle}>
      <FormField label="Kicker">
        <Input {...register("featured.kicker")} placeholder="Our Daily Packages" />
      </FormField>
      <FormField label="Section heading" required error={errors.featured?.section_heading?.message}>
        <Input {...register("featured.section_heading")} />
      </FormField>
      <FormField label="CTA link label">
        <Input {...register("featured.cta_label")} placeholder="See all daily packages" />
      </FormField>
    </Section>
  );
}
