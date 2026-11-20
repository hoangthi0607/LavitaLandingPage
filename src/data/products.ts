import type { Locale } from "@/i18n/config";
import { productCatalog } from "./product-catalog";

// Categories follow the product groups of the old lavitacons.vn catalogue (fire protection first, then HVAC).
// Category names live in src/i18n/dictionaries.
export const productCategorySlugs = [
  "van-pccc", "dau-phun-sprinkler", "phu-kien-duong-ong",
  "mieng-gio", "van-gio", "ong-gio", "tieu-am", "vav-cav", "quat-thong-gio", "tu-dien-mang-cap",
] as const;
export type ProductCategorySlug = (typeof productCategorySlugs)[number];
export const productPageSize = 12;

export type ProductImage = { src: string; width: number; height: number };
export type ProductSpecification = { name: string; value: string };
export type ProductBlock = { heading: string } | { text: string };
type ProductText = { title: string; description?: string; specifications?: readonly ProductSpecification[]; body?: readonly ProductBlock[] };

// title/description/specifications/body are the Vietnamese text; add `translations` for the other languages
// (missing languages fall back to Vietnamese). The first image is the catalogue thumbnail.
export type Product = ProductText & {
  slug: string;
  categorySlug: ProductCategorySlug;
  sku?: string;
  images?: readonly ProductImage[];
  documents?: readonly { label: string; href: string }[];
  translations?: Partial<Record<Locale, ProductText>>;
};

export const productBase: readonly Product[] = productCatalog;

const isCategory = (slug?: string): slug is ProductCategorySlug => productCategorySlugs.includes(slug as ProductCategorySlug);

export function catalogueHref(categorySlug?: string, keyword = "", page = 1) {
  const query = new URLSearchParams();
  if (isCategory(categorySlug)) query.set("danh-muc", categorySlug);
  if (keyword.trim()) query.set("q", keyword.trim().slice(0, 100));
  if (page > 1) query.set("trang", String(page));
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

export { normalizeSearch as normalizeProductSearch } from "@/lib/normalize-search";
