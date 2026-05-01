import { getSiteContent } from "@/lib/db/site-content";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { HomeEditor } from "./HomeEditor";

export default async function AdminHomePage() {
  const [hero, about, howItWorks, featured, quote] = await Promise.all([
    getSiteContent("home_hero"),
    getSiteContent("home_about"),
    getSiteContent("home_how_it_works"),
    getSiteContent("home_featured_heading"),
    getSiteContent("home_quote"),
  ]);

  return (
    <>
      <PageHeader
        kicker="Concierge"
        title="Home page"
        description="Edit every text section on the public home page."
      />
      <HomeEditor
        hero={hero}
        about={about}
        howItWorks={howItWorks}
        featured={featured}
        quote={quote}
      />
    </>
  );
}
