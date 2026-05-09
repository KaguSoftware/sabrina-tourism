import { renderToStream } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createElement } from "react";
import type { ReactElement } from "react";
import { buffer } from "node:stream/consumers";
import { getPremadePackageBySlug } from "@/lib/db/premade-packages";
import { PremadePackagePDF } from "@/components/pdf/PremadePackagePDF";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const pkg = await getPremadePackageBySlug(slug);

  if (!pkg) {
    return new Response("Package not found", { status: 404 });
  }

  const waPhone = process.env.NEXT_PUBLIC_WA_PHONE ?? "";
  const baseUrl = new URL(req.url).origin;

  let arrayBuffer: ArrayBuffer;
  try {
    const stream = await renderToStream(
      createElement(PremadePackagePDF, { pkg, waPhone, baseUrl }) as ReactElement<DocumentProps>
    );
    const buf = await buffer(stream);
    arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch (err) {
    console.error("[pdf/premade] render error:", err);
    return new Response("PDF generation failed", { status: 500 });
  }

  return new Response(new Blob([arrayBuffer], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
    },
  });
}
