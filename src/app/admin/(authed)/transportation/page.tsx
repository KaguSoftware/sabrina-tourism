import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { TransportationEditor } from "./TransportationEditor";
import { createServerClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin/i18n";

export default async function AdminTransportationPage() {
  const { t } = await getAdminT();
  const supabase = (await createServerClient()) as any;

  const [heroRes, airportsRes, vehiclesRes] = await Promise.all([
    supabase.from("site_content").select("data").eq("id", "transport_hero").maybeSingle(),
    supabase.from("transport_airports").select("*").order("sort_order"),
    supabase.from("transport_vehicles").select("*").order("sort_order"),
  ]);

  const hero = heroRes.data?.data ?? {
    hero_heading_top: "",
    hero_heading_em: "",
    hero_sub: "",
    fleet_heading: "",
    hero_image: null,
  };

  return (
    <>
      <PageHeader
        kicker={t("pages.transportation.kicker")}
        title={t("pages.transportation.title")}
        description={t("pages.transportation.description")}
      />
      <TransportationEditor
        hero={hero}
        airports={airportsRes.data ?? []}
        vehicles={vehiclesRes.data ?? []}
      />
    </>
  );
}
