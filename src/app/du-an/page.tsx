import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards } from "@/components/content/project-cards";
import { contactHref, getService, projectCategoryHref, projectPortfolio, projects, serviceHref, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "@/components/content/portfolio.css";
import "./projects.css";

export const metadata = pageMetadata(projectPortfolio.title, projectPortfolio.description, "/du-an");
type Props = { searchParams: Promise<{ "dich-vu"?: string | string[] }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const query = (await searchParams)["dich-vu"];
  const selectedService = getService(typeof query === "string" ? query : undefined);
  const items = selectedService ? projects.filter(project => project.serviceSlug === selectedService.slug) : [];

  return <div className="project-portfolio-page portfolio-page">
    <PageIntro title={projectPortfolio.title} description={projectPortfolio.description}
      breadcrumbs={[{ label: "Trang chủ", href: "/" }, ...(selectedService ? [{ label: projectPortfolio.title, href: "/du-an" }, { label: selectedService.title }] : [{ label: projectPortfolio.title }])]} />

    <div className="section project-portfolio-body">
      <nav className="project-portfolio-filters" aria-label="Hạng mục dự án PCCC">
        <Link href="/du-an" aria-current={!selectedService ? "page" : undefined}>Các hạng mục</Link>
        {services.map(service => <Link key={service.slug} href={projectCategoryHref(service.slug)} aria-current={selectedService?.slug === service.slug ? "page" : undefined}>{service.title}</Link>)}
      </nav>

      {selectedService ? <section aria-labelledby="project-list-title" className="project-portfolio-results">
        <div className="project-portfolio-heading"><h2 id="project-list-title">{selectedService.title} PCCC</h2><span>{items.length} dự án</span></div>
        {items.length > 0 ? <ProjectCards items={items} variant="portfolio" /> : <div className="content-empty"><h3>Đang cập nhật công trình trong hạng mục này</h3><p>Bạn có thể trao đổi trực tiếp với Lavita để tìm hiểu thêm về dịch vụ.</p><Link href={contactHref(selectedService.slug)} className="detail-link">Trao đổi với Lavita<ArrowRight size={18} aria-hidden="true" /></Link></div>}
        <div className="project-portfolio-summary"><p>Các nhãn thể hiện phạm vi PCCC của Lavita tại công trình.</p><Link href={serviceHref(selectedService.slug)} className="detail-link">Tìm hiểu dịch vụ<ArrowRight size={18} aria-hidden="true" /></Link></div>
      </section> : <section aria-labelledby="project-categories-title" className="project-portfolio-categories">
        <div className="project-portfolio-heading"><h2 id="project-categories-title">Khám phá theo hạng mục</h2><p>{projectPortfolio.categoryDescription}</p></div>
        <div className="project-category-gallery">{projectPortfolio.categories.map(category => {
          const service = getService(category.serviceSlug);
          if (!service) return null;
          const count = projects.filter(project => project.serviceSlug === service.slug).length;
          return <article className="project-category-tile" key={service.slug}>
            <Link className="project-category-photo" href={projectCategoryHref(service.slug)} aria-label={`Xem dự án ${service.title.toLocaleLowerCase("vi-VN")}`}><Image src={category.image} alt={category.alt} fill sizes="(max-width: 760px) 90vw, 50vw" /></Link>
            <div className="project-category-copy"><h3><Link href={projectCategoryHref(service.slug)}>{service.title}</Link></h3><p>{service.description}</p><Link className="project-portfolio-link" href={projectCategoryHref(service.slug)}>Xem {count} dự án<ArrowRight size={18} aria-hidden="true" /></Link></div>
          </article>;
        })}</div>
      </section>}
    </div>

    <section className="section content-next"><div><h2>Khám phá năng lực Lavita.</h2><p>Tìm hiểu đội ngũ thi công, hồ sơ pháp lý và các công trình của Lavita.</p></div><Link href="/ho-so-nang-luc" className="button button-secondary">Xem hồ sơ năng lực<ArrowRight size={18} aria-hidden="true" /></Link></section>
  </div>;
}
