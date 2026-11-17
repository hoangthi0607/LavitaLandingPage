import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { contactHref, getService, projectLocations, projectPortfolio, projects, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "./projects.css";

export const metadata = pageMetadata(projectPortfolio.title, projectPortfolio.description, "/du-an");
type Props = { searchParams: Promise<{ "dich-vu"?: string | string[]; "khu-vuc"?: string | string[]; q?: string | string[] }> };

const single = (value?: string | string[]) => (typeof value === "string" ? value : undefined);
// Diacritic-insensitive matching so "dai nhat" finds "Đại Nhật".
const normalize = (value: string) => value.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();

function projectsHref({ service, location, keyword }: { service?: string; location?: string; keyword?: string }) {
  const query = new URLSearchParams();
  if (service) query.set("dich-vu", service);
  if (location) query.set("khu-vuc", location);
  if (keyword) query.set("q", keyword);
  return query.size ? `/du-an?${query}` : "/du-an";
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedService = getService(single(params["dich-vu"]));
  const location = projectLocations.find(item => item === single(params["khu-vuc"]));
  const keyword = (single(params.q) ?? "").trim().slice(0, 100);
  const needle = normalize(keyword);
  const items = projects.filter(project =>
    (!selectedService || project.serviceSlug === selectedService.slug)
    && (!location || project.location === location)
    && (!needle || normalize(`${project.title} ${project.description}`).includes(needle)));
  const filtered = Boolean(location || keyword);
  const heading = selectedService ? `${selectedService.title} PCCC` : "Tất cả dự án";

  return <div className="projects-page">
    <div className="projects-banner"><Image src={projectPortfolio.banner.src} alt={projectPortfolio.banner.alt} fill sizes="100vw" preload /></div>

    <div className="projects-breadcrumb-bar">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, ...(selectedService ? [{ label: projectPortfolio.title, href: "/du-an" }, { label: selectedService.title }] : [{ label: projectPortfolio.title }])]} />
    </div>

    <section className="section projects-search" aria-labelledby="projects-title">
      <div className="projects-search-copy"><h1 id="projects-title">{projectPortfolio.title}</h1><p>{projectPortfolio.description}</p></div>
      <form className="projects-search-form" action="/du-an" method="get" role="search" aria-label="Tìm kiếm dự án">
        {selectedService && <input type="hidden" name="dich-vu" value={selectedService.slug} />}
        <label className="sr-only" htmlFor="projects-keyword">Tên dự án</label>
        <input key={`q:${keyword}`} id="projects-keyword" type="search" name="q" defaultValue={keyword} maxLength={100} placeholder="Tên dự án" />
        <label className="sr-only" htmlFor="projects-location">Khu vực</label>
        <select key={`l:${location ?? ""}`} id="projects-location" name="khu-vuc" defaultValue={location ?? ""}>
          <option value="">Theo khu vực</option>
          {projectLocations.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="submit"><Search size={19} aria-hidden="true" /><span>Tìm kiếm</span></button>
      </form>
    </section>

    <div className="section projects-results">
      <nav className="projects-tabs" aria-label="Hạng mục dự án PCCC">
        <Link href={projectsHref({ location, keyword })} aria-current={!selectedService ? "page" : undefined}>{projectPortfolio.allLabel}</Link>
        {services.map(service => <Link key={service.slug} href={projectsHref({ service: service.slug, location, keyword })} aria-current={selectedService?.slug === service.slug ? "page" : undefined}>{service.title}</Link>)}
      </nav>

      <section className="projects-panel" aria-labelledby="projects-list-title">
        <div className="projects-panel-heading">
          <h2 id="projects-list-title">{heading}</h2>
          <p>{items.length} dự án{keyword ? ` cho “${keyword}”` : ""}{location ? ` tại ${location}` : ""}{filtered && <> · <Link href={projectsHref({ service: selectedService?.slug })}>Xóa bộ lọc</Link></>}</p>
        </div>
        {items.length > 0 ? <ul className="projects-grid">
          {items.map(project => <li key={project.slug}>
            <Link className="projects-card" href={`/du-an/${project.slug}`}>
              <span className="projects-card-photo"><Image src={project.image} alt="" fill sizes="(max-width: 600px) 92vw, (max-width: 960px) 46vw, 380px" /></span>
              <h3>{project.title}</h3>
              <span className="projects-card-meta"><span>{project.tag}</span> · {project.location}</span>
            </Link>
          </li>)}
        </ul> : <div className="projects-empty">
          <h3>{filtered ? "Chưa tìm thấy dự án phù hợp" : "Đang cập nhật công trình trong hạng mục này"}</h3>
          <p>{filtered ? "Thử từ khóa khác hoặc bỏ bớt điều kiện lọc." : "Bạn có thể trao đổi trực tiếp với Lavita để tìm hiểu thêm về dịch vụ."}</p>
          <div className="content-actions">
            {filtered && <Link href={projectsHref({ service: selectedService?.slug })} className="detail-link">Xóa bộ lọc</Link>}
            <Link href={contactHref(selectedService?.slug)} className="detail-link">Trao đổi với Lavita</Link>
          </div>
        </div>}
      </section>
    </div>

    <section className="section content-next"><div><h2>Công trình của bạn cần giải pháp PCCC?</h2><p>Trao đổi nhu cầu với Lavita hoặc tìm hiểu đội ngũ thi công, hồ sơ pháp lý trong hồ sơ năng lực.</p></div>
      <div className="content-actions"><Link href={contactHref(selectedService?.slug)} className="button button-primary">Trao đổi với Lavita<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/ho-so-nang-luc" className="button button-secondary">Xem hồ sơ năng lực</Link></div>
    </section>
  </div>;
}
