import { renderVoucherPdf } from "@/lib/pdf/render";
import { voucherSchema } from "@/app/admin/(authed)/vouchers/schema";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Admin-only — the route lives outside the (authed) layout's redirect guard,
  // so we re-check the session here to keep voucher generation private.
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(parsed.error.issues[0]?.message ?? "Validation failed", { status: 400 });
  }

  let bytes: ArrayBuffer;
  try {
    bytes = await renderVoucherPdf(parsed.data);
  } catch (err) {
    console.error("[pdf/voucher] render error:", err);
    return new Response("PDF generation failed", { status: 500 });
  }

  const safeNo = parsed.data.voucherNumber.replace(/[^A-Za-z0-9-_]/g, "_");
  return new Response(new Blob([bytes], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sabrina-voucher-${safeNo}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
