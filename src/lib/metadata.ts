import type { Metadata } from "next";
import { site } from "@/data/home";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = `${title} | Lavita`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: "website", locale: "vi_VN", siteName: site.name, url, title: fullTitle, description, images: [{ url: `${site.url}/opengraph-image`, width: 1200, height: 630, alt: "Lavita – Giải pháp phòng cháy chữa cháy" }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [`${site.url}/opengraph-image`] },
  };
}
