import type { Package } from "@/lib/packages/types";

export interface PackageDetailPageProps {
  pkg: Package;
  seedDate?: string;
  seedPeople?: string;
  seedTier?: string;
}
