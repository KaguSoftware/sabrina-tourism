"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Section } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function FeaturedHotelsSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register, formState: { errors } } = useFormContext<HomeContentFormValues>();

  return (
    <Section kicker="Section 6" title="Featured hotels section" open={open} onToggle={onToggle}>
      <FormField label="Kicker">
        <Input {...register("featured_hotels.kicker")} placeholder="Featured hotels" />
      </FormField>
      <FormField label="Section heading" required error={errors.featured_hotels?.section_heading?.message}>
        <Input {...register("featured_hotels.section_heading")} />
      </FormField>
      <FormField label="CTA link label">
        <Input {...register("featured_hotels.cta_label")} placeholder="See all hotels" />
      </FormField>
    </Section>
  );
}
