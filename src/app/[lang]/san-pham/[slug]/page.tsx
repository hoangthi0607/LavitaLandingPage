import { notFound } from "next/navigation";
import { ArrowRight, FileText, Package, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ProductCard } from "@/components/content/product-card";
import { ProductGallery } from "@/components/content/product-gallery";
import { catalogueHref, productBase, productContactHref } from "@/data/products";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "../catalogue.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productBase.map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const content = await getContent();
  const product = content.product((await params).slug);
  if (!product) notFound();
  const category = content.productCategory(product.categorySlug);
  return pageMetadata(product.title, product.description ?? category?.description ?? content.t.productsPage.description, `/san-pham/${product.slug}`);
}

// Product detail (19/11/2026): the first screen holds the gallery (cross-fade, pointer magnifier, thumbnails) beside
// the facts and actions; specifications arrive row by row; description and documents follow; then products from the
// same group and the shared contact panel.
export default async function ProductPage({ params }: Props) {
  const content = await getContent();
  const { company, products, t } = content;
  const copy = t.productsPage;
  const product = content.product((await params).slug);
  if (!product) notFound();
  const category = content.productCategory(product.categorySlug);
  if (!category) notFound();
  const images = (product.images ?? []).map((image, index) => ({ ...image, title: format(copy.imageTitle, { title: product.title, index: index + 1 }) }));
  // Up to four neighbours from the same group, starting after this product so each page shows different ones.
  const group = products.filter(item => item.categorySlug === category.slug);
  const at = group.findIndex(item => item.slug === product.slug);
  const related = [...group.slice(at + 1), ...group.slice(0, Math.max(0, at))].slice(0, 4);
  const hasArticle = Boolean(product.body?.length || product.documents?.length);

  return <div className="pd-page">
    <section className="section pd-hero" aria-labelledby="product-title">
      <div className="pd-media">
        {images.length > 0
          ? <ProductGallery images={images} labels={t.gallery} title={format(copy.galleryLabel, { title: product.title })} />
          : <div className="pd-stage pd-stage-empty"><Package size={64} strokeWidth={1.4} aria-hidden="true" /></div>}
      </div>
      <div className="pd-info">
        <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.breadcrumb, href: "/san-pham" }, { label: category.title, href: catalogueHref(category.slug) }, { label: product.title }]} />
        <Link className="pd-group" href={catalogueHref(category.slug)}>{category.title}</Link>
        <h1 id="product-title">{product.title}</h1>
        {product.sku && <p className="pd-sku">{format(copy.sku, { sku: product.sku })}</p>}
        <p className="pd-lead">{product.description ?? category.description}</p>
        <div className="pd-actions">
          <Link className="button button-primary" href={productContactHref(category.slug, product.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="button pd-call" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a>
        </div>
        {product.specifications && product.specifications.length > 0 && <div className="pd-specs">
          <h2>{copy.specsHeading}</h2>
          <dl>{product.specifications.map((item, index) => <div key={item.name} data-reveal="up" style={{ "--reveal-delay": `${Math.min(index, 6) * 70}ms` } as React.CSSProperties}><dt>{item.name}</dt><dd>{item.value}</dd></div>)}</dl>
        </div>}
      </div>
    </section>

    {hasArticle && <section className="section pd-article" aria-label={copy.bodyHeading}>
      {product.body && product.body.length > 0 && <div className="pd-body" data-reveal="up">
        <h2 className="section-title">{copy.bodyHeading}</h2>
        {product.body.map((block, index) => "heading" in block ? <h3 key={index}>{block.heading}</h3> : <p key={index}>{block.text}</p>)}
      </div>}
      {product.documents && product.documents.length > 0 && <aside className="pd-docs" data-reveal="up">
        <h2 className="section-title">{copy.documentsHeading}</h2>
        <ul>{product.documents.map(item => <li key={item.href}><a href={item.href} target="_blank" rel="noopener"><span className="pd-doc-icon"><FileText size={20} aria-hidden="true" /></span><span>{item.label}</span><span className="sr-only"> {t.common.newTab}</span></a></li>)}</ul>
      </aside>}
    </section>}

    {related.length > 0 && <section className="section pd-related" aria-labelledby="related-products-title">
      <div className="pd-related-head" data-reveal="up">
        <h2 id="related-products-title" className="section-title">{copy.related}</h2>
        <Link className="detail-link" href={catalogueHref(category.slug)}>{format(copy.seeCategory, { category: category.title })}</Link>
      </div>
      <div className="prod-grid">{related.map(item => <ProductCard key={item.slug} product={item} copy={copy} />)}</div>
    </section>}

    <section className="cta-band" aria-labelledby="product-cta-title">
      <div className="cta-band-inner" data-reveal="up">
        <h2 id="product-cta-title">{copy.help}</h2>
        <div className="cta-band-actions">
          <Link className="button button-light" href={productContactHref(category.slug, product.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="button cta-band-ghost" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a>
        </div>
      </div>
    </section>
  </div>;
}
