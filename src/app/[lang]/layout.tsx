import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { businessStructuredData } from "@/data/structured-data";
import { localeInfo, locales } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import { alternates } from "@/lib/metadata";
import "./globals.css";
import "./content.css";
import "./contact.css";

const manrope = localFont({
  src: "../../../public/fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

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
  return <html lang={localeInfo[locale].htmlLang} className={manrope.variable}><body><a className="skip-link" href="#main-content">{t.common.skipLink}</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessStructuredData(content)).replace(/</g, "\\u003c") }} /><Header content={{ t: { nav: t.nav }, navigation: content.navigation, services: content.services.filter(service => service.hasProjects).map(({ slug, title }) => ({ slug, title })), phone: content.company.phone, phoneHref: content.company.phoneHref, tagline: t.company.tagline }} /><main id="main-content" tabIndex={-1}>{children}</main><Footer /></body></html>;
}
