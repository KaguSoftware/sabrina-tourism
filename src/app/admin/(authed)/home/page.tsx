import { getSiteContent } from "@/lib/db/site-content";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { HomeEditor } from "./HomeEditor";
import { getAdminT } from "@/lib/admin/i18n";
import { loadSiteContentTranslations } from "@/lib/translations/content-actions";

const HOME_KEYS = [
  "home_hero",
  "home_about",
  "home_how_it_works",
  "home_featured_heading",
  "home_featured_hotels_heading",
  "home_group_packages",
  "home_quote",
] as const;

export default async function AdminHomePage() {
  const { t } = await getAdminT();
  const [hero, about, howItWorks, featured, featuredHotels, groupPackages, quote, ...translationResults] = await Promise.all([
    getSiteContent("home_hero"),
    getSiteContent("home_about"),
    getSiteContent("home_how_it_works"),
    getSiteContent("home_featured_heading"),
    getSiteContent("home_featured_hotels_heading"),
    getSiteContent("home_group_packages"),
    getSiteContent("home_quote"),
    ...HOME_KEYS.map((key) => loadSiteContentTranslations(key)),
  ]);

  const initialTranslations = Object.fromEntries(
    HOME_KEYS.map((key, i) => [key, translationResults[i]])
  );

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
        groupPackages={groupPackages}
        quote={quote}
        initialTranslations={initialTranslations}
      />
    </>
  );
}
