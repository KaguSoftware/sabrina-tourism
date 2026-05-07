import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlProxy = createIntlMiddleware(routing);

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
