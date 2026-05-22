import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export type PageHeaderStatus = "published" | "draft" | "incomplete" | "warning";

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  status?: { kind: PageHeaderStatus; label: string };
}

const STATUS_CLASSES: Record<PageHeaderStatus, string> = {
  published: "bg-teal/10 text-teal border-teal/40",
  draft: "bg-ink/5 text-ink-soft border-rule",
  incomplete: "bg-terracotta/10 text-terracotta border-terracotta/40",
  warning: "bg-ochre/10 text-ochre border-ochre/40",
};

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  breadcrumbs,
  status,
}: PageHeaderProps) {
  return (
    <div className="pb-8 border-b border-rule mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 mb-3 flex-wrap"
        >
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1">
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft hover:text-ink transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={`font-mono text-[10px] tracking-[0.18em] uppercase ${
                      isLast ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight size={11} className="text-ink-soft/60" />
                )}
              </span>
            );
          })}
        </nav>
      )}

      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Kicker>{kicker}</Kicker>
            {status && (
              <span
                className={`inline-flex items-center font-mono text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 rounded-sm ${STATUS_CLASSES[status.kind]}`}
              >
                {status.label}
              </span>
            )}
          </div>
          <GoldUnderlineHeading as="h1">{title}</GoldUnderlineHeading>
          {description && (
            <p className="font-sans text-[15px] text-ink-soft max-w-prose mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0 pt-1">{actions}</div>
        )}
      </div>
    </div>
  );
}
