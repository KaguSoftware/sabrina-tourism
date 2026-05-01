"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

import { savePackage } from "@/app/admin/(authed)/packages/[slug]/actions";
import { PackageSchema } from "@/app/admin/(authed)/packages/[slug]/schema";
import { slugify } from "@/lib/utils/slug";
import type { PackageRaw } from "@/lib/db/packages";

import { TABS, type Tab, type PackageFormValues } from "./types";
import { defaultValues } from "./defaultValues";
import { ErrorCallout } from "./primitives";
import { BasicsTab } from "./tabs/BasicsTab";
import { OverviewTab } from "./tabs/OverviewTab";
import { ItineraryTab } from "./tabs/ItineraryTab";
import { TiersTab } from "./tabs/TiersTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { InclusionsTab } from "./tabs/InclusionsTab";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? "" : "s"} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? "" : "s"} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? "" : "s"} ago`;
}

function collectErrors(errs: Record<string, any>): string[] {
  const msgs: string[] = [];
  function walk(obj: any) {
    if (!obj) return;
    if (typeof obj.message === "string") { msgs.push(obj.message); return; }
    for (const key of Object.keys(obj)) walk(obj[key]);
  }
  walk(errs);
  return msgs;
}

// ---------------------------------------------------------------------------
// PackageEditor
// ---------------------------------------------------------------------------

interface PackageEditorProps {
  pkg?: PackageRaw;
}

export function PackageEditor({ pkg }: PackageEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Basics");
  const [saving, setSaving] = useState(false);

  const methods = useForm<PackageFormValues>({
    resolver: zodResolver(PackageSchema),
    defaultValues: defaultValues(pkg),
    mode: "onBlur",
  });

  const { handleSubmit, watch, formState: { isDirty, errors } } = methods;

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (isDirty) { e.preventDefault(); e.returnValue = ""; }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const errorMessages = collectErrors(errors as Record<string, any>);
  const name = watch("name");
  const isPublished = watch("is_published");
  const computedSlug = slugify(name || "");
  const lastSaved = pkg?.updated_at ? formatRelativeTime(new Date(pkg.updated_at)) : null;

  const onSubmit = handleSubmit(async (data) => {
    setSaving(true);
    try {
      const result = await savePackage(data);
      if (result.error) {
        if (result.error.includes("Maximum 3 featured")) {
          toast.error(result.error, {
            style: { background: "#c05a3a", color: "#f5ede0", border: "1px solid #c05a3a" },
          });
        } else {
          toast.error(result.error);
        }
        return;
      }
      toast.success("Saved.");
      if (!pkg) {
        router.push(`/admin/packages/${result.slug}`);
      } else if (result.slug && result.slug !== pkg.slug) {
        router.push(`/admin/packages/${result.slug}`);
      } else {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  });

  const SaveButton = ({ label = "Save" }: { label?: string }) => (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
    >
      {saving ? "Saving…" : label}
    </button>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {/* Page header */}
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-rule mb-0">
          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">Tour</p>
            <h1
              className="text-[28px] text-ink leading-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {name || "New tour"}
            </h1>
            {lastSaved && (
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted">Saved {lastSaved}</p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 pt-1">
            {pkg && isPublished && (
              <a
                href={`/packages/${computedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft hover:text-ink transition-colors border border-rule px-3 py-2"
              >
                View on site <ExternalLink size={11} />
              </a>
            )}
            <SaveButton />
          </div>
        </div>

        {/* Sticky tab bar */}
        <div className="sticky top-0 z-20 bg-cream flex gap-6 px-2 py-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors border ${
                activeTab === tab
                  ? "text-ink bg-cream-deep border-ink"
                  : "text-muted bg-cream-deep border-muted hover:text-ink hover:border-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pt-8">
          {errorMessages.length > 0 && <ErrorCallout errors={errorMessages} />}
          {activeTab === "Basics" && <BasicsTab />}
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Itinerary" && <ItineraryTab />}
          {activeTab === "Tiers" && <TiersTab />}
          {activeTab === "Gallery" && <GalleryTab />}
          {activeTab === "Inclusions" && <InclusionsTab />}
        </div>

        {/* Bottom sticky save bar */}
        {isDirty && (
          <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-rule bg-cream/95 backdrop-blur-sm px-6 py-3 flex justify-end mt-12">
            <SaveButton label="Save changes" />
          </div>
        )}
      </form>
    </FormProvider>
  );
}
