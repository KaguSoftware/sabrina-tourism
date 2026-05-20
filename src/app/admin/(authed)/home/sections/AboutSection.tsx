"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Section, CharCount } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function AboutSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register, watch, formState: { errors } } = useFormContext<HomeContentFormValues>();
  const watchedAboutBody = watch("about.body");

  return (
    <Section kicker="Section 2" title="About strip" open={open} onToggle={onToggle}>
      <FormField label="Kicker">
        <Input {...register("about.kicker")} placeholder="About — Est. 2014" />
      </FormField>
      <FormField label="Heading" required error={errors.about?.heading?.message}>
        <Textarea rows={2} {...register("about.heading")} />
      </FormField>
      <FormField label="Body" required error={errors.about?.body?.message}>
        <div className="space-y-1">
          <Textarea rows={5} {...register("about.body")} />
          <div className="flex justify-end">
            <CharCount value={watchedAboutBody} max={400} />
          </div>
        </div>
      </FormField>
    </Section>
  );
}
