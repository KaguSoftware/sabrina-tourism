"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { reorderPremadePackages, setPremadePublished, deletePremadePackage, duplicatePremadePackage } from "./actions";
import { Spinner } from "@/components/admin/Spinner/Spinner";

export interface AdminPremadeRow {
  id: string;
  slug: string;
  name: string;
  isPublished: boolean;
  sortOrder: number;
}

function ConfirmDialog({ open, onClose, onConfirm, deleting }: { open: boolean; onClose: () => void; onConfirm: () => void; deleting?: boolean }) {
  const t = useTranslations("admin");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm" onClick={deleting ? undefined : onClose}>
      <div className="bg-cream border border-rule p-8 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink font-semibold mb-3">{t("confirm.deletePackageTitle")}</p>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-8">{t("confirm.deletePackageBody")}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} disabled={deleting} className="inline-flex items-center px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-ink-soft hover:text-ink transition-colors disabled:opacity-40">{t("common.cancel")}</button>
          <button onClick={onConfirm} disabled={deleting} className="inline-flex items-center justify-center gap-2 min-w-20 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-transparent text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-200 active:opacity-80 disabled:opacity-60">{deleting ? <Spinner size="sm" /> : t("common.delete")}</button>
        </div>
      </div>
    </div>
  );
}

function SortableRow({ pkg, onTogglePublished, onDelete, onDuplicate }: {
  pkg: AdminPremadeRow;
  onTogglePublished: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const t = useTranslations("admin.common");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pkg.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-rule hover:bg-cream-warm/40 transition-colors">
      <td className="pl-3 pr-2 py-3 w-8">
        <button {...attributes} {...listeners} className="cursor-grab text-ink-soft/40 hover:text-ink-soft transition-colors"><GripVertical size={16} /></button>
      </td>
      <td className="px-3 py-3">
        <p className="font-sans text-[14px] text-ink font-medium">{pkg.name}</p>
        <p className="font-mono text-[10px] text-muted mt-0.5">{pkg.slug}</p>
      </td>
      <td className="px-3 py-3 w-28">
        <button onClick={() => onTogglePublished(pkg.id, pkg.isPublished)}
          className={`font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 border transition-colors ${pkg.isPublished ? "border-ochre/40 text-ochre bg-ochre/5 hover:bg-ochre/10" : "border-rule text-muted hover:border-ink-soft/30"}`}>
          {pkg.isPublished ? t("published") : t("draft")}
        </button>
      </td>
      <td className="px-3 py-3 w-28">
        <div className="flex items-center gap-1">
          <Link href={`/admin/fixed-dates/${pkg.id}`} className="inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft border border-rule hover:border-ochre hover:text-ochre transition-colors"><Pencil size={11} /></Link>
          <button onClick={() => onDuplicate(pkg.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft border border-rule hover:border-ochre hover:text-ochre transition-colors"><Copy size={11} /></button>
          <button onClick={() => onDelete(pkg.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft border border-rule hover:border-terracotta hover:text-terracotta transition-colors"><Trash2 size={11} /></button>
        </div>
      </td>
    </tr>
  );
}

export function FixedDatesTable({ initialPackages }: { initialPackages: AdminPremadeRow[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = packages.findIndex((p) => p.id === active.id);
    const newIndex = packages.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(packages, oldIndex, newIndex);
    setPackages(reordered);
    const result = await reorderPremadePackages(reordered.map((p) => p.id));
    if (result.error) { setPackages(packages); toast.error(result.error); }
  }, [packages]);

  const handleTogglePublished = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    setPackages((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: next } : p));
    const result = await setPremadePublished(id, next);
    if (result.error) { setPackages(packages); toast.error(result.error); }
    else toast.success(next ? "Published." : "Moved to draft.");
  }, [packages]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleting(true);
    const result = await deletePremadePackage(id);
    setDeleting(false);
    setDeleteTarget(null);
    if (result.error) { toast.error(result.error); }
    else { setPackages((prev) => prev.filter((p) => p.id !== id)); toast.success("Package deleted."); }
  }, [deleteTarget]);

  const handleDuplicate = useCallback(async (id: string) => {
    const result = await duplicatePremadePackage(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Duplicated. Edit the copy."); router.push(`/admin/fixed-dates/${result.newId}`); }
  }, [router]);

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <p className="text-[24px] text-ink-soft italic" style={{ fontFamily: "var(--font-fraunces)" }}>{t("pages.fixedDates.title")}</p>
        <Link href="/admin/fixed-dates/new" className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold transition-all duration-200 active:opacity-80">{t("pages.fixedDates.new")}</Link>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} deleting={deleting} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-rule">
                <th className="pl-3 pr-2 py-2 w-8" />
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold">{t("common.name")}</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold w-28">{t("common.status")}</th>
                <th className="px-3 py-2 w-28" />
              </tr>
            </thead>
            <SortableContext items={packages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {packages.map((pkg) => (
                  <SortableRow key={pkg.id} pkg={pkg}
                    onTogglePublished={handleTogglePublished}
                    onDelete={(id) => setDeleteTarget(id)}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </div>
      </DndContext>
    </>
  );
}
