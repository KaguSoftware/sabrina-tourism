import { renderPackagePdf } from "@/lib/pdf/render";
import { WA_PHONE } from "@/lib/whatsapp/constants";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const baseUrl = new URL(req.url).origin;
  const waPhone = WA_PHONE;

  let bytes: ArrayBuffer | null;
  try {
    bytes = await renderPackagePdf(slug, baseUrl, waPhone);
  } catch (err) {
    console.error("[pdf/package] render error:", err);
    return new Response("PDF generation failed", { status: 500 });
  }
  if (!bytes) return new Response("Package not found", { status: 404 });

  const safeSlug = slug.replace(/[^A-Za-z0-9-_]/g, "_");
  return new Response(new Blob([bytes], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeSlug}.pdf"`,
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
