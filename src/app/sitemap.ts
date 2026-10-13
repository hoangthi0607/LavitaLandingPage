import type { MetadataRoute } from "next";
import { projects, site, slides } from "@/data/home";

export default function sitemap(): MetadataRoute.Sitemap {
  // Anchors are sections of this page, not separate crawlable pages.
  return [{ url: `${site.url}/`, images: [...new Set([...slides, ...projects].map(item => `${site.url}${item.image}`))] }];
}
