"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ExternalLink, Check, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/admin/Spinner/Spinner";

import { savePackage } from "@/app/admin/(authed)/packages/[slug]/actions";
import { PackageSchema } from "@/app/admin/(authed)/packages/[slug]/schema";
import { slugify } from "@/lib/utils/slug";
import type { PackageRaw } from "@/lib/db/packages";

import { formatRelativeTime, useDirtyBeforeUnload } from "@/lib/admin/editor-helpers";
import { toastSaved, toastError } from "@/lib/admin/toast";
import {
  getPackageTabIssues,
  statusForTab,
  summarizeIssues,
} from "@/lib/admin/tab-completeness";
import { TABS, type Tab, type PackageFormValues } from "./types";
import { defaultValues } from "./defaultValues";
import { ReadinessPanel } from "./primitives";
import { BasicsTab } from "./tabs/BasicsTab";
import { OverviewTab } from "./tabs/OverviewTab";
import { ItineraryTab } from "./tabs/ItineraryTab";
import { TiersTab } from "./tabs/TiersTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { InclusionsTab } from "./tabs/InclusionsTab";

const TAB_LABEL_KEYS: Record<(typeof TABS)[number], string> = {
  Basics: "basics",
  Overview: "overview",
  Itinerary: "itinerary",
  Tiers: "tiers",
  Gallery: "gallery",
  Inclusions: "inclusions",
};

export interface HotelOption {
  id: string;
  name: string;
  region: string;
}

interface PackageEditorProps {
  pkg?: PackageRaw;
  availableHotels?: HotelOption[];
}

export function PackageEditor({ pkg, availableHotels = [] }: PackageEditorProps) {
  const tabT = useTranslations("admin.tabs");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: Tab = (TABS as readonly string[]).includes(tabParam ?? "")
    ? (tabParam as Tab)
    : "Basics";
  const [activeTab, setActiveTabState] = useState<Tab>(initialTab);
  const setActiveTab = useCallback(
    (tab: Tab) => {
      setActiveTabState(tab);
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "Basics") params.delete("tab");
      else params.set("tab", tab);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const methods = useForm<PackageFormValues>({
    resolver: zodResolver(PackageSchema),
    defaultValues: defaultValues(pkg),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, errors },
  } = methods;

  useDirtyBeforeUnload(isDirty);

  const values = watch();
  const issues = getPackageTabIssues(values, errors);
  const { errorCount, warningCount } = summarizeIssues(issues);
  const name = values.name;
  const isPublished = values.is_published;
  const computedSlug = slugify(name || "");
  const lastSaved = pkg?.updated_at
    ? formatRelativeTime(new Date(pkg.updated_at))
    : null;

  const onSubmit = handleSubmit(async (data) => {
    if (saving || isPending) return;
    setSaving(true);
    try {
      const result = await savePackage(data);
      if (result.error) {
        if (result.error.includes("Maximum 3 featured")) {
          toast.error(result.error, {
            style: {
              background: "#c05a3a",
              color: "#f5ede0",
              border: "1px solid #c05a3a",
            },
          });
        } else {
          toastError("save tour", result.error);
        }
        return;
      }
      toastSaved("tour", data.name);
      reset(data);
      if (!pkg) {
        startTransition(() => router.push(`/admin/packages/${result.slug}`));
      } else if (result.slug && result.slug !== pkg.slug) {
        startTransition(() => router.push(`/admin/packages/${result.slug}`));
      } else {
        startTransition(() => router.refresh());
      }
    } finally {
      setSaving(false);
    }
  });

  const busy = saving || isPending;
  const hasErrors = errorCount > 0;

  const SaveButton = ({ label = "Save changes" }: { label?: string }) => {
    let buttonLabel: React.ReactNode = label;
    let extraClass = "bg-ochre text-navy hover:bg-gold";

    if (busy) {
      buttonLabel = <Spinner size="sm" />;
    } else if (hasErrors) {
      buttonLabel = (
        <>
          <AlertCircle size={13} />
          Fix {errorCount} {errorCount === 1 ? "issue" : "issues"} to save
        </>
      );
      extraClass =
        "bg-terracotta/15 text-terracotta border border-terracotta/40 cursor-not-allowed";
    } else if (!isDirty && pkg) {
      buttonLabel = (
        <>
          <Check size={13} />
          Saved
        </>
      );
      extraClass = "bg-cream-deep text-ink-soft cursor-default";
    }

    const disabled = busy || hasErrors || (!isDirty && !!pkg);

    return (
      <button
        type="submit"
        disabled={disabled}
        title={
          hasErrors
            ? issues
                .filter((i) => i.severity === "error")
                .slice(0, 3)
                .map((i) => `• ${i.message}`)
                .join("\n")
            : undefined
        }
        className={`inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium transition-all duration-200 active:opacity-80 disabled:opacity-60 min-w-28 justify-center ${extraClass}`}
      >
        {buttonLabel}
      </button>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 pb-6 border-b border-rule mb-0">
          <div className="space-y-1 min-w-0">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
              Tour
            </p>
            <h1
              className="text-[22px] sm:text-[28px] text-ink leading-tight break-words"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {name || "New tour"}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {lastSaved && (
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted">
                  Saved {lastSaved}
                </p>
              )}
              {pkg && (
                <span
                  className={`inline-flex items-center font-mono text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 rounded-sm ${
                    isPublished
                      ? "bg-teal/10 text-teal border-teal/40"
                      : hasErrors
                        ? "bg-terracotta/10 text-terracotta border-terracotta/40"
                        : "bg-ink/5 text-ink-soft border-rule"
                  }`}
                >
                  {isPublished
                    ? "Published"
                    : hasErrors
                      ? `Incomplete draft (${errorCount})`
                      : "Draft"}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0 sm:pt-1">
            {pkg && isPublished && (
              <a
                href={`/packages/${computedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft hover:text-ink transition-colors border border-rule hover:border-ochre px-3 py-2 rounded-sm"
              >
                View on site <ExternalLink size={11} />
              </a>
            )}
            <SaveButton label={pkg ? "Save changes" : "Create tour"} />
          </div>
        </div>

        {/* Sticky tab bar */}
        <div
          className="sticky top-14 md:top-0 z-20 flex gap-3 px-4 py-4 overflow-x-auto -mx-4 md:mx-0"
          style={{ background: "#f5ede0" }}
        >
          {TABS.map((tab) => {
            const tabStatus = statusForTab(issues, tab);
            const isActive = activeTab === tab;
            const dotColor =
              tabStatus === "error"
                ? "#c46b4f"
                : tabStatus === "warning"
                  ? "#c99a3f"
                  : tabStatus === "ok"
                    ? "#1a6b66"
                    : "transparent";
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="px-5 py-3 font-mono text-[10px] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-150 rounded-md inline-flex items-center gap-2"
                style={
                  isActive
                    ? {
                        background: "#1b4d5c",
                        border: "1px solid #1b4d5c",
                        color: "#f5ede0",
                      }
                    : {
                        background: "#efe4d2",
                        border: "1px solid #c5b99e",
                        color: "#4a4036",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#e8dac8";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#4a4036";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#1f1a14";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#efe4d2";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#c5b99e";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#4a4036";
                  }
                }}
              >
                {tabT(TAB_LABEL_KEYS[tab])}
                <span
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: dotColor }}
                />
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="pt-8">
          <ReadinessPanel
            issues={issues}
            onJumpToTab={(tab) => setActiveTab(tab as Tab)}
          />
          {activeTab === "Basics" && <BasicsTab />}
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Itinerary" && <ItineraryTab />}
          {activeTab === "Tiers" && <TiersTab availableHotels={availableHotels} />}
          {activeTab === "Gallery" && <GalleryTab />}
          {activeTab === "Inclusions" && <InclusionsTab />}
        </div>

        {/* Bottom sticky save bar */}
        <div
          className={`sticky bottom-0 left-0 right-0 z-20 border-t border-rule bg-cream/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between gap-4 mt-12 transition-opacity duration-200 ${
            isDirty || hasErrors
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft">
            {hasErrors
              ? `${errorCount} ${errorCount === 1 ? "issue" : "issues"} to fix${
                  warningCount > 0 ? ` · ${warningCount} suggested` : ""
                }`
              : isDirty
                ? "Unsaved changes"
                : "All changes saved"}
          </p>
          <SaveButton />
        </div>
      </form>
    </FormProvider>
  );
}
