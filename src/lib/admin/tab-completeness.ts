import type { FieldErrors } from "react-hook-form";
import type { PremadeFormValues } from "@/app/admin/(authed)/fixed-dates/[id]/schema";
import { PREMADE_FIELD_TAB } from "@/lib/admin/field-tabs";
import { flattenFieldErrors, rootField } from "@/lib/admin/form-errors";

export type TabStatus = "error" | "warning" | "ok" | "empty";

/**
 * `TTab` is the editor's own tab union, so each editor keeps its tab names
 * type-checked while the shared ReadinessPanel accepts any of them.
 */
export interface TabIssue<TTab extends string = string> {
  tab: TTab;
  severity: "error" | "warning";
  message: string;
}

/** Tab names used by the fixed-dates (premade) editor. */
export type PremadeTab =
  | "Basics"
  | "Overview"
  | "Itinerary"
  | "Tiers"
  | "Inclusions"
  | "Imagery"
  | "Accommodation"
  | "Vehicle"
  | "Translations";

/**
 * Turns zod/react-hook-form errors into per-tab blocking issues. Shared by the
 * editors so a field's tab is resolved the same way everywhere — including the
 * field-array `root` errors that `flattenFieldErrors` normalises.
 */
function errorIssues<TTab extends string>(
  errors: FieldErrors,
  fieldToTab: Readonly<Record<string, TTab>>,
  fallbackTab: TTab,
): TabIssue<TTab>[] {
  return flattenFieldErrors(errors).map(({ path, message }) => ({
    tab: fieldToTab[rootField(path)] ?? fallbackTab,
    severity: "error" as const,
    message,
  }));
}

/**
 * Fixed-dates equivalent. The premade schema is far more permissive than the
 * package one — hero image, tiers and itinerary are all optional — so most of
 * what an admin forgets surfaces here as a warning rather than a blocking
 * error. Without these the editor saves a tour that renders half-empty on the
 * public site with nothing having flagged it.
 */
export function getPremadeTabIssues(
  values: Partial<PremadeFormValues>,
  errors: FieldErrors<PremadeFormValues>,
): TabIssue<PremadeTab>[] {
  const issues: TabIssue<PremadeTab>[] = [
    ...errorIssues<PremadeTab>(errors, PREMADE_FIELD_TAB as Record<string, PremadeTab>, "Basics"),
  ];

  if (!values.hero_image) {
    issues.push({ tab: "Imagery", severity: "warning", message: "No hero image set" });
  }
  if (!values.gallery?.some((g) => g.url?.trim())) {
    issues.push({ tab: "Imagery", severity: "warning", message: "No gallery images added" });
  }
  if (!values.itinerary?.length) {
    issues.push({ tab: "Itinerary", severity: "warning", message: "No itinerary days added" });
  }
  if (!values.tiers?.length) {
    issues.push({ tab: "Tiers", severity: "warning", message: "No tiers added — no pricing will show" });
  }
  if (!values.included?.some((i) => i.text?.trim())) {
    issues.push({ tab: "Inclusions", severity: "warning", message: "Nothing marked as included" });
  }
  if (!values.overview?.trim()) {
    issues.push({ tab: "Overview", severity: "warning", message: "No overview written" });
  }
  if (values.is_published === false) {
    issues.push({
      tab: "Basics",
      severity: "warning",
      message: "Not published — won't appear on the site",
    });
  }

  return issues;
}

export function statusForTab(issues: TabIssue[], tab: string): TabStatus {
  const forTab = issues.filter((i) => i.tab === tab);
  if (forTab.some((i) => i.severity === "error")) return "error";
  if (forTab.some((i) => i.severity === "warning")) return "warning";
  return "ok";
}

export function summarizeIssues(issues: TabIssue[]): {
  errorCount: number;
  warningCount: number;
} {
  return {
    errorCount: issues.filter((i) => i.severity === "error").length,
    warningCount: issues.filter((i) => i.severity === "warning").length,
  };
}
