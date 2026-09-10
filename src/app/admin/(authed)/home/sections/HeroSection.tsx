"use client";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { Section, CharCount } from "../parts";
import type { HomeContentFormValues } from "../schema";

export function HeroSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<HomeContentFormValues>();

  const heroKicker = watch("hero.kicker");
  const heroTop = watch("hero.headline_top");
  const heroEm = watch("hero.headline_em");
  const heroSub = watch("hero.sub");

  return (
    <Section kicker="Section 1" title="Hero" open={open} onToggle={onToggle}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormField label="Kicker" required error={errors.hero?.kicker?.message}>
            <Input {...register("hero.kicker")} />
          </FormField>
          <FormField label="Headline top" required error={errors.hero?.headline_top?.message}>
            <Input {...register("hero.headline_top")} />
          </FormField>
          <FormField label="Headline em (italic ochre)" required error={errors.hero?.headline_em?.message}>
            <Input {...register("hero.headline_em")} />
          </FormField>
          <FormField label="Sub" required error={errors.hero?.sub?.message}>
            <div className="space-y-1">
              <Textarea rows={3} {...register("hero.sub")} />
              <CharCount value={heroSub} max={140} />
            </div>
          </FormField>
          <FormField label="CTA — Browse tours button">
            <Input {...register("hero.cta_browse")} placeholder="Browse tours" />
          </FormField>
          <FormField label="CTA — Book your Driver button">
            <Input {...register("hero.cta_chauffeur")} placeholder="Book your Driver" />
          </FormField>
          <FormField label="Hero background image">
            <ImageUploader
              value={watch("hero.hero_image") ?? null}
              onChange={(path) => setValue("hero.hero_image", path, { shouldDirty: true })}
              folder="pages/home"
              aspectRatio="16/7"
            />
            <ImagePresetPicker
              value={watch("hero.hero_image") ?? ""}
              onChange={(u) => setValue("hero.hero_image", u, { shouldDirty: true })}
            />
          </FormField>
        </div>

        {/* Live preview */}
        <div className="hidden md:block">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Preview</p>
          <div className="bg-cream-deep border border-rule p-6 space-y-2 min-h-50 flex flex-col justify-center">
            <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-teal-deep border-b border-teal-deep pb-1 inline-block">
              {heroKicker || "—"}
            </span>
            <p className="font-display font-semibold text-[28px] leading-[0.9] tracking-[-0.04em] text-navy mt-3">
              {heroTop || "—"}
              <br />
              <em className="text-ochre font-light not-italic">{heroEm || "—"}</em>
            </p>
            <p className="text-[12px] leading-relaxed text-teal-deep/80 max-w-[38ch] mt-2">
              {heroSub || "—"}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
