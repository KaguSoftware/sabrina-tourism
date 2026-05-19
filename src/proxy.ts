import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { DEFAULT_LOCALE, LOCALES } from "./i18n/locales";

const intlProxy = createIntlMiddleware(routing);
const INTL_LOCALE_HEADER = "X-NEXT-INTL-LOCALE";

function hasLocalePrefix(pathname: string) {
  return LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

function getCookieLocale(request: NextRequest) {
  const locale = request.cookies.get("NEXT_LOCALE")?.value;
  return LOCALES.includes(locale as (typeof LOCALES)[number]) ? locale : null;
}

function getAcceptedLocale(request: NextRequest) {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (header.startsWith(locale) || header.includes(`,${locale}`) || header.includes(` ${locale}`)) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

function rewriteDefaultLocale(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${url.pathname === "/" ? "" : url.pathname}`;

  const headers = new Headers(request.headers);
  headers.set(INTL_LOCALE_HEADER, DEFAULT_LOCALE);

  const response = NextResponse.rewrite(url, { request: { headers } });
  response.cookies.set("NEXT_LOCALE", DEFAULT_LOCALE, { path: "/", sameSite: "lax" });
  return response;
}

function passThroughDefaultLocale(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(INTL_LOCALE_HEADER, DEFAULT_LOCALE);

  const response = NextResponse.next({ request: { headers } });
  response.cookies.set("NEXT_LOCALE", DEFAULT_LOCALE, { path: "/", sameSite: "lax" });
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: Supabase auth guard
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            response = NextResponse.next({ request: { headers: request.headers } });
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (user && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  // Public routes: next-intl locale routing
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    return passThroughDefaultLocale(request);
  }

  if (!hasLocalePrefix(pathname)) {
    const preferredLocale = getCookieLocale(request) ?? getAcceptedLocale(request);
    if (preferredLocale === DEFAULT_LOCALE) {
      return rewriteDefaultLocale(request);
    }
  }

  return intlProxy(request);
}

export const config = {
  matcher: [
    // Admin: exact /admin and all sub-paths
    "/admin",
    "/admin/(.*)",
    // next-intl: all public routes except admin, api, _next, static files
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};
