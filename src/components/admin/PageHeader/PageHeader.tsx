import type { ReactNode } from "react";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ kicker, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6 pb-8 border-b border-rule mb-8">
      <div className="space-y-2">
        <Kicker>{kicker}</Kicker>
        <GoldUnderlineHeading as="h1">{title}</GoldUnderlineHeading>
        {description && (
          <p className="font-sans text-[15px] text-ink-soft max-w-prose mt-2">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 pt-1">
          {actions}
        </div>
      )}
    </div>
  );
}
