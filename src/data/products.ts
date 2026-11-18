import type { Locale } from "@/i18n/config";

// Initial category structure only. Category names live in src/i18n/dictionaries. Add verified Lavita
// products and local images here when supplied; the catalogue deliberately contains no sample inventory.
export const productCategorySlugs = ["thiet-bi-bao-chay", "thiet-bi-chua-chay", "dau-phun-sprinkler", "van-va-phu-kien"] as const;
export type ProductCategorySlug = (typeof productCategorySlugs)[number];

// title/description are the Vietnamese text; add `translations` for the other languages
// (missing languages fall back to Vietnamese).
export type Product = {
  slug: string;
  title: string;
  categorySlug: ProductCategorySlug;
  description: string;
  image?: string;
  sku?: string;
  specifications?: readonly { name: string; value: string }[];
  translations?: Partial<Record<Locale, { title: string; description: string; specifications?: readonly { name: string; value: string }[] }>>;
};

export const productBase: readonly Product[] = [];

const isCategory = (slug?: string): slug is ProductCategorySlug => productCategorySlugs.includes(slug as ProductCategorySlug);

export function catalogueHref(categorySlug?: string, keyword = "") {
  const query = new URLSearchParams();
  if (isCategory(categorySlug)) query.set("danh-muc", categorySlug);
  if (keyword.trim()) query.set("q", keyword.trim().slice(0, 100));
  return `/san-pham${query.size ? `?${query}` : ""}`;
}

export function productContactHref(categorySlug?: string, productSlug?: string) {
  const product = productBase.find(item => item.slug === productSlug);
  const category = product?.categorySlug ?? (isCategory(categorySlug) ? categorySlug : undefined);
  const query = new URLSearchParams();
  if (category) query.set("nhom-san-pham", category);
  if (product) query.set("san-pham", product.slug);
  return `/lien-he${query.size ? `?${query}` : ""}`;
}

export function normalizeProductSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
}
