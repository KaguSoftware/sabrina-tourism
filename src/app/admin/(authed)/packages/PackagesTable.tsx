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

import { reorderPackages, setFeatured, setPublished, deletePackage, duplicatePackage } from "./actions";
import { SortableRow } from "./PackagesTableRow";

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
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-cream border border-rule rounded-none p-8 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink font-semibold mb-3">
          Delete this tour?
        </p>
        <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-8">
          This cannot be undone. The tour, its itinerary, gallery, and tiers will be permanently removed.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-transparent text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-200 active:scale-[0.97]"
          >
            Delete
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
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = packages.findIndex((p) => p.id === active.id);
    const newIndex = packages.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(packages, oldIndex, newIndex);
    setPackages(reordered);
    const result = await reorderPackages(reordered.map((p) => p.id));
    if (result.error) { setPackages(packages); toast.error(result.error); }
  }, [packages]);

  const handleTogglePublished = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    setPackages((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: next, isFeatured: next ? p.isFeatured : false } : p));
    const result = await setPublished(id, next);
    if (result.error) { setPackages(packages); toast.error(result.error); }
    else toast.success(next ? "Published." : "Moved to draft.");
  }, [packages]);

  const handleToggleFeatured = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured: next } : p)));
    const result = await setFeatured(id, next);
    if (result.error) {
      setPackages(packages);
      if (result.error.includes("Maximum 3")) {
        toast.error(result.error, { style: { background: "#c05a3a", color: "#f5ede0", border: "1px solid #c05a3a" } });
      } else {
        toast.error(result.error);
      }
    } else {
      toast.success(next ? "Now featured." : "Removed from featured.");
    }
  }, [packages]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleteTarget(null);
    setPackages((prev) => prev.filter((p) => p.id !== id));
    const result = await deletePackage(id);
    if (result.error) { setPackages(packages); toast.error(result.error); }
    else toast.success("Tour deleted.");
  }, [deleteTarget, packages]);

  const handleDuplicate = useCallback(async (id: string) => {
    const result = await duplicatePackage(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Duplicated. Edit the copy."); router.push(`/admin/packages/${result.newSlug}`); }
  }, [router]);

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <p className="text-[24px] text-ink-soft italic" style={{ fontFamily: "var(--font-fraunces)" }}>
          No tours yet.
        </p>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold transition-all duration-200 active:scale-[0.97]"
        >
          + New tour
        </Link>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-rule">
              <th className="pl-3 pr-2 py-2 w-8" />
              <th className="px-2 py-2 w-12" />
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold hidden md:table-cell">Slug</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold w-28">Status</th>
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-ink font-semibold w-20">Featured</th>
              <th className="px-3 py-2 w-28" />
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
          </DndContext>
        </table>
      </div>
    </>
  );
}
