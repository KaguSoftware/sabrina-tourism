"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "not_allowed") setServerError(t("login.notAllowed"));
    else if (err === "oauth_failed") setServerError(t("login.oauthFailed"));
  }, [searchParams, t]);

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

  async function signInWithGoogle() {
    setServerError(null);
    setGoogleLoading(true);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setServerError(t("login.oauthFailed"));
      setGoogleLoading(false);
    }
  }

  const busy = isSubmitting || googleLoading;

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
                disabled={busy}
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
                  disabled={busy}
                  className="pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={busy}
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
              disabled={busy}
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

          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-rule" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
              {t("login.or")}
            </span>
            <div className="h-px flex-1 bg-rule" />
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase font-medium bg-cream text-navy border border-navy hover:bg-cream-deep hover:border-ochre active:opacity-80 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed rounded-sm shadow-sm"
          >
            {googleLoading ? (
              <Spinner size="sm" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            {t("login.signInWithGoogle")}
          </button>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
          Sabrina Turizm · Concierge
        </p>
      </div>
    </div>
  );
}
