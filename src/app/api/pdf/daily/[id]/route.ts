import { renderToStream } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createElement } from "react";
import type { ReactElement } from "react";
import { buffer } from "node:stream/consumers";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import { DailyPackagePDF } from "@/components/pdf/DailyPackagePDF";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pkg = DAILY_PACKAGES.find((p) => p.id === id);

  if (!pkg) {
    return new Response("Daily package not found", { status: 404 });
  }

  const waPhone = process.env.NEXT_PUBLIC_WA_PHONE ?? "";
  const baseUrl = new URL(req.url).origin;

  let arrayBuffer: ArrayBuffer;
  try {
    const stream = await renderToStream(
      createElement(DailyPackagePDF, { pkg, waPhone, baseUrl }) as ReactElement<DocumentProps>
    );
    const buf = await buffer(stream);
    arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch (err) {
    console.error("[pdf/daily] render error:", err);
    return new Response("PDF generation failed", { status: 500 });
  }

  return new Response(new Blob([arrayBuffer], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${id}.pdf"`,
    },
  });
}
