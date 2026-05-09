import { renderPremadePdf } from "@/lib/pdf/render";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const baseUrl = new URL(req.url).origin;
  const waPhone = process.env.NEXT_PUBLIC_WA_PHONE ?? "";

  let bytes: ArrayBuffer | null;
  try {
    bytes = await renderPremadePdf(slug, baseUrl, waPhone);
  } catch (err) {
    console.error("[pdf/premade] render error:", err);
    return new Response("PDF generation failed", { status: 500 });
  }
  if (!bytes) return new Response("Package not found", { status: 404 });

  return new Response(new Blob([bytes], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
