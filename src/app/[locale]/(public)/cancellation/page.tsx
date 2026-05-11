import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Cancellation Policy — Sabrina Turizm",
  description: "General cancellation information for Sabrina Turizm bookings.",
};

export default async function CancellationPage() {
  const t = await getTranslations("legal.cancellation");
  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      sections={[
        { heading: t("section1Heading"), body: t("section1Body") },
        { heading: t("section2Heading"), body: t("section2Body") },
        { heading: t("section3Heading"), body: t("section3Body") },
      ]}
    />
  );
}
