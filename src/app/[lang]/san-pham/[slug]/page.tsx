import { notFound } from "next/navigation";
import { ArrowRight, FileText, Package, Phone } from "lucide-react";
import { DocumentGallery } from "@/components/content/document-gallery";
import { PageIntro } from "@/components/content/page-intro";
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

export default async function ProductPage({ params }: Props) {
  const content = await getContent();
  const { company, t, intl } = content;
  const copy = t.productsPage;
  const product = content.product((await params).slug);
  if (!product) notFound();
  const category = content.productCategory(product.categorySlug);
  if (!category) notFound();
  const images = (product.images ?? []).map((image, index) => ({ ...image, title: format(copy.imageTitle, { title: product.title, index: index + 1 }) }));
  return <>
    <PageIntro title={product.title} description={product.description ?? category.description} breadcrumbs={[{ label: t.common.home, href: "/" }, { label: copy.breadcrumb, href: "/san-pham" }, { label: category.title, href: catalogueHref(category.slug) }, { label: product.title }]} />
    <section className="section catalogue-detail" aria-label={copy.detailLabel}>
      <div className="catalogue-detail-media" data-reveal="left">
        {images.length > 0
          ? <DocumentGallery title={format(copy.galleryLabel, { title: product.title })} items={images} labels={t.gallery} variant="product" />
          : <div className="catalogue-product-image catalogue-detail-image"><Package size={64} aria-hidden="true" /></div>}
      </div>
      <div className="catalogue-detail-copy" data-reveal="right">
        <h2 className="section-title">{copy.detailHeading}</h2>
        {product.sku && <p className="catalogue-sku">{format(copy.sku, { sku: product.sku })}</p>}
        {product.specifications && product.specifications.length > 0 && <>
          <h3 className="catalogue-subheading">{copy.specsHeading}</h3>
          <dl className="catalogue-specifications">{product.specifications.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.value}</dd></div>)}</dl>
        </>}
        <div className="content-actions"><Link className="button button-primary" href={productContactHref(category.slug, product.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link><a className="detail-link" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a></div>
        <Link className="detail-link" href={catalogueHref(category.slug)}>{format(copy.seeCategory, { category: category.title.toLocaleLowerCase(intl) })}</Link>
      </div>
    </section>
    {(product.body?.length || product.documents?.length) ? <section className="section catalogue-article" aria-label={copy.bodyHeading}>
      {product.body && product.body.length > 0 && <div className="catalogue-body" data-reveal="up">
        <h2 className="section-title">{copy.bodyHeading}</h2>
        {product.body.map((block, index) => "heading" in block ? <h3 key={index}>{block.heading}</h3> : <p key={index}>{block.text}</p>)}
      </div>}
      {product.documents && product.documents.length > 0 && <div className="catalogue-documents" data-reveal="up">
        <h2 className="section-title">{copy.documentsHeading}</h2>
        <ul>{product.documents.map(item => <li key={item.href}><a href={item.href} target="_blank" rel="noopener"><FileText size={20} aria-hidden="true" /><span>{item.label}</span><span className="sr-only"> {t.common.newTab}</span></a></li>)}</ul>
      </div>}
    </section> : null}
  </>;
}
