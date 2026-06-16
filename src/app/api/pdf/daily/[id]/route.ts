import { renderDailyPdf } from "@/lib/pdf/render";
import { WA_PHONE } from "@/lib/whatsapp/constants";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(req.url);
  const baseUrl = url.origin;
  const waPhone = WA_PHONE;
  const locale = url.searchParams.get("locale") ?? "en";

  let bytes: ArrayBuffer | null;
  try {
    bytes = await renderDailyPdf(id, baseUrl, waPhone, locale);
  } catch (err) {
    console.error("[pdf/daily] render error:", err);
    return new Response("PDF generation failed", { status: 500 });
  }
  if (!bytes) return new Response("Daily package not found", { status: 404 });

  const safeId = id.replace(/[^A-Za-z0-9-_]/g, "_");
  return new Response(new Blob([bytes], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeId}.pdf"`,
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
