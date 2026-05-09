import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { PremadePackagePublic } from "@/lib/db/premade-packages";
import { registerFonts } from "@/lib/pdf/fonts";
import { colors, fonts, spacing } from "@/lib/pdf/theme";

registerFonts();

function fmt(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

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
  tagPill: {
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
    fontSize: 30,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 8,
    lineHeight: 1.1,
  },
  coverDates: {
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
  dayRow: {
    flexDirection: "row",
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dayRowAlt: {
    backgroundColor: colors.lightGray,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.ochre,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  dayNum: {
    color: colors.navy,
    fontSize: 9,
    fontWeight: 700,
  },
  dayContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 3,
  },
  dayDesc: {
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
  tiersRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  tierCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.ruleLight,
    padding: 10,
  },
  tierName: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.ochre,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.ruleLight,
    paddingBottom: 6,
  },
  tierRow: {
    marginBottom: 5,
  },
  tierLabel: {
    fontSize: 7,
    color: colors.inkSoft,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 1,
  },
  tierValue: {
    fontSize: 9,
    color: colors.navy,
    fontWeight: 700,
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
  footerBrand: { fontSize: 9, color: colors.ochre, fontWeight: 700 },
  footerTagline: { fontSize: 7, color: colors.inkSoft },
  footerWa: { fontSize: 8, color: colors.inkSoft },
  pageNum: { fontSize: 8, color: colors.inkSoft },
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
  pkg: PremadePackagePublic;
  waPhone?: string;
  baseUrl?: string;
}

function abs(src: string, base: string) {
  return src.startsWith("http") ? src : `${base}${src}`;
}

export function PremadePackagePDF({ pkg, waPhone = "", baseUrl = "" }: Props) {
  const dateRange = pkg.dates?.[0]
    ? `${fmt(pkg.dates[0].startDate)} → ${fmt(pkg.dates[0].endDate)}`
    : `${fmt(pkg.startDate)} → ${fmt(pkg.endDate)}`;

  return (
    <Document title={pkg.name} author="Sabrina Tourism">
      {/* Cover */}
      <Page size="A4" style={s.coverPage}>
        <Image src={abs(pkg.heroImage, baseUrl)} style={s.heroImage} />
        <View style={s.coverBody}>
          <Text style={s.tagPill}>Fixed-Date Group Package</Text>
          <Text style={s.coverTitle}>{pkg.name}</Text>
          <Text style={s.coverDates}>{dateRange}</Text>
          <Text style={s.coverDesc}>{pkg.shortDescription}</Text>
          {pkg.price != null && (
            <>
              <Text style={s.coverPrice}>{pkg.currency} {pkg.price.toLocaleString()}</Text>
              <Text style={s.coverPriceSub}>Per person · starting from</Text>
            </>
          )}
        </View>
        <Footer waPhone={waPhone} />
      </Page>

      {/* Itinerary + Inclusions + Tiers */}
      <Page size="A4" style={s.page}>
        {pkg.itinerary.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <View style={s.sectionBorder} />
              <Text style={s.sectionLabel}>Itinerary</Text>
            </View>
            {pkg.itinerary.map((day, i) => (
              <View key={day.day} style={[s.dayRow, i % 2 === 1 ? s.dayRowAlt : {}]} wrap={false}>
                <View style={s.dayCircle}>
                  <Text style={s.dayNum}>{day.day}</Text>
                </View>
                <View style={s.dayContent}>
                  <Text style={s.dayTitle}>{day.title}</Text>
                  <Text style={s.dayDesc}>{day.description}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {(pkg.included.length > 0 || pkg.notIncluded.length > 0) && (
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
                {pkg.notIncluded.map((item, i) => (
                  <View key={i} style={s.inclusionItem}>
                    <Text style={s.xMark}>✗</Text>
                    <Text style={s.inclusionText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <Footer waPhone={waPhone} />
      </Page>
    </Document>
  );
}
