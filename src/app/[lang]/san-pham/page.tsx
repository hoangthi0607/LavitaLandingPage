import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, LayoutGrid, Package, PackageSearch, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Pagination } from "@/components/content/pagination";
import { ProductCard } from "@/components/content/product-card";
import { ProductSearch, type SearchCategory, type SearchItem } from "@/components/content/product-search";
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

// Group, search and page links land on the search box above the results (#ket-qua) instead of the top of the page. Links with a query
// load the page normally (see @/i18n/link), so the browser scrolls to the hash.
const listAnchor = "ket-qua";
const toList = (href: string) => `${href}#${listAnchor}`;

// /san-pham: split hero (title, intro, three floating product photos linking to their groups); the catalogue opens
// with the search box (two-column live suggestions), then the group filter on the left beside the product cards,
// and a dark contact band. Filtering stays server-side
// through ?danh-muc / ?q / ?trang.
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const content = await getContent();
  const { company, products, productCategories, t, locale } = content;
  const copy = t.productsPage;
  const query = await searchParams;
  const category = content.productCategory(typeof query["danh-muc"] === "string" ? query["danh-muc"] : undefined);
  const keyword = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const search = normalizeProductSearch(keyword);
  const searchText = (product: (typeof products)[number]) => normalizeProductSearch(`${product.title} ${product.sku ?? ""} ${product.description ?? ""}`);
  const inCategory = products.filter(product => !category || product.categorySlug === category.slug);
  const matches = search ? inCategory.filter(product => searchText(product).includes(search)) : inCategory;
  const pageCount = Math.max(1, Math.ceil(matches.length / productPageSize));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(typeof query.trang === "string" ? query.trang : "1", 10) || 1));
  const items = matches.slice((page - 1) * productPageSize, page * productPageSize);

  const groups = productCategories.map(item => {
    const inGroup = products.filter(product => product.categorySlug === item.slug);
    return { ...item, count: inGroup.length, image: inGroup.find(product => product.images?.length)?.images?.[0].src };
  });
  const showcase = groups.filter(group => group.image).slice(0, 3);
  const categoryTitle = (slug: string) => groups.find(group => group.slug === slug)?.title;
  // Live suggestions search the same products as the full results: the current group only.
  const searchItems: SearchItem[] = inCategory.map(product => ({
    slug: product.slug, title: product.title, sku: product.sku, image: product.images?.[0]?.src,
    group: category ? undefined : categoryTitle(product.categorySlug), text: searchText(product),
  }));
  const searchCategories: SearchCategory[] = groups.map(group => ({
    slug: group.slug, title: group.title, count: group.count, image: group.image, href: toList(catalogueHref(group.slug)), text: normalizeProductSearch(group.title),
  }));

  return <div className="prod-page">
    <section className="section prod-hero" aria-labelledby="products-title">
      <div className="prod-hero-copy">
        <Breadcrumbs items={category ? [{ label: t.common.home, href: "/" }, { label: copy.breadcrumb, href: "/san-pham" }, { label: category.title }] : [{ label: t.common.home, href: "/" }, { label: copy.breadcrumb }]} />
        <h1 id="products-title">{copy.title}</h1>
        <p className="lead">{copy.description}</p>
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
      <div id={listAnchor} className="prod-toolbar">
        <ProductSearch action={toList(localizeHref("/san-pham", locale))} listPath="/san-pham" category={category?.slug} keyword={keyword} items={searchItems} categories={searchCategories} copy={copy} />
      </div>

      <div className="prod-browse">
        <aside className="prod-filters" aria-labelledby="products-filters">
          <h2 id="products-filters" className="prod-filters-title">{copy.filtersHeading}</h2>
          <nav aria-label={copy.tabsLabel}>
            <p className="prod-filters-label">{copy.groupFilter}</p>
            <ul className="prod-groups">
              <li><Link href={toList(catalogueHref(undefined, keyword))} aria-current={!category ? "page" : undefined}>
                <span className="prod-group-thumb"><LayoutGrid size={16} aria-hidden="true" /></span>
                <span className="prod-group-text">{copy.all}</span><small>{products.length}</small>
              </Link></li>
              {groups.map(group => <li key={group.slug}><Link href={toList(catalogueHref(group.slug, keyword))} aria-current={category?.slug === group.slug ? "page" : undefined}>
                <span className="prod-group-thumb">{group.image ? <Image src={group.image} alt="" width={28} height={28} /> : <Package size={16} aria-hidden="true" />}</span>
                <span className="prod-group-text">{group.title}</span><small>{group.count}</small>
              </Link></li>)}
            </ul>
          </nav>
        </aside>

        <div className="prod-results">
          <div className="prod-results-head">
            <div><h2 className="section-title">{category?.title ?? copy.all}</h2>{category && <p>{category.description}</p>}</div>
            <div className="prod-results-meta">
              {items.length > 0 && <p>{format(copy.count, { count: matches.length })}</p>}
              {(keyword || category) && <Link className="prod-clear" href={toList("/san-pham")}>{copy.clearFilters}</Link>}
            </div>
            {keyword && <p className="prod-results-search">{format(copy.resultsFor, { keyword })} <Link href={toList(catalogueHref(category?.slug))}>{copy.clearSearch}</Link></p>}
          </div>

          {items.length > 0 ? <>
            <div className="prod-grid">{items.map(product => <ProductCard key={product.slug} product={product} group={category ? undefined : categoryTitle(product.categorySlug)} copy={copy} />)}</div>
            <Pagination page={page} pageCount={pageCount} href={number => toList(catalogueHref(category?.slug, keyword, number))} label={copy.paginationLabel} />
          </> : <div className="catalogue-empty" data-reveal="up">
            <PackageSearch size={46} strokeWidth={1.4} aria-hidden="true" />
            <h3>{products.length === 0 ? copy.emptyTitle : copy.noMatchTitle}</h3>
            <p>{products.length === 0 ? copy.emptyDescription : copy.noMatchText}</p>
            <div className="content-actions">{(keyword || category) && <Link className="detail-link" href={toList("/san-pham")}>{copy.allCategories}</Link>}</div>
          </div>}
        </div>
      </div>
    </section>

    <section className="cta-band" aria-labelledby="products-cta-title">
      <div className="cta-band-inner" data-reveal="up">
        <h2 id="products-cta-title">{copy.help}</h2>
        <div className="cta-band-actions">
          <Link className="button button-light" href={productContactHref(category?.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="button cta-band-ghost" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a>
        </div>
      </div>
    </section>
  </div>;
}
