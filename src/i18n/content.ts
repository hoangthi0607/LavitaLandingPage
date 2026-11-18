// Importing next/root-params already keeps this module (and every dictionary) out of client bundles.
import { lang } from "next/root-params";
import { aboutImages, company, growthMilestones, historyPending, navigationKeys, profileBase, projectBase, serviceBase, serviceGroupIds, slideBase, site } from "@/data/home";
import { productBase, productCategorySlugs } from "@/data/products";
import { defaultLocale, hasLocale, localeInfo, type Locale } from "./config";
import { en } from "./dictionaries/en";
import { ja } from "./dictionaries/ja";
import { ko } from "./dictionaries/ko";
import { vi, type Dictionary } from "./dictionaries/vi";
import { zh } from "./dictionaries/zh";

const dictionaries: Record<Locale, Dictionary> = { en, vi, zh, ko, ja };

/** Locale of the current request, from the [lang] root segment (the proxy maps unprefixed URLs to "vi"). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return hasLocale(value) ? value : defaultLocale;
}

function build(locale: Locale) {
  const t = dictionaries[locale];
  const services = serviceBase.map(base => ({ ...base, ...t.services[base.slug] }));
  const projects = projectBase.map(base => ({ ...base, ...t.projects[base.slug] }));
  const productCategories = productCategorySlugs.map(slug => ({ slug, ...t.productCategories[slug] }));
  const products = productBase.map(product => ({ ...product, ...product.translations?.[locale], translations: undefined }));
  return {
    locale, intl: localeInfo[locale].intl, t,
    site: { ...site, title: t.meta.title, description: t.meta.description },
    company: { ...company, name: t.company.name },
    navigation: navigationKeys.map(item => ({ href: item.href, label: t.nav[item.key] })),
    slides: slideBase.map((base, index) => ({ ...base, ...t.home.slides[index] })),
    services,
    serviceGroups: serviceGroupIds.map(id => ({ id, ...t.serviceGroups[id] })),
    projects,
    productCategories,
    products,
    about: {
      ...t.about,
      images: aboutImages,
      coreValues: t.about.coreValues.map((value, index) => ({ ...value, image: aboutImages.coreValues[index] })),
      history: t.about.history.map((item, index) => ({ ...item, pending: historyPending[index] ?? true })),
      milestones: growthMilestones,
    },
    profile: {
      ...t.profile,
      ...profileBase,
      sections: profileBase.sectionIds.map((id, index) => ({ id, title: t.profile.sections[index] })),
      legalDocuments: profileBase.legalDocuments.map((pages, index) => ({
        title: t.profile.legalDocuments[index].title,
        pages: pages.map((page, pageIndex) => ({ ...page, title: t.profile.legalDocuments[index].pages[pageIndex] })),
      })),
      credentials: profileBase.credentials.map((item, index) => ({ ...item, title: t.profile.credentials[index] })),
      projectChapters: profileBase.projectChapters.map((chapter, index) => ({
        ...chapter, photos: chapter.photos.map((photo, photoIndex) => ({ ...photo, alt: t.profile.chapterPhotos[index][photoIndex] })),
      })),
    },
    service: (slug?: string) => services.find(service => service.slug === slug),
    project: (slug?: string) => projects.find(project => project.slug === slug),
    productCategory: (slug?: string) => productCategories.find(category => category.slug === slug),
    product: (slug?: string) => products.find(product => product.slug === slug),
  };
}

export type Content = ReturnType<typeof build>;
export type LocalizedService = Content["services"][number];
export type LocalizedProject = Content["projects"][number];

const cache = new Map<Locale, Content>();
export function getContentFor(locale: Locale): Content {
  let content = cache.get(locale);
  if (!content) cache.set(locale, (content = build(locale)));
  return content;
}

/** Localized content for the current request. */
export async function getContent() {
  return getContentFor(await getLocale());
}
