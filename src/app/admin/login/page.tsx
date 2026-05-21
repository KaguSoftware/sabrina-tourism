"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Kicker } from "@/components/primitives/Kicker/Kicker";
import { GoldUnderlineHeading } from "@/components/primitives/GoldUnderlineHeading/GoldUnderlineHeading";
import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher/AdminLocaleSwitcher";
import { Input } from "@/components/admin/Input/Input";
import { Spinner } from "@/components/admin/Spinner/Spinner";

type FormValues = {
  email: string;
  password: string;
};

const labelCls = "font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft font-medium";
const errorCls = "font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(z.object({
      email: z.string().email(t("login.validEmail")),
      password: z.string().min(1, t("login.passwordRequired")),
    })),
    mode: "onTouched",
    reValidateMode: "onChange",
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
        <div className="border border-rule bg-cream-warm px-10 py-12 space-y-8 shadow-sm">
          <div className="space-y-3">
            <Kicker>Concierge</Kicker>
            <GoldUnderlineHeading as="h1">{t("login.title")}</GoldUnderlineHeading>
          </div>
          <AdminLocaleSwitcher />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelCls}>
                {t("login.email")}
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <span className={errorCls}>{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className={labelCls}>
                {t("login.password")}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  disabled={isSubmitting}
                  className="pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ink-soft hover:text-ink hover:bg-cream-deep rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className={errorCls}>{errors.password.message}</span>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/10 px-4 py-3 rounded-sm"
              >
                <AlertCircle size={14} className="text-terracotta flex-shrink-0 mt-0.5" />
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-terracotta">
                  {serverError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase font-medium bg-ochre text-navy border border-ochre hover:bg-gold hover:border-gold active:opacity-80 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed rounded-sm shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  {t("login.signingIn")}
                </>
              ) : (
                t("login.signIn")
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
          Sabrina Turizm · Concierge
        </p>
      </div>
    </div>
  );
}
