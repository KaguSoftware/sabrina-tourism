import React from "react";
import {
  Document, Page, View, Text, Image,
  Svg, Polygon,
} from "@react-pdf/renderer";
import type { DailyPackage } from "@/lib/daily/types";
import { registerFonts } from "@/lib/pdf/fonts";
import { C, MARGIN, getFontsForLocale, type FontSet } from "@/lib/pdf/theme";
import { visualRTL } from "@/lib/pdf/rtl";

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

function Wordmark({ light = false, fonts }: { light?: boolean; fonts: FontSet }) {
  return <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 13, color: light ? C.cream : C.ochre, letterSpacing: 0.5 }}>SABRINA TURIZM</Text>;
}

function Mono({ children, style = {}, fonts }: { children: React.ReactNode; style?: object; fonts: FontSet }) {
  return <Text style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.4, color: C.inkSoft, ...style }}>{children}</Text>;
}

function PageFooter({ left, page, total, fonts }: { left: string; page: number; total: number; fonts: FontSet }) {
  return (
    <View style={{ position: "absolute", bottom: 32, left: MARGIN, right: MARGIN, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 10 }}>
      <Mono style={{ color: C.inkSoft }} fonts={fonts}>{left.toUpperCase()}</Mono>
      <Wordmark fonts={fonts} />
      <Mono style={{ color: C.inkSoft }} fonts={fonts}>{`${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</Mono>
    </View>
  );
}

function HeroBlock({ heroSrc, fonts }: { heroSrc: string; fonts: FontSet }) {
  return (
    <>
      <Image src={heroSrc} style={{ position: "absolute", top: 0, left: 0, width: PW, height: HERO_H, objectFit: "cover" }} />
      <View style={{ position: "absolute", top: 28, left: MARGIN }}>
        <Wordmark light fonts={fonts} />
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

const NOT_INCLUDED = ["Hotel accommodation", "Breakfast"];

interface Props { pkg: DailyPackage; waPhone?: string; baseUrl?: string; locale?: string }

export function DailyPackagePDF({ pkg, waPhone = "", baseUrl = "", locale = "en" }: Props) {
  const fonts = getFontsForLocale(locale);
  const heroSrc = abs(pkg.heroImage, baseUrl);

  return (
    <Document title={pkg.name} author="Sabrina Turizm">
      {/* Cover */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: fonts.body, paddingTop: HERO_PADDING_TOP }}>
        <HeroBlock heroSrc={heroSrc} fonts={fonts} />
        <View style={{ paddingHorizontal: MARGIN, paddingTop: 20 }}>
          <Mono style={{ color: C.ochre, marginBottom: 10 }} fonts={fonts}>{`${pkg.region.toUpperCase()} · DAILY PACKAGE`}</Mono>
          <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(54, fonts.displayScale), lineHeight: 1.1, color: C.ink }}>{tx(pkg.name, fonts.rtl)}</Text>
          <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 300, fontSize: ds(17, fonts.displayScale), lineHeight: 1.5, color: C.inkSoft, marginTop: 8 }}>{tx(pkg.shortDescription, fonts.rtl)}</Text>
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 24, flexDirection: "row", backgroundColor: C.navy }}>
          {[
            { k: "Timeframe", v: `${pkg.startTime} – ${pkg.endTime}` },
            { k: "Region",    v: pkg.region },
            { k: "Price",     v: `${pkg.currency} ${pkg.price.toLocaleString()}` },
            { k: "Vehicle",   v: pkg.vehicle },
          ].map((f, i) => (
            <View key={i} style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 14, borderRightWidth: i < 3 ? 1 : 0, borderRightColor: C.navySoft }}>
              <Mono style={{ color: C.ochre, marginBottom: 6 }} fonts={fonts}>{f.k.toUpperCase()}</Mono>
              <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 13, color: C.cream, lineHeight: 1.2 }}>{f.v}</Text>
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
          <Wordmark fonts={fonts} />
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
              <View key={i} style={{ flexDirection: "row", paddingVertical: 5 }}>
                <Text style={{ fontFamily: fonts.mono, fontSize: 9, color: C.ochre, width: 16 }}>✓</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.ink, flex: 1, lineHeight: 1.45 }}>{tx(it, fonts.rtl)}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.rule, paddingBottom: 8, marginBottom: 12 }}>
              <Mono style={{ color: C.inkSoft }} fonts={fonts}>NOT INCLUDED</Mono>
            </View>
            {NOT_INCLUDED.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", paddingVertical: 5 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.inkSoft, width: 16 }}>×</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.inkSoft, flex: 1, lineHeight: 1.45 }}>{it}</Text>
              </View>
            ))}
          </View>
        </View>
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
