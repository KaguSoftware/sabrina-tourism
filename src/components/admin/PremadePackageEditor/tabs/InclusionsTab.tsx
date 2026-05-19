"use client";
import { InclusionsTab as SharedInclusionsTab } from "@/components/admin/shared-tabs/InclusionsTab";

export function InclusionsTab() {
  return (
    <SharedInclusionsTab
      includedPlaceholder="e.g. All private transfers"
      notIncludedPlaceholder="e.g. International flights"
    />
  );
}
