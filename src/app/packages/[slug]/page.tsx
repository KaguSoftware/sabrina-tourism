import { getAllSlugs } from "@/lib/packages/packages";
import { PackageDetailPage } from "@/components/packages/PackageDetailPage/PackageDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; people?: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} — Meridian & Co.`,
  };
}

export default async function PackageDetailRoute({ params, searchParams }: Props) {
  const { slug } = await params;
  const { date, people } = await searchParams;

  return (
    <PackageDetailPage slug={slug} seedDate={date} seedPeople={people} />
  );
}
