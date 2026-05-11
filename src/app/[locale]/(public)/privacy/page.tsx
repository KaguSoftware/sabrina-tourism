import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: "Privacy Policy — Sabrina Turizm",
  description: "How Sabrina Turizm handles enquiry and booking information.",
};

export default async function PrivacyPage() {
  const t = await getTranslations("legal.privacy");
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
