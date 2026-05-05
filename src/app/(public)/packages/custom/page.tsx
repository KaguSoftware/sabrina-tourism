import { redirect } from "next/navigation";

export default async function CustomTourPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const query = step ? `?step=${encodeURIComponent(step)}` : "";

  redirect(`/tours/custom-packages${query}`);
}
