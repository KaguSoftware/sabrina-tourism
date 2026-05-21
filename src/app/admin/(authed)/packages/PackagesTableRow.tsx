"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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

export const SortableRow = memo(function SortableRow({
  pkg,
  onTogglePublished,
  onToggleFeatured,
  onDelete,
  onDuplicate,
}: SortableRowProps) {
  const t = useTranslations("admin.common");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pkg.id });

  return (
    <tr
      ref={setNodeRef}
      style={isDragging ? { transform: CSS.Transform.toString(transform), transition, opacity: 0.5, position: "relative", zIndex: 1 } : undefined}
      className="border-b border-rule hover:bg-cream-warm transition-colors"
    >
      <td className="pl-3 pr-2 py-3 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-ink-soft hover:text-ink transition-colors touch-none"
          aria-label={t("dragToReorder")}
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
          title={pkg.isPublished ? t("draft") : t("published")}
        >
          {pkg.isPublished ? (
            <span className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase bg-navy text-ochre rounded-sm group-hover:opacity-80 transition-opacity">
              {t("published")}
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase bg-cream-warm text-ink-soft border border-rule rounded-sm group-hover:opacity-80 transition-opacity">
              {t("draft")}
            </span>
          )}
        </button>
      </td>

      <td className="px-3 py-3 w-20">
        <button
          onClick={() => { if (!pkg.isPublished && !pkg.isFeatured) return; onToggleFeatured(pkg.id, pkg.isFeatured); }}
          disabled={!pkg.isPublished}
          title={t("featured")}
          className={`w-5 h-5 rounded-sm border transition-all duration-200 ${
            pkg.isFeatured ? "bg-ochre border-ochre" : "bg-transparent border-rule hover:border-ochre"
          } ${!pkg.isPublished ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label={t("featured")}
        >
          {pkg.isFeatured && (
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
              <path d="M2 6l3 3 5-5" stroke="#1f1a14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </td>

      <td className="px-3 py-3 w-28">
        <div className="flex items-center gap-1.5">
          <a
            href={`/admin/packages/${pkg.slug}`}
            title={t("edit")}
            aria-label={t("edit")}
            className="inline-flex items-center justify-center p-1.5 border border-rule bg-cream-warm/60 text-ink-soft hover:border-ochre hover:bg-cream-deep hover:text-ink transition-colors rounded-sm"
          >
            <Pencil size={13} />
          </a>
          <button
            type="button"
            onClick={() => onDuplicate(pkg.id)}
            title={t("duplicate")}
            aria-label={t("duplicate")}
            className="inline-flex items-center justify-center p-1.5 border border-rule bg-cream-warm/60 text-ink-soft hover:border-ochre hover:bg-cream-deep hover:text-ink transition-colors rounded-sm"
          >
            <Copy size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(pkg.id)}
            title={t("delete")}
            aria-label={t("delete")}
            className="inline-flex items-center justify-center p-1.5 border border-rule bg-cream-warm/60 text-ink-soft hover:border-terracotta hover:bg-terracotta hover:text-cream transition-colors rounded-sm"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
});
