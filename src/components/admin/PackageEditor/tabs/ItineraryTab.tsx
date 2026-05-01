"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ConfirmDialog } from "../primitives";
import type { PackageFormValues } from "../types";

function SortableDayCard({ index, onDelete }: { index: number; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `day-${index}` });
  const [open, setOpen] = useState(true);
  const { register, formState: { errors } } = useFormContext<PackageFormValues>();
  const itineraryErrors = (errors.itinerary as any)?.[index];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border border-rule bg-cream"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted w-10 flex-shrink-0">
          Day {index + 1}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex-1 text-left font-sans text-[14px] text-ink-soft hover:text-ink transition-colors"
        >
          {open
            ? <ChevronUp size={14} className="inline mr-1" />
            : <ChevronDown size={14} className="inline mr-1" />}
          {open ? "Collapse" : "Expand"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-ink-soft hover:text-terracotta transition-colors p-1"
          aria-label="Delete day"
        >
          <X size={14} />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-5 space-y-5 border-t border-rule pt-4">
          <FormField label="Title" required error={itineraryErrors?.title?.message}>
            <Input {...register(`itinerary.${index}.title`)} placeholder="Day title" />
          </FormField>
          <FormField label="Description" required error={itineraryErrors?.description?.message}>
            <Textarea rows={4} {...register(`itinerary.${index}.description`)} />
          </FormField>
        </div>
      )}
    </div>
  );
}

export function ItineraryTab() {
  const { control } = useFormContext<PackageFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "itinerary" });
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = fields.findIndex((_, i) => `day-${i}` === active.id);
    const to = fields.findIndex((_, i) => `day-${i}` === over.id);
    if (from !== -1 && to !== -1) move(from, to);
  }

  return (
    <div className="space-y-3">
      <ConfirmDialog
        open={confirmIdx !== null}
        onClose={() => setConfirmIdx(null)}
        onConfirm={() => {
          if (confirmIdx !== null) remove(confirmIdx);
          setConfirmIdx(null);
        }}
        message="Delete this itinerary day? This cannot be undone."
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((_, i) => `day-${i}`)} strategy={verticalListSortingStrategy}>
          {fields.map((field, i) => (
            <SortableDayCard key={field.id} index={i} onDelete={() => setConfirmIdx(i)} />
          ))}
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <p className="text-center py-10 font-sans text-[14px] text-muted italic">No days yet.</p>
      )}

      <button
        type="button"
        onClick={() => append({ title: "", description: "" })}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors"
      >
        <Plus size={12} /> Add day
      </button>
    </div>
  );
}
