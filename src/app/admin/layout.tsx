import { NextIntlClientProvider } from "next-intl";
import { getAdminLocale, getAdminMessages } from "@/lib/admin/i18n";
import { isRTL } from "@/i18n/locales";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminIntl>{children}</AdminIntl>;
}

async function AdminIntl({ children }: { children: React.ReactNode }) {
  const locale = await getAdminLocale();
  const messages = await getAdminMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div dir={isRTL(locale) ? "rtl" : "ltr"}>{children}</div>
    </NextIntlClientProvider>
  );
}
