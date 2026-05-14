import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { PaperPlanePath } from "@/components/primitives/PaperPlanePath/PaperPlanePath";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-x-hidden overflow-y-clip">
      <ScrollToTop />
      <SiteHeader />
      <PaperPlanePath />
      <main className="relative">{children}</main>
      <SiteFooter />
    </div>
  );
}
