"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { FormField } from "@/components/admin/FormField/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import type { PackageFormValues } from "../types";

function SortableGalleryItem({
  index,
  path,
  onRemove,
}: {
  index: number;
  path: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `gallery-${index}` });

  const previewUrl = path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="relative group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={previewUrl} alt="" className="w-full aspect-square object-cover rounded border border-rule" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 bg-ink/70 text-cream flex items-center justify-center text-sm hover:bg-terracotta transition-colors opacity-0 group-hover:opacity-100"
      >
        ×
      </button>
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute bottom-1 left-1 text-cream bg-ink/60 p-0.5 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={12} />
      </button>
    </div>
  );
}

export function GalleryTab() {
  const { control, watch, setValue } = useFormContext<PackageFormValues>();
  const heroImage = watch("hero_image");
  const cardImage = watch("card_image");
  const { fields, append, remove, move } = useFieldArray({ control, name: "gallery" });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = fields.findIndex((_, i) => `gallery-${i}` === active.id);
    const to = fields.findIndex((_, i) => `gallery-${i}` === over.id);
    if (from !== -1 && to !== -1) move(from, to);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField label="Hero image" hint="Used on the detail page top" required>
          <ImageUploader
            value={heroImage || null}
            onChange={(p) => setValue("hero_image", p ?? "")}
            folder="packages/hero"
            aspectRatio="16/9"
          />
        </FormField>
        <FormField label="Card image" hint="Optional — used on listing cards. Falls back to hero.">
          <ImageUploader
            value={cardImage ?? null}
            onChange={(p) => setValue("card_image", p)}
            folder="packages/card"
            aspectRatio="4/3"
          />
        </FormField>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">
          Gallery
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((_, i) => `gallery-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {fields.map((field, i) => (
                <SortableGalleryItem
                  key={field.id}
                  index={i}
                  path={(field as any).path}
                  onRemove={() => remove(i)}
                />
              ))}
              <ImageUploader
                value={null}
                onChange={(p) => { if (p) append({ path: p }); }}
                folder="packages/gallery"
                aspectRatio="1/1"
              />
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
