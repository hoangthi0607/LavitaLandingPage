import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactComposer } from "@/components/contact/contact-composer";
import { VietnamMap } from "@/components/contact/vietnam-map";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { company, getProject, getService, site } from "@/data/home";
import { getProduct, getProductCategory } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Liên hệ tư vấn PCCC",
  "Trao đổi với Lavita về dịch vụ và sản phẩm PCCC phù hợp công trình. Liên hệ qua điện thoại hoặc chuẩn bị nội dung email tư vấn.",
  "/lien-he",
);

type ContactSearchParams = {
  "dich-vu"?: string | string[];
  "du-an"?: string | string[];
  "nhom-san-pham"?: string | string[];
  "san-pham"?: string | string[];
};

function singleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

// Structure follows dcons.vn/lien-he: large title, contact blocks and two actions beside a map of Việt Nam.
// The email composer (Lavita's main contact flow) follows directly below.
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<ContactSearchParams>;
}) {
  const query = await searchParams;
  const project = getProject(singleValue(query["du-an"]));
  const service = getService(singleValue(query["dich-vu"])) ?? getService(project?.serviceSlug);
  const product = getProduct(singleValue(query["san-pham"]));
  const productCategory = getProductCategory(product?.categorySlug ?? singleValue(query["nhom-san-pham"]));
  const hasContext = Boolean(service || project || productCategory);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;

  return <>
    <section className="section contact-hero" aria-labelledby="contact-title">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]} />
      <div className="contact-hero-grid">
        <div className="contact-hero-copy">
          <h1 id="contact-title">Thông tin liên hệ</h1>
          {hasContext && <p className="contact-context">Thông tin bạn đã chọn được giữ lại trong phần <a href="#soan-email">soạn email tư vấn</a> bên dưới.</p>}
          <div className="contact-blocks">
            <div className="contact-block">
              <h2>Trụ sở</h2>
              <p><a href={mapsHref} target="_blank" rel="noopener noreferrer">{company.address}<span className="sr-only"> (mở Google Maps trong tab mới)</span></a></p>
            </div>
            <div className="contact-block">
              <h2>Thông tin doanh nghiệp</h2>
              <p>{company.name}<br />Mã số thuế: {company.taxCode}</p>
            </div>
            <div className="contact-block">
              <h2>Liên hệ với chúng tôi</h2>
              <dl className="contact-list">
                <div><dt>Hotline</dt><dd><a href={company.phoneHref}>{company.phone}</a></dd></div>
                <div><dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
                <div><dt>Website</dt><dd><a href={site.url}>{site.url.replace(/^https:\/\//, "")}</a></dd></div>
              </dl>
            </div>
            <div className="contact-hero-actions">
              <Link className="button button-secondary" href="/ho-so-nang-luc">Hồ sơ năng lực</Link>
              <a className="button button-primary" href="#soan-email">Soạn email tư vấn<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <VietnamMap officeLabel="Trụ sở TP. Hồ Chí Minh" />
      </div>
    </section>

    <section id="soan-email" className="section contact-compose-section" aria-labelledby="contact-compose-title">
      <div className="contact-compose-intro" data-reveal="up">
        <h2 id="contact-compose-title">Trao đổi nhu cầu PCCC</h2>
        <p>{hasContext
          ? "Bạn có thể gọi trực tiếp hoặc chuẩn bị email để Lavita hiểu nhu cầu của công trình. Thông tin bạn đã chọn được giữ lại bên dưới."
          : "Bạn có thể gọi trực tiếp hoặc chuẩn bị email để Lavita hiểu dịch vụ và nhu cầu PCCC của công trình."}</p>
        <p>{productCategory ? "Gọi để trao đổi về nhóm sản phẩm bạn quan tâm và nhu cầu của công trình." : "Chưa xác định dịch vụ cần tìm? Gọi để trao đổi về tình trạng công trình và nhu cầu của bạn."} <a href={company.phoneHref}>{company.phone}</a></p>
        <Link className="detail-link" href="/dich-vu">Xem lại các dịch vụ PCCC</Link>
      </div>
      <ContactComposer
        key={`${service?.slug ?? "general"}:${project?.slug ?? "none"}:${productCategory?.slug ?? "none"}:${product?.slug ?? "none"}`}
        initialServiceSlug={service?.slug}
        initialProjectSlug={project?.slug}
        initialProductCategorySlug={productCategory?.slug}
        initialProductSlug={product?.slug}
      />
    </section>
  </>;
}
