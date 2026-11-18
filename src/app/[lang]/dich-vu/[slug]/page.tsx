import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Phone, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ProjectCards } from "@/components/content/project-cards";
import { ServiceToc } from "@/components/content/service-toc";
import { contactHref, projectCategoryHref, serviceBase, serviceSectionStyles, type ServiceSlug } from "@/data/home";
import { catalogueHref } from "@/data/products";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "../../du-an/projects.css";
import "../service.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return serviceBase.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const content = await getContent();
  const service = content.service((await params).slug);
  if (!service) notFound();
  return pageMetadata(service.pageTitle, service.description, `/dich-vu/${service.slug}`);
}

const delay = (index: number) => ({ "--reveal-delay": `${Math.min(index, 6) * 90}ms` }) as CSSProperties;

// Service page: full-bleed photo hero; large lead beside "what to prepare"; sticky contents with scrollspy beside
// the sections (each laid out as steps, cards, tiles or a checklist, see serviceSectionStyles); matching projects
// (or product groups for equipment supply); a dark call-to-action band; related services as photo cards.
export default async function ServicePage({ params }: Props) {
  const content = await getContent();
  const { t, company } = content;
  const service = content.service((await params).slug);
  if (!service) notFound();
  const copy = t.serviceDetail;
  const styles = serviceSectionStyles[service.slug as ServiceSlug];
  const relatedServices = service.relatedServiceSlugs.map((slug) => content.service(slug)).filter((item) => item !== undefined);
  const projects = content.projects.filter(project => project.serviceSlug === service.slug).slice(0, 4);
  const productGroups = service.hasProjects ? [] : content.productCategories.map(category => ({
    ...category, image: content.products.find(product => product.categorySlug === category.slug)?.images?.[0],
  }));
  const showcaseId = service.hasProjects ? "du-an" : "san-pham";
  const showcaseTitle = service.hasProjects ? t.home.projects.heading : t.productsPage.sectionLabel;
  const tocItems = [
    ...service.detail.sections.map((section, index) => ({ id: `muc-${index + 1}`, title: section.heading })),
    ...((service.hasProjects ? projects.length : productGroups.length) ? [{ id: showcaseId, title: showcaseTitle }] : []),
  ];

  return <div className="service-page">
    <section className="service-hero">
      <Image className="service-hero-photo" src={service.image} alt="" fill sizes="100vw" priority />
      <div className="service-hero-copy">
        <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: t.nav.services, href: "/dich-vu" }, { label: service.title }]} />
        <h1>{service.pageTitle}</h1>
        <p>{service.description}</p>
        <div className="service-hero-actions">
          <Link href={contactHref(service.slug)} className="button button-primary">{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href={company.phoneHref} className="button service-button-ghost"><Phone size={17} aria-hidden="true" />{format(t.nav.call, { phone: company.phone })}</a>
        </div>
      </div>
    </section>

    <section className="section service-intro" aria-label={copy.heading}>
      <p className="service-intro-lead" data-reveal="left">{service.detail.lead}</p>
      <aside className="service-prepare" data-reveal="right">
        <h2>{t.servicesPage.prepare}</h2>
        <ul>{service.preparation.map((item) => <li key={item}><CheckCircle2 size={20} aria-hidden="true" />{item}</li>)}</ul>
        <p>{copy.note}</p>
      </aside>
    </section>

    <div className="section service-body">
      <aside className="service-aside"><ServiceToc label={copy.contents} items={tocItems} /></aside>
      <div className="service-main">
        {service.detail.sections.map((section, index) => {
          const style = styles[index] ?? "checks";
          return <section key={section.heading} id={`muc-${index + 1}`} className={`service-block service-block-${style}`} aria-labelledby={`muc-${index + 1}-title`}>
            <header data-reveal="up"><h2 id={`muc-${index + 1}-title`} className="section-title">{section.heading}</h2>{section.intro && <p>{section.intro}</p>}</header>
            {style === "steps" && <ol className="service-steps">{section.items.map((item, itemIndex) => <li key={item.text} data-reveal="up" style={delay(itemIndex)}>
              <span className="service-step-number" aria-hidden="true">{itemIndex + 1}</span>
              <div>{item.label && <h3>{item.label}</h3>}<p>{item.text}</p></div>
            </li>)}</ol>}
            {style === "cards" && <ul className="service-points">{section.items.map((item, itemIndex) => <li key={item.text} data-reveal="up" style={delay(itemIndex)}>
              <ShieldCheck className="service-card-icon" size={26} strokeWidth={1.75} aria-hidden="true" />
              {item.label && <h3>{item.label}</h3>}<p>{item.text}</p>
            </li>)}</ul>}
            {style === "tiles" && <ul className="service-tiles">{section.items.map((item, itemIndex) => <li key={item.text} data-reveal="scale" style={delay(itemIndex)}>
              {item.label && <h3>{item.label}</h3>}<p>{item.text}</p>
            </li>)}</ul>}
            {style === "checks" && <ul className="service-checks">{section.items.map((item, itemIndex) => <li key={item.text} data-reveal="up" style={delay(itemIndex)}>
              <CheckCircle2 size={22} aria-hidden="true" /><p>{item.label && <strong>{item.label}. </strong>}{item.text}</p>
            </li>)}</ul>}
          </section>;
        })}

        {service.hasProjects && projects.length > 0 && <section id={showcaseId} className="service-block" aria-labelledby={`${showcaseId}-title`}>
          <header data-reveal="up" className="service-block-head-row"><h2 id={`${showcaseId}-title`} className="section-title">{showcaseTitle}</h2><Link href={projectCategoryHref(service.slug)} className="detail-link">{copy.seeProjects}</Link></header>
          <ProjectCards items={projects} />
        </section>}
        {!service.hasProjects && productGroups.length > 0 && <section id={showcaseId} className="service-block" aria-labelledby={`${showcaseId}-title`}>
          <header data-reveal="up" className="service-block-head-row"><h2 id={`${showcaseId}-title`} className="section-title">{showcaseTitle}</h2><Link href="/san-pham" className="detail-link">{copy.productsLink}</Link></header>
          <ul className="service-products">{productGroups.map((group, index) => <li key={group.slug} data-reveal="up" style={delay(index % 4)}>
            <Link href={catalogueHref(group.slug)}>
              <span className="service-product-photo">{group.image && <Image src={group.image.src} alt="" fill sizes="(max-width: 640px) 45vw, 20vw" />}</span>
              <span className="service-product-title">{group.title}</span>
            </Link>
          </li>)}</ul>
        </section>}
      </div>
    </div>

    <section className="service-cta">
      <div className="service-cta-inner" data-reveal="up">
        <div><h2>{copy.heading}</h2><p>{copy.intro}</p></div>
        <div className="service-cta-actions">
          <Link href={contactHref(service.slug)} className="button button-primary">{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href={company.phoneHref} className="button service-button-ghost"><Phone size={17} aria-hidden="true" />{company.phone}</a>
        </div>
      </div>
    </section>

    {relatedServices.length > 0 && <section className="section service-related" aria-labelledby="related-services-title">
      <h2 id="related-services-title" className="section-title" data-reveal="up">{copy.related}</h2>
      <ul>{relatedServices.map((related, index) => <li key={related.slug} data-reveal="up" style={delay(index)}>
        <Link href={`/dich-vu/${related.slug}`}>
          <span className="service-related-photo"><Image src={related.image} alt="" fill sizes="(max-width: 760px) 92vw, 40vw" /></span>
          <span className="service-related-copy"><strong>{related.pageTitle}</strong><span>{related.description}</span></span>
        </Link>
      </li>)}</ul>
    </section>}
  </div>;
}
