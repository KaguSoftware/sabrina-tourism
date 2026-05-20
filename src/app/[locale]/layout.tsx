import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { routing } from "@/i18n/routing";
import { CurrencyProvider } from "@/lib/currency/context";
import { MotionConfig } from "@/components/primitives/motion";

// Sonner is only needed after a user interaction triggers a toast — defer it
// past initial paint so it doesn't sit in the first-load JS bundle.
const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), {
  loading: () => null,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <MotionConfig>
        <CurrencyProvider locale={locale}>{children}</CurrencyProvider>
        <Toaster position="bottom-right" richColors closeButton theme="light" />
      </MotionConfig>
    </NextIntlClientProvider>
  );
}
