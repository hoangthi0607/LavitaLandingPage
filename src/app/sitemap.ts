import type { MetadataRoute } from "next";
import { projectBase, serviceBase, site, slideBase } from "@/data/home";
import { productBase } from "@/data/products";
import { locales } from "@/i18n/config";
import { absoluteUrl, alternates } from "@/i18n/urls";

// One entry per page and language, each listing its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; images?: string[] }[] = [
    { path: "/", images: [...new Set([...slideBase, ...projectBase.filter(project => project.featured)].map(item => `${site.url}${item.image}`))] },
    ...["/dich-vu", "/du-an", "/san-pham", "/ve-lavita", "/ho-so-nang-luc", "/tin-tuc", "/lien-he"].map(path => ({ path })),
    ...serviceBase.map(service => ({ path: `/dich-vu/${service.slug}`, images: [`${site.url}${service.image}`] })),
    ...projectBase.map(project => ({ path: `/du-an/${project.slug}`, images: [`${site.url}${project.image}`] })),
    ...productBase.map(product => ({ path: `/san-pham/${product.slug}`, ...(product.images?.length ? { images: product.images.map(image => `${site.url}${image.src}`) } : {}) })),
  ];
  return pages.flatMap(page => locales.map(locale => ({
    url: absoluteUrl(page.path, locale),
    alternates: { languages: alternates(page.path, locale).languages },
    ...(page.images ? { images: page.images } : {}),
  })));
}
