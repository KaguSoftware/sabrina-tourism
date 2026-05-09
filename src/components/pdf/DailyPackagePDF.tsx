import React from "react";
import {
  Document, Page, View, Text, Image,
  Svg, Polygon,
} from "@react-pdf/renderer";
import type { DailyPackage } from "@/lib/daily/types";
import { registerFonts } from "@/lib/pdf/fonts";
import { C, F, MARGIN } from "@/lib/pdf/theme";

registerFonts();

const PW = 595;
const HERO_H = 310;
const CUT_RISE = 32;
const HERO_PADDING_TOP = HERO_H + CUT_RISE + 4;

function abs(src: string, base: string) { return src.startsWith("http") ? src : `${base}${src}`; }

function Wordmark({ light = false }: { light?: boolean }) {
  return <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 13, color: light ? C.cream : C.ochre, letterSpacing: 0.5 }}>SABRINA TURIZM</Text>;
}
function Mono({ children, style = {} }: { children: React.ReactNode; style?: object }) {
  return <Text style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 1.4, color: C.inkSoft, ...style }}>{children}</Text>;
}
function PageFooter({ left, page, total }: { left: string; page: number; total: number }) {
  return (
    <View style={{ position: "absolute", bottom: 32, left: MARGIN, right: MARGIN, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 10 }}>
      <Mono style={{ color: C.inkSoft }}>{left.toUpperCase()}</Mono>
      <Wordmark />
      <Mono style={{ color: C.inkSoft }}>{`${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</Mono>
    </View>
  );
}

function HeroBlock({ heroSrc }: { heroSrc: string }) {
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

const NOT_INCLUDED = ["Hotel accommodation", "Breakfast"];

interface Props { pkg: DailyPackage; waPhone?: string; baseUrl?: string }

export function DailyPackagePDF({ pkg, waPhone = "", baseUrl = "" }: Props) {
  const heroSrc = abs(pkg.heroImage, baseUrl);

  return (
    <Document title={pkg.name} author="Sabrina Turizm">
      {/* ── Cover ─────────────────────────────────────────────── */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: F.body, paddingTop: HERO_PADDING_TOP }}>
        <HeroBlock heroSrc={heroSrc} />

        <View style={{ paddingHorizontal: MARGIN, paddingTop: 20 }}>
          <Mono style={{ color: C.ochre, marginBottom: 10 }}>{`${pkg.region.toUpperCase()} · DAILY PACKAGE`}</Mono>
          <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 54, lineHeight: 1, letterSpacing: -1, color: C.ink }}>{pkg.name}</Text>
          <Text style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: 300, fontSize: 17, lineHeight: 1.4, color: C.inkSoft, marginTop: 10 }}>{pkg.shortDescription}</Text>
        </View>

        {/* Facts strip */}
        <View style={{ marginHorizontal: MARGIN, marginTop: 24, flexDirection: "row", backgroundColor: C.navy }}>
          {[
            { k: "Timeframe", v: `${pkg.startTime} – ${pkg.endTime}` },
            { k: "Region",    v: pkg.region },
            { k: "Price",     v: `${pkg.currency} ${pkg.price.toLocaleString()}` },
            { k: "Vehicle",   v: pkg.vehicle },
          ].map((f, i) => (
            <View key={i} style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 14, borderRightWidth: i < 3 ? 1 : 0, borderRightColor: C.navySoft }}>
              <Mono style={{ color: C.ochre, marginBottom: 6 }}>{f.k.toUpperCase()}</Mono>
              <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 13, color: C.cream, lineHeight: 1.2 }}>{f.v}</Text>
            </View>
          ))}
        </View>

        {waPhone ? (
          <View style={{ position: "absolute", bottom: 72, left: MARGIN }}>
            <Text style={{ fontFamily: F.body, fontSize: 10, color: C.inkSoft }}>{`WhatsApp ${waPhone}  ·  sabrinaturizm.com`}</Text>
          </View>
        ) : null}
        <PageFooter left="Sabrina Turizm" page={1} total={2} />
      </Page>

      {/* ── Schedule + Inclusions ─────────────────────────────── */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: F.body }}>
        <View style={{ backgroundColor: C.navy, paddingHorizontal: MARGIN, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Mono style={{ color: C.cream }}>{pkg.name.toUpperCase()}</Mono>
          <Wordmark />
        </View>

        <View style={{ paddingHorizontal: MARGIN, paddingTop: 26 }}>
          <Mono style={{ color: C.ochre, marginBottom: 8 }}>DAY ITINERARY</Mono>
          <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 46, lineHeight: 1, letterSpacing: -1, color: C.ink }}>The schedule.</Text>
        </View>

        <View style={{ marginHorizontal: MARGIN, marginTop: 20 }}>
          {pkg.stops.map((stop, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.rule, borderBottomWidth: i === pkg.stops.length - 1 ? 1 : 0, borderBottomColor: C.rule }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === 0 || i === pkg.stops.length - 1 ? C.ochre : C.rule, marginTop: 7, marginRight: 18 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 19, color: C.ink, lineHeight: 1.1 }}>{stop.place}</Text>
                {stop.description ? (
                  <Text style={{ fontFamily: F.body, fontSize: 10, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>{stop.description}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginHorizontal: MARGIN, marginTop: 24, flexDirection: "row", gap: 32 }}>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.ochre, paddingBottom: 8, marginBottom: 12 }}>
              <Mono style={{ color: C.ochre }}>INCLUDED</Mono>
            </View>
            {pkg.included.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", paddingVertical: 5 }}>
                <Text style={{ fontFamily: F.mono, fontSize: 9, color: C.ochre, width: 16 }}>✓</Text>
                <Text style={{ fontFamily: F.body, fontSize: 11, color: C.ink, flex: 1, lineHeight: 1.45 }}>{it}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.rule, paddingBottom: 8, marginBottom: 12 }}>
              <Mono style={{ color: C.inkSoft }}>NOT INCLUDED</Mono>
            </View>
            {NOT_INCLUDED.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", paddingVertical: 5 }}>
                <Text style={{ fontFamily: F.body, fontSize: 11, color: C.inkSoft, width: 16 }}>×</Text>
                <Text style={{ fontFamily: F.body, fontSize: 11, color: C.inkSoft, flex: 1, lineHeight: 1.45 }}>{it}</Text>
              </View>
            ))}
          </View>
        </View>

        {waPhone ? (
          <View style={{ marginHorizontal: MARGIN, marginTop: 24, backgroundColor: C.navy, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: 300, fontSize: 14, color: C.cream, lineHeight: 1.4 }}>
              No payment now — confirm only when ready.
            </Text>
            <View style={{ backgroundColor: C.ochre, paddingVertical: 8, paddingHorizontal: 14 }}>
              <Text style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 1.2, color: C.navy }}>{`WHATSAPP · ${waPhone}`}</Text>
            </View>
          </View>
        ) : null}

        <PageFooter left="Itinerary & inclusions" page={2} total={2} />
      </Page>
    </Document>
  );
}
