import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Pagination } from "@/components/content/pagination";
import { ProjectCards } from "@/components/content/project-cards";
import { contactHref, getService, projectPortfolio, projects, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "./projects.css";

export const metadata = pageMetadata(projectPortfolio.title, projectPortfolio.description, "/du-an");
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
  const params = await searchParams;
  const selectedService = getService(single(params["dich-vu"]));
  const filtered = selectedService ? projects.filter(project => project.serviceSlug === selectedService.slug) : [...projects];
  const pageCount = Math.max(1, Math.ceil(filtered.length / projectPortfolio.pageSize));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(single(params.trang) ?? "1", 10) || 1));
  const items = filtered.slice((page - 1) * projectPortfolio.pageSize, page * projectPortfolio.pageSize);

  return <div className="projects-page">
    <section className="section projects-head" aria-labelledby="projects-title">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, ...(selectedService ? [{ label: projectPortfolio.title, href: "/du-an" }, { label: selectedService.title }] : [{ label: projectPortfolio.title }])]} />
      <h1 id="projects-title" data-reveal="up">{projectPortfolio.title}</h1>
      <p className="projects-lead" data-reveal="up">{projectPortfolio.description}</p>
      <nav className="projects-tabs" aria-label="Hạng mục dự án PCCC" data-reveal="up">
        <Link href={projectsHref()} aria-current={!selectedService ? "page" : undefined}>{projectPortfolio.allLabel}</Link>
        {services.map(service => <Link key={service.slug} href={projectsHref(service.slug)} aria-current={selectedService?.slug === service.slug ? "page" : undefined}>{service.title}</Link>)}
      </nav>
    </section>

    <section className="section projects-body" aria-label={selectedService ? `Dự án ${selectedService.title}` : "Tất cả dự án"}>
      {items.length > 0 ? <ProjectCards items={items} /> : <div className="projects-empty">
        <h2>Đang cập nhật công trình trong hạng mục này</h2>
        <p>Bạn có thể trao đổi trực tiếp với Lavita để tìm hiểu thêm về dịch vụ.</p>
        <Link href={contactHref(selectedService?.slug)} className="detail-link">Trao đổi với Lavita</Link>
      </div>}

      <Pagination page={page} pageCount={pageCount} href={number => projectsHref(selectedService?.slug, number)} label="Phân trang dự án" />
    </section>

    <section className="section content-next"><div><h2>Công trình của bạn cần giải pháp PCCC?</h2><p>Trao đổi nhu cầu với Lavita hoặc tìm hiểu đội ngũ thi công, hồ sơ pháp lý trong hồ sơ năng lực.</p></div>
      <div className="content-actions"><Link href={contactHref(selectedService?.slug)} className="button button-primary">Trao đổi với Lavita<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/ho-so-nang-luc" className="button button-secondary">Xem hồ sơ năng lực</Link></div>
    </section>
  </div>;
}
