import type { MetadataRoute } from "next";
import { projects, services, site, slides } from "@/data/home";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, images: [...new Set([...slides, ...projects].map(item => `${site.url}${item.image}`))] },
    ...["/dich-vu", "/du-an", "/san-pham", "/ve-lavita", "/ho-so-nang-luc", "/lien-he"].map(path => ({ url: `${site.url}${path}` })),
    ...services.map(service => ({ url: `${site.url}/dich-vu/${service.slug}`, images: [`${site.url}${service.image}`] })),
    ...projects.map(project => ({ url: `${site.url}/du-an/${project.slug}`, images: [`${site.url}${project.image}`] })),
    ...products.map(product => ({ url: `${site.url}/san-pham/${product.slug}`, ...(product.image ? { images: [`${site.url}${product.image}`] } : {}) })),
  ];
}
