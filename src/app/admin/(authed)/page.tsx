import Link from "next/link";
import { ArrowUpRight, Map, Hotel, Sun } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { getAdminT } from "@/lib/admin/i18n";

async function getDashboardStats() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("packages")
    .select("is_published, is_featured, name, slug, updated_at")
    .order("updated_at", { ascending: false }) as unknown as {
      data: { is_published: boolean; is_featured: boolean; name: string; slug: string; updated_at: string }[] | null;
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
  const { t } = await getAdminT();
  const { published, featured, drafts, lastUpdated } = await getDashboardStats();

  const lastUpdatedLabel = lastUpdated ? lastUpdated.name : "—";
  const lastUpdatedHref = lastUpdated
    ? `/admin/packages/${lastUpdated.slug}`
    : "/admin/packages";

  const stats: Array<{
    value: string;
    label: string;
    href: string;
    small?: boolean;
  }> = [
    {
      value: String(published),
      label: t("dashboard.publishedPackages"),
      href: "/admin/packages",
    },
    {
      value: `${featured}/3`,
      label: t("dashboard.featuredSlotsUsed"),
      href: "/admin/packages",
    },
    {
      value: String(drafts),
      label: t("dashboard.draftPackages"),
      href: "/admin/packages",
    },
    {
      value: lastUpdatedLabel,
      label: t("dashboard.lastUpdated"),
      href: lastUpdatedHref,
      small: true,
    },
  ];

  const quickActions = [
    { href: "/admin/packages/new", label: "New tour", icon: Map },
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
