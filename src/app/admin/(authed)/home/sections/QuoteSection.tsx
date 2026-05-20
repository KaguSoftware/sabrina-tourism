"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Section, CharCount } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function QuoteSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register, watch, formState: { errors } } = useFormContext<HomeContentFormValues>();
  const watchedQuote = watch("quote.quote");

  return (
    <Section kicker="Section 7" title="Quote strip" open={open} onToggle={onToggle}>
      <FormField label="Quote" required error={errors.quote?.quote?.message}>
        <div className="space-y-1">
          <Textarea rows={4} {...register("quote.quote")} />
          <div className="flex justify-end">
            <CharCount value={watchedQuote} max={300} />
          </div>
        </div>
      </FormField>
      <FormField label="Attribution" required error={errors.quote?.attribution?.message}>
        <Input {...register("quote.attribution")} />
      </FormField>
    </Section>
  );
}
