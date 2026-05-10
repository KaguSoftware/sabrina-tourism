import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms & Conditions — Sabrina Turizm",
  description: "General booking terms for Sabrina Turizm enquiries and services.",
};

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");
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
