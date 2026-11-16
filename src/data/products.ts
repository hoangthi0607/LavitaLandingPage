// Initial category structure only. Add verified Lavita products and local images
// here when supplied; the catalogue deliberately contains no sample inventory.
export const productCatalogue = {
  title: "Sản phẩm PCCC",
  description: "Tìm hiểu các nhóm sản phẩm PCCC và trao đổi nhu cầu của công trình với Lavita.",
  emptyTitle: "Danh mục sản phẩm đang được cập nhật",
  emptyDescription: "Thông tin và hình ảnh sản phẩm sẽ được bổ sung tại đây. Bạn có thể liên hệ Lavita để trao đổi về nhóm sản phẩm đang quan tâm.",
};

export const productCategories = [
  { slug: "thiet-bi-bao-chay", title: "Thiết bị báo cháy", description: "Nhóm trung tâm báo cháy, đầu báo và thiết bị cảnh báo." },
  { slug: "thiet-bi-chua-chay", title: "Thiết bị chữa cháy", description: "Nhóm bình chữa cháy, vòi và các thiết bị chữa cháy." },
  { slug: "dau-phun-sprinkler", title: "Đầu phun sprinkler", description: "Nhóm đầu phun cho hệ thống chữa cháy tự động." },
  { slug: "van-va-phu-kien", title: "Van & phụ kiện", description: "Nhóm van và phụ kiện cho hệ thống PCCC." },
] as const;

export type ProductCategory = (typeof productCategories)[number];
export type Product = {
  slug: string;
  title: string;
  categorySlug: ProductCategory["slug"];
  description: string;
  image?: string;
  sku?: string;
  specifications?: readonly { name: string; value: string }[];
};

export const products: readonly Product[] = [];

export function getProductCategory(slug?: string) {
  return productCategories.find(category => category.slug === slug);
}

export function getProduct(slug?: string) {
  return products.find(product => product.slug === slug);
}

export function catalogueHref(categorySlug?: string, keyword = "") {
  const category = getProductCategory(categorySlug);
  const query = new URLSearchParams();
  if (category) query.set("danh-muc", category.slug);
  if (keyword.trim()) query.set("q", keyword.trim().slice(0, 100));
  return `/san-pham${query.size ? `?${query}` : ""}`;
}

export function productContactHref(categorySlug?: string, productSlug?: string) {
  const product = getProduct(productSlug);
  const category = getProductCategory(product?.categorySlug ?? categorySlug);
  const query = new URLSearchParams();
  if (category) query.set("nhom-san-pham", category.slug);
  if (product) query.set("san-pham", product.slug);
  return `/lien-he${query.size ? `?${query}` : ""}`;
}

export function normalizeProductSearch(value: string) {
  return value.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}
