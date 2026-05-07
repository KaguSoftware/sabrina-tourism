import { loadAllMessages } from "./actions";
import { TranslationsEditor } from "./TranslationsEditor";
import { getAdminT } from "@/lib/admin/i18n";

export const dynamic = "force-dynamic";

export default async function TranslationsPage() {
  const { t } = await getAdminT();
  const messages = await loadAllMessages();

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-muted mb-2">{t("pages.translations.kicker")}</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink">{t("pages.translations.title")}</h1>
        <p className="text-ink-soft text-[14px] mt-1">{t("pages.translations.description")}</p>
      </div>
      <TranslationsEditor initialMessages={messages} />
    </div>
  );
}
