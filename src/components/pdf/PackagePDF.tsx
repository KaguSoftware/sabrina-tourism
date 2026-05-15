import React from "react";
import path from "node:path";
import {
  Document, Page, View, Text, Image,
  Svg, Polygon,
} from "@react-pdf/renderer";
import type { Package } from "@/lib/packages/types";
import { registerFonts } from "@/lib/pdf/fonts";
import { C, F, MARGIN, upper } from "@/lib/pdf/theme";
import { PdfIcon } from "@/lib/pdf/icons";

const LOGO_LIGHT = path.join(process.cwd(), "public/logo_1_sabrina_cropped.png");
const LOGO_DARK = path.join(process.cwd(), "public/logo_2_sabrina_cropped.png");

registerFonts();

const PW = 595;
const HERO_H = 310;
const CUT_RISE = 32;
const HERO_PADDING_TOP = HERO_H + CUT_RISE + 4;

function abs(src: string, base: string) { return src.startsWith("http") ? src : `${base}${src}`; }
function fmtMonth(iso: string) { return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { month: "short", year: "numeric" }); }

function Wordmark({ light = false }: { light?: boolean }) {
  return <Image src={light ? LOGO_LIGHT : LOGO_DARK} style={{ width: 80, height: 28, objectFit: "contain" }} />;
}
function Mono({ children, style = {} }: { children: React.ReactNode; style?: object }) {
  return <Text style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 1.4, color: C.inkSoft, ...style }}>{children}</Text>;
}
function PageFooter({ left, page, total }: { left: string; page: number; total: number }) {
  return (
    <View style={{ position: "absolute", bottom: 32, left: MARGIN, right: MARGIN, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 10 }}>
      <Mono style={{ color: C.inkSoft }}>{upper(left)}</Mono>
      <Wordmark />
      <Mono style={{ color: C.inkSoft }}>{`${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</Mono>
    </View>
  );
}

function HeroBlock({ heroSrc }: { heroSrc: string | null }) {
  return (
    <>
      {heroSrc ? (
        <Image src={heroSrc} style={{ position: "absolute", top: 0, left: 0, width: PW, height: HERO_H, objectFit: "cover" }} />
      ) : (
        <View style={{ position: "absolute", top: 0, left: 0, width: PW, height: HERO_H, backgroundColor: C.navy }} />
      )}
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

interface Props { pkg: Package; waPhone?: string; baseUrl?: string }

export function PackagePDF({ pkg, waPhone = "", baseUrl = "" }: Props) {
  const heroSrc = abs(pkg.heroImage, baseUrl);
  const primaryHotel = pkg.tiers.find((tier) => tier.hotel)?.hotel?.name ?? pkg.tiers[0]?.accommodation ?? "";
  const facts: Array<{ k: string; v: string; icon: string | null }> = [
    { k: "Duration",   v: pkg.duration, icon: "clock" },
    { k: "Region",     v: pkg.region, icon: "map-pin" },
  ];
  if (pkg.season) {
    facts.push({ k: "Season", v: pkg.season, icon: "compass" });
  }
  if (primaryHotel) {
    facts.push({ k: "Hotel", v: primaryHotel, icon: "hotel" });
  }
  facts.push(
    { k: "Group size", v: `${pkg.minPeople}–${pkg.maxPeople} guests`, icon: "users" },
    { k: "Available",  v: `${fmtMonth(pkg.availableFrom)} – ${fmtMonth(pkg.availableTo)}`, icon: "calendar" },
  );
  const factCount = facts.length;
  const kicker = pkg.season
    ? `${upper(pkg.region)} · PACKAGE · ${upper(pkg.season)}`
    : `${upper(pkg.region)} · PACKAGE`;

  return (
    <Document title={pkg.name} author="Sabrina Turizm">
      {/* ── Cover ─────────────────────────────────────────────── */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: F.body, paddingTop: HERO_PADDING_TOP }}>
        <HeroBlock heroSrc={heroSrc} />
        <View style={{ paddingHorizontal: MARGIN, paddingTop: 20 }}>
          <Mono style={{ color: C.ochre, marginBottom: 10 }}>{kicker}</Mono>
          <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 54, lineHeight: 1, letterSpacing: -1, color: C.ink }}>{pkg.name}</Text>
          <Text style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: 300, fontSize: 17, lineHeight: 1.4, color: C.inkSoft, marginTop: 10 }}>{pkg.shortDescription}</Text>
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 24, flexDirection: "row", flexWrap: "wrap", backgroundColor: C.navy }}>
          {facts.map((f, i) => (
            <View key={i} style={{ width: "33.333%", paddingVertical: 12, paddingHorizontal: 12, borderRightWidth: (i + 1) % 3 !== 0 && i < factCount - 1 ? 1 : 0, borderRightColor: C.navySoft, borderBottomWidth: i < factCount - 3 ? 1 : 0, borderBottomColor: C.navySoft }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 4 }}>
                {f.icon ? <PdfIcon name={f.icon} size={9} color={C.ochre} /> : null}
                <Mono style={{ color: C.ochre }}>{f.k.toUpperCase()}</Mono>
              </View>
              <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 14, color: C.cream, lineHeight: 1.2 }}>{f.v}</Text>
            </View>
          ))}
        </View>
        {waPhone ? (
          <View style={{ position: "absolute", bottom: 72, left: MARGIN }}>
            <Text style={{ fontFamily: F.body, fontSize: 10, color: C.inkSoft }}>{`WhatsApp ${waPhone}  ·  sabrinaturizm.com`}</Text>
          </View>
        ) : null}
        <PageFooter left="Sabrina Turizm" page={1} total={3} />
      </Page>

      {/* ── Itinerary ─────────────────────────────────────────── */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: F.body }}>
        <View style={{ backgroundColor: C.navy, paddingHorizontal: MARGIN, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Mono style={{ color: C.cream }}>{upper(pkg.name)}</Mono>
          <Wordmark />
        </View>
        <View style={{ paddingHorizontal: MARGIN, paddingTop: 26 }}>
          <Mono style={{ color: C.ochre, marginBottom: 8 }}>DAY BY DAY</Mono>
          <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 50, lineHeight: 1, letterSpacing: -1, color: C.ink }}>The itinerary.</Text>
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 22 }}>
          {pkg.itinerary.map((day, i) => (
            <View key={day.day} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, borderTopWidth: 1, borderTopColor: C.rule, borderBottomWidth: i === pkg.itinerary.length - 1 ? 1 : 0, borderBottomColor: C.rule }}>
              <View style={{ width: 68 }}>
                <Mono style={{ color: C.ochre }}>{`DAY ${String(day.day).padStart(2, "0")}`}</Mono>
              </View>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i % 3 === 0 ? C.ochre : C.rule, marginRight: 18 }} />
              <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, color: C.ink, flex: 1, lineHeight: 1.1 }}>{day.title}</Text>
            </View>
          ))}
        </View>
        <PageFooter left="Day by day" page={2} total={3} />
      </Page>

      {/* ── Inclusions ────────────────────────────────────────── */}
      <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: F.body }}>
        <View style={{ backgroundColor: C.navy, paddingHorizontal: MARGIN, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Mono style={{ color: C.cream }}>{upper(pkg.name)}</Mono>
          <Wordmark light />
        </View>
        <View style={{ paddingHorizontal: MARGIN, paddingTop: 24, paddingBottom: 24, backgroundColor: C.navy }}>
          <Mono style={{ color: C.ochre, marginBottom: 8 }}>RESERVE</Mono>
          <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 40, lineHeight: 1, color: C.cream }}>{pkg.name}.</Text>
          <View style={{ flexDirection: "row", marginTop: 18, gap: 24 }}>
            <View style={{ flex: 1 }}>
              <Mono style={{ color: C.ochre, marginBottom: 6 }}>DURATION</Mono>
              <Text style={{ fontFamily: F.display, fontWeight: 300, fontSize: 28, color: C.ochre, lineHeight: 1 }}>{pkg.duration}</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 20, borderLeftWidth: 1, borderLeftColor: C.navySoft }}>
              <Mono style={{ color: C.ochre, marginBottom: 6 }}>HOW TO RESERVE</Mono>
              <Text style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: 300, fontSize: 13, lineHeight: 1.5, color: C.cream }}>
                No payment now. We send a tailored quote — you confirm only when ready.
              </Text>
              {waPhone ? (
                <Text style={{ fontFamily: F.body, fontSize: 12, color: C.cream, marginTop: 8, opacity: 0.9 }}>{`WhatsApp: ${waPhone}`}</Text>
              ) : null}
              {waPhone ? (
                <View style={{ marginTop: 10, alignSelf: "flex-start", backgroundColor: C.ochre, paddingVertical: 6, paddingHorizontal: 12 }}>
                  <Text style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 1.2, color: C.navy }}>{`WHATSAPP · ${waPhone}`}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: MARGIN, marginTop: 26, flexDirection: "row", gap: 32 }}>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.ochre, paddingBottom: 8, marginBottom: 14 }}>
              <Mono style={{ color: C.ochre }}>INCLUDED</Mono>
            </View>
            {pkg.included.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
                <View style={{ width: 16, flexDirection: "row", alignItems: "center" }}>
                  <PdfIcon name={it.icon ?? "circle-plus"} size={11} color={C.ochre} />
                </View>
                <Text style={{ fontFamily: F.body, fontSize: 11, color: C.ink, flex: 1, lineHeight: 1.5 }}>{it.text}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.rule, paddingBottom: 8, marginBottom: 14 }}>
              <Mono style={{ color: C.inkSoft }}>NOT INCLUDED</Mono>
            </View>
            {pkg.notIncluded.map((it, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
                <View style={{ width: 16, flexDirection: "row", alignItems: "center" }}>
                  <PdfIcon name={it.icon ?? "circle-minus"} size={11} color={C.inkSoft} />
                </View>
                <Text style={{ fontFamily: F.body, fontSize: 11, color: C.inkSoft, flex: 1, lineHeight: 1.5 }}>{it.text}</Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter left="Inclusions & reservation" page={3} total={3} />
      </Page>
    </Document>
  );
}
