"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Select } from "@/components/admin/Input/Select";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { saveHomeContent } from "./actions";
import { homeContentSchema, type HomeContentFormValues } from "./schema";
import type {
  HomeHeroData,
  HomeAboutData,
  HomeHowItWorksData,
  HomeFeaturedHeadingData,
  HomeQuoteData,
} from "@/lib/supabase/types";

interface HomeEditorProps {
  hero: HomeHeroData;
  about: HomeAboutData;
  howItWorks: HomeHowItWorksData;
  featured: HomeFeaturedHeadingData;
  quote: HomeQuoteData;
}

function Section({
  title,
  kicker,
  open,
  onToggle,
  children,
}: {
  title: string;
  kicker: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`border bg-cream-warm ${open ? "border-rule border-l-2 border-l-ochre" : "border-rule"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-cream-deep transition-colors duration-150"
      >
        <div className="space-y-1">
          <Kicker>{kicker}</Kicker>
          <p className="font-display text-[18px] font-semibold tracking-tight text-ink">{title}</p>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-ochre flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-ochre flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-8 pt-2 border-t border-rule space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value?.length ?? 0;
  return (
    <span className={`font-mono text-[10px] tracking-[0.14em] tabular-nums ${len > max ? "text-terracotta" : "text-muted"}`}>
      {len}/{max}
    </span>
  );
}

export function HomeEditor({ hero, about, howItWorks, featured, quote }: HomeEditorProps) {
  const [openSection, setOpenSection] = useState<string>("hero");
  const [saving, setSaving] = useState(false);

  const defaultValues: HomeContentFormValues = {
    hero: {
      kicker: hero.kicker,
      headline_top: hero.headline_top,
      headline_em: hero.headline_em,
      sub: hero.sub,
      hero_image: hero.hero_image ?? null,
    },
    about: {
      heading: about.heading,
      body: about.body,
    },
    how_it_works: {
      section_heading: howItWorks.section_heading ?? "",
      steps: (howItWorks.steps?.length ? howItWorks.steps : [
        { num: "01", heading: "", body: "", icon: "compass" as const },
        { num: "02", heading: "", body: "", icon: "suitcase" as const },
        { num: "03", heading: "", body: "", icon: "whatsapp" as const },
      ]).map((s) => ({
        num: s.num,
        heading: s.heading,
        body: s.body,
        icon: s.icon as "compass" | "suitcase" | "whatsapp",
      })),
    },
    featured: {
      section_heading: featured.section_heading,
      featured_slugs: featured.featured_slugs ?? [],
    },
    quote: {
      quote: quote.quote,
      attribution: quote.attribution,
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<HomeContentFormValues>({
    resolver: zodResolver(homeContentSchema),
    defaultValues,
  });

  const { fields: stepFields } = useFieldArray({ control, name: "how_it_works.steps" });

  const watchedAboutBody = watch("about.body");
  const watchedQuote = watch("quote.quote");
  const watchedSub = watch("hero.sub");

  function toggleSection(id: string) {
    setOpenSection((cur) => (cur === id ? "" : id));
  }

  async function onSubmit(values: HomeContentFormValues) {
    setSaving(true);
    try {
      const result = await saveHomeContent(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Home page saved.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const heroKicker = watch("hero.kicker");
  const heroTop = watch("hero.headline_top");
  const heroEm = watch("hero.headline_em");
  const heroSub = watch("hero.sub");

  return (
    <form onSubmit={handleSubmit(onSubmit, (errs) => { const first = Object.entries(errs).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("; "); console.error("Form validation failed", errs); toast.error(`Validation: ${first}`); })} noValidate>
      <div className="space-y-3 mb-24">

        {/* Hero */}
        <Section
          kicker="Section 1"
          title="Hero"
          open={openSection === "hero"}
          onToggle={() => toggleSection("hero")}
        >
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
              <FormField label="Hero background image">
                <ImageUploader
                  value={watch("hero.hero_image") ?? null}
                  onChange={(path) => setValue("hero.hero_image", path)}
                  folder="pages/home"
                  aspectRatio="16/7"
                />
              </FormField>
            </div>

            {/* Live preview */}
            <div className="hidden md:block">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-3">Preview</p>
              <div className="bg-cream-deep border border-rule p-6 space-y-2 min-h-[200px] flex flex-col justify-center">
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

        {/* About */}
        <Section
          kicker="Section 2"
          title="About strip"
          open={openSection === "about"}
          onToggle={() => toggleSection("about")}
        >
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

        {/* How it works */}
        <Section
          kicker="Section 3"
          title="How it works"
          open={openSection === "how"}
          onToggle={() => toggleSection("how")}
        >
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
        </Section>

        {/* Featured heading */}
        <Section
          kicker="Section 4"
          title="Featured section heading"
          open={openSection === "featured"}
          onToggle={() => toggleSection("featured")}
        >
          <FormField label="Section heading" required error={errors.featured?.section_heading?.message}>
            <Input {...register("featured.section_heading")} />
          </FormField>
        </Section>

        {/* Quote */}
        <Section
          kicker="Section 5"
          title="Quote strip"
          open={openSection === "quote"}
          onToggle={() => toggleSection("quote")}
        >
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
      </div>

      {/* Sticky save */}
      <div className="fixed bottom-6 right-6 z-30">
        <GoldButton type="submit" variant="solid">
          {saving ? "Saving…" : "Save home page"}
        </GoldButton>
      </div>
    </form>
  );
}
