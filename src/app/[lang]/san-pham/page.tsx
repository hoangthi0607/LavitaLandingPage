import Image from "next/image";
import { ArrowRight, Package, PackageSearch, Phone, Search } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { catalogueHref, normalizeProductSearch, productContactHref } from "@/data/products";
import { format, localizeHref } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./catalogue.css";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.productsPage.title, t.productsPage.description, "/san-pham");
}

type Query = { "danh-muc"?: string | string[]; q?: string | string[] };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const content = await getContent();
  const { company, products, productCategories, t, locale } = content;
  const copy = t.productsPage;
  const query = await searchParams;
  const category = content.productCategory(typeof query["danh-muc"] === "string" ? query["danh-muc"] : undefined);
  const keyword = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const search = normalizeProductSearch(keyword);
  const items = products.filter(product => (!category || product.categorySlug === category.slug)
    && (!search || normalizeProductSearch(`${product.title} ${product.sku ?? ""} ${product.description}`).includes(search)));

  return <>
    <PageIntro title={copy.title} description={copy.description}
      breadcrumbs={category ? [{ label: t.common.home, href: "/" }, { label: copy.breadcrumb, href: "/san-pham" }, { label: category.title }] : [{ label: t.common.home, href: "/" }, { label: copy.breadcrumb }]} />
    <section className="section catalogue" aria-label={copy.sectionLabel}>
      <nav className="catalogue-tabs" aria-label={copy.tabsLabel} data-reveal="up">
        <Link href={catalogueHref(undefined, keyword)} aria-current={!category ? "page" : undefined}>{copy.all}</Link>
        {productCategories.map(item => <Link key={item.slug} href={catalogueHref(item.slug, keyword)} aria-current={category?.slug === item.slug ? "page" : undefined}>{item.title}</Link>)}
      </nav>
      <div className="catalogue-content">
        <div className="catalogue-heading"><h2 className="section-title">{category?.title ?? copy.all}</h2>{category && <p>{category.description}</p>}</div>
        <form className="catalogue-search" action={localizeHref("/san-pham", locale)} method="get" role="search">
          {category && <input type="hidden" name="danh-muc" value={category.slug} />}
          <label htmlFor="catalogue-search">{copy.searchLabel}</label>
          <div><input key={`${category?.slug ?? "all"}:${keyword}`} id="catalogue-search" type="search" name="q" defaultValue={keyword} maxLength={100} placeholder={copy.searchPlaceholder} /><button type="submit"><Search size={19} aria-hidden="true" /><span>{copy.searchButton}</span></button></div>
        </form>
        <p className="catalogue-help">{copy.help} <a href={company.phoneHref}><Phone size={16} aria-hidden="true" />{company.phone}</a></p>
        {keyword && <div className="catalogue-search-summary"><p>{format(copy.resultsFor, { keyword })}</p><Link href={catalogueHref(category?.slug)}>{copy.clearSearch}</Link></div>}
        {items.length > 0 ? <>
          <p className="catalogue-count">{format(copy.count, { count: items.length })}</p>
          <div className="catalogue-grid">{items.map(product => <article className="catalogue-product" key={product.slug} data-reveal="up">
            <Link href={`/san-pham/${product.slug}`} className="catalogue-product-image" aria-label={format(copy.viewLabel, { title: product.title })}>
              {product.image ? <Image src={product.image} alt={product.title} fill sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 30vw" /> : <Package size={52} aria-hidden="true" />}
            </Link>
            {product.sku && <p className="catalogue-sku">{product.sku}</p>}
            <h3><Link href={`/san-pham/${product.slug}`}>{product.title}</Link></h3>
            <p>{product.description}</p>
            <Link href={`/san-pham/${product.slug}`} className="detail-link">{copy.view}</Link>
          </article>)}</div>
        </> : <div className="catalogue-empty">
          <PackageSearch size={46} strokeWidth={1.4} aria-hidden="true" />
          <h3>{products.length === 0 ? copy.emptyTitle : copy.noMatchTitle}</h3>
          <p>{products.length === 0 ? copy.emptyDescription : copy.noMatchText}</p>
          <div className="content-actions"><Link className="button button-primary" href={productContactHref(category?.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>{(keyword || category) && <Link className="detail-link" href="/san-pham">{copy.allCategories}</Link>}</div>
        </div>}
      </div>
    </section>
  </>;
}
