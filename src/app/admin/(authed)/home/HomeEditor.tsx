"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Spinner } from "@/components/admin/Spinner/Spinner";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { Select } from "@/components/admin/Input/Select";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { ImagePresetPicker } from "@/components/admin/ImagePresetPicker/ImagePresetPicker";
import { SiteContentTranslationsTab } from "@/components/admin/SiteContentTranslationsTab";
import type { TranslatableField, TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveHomeContent } from "./actions";
import { homeContentSchema, type HomeContentFormValues } from "./schema";
import type {
  HomeHeroData,
  HomeAboutData,
  HomeHowItWorksData,
  HomeFeaturedHeadingData,
  HomeFeaturedHotelsHeadingData,
  HomeGroupPackagesData,
  HomeQuoteData,
} from "@/lib/supabase/types";

type HomeTab = "edit" | "translations";

interface HomeEditorProps {
  hero: HomeHeroData;
  about: HomeAboutData;
  howItWorks: HomeHowItWorksData;
  featured: HomeFeaturedHeadingData;
  featuredHotels: HomeFeaturedHotelsHeadingData;
  groupPackages: HomeGroupPackagesData;
  quote: HomeQuoteData;
  initialTranslations: Record<string, TranslationsState>;
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
          <ChevronUp size={16} className="text-ochre shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-ochre shrink-0" />
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

export function HomeEditor({ hero, about, howItWorks, featured, featuredHotels, groupPackages, quote, initialTranslations }: HomeEditorProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>("edit");
  const [openSection, setOpenSection] = useState<string>("hero");
  const [saving, setSaving] = useState(false);

  const defaultValues: HomeContentFormValues = {
    hero: {
      kicker: hero.kicker ?? "",
      headline_top: hero.headline_top ?? "",
      headline_em: hero.headline_em ?? "",
      sub: hero.sub ?? "",
      hero_image: hero.hero_image ?? null,
      cta_browse: hero.cta_browse ?? "Browse tours",
      cta_chauffeur: hero.cta_chauffeur ?? "Book a chauffeur →",
    },
    about: {
      heading: about.heading ?? "",
      body: about.body ?? "",
      kicker: about.kicker ?? "About — Est. 2014",
    },
    how_it_works: {
      section_heading: howItWorks.section_heading ?? "",
      cta_label: howItWorks.cta_label ?? "Start a conversation",
      steps: (howItWorks.steps?.length ? howItWorks.steps : [
        { num: "01", heading: "", body: "", icon: "compass" as const },
        { num: "02", heading: "", body: "", icon: "suitcase" as const },
        { num: "03", heading: "", body: "", icon: "whatsapp" as const },
      ]).map((s) => ({
        num: s.num,
        heading: s.heading,
        body: s.body,
        icon: (["compass", "suitcase", "whatsapp"].includes(s.icon) ? s.icon : "compass") as "compass" | "suitcase" | "whatsapp",
      })),
    },
    featured: {
      section_heading: featured.section_heading ?? "",
      featured_slugs: featured.featured_slugs ?? [],
      kicker: featured.kicker ?? "Our Daily Packages",
      cta_label: featured.cta_label ?? "See all daily packages",
    },
    featured_hotels: {
      section_heading: featuredHotels.section_heading ?? "",
      kicker: featuredHotels.kicker ?? "Featured hotels",
      cta_label: featuredHotels.cta_label ?? "See all hotels",
    },
    group_packages: {
      section_heading: groupPackages.section_heading ?? "Four corners of the country.",
      kicker: groupPackages.kicker ?? "Our Group Packages",
      cta_label: groupPackages.cta_label ?? "See all group packages",
    },
    quote: {
      quote: quote.quote ?? "",
      attribution: quote.attribution ?? "",
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

  // Build translation fields grouped by content key
  const translationSections: Array<{ contentKey: string; label: string; fields: TranslatableField[] }> = [
    {
      contentKey: "home_hero",
      label: "Hero",
      fields: [
        { key: "kicker", label: "Kicker", englishValue: watch("hero.kicker") },
        { key: "headline_top", label: "Headline top", englishValue: watch("hero.headline_top") },
        { key: "headline_em", label: "Headline em", englishValue: watch("hero.headline_em") },
        { key: "sub", label: "Sub", englishValue: watch("hero.sub"), multiline: true },
        { key: "cta_browse", label: "CTA — Browse tours", englishValue: watch("hero.cta_browse") ?? "Browse tours" },
        { key: "cta_chauffeur", label: "CTA — Book a chauffeur", englishValue: watch("hero.cta_chauffeur") ?? "Book a chauffeur →" },
      ],
    },
    {
      contentKey: "home_about",
      label: "About strip",
      fields: [
        { key: "kicker", label: "Kicker", englishValue: watch("about.kicker") ?? "About — Est. 2014" },
        { key: "heading", label: "Heading", englishValue: watch("about.heading"), multiline: true },
        { key: "body", label: "Body", englishValue: watch("about.body"), multiline: true },
      ],
    },
    {
      contentKey: "home_group_packages",
      label: "Group packages section",
      fields: [
        { key: "kicker", label: "Kicker", englishValue: watch("group_packages.kicker") ?? "Our Group Packages" },
        { key: "cta_label", label: "CTA link label", englishValue: watch("group_packages.cta_label") ?? "See all group packages" },
      ],
    },
    {
      contentKey: "home_featured_heading",
      label: "Featured daily packages section",
      fields: [
        { key: "kicker", label: "Kicker", englishValue: watch("featured.kicker") ?? "Our Daily Packages" },
        { key: "section_heading", label: "Section heading", englishValue: watch("featured.section_heading") },
        { key: "cta_label", label: "CTA link label", englishValue: watch("featured.cta_label") ?? "See all daily packages" },
      ],
    },
    {
      contentKey: "home_featured_hotels_heading",
      label: "Featured hotels section",
      fields: [
        { key: "kicker", label: "Kicker", englishValue: watch("featured_hotels.kicker") ?? "Featured hotels" },
        { key: "section_heading", label: "Section heading", englishValue: watch("featured_hotels.section_heading") },
        { key: "cta_label", label: "CTA link label", englishValue: watch("featured_hotels.cta_label") ?? "See all hotels" },
      ],
    },
    {
      contentKey: "home_how_it_works",
      label: "How it works",
      fields: [
        { key: "section_heading", label: "Section heading", englishValue: watch("how_it_works.section_heading") },
        ...stepFields.flatMap((_, i) => [
          { key: `step_${i}_heading`, label: `Step ${i + 1} heading`, englishValue: watch(`how_it_works.steps.${i}.heading`) },
          { key: `step_${i}_body`, label: `Step ${i + 1} body`, englishValue: watch(`how_it_works.steps.${i}.body`), multiline: true },
        ]),
      ],
    },
    {
      contentKey: "home_quote",
      label: "Quote strip",
      fields: [
        { key: "quote", label: "Quote", englishValue: watch("quote.quote"), multiline: true },
        { key: "attribution", label: "Attribution", englishValue: watch("quote.attribution") },
      ],
    },
  ];

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-rule mb-8">
        {(["edit", "translations"] as HomeTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`font-mono text-[11px] tracking-[0.16em] uppercase px-5 py-3 border-b-2 transition-colors duration-150 ${
              activeTab === tab
                ? "border-ochre text-ink font-bold"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab === "edit" ? "Edit" : "Translations"}
          </button>
        ))}
      </div>

      {activeTab === "edit" && (
        <form onSubmit={handleSubmit(onSubmit, (errs) => { const first = Object.entries(errs).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("; "); console.error("Form validation failed", errs); toast.error(`Validation: ${first}`); })} noValidate>
          <div className="flex justify-end mb-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:opacity-80 disabled:opacity-60 min-w-28 justify-center"
            >
              {saving ? <Spinner size="sm" /> : "Save home page"}
            </button>
          </div>
          <div className="space-y-3">

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
                  <FormField label="CTA — Browse tours button">
                    <Input {...register("hero.cta_browse")} placeholder="Browse tours" />
                  </FormField>
                  <FormField label="CTA — Book a chauffeur button">
                    <Input {...register("hero.cta_chauffeur")} placeholder="Book a chauffeur →" />
                  </FormField>
                  <FormField label="Hero background image">
                    <ImageUploader
                      value={watch("hero.hero_image") ?? null}
                      onChange={(path) => setValue("hero.hero_image", path)}
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

            {/* About */}
            <Section
              kicker="Section 2"
              title="About strip"
              open={openSection === "about"}
              onToggle={() => toggleSection("about")}
            >
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
              <FormField label="CTA label">
                <Input {...register("how_it_works.cta_label")} placeholder="Start a conversation" />
              </FormField>
            </Section>

            {/* Group packages section */}
            <Section
              kicker="Section 4"
              title="Group packages section"
              open={openSection === "group_packages"}
              onToggle={() => toggleSection("group_packages")}
            >
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

            {/* Featured daily packages heading */}
            <Section
              kicker="Section 5"
              title="Featured daily packages section"
              open={openSection === "featured"}
              onToggle={() => toggleSection("featured")}
            >
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

            {/* Featured hotels heading */}
            <Section
              kicker="Section 6"
              title="Featured hotels section"
              open={openSection === "featured_hotels"}
              onToggle={() => toggleSection("featured_hotels")}
            >
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

            {/* Quote */}
            <Section
              kicker="Section 7"
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
        </form>
      )}

      {activeTab === "translations" && (
        <div className="space-y-10">
          {translationSections.map((section) => (
            <div key={section.contentKey} className="border border-rule bg-cream-warm">
              <div className="px-6 py-4 border-b border-rule">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">Home page</p>
                <p className="font-display text-[18px] font-semibold tracking-tight text-ink">{section.label}</p>
              </div>
              <div className="px-6 py-6">
                <SiteContentTranslationsTab
                  contentKey={section.contentKey}
                  fields={section.fields}
                  initialTranslations={initialTranslations[section.contentKey] ?? {}}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
