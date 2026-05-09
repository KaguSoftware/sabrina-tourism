import { getSiteContent } from "@/lib/db/site-content";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { HomeEditor } from "./HomeEditor";
import { getAdminT } from "@/lib/admin/i18n";

export default async function AdminHomePage() {
  const { t } = await getAdminT();
  const [hero, about, howItWorks, featured, featuredHotels, quote] = await Promise.all([
    getSiteContent("home_hero"),
    getSiteContent("home_about"),
    getSiteContent("home_how_it_works"),
    getSiteContent("home_featured_heading"),
    getSiteContent("home_featured_hotels_heading"),
    getSiteContent("home_quote"),
  ]);

  return (
    <>
      <PageHeader
        kicker={t("pages.home.kicker")}
        title={t("pages.home.title")}
        description={t("pages.home.description")}
      />
      <HomeEditor
        hero={hero}
        about={about}
        howItWorks={howItWorks}
        featured={featured}
        featuredHotels={featuredHotels}
        quote={quote}
      />
    </>
  );
}
