import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards } from "@/components/content/project-cards";
import { company, contactHref, getService, projects, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  return pageMetadata(`${service.title} PCCC`, service.description, `/dich-vu/${service.slug}`);
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const matchingProjects = projects.filter((project) => project.serviceSlug === service.slug);
  const relatedServices = service.relatedServiceSlugs.map((slug) => getService(slug)).filter((item) => item !== undefined);

  return <>
    <PageIntro title={`${service.title} PCCC`} description={service.description} breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ PCCC", href: "/dich-vu" }, { label: service.title }]} />
    <section className="section content-section service-overview">
      <div className="content-photo"><Image src={service.image} alt={`Hình ảnh minh họa dịch vụ ${service.title} PCCC từ hồ sơ Lavita`} fill sizes="(max-width: 760px) 90vw, 48vw" priority /></div>
      <div className="content-copy">
        <h2>Bắt đầu từ nhu cầu công trình</h2>
        <p>{service.description} Bạn có thể trao đổi với Lavita về công trình và nội dung cần hỗ trợ trước khi xác định phạm vi cụ thể.</p>
        <h3>Thông tin nên chuẩn bị</h3>
        <ul className="preparation-list">{service.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="content-note">Bạn có thể bắt đầu trao đổi khi chưa có đầy đủ các thông tin trên.</p>
        <div className="content-actions">{matchingProjects.length > 0 ? <><a href="#service-projects-title" className="button button-primary">Xem dự án phù hợp <ArrowRight size={18} aria-hidden="true" /></a><Link href={contactHref(service.slug)} className="detail-link">Tư vấn về dịch vụ này <ArrowRight size={18} aria-hidden="true" /></Link></> : <Link href={contactHref(service.slug)} className="button button-primary">Tư vấn về dịch vụ này <ArrowRight size={18} aria-hidden="true" /></Link>}</div>
        <a href={`${company.profile}#page=16`} className="detail-link" target="_blank" rel="noopener noreferrer"><FileText size={18} aria-hidden="true" /> Xem dịch vụ trong hồ sơ PDF<span className="sr-only"> (mở trong tab mới, trang 16)</span></a>
        <span className="file-note">Hồ sơ năng lực · PDF khoảng 67 MB</span>
      </div>
    </section>
    <section className="section content-section content-evidence" aria-labelledby="service-projects-title">
      <div className="section-heading"><div><h2 id="service-projects-title">Dự án cùng phạm vi PCCC</h2><p className="content-section-description">Đối chiếu phạm vi Lavita thực hiện tại công trình và nguồn trong hồ sơ năng lực.</p></div>{matchingProjects.length > 0 && <Link href={`/du-an?dich-vu=${service.slug}`} className="detail-link">Xem nhóm dự án <ArrowRight size={18} aria-hidden="true" /></Link>}</div>
      {matchingProjects.length > 0 ? <ProjectCards items={matchingProjects} /> : <div className="content-empty"><p>Website hiện chưa giới thiệu dự án riêng cho dịch vụ {service.title.toLocaleLowerCase("vi-VN")}.</p><p>Bạn có thể xem danh mục dịch vụ trong hồ sơ hoặc trao đổi trực tiếp về nhu cầu của mình.</p><div className="content-actions"><a href={`${company.profile}#page=16`} className="detail-link" target="_blank" rel="noopener noreferrer">Mở hồ sơ PDF <FileText size={18} aria-hidden="true" /><span className="sr-only"> (mở trong tab mới)</span></a><Link href={contactHref(service.slug)} className="detail-link">Trao đổi về dịch vụ <ArrowRight size={18} aria-hidden="true" /></Link></div></div>}
    </section>
    {matchingProjects.length > 0 && <section className="section content-next"><div><h2>Trao đổi về công trình của bạn</h2><p>Bắt đầu tư vấn về {service.title.toLocaleLowerCase("vi-VN")} PCCC. Tên dịch vụ bạn đang xem sẽ được giữ trong nội dung liên hệ.</p></div><Link href={contactHref(service.slug)} className="button button-primary">Tư vấn về dịch vụ này <ArrowRight size={18} aria-hidden="true" /></Link></section>}
    <section className="section content-section related-services" aria-labelledby="related-services-title"><h2 id="related-services-title">Dịch vụ liên quan</h2><div className="related-service-list">{relatedServices.map((related) => <Link key={related.slug} href={`/dich-vu/${related.slug}`}><span>{related.title}</span><ArrowRight size={20} aria-hidden="true" /></Link>)}</div></section>
  </>;
}
