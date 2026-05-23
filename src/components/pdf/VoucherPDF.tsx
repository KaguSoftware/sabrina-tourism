import React from "react";
import path from "node:path";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { registerFonts } from "@/lib/pdf/fonts";
import { visualRTL } from "@/lib/pdf/rtl";
import { getFontsForLocale } from "@/lib/pdf/theme";
import { CURRENCY_SYMBOL, VOUCHER_LABELS, type VoucherPayload, type VoucherType, type VoucherLabels } from "@/app/admin/(authed)/vouchers/schema";
import { type Locale } from "@/i18n/locales";

registerFonts();

const LOGO_DARK = path.join(process.cwd(), "public/logo_2_sabrina_cropped.png");

const COLOR = {
  ivory: "#f1ebdd",
  ivoryAlt: "#ebe3d1",
  ink: "#11202c",
  inkSoft: "#1a2c3a",
  gold: "#b08947",
  goldSoft: "#c8a565",
  rule: "#b6a987",
  text: "#1a1a1a",
  muted: "#6a6453",
  muted2: "#8a8472",
};

const FONT = {
  display: "Fraunces",
  body: "Inter",
  mono: "JetBrains Mono",
} as const;

// 1mm in PDF points (react-pdf A4 = 595.28 x 841.89)
const MM = 2.83465;
const mm = (n: number) => n * MM;

function pickFonts(locale: Locale) {
  // Delegate to the existing locale→font map used by PremadePackagePDF (Noto Sans
  // for Cyrillic, Noto Sans JP/SC for CJK, IBM Plex Sans Arabic for ar).
  return getFontsForLocale(locale);
}

// 1:1 with PremadePackagePDF's tx() — RTL locales always go through visualRTL.
function tx(text: string, rtl: boolean): string {
  return rtl ? visualRTL(text) : text;
}

function fmtMoney(amount: number, currency: VoucherPayload["currency"]): string {
  const symbol = CURRENCY_SYMBOL[currency];
  const num = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${symbol} ${num}`;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function intlLocale(locale: Locale): string {
  return locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : `${locale}`;
}

function fmtDate(iso: string, locale: Locale): string {
  if (!ISO_DATE_RE.test(iso)) return iso;
  return new Date(iso + "T00:00:00").toLocaleDateString(intlLocale(locale), { day: "numeric", month: "long", year: "numeric" });
}

function fmtDateDots(iso: string): string {
  if (!ISO_DATE_RE.test(iso)) return iso;
  const [y, m, d] = iso.split("-");
  return `${d} · ${m} · ${y}`;
}

function weekday(iso: string, locale: Locale): string {
  if (!ISO_DATE_RE.test(iso)) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString(intlLocale(locale), { weekday: "long" });
}

// Arabic letters join contextually — tracked-caps letterSpacing on labels
// (a Latin editorial flourish) forces those joined letters apart, which reads
// as "gaps between letters". Zero it out when the locale is RTL.
function ls(value: number, rtl: boolean): number {
  return rtl ? 0 : value;
}

function buildStaySub(weekdayName: string, time: string, timeLabel: string): string {
  const parts: string[] = [];
  if (weekdayName) parts.push(weekdayName);
  if (time) parts.push(`${timeLabel} ${time}`);
  return parts.join(" · ");
}

function buildTimeRange(start: string, end: string): string {
  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

function buildTransferSub(iso: string, time: string, locale: Locale): string {
  const parts: string[] = [];
  if (ISO_DATE_RE.test(iso)) parts.push(fmtDate(iso, locale));
  if (time) parts.push(time);
  return parts.join(" · ");
}

function staySectionLabel(type: VoucherType, L: VoucherLabels): string {
  if (type === "daily") return L.sectionStayDaily;
  if (type === "transfer") return L.sectionStayTransfer;
  return L.sectionStay;
}

export interface VoucherPDFProps {
  payload: VoucherPayload;
}

export function VoucherPDF({ payload }: VoucherPDFProps) {
  const locale = payload.locale as Locale;
  const L = VOUCHER_LABELS[locale];
  const fonts = pickFonts(locale);
  const T = (s: string) => tx(s, fonts.rtl);
  const lineTotal = payload.qty * payload.unitPrice;
  const childrenQty = payload.childrenQty ?? 0;
  const childrenUnitPrice = payload.childrenUnitPrice ?? 0;
  const childrenTotal = childrenQty * childrenUnitPrice;
  const singleRoomQty = payload.singleRoomQty ?? 0;
  const singleRoomUnitPrice = payload.singleRoomUnitPrice ?? 0;
  const singleRoomTotal = singleRoomQty * singleRoomUnitPrice;
  const grandTotal = lineTotal + childrenTotal + singleRoomTotal;
  const symbol = CURRENCY_SYMBOL[payload.currency];

  return (
    <Document title={`Sabrina Voucher ${payload.voucherNumber}`}>
      <Page
        size="A4"
        style={{
          backgroundColor: COLOR.ivory,
          fontFamily: fonts.body,
          color: COLOR.text,
          position: "relative",
        }}
      >
        {/* Hairline gold frame, 10mm inset */}
        <View
          style={{
            position: "absolute",
            top: mm(10),
            left: mm(10),
            right: mm(10),
            bottom: mm(10),
            borderWidth: 0.6,
            borderColor: "rgba(176,137,71,0.45)",
          }}
          fixed
        />
        {/* Corner ticks */}
        <View
          style={{
            position: "absolute",
            top: mm(10) - 1,
            left: mm(10) - 1,
            width: 14,
            height: 14,
            borderTopWidth: 0.8,
            borderLeftWidth: 0.8,
            borderColor: COLOR.gold,
          }}
          fixed
        />
        <View
          style={{
            position: "absolute",
            bottom: mm(10) - 1,
            right: mm(10) - 1,
            width: 14,
            height: 14,
            borderBottomWidth: 0.8,
            borderRightWidth: 0.8,
            borderColor: COLOR.gold,
          }}
          fixed
        />

        {/* Content. No `height: 100%` — let react-pdf paginate if a voucher
            ever overflows. Frame, corner ticks, and page number have `fixed`
            so they repeat on each generated page. */}
        <View
          style={{
            paddingTop: mm(14),
            paddingHorizontal: mm(16),
            paddingBottom: mm(7),
            flexDirection: "column",
            minHeight: "100%",
          }}
        >
          {/* ===== HEADER ===== */}
          <View
            wrap={false}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingBottom: mm(4),
              borderBottomWidth: 0.6,
              borderBottomColor: COLOR.rule,
            }}
          >
            <View style={{ flexDirection: "column", gap: mm(2) }}>
              <Image src={LOGO_DARK} style={{ height: mm(12), width: mm(40), objectFit: "contain" }} />
              <Text style={{ fontFamily: fonts.body, fontSize: 7.5, letterSpacing: ls(2.4, fonts.rtl), color: COLOR.muted, fontWeight: 500, textTransform: "uppercase" }}>
                {T(L.tag)}
              </Text>
            </View>

            <View style={{ flexDirection: "column", alignItems: "flex-end", gap: mm(2) }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: ls(3.6, fonts.rtl), color: COLOR.muted, textTransform: "uppercase" }}>
                {T(L.docLabel)}
              </Text>
              <Text style={{ fontFamily: fonts.display, fontSize: 28, letterSpacing: ls(9, fonts.rtl), color: COLOR.ink, lineHeight: 1 }}>
                {T(L.docTitle)}
              </Text>
              <Text style={{ fontFamily: FONT.mono, fontSize: 8.5, color: COLOR.gold, letterSpacing: 1.6, marginTop: mm(1) }}>
                № {payload.voucherNumber}
              </Text>
            </View>
          </View>

          {/* ===== META RIBBON (navy) ===== */}
          <View
            wrap={false}
            style={{
              marginTop: mm(3),
              flexDirection: "row",
              backgroundColor: COLOR.ink,
              position: "relative",
            }}
          >
            {/* Top + bottom gold hairlines */}
            <View style={{ position: "absolute", left: 0, right: 0, top: mm(2), height: 0.5, backgroundColor: COLOR.gold, opacity: 0.55 }} />
            <View style={{ position: "absolute", left: 0, right: 0, bottom: mm(2), height: 0.5, backgroundColor: COLOR.gold, opacity: 0.55 }} />
            <RibbonCell k={T(L.voucherNo)} v={payload.voucherNumber} mono fonts={fonts} />
            <RibbonCell k={T(L.invoiceDate)} v={T(fmtDate(payload.invoiceDate, locale))} fonts={fonts} />
            <RibbonCell k={T(L.accountPayment)} v={T(payload.paymentMethod)} fonts={fonts} last />
          </View>

          {/* ===== SECTION 01 · GUESTS ===== */}
          <SectionHead num="01" name={T(L.sectionGuests)} fonts={fonts} />
          <GuestsGrid guests={payload.guests} L={L} fonts={fonts} T={T} />

          {/* ===== SECTION 02 · STAY (variant by voucherType) ===== */}
          <View wrap={false}>
          <SectionHead num="02" name={T(staySectionLabel(payload.voucherType, L))} fonts={fonts} />
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0.5,
              borderColor: COLOR.rule,
              backgroundColor: "rgba(255,255,255,0.35)",
            }}
          >
            {(payload.voucherType === "group" || payload.voucherType === "custom" || payload.voucherType === "hotel") && (
              <>
                <StayCell
                  k={T(L.checkIn)}
                  v={T(fmtDate(payload.checkIn, locale))}
                  sub={T(buildStaySub(weekday(payload.checkIn, locale), payload.checkInTime, L.fromTime))}
                  fonts={fonts}
                />
                <StayArrow />
                <StayCell
                  k={T(L.checkOut)}
                  v={T(fmtDate(payload.checkOut, locale))}
                  sub={T(buildStaySub(weekday(payload.checkOut, locale), payload.checkOutTime, L.byTime))}
                  fonts={fonts}
                  align="center"
                />
                <StayArrow />
                <StayCell
                  k={T(L.duration)}
                  v={T(payload.durationLabel)}
                  sub={T(payload.packageName)}
                  fonts={fonts}
                  align="right"
                  valueGold
                />
              </>
            )}

            {payload.voucherType === "daily" && (
              <>
                <StayCell
                  k={T(L.tourDate)}
                  v={T(fmtDate(payload.tourDate, locale))}
                  sub={T(weekday(payload.tourDate, locale))}
                  fonts={fonts}
                />
                <StayArrow />
                <StayCell
                  k={T(L.tourTime)}
                  v={T(buildTimeRange(payload.tourStartTime, payload.tourEndTime))}
                  sub={T(payload.packageName)}
                  fonts={fonts}
                  align="right"
                  valueGold
                />
              </>
            )}

            {payload.voucherType === "transfer" && (
              <>
                <StayCell
                  k={T(L.pickup)}
                  v={T(payload.pickupLocation)}
                  sub={T(buildTransferSub(payload.pickupDate, payload.pickupTime, locale))}
                  fonts={fonts}
                />
                <StayArrow />
                <StayCell
                  k={T(L.dropoff)}
                  v={T(payload.dropoffLocation)}
                  sub={T(buildTransferSub(payload.dropoffDate, payload.dropoffTime, locale))}
                  fonts={fonts}
                  align="right"
                />
              </>
            )}
          </View>
          </View>

          {/* ===== SECTION 03 · PRICE ===== */}
          <SectionHead num="03" name={T(L.sectionPrice)} fonts={fonts} />
          <PriceTable
            L={L}
            fonts={fonts}
            T={T}
            itemName={T(payload.packageName)}
            descriptor={T(payload.itemDescriptor ?? "")}
            qty={payload.qty}
            unitPrice={fmtMoney(payload.unitPrice, payload.currency)}
            totalPrice={fmtMoney(lineTotal, payload.currency)}
            addons={[
              ...(childrenQty > 0
                ? [{
                    label: T(L.children),
                    qty: childrenQty,
                    unitPrice: fmtMoney(childrenUnitPrice, payload.currency),
                    totalPrice: fmtMoney(childrenTotal, payload.currency),
                  }]
                : []),
              ...(singleRoomQty > 0
                ? [{
                    label: T(L.singleRoom),
                    qty: singleRoomQty,
                    unitPrice: fmtMoney(singleRoomUnitPrice, payload.currency),
                    totalPrice: fmtMoney(singleRoomTotal, payload.currency),
                  }]
                : []),
            ]}
            subtotalPrice={fmtMoney(grandTotal, payload.currency)}
            currency={payload.currency}
            symbol={symbol}
          />

          {/* ===== PAYMENT NOTE ===== */}
          <View
            wrap={false}
            style={{
              marginTop: mm(2.5),
              paddingTop: mm(2.5),
              paddingBottom: mm(5),
              paddingHorizontal: mm(6),
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: COLOR.gold,
              backgroundColor: "rgba(176,137,71,0.06)",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.display,
                fontStyle: locale === "ar" ? "normal" : "italic",
                fontSize: 12,
                color: COLOR.ink,
                lineHeight: 1.18,
                textAlign: "center",
              }}
            >
              {/* ornamental ✶ was removed — it's U+2736 (Six-Pointed Black Star)
                  which neither Fraunces nor IBM Plex Sans Arabic carry as a
                  glyph; both fonts fell back to a substitute that read as "6"
                  or "." inside Arabic vouchers. The gold border band and the
                  italic body already give the note enough visual weight. */}
              {T(payload.paymentNote)}
            </Text>
          </View>

          {/* ===== FOOTER ===== */}
          <View
            wrap={false}
            style={{
              marginTop: mm(1),
              paddingVertical: mm(3),
              paddingHorizontal: mm(5),
              backgroundColor: COLOR.ink,
              flexDirection: "row",
              gap: mm(6),
              position: "relative",
            }}
          >
            <View style={{ position: "absolute", left: mm(5), right: mm(5), top: mm(1.2), height: 0.5, backgroundColor: COLOR.gold, opacity: 0.55 }} />
            <View style={{ position: "absolute", left: mm(5), right: mm(5), bottom: mm(1.2), height: 0.5, backgroundColor: COLOR.gold, opacity: 0.55 }} />

            <View style={{ flex: 1.2, flexDirection: "column" }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 6.5, letterSpacing: ls(2.4, fonts.rtl), color: COLOR.goldSoft, fontWeight: 600, textTransform: "uppercase", marginBottom: mm(2.5) }}>
                {T(L.reachUs)}
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 8.5, color: COLOR.ivory, lineHeight: 1.5 }}>
                {T("Sabrina Turizm")}
                {"\n"}
                {T("Taksim, Istanbul · Türkiye")}
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 8.5, color: COLOR.ivory, lineHeight: 1.5, marginTop: mm(1.5) }}>
                {T("WhatsApp · +90 531 896 5134")}
                {"\n"}
                info@sabrinaturizm.com
              </Text>
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 6.5, letterSpacing: ls(2.4, fonts.rtl), color: COLOR.goldSoft, fontWeight: 600, textTransform: "uppercase", marginBottom: mm(2.5) }}>
                {T(L.withOurThanks)}
              </Text>
              <Text style={{ fontFamily: fonts.display, fontStyle: locale === "ar" ? "normal" : "italic", fontSize: 11, color: COLOR.ivory, lineHeight: 1.3 }}>
                {T(payload.footerThanks)}
              </Text>
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontStyle: locale === "ar" ? "normal" : "italic",
                  fontSize: 22,
                  color: COLOR.goldSoft,
                  lineHeight: 1,
                  paddingTop: mm(3),
                  paddingBottom: mm(1),
                  borderBottomWidth: 0.5,
                  borderBottomColor: COLOR.gold,
                  alignSelf: "flex-start",
                  paddingRight: mm(10),
                }}
              >
                Sabrina
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 7.5, color: COLOR.goldSoft, marginTop: mm(1.5) }}>
                {T(L.director)}
              </Text>
            </View>
          </View>
        </View>

        {/* Corner marks */}
        <Text
          style={{
            position: "absolute",
            left: mm(16),
            bottom: mm(8),
            fontFamily: fonts.body,
            fontSize: 6,
            letterSpacing: ls(2.5, fonts.rtl),
            color: COLOR.muted2,
            textTransform: "uppercase",
          }}
          fixed
        >
          {T(L.cornerMark)}
        </Text>
        <Text
          style={{
            position: "absolute",
            right: mm(16),
            bottom: mm(8),
            fontFamily: FONT.mono,
            fontSize: 6.5,
            letterSpacing: 0.6,
            color: COLOR.muted2,
          }}
          fixed
          render={({ pageNumber, totalPages }) =>
            `${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`
          }
        />
      </Page>
    </Document>
  );
}

// ---------- helpers ----------

type FontsArg = { display: string; body: string; mono: string; rtl: boolean };

function RibbonCell({
  k,
  v,
  mono,
  last,
  fonts,
}: {
  k: string;
  v: string;
  mono?: boolean;
  last?: boolean;
  fonts: FontsArg;
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: mm(3.5),
        paddingHorizontal: mm(6),
        borderRightWidth: last ? 0 : 0.4,
        borderRightColor: "rgba(200,165,101,0.35)",
        flexDirection: "column",
        gap: mm(1.5),
      }}
    >
      <Text style={{ fontFamily: fonts.body, fontSize: 6.8, letterSpacing: ls(2.4, fonts.rtl), color: COLOR.goldSoft, fontWeight: 500, textTransform: "uppercase" }}>
        {k}
      </Text>
      <Text
        style={
          mono
            ? { fontFamily: FONT.mono, fontSize: 11, color: COLOR.ivory, letterSpacing: 0.4 }
            : { fontFamily: fonts.display, fontSize: 13, color: COLOR.ivory, lineHeight: 1.05 }
        }
      >
        {v}
      </Text>
    </View>
  );
}

function SectionHead({ num, name, fonts }: { num: string; name: string; fonts: FontsArg }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: mm(4), marginTop: mm(3), marginBottom: mm(2) }}>
      <Text style={{ fontFamily: FONT.mono, fontSize: 7.5, color: COLOR.gold, letterSpacing: 0.7 }}>{num}</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: ls(3, fonts.rtl), color: COLOR.ink, fontWeight: 600, textTransform: "uppercase" }}>
        {name}
      </Text>
      <View style={{ flex: 1, height: 0, borderTopWidth: 0.5, borderTopColor: COLOR.rule }} />
    </View>
  );
}

const ROMAN = ["i.", "ii.", "iii.", "iv.", "v.", "vi.", "vii.", "viii.", "ix.", "x."];

function GuestsGrid({
  guests,
  L,
  fonts,
  T,
}: {
  guests: VoucherPayload["guests"];
  L: (typeof VOUCHER_LABELS)[Locale];
  fonts: FontsArg;
  T: (s: string) => string;
}) {
  // Flex grid — cards squeeze together to fit in a row, wrap when crammed.
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: mm(4) }}>
      {guests.map((g, i) => {
        const nameParts = g.name.split(/\s+/);
        const first = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(" ");
        const last = nameParts.slice(Math.ceil(nameParts.length / 2)).join(" ");
        return (
          <View
            key={i}
            wrap={false}
            style={{
              flexGrow: 1,
              flexBasis: mm(55),
              maxWidth: mm(90),
              borderWidth: 0.5,
              borderColor: COLOR.rule,
              backgroundColor: "rgba(255,255,255,0.35)",
              paddingVertical: mm(4),
              paddingHorizontal: mm(4),
              flexDirection: "column",
              gap: mm(2.5),
              position: "relative",
            }}
          >
            <Text
              style={{
                position: "absolute",
                top: mm(4),
                right: mm(5),
                fontFamily: fonts.display,
                fontSize: 14,
                color: COLOR.gold,
                fontStyle: "italic",
              }}
            >
              {ROMAN[i] ?? `${i + 1}.`}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 6.5, letterSpacing: ls(2.8, fonts.rtl), color: COLOR.muted, textTransform: "uppercase" }}>
              {T(g.role)}
            </Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 15, color: COLOR.ink, lineHeight: 1.05 }}>
              {T(first)}
              {last ? `\n${T(last)}` : ""}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: mm(3),
                paddingTop: mm(3),
                borderTopWidth: 0.4,
                borderTopColor: COLOR.rule,
                borderStyle: "dashed",
              }}
            >
              <View style={{ flex: 1, flexDirection: "column", gap: mm(1.5) }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 6.5, letterSpacing: ls(2.2, fonts.rtl), color: COLOR.muted, textTransform: "uppercase" }}>
                  {T(L.dateOfBirth)}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: COLOR.ink, letterSpacing: 0.4 }}>{fmtDateDots(g.dateOfBirth)}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "column", gap: mm(1.5) }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 6.5, letterSpacing: ls(2.2, fonts.rtl), color: COLOR.muted, textTransform: "uppercase" }}>
                  {T(L.passport)}
                </Text>
                <Text style={{ fontFamily: FONT.mono, fontSize: 9, color: COLOR.ink, letterSpacing: 0.4 }}>{g.passport}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function StayCell({
  k,
  v,
  sub,
  fonts,
  align = "left",
  valueGold,
}: {
  k: string;
  v: string;
  sub: string;
  fonts: FontsArg;
  align?: "left" | "center" | "right";
  valueGold?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: mm(3.5),
        paddingHorizontal: mm(5),
        flexDirection: "column",
        gap: mm(1.5),
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <Text style={{ fontFamily: fonts.body, fontSize: 6.5, letterSpacing: ls(2.8, fonts.rtl), color: COLOR.muted, textTransform: "uppercase" }}>
        {k}
      </Text>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 14,
          color: valueGold ? COLOR.gold : COLOR.ink,
          fontStyle: valueGold ? "italic" : "normal",
          lineHeight: 1.05,
        }}
      >
        {v}
      </Text>
      {sub ? (
        <Text style={{ fontFamily: fonts.body, fontSize: 7.5, color: COLOR.muted, letterSpacing: ls(0.2, fonts.rtl) }}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

function StayArrow() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: mm(2) }}>
      <Text style={{ fontFamily: FONT.display, fontSize: 16, color: COLOR.gold, fontStyle: "italic" }}>→</Text>
    </View>
  );
}

type PriceAddon = { label: string; qty: number; unitPrice: string; totalPrice: string };

function PriceTable({
  L,
  fonts,
  T,
  itemName,
  descriptor,
  qty,
  unitPrice,
  totalPrice,
  addons,
  subtotalPrice,
  currency,
  symbol,
}: {
  L: (typeof VOUCHER_LABELS)[Locale];
  fonts: FontsArg;
  T: (s: string) => string;
  itemName: string;
  descriptor: string;
  qty: number;
  unitPrice: string;
  totalPrice: string;
  addons: PriceAddon[];
  subtotalPrice: string;
  currency: string;
  symbol: string;
}) {
  const COL_QTY = mm(20);
  const COL_UNIT = mm(34);
  const COL_TOTAL = mm(38);
  const colDivider = { borderRightWidth: 0.4, borderRightColor: COLOR.rule } as const;

  return (
    <View
      style={{
        borderWidth: 0.6,
        borderColor: COLOR.rule,
        backgroundColor: "rgba(255,255,255,0.45)",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLOR.ivoryAlt,
          borderBottomWidth: 0.6,
          borderBottomColor: COLOR.rule,
        }}
      >
        <View style={[{ flex: 1, paddingVertical: mm(2.5) }, colDivider]}>
          <Text style={priceTh(fonts)}>{T(L.item)}</Text>
        </View>
        <View style={[{ width: COL_QTY, paddingVertical: mm(2.5) }, colDivider]}>
          <Text style={[priceTh(fonts), { textAlign: "center" }]}>{T(L.qty)}</Text>
        </View>
        <View style={[{ width: COL_UNIT, paddingVertical: mm(2.5) }, colDivider]}>
          <Text style={[priceTh(fonts), { textAlign: "right" }]}>{T(L.unitPrice)}</Text>
        </View>
        <View style={{ width: COL_TOTAL, paddingVertical: mm(2.5) }}>
          <Text style={[priceTh(fonts), { textAlign: "right" }]}>{T(L.total)}</Text>
        </View>
      </View>

      {/* Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          borderBottomWidth: 0.5,
          borderBottomColor: COLOR.rule,
        }}
      >
        <View style={[{ flex: 1, paddingVertical: mm(4.5), paddingHorizontal: mm(4), justifyContent: "center" }, colDivider]}>
          <Text style={{ fontFamily: fonts.display, fontSize: 13, color: COLOR.ink }}>{itemName}</Text>
          {descriptor ? (
            <Text style={{ fontFamily: fonts.body, fontSize: 7.5, color: COLOR.muted, marginTop: mm(1), letterSpacing: ls(0.2, fonts.rtl) }}>
              {descriptor}
            </Text>
          ) : null}
        </View>
        <View style={[{ width: COL_QTY, paddingVertical: mm(4.5), justifyContent: "center" }, colDivider]}>
          <Text style={[priceTdMono, { textAlign: "center" }]}>{qty}</Text>
        </View>
        <View style={[{ width: COL_UNIT, paddingVertical: mm(4.5), justifyContent: "center" }, colDivider]}>
          <Text style={[priceTdMono, { textAlign: "right" }]}>{unitPrice}</Text>
        </View>
        <View style={{ width: COL_TOTAL, paddingVertical: mm(4.5), justifyContent: "center" }}>
          <Text style={[priceTdMono, { textAlign: "right" }]}>{totalPrice}</Text>
        </View>
      </View>

      {/* Add-on rows (children, single room occupancy) */}
      {addons.map((a, idx) => (
        <View
          key={idx}
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            borderBottomWidth: 0.5,
            borderBottomColor: COLOR.rule,
          }}
        >
          <View style={[{ flex: 1, paddingVertical: mm(3.5), paddingHorizontal: mm(4), justifyContent: "center" }, colDivider]}>
            <Text style={{ fontFamily: fonts.display, fontSize: 12, color: COLOR.ink }}>{a.label}</Text>
          </View>
          <View style={[{ width: COL_QTY, paddingVertical: mm(3.5), justifyContent: "center" }, colDivider]}>
            <Text style={[priceTdMono, { textAlign: "center" }]}>{a.qty}</Text>
          </View>
          <View style={[{ width: COL_UNIT, paddingVertical: mm(3.5), justifyContent: "center" }, colDivider]}>
            <Text style={[priceTdMono, { textAlign: "right" }]}>{a.unitPrice}</Text>
          </View>
          <View style={{ width: COL_TOTAL, paddingVertical: mm(3.5), justifyContent: "center" }}>
            <Text style={[priceTdMono, { textAlign: "right" }]}>{a.totalPrice}</Text>
          </View>
        </View>
      ))}

      {/* Subtotal */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          borderBottomWidth: 0.5,
          borderBottomColor: COLOR.rule,
          backgroundColor: "rgba(176,137,71,0.04)",
        }}
      >
        <View style={[{ flex: 1, paddingVertical: mm(3), paddingHorizontal: mm(4), justifyContent: "center" }, colDivider]}>
          <Text style={priceTh(fonts)}>{T(L.subtotal)}</Text>
        </View>
        <View style={[{ width: COL_QTY, paddingVertical: mm(3) }, colDivider]} />
        <View style={[{ width: COL_UNIT, paddingVertical: mm(3) }, colDivider]} />
        <View style={{ width: COL_TOTAL, paddingVertical: mm(3), justifyContent: "center" }}>
          <Text style={[priceTdMono, { textAlign: "right" }]}>{subtotalPrice}</Text>
        </View>
      </View>

      {/* Grand Total band (navy) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: COLOR.ink,
          paddingVertical: mm(4),
          paddingHorizontal: mm(5),
          position: "relative",
        }}
      >
        <View style={{ position: "absolute", left: mm(3), right: mm(3), top: mm(1.4), height: 0.5, backgroundColor: COLOR.gold, opacity: 0.55 }} />
        <View style={{ position: "absolute", left: mm(3), right: mm(3), bottom: mm(1.4), height: 0.5, backgroundColor: COLOR.gold, opacity: 0.55 }} />
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: ls(3.2, fonts.rtl), color: COLOR.ivory, fontWeight: 600, textTransform: "uppercase" }}>
            {T(L.grandTotal)}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: ls(3.2, fonts.rtl), color: COLOR.goldSoft, fontWeight: 500, textTransform: "uppercase" }}>
            · {currency}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.display, fontSize: 28, color: COLOR.ivory, lineHeight: 1 }}>
          <Text style={{ color: COLOR.goldSoft }}>{symbol} </Text>
          {subtotalPrice.replace(`${symbol} `, "")}
        </Text>
      </View>
    </View>
  );
}

function priceTh(fonts: FontsArg) {
  return {
    fontFamily: fonts.body,
    fontSize: 7,
    letterSpacing: ls(2.4, fonts.rtl),
    color: COLOR.muted,
    fontWeight: 500 as const,
    textTransform: "uppercase" as const,
    paddingHorizontal: mm(4),
  };
}

const priceTdMono = {
  fontFamily: FONT.mono,
  fontSize: 10.5,
  color: COLOR.ink,
  letterSpacing: 0.4,
  paddingHorizontal: mm(4),
};
