"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveBar, SaveButton } from "@/components/admin/SaveBar/SaveBar";
import { toastSaved, toastError } from "@/lib/admin/toast";
import { SiteContentTranslationsTab } from "@/components/admin/SiteContentTranslationsTab";
import type { TranslatableField, TranslationsState } from "@/components/admin/ContentTranslationsTab/ContentTranslationsTab";
import { saveHomeContent } from "./actions";
import { homeContentSchema, type HomeContentFormValues } from "./schema";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { GroupPackagesSection } from "./sections/GroupPackagesSection";
import { FeaturedSection } from "./sections/FeaturedSection";
import { FeaturedHotelsSection } from "./sections/FeaturedHotelsSection";
import { QuoteSection } from "./sections/QuoteSection";
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
      cta_chauffeur: hero.cta_chauffeur ?? "Book your Driver",
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

  const methods = useForm<HomeContentFormValues>({
    resolver: zodResolver(homeContentSchema),
    defaultValues,
  });
  const { handleSubmit, watch, control, formState: { errors, isDirty } } = methods;

  // Track step count for translation field generation only — sections own
  // their own useFieldArray for rendering.
  const { fields: stepFields } = useFieldArray({ control, name: "how_it_works.steps" });

  function toggleSection(id: string) {
    setOpenSection((cur) => (cur === id ? "" : id));
  }

  async function onSubmit(values: HomeContentFormValues) {
    setSaving(true);
    try {
      const result = await saveHomeContent(values);
      if (result.error) toastError("save home page", result.error);
      else toastSaved("home page");
    } catch {
      toastError("save home page", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const errorCount = Object.keys(errors).length;

  // Translation fields per content key — read from the live form via watch().
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
        { key: "cta_chauffeur", label: "CTA — Book your Driver", englishValue: watch("hero.cta_chauffeur") ?? "Book your Driver" },
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
        { key: "section_heading", label: "Section heading", englishValue: watch("group_packages.section_heading") ?? "Four corners of the country." },
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
        { key: "cta_label", label: "CTA link label", englishValue: watch("how_it_works.cta_label") ?? "Start a conversation" },
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
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, (errs) => {
              const count = Object.keys(errs).length;
              toastError("save", `${count} ${count === 1 ? "field needs" : "fields need"} attention`);
            })}
            noValidate
          >
            <div className="flex justify-end mb-6">
              <SaveButton
                isDirty={isDirty}
                saving={saving}
                hasErrors={errorCount > 0}
                errorCount={errorCount}
                label="Save home page"
              />
            </div>
            <div className="space-y-3">
              <HeroSection open={openSection === "hero"} onToggle={() => toggleSection("hero")} />
              <AboutSection open={openSection === "about"} onToggle={() => toggleSection("about")} />
              <HowItWorksSection open={openSection === "how"} onToggle={() => toggleSection("how")} />
              <GroupPackagesSection open={openSection === "group_packages"} onToggle={() => toggleSection("group_packages")} />
              <FeaturedSection open={openSection === "featured"} onToggle={() => toggleSection("featured")} />
              <FeaturedHotelsSection open={openSection === "featured_hotels"} onToggle={() => toggleSection("featured_hotels")} />
              <QuoteSection open={openSection === "quote"} onToggle={() => toggleSection("quote")} />
            </div>
            <SaveBar
              isDirty={isDirty}
              saving={saving}
              hasErrors={errorCount > 0}
              errorCount={errorCount}
              label="Save home page"
            />
          </form>
        </FormProvider>
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
