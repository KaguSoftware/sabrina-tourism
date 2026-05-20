import { getInclusionIcon } from "./inclusion-icons";
import { LUCIDE_REGISTRY, type LucideIcon } from "./lucide-registry";

interface InclusionIconProps {
  name: string | null;
  fallback: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Renders the appropriate Lucide icon for a given inclusion key.
 * `name` is the canonical inclusion key (e.g. "transportation", "meals").
 * `fallback` is the Lucide name to use when no specific icon is mapped.
 *
 * Previously inlined in three detail-page components — moved here so the
 * three remain in sync.
 */
export function InclusionIcon({ name, fallback, size = 16, strokeWidth = 1.75 }: InclusionIconProps) {
  const def = getInclusionIcon(name);
  const Component = (def ? LUCIDE_REGISTRY[def.lucide] : LUCIDE_REGISTRY[fallback]) as LucideIcon | undefined;
  if (!Component) return null;
  return <Component size={size} strokeWidth={strokeWidth} />;
}
