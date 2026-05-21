import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed border-rule bg-cream-warm/40 px-8 py-14 flex flex-col items-center justify-center text-center rounded-sm">
      <div className="w-12 h-12 rounded-full bg-cream-deep flex items-center justify-center mb-4">
        <Icon size={20} className="text-ochre" />
      </div>
      <p
        className="text-[20px] text-ink mb-2"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {title}
      </p>
      {description && (
        <p className="font-sans text-[14px] text-ink-soft max-w-sm leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
