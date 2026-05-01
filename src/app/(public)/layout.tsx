import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { PaperPlanePath } from "@/components/primitives/PaperPlanePath/PaperPlanePath";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <PaperPlanePath />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </>
  );
}
