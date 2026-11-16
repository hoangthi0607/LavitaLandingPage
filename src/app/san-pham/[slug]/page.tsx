import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Package, Phone } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { company } from "@/data/home";
import { catalogueHref, getProduct, getProductCategory, productContactHref, products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import "../catalogue.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return pageMetadata(product.title, product.description, `/san-pham/${product.slug}`);
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getProductCategory(product.categorySlug);
  if (!category) notFound();
  return <>
    <PageIntro title={product.title} description={product.description} breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm", href: "/san-pham" }, { label: category.title, href: catalogueHref(category.slug) }, { label: product.title }]} />
    <section className="section catalogue-detail" aria-label="Thông tin sản phẩm">
      <div className="catalogue-product-image catalogue-detail-image">{product.image ? <Image src={product.image} alt={product.title} fill sizes="(max-width: 760px) 90vw, 50vw" priority /> : <Package size={64} aria-hidden="true" />}</div>
      <div className="catalogue-detail-copy"><h2>Thông tin sản phẩm</h2>{product.sku && <p className="catalogue-sku">Mã sản phẩm: {product.sku}</p>}<p>{product.description}</p>
        {product.specifications && product.specifications.length > 0 && <dl className="catalogue-specifications">{product.specifications.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.value}</dd></div>)}</dl>}
        <div className="content-actions"><Link className="button button-primary" href={productContactHref(category.slug, product.slug)}>Trao đổi về sản phẩm<ArrowRight size={18} aria-hidden="true" /></Link><a className="detail-link" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a></div>
        <Link className="detail-link" href={catalogueHref(category.slug)}>Xem nhóm {category.title.toLocaleLowerCase("vi-VN")}<ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  </>;
}
