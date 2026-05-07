"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ADMIN_LOCALE_COOKIE, ADMIN_LOCALE_LABELS, ADMIN_LOCALES, type AdminLocale } from "@/lib/admin/i18n-shared";

export function AdminLocaleSwitcher() {
  const locale = useLocale() as AdminLocale;
  const router = useRouter();
  const t = useTranslations("admin.language");

  function setLocale(next: AdminLocale) {
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${next}; path=/admin; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <label className="flex flex-col gap-1 px-4 pb-4">
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted">
        {t("label")}
      </span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as AdminLocale)}
        className="h-9 border border-rule bg-cream px-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink focus:outline-none focus:border-ochre"
      >
        {ADMIN_LOCALES.map((item) => (
          <option key={item} value={item}>
            {ADMIN_LOCALE_LABELS[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
