import { ArrowRight } from "lucide-react";
import { ContactComposer } from "@/components/contact/contact-composer";
import { VietnamMap } from "@/components/contact/vietnam-map";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.contactPage.metaTitle, t.contactPage.metaDescription, "/lien-he");
}

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
  const content = await getContent();
  const { company, site, t } = content;
  const copy = t.contactPage;
  const query = await searchParams;
  const project = content.project(singleValue(query["du-an"]));
  const service = content.service(singleValue(query["dich-vu"])) ?? content.service(project?.serviceSlug);
  const product = content.product(singleValue(query["san-pham"]));
  const productCategory = content.productCategory(product?.categorySlug ?? singleValue(query["nhom-san-pham"]));
  const hasContext = Boolean(service || project || productCategory);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;

  return <>
    <section className="section contact-hero" aria-labelledby="contact-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: t.nav.contact }]} />
      <div className="contact-hero-grid">
        <div className="contact-hero-copy">
          <h1 id="contact-title">{copy.title}</h1>
          {hasContext && <p className="contact-context">{copy.contextBefore}<a href="#soan-email">{copy.contextLink}</a>{copy.contextAfter}</p>}
          <div className="contact-blocks">
            <div className="contact-block">
              <h2>{copy.headOffice}</h2>
              <p><a href={mapsHref} target="_blank" rel="noopener noreferrer" lang="vi">{company.address}<span className="sr-only" lang={content.locale}> {copy.mapsNewTab}</span></a></p>
            </div>
            <div className="contact-block">
              <h2>{copy.businessInfo}</h2>
              <p>{company.name}<br />{t.common.taxCode}: {company.taxCode}</p>
            </div>
            <div className="contact-block">
              <h2>{copy.contactUs}</h2>
              <dl className="contact-list">
                <div><dt>{t.common.hotline}</dt><dd><a href={company.phoneHref}>{company.phone}</a></dd></div>
                <div><dt>{t.common.email}</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
                <div><dt>{t.common.website}</dt><dd><a href={site.url}>{site.url.replace(/^https:\/\//, "")}</a></dd></div>
              </dl>
            </div>
            <div className="contact-hero-actions">
              <Link className="button button-secondary" href="/ho-so-nang-luc">{copy.profile}</Link>
              <a className="button button-primary" href="#soan-email">{copy.compose}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <VietnamMap officeLabel={copy.officeLabel} labels={{ map: copy.mapLabel, paracel: copy.paracel, spratly: copy.spratly }} intl={content.intl} />
      </div>
    </section>

    <section id="soan-email" className="section contact-compose-section" aria-labelledby="contact-compose-title">
      <div className="contact-compose-intro" data-reveal="up">
        <h2 id="contact-compose-title">{copy.composeHeading}</h2>
        <p>{hasContext ? copy.introWithContext : copy.introGeneral}</p>
        <p>{productCategory ? copy.callProduct : copy.callGeneral} <a href={company.phoneHref}>{company.phone}</a></p>
        <Link className="detail-link" href="/dich-vu">{copy.reviewServices}</Link>
      </div>
      <ContactComposer
        key={`${service?.slug ?? "general"}:${project?.slug ?? "none"}:${productCategory?.slug ?? "none"}:${product?.slug ?? "none"}`}
        initialServiceSlug={service?.slug}
        initialProjectSlug={project?.slug}
        initialProductCategorySlug={productCategory?.slug}
        initialProductSlug={product?.slug}
        data={{
          email: company.email, phone: company.phone, phoneHref: company.phoneHref,
          services: content.services.map(({ slug, title }) => ({ slug, title })),
          projects: content.projects.map(({ slug, title, tag }) => ({ slug, title, tag })),
          productCategories: content.productCategories.map(({ slug, title }) => ({ slug, title })),
          products: content.products.map(({ slug, title, sku, categorySlug }) => ({ slug, title, sku, categorySlug })),
        }}
        labels={{ ...t.composer, or: t.common.or, call: t.common.call }}
      />
    </section>
  </>;
}
