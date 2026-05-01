"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import type { AdminPackageRow } from "./PackagesTable";

function Thumbnail({ src, region }: { src?: string; region: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={region} className="w-10 h-10 rounded object-cover flex-shrink-0" />
    );
  }
  return (
    <div className="w-10 h-10 rounded flex-shrink-0 bg-cream-warm flex items-center justify-center">
      <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-ink-soft leading-none text-center px-1">
        {region}
      </span>
    </div>
  );
}

interface SortableRowProps {
  pkg: AdminPackageRow;
  onTogglePublished: (id: string, current: boolean) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function SortableRow({
  pkg,
  onTogglePublished,
  onToggleFeatured,
  onDelete,
  onDuplicate,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pkg.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-rule hover:bg-cream-warm/40 transition-colors"
    >
      <td className="pl-3 pr-2 py-3 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      </td>

      <td className="px-2 py-3 w-12">
        <Thumbnail src={pkg.cardImage} region={pkg.region} />
      </td>

      <td className="px-3 py-3">
        <div className="font-serif text-[15px] text-ink leading-snug" style={{ fontFamily: "var(--font-fraunces)" }}>
          {pkg.name}
        </div>
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft mt-0.5">
          {pkg.region}
        </div>
      </td>

      <td className="px-3 py-3 hidden md:table-cell">
        <span className="font-mono text-[11px] text-ink-soft">/packages/{pkg.slug}</span>
      </td>

      <td className="px-3 py-3 w-28">
        <button
          onClick={() => onTogglePublished(pkg.id, pkg.isPublished)}
          className="group"
          title={pkg.isPublished ? "Click to unpublish" : "Click to publish"}
        >
          {pkg.isPublished ? (
            <span className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase bg-navy text-ochre rounded-sm group-hover:opacity-80 transition-opacity">
              Published
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase bg-cream-warm text-ink-soft rounded-sm group-hover:opacity-80 transition-opacity">
              Draft
            </span>
          )}
        </button>
      </td>

      <td className="px-3 py-3 w-20">
        <button
          onClick={() => { if (!pkg.isPublished && !pkg.isFeatured) return; onToggleFeatured(pkg.id, pkg.isFeatured); }}
          disabled={!pkg.isPublished}
          title={!pkg.isPublished ? "Publish first to feature" : pkg.isFeatured ? "Remove from featured" : "Add to featured"}
          className={`w-5 h-5 rounded-sm border transition-all duration-200 ${
            pkg.isFeatured ? "bg-ochre border-ochre" : "bg-transparent border-rule hover:border-ochre"
          } ${!pkg.isPublished ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label={pkg.isFeatured ? "Remove from featured" : "Feature this tour"}
        >
          {pkg.isFeatured && (
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
              <path d="M2 6l3 3 5-5" stroke="#1f1a14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </td>

      <td className="px-3 py-3 w-28">
        <div className="flex items-center gap-1">
          <a href={`/admin/packages/${pkg.slug}`} title="Edit" className="p-1.5 text-ink-soft hover:text-ink transition-colors rounded">
            <Pencil size={14} />
          </a>
          <button onClick={() => onDuplicate(pkg.id)} title="Duplicate" className="p-1.5 text-ink-soft hover:text-ink transition-colors rounded">
            <Copy size={14} />
          </button>
          <button onClick={() => onDelete(pkg.id)} title="Delete" className="p-1.5 text-ink-soft hover:text-terracotta transition-colors rounded">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
