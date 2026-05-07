import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { genericMessage } from "@/lib/whatsapp/whatsapp";
import Image from "next/image";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const locale = await getLocale();
  const pfx = locale === "en" ? "" : `/${locale}`;

  const FOOTER_GROUPS = [
    {
      heading: t("itineraries"),
      links: [
        { label: t("istanbul"), href: `${pfx}/packages?region=Istanbul` },
        { label: t("cappadocia"), href: `${pfx}/packages?region=Cappadocia` },
        { label: t("aegean"), href: `${pfx}/packages?region=Aegean` },
        { label: t("mediterranean"), href: `${pfx}/packages?region=Mediterranean` },
        { label: t("blackSea"), href: `${pfx}/packages?region=Black%20Sea` },
        { label: t("easternAnatolia"), href: `${pfx}/packages?region=Eastern%20Anatolia` },
      ],
    },
    {
      heading: t("services"),
      links: [
        { label: t("airportTransfer"), href: `${pfx}/transportation` },
        { label: t("privateDriver"), href: `${pfx}/transportation` },
        { label: t("allPackages"), href: `${pfx}/packages` },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { label: t("privacyPolicy"), href: "/privacy" },
        { label: t("termsConditions"), href: "/terms" },
        { label: t("cancellationPolicy"), href: "/cancellation" },
      ],
    },
  ];

  return (
    <footer className="text-cream relative">
      <div aria-hidden="true" className="absolute inset-0 bg-navy z-5" />
      {/* CTA pitch */}
      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pt-[clamp(80px,10vw,130px)] pb-14 relative z-10">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-5">
          {t("reservations")}
        </p>
        <h3 className="font-display font-light text-[clamp(28px,4vw,56px)] tracking-tight leading-[1.08] mb-8 max-w-[22ch]">
          {t("ctaHeading")}
        </h3>
        <a
          href={genericMessage()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 border border-ochre text-cream px-6 py-4 text-[13px] tracking-[0.16em] uppercase font-medium transition-all duration-300 hover:bg-ochre hover:text-navy group"
        >
          <span>{t("openWhatsapp")}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] relative z-10">
        <div className="w-full h-px bg-cream/20" />
      </div>

      {/* Columns */}
      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Brand col */}
        <div>
          <Image
            src="/sabrina_logo_cropped.png"
            alt="Sabrina Turizm"
            width="140"
            height="48"
            className="h-7 w-auto object-contain brightness-0 invert mb-3"
          />
          <p className="text-cream/60 text-sm leading-relaxed">
            {t("tagline")}
            <br />
            {t("location")}
          </p>
        </div>

        {/* Link groups */}
        {FOOTER_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-4">
              {group.heading}
            </p>
            <div className="flex flex-col gap-1">
              {group.links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="text-sm py-1 text-cream/80 hover:text-cream transition-colors duration-200 w-fit relative group"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-ochre group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Contact col */}
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ochre mb-4">
            {t("reachUs")}
          </p>
          <div className="flex flex-col gap-1">
            <a
              href={genericMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm py-1 text-cream/80 hover:text-cream transition-colors duration-200"
            >
              WhatsApp
            </a>
            <a
              href="mailto:info@sabrinaturizm.com"
              className="text-sm py-1 text-cream/80 hover:text-cream transition-colors duration-200"
            >
              info@sabrinaturizm.com
            </a>
          </div>
        </div>
      </div>

      {/* Base */}
      <div className="max-w-[1320px] mx-auto px-[clamp(20px,4vw,56px)] pb-7 border-t border-cream/10 pt-7 flex flex-col sm:flex-row justify-between gap-3 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-cream/40">
            {t("copyright")}
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-cream/30">
            {t("legal2")}
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-cream/40">
          {t("madeIn")}
        </span>
      </div>
    </footer>
  );
}
