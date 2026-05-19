"use client";
import { InclusionsTab as SharedInclusionsTab } from "@/components/admin/shared-tabs/InclusionsTab";

export function InclusionsTab() {
  return (
    <SharedInclusionsTab
      includedPlaceholder="e.g. Entrance to Topkapi Palace"
      notIncludedPlaceholder="e.g. Personal expenses"
    />
  );
}
