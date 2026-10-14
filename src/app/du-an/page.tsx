import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards } from "@/components/content/project-cards";
import { company, contactHref, getService, projects, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Dự án PCCC", "Xem dự án thiết kế, thi công và bảo trì PCCC của Lavita, với phạm vi thực hiện và trang đối chiếu trong hồ sơ năng lực.", "/du-an");

type Props = { searchParams: Promise<{ "dich-vu"?: string | string[] }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const query = (await searchParams)["dich-vu"];
  const selectedService = getService(typeof query === "string" ? query : undefined);
  const items = selectedService ? projects.filter((project) => project.serviceSlug === selectedService.slug) : projects;
  const scopes = services.filter((service) => projects.some((project) => project.serviceSlug === service.slug));

  return <>
    <PageIntro title="Dự án theo phạm vi PCCC" description="Tìm công trình theo dịch vụ Lavita thực hiện. Mỗi dự án có phạm vi PCCC cụ thể và liên kết tới trang tương ứng trong hồ sơ năng lực." breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dự án PCCC" }]} />
    <section className="section content-section project-directory" aria-labelledby="project-list-title">
      <nav className="project-filters" aria-label="Lọc dự án theo dịch vụ PCCC">
        <Link href="/du-an" aria-current={!selectedService ? "page" : undefined}>Tất cả dự án</Link>
        {scopes.map((service) => <Link key={service.slug} href={`/du-an?dich-vu=${service.slug}`} aria-current={selectedService?.slug === service.slug ? "page" : undefined}>{service.title}</Link>)}
      </nav>
      <div className="project-result-heading"><h2 id="project-list-title">{selectedService ? `${selectedService.title} PCCC` : "Các dự án được giới thiệu"}</h2><p>{items.length} dự án trong hồ sơ Lavita</p></div>
      {items.length > 0 ? <ProjectCards items={items} /> : <div className="content-empty"><h3>Chưa có dự án được giới thiệu cho dịch vụ này</h3><p>Website hiện chưa có ví dụ riêng cho {selectedService?.title.toLocaleLowerCase("vi-VN")}. Trao đổi với Lavita để tìm hiểu nhu cầu của công trình.</p><div className="content-actions"><Link href={contactHref(selectedService?.slug)} className="button button-primary">Tư vấn về dịch vụ <ArrowRight size={18} aria-hidden="true" /></Link><Link href="/du-an" className="detail-link">Xem tất cả dự án <ArrowRight size={18} aria-hidden="true" /></Link></div></div>}
      <p className="project-scope-note">Các nhãn thể hiện phạm vi PCCC của Lavita tại công trình.</p>
      {selectedService && <Link href={`/dich-vu/${selectedService.slug}`} className="detail-link">Tìm hiểu dịch vụ {selectedService.title.toLocaleLowerCase("vi-VN")} <ArrowRight size={18} aria-hidden="true" /></Link>}
    </section>
    <section className="section content-next"><div><h2>Muốn tìm hiểu thêm về Lavita?</h2><p>Xem hồ sơ năng lực để đối chiếu thông tin doanh nghiệp, dịch vụ và các công trình được giới thiệu.</p></div><div><a href={company.profile} className="button button-secondary" target="_blank" rel="noopener noreferrer">Mở hồ sơ PDF <FileText size={18} aria-hidden="true" /><span className="sr-only"> (mở trong tab mới)</span></a><span className="file-note">PDF khoảng 67 MB · mở khi bạn chọn</span></div></section>
  </>;
}
