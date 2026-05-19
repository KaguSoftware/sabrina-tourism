import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const path = "/privacy";
  const localePath = locale === "en" ? path : `/${locale}${path}`;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  const baseTitle = t("title");
  const title = `${baseTitle} — Sabrina Turizm`;
  const description = t("intro");
  return {
    title,
    description,
    alternates: { canonical: localePath },
    openGraph: {
      title,
      description,
      images: [{ url: "/homepage.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal.privacy");
  const tLegal = await getTranslations("legal");
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
      contactWhatsapp={tLegal("contactWhatsapp")}
    />
  );
}
