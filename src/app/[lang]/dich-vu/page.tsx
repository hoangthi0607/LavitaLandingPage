import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { SectionNav } from "@/components/content/section-nav";
import { contactHref } from "@/data/home";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./services.css";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.servicesPage.metaTitle, t.servicesPage.metaDescription, "/dich-vu");
}

// /dich-vu: split hero with a staggered photo mosaic (each tile jumps to its service), a sticky need-group bar with
// scroll spy, then one block per group: sticky group title on the left, service cards on the right. Ends on the dark
// contact panel (.cta-band). Anchors #group-… and #<slug> are kept.
export default async function ServicesPage() {
  const { company, services, serviceGroups, t } = await getContent();
  const copy = t.servicesPage;
  return <div className="svc-page">
    <section className="section svc-hero" aria-labelledby="services-page-title">
      <div className="svc-hero-copy">
        <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: t.nav.services }]} />
        <h1 id="services-page-title">{copy.title}</h1>
        <p className="lead">{copy.description}</p>
      </div>
      <ul className="svc-mosaic">
        {services.map((service, index) => <li key={service.slug} style={{ "--i": index } as CSSProperties}>
          <a href={`#${service.slug}`}>
            <span className="svc-mosaic-photo"><Image src={service.image} alt="" fill sizes="(max-width: 900px) 46vw, 22vw" priority={index < 2} /></span>
            <span>{service.title}</span>
          </a>
        </li>)}
      </ul>
    </section>

    {/* The group bar only sticks while the groups are on screen. */}
    <div className="svc-body">
    <SectionNav items={serviceGroups.map(({ id, title }) => ({ target: `group-${id}`, title }))} label={t.home.services.entryLabel} />

    <div className="section svc-directory">
      {serviceGroups.map(group => <section key={group.id} className="svc-group" aria-labelledby={`group-${group.id}`}>
        <header className="svc-group-head" data-reveal="left">
          <h2 id={`group-${group.id}`} className="section-title">{group.title}</h2>
          <p>{group.description}</p>
        </header>
        <div className="svc-group-cards">
          {services.filter(service => service.group === group.id).map(service => <article key={service.slug} id={service.slug} className="svc-card" aria-labelledby={`${service.slug}-title`}>
            <div className="svc-card-photo" data-reveal="wipe">
              <div className="svc-card-parallax"><Image src={service.image} alt={format(copy.imageAlt, { title: service.title })} fill sizes="(max-width: 900px) 92vw, 60vw" /></div>
            </div>
            <div className="svc-card-body">
              <div className="svc-card-main" data-reveal="up">
                <h3 id={`${service.slug}-title`}>{service.title}</h3>
                <p>{service.description}</p>
                <div className="content-actions">
                  <Link href={contactHref(service.slug)} className="button button-primary" aria-label={format(copy.discussLabel, { title: service.title })}>{copy.discuss}<ArrowRight size={18} aria-hidden="true" /></Link>
                  <Link href={`/dich-vu/${service.slug}`} className="detail-link">{copy.detail}<span className="sr-only">: {service.title}</span></Link>
                </div>
              </div>
              <div className="svc-card-prepare" data-reveal="up">
                <h4>{copy.prepare}</h4>
                <ul className="spec-list">{service.preparation.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
          </article>)}
        </div>
      </section>)}
    </div>
    </div>

    <section className="cta-band" aria-labelledby="services-next-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="services-next-title">{copy.nextHeading}</h2><p>{copy.nextText}</p></div>
        <div className="cta-band-actions">
          <Link href={contactHref()} className="button button-light">{t.common.contactLavita}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href={company.phoneHref} className="button cta-band-ghost"><Phone size={18} aria-hidden="true" />{company.phone}</a>
        </div>
      </div>
    </section>
  </div>;
}
