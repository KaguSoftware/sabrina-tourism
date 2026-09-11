import Link from "next/link";
import { ArrowUpRight, Map, Hotel, Sun } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { getAdminT } from "@/lib/admin/i18n";

// The dashboard tracks the content types the sidebar actually exposes. The
// legacy `packages` table still backs the public /packages pages but no longer
// has an admin section, so counting it here only produced dead links.
async function getDashboardStats() {
  const supabase = await createServerClient();

  const [tours, daily] = await Promise.all([
    supabase
      .from("premade_packages")
      .select("id, name, is_published, updated_at")
      .order("updated_at", { ascending: false }) as unknown as Promise<{
        data: { id: string; name: string; is_published: boolean; updated_at: string }[] | null;
        error: { message: string } | null;
      }>,
    supabase.from("daily_packages").select("id") as unknown as Promise<{
      data: { id: string }[] | null;
      error: { message: string } | null;
    }>,
  ]);

  const rows = tours.error ? null : tours.data;
  if (!rows) {
    return { published: 0, drafts: 0, dailyCount: 0, lastUpdated: null };
  }

  return {
    published: rows.filter((p) => p.is_published).length,
    drafts: rows.filter((p) => !p.is_published).length,
    dailyCount: daily.error ? 0 : (daily.data?.length ?? 0),
    lastUpdated: rows[0] ?? null,
  };
}

export default async function AdminDashboardPage() {
  const { t } = await getAdminT();
  const { published, drafts, dailyCount, lastUpdated } = await getDashboardStats();

  const lastUpdatedLabel = lastUpdated ? lastUpdated.name : "—";
  const lastUpdatedHref = lastUpdated
    ? `/admin/fixed-dates/${lastUpdated.id}`
    : "/admin/fixed-dates";

  const stats: Array<{
    value: string;
    label: string;
    href: string;
    small?: boolean;
  }> = [
    {
      value: String(published),
      label: t("dashboard.publishedPackages"),
      href: "/admin/fixed-dates",
    },
    {
      value: String(drafts),
      label: t("dashboard.draftPackages"),
      href: "/admin/fixed-dates",
    },
    {
      value: String(dailyCount),
      label: t("sidebar.dailyTours"),
      href: "/admin/daily",
    },
    {
      value: lastUpdatedLabel,
      label: t("dashboard.lastUpdated"),
      href: lastUpdatedHref,
      small: true,
    },
  ];

  const quickActions = [
    { href: "/admin/fixed-dates/new", label: "New tour", icon: Map },
    { href: "/admin/hotels/new", label: "New hotel", icon: Hotel },
    { href: "/admin/daily/new", label: "New daily tour", icon: Sun },
  ];

  return (
    <>
      <PageHeader
        kicker={t("dashboard.kicker")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative border border-rule bg-cream-warm px-7 py-6 space-y-2 hover:border-ochre hover:bg-cream-deep hover:shadow-sm transition-all duration-200 rounded-sm"
          >
            <ArrowUpRight
              size={16}
              className="absolute top-4 right-4 text-ink-soft/40 group-hover:text-ochre group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
              aria-hidden="true"
            />
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
          </Link>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-rule">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted mb-4">
          Quick actions
        </p>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold hover:shadow-sm active:opacity-80 transition-all duration-200 rounded-sm"
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
