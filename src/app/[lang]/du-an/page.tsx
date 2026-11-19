import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Pagination } from "@/components/content/pagination";
import { ProjectCards } from "@/components/content/project-cards";
import { contactHref, projectPageSize } from "@/data/home";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./projects.css";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.projectsPage.title, t.projectsPage.description, "/du-an");
}
type Props = { searchParams: Promise<{ "dich-vu"?: string | string[]; trang?: string | string[] }> };

const single = (value?: string | string[]) => (typeof value === "string" ? value : undefined);

// Tab and page links open at the list (#ket-qua). Links with a query load the page normally (see @/i18n/link).
const listAnchor = "ket-qua";
function projectsHref(service?: string, page = 1) {
  const query = new URLSearchParams();
  if (service) query.set("dich-vu", service);
  if (page > 1) query.set("trang", String(page));
  return `${query.size ? `/du-an?${query}` : "/du-an"}#${listAnchor}`;
}

// /du-an: split title and intro, a slow full-width reel of every project photo (decorative, pauses on hover), scope
// tabs with counts, project cards that lift on hover, and the shared dark contact band.
export default async function ProjectsPage({ searchParams }: Props) {
  const content = await getContent();
  const { projects, services, t } = content;
  const copy = t.projectsPage;
  const params = await searchParams;
  const requestedService = content.service(single(params["dich-vu"]));
  const selectedService = requestedService?.hasProjects ? requestedService : undefined;
  const filtered = selectedService ? projects.filter(project => project.serviceSlug === selectedService.slug) : [...projects];
  const pageCount = Math.max(1, Math.ceil(filtered.length / projectPageSize));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(single(params.trang) ?? "1", 10) || 1));
  const items = filtered.slice((page - 1) * projectPageSize, page * projectPageSize);
  const tabs = services.filter(service => service.hasProjects).map(service => ({ ...service, count: projects.filter(project => project.serviceSlug === service.slug).length }));
  const reel = (copyIndex: number) => projects.map(project => <li key={`${copyIndex}-${project.slug}`} className={copyIndex ? "is-copy" : undefined}>
    <Image src={project.image} alt="" fill sizes="320px" />
    <span>{project.title}</span>
  </li>);

  return <div className="projects-page">
    <section className="section prj-hero" aria-labelledby="projects-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, ...(selectedService ? [{ label: copy.title, href: "/du-an" }, { label: selectedService.title }] : [{ label: copy.title }])]} />
      <div className="prj-hero-grid">
        <h1 id="projects-title">{copy.title}</h1>
        <p className="prj-hero-lead">{copy.description}</p>
      </div>
    </section>

    {/* Photos only: every project is also a card below, so the reel carries no links of its own. */}
    <div className="prj-reel" aria-hidden="true">
      <ul className="prj-reel-track">{reel(0)}{reel(1)}</ul>
    </div>

    <section className="section prj-body" aria-label={selectedService ? format(copy.serviceProjects, { service: selectedService.title }) : copy.allProjects}>
      <nav id={listAnchor} className="prj-tabs" aria-label={copy.tabsLabel}>
        <Link href={projectsHref()} aria-current={!selectedService ? "page" : undefined}>{copy.all}<span>{projects.length}</span></Link>
        {tabs.map(service => <Link key={service.slug} href={projectsHref(service.slug)} aria-current={selectedService?.slug === service.slug ? "page" : undefined}>{service.title}<span>{service.count}</span></Link>)}
      </nav>

      {items.length > 0 ? <ProjectCards items={items} /> : <div className="projects-empty">
        <h2>{copy.emptyHeading}</h2>
        <p>{copy.emptyText}</p>
        <Link href={contactHref(selectedService?.slug)} className="detail-link">{t.common.contactLavita}</Link>
      </div>}

      <Pagination page={page} pageCount={pageCount} href={number => projectsHref(selectedService?.slug, number)} label={copy.paginationLabel} />
    </section>

    <section className="cta-band" aria-labelledby="projects-next-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="projects-next-title">{copy.nextHeading}</h2><p>{copy.nextText}</p></div>
        <div className="cta-band-actions">
          <Link href={contactHref(selectedService?.slug)} className="button button-light">{t.common.contactLavita}<ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="/ho-so-nang-luc" className="button cta-band-ghost">{t.common.viewProfile}</Link>
        </div>
      </div>
    </section>
  </div>;
}
