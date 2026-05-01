"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { ListEditor } from "../primitives";
import type { PackageFormValues } from "../types";

export function InclusionsTab() {
  const { control, watch, setValue } = useFormContext<PackageFormValues>();
  const { append: incAppend, remove: incRemove } = useFieldArray({ control, name: "included" });
  const { append: notAppend, remove: notRemove } = useFieldArray({ control, name: "not_included" });
  const included = watch("included");
  const notIncluded = watch("not_included");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">Included</p>
        <ListEditor
          items={included}
          onAdd={() => incAppend({ text: "" })}
          onRemove={(i) => incRemove(i)}
          onChange={(i, val) => setValue(`included.${i}.text`, val)}
          placeholder="e.g. Airport transfers"
        />
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">Not included</p>
        <ListEditor
          items={notIncluded}
          onAdd={() => notAppend({ text: "" })}
          onRemove={(i) => notRemove(i)}
          onChange={(i, val) => setValue(`not_included.${i}.text`, val)}
          placeholder="e.g. International flights"
        />
      </div>
    </div>
  );
}
