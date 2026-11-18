import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { contactHref, projectCategoryHref, serviceBase, serviceHref } from "@/data/home";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";

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

export default async function ServicePage({ params }: Props) {
  const content = await getContent();
  const { t } = content;
  const service = content.service((await params).slug);
  if (!service) notFound();
  const relatedServices = service.relatedServiceSlugs.map((slug) => content.service(slug)).filter((item) => item !== undefined);
  const copy = t.serviceDetail;

  return <>
    <PageIntro title={service.pageTitle} description={service.description} breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.services, href: "/dich-vu" }, { label: service.title }]} />
    <section className="section content-section service-overview">
      <div className="content-photo" data-reveal="left"><Image src={service.image} alt={format(t.servicesPage.imageAlt, { title: service.title })} fill sizes="(max-width: 760px) 90vw, 48vw" priority /></div>
      <div className="content-copy" data-reveal="right">
        <h2 className="section-title">{copy.heading}</h2>
        <p>{service.description} {copy.intro}</p>
        <h3>{t.servicesPage.prepare}</h3>
        <ul className="spec-list">{service.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="content-note">{copy.note}</p>
        <div className="content-actions"><Link href={contactHref(service.slug)} className="button button-primary">{copy.cta} <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
    <section className="section content-section related-services" aria-labelledby="related-services-title"><h2 id="related-services-title" className="section-title">{copy.related}</h2><div className="related-service-list">{relatedServices.map((related) => <Link key={related.slug} href={serviceHref(related.slug)}><span>{related.title}</span></Link>)}</div></section>
    <div className="section content-return"><Link href={projectCategoryHref(service.slug)} className="detail-link">{copy.seeProjects}</Link></div>
  </>;
}
