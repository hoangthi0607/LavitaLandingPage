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

function projectsHref(service?: string, page = 1) {
  const query = new URLSearchParams();
  if (service) query.set("dich-vu", service);
  if (page > 1) query.set("trang", String(page));
  return query.size ? `/du-an?${query}` : "/du-an";
}

// Structure follows dcons.vn/du-an: large title, text category tabs, two-column cards with spec rows, numbered pagination.
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

  return <div className="projects-page">
    <section className="section projects-head" aria-labelledby="projects-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, ...(selectedService ? [{ label: copy.title, href: "/du-an" }, { label: selectedService.title }] : [{ label: copy.title }])]} />
      <h1 id="projects-title" data-reveal="up">{copy.title}</h1>
      <p className="projects-lead" data-reveal="up">{copy.description}</p>
      <nav className="projects-tabs" aria-label={copy.tabsLabel} data-reveal="up">
        <Link href={projectsHref()} aria-current={!selectedService ? "page" : undefined}>{copy.all}</Link>
        {services.filter(service => service.hasProjects).map(service => <Link key={service.slug} href={projectsHref(service.slug)} aria-current={selectedService?.slug === service.slug ? "page" : undefined}>{service.title}</Link>)}
      </nav>
    </section>

    <section className="section projects-body" aria-label={selectedService ? format(copy.serviceProjects, { service: selectedService.title }) : copy.allProjects}>
      {items.length > 0 ? <ProjectCards items={items} /> : <div className="projects-empty">
        <h2>{copy.emptyHeading}</h2>
        <p>{copy.emptyText}</p>
        <Link href={contactHref(selectedService?.slug)} className="detail-link">{t.common.contactLavita}</Link>
      </div>}

      <Pagination page={page} pageCount={pageCount} href={number => projectsHref(selectedService?.slug, number)} label={copy.paginationLabel} />
    </section>

    <section className="section content-next"><div><h2>{copy.nextHeading}</h2><p>{copy.nextText}</p></div>
      <div className="content-actions"><Link href={contactHref(selectedService?.slug)} className="button button-primary">{t.common.contactLavita}<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/ho-so-nang-luc" className="button button-secondary">{t.common.viewProfile}</Link></div>
    </section>
  </div>;
}
