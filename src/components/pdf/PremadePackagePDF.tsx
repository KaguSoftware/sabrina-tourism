import React from "react";
import path from "node:path";
import {
  Document, Page, View, Text, Image,
  Svg, Polygon,
} from "@react-pdf/renderer";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";
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

function abs(src: string, base: string) {
  return src.startsWith("http") ? src : `${base}${src}`;
}
function intlLocaleFor(locale: string): string {
  return locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : "en-GB";
}
function fmtShortDateLocal(iso: string, locale: string): string {
  const text = new Date(iso + "T00:00:00").toLocaleDateString(intlLocaleFor(locale), { day: "numeric", month: "long" });
  return locale === "en" ? text.toLowerCase() : text;
}
function formatRange(start: string, end: string, locale: string): string {
  const intl = intlLocaleFor(locale);
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sDay = s.toLocaleDateString(intl, { day: "numeric" });
  const eDay = e.toLocaleDateString(intl, { day: "numeric" });
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    const monthLabel = s.toLocaleDateString(intl, { month: "long" });
    return locale === "en" ? `${sDay}–${eDay} ${monthLabel.toLowerCase()}` : `${sDay}–${eDay} ${monthLabel}`;
  }
  const sMonth = s.toLocaleDateString(intl, { month: "long" });
  const eMonth = e.toLocaleDateString(intl, { month: "long" });
  return locale === "en"
    ? `${sDay} ${sMonth.toLowerCase()} – ${eDay} ${eMonth.toLowerCase()}`
    : `${sDay} ${sMonth} – ${eDay} ${eMonth}`;
}
function rtlRow(rtl: boolean) {
  return { flexDirection: (rtl ? "row-reverse" : "row") as "row" | "row-reverse" };
}

function Wordmark({ light = false }: { light?: boolean }) {
  return <Image src={light ? LOGO_LIGHT : LOGO_DARK} style={{ width: 80, height: 28, objectFit: "contain" }} />;
}

function Mono({ children, style = {}, fonts }: { children: React.ReactNode; style?: object; fonts: FontSet }) {
  return (
    <Text style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: 9, letterSpacing: 1.4, color: C.inkSoft, ...style }}>
      {children}
    </Text>
  );
}

function PageFooter({ left, page, total, fonts }: { left: string; page: number; total: number; fonts: FontSet }) {
  return (
    <View style={{
      position: "absolute", bottom: 32, left: MARGIN, right: MARGIN,
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 10,
    }}>
      <Mono style={{ color: C.inkSoft }} fonts={fonts}>{upper(left)}</Mono>
      <Wordmark />
      <Mono style={{ color: C.inkSoft }} fonts={fonts}>{`${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</Mono>
    </View>
  );
}

function HeroBlock({ heroSrc, fonts }: { heroSrc: string | null; fonts: FontSet }) {
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

type Fact = { k: string; v: string; icon: string | null };

function buildFacts(pkg: PremadePackagePublic, locale: string): Fact[] {
  const facts: Fact[] = [
    { k: "Duration",   v: pkg.duration ?? "—", icon: "clock" },
    { k: "Region",     v: pkg.region ?? "—", icon: "map-pin" },
  ];
  if (pkg.season) {
    facts.push({ k: "Season", v: pkg.season, icon: "compass" });
  }
  if (pkg.accommodation.name) {
    facts.push({ k: "Hotel", v: pkg.accommodation.name, icon: "hotel" });
  }
  facts.push(
    { k: "Group size", v: pkg.minPeople != null && pkg.maxPeople != null ? `${pkg.minPeople}–${pkg.maxPeople} guests` : "—", icon: "users" },
  );
  if (pkg.availableFrom && pkg.availableTo) {
    facts.push({
      k: "Available",
      v: `from ${fmtShortDateLocal(pkg.availableFrom, locale)} till ${fmtShortDateLocal(pkg.availableTo, locale)}`,
      icon: "calendar",
    });
  }
  return facts;
}

function FactsGrid({ facts, fonts }: { facts: Fact[]; fonts: FontSet }) {
  const factCount = facts.length;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", backgroundColor: C.navy }}>
      {facts.map((f, i) => (
        <View key={i} style={{ width: "33.333%", paddingVertical: 11, paddingHorizontal: 12, borderRightWidth: (i + 1) % 3 !== 0 && i < factCount - 1 ? 1 : 0, borderRightColor: C.navySoft, borderBottomWidth: i < factCount - 3 ? 1 : 0, borderBottomColor: C.navySoft }}>
          <View style={{ ...rtlRow(fonts.rtl), alignItems: "center", marginBottom: 5, gap: 4 }}>
            {f.icon ? <PdfIcon name={f.icon} size={9} color={C.ochre} /> : null}
            <Mono style={{ color: C.ochre }} fonts={fonts}>{f.k.toUpperCase()}</Mono>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.cream, lineHeight: 1.5, textAlign: fonts.rtl ? "right" : "left" }}>{tx(f.v, fonts.rtl)}</Text>
        </View>
      ))}
    </View>
  );
}

function MonthGrid({ dates, fonts, locale }: { dates: PremadePackagePublic["dates"]; fonts: FontSet; locale: string }) {
  if (!dates || dates.length === 0) return null;

  const sorted = [...dates].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const byMonth = new Map<string, typeof sorted>();
  for (const d of sorted) {
    const key = d.startDate.slice(0, 7); // "YYYY-MM"
    const arr = byMonth.get(key) ?? [];
    arr.push(d);
    byMonth.set(key, arr);
  }
  const monthKeys = Array.from(byMonth.keys());

  return (
    <View style={{ marginHorizontal: MARGIN, marginTop: 14, flexDirection: "row", gap: 1, backgroundColor: C.rule }}>
      {monthKeys.map((key) => {
        const [y, m] = key.split("-").map(Number);
        const monthDate = new Date(y, m - 1, 1);
        const monthLabel = monthDate.toLocaleDateString(intlLocaleFor(locale), { month: "long" });
        const ranges = byMonth.get(key)!;
        return (
          <View key={key} style={{ flex: 1, backgroundColor: C.navy, paddingVertical: 14, paddingHorizontal: 10, gap: 8 }}>
            <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 16, color: C.ochre, textAlign: "center", letterSpacing: 1 }}>
              {tx(upper(monthLabel), fonts.rtl)}
            </Text>
            <View style={{ gap: 4 }}>
              {ranges.map((r, i) => (
                <Text key={i} style={{ fontFamily: fonts.body, fontSize: 9, color: C.cream, textAlign: "center", lineHeight: 1.4 }}>
                  {tx(formatRange(r.startDate, r.endDate, locale), fonts.rtl)}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Cover({ pkg, waPhone, baseUrl, fonts, locale }: { pkg: PremadePackagePublic; waPhone: string; baseUrl: string; fonts: FontSet; locale: string }) {
  const heroSrc = pkg.heroImage ? abs(pkg.heroImage, baseUrl) : null;
  const regionPart = upper(pkg.region ?? "");
  const kicker = pkg.season
    ? `${regionPart} · GROUP PACKAGE · ${upper(pkg.season)}`
    : `${regionPart} · GROUP PACKAGE`;
  const hasDates = (pkg.dates?.length ?? 0) > 0;

  return (
    <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: fonts.body, paddingTop: HERO_PADDING_TOP }}>
      <HeroBlock heroSrc={heroSrc} fonts={fonts} />
      <View style={{ paddingHorizontal: MARGIN, paddingTop: 20 }}>
        <Mono style={{ color: C.ochre, marginBottom: 10 }} fonts={fonts}>{kicker}</Mono>
        <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(54, fonts.displayScale), lineHeight: 1.1, color: C.ink }}>
          {tx(pkg.name, fonts.rtl)}
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, lineHeight: 1.5, color: C.inkSoft, marginTop: 8 }}>
          {tx(pkg.shortDescription, fonts.rtl)}
        </Text>
      </View>
      {hasDates ? (
        <>
          <View style={{ paddingHorizontal: MARGIN, paddingTop: 22 }}>
            <Mono style={{ color: C.ochre }} fonts={fonts}>DEPARTURES</Mono>
          </View>
          <MonthGrid dates={pkg.dates} fonts={fonts} locale={locale} />
        </>
      ) : null}
      {waPhone ? (
        <View style={{ position: "absolute", bottom: 72, left: MARGIN }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 10, color: C.inkSoft }}>{`WhatsApp ${waPhone}  ·  sabrinaturizm.com`}</Text>
        </View>
      ) : null}
      <PageFooter left="Sabrina Turizm" page={1} total={3} fonts={fonts} />
    </Page>
  );
}

function Itinerary({ pkg, facts, fonts }: { pkg: PremadePackagePublic; facts: Fact[]; fonts: FontSet }) {
  return (
    <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: fonts.body }}>
      <View style={{ backgroundColor: C.navy, paddingHorizontal: MARGIN, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Mono style={{ color: C.cream }} fonts={fonts}>{tx(pkg.name, fonts.rtl)}</Mono>
        <Wordmark />
      </View>
      <FactsGrid facts={facts} fonts={fonts} />
      <View style={{ paddingHorizontal: MARGIN, paddingTop: 28 }}>
        <Mono style={{ color: C.ochre, marginBottom: 8 }} fonts={fonts}>DAY BY DAY</Mono>
        <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(50, fonts.displayScale), lineHeight: 1.1, color: C.ink }}>
          The itinerary.
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
          {tx(pkg.shortDescription, fonts.rtl)}
        </Text>
      </View>
      <View style={{ marginHorizontal: MARGIN, marginTop: 18 }}>
        {pkg.itinerary.map((day, i) => (
          <View key={day.day} style={{
            flexDirection: "row", alignItems: "center",
            paddingVertical: 10,
            borderTopWidth: 1, borderTopColor: C.rule,
            borderBottomWidth: i === pkg.itinerary.length - 1 ? 1 : 0,
            borderBottomColor: C.rule,
          }}>
            <View style={{ width: 70 }}>
              <Mono style={{ color: C.ochre }} fonts={fonts}>{`DAY ${String(day.day).padStart(2, "0")}`}</Mono>
            </View>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i % 3 === 0 ? C.ochre : C.rule, marginRight: 18 }} />
            <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(18, fonts.displayScale), color: C.ink, flex: 1, lineHeight: 1.2 }}>
              {tx(day.title, fonts.rtl)}
            </Text>
          </View>
        ))}
      </View>
      <PageFooter left="Day by day" page={2} total={3} fonts={fonts} />
    </Page>
  );
}

function fmtPrice(amount: number, currency: string): string {
  const code = (currency || "USD").toUpperCase();
  const symbol = code === "USD" ? "$" : code === "EUR" ? "€" : code === "GBP" ? "£" : "";
  const num = Math.round(amount).toLocaleString("en-US");
  return symbol ? `${symbol}${num}` : `${code} ${num}`;
}

function PricingBlock({ pkg, fonts }: { pkg: PremadePackagePublic; fonts: FontSet }) {
  const pricing = pkg.pricing;
  if (!pricing) return null;
  const allSlots: Array<{ icon: string; label: string; value: number | null | undefined }> = [
    { icon: "user",    label: "Single",    value: pricing.onePerson },
    { icon: "users",   label: "2 people",  value: pricing.twoPeople },
    { icon: "baby",    label: "Baby",      value: pricing.baby },
  ];
  const slots = allSlots.filter(
    (r): r is { icon: string; label: string; value: number } => r.value != null,
  );

  if (slots.length === 0 && pricing.singleRoomSupplement == null) return null;
  const currency = pkg.currency ?? "USD";

  return (
    <View style={{ marginHorizontal: MARGIN, marginTop: 22 }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.ochre, paddingBottom: 8, marginBottom: 10 }}>
        <Mono style={{ color: C.ochre }} fonts={fonts}>GROUP RATES — PER PERSON ({currency.toUpperCase()})</Mono>
      </View>
      {slots.length > 0 ? (
        <View style={{ flexDirection: "row", gap: 1, backgroundColor: C.rule }}>
          {slots.map((slot, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: C.cream, alignItems: "center", paddingVertical: 14, paddingHorizontal: 8, gap: 6 }}>
              <PdfIcon name={slot.icon} size={18} color={C.ochre} />
              <Text style={{ fontFamily: fonts.body, fontSize: 9, color: C.inkSoft, textAlign: "center", letterSpacing: 0.6 }}>{upper(slot.label)}</Text>
              <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 14, color: C.ink, textAlign: "center" }}>{fmtPrice(slot.value, currency)}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {pricing.singleRoomSupplement != null ? (
        <Text style={{ fontFamily: fonts.body, fontSize: 9, color: C.inkSoft, marginTop: 8, textAlign: fonts.rtl ? "left" : "right" }}>
          {`+ ${fmtPrice(pricing.singleRoomSupplement, currency)} single-room supplement`}
        </Text>
      ) : null}
    </View>
  );
}

function Closing({ pkg, waPhone, fonts }: { pkg: PremadePackagePublic; waPhone: string; fonts: FontSet }) {
  return (
    <Page size="A4" style={{ backgroundColor: C.creamDeep, fontFamily: fonts.body }}>
      <View style={{ backgroundColor: C.navy, paddingHorizontal: MARGIN, paddingVertical: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Mono style={{ color: C.cream }} fonts={fonts}>{tx(pkg.name, fonts.rtl)}</Mono>
        <Wordmark light />
      </View>
      <View style={{ paddingHorizontal: MARGIN, paddingTop: 24, paddingBottom: 24, backgroundColor: C.navy, marginTop: 0 }}>
        <Mono style={{ color: C.ochre, marginBottom: 8 }} fonts={fonts}>RESERVE</Mono>
        <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(44, fonts.displayScale), lineHeight: 1.1, color: C.cream }}>
          {tx(pkg.name, fonts.rtl)}.
        </Text>
        <View style={{ flexDirection: "row", marginTop: 16, gap: 28 }}>
          <View style={{ flex: 1 }}>
            <Mono style={{ color: C.ochre, marginBottom: 6 }} fonts={fonts}>STARTING FROM</Mono>
            {pkg.price != null ? (
              <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(40, fonts.displayScale), lineHeight: 1.1, color: C.ochre }}>
                {`${pkg.currency} ${pkg.price.toLocaleString()}`}
              </Text>
            ) : (
              <Text style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: ds(22, fonts.displayScale), color: C.cream }}>Contact us</Text>
            )}
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.cream, marginTop: 4, opacity: 0.7 }}>per person</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 24, borderLeftWidth: 1, borderLeftColor: C.navySoft }}>
            <Mono style={{ color: C.ochre, marginBottom: 8 }} fonts={fonts}>HOW TO RESERVE</Mono>
            <Text style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 300, fontSize: ds(14, fonts.displayScale), lineHeight: 1.5, color: C.cream }}>
              No payment now. We send a tailored quote — you confirm only when ready.
            </Text>
            {waPhone ? (
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C.cream, marginTop: 8, opacity: 0.9 }}>
                {`WhatsApp: ${waPhone}`}
              </Text>
            ) : null}
            {waPhone ? (
              <View style={{ marginTop: 10, alignSelf: "flex-start", backgroundColor: C.ochre, paddingVertical: 7, paddingHorizontal: 12 }}>
                <Text style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.2, color: C.navy }}>{`WHATSAPP · ${waPhone}`}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <View style={{ marginHorizontal: MARGIN, marginTop: 28, flexDirection: "row", gap: 32 }}>
        <View style={{ flex: 1 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.ochre, paddingBottom: 8, marginBottom: 14 }}>
            <Mono style={{ color: C.ochre }} fonts={fonts}>INCLUDED</Mono>
          </View>
          {pkg.included.map((it, i) => (
            <View key={i} style={{ ...rtlRow(fonts.rtl), alignItems: "center", paddingVertical: 6 }}>
              <View style={{ width: 14, alignItems: "center" }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 13, color: C.ochre }}>+</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.ink, flex: 1, lineHeight: 1.5, paddingHorizontal: 6, textAlign: fonts.rtl ? "right" : "left" }}>{tx(it.text, fonts.rtl)}</Text>
              <View style={{ width: 14, alignItems: "center" }}>
                <PdfIcon name={it.icon ?? "circle"} size={11} color={C.ochre} />
              </View>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.rule, paddingBottom: 8, marginBottom: 14 }}>
            <Mono style={{ color: C.inkSoft }} fonts={fonts}>NOT INCLUDED</Mono>
          </View>
          {pkg.notIncluded.map((it, i) => (
            <View key={i} style={{ ...rtlRow(fonts.rtl), alignItems: "center", paddingVertical: 6 }}>
              <View style={{ width: 14, alignItems: "center" }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 13, color: C.inkSoft }}>−</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C.inkSoft, flex: 1, lineHeight: 1.5, paddingHorizontal: 6, textAlign: fonts.rtl ? "right" : "left" }}>{tx(it.text, fonts.rtl)}</Text>
              <View style={{ width: 14, alignItems: "center" }}>
                <PdfIcon name={it.icon ?? "circle"} size={11} color={C.inkSoft} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <PricingBlock pkg={pkg} fonts={fonts} />
      <PageFooter left="Inclusions & reservation" page={3} total={3} fonts={fonts} />
    </Page>
  );
}

interface Props { pkg: PremadePackagePublic; waPhone?: string; baseUrl?: string; locale?: string }

export function PremadePackagePDF({ pkg, waPhone = "", baseUrl = "", locale = "en" }: Props) {
  const facts = buildFacts(pkg, locale);
  const fonts = getFontsForLocale(locale);
  return (
    <Document title={pkg.name} author="Sabrina Turizm">
      <Cover pkg={pkg} waPhone={waPhone} baseUrl={baseUrl} fonts={fonts} locale={locale} />
      <Itinerary pkg={pkg} facts={facts} fonts={fonts} />
      <Closing pkg={pkg} waPhone={waPhone} fonts={fonts} />
    </Document>
  );
}
