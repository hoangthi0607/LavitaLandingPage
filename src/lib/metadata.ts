import type { Metadata } from "next";
import { site } from "@/data/home";
import { localeInfo } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import { alternates } from "@/i18n/urls";

export { absoluteUrl, alternates } from "@/i18n/urls";

export async function pageMetadata(title: string, description: string, path: string): Promise<Metadata> {
  const { locale, t } = await getContent();
  const links = alternates(path, locale);
  const fullTitle = `${title} | Lavita`;
  return {
    title, description, alternates: links,
    openGraph: { type: "website", locale: localeInfo[locale].openGraph, siteName: site.name, url: links.canonical, title: fullTitle, description, images: [{ url: `${site.url}/opengraph-image`, width: 1200, height: 630, alt: t.meta.ogAlt }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [`${site.url}/opengraph-image`] },
  };
}
