import type { Metadata } from "next";
import localFont from "next/font/local";
import { preload } from "react-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CallButton } from "@/components/layout/call-button";
import { businessStructuredData } from "@/data/structured-data";
import { localeInfo, locales } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import { alternates } from "@/lib/metadata";
import "./fonts.css";
import "./globals.css";
import "./content.css";
import "./contact.css";

const manrope = localFont({
  src: "../../../public/fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

// Noto Sans per CJK language (public/fonts/noto-sans-*.css, ~100 unicode-range slices each); vi/en need none.
const cjkFonts: Partial<Record<string, string>> = { zh: "/fonts/noto-sans-sc.css", ko: "/fonts/noto-sans-kr.css", ja: "/fonts/noto-sans-jp.css" };
// The Be Vietnam Pro slices almost every vi/en page needs above the fold (text 400, headings and labels 600).
const latinPreloads = ["latin-400", "vietnamese-400", "latin-600", "vietnamese-600"];

export function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { site, company, locale, t } = await getContent();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: "%s | Lavita" },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: company.name, url: site.url }],
    creator: company.name,
    alternates: alternates("/", locale),
    openGraph: { type: "website", locale: localeInfo[locale].openGraph, siteName: site.name, url: alternates("/", locale).canonical, title: site.title, description: site.description },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [{ url: `${site.url}/opengraph-image`, alt: t.meta.ogAlt }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const content = await getContent();
  const { t, locale } = content;
  const cjk = cjkFonts[locale];
  if (!cjk) for (const name of latinPreloads) preload(`/fonts/be-vietnam-pro/${name}.woff2`, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return <html lang={localeInfo[locale].htmlLang} className={manrope.variable} data-scroll-behavior="smooth"><body>{cjk && <link rel="stylesheet" href={cjk} precedence="fonts" />}<a className="skip-link" href="#main-content">{t.common.skipLink}</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessStructuredData(content)).replace(/</g, "\\u003c") }} /><Header content={{ t: { nav: t.nav }, navigation: content.navigation, services: content.services.filter(service => service.hasProjects).map(({ slug, title }) => ({ slug, title })), phone: content.company.phone, phoneHref: content.company.phoneHref, tagline: t.company.tagline }} /><main id="main-content" tabIndex={-1}>{children}</main><Footer /><CallButton /></body></html>;
}
