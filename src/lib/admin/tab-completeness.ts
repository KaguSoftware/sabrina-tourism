import type { FieldErrors } from "react-hook-form";
import type { PackageFormValues, Tab } from "@/components/admin/PackageEditor/types";
import { PACKAGE_FIELD_TAB } from "@/lib/admin/field-tabs";

export type TabStatus = "error" | "warning" | "ok" | "empty";

export interface TabIssue {
  tab: Tab;
  severity: "error" | "warning";
  message: string;
}


function fieldRootKey(path: string): string {
  return path.split(".")[0]!;
}

function flattenErrors(
  errs: FieldErrors,
  prefix = "",
): Array<{ path: string; message: string }> {
  const out: Array<{ path: string; message: string }> = [];
  if (!errs || typeof errs !== "object") return out;
  for (const key of Object.keys(errs as Record<string, unknown>)) {
    const node = (errs as Record<string, unknown>)[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (!node || typeof node !== "object") continue;
    const maybeMsg = (node as { message?: unknown }).message;
    if (typeof maybeMsg === "string" && maybeMsg.length > 0) {
      out.push({ path, message: maybeMsg });
    } else {
      out.push(...flattenErrors(node as FieldErrors, path));
    }
  }
  return out;
}

export function getPackageTabIssues(
  values: Partial<PackageFormValues>,
  errors: FieldErrors<PackageFormValues>,
): TabIssue[] {
  const issues: TabIssue[] = [];

  // Errors first (zod validation)
  for (const { path, message } of flattenErrors(errors)) {
    const tab = (PACKAGE_FIELD_TAB as Record<string, Tab>)[fieldRootKey(path)] ?? "Basics";
    issues.push({ tab, severity: "error", message });
  }

  // Warnings (recommendations, not blocking)
  if (!values.gallery || values.gallery.length === 0) {
    issues.push({
      tab: "Gallery",
      severity: "warning",
      message: "No gallery images added",
    });
  }
  if (!values.itinerary || values.itinerary.length === 0) {
    issues.push({
      tab: "Itinerary",
      severity: "warning",
      message: "No itinerary days added",
    });
  }
  if (!values.included || values.included.length === 0) {
    issues.push({
      tab: "Inclusions",
      severity: "warning",
      message: "Nothing marked as included",
    });
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

export function statusForTab(issues: TabIssue[], tab: Tab): TabStatus {
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
