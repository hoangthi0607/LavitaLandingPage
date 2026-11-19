import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, LayoutGrid, Package, PackageSearch, Phone, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Pagination } from "@/components/content/pagination";
import { catalogueHref, normalizeProductSearch, productContactHref, productPageSize } from "@/data/products";
import { format, localizeHref } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./catalogue.css";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.productsPage.title, t.productsPage.description, "/san-pham");
}

type Query = { "danh-muc"?: string | string[]; q?: string | string[]; trang?: string | string[] };

// Group, search and page links land on the results (#ket-qua) instead of the top of the page. Links with a query
// load the page normally (see @/i18n/link), so the browser scrolls to the hash.
const listAnchor = "ket-qua";
const toList = (href: string) => `${href}#${listAnchor}`;

// /san-pham: split hero (title, search, three floating product photos linking to their groups), product groups as
// photo cards with counts, product cards that lift on hover, and a dark contact band. Filtering stays server-side
// through ?danh-muc / ?q / ?trang.
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const content = await getContent();
  const { company, products, productCategories, t, locale } = content;
  const copy = t.productsPage;
  const query = await searchParams;
  const category = content.productCategory(typeof query["danh-muc"] === "string" ? query["danh-muc"] : undefined);
  const keyword = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const search = normalizeProductSearch(keyword);
  const matches = products.filter(product => (!category || product.categorySlug === category.slug)
    && (!search || normalizeProductSearch(`${product.title} ${product.sku ?? ""} ${product.description ?? ""}`).includes(search)));
  const pageCount = Math.max(1, Math.ceil(matches.length / productPageSize));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(typeof query.trang === "string" ? query.trang : "1", 10) || 1));
  const items = matches.slice((page - 1) * productPageSize, page * productPageSize);

  const groups = productCategories.map(item => {
    const inGroup = products.filter(product => product.categorySlug === item.slug);
    return { ...item, count: inGroup.length, image: inGroup.find(product => product.images?.length)?.images?.[0].src };
  });
  const showcase = groups.filter(group => group.image).slice(0, 3);
  const categoryTitle = (slug: string) => groups.find(group => group.slug === slug)?.title;

  return <div className="prod-page">
    <section className="section prod-hero" aria-labelledby="products-title">
      <div className="prod-hero-copy">
        <Breadcrumbs items={category ? [{ label: t.common.home, href: "/" }, { label: copy.breadcrumb, href: "/san-pham" }, { label: category.title }] : [{ label: t.common.home, href: "/" }, { label: copy.breadcrumb }]} />
        <h1 id="products-title">{copy.title}</h1>
        <p className="lead">{copy.description}</p>
        <form className="prod-search" action={toList(localizeHref("/san-pham", locale))} method="get" role="search">
          {category && <input type="hidden" name="danh-muc" value={category.slug} />}
          <label htmlFor="catalogue-search" className="sr-only">{copy.searchLabel}</label>
          <Search className="prod-search-icon" size={20} aria-hidden="true" />
          <input key={`${category?.slug ?? "all"}:${keyword}`} id="catalogue-search" type="search" name="q" defaultValue={keyword} maxLength={100} placeholder={copy.searchPlaceholder} />
          <button type="submit">{copy.searchButton}</button>
        </form>
        <p className="prod-help">{copy.help} <a href={company.phoneHref}><Phone size={16} aria-hidden="true" />{company.phone}</a></p>
      </div>
      <ul className="prod-float" aria-label={copy.tabsLabel}>
        {showcase.map((group, index) => <li key={group.slug} style={{ "--i": index } as CSSProperties}>
          <Link href={toList(catalogueHref(group.slug))}>
            <Image src={group.image!} alt="" fill sizes="(max-width: 900px) 40vw, 18vw" priority={index === 0} />
            <span>{group.title}</span>
          </Link>
        </li>)}
      </ul>
    </section>

    <section className="section prod-catalogue" aria-label={copy.sectionLabel}>
      <nav className="prod-groups" aria-label={copy.tabsLabel}>
        <Link href={toList(catalogueHref(undefined, keyword))} aria-current={!category ? "page" : undefined}>
          <span className="prod-group-thumb"><LayoutGrid size={22} aria-hidden="true" /></span>
          <span className="prod-group-text">{copy.all}<small>{format(copy.count, { count: products.length })}</small></span>
        </Link>
        {groups.map(group => <Link key={group.slug} href={toList(catalogueHref(group.slug, keyword))} aria-current={category?.slug === group.slug ? "page" : undefined}>
          <span className="prod-group-thumb">{group.image ? <Image src={group.image} alt="" width={52} height={52} /> : <Package size={22} aria-hidden="true" />}</span>
          <span className="prod-group-text">{group.title}<small>{format(copy.count, { count: group.count })}</small></span>
        </Link>)}
      </nav>

      <div id={listAnchor} className="prod-results-head" data-reveal="up">
        <div><h2 className="section-title">{category?.title ?? copy.all}</h2>{category && <p>{category.description}</p>}</div>
        <div className="prod-results-meta">
          {items.length > 0 && <p>{format(copy.count, { count: matches.length })}</p>}
          {keyword && <p className="prod-results-search">{format(copy.resultsFor, { keyword })} <Link href={toList(catalogueHref(category?.slug))}>{copy.clearSearch}</Link></p>}
        </div>
      </div>

      {items.length > 0 ? <>
        <div className="prod-grid">{items.map(product => <article className="prod-card" key={product.slug} data-reveal="up">
          <div className="prod-card-image">
            {product.images?.[0] ? <Image src={product.images[0].src} alt={product.title} fill sizes="(max-width: 480px) 90vw, (max-width: 1024px) 45vw, 24vw" /> : <Package size={52} strokeWidth={1.4} aria-hidden="true" />}
            <span className="prod-card-cta" aria-hidden="true">{copy.view}</span>
          </div>
          <div className="prod-card-body">
            {!category && <p className="prod-card-group">{categoryTitle(product.categorySlug)}</p>}
            <h3><Link href={`/san-pham/${product.slug}`}>{product.title}</Link></h3>
            {product.sku && <p className="prod-card-sku">{format(copy.sku, { sku: product.sku })}</p>}
            {product.description && <p className="prod-card-desc">{product.description}</p>}
          </div>
        </article>)}</div>
        <Pagination page={page} pageCount={pageCount} href={number => toList(catalogueHref(category?.slug, keyword, number))} label={copy.paginationLabel} />
      </> : <div className="catalogue-empty" data-reveal="up">
        <PackageSearch size={46} strokeWidth={1.4} aria-hidden="true" />
        <h3>{products.length === 0 ? copy.emptyTitle : copy.noMatchTitle}</h3>
        <p>{products.length === 0 ? copy.emptyDescription : copy.noMatchText}</p>
        <div className="content-actions">{(keyword || category) && <Link className="detail-link" href={toList("/san-pham")}>{copy.allCategories}</Link>}</div>
      </div>}
    </section>

    <section className="prod-cta" aria-labelledby="products-cta-title">
      <div className="prod-cta-inner" data-reveal="up">
        <h2 id="products-cta-title">{copy.help}</h2>
        <div className="prod-cta-actions">
          <Link className="button button-light" href={productContactHref(category?.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="button prod-cta-phone" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a>
        </div>
      </div>
    </section>
  </div>;
}
