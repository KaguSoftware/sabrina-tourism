"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Select } from "@/components/admin/Input/Select";
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
    <label className="flex flex-col gap-1.5 px-4 pb-4">
      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-muted">
        <Languages size={11} />
        {t("label")}
      </span>
      <Select
        value={locale}
        onChange={(event) => setLocale(event.target.value as AdminLocale)}
      >
        {ADMIN_LOCALES.map((item) => (
          <option key={item} value={item}>
            {ADMIN_LOCALE_LABELS[item]}
          </option>
        ))}
      </Select>
    </label>
  );
}
