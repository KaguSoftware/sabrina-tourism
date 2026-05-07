"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ListEditor } from "@/components/admin/PackageEditor/primitives";
import type { DailyFormValues } from "@/app/admin/(authed)/daily/[id]/schema";

export function InclusionsTab() {
  const { control, watch, setValue } = useFormContext<DailyFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "included" });
  const included = watch("included");

  return (
    <div className="max-w-xl">
      <p className="font-sans text-[14px] text-ink-soft mb-6 leading-relaxed">
        List everything that is included in the tour price — transport, meals, entrance fees, guide, etc.
      </p>
      <ListEditor
        items={included}
        onAdd={() => append({ text: "" })}
        onRemove={remove}
        onChange={(i, val) => setValue(`included.${i}.text`, val)}
        placeholder="e.g. Entrance to Topkapi Palace"
      />
    </div>
  );
}
