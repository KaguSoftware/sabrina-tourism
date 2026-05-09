import { renderToStream } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { buffer } from "node:stream/consumers";
import { createElement } from "react";
import type { ReactElement } from "react";
import { unstable_cache } from "next/cache";
import { tags } from "@/lib/cache/tags";
import { getPackageBySlug } from "@/lib/db/packages";
import { getPremadePackageBySlug } from "@/lib/db/premade-packages";
import { DAILY_PACKAGES } from "@/lib/daily/data";
import { PackagePDF } from "@/components/pdf/PackagePDF";
import { PremadePackagePDF } from "@/components/pdf/PremadePackagePDF";
import { DailyPackagePDF } from "@/components/pdf/DailyPackagePDF";
import type { Package } from "@/lib/packages/types";

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
): Promise<ArrayBuffer | null> {
  const pkg = await getPremadePackageBySlug(slug);
  if (!pkg) return null;

  const stream = await renderToStream(
    createElement(PremadePackagePDF, { pkg, waPhone, baseUrl }) as ReactElement<DocumentProps>,
  );
  return streamToBytes(stream);
}

async function _renderDailyPdf(
  id: string,
  baseUrl: string,
  waPhone: string,
): Promise<ArrayBuffer | null> {
  const pkg = DAILY_PACKAGES.find((p) => p.id === id);
  if (!pkg) return null;

  const stream = await renderToStream(
    createElement(DailyPackagePDF, { pkg, waPhone, baseUrl }) as ReactElement<DocumentProps>,
  );
  return streamToBytes(stream);
}

export async function renderPackagePdf(slug: string, baseUrl: string, waPhone: string) {
  return unstable_cache(
    () => _renderPackagePdf(slug, baseUrl, waPhone),
    ["pdf:package", slug, baseUrl, waPhone],
    { tags: [tags.packages.bySlug(slug), tags.packages.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function renderPremadePdf(slug: string, baseUrl: string, waPhone: string) {
  return unstable_cache(
    () => _renderPremadePdf(slug, baseUrl, waPhone),
    ["pdf:premade", slug, baseUrl, waPhone],
    { tags: [tags.premade.bySlug(slug), tags.premade.all()], revalidate: REVALIDATE_SECONDS },
  )();
}

export async function renderDailyPdf(id: string, baseUrl: string, waPhone: string) {
  return unstable_cache(
    () => _renderDailyPdf(id, baseUrl, waPhone),
    ["pdf:daily", id, baseUrl, waPhone],
    { tags: [tags.daily.bySlug(id), tags.daily.all()], revalidate: REVALIDATE_SECONDS },
  )();
}
