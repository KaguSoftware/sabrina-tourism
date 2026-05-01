"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";

import { FormField } from "@/components/admin/FormField/FormField";
import { Input } from "@/components/admin/Input/Input";
import { Textarea } from "@/components/admin/Input/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader/ImageUploader";
import { saveTransportHero, saveFleet } from "./actions";
import {
  transportHeroSchema,
  fleetSchema,
  type TransportHeroFormValues,
  type FleetFormValues,
} from "./schema";
import type { TransportHeroData, TransportAirportRow, TransportVehicleRow } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TransportationEditorProps {
  hero: TransportHeroData & { hero_image?: string | null };
  airports: TransportAirportRow[];
  vehicles: TransportVehicleRow[];
}

// ---------------------------------------------------------------------------
// Hero tab
// ---------------------------------------------------------------------------

function HeroTab({ hero }: { hero: TransportationEditorProps["hero"] }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransportHeroFormValues>({
    resolver: zodResolver(transportHeroSchema),
    defaultValues: {
      hero_heading_top: hero.hero_heading_top ?? "",
      hero_heading_em: hero.hero_heading_em ?? "",
      hero_sub: hero.hero_sub ?? "",
      fleet_heading: hero.fleet_heading ?? "",
      hero_image: hero.hero_image ?? null,
    },
  });

  const heroImage = watch("hero_image");

  const onSubmit = handleSubmit(
    async (values) => {
      const result = await saveTransportHero(values);
      if (result.error) toast.error(result.error);
      else toast.success("Saved.");
    },
    (errs) => {
      const first = Object.values(errs)[0];
      toast.error((first as any)?.message ?? "Please fix the errors above.");
    },
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField label="Heading top" required error={errors.hero_heading_top?.message}>
          <Input {...register("hero_heading_top")} placeholder="e.g. Travel in" />
        </FormField>
        <FormField label="Heading emphasis" required error={errors.hero_heading_em?.message}>
          <Input {...register("hero_heading_em")} placeholder="e.g. complete comfort." />
        </FormField>
      </div>

      <FormField label="Sub / lede" required error={errors.hero_sub?.message}>
        <Textarea rows={3} {...register("hero_sub")} />
      </FormField>

      <FormField label="Fleet section heading" required error={errors.fleet_heading?.message}>
        <Input {...register("fleet_heading")} placeholder="e.g. Our fleet" />
      </FormField>

      <FormField label="Hero image" hint="16:9 recommended">
        <ImageUploader
          value={heroImage ?? null}
          onChange={(p) => setValue("hero_image", p)}
          folder="transport"
          aspectRatio="16/9"
        />
      </FormField>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Sortable airport row
// ---------------------------------------------------------------------------

function SortableAirportRow({
  index,
  onRemove,
  register,
}: {
  index: number;
  onRemove: () => void;
  register: any;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `airport-${index}` });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 py-2 border-b border-rule last:border-0"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink touch-none flex-shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical size={15} />
      </button>
      <input
        {...register(`airports.${index}.code`)}
        placeholder="IST"
        className="w-16 bg-transparent border-0 border-b border-rule text-ink font-mono text-[14px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors uppercase"
        style={{ textTransform: "uppercase" }}
        maxLength={6}
      />
      <input
        {...register(`airports.${index}.label`)}
        placeholder="Istanbul Airport"
        className="flex-1 bg-transparent border-0 border-b border-rule text-ink font-sans text-[14px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors"
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-ink-soft hover:text-terracotta transition-colors flex-shrink-0 p-1"
        aria-label="Remove airport"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sortable vehicle row
// ---------------------------------------------------------------------------

function SortableVehicleRow({
  index,
  onRemove,
  register,
}: {
  index: number;
  onRemove: () => void;
  register: any;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `vehicle-${index}` });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border border-rule bg-cream p-4 space-y-3"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink touch-none flex-shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical size={15} />
        </button>
        <input
          {...register(`vehicles.${index}.vehicle_id`)}
          placeholder="sedan"
          className="w-24 bg-transparent border-0 border-b border-rule text-ink font-mono text-[13px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors"
        />
        <input
          {...register(`vehicles.${index}.label`)}
          placeholder="Sedan"
          className="flex-1 bg-transparent border-0 border-b border-rule text-ink font-sans text-[14px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors"
        />
        <button
          type="button"
          onClick={onRemove}
          className="text-ink-soft hover:text-terracotta transition-colors flex-shrink-0 p-1"
          aria-label="Remove vehicle"
        >
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 pl-7">
        <input
          {...register(`vehicles.${index}.capacity`)}
          placeholder="1–3 pax"
          className="bg-transparent border-0 border-b border-rule text-ink font-sans text-[13px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors placeholder:text-muted/40"
        />
        <input
          {...register(`vehicles.${index}.from_price`)}
          placeholder="From $80"
          className="bg-transparent border-0 border-b border-rule text-ink font-sans text-[13px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors placeholder:text-muted/40"
        />
        <input
          {...register(`vehicles.${index}.note`)}
          placeholder="Note (optional)"
          className="bg-transparent border-0 border-b border-rule text-ink font-sans text-[13px] px-0 py-1.5 focus:outline-none focus:border-ochre transition-colors placeholder:text-muted/40"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fleet & airports tab
// ---------------------------------------------------------------------------

function FleetTab({
  airports,
  vehicles,
}: {
  airports: TransportAirportRow[];
  vehicles: TransportVehicleRow[];
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FleetFormValues>({
    resolver: zodResolver(fleetSchema),
    defaultValues: {
      airports: airports.map((a, i) => ({
        id: a.id,
        code: a.code,
        label: a.label,
        sort_order: a.sort_order ?? i,
      })),
      vehicles: vehicles.map((v, i) => ({
        id: v.id,
        vehicle_id: v.vehicle_id,
        label: v.label,
        capacity: v.capacity,
        note: v.note,
        from_price: v.from_price,
        sort_order: v.sort_order ?? i,
      })),
    },
  });

  const {
    fields: airportFields,
    append: appendAirport,
    remove: removeAirport,
    move: moveAirport,
  } = useFieldArray({ control, name: "airports" });

  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
    move: moveVehicle,
  } = useFieldArray({ control, name: "vehicles" });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleAirportDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = airportFields.findIndex((_, i) => `airport-${i}` === active.id);
    const to = airportFields.findIndex((_, i) => `airport-${i}` === over.id);
    if (from !== -1 && to !== -1) moveAirport(from, to);
  }

  function handleVehicleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = vehicleFields.findIndex((_, i) => `vehicle-${i}` === active.id);
    const to = vehicleFields.findIndex((_, i) => `vehicle-${i}` === over.id);
    if (from !== -1 && to !== -1) moveVehicle(from, to);
  }

  const onSubmit = handleSubmit(
    async (values) => {
      const withOrder = {
        airports: values.airports.map((a, i) => ({ ...a, sort_order: i })),
        vehicles: values.vehicles.map((v, i) => ({ ...v, sort_order: i })),
      };
      const result = await saveFleet(withOrder);
      if (result.error) toast.error(result.error);
      else toast.success("Saved.");
    },
    (errs) => {
      const flat = Object.values(errs.airports ?? {}).concat(Object.values(errs.vehicles ?? {}));
      const first = flat[0] as any;
      toast.error(first?.message ?? "Please fix the errors above.");
    },
  );

  return (
    <form onSubmit={onSubmit} noValidate className="pt-8 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Airports */}
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">
            Airports
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAirportDragEnd}>
            <SortableContext
              items={airportFields.map((_, i) => `airport-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="border border-rule divide-y divide-rule">
                {airportFields.length === 0 && (
                  <p className="px-4 py-6 font-sans text-[13px] text-muted italic text-center">
                    No airports.
                  </p>
                )}
                {airportFields.map((field, i) => (
                  <SortableAirportRow
                    key={field.id}
                    index={i}
                    register={register}
                    onRemove={() => removeAirport(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            type="button"
            onClick={() =>
              appendAirport({ code: "", label: "", sort_order: airportFields.length })
            }
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors mt-3"
          >
            <Plus size={12} /> Add airport
          </button>
        </div>

        {/* Vehicles */}
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted font-medium mb-4">
            Vehicles
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleVehicleDragEnd}>
            <SortableContext
              items={vehicleFields.map((_, i) => `vehicle-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {vehicleFields.length === 0 && (
                  <p className="py-6 font-sans text-[13px] text-muted italic text-center">
                    No vehicles.
                  </p>
                )}
                {vehicleFields.map((field, i) => (
                  <SortableVehicleRow
                    key={field.id}
                    index={i}
                    register={register}
                    onRemove={() => removeVehicle(i)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            type="button"
            onClick={() =>
              appendVehicle({
                vehicle_id: "",
                label: "",
                capacity: "",
                note: "",
                from_price: "",
                sort_order: vehicleFields.length,
              })
            }
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft hover:text-ochre transition-colors mt-3"
          >
            <Plus size={12} /> Add vehicle
          </button>
        </div>
      </div>

      <div className="flex justify-end border-t border-rule pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy hover:bg-gold transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main editor
// ---------------------------------------------------------------------------

export function TransportationEditor({
  hero,
  airports,
  vehicles,
}: TransportationEditorProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "fleet">("hero");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-rule">
        {(["hero", "fleet"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
              activeTab === tab
                ? "text-ink border-b-2 border-ochre -mb-px"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab === "hero" ? "Hero" : "Fleet & airports"}
          </button>
        ))}
      </div>

      {activeTab === "hero" && <HeroTab hero={hero} />}
      {activeTab === "fleet" && <FleetTab airports={airports} vehicles={vehicles} />}
    </div>
  );
}
