"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { GoldButton } from "@/components/primitives/GoldButton/GoldButton";
import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher/AdminLocaleSwitcher";

type FormValues = {
  email: string;
  password: string;
};

const fieldCls =
  "w-full bg-transparent border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200";

const labelCls = "font-mono text-[11px] tracking-[0.22em] uppercase text-muted";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(z.object({
      email: z.string().email(t("login.validEmail")),
      password: z.string().min(1, t("login.passwordRequired")),
    })),
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError(t("login.invalid"));
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-rule bg-cream-warm px-10 py-12 space-y-8">
          <div className="space-y-3">
            <Kicker>Concierge</Kicker>
            <GoldUnderlineHeading as="h1">{t("login.title")}</GoldUnderlineHeading>
          </div>
          <AdminLocaleSwitcher />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className={labelCls}>
                {t("login.email")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={fieldCls}
                {...register("email")}
              />
              {errors.email && (
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="password" className={labelCls}>
                {t("login.password")}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={fieldCls}
                {...register("password")}
              />
              {errors.password && (
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">
                  {errors.password.message}
                </span>
              )}
            </div>

            {serverError && (
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">
                {serverError}
              </p>
            )}

            <GoldButton type="submit" variant="solid">
              {isSubmitting ? t("login.signingIn") : t("login.signIn")}
            </GoldButton>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
          Sabrina Turizm · Concierge
        </p>
      </div>
    </div>
  );
}
