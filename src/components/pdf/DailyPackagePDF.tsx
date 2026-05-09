import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { DailyPackage } from "@/lib/daily/types";
import { registerFonts } from "@/lib/pdf/fonts";
import { colors, fonts, spacing } from "@/lib/pdf/theme";

registerFonts();

const s = StyleSheet.create({
  coverPage: {
    fontFamily: fonts.sans,
    backgroundColor: colors.navy,
    padding: 0,
  },
  page: {
    fontFamily: fonts.sans,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.pageH,
    paddingVertical: spacing.pageV,
  },
  heroImage: {
    width: "100%",
    height: 280,
    objectFit: "cover",
  },
  coverBody: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.pageH,
    paddingTop: 28,
    paddingBottom: 20,
  },
  regionPill: {
    backgroundColor: colors.ochre,
    color: colors.navy,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 6,
    lineHeight: 1.1,
  },
  coverTime: {
    fontSize: 10,
    color: colors.ochre,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  coverDesc: {
    fontSize: 12,
    color: colors.cream,
    lineHeight: 1.6,
    fontStyle: "italic",
    maxWidth: 420,
  },
  coverPrice: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.ochre,
    marginTop: 14,
  },
  coverPriceSub: {
    fontSize: 9,
    color: colors.cream,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  sectionBorder: {
    width: 3,
    height: 18,
    backgroundColor: colors.ochre,
    marginRight: 10,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.navy,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  stopRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  stopRowAlt: {
    backgroundColor: colors.lightGray,
  },
  timePill: {
    backgroundColor: colors.navy,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginRight: 12,
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  timeText: {
    color: colors.ochre,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1,
  },
  stopContent: {
    flex: 1,
  },
  stopPlace: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 3,
  },
  stopDesc: {
    fontSize: 10,
    color: colors.inkSoft,
    lineHeight: 1.5,
  },
  inclusionsGrid: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  inclusionCol: {
    flex: 1,
  },
  inclusionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  checkMark: {
    fontSize: 10,
    color: colors.green,
    marginRight: 6,
    marginTop: 1,
    fontWeight: 700,
  },
  xMark: {
    fontSize: 10,
    color: colors.terracotta,
    marginRight: 6,
    marginTop: 1,
    fontWeight: 700,
  },
  inclusionText: {
    fontSize: 10,
    color: colors.inkSoft,
    lineHeight: 1.4,
    flex: 1,
  },
  mt16: { marginTop: 16 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: spacing.pageH,
    right: spacing.pageH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.ruleLight,
    paddingTop: 8,
  },
  footerBrand: {
    fontSize: 9,
    color: colors.ochre,
    fontWeight: 700,
  },
  footerTagline: {
    fontSize: 7,
    color: colors.inkSoft,
  },
  footerWa: {
    fontSize: 8,
    color: colors.inkSoft,
  },
  pageNum: {
    fontSize: 8,
    color: colors.inkSoft,
  },
});

function Footer({ waPhone }: { waPhone: string }) {
  return (
    <View style={s.footer} fixed>
      <View>
        <Text style={s.footerBrand}>SABRINA TOURISM</Text>
        <Text style={s.footerTagline}>Boutique Tours Across Türkiye</Text>
      </View>
      {waPhone ? <Text style={s.footerWa}>WhatsApp: {waPhone}</Text> : null}
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

interface Props {
  pkg: DailyPackage;
  waPhone?: string;
  baseUrl?: string;
}

function abs(src: string, base: string) {
  return src.startsWith("http") ? src : `${base}${src}`;
}

const NOT_INCLUDED = ["Hotel accommodation", "Breakfast"];

export function DailyPackagePDF({ pkg, waPhone = "", baseUrl = "" }: Props) {
  return (
    <Document title={pkg.name} author="Sabrina Tourism">
      {/* Cover Page */}
      <Page size="A4" style={s.coverPage}>
        <Image src={abs(pkg.heroImage, baseUrl)} style={s.heroImage} />
        <View style={s.coverBody}>
          <Text style={s.regionPill}>{pkg.region}</Text>
          <Text style={s.coverTitle}>{pkg.name}</Text>
          <Text style={s.coverTime}>{pkg.startTime} – {pkg.endTime} · Day Experience</Text>
          <Text style={s.coverDesc}>{pkg.shortDescription}</Text>
          <Text style={s.coverPrice}>{pkg.currency} {pkg.price.toLocaleString()}</Text>
          <Text style={s.coverPriceSub}>Per person</Text>
        </View>
        <Footer waPhone={waPhone} />
      </Page>

      {/* Stops + Inclusions */}
      <Page size="A4" style={s.page}>
        <View style={s.sectionHeader}>
          <View style={s.sectionBorder} />
          <Text style={s.sectionLabel}>Day Itinerary</Text>
        </View>
        {pkg.stops.map((stop, i) => (
          <View key={i} style={[s.stopRow, i % 2 === 1 ? s.stopRowAlt : {}]} wrap={false}>
            <View style={s.timePill}>
              <Text style={s.timeText}>{stop.time}</Text>
            </View>
            <View style={s.stopContent}>
              <Text style={s.stopPlace}>{stop.place}</Text>
              <Text style={s.stopDesc}>{stop.description}</Text>
            </View>
          </View>
        ))}

        <View style={s.mt16}>
          <View style={s.sectionHeader}>
            <View style={s.sectionBorder} />
            <Text style={s.sectionLabel}>What&apos;s Included</Text>
          </View>
          <View style={s.inclusionsGrid}>
            <View style={s.inclusionCol}>
              {pkg.included.map((item, i) => (
                <View key={i} style={s.inclusionItem}>
                  <Text style={s.checkMark}>✓</Text>
                  <Text style={s.inclusionText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={s.inclusionCol}>
              {NOT_INCLUDED.map((item, i) => (
                <View key={i} style={s.inclusionItem}>
                  <Text style={s.xMark}>✗</Text>
                  <Text style={s.inclusionText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Footer waPhone={waPhone} />
      </Page>
    </Document>
  );
}
