import React from "react";
import path from "node:path";
import {
  Document, Page, View, Text, Image,
  Svg, Polygon,
} from "@react-pdf/renderer";
import type { DailyPackage } from "@/lib/daily/types";
import { registerFonts } from "@/lib/pdf/fonts";
import { C, MARGIN, getFontsForLocale, upper, type FontSet } from "@/lib/pdf/theme";
import { visualRTL } from "@/lib/pdf/rtl";
import { PdfIcon } from "@/lib/pdf/icons";

const LOGO_LIGHT = path.join(process.cwd(), "public/logo_1_sabrina_cropped.png");
const LOGO_DARK = path.join(process.cwd(), "public/logo_2_sabrina_cropped.png");

registerFonts();

function tx(text: string, rtl: boolean): string {
  return rtl ? visualRTL(text) : text;
}

function ds(size: number, scale: number): number {
  return Math.round(size * scale);
}

const PW = 595;
const HERO_H = 310;
const CUT_RISE = 32;
const HERO_PADDING_TOP = HERO_H + CUT_RISE + 4;

function abs(src: string, base: string) { return src.startsWith("http") ? src : `${base}${src}`; }

function Wordmark({ light = false }: { light?: boolean }) {
  return <Image src={light ? LOGO_LIGHT : LOGO_DARK} style={{ width: 80, height: 28, objectFit: "contain" }} />;
}

function Mono({ children, style = {}, fonts }: { children: React.ReactNode; style?: object; fonts: FontSet }) {
  return <Text style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: 9, letterSpacing: 1.4, color: C.inkSoft, ...style }}>{children}</Text>;
}

function PageFooter({ left, page, total, fonts }: { left: string; page: number; total: number; fonts: FontSet }) {
  return (
    <View style={{ position: "absolute", bottom: 32, left: MARGIN, right: MARGIN, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 10 }}>
      <Mono style={{ color: C.inkSoft }} fonts={fonts}>{upper(left)}</Mono>
      <Wordmark />
      <Mono style={{ color: C.inkSoft }} fonts={fonts}>{`${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</Mono>
    </View>
  );
}

function HeroBlock({ heroSrc, fonts }: { heroSrc: string; fonts: FontSet }) {
  return (
    <>
      <Image src={heroSrc} style={{ position: "absolute", top: 0, left: 0, width: PW, height: HERO_H, objectFit: "cover" }} />
      <View style={{ position: "absolute", top: 28, left: MARGIN }}>
        <Wordmark light />
      </View>
      <Svg width={PW} height={CUT_RISE + 8} style={{ position: "absolute", top: HERO_H - 8, left: 0 }}>
        <Polygon points={`0,${CUT_RISE + 8} ${PW},8 ${PW},0 0,${CUT_RISE}`} fill={C.ochre} />
      </Svg>
      <Svg width={PW} height={CUT_RISE + 4} style={{ position: "absolute", top: HERO_H + CUT_RISE - 4, left: 0 }}>
        <Polygon points={`0,0 ${PW},0 ${PW},${CUT_RISE + 4} 0,${CUT_RISE + 4}`} fill={C.creamDeep} />
      </Svg>
    </>
  );
}

function fmtPrice(amount: number, currency: string): string {
  const code = (currency || "USD").toUpperCase();
  const symbol = code === "USD" ? "$" : code === "EUR" ? "€" : code === "GBP" ? "£" : "";
  const num = Math.round(amount).toLocaleString("en-US");
  return symbol ? `${symbol}${num}` : `${code} ${num}`;
}

interface Props { pkg: DailyPackage; waPhone?: string; baseUrl?: string; locale?: string }

export function DailyPackagePDF({ pkg, waPhone = "", baseUrl = "", locale = "en" }: Props) {
  const fonts = getFontsForLocale(locale);
  const heroSrc = abs(pkg.heroImage, baseUrl);

  const kicker = pkg.season
    ? `${upper(pkg.region)} · DAILY PACKAGE · ${upper(pkg.season)}`
    : `${upper(pkg.region)} · DAILY PACKAGE`;

  const facts: Array<{ k: string; v: string; icon: string | null }> = [
    { k: "Timeframe", v: `${pkg.startTime} – ${pkg.endTime}`, icon: "clock" },
    { k: "Region",    v: pkg.region, icon: "map-pin" },
  ];
  if (pkg.season) {
    facts.push({ k: "Season", v: pkg.season, icon: "compass" });
  }
  facts.push(
    { k: "Price",   v: `${pkg.currency} ${pkg.price.toLocaleString()}`, icon: "wallet" },
    { k: "Vehicle", v: pkg.vehicle, icon: "car-front" },
  );
  const factCount = facts.length;

  const pricing = pkg.pricing;
  const pricingRowsAll: Array<{ icon: string; label: string; value: number | null | undefined }> = pricing
    ? [
        { icon: "user",    label: "Solo",      value: pricing.onePerson },
        { icon: "users",   label: "2 people",  value: pricing.twoPeople },
        { icon: "users-3", label: "3 people",  value: pricing.threePeople },
        { icon: "baby",    label: "Baby",      value: pricing.baby },
      ]
    : [];
  const pricingRows = pricingRowsAll.filter(
    (r): r is { icon: string; label: string; value: number } => r.value != null,
  );

  return (
    <Document title={pkg.name} author="Sabrina Turizm">
      {/* Cover */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: fonts.body, paddingTop: HERO_PADDING_TOP }}>
        <HeroBlock heroSrc={heroSrc} fonts={fonts} />
        <View style={{ paddingHorizontal: MARGIN, paddingTop: 20 }}>
          <Mono style={{ color: C.ochre, marginBottom: 10 }} fonts={fonts}>{kicker}</Mono>
          <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(54, fonts.displayScale), lineHeight: 1.1, color: C.ink }}>{tx(pkg.name, fonts.rtl)}</Text>
          <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 300, fontSize: ds(17, fonts.displayScale), lineHeight: 1.5, color: C.inkSoft, marginTop: 8 }}>{tx(pkg.shortDescription, fonts.rtl)}</Text>
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 24, flexDirection: "row", backgroundColor: C.navy }}>
          {facts.map((f, i) => (
            <View key={i} style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 14, borderRightWidth: i < factCount - 1 ? 1 : 0, borderRightColor: C.navySoft }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 4 }}>
                {f.icon ? <PdfIcon name={f.icon} size={9} color={C.ochre} /> : null}
                <Mono style={{ color: C.ochre }} fonts={fonts}>{f.k.toUpperCase()}</Mono>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.cream, lineHeight: 1.5 }}>{f.v}</Text>
            </View>
          ))}
        </View>
        {waPhone ? (
          <View style={{ position: "absolute", bottom: 72, left: MARGIN }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 10, color: C.inkSoft }}>{`WhatsApp ${waPhone}  ·  sabrinaturizm.com`}</Text>
          </View>
        ) : null}
        <PageFooter left="Sabrina Turizm" page={1} total={2} fonts={fonts} />
      </Page>

      {/* Schedule + Inclusions */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: fonts.body }}>
        <View style={{ backgroundColor: C.navy, paddingHorizontal: MARGIN, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Mono style={{ color: C.cream }} fonts={fonts}>{tx(pkg.name, fonts.rtl)}</Mono>
          <Wordmark />
        </View>
        <View style={{ paddingHorizontal: MARGIN, paddingTop: 26 }}>
          <Mono style={{ color: C.ochre, marginBottom: 8 }} fonts={fonts}>DAY ITINERARY</Mono>
          <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(46, fonts.displayScale), lineHeight: 1.1, color: C.ink }}>The schedule.</Text>
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 20 }}>
          {pkg.stops.map((stop, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.rule, borderBottomWidth: i === pkg.stops.length - 1 ? 1 : 0, borderBottomColor: C.rule }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === 0 || i === pkg.stops.length - 1 ? C.ochre : C.rule, marginTop: 7, marginRight: 18 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(19, fonts.displayScale), color: C.ink, lineHeight: 1.2 }}>{tx(stop.place, fonts.rtl)}</Text>
                {stop.description ? (
                  <Text style={{ fontFamily: fonts.body, fontSize: ds(10, fonts.displayScale), color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>{tx(stop.description, fonts.rtl)}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 24, flexDirection: "row", gap: 32 }}>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.ochre, paddingBottom: 8, marginBottom: 12 }}>
              <Mono style={{ color: C.ochre }} fonts={fonts}>INCLUDED</Mono>
            </View>
            {pkg.included.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                <View style={{ width: 16, flexDirection: "row", alignItems: "center" }}>
                  <PdfIcon name={it.icon ?? "circle-plus"} size={11} color={C.ochre} />
                </View>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.ink, flex: 1, lineHeight: 1.45 }}>{tx(it.text, fonts.rtl)}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.rule, paddingBottom: 8, marginBottom: 12 }}>
              <Mono style={{ color: C.inkSoft }} fonts={fonts}>NOT INCLUDED</Mono>
            </View>
            {pkg.notIncluded.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                <View style={{ width: 16, flexDirection: "row", alignItems: "center" }}>
                  <PdfIcon name={it.icon ?? "circle-minus"} size={11} color={C.inkSoft} />
                </View>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.inkSoft, flex: 1, lineHeight: 1.45 }}>{tx(it.text, fonts.rtl)}</Text>
              </View>
            ))}
          </View>
        </View>
        {pricingRows.length > 0 ? (
          <View style={{ marginHorizontal: MARGIN, marginTop: 22 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.ochre, paddingBottom: 6, marginBottom: 8 }}>
              <Mono style={{ color: C.ochre }} fonts={fonts}>{`GROUP RATES — PER PERSON (${(pkg.currency ?? "USD").toUpperCase()})`}</Mono>
            </View>
            <View style={{ flexDirection: "row", gap: 1, backgroundColor: C.rule }}>
              {pricingRows.map((row, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: C.cream, alignItems: "center", paddingVertical: 14, paddingHorizontal: 8, gap: 6 }}>
                  <PdfIcon name={row.icon} size={18} color={C.ochre} />
                  <Text style={{ fontFamily: fonts.body, fontSize: 9, color: C.inkSoft, textAlign: "center", letterSpacing: 0.6 }}>{upper(row.label)}</Text>
                  <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 14, color: C.ink, textAlign: "center" }}>{fmtPrice(row.value, pkg.currency ?? "USD")}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        {waPhone ? (
          <View style={{ marginHorizontal: MARGIN, marginTop: 24, backgroundColor: C.navy, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 300, fontSize: 14, color: C.cream, lineHeight: 1.4 }}>
              No payment now — confirm only when ready.
            </Text>
            <View style={{ backgroundColor: C.ochre, paddingVertical: 8, paddingHorizontal: 14 }}>
              <Text style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.2, color: C.navy }}>{`WHATSAPP · ${waPhone}`}</Text>
            </View>
          </View>
        ) : null}
        <PageFooter left="Itinerary & inclusions" page={2} total={2} fonts={fonts} />
      </Page>
    </Document>
  );
}
