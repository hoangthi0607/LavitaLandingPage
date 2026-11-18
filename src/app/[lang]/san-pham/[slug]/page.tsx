import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Package, Phone } from "lucide-react";
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
  return pageMetadata(product.title, product.description, `/san-pham/${product.slug}`);
}

export default async function ProductPage({ params }: Props) {
  const content = await getContent();
  const { company, t, intl } = content;
  const copy = t.productsPage;
  const product = content.product((await params).slug);
  if (!product) notFound();
  const category = content.productCategory(product.categorySlug);
  if (!category) notFound();
  return <>
    <PageIntro title={product.title} description={product.description} breadcrumbs={[{ label: t.common.home, href: "/" }, { label: copy.breadcrumb, href: "/san-pham" }, { label: category.title, href: catalogueHref(category.slug) }, { label: product.title }]} />
    <section className="section catalogue-detail" aria-label={copy.detailLabel}>
      <div className="catalogue-product-image catalogue-detail-image" data-reveal="left">{product.image ? <Image src={product.image} alt={product.title} fill sizes="(max-width: 760px) 90vw, 50vw" priority /> : <Package size={64} aria-hidden="true" />}</div>
      <div className="catalogue-detail-copy" data-reveal="right"><h2 className="section-title">{copy.detailHeading}</h2>{product.sku && <p className="catalogue-sku">{format(copy.sku, { sku: product.sku })}</p>}<p>{product.description}</p>
        {product.specifications && product.specifications.length > 0 && <dl className="catalogue-specifications">{product.specifications.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.value}</dd></div>)}</dl>}
        <div className="content-actions"><Link className="button button-primary" href={productContactHref(category.slug, product.slug)}>{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link><a className="detail-link" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a></div>
        <Link className="detail-link" href={catalogueHref(category.slug)}>{format(copy.seeCategory, { category: category.title.toLocaleLowerCase(intl) })}</Link>
      </div>
    </section>
  </>;
}
