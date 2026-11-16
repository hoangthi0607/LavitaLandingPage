import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards } from "@/components/content/project-cards";
import { contactHref, getService, projectCategoryHref, projects, serviceHref, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Dự án PCCC", "Xem các dự án thiết kế, thi công và bảo trì PCCC của Lavita theo từng phạm vi thực hiện.", "/du-an");

type Props = { searchParams: Promise<{ "dich-vu"?: string | string[] }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const query = (await searchParams)["dich-vu"];
  const selectedService = getService(typeof query === "string" ? query : undefined);
  const items = selectedService ? projects.filter((project) => project.serviceSlug === selectedService.slug) : [];

  return <>
    <PageIntro
      title={selectedService ? `Dự án ${selectedService.title.toLocaleLowerCase("vi-VN")} PCCC` : "Dự án PCCC theo hạng mục"}
      description={selectedService ? "Chọn công trình để xem chi tiết phạm vi PCCC Lavita thực hiện." : "Chọn hạng mục dịch vụ để xem danh sách các dự án Lavita thực hiện. Mỗi công trình có thông tin chi tiết về phạm vi PCCC."}
      breadcrumbs={selectedService ? [{ label: "Trang chủ", href: "/" }, { label: "Dự án PCCC", href: "/du-an" }, { label: selectedService.title }] : [{ label: "Trang chủ", href: "/" }, { label: "Dự án PCCC" }]} />
    {selectedService ? <section className="section content-section project-directory" aria-labelledby="project-list-title">
      <nav className="project-filters" aria-label="Hạng mục dự án PCCC">
        <Link href="/du-an">Các hạng mục</Link>
        {services.map(service => <Link key={service.slug} href={projectCategoryHref(service.slug)} aria-current={selectedService.slug === service.slug ? "page" : undefined}>{service.title}</Link>)}
      </nav>
      <div className="project-result-heading"><h2 id="project-list-title">Danh sách dự án</h2><p>{items.length} dự án</p></div>
      {items.length > 0 ? <ProjectCards items={items} /> : <div className="content-empty"><h3>Chưa có dự án được giới thiệu trong hạng mục này</h3><p>Website hiện chưa giới thiệu công trình thuộc hạng mục {selectedService.title.toLocaleLowerCase("vi-VN")}. Bạn có thể trao đổi với Lavita để tìm hiểu thêm.</p><div className="content-actions"><Link href={contactHref(selectedService.slug)} className="button button-primary">Trao đổi với Lavita <ArrowRight size={18} aria-hidden="true" /></Link><Link href="/du-an" className="detail-link">Xem các hạng mục khác <ArrowRight size={18} aria-hidden="true" /></Link></div></div>}
      <p className="project-scope-note">Các nhãn thể hiện phạm vi PCCC của Lavita tại công trình.</p>
      <Link href={serviceHref(selectedService.slug)} className="detail-link">Tìm hiểu dịch vụ {selectedService.title.toLocaleLowerCase("vi-VN")} <ArrowRight size={18} aria-hidden="true" /></Link>
    </section> : <section className="section content-section project-category-list" aria-label="Các hạng mục dự án PCCC">
      {services.map(service => {
        const count = projects.filter(project => project.serviceSlug === service.slug).length;
        return <article className="project-category-row" key={service.slug}>
          <div><h2><Link href={projectCategoryHref(service.slug)}>{service.title}</Link></h2><p>{service.description}</p></div>
          <div className="project-category-action"><span>{count > 0 ? `${count} dự án` : "Đang cập nhật"}</span><Link href={projectCategoryHref(service.slug)} className="detail-link" aria-label={`Xem dự án ${service.title.toLocaleLowerCase("vi-VN")}`}>Xem dự án <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </article>;
      })}
    </section>}
    <section className="section content-next"><div><h2>Muốn tìm hiểu thêm về Lavita?</h2><p>Tìm hiểu thông tin doanh nghiệp, đội ngũ và các công trình của Lavita.</p></div><Link href="/ho-so-nang-luc" className="button button-secondary">Xem hồ sơ năng lực<ArrowRight size={18} aria-hidden="true" /></Link></section>
  </>;
}
