"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Section } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function GroupPackagesSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register } = useFormContext<HomeContentFormValues>();

  return (
    <Section kicker="Section 4" title="Group packages section" open={open} onToggle={onToggle}>
      <FormField label="Section heading">
        <Input {...register("group_packages.section_heading")} placeholder="Four corners of the country." />
      </FormField>
      <FormField label="Kicker">
        <Input {...register("group_packages.kicker")} placeholder="Our Group Packages" />
      </FormField>
      <FormField label="CTA link label">
        <Input {...register("group_packages.cta_label")} placeholder="See all group packages" />
      </FormField>
    </Section>
  );
}
