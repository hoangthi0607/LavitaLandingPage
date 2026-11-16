import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, PackageSearch, Phone, Search } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { company } from "@/data/home";
import { catalogueHref, getProductCategory, normalizeProductSearch, productCatalogue, productCategories, productContactHref, products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import "./catalogue.css";

export const metadata = pageMetadata(productCatalogue.title, productCatalogue.description, "/san-pham");

type Query = { "danh-muc"?: string | string[]; q?: string | string[] };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const category = getProductCategory(typeof query["danh-muc"] === "string" ? query["danh-muc"] : undefined);
  const keyword = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const search = normalizeProductSearch(keyword);
  const items = products.filter(product => (!category || product.categorySlug === category.slug)
    && (!search || normalizeProductSearch(`${product.title} ${product.sku ?? ""} ${product.description}`).includes(search)));

  return <>
    <PageIntro title={productCatalogue.title} description={productCatalogue.description}
      breadcrumbs={category ? [{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm", href: "/san-pham" }, { label: category.title }] : [{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]} />
    <section className="section catalogue" aria-label="Danh mục sản phẩm PCCC">
      <aside className="catalogue-sidebar">
        <nav aria-labelledby="catalogue-categories-title">
          <h2 id="catalogue-categories-title">Nhóm sản phẩm</h2>
          <ul>
            <li><Link href={catalogueHref(undefined, keyword)} aria-current={!category ? "page" : undefined}>Tất cả sản phẩm<ArrowRight size={16} aria-hidden="true" /></Link></li>
            {productCategories.map(item => <li key={item.slug}><Link href={catalogueHref(item.slug, keyword)} aria-current={category?.slug === item.slug ? "page" : undefined}>{item.title}<ArrowRight size={16} aria-hidden="true" /></Link></li>)}
          </ul>
        </nav>
        <div className="catalogue-help"><p>Cần trao đổi về sản phẩm?</p><a href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a></div>
      </aside>
      <div className="catalogue-content">
        <div className="catalogue-heading"><h2>{category?.title ?? "Tất cả sản phẩm"}</h2>{category && <p>{category.description}</p>}</div>
        <form className="catalogue-search" action="/san-pham" method="get" role="search">
          {category && <input type="hidden" name="danh-muc" value={category.slug} />}
          <label htmlFor="catalogue-search">Tìm sản phẩm</label>
          <div><input key={`${category?.slug ?? "all"}:${keyword}`} id="catalogue-search" type="search" name="q" defaultValue={keyword} maxLength={100} placeholder="Nhập tên hoặc mã sản phẩm" /><button type="submit"><Search size={19} aria-hidden="true" /><span>Tìm kiếm</span></button></div>
        </form>
        {keyword && <div className="catalogue-search-summary"><p>Kết quả tìm kiếm cho “{keyword}”</p><Link href={catalogueHref(category?.slug)}>Xóa tìm kiếm</Link></div>}
        {items.length > 0 ? <>
          <p className="catalogue-count">{items.length} sản phẩm</p>
          <div className="catalogue-grid">{items.map(product => <article className="catalogue-product" key={product.slug}>
            <Link href={`/san-pham/${product.slug}`} className="catalogue-product-image" aria-label={`Xem ${product.title}`}>
              {product.image ? <Image src={product.image} alt={product.title} fill sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 30vw" /> : <Package size={52} aria-hidden="true" />}
            </Link>
            {product.sku && <p className="catalogue-sku">{product.sku}</p>}
            <h3><Link href={`/san-pham/${product.slug}`}>{product.title}</Link></h3>
            <p>{product.description}</p>
            <Link href={`/san-pham/${product.slug}`} className="detail-link">Xem sản phẩm<ArrowRight size={17} aria-hidden="true" /></Link>
          </article>)}</div>
        </> : <div className="catalogue-empty">
          <PackageSearch size={46} strokeWidth={1.4} aria-hidden="true" />
          <h3>{products.length === 0 ? productCatalogue.emptyTitle : "Chưa tìm thấy sản phẩm phù hợp"}</h3>
          <p>{products.length === 0 ? productCatalogue.emptyDescription : "Thử từ khóa khác hoặc chọn một nhóm sản phẩm khác. Bạn cũng có thể trao đổi trực tiếp với Lavita."}</p>
          <div className="content-actions"><Link className="button button-primary" href={productContactHref(category?.slug)}>Trao đổi về sản phẩm<ArrowRight size={18} aria-hidden="true" /></Link>{(keyword || category) && <Link className="detail-link" href="/san-pham">Xem tất cả danh mục<ArrowRight size={18} aria-hidden="true" /></Link>}</div>
        </div>}
      </div>
    </section>
  </>;
}
