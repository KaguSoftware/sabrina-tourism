import { createServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";

async function getDashboardStats() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("packages")
    .select("is_published, is_featured, name, updated_at")
    .order("updated_at", { ascending: false }) as unknown as {
      data: { is_published: boolean; is_featured: boolean; name: string; updated_at: string }[] | null;
      error: { message: string } | null;
    };

  if (error || !data) {
    return { published: 0, featured: 0, drafts: 0, lastUpdated: null };
  }

  const published = data.filter((p) => p.is_published).length;
  const featured = data.filter((p) => p.is_featured).length;
  const drafts = data.filter((p) => !p.is_published).length;
  const lastUpdated = data[0] ?? null;

  return { published, featured, drafts, lastUpdated };
}

export default async function AdminDashboardPage() {
  const { published, featured, drafts, lastUpdated } = await getDashboardStats();

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.name
    : "—";

  const stats = [
    { value: String(published), label: "Published packages" },
    { value: `${featured}/3`, label: "Featured slots used" },
    { value: String(drafts), label: "Draft packages" },
    { value: lastUpdatedLabel, label: "Last updated", small: true },
  ];

  return (
    <>
      <PageHeader
        kicker="Concierge"
        title="Welcome back."
        description="Pick a section from the left to begin."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-rule bg-cream-warm px-7 py-6 space-y-2"
          >
            <p
              className={`font-display italic text-ochre leading-none ${
                stat.small ? "text-[28px]" : "text-[48px]"
              }`}
            >
              {stat.value}
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
