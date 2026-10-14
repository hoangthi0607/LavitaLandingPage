import type { MetadataRoute } from "next";
import { projects, services, site, slides } from "@/data/home";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, images: [...new Set([...slides, ...projects].map(item => `${site.url}${item.image}`))] },
    ...["/dich-vu", "/du-an", "/ve-lavita", "/lien-he"].map(path => ({ url: `${site.url}${path}` })),
    ...services.map(service => ({ url: `${site.url}/dich-vu/${service.slug}`, images: [`${site.url}${service.image}`] })),
    ...projects.map(project => ({ url: `${site.url}/du-an/${project.slug}`, images: [`${site.url}${project.image}`] })),
  ];
}
