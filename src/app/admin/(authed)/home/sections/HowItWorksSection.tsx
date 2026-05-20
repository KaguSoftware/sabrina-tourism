"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Select } from "@/components/admin/Input/Select";
import { Section } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function HowItWorksSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register, control, formState: { errors } } = useFormContext<HomeContentFormValues>();
  const { fields: stepFields } = useFieldArray({ control, name: "how_it_works.steps" });

  return (
    <Section kicker="Section 3" title="How it works" open={open} onToggle={onToggle}>
      <FormField label="Section heading" required error={errors.how_it_works?.section_heading?.message}>
        <Input {...register("how_it_works.section_heading")} />
      </FormField>

      <div className="space-y-8 pt-2">
        {stepFields.map((field, i) => (
          <div key={field.id} className="border border-rule/60 bg-cream p-5 space-y-5">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">Step {i + 1}</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Num" required error={errors.how_it_works?.steps?.[i]?.num?.message}>
                <Input {...register(`how_it_works.steps.${i}.num`)} />
              </FormField>
              <FormField label="Icon" required error={errors.how_it_works?.steps?.[i]?.icon?.message}>
                <Select {...register(`how_it_works.steps.${i}.icon`)}>
                  <option value="compass">Compass</option>
                  <option value="suitcase">Suitcase</option>
                  <option value="whatsapp">WhatsApp</option>
                </Select>
              </FormField>
            </div>
            <FormField label="Heading" required error={errors.how_it_works?.steps?.[i]?.heading?.message}>
              <Input {...register(`how_it_works.steps.${i}.heading`)} />
            </FormField>
            <FormField label="Body" required error={errors.how_it_works?.steps?.[i]?.body?.message}>
              <Textarea rows={3} {...register(`how_it_works.steps.${i}.body`)} />
            </FormField>
          </div>
        ))}
      </div>
      <FormField label="CTA label">
        <Input {...register("how_it_works.cta_label")} placeholder="Start a conversation" />
      </FormField>
    </Section>
  );
}
