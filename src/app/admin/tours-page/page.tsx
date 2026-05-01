import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { ToursPageEditor } from "./ToursPageEditor";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminToursPageEditor() {
  const supabase = (await createServerClient()) as any;

  const { data } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", "tours_hero")
    .maybeSingle();

  const content = data?.data ?? {
    kicker: "Explore",
    page_heading: "",
    page_lede: "",
    hero_image: null,
  };

  return (
    <>
      <PageHeader
        kicker="Catalogue"
        title="Tours page"
        description="Hero copy and image for the tours listing."
      />
      <ToursPageEditor data={content} />
    </>
  );
}
