import { loadAllMessages, seedTranslationsFromFiles } from "./actions";
import { TranslationsEditor } from "./TranslationsEditor";
import { getAdminT } from "@/lib/admin/i18n";
import { SeedButton } from "./SeedButton";

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
      <div className="mb-6 flex items-center gap-4 border border-rule bg-cream-warm px-5 py-4">
        <div className="flex-1">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-0.5">First deploy</p>
          <p className="text-[13px] text-ink-soft">Seed the Supabase <code className="font-mono text-[12px] bg-cream px-1 border border-rule">ui_translations</code> table from the bundled JSON files. Run once after creating the table.</p>
        </div>
        <SeedButton seedAction={seedTranslationsFromFiles} />
      </div>
      <TranslationsEditor initialMessages={messages} />
    </div>
  );
}
