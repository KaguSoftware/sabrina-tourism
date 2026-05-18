import { renderToStream } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { buffer } from "node:stream/consumers";
import { createElement } from "react";
import type { ReactElement } from "react";
import { getPackageBySlug } from "@/lib/db/packages";
import { getPremadePackageBySlug } from "@/lib/db/premade-packages";
import { getDailyPackageBySlug } from "@/lib/db/daily-packages";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import { PackagePDF } from "@/components/pdf/PackagePDF";
import { PremadePackagePDF } from "@/components/pdf/PremadePackagePDF";
import { DailyPackagePDF } from "@/components/pdf/DailyPackagePDF";
import { VoucherPDF } from "@/components/pdf/VoucherPDF";
import type { Package } from "@/lib/packages/types";
import type { VoucherPayload } from "@/app/admin/(authed)/vouchers/schema";

const REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function streamToBytes(stream: NodeJS.ReadableStream): Promise<ArrayBuffer> {
  const buf = await buffer(stream);
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return ab;
}

async function _renderPackagePdf(
  slug: string,
  baseUrl: string,
  waPhone: string,
): Promise<ArrayBuffer | null> {
  const result = await getPackageBySlug(slug);
  if (!result || "redirectTo" in result) return null;

  const pkg = result as Package;
  const stream = await renderToStream(
    createElement(PackagePDF, { pkg, waPhone, baseUrl }) as ReactElement<DocumentProps>,
  );
  return streamToBytes(stream);
}

async function _renderPremadePdf(
  slug: string,
  baseUrl: string,
  waPhone: string,
  locale: string,
): Promise<ArrayBuffer | null> {
  const pkg = await getPremadePackageBySlug(slug, locale);
  if (!pkg) return null;

  const stream = await renderToStream(
    createElement(PremadePackagePDF, { pkg, waPhone, baseUrl, locale }) as ReactElement<DocumentProps>,
  );
  return streamToBytes(stream);
}

async function _renderDailyPdf(
  id: string,
  baseUrl: string,
  waPhone: string,
  locale: string,
): Promise<ArrayBuffer | null> {
  // Try DB first (has translations), fall back to static data
  const dbPkg = await getDailyPackageBySlug(id, locale).catch(() => null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pkg: any = dbPkg ?? DAILY_PACKAGES.find((p) => p.id === id);
  if (!pkg) return null;

  const stream = await renderToStream(
    createElement(DailyPackagePDF, { pkg, waPhone, baseUrl, locale }) as ReactElement<DocumentProps>,
  );
  return streamToBytes(stream);
}

// PDFs are generated on-demand — ArrayBuffer is not JSON-serializable so
// unstable_cache would corrupt the bytes. The route handler sets its own
// Cache-Control headers, so we just render directly each time.
export async function renderPackagePdf(slug: string, baseUrl: string, waPhone: string) {
  return _renderPackagePdf(slug, baseUrl, waPhone);
}

export async function renderPremadePdf(slug: string, baseUrl: string, waPhone: string, locale = 'en') {
  return _renderPremadePdf(slug, baseUrl, waPhone, locale);
}

export async function renderDailyPdf(slug: string, baseUrl: string, waPhone: string, locale = 'en') {
  return _renderDailyPdf(slug, baseUrl, waPhone, locale);
}

export async function renderVoucherPdf(payload: VoucherPayload): Promise<ArrayBuffer> {
  const stream = await renderToStream(
    createElement(VoucherPDF, { payload }) as ReactElement<DocumentProps>,
  );
  return streamToBytes(stream);
}
