import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { contactHref } from "@/data/home";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.servicesPage.metaTitle, t.servicesPage.metaDescription, "/dich-vu");
}

// dcons.vn visual language: section titles with an accent bar, photo + copy rows alternating sides.
export default async function ServicesPage() {
  const { services, serviceGroups, t } = await getContent();
  const copy = t.servicesPage;
  let row = 0;
  return <>
    <PageIntro title={copy.title} description={copy.description} breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.services }]} />
    <div className="section service-directory">
      {serviceGroups.map(group => <section key={group.id} className="service-group" aria-labelledby={`group-${group.id}`}>
        <div className="service-group-intro" data-reveal="up"><h2 id={`group-${group.id}`} className="section-title">{group.title}</h2><p>{group.description}</p></div>
        <div className="service-cards">
          {services.filter(service => service.group === group.id).map(service => {
            const reverse = row++ % 2 === 1;
            return <article key={service.slug} id={service.slug} className={`service-card${reverse ? " is-reverse" : ""}`}>
              <div className="service-card-photo" data-reveal={reverse ? "right" : "left"}><Image src={service.image} alt={format(copy.imageAlt, { title: service.title })} fill sizes="(max-width: 900px) 92vw, 46vw" /></div>
              <div className="service-card-copy" data-reveal={reverse ? "left" : "right"}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <h4>{copy.prepare}</h4>
                <ul className="spec-list">{service.preparation.map(item => <li key={item}>{item}</li>)}</ul>
                <div className="content-actions">
                  <Link href={contactHref(service.slug)} className="button button-primary" aria-label={format(copy.discussLabel, { title: service.title })}>{copy.discuss}<ArrowRight size={18} aria-hidden="true" /></Link>
                  <Link href={`/dich-vu/${service.slug}`} className="detail-link">{copy.detail}</Link>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>)}
    </div>
    <section className="section content-next">
      <div><h2>{copy.nextHeading}</h2><p>{copy.nextText}</p></div>
      <Link href={contactHref()} className="button button-primary">{t.common.contactLavita}<ArrowRight size={18} aria-hidden="true" /></Link>
    </section>
  </>;
}
