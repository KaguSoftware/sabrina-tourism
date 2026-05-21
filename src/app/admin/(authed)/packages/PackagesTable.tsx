"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { reorderPackages, setFeatured, setPublished, deletePackage, duplicatePackage } from "./actions";
import { SortableRow } from "./PackagesTableRow";
import { Spinner } from "@/components/admin/Spinner/Spinner";
import { EmptyState } from "@/components/admin/EmptyState/EmptyState";
import { Map } from "lucide-react";
import {
  toastError,
  toastPublished,
  toastUnpublished,
  toastDeleted,
  toastDuplicated,
  toastReordered,
} from "@/lib/admin/toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminPackageRow {
  id: string;
  slug: string;
  name: string;
  region: string;
  cardImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

// ---------------------------------------------------------------------------
// Confirm Dialog
// ---------------------------------------------------------------------------

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  deleting,
  name,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting?: boolean;
  name?: string;
}) {
  const t = useTranslations("admin");
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={deleting ? undefined : onClose}
    >
      <div
        className="bg-cream border border-rule rounded-none p-8 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink font-semibold mb-3">
          {t("confirm.deletePackageTitle")}
        </p>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-8">
          {name ? (
            <>
              Delete <span className="text-ink font-semibold">&quot;{name}&quot;</span>?
              This permanently removes the tour and can&apos;t be undone.
            </>
          ) : (
            t("confirm.deletePackageBody")
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-ink-soft hover:text-ink transition-colors disabled:opacity-40"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 min-w-20 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-transparent text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-200 active:opacity-80 disabled:opacity-60"
          >
            {deleting ? <Spinner size="sm" /> : t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main table
// ---------------------------------------------------------------------------

export function PackagesTable({ initialPackages }: { initialPackages: AdminPackageRow[] }) {
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
    const result = await reorderPackages(reordered.map((p) => p.id));
    if (result.error) { setPackages(packages); toastError("reorder tours", result.error); }
    else toastReordered("Tour");
  }, [packages]);

  const handleTogglePublished = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    const target = packages.find((p) => p.id === id);
    setPackages((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: next, isFeatured: next ? p.isFeatured : false } : p));
    const result = await setPublished(id, next);
    if (result.error) { setPackages(packages); toastError(next ? "publish tour" : "unpublish tour", result.error); }
    else if (next) toastPublished("tour", target?.name);
    else toastUnpublished("tour", target?.name);
  }, [packages]);

  const handleToggleFeatured = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    const target = packages.find((p) => p.id === id);
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured: next } : p)));
    const result = await setFeatured(id, next);
    if (result.error) {
      setPackages(packages);
      if (result.error.includes("Maximum 3")) {
        toast.error(result.error, { style: { background: "#c05a3a", color: "#f5ede0", border: "1px solid #c05a3a" } });
      } else {
        toastError("update featured status", result.error);
      }
    } else {
      const q = target?.name ? `"${target.name}"` : "tour";
      toast.success(next ? `${q} added to featured` : `${q} removed from featured`);
    }
  }, [packages]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    const target = packages.find((p) => p.id === id);
    setDeleting(true);
    const result = await deletePackage(id);
    setDeleting(false);
    setDeleteTarget(null);
    if (result.error) { toastError("delete tour", result.error); }
    else { setPackages((prev) => prev.filter((p) => p.id !== id)); toastDeleted("tour", target?.name); }
  }, [deleteTarget, packages]);

  const handleDuplicate = useCallback(async (id: string) => {
    const target = packages.find((p) => p.id === id);
    const result = await duplicatePackage(id);
    if (result.error) toastError("duplicate tour", result.error);
    else { toastDuplicated("tour", target?.name); router.push(`/admin/packages/${result.newSlug}`); }
  }, [router, packages]);

  if (packages.length === 0) {
    return (
      <EmptyState
        icon={Map}
        title="No tours yet"
        description="Create your first tour to start building the catalog. You can save as draft and publish whenever you're ready."
        action={
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold transition-all duration-200 active:opacity-80"
          >
            {t("pages.packages.new")}
          </Link>
        }
      />
    );
  }

  return (
    <>
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        name={packages.find((p) => p.id === deleteTarget)?.name}
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-rule">
                <th className="pl-3 pr-2 py-2 w-8" />
                <th className="px-2 py-2 w-12" />
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold">{t("common.name")}</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold hidden md:table-cell">{t("common.slug")}</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold w-28">{t("common.status")}</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold w-20">{t("common.featured")}</th>
                <th className="px-3 py-2 w-28" />
              </tr>
            </thead>
            <SortableContext items={packages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {packages.map((pkg) => (
                  <SortableRow
                    key={pkg.id}
                    pkg={pkg}
                    onTogglePublished={handleTogglePublished}
                    onToggleFeatured={handleToggleFeatured}
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
