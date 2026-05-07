"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { reorderHotels, setHotelPublished, deleteHotel, duplicateHotel } from "./actions";

export interface AdminHotelRow { id: string; slug: string; name: string; region: string; isPublished: boolean; sortOrder: number; }

const REGIONS = ["Istanbul","Cappadocia","Aegean","Mediterranean","Black Sea","Eastern Anatolia"] as const;

function ConfirmDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const t = useTranslations("admin");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-cream border border-rule p-8 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink font-semibold mb-3">{t("confirm.deleteHotelTitle")}</p>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-8">{t("confirm.deleteHotelBody")}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft hover:text-ink transition-colors">{t("common.cancel")}</button>
          <button onClick={onConfirm} className="px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-200">{t("common.delete")}</button>
        </div>
      </div>
    </div>
  );
}

function SortableRow({ hotel, onTogglePublished, onDelete, onDuplicate }: { hotel: AdminHotelRow; onTogglePublished: (id: string, cur: boolean) => void; onDelete: (id: string) => void; onDuplicate: (id: string) => void; }) {
  const t = useTranslations("admin.common");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: hotel.id });
  return (
    <tr ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} className="border-b border-rule hover:bg-cream-warm transition-colors">
      <td className="pl-3 pr-2 py-3 w-8">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink transition-colors touch-none" aria-label={t("dragToReorder")}><GripVertical size={16} /></button>
      </td>
      <td className="px-3 py-3">
        <div className="font-serif text-[15px] text-ink leading-snug" style={{ fontFamily: "var(--font-fraunces)" }}>{hotel.name}</div>
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft mt-0.5">{hotel.region}</div>
      </td>
      <td className="px-3 py-3 hidden md:table-cell"><span className="font-mono text-[11px] text-ink-soft">/regions/…/{hotel.slug}</span></td>
      <td className="px-3 py-3 w-28">
        <button onClick={() => onTogglePublished(hotel.id, hotel.isPublished)} className="group" title={hotel.isPublished ? "Click to unpublish" : "Click to publish"}>
          {hotel.isPublished
            ? <span className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase bg-navy text-ochre rounded-sm group-hover:opacity-80 transition-opacity">{t("published")}</span>
            : <span className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase bg-cream-warm text-ink-soft border border-rule rounded-sm group-hover:opacity-80 transition-opacity">{t("draft")}</span>}
        </button>
      </td>
      <td className="px-3 py-3 w-28">
        <div className="flex items-center gap-1">
          <a href={`/admin/hotels/${hotel.id}`} title={t("edit")} className="p-1.5 text-ink/70 hover:text-ink transition-colors rounded"><Pencil size={14} /></a>
          <button onClick={() => onDuplicate(hotel.id)} title={t("duplicate")} className="p-1.5 text-ink/70 hover:text-ink transition-colors rounded"><Copy size={14} /></button>
          <button onClick={() => onDelete(hotel.id)} title={t("delete")} className="p-1.5 text-ink/70 hover:text-terracotta transition-colors rounded"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

export function HotelsTable({ initialHotels }: { initialHotels: AdminHotelRow[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [hotels, setHotels] = useState(initialHotels);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = hotels.findIndex((h) => h.id === active.id);
    const newIndex = hotels.findIndex((h) => h.id === over.id);
    const reordered = arrayMove(hotels, oldIndex, newIndex);
    setHotels(reordered);
    const result = await reorderHotels(reordered.map((h) => h.id));
    if (result.error) { setHotels(hotels); toast.error(result.error); }
  }, [hotels]);

  const handleTogglePublished = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    setHotels((prev) => prev.map((h) => h.id === id ? { ...h, isPublished: next } : h));
    const result = await setHotelPublished(id, next);
    if (result.error) { setHotels(hotels); toast.error(result.error); }
    else toast.success(next ? "Published." : "Moved to draft.");
  }, [hotels]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget; setDeleteTarget(null);
    setHotels((prev) => prev.filter((h) => h.id !== id));
    const result = await deleteHotel(id);
    if (result.error) { setHotels(hotels); toast.error(result.error); }
    else toast.success("Hotel deleted.");
  }, [deleteTarget, hotels]);

  const handleDuplicate = useCallback(async (id: string) => {
    const result = await duplicateHotel(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Duplicated."); router.push(`/admin/hotels/${result.newId}`); }
  }, [router]);

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <p className="text-[24px] text-ink-soft italic" style={{ fontFamily: "var(--font-fraunces)" }}>{t("pages.hotels.title")}</p>
        <Link href="/admin/hotels/new" className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy border border-ochre hover:bg-gold transition-all duration-200">{t("pages.hotels.new")}</Link>
      </div>
    );
  }

  const hotelsByRegion = REGIONS.map((region) => ({ region, items: hotels.filter((h) => h.region === region) })).filter((g) => g.items.length > 0);

  return (
    <>
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={hotels.map((h) => h.id)} strategy={verticalListSortingStrategy}>
          {hotelsByRegion.map(({ region, items }) => (
            <div key={region} className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-2 px-1">{region}</p>
              <div className="overflow-x-auto border border-rule">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-rule bg-cream-warm">
                      <th className="pl-3 pr-2 py-2 w-8" />
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold">{t("common.name")}</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold hidden md:table-cell">{t("common.slug")}</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold w-28">{t("common.status")}</th>
                      <th className="px-3 py-2 w-28" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((hotel) => (
                      <SortableRow key={hotel.id} hotel={hotel} onTogglePublished={handleTogglePublished} onDelete={(id) => setDeleteTarget(id)} onDuplicate={handleDuplicate} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
}
