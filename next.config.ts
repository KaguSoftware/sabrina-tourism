import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const STATIC_HTML_CACHE_CONTROL =
  "public, s-maxage=2592000, stale-while-revalidate=86400";
const LEGAL_HTML_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=31536000, immutable";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const STATIC_HTML_ROUTES = [
  "/",
  "/:locale",
  "/:locale/packages",
  "/:locale/packages/:slug",
  "/:locale/packages/custom",
  "/:locale/hotels",
  "/:locale/regions",
  "/:locale/regions/:slug",
  "/:locale/regions/:slug/:hotelSlug",
  "/:locale/tours/premade",
  "/:locale/tours/premade/:id",
  "/:locale/tours/daily",
  "/:locale/tours/daily/:id",
  "/:locale/tours/daily-packages",
  "/:locale/tours/custom-packages",
  "/:locale/tours/fixed-dates",
  "/:locale/transportation",
];

const LEGAL_ROUTES = [
  "/:locale/privacy",
  "/:locale/terms",
  "/:locale/cancellation",
];

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "sonner",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      ...STATIC_HTML_ROUTES.map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: STATIC_HTML_CACHE_CONTROL }],
      })),
      ...LEGAL_ROUTES.map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: LEGAL_HTML_CACHE_CONTROL }],
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
