import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { contactHref, serviceGroups, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Dịch vụ PCCC", "Tìm hiểu các dịch vụ Lavita cung cấp: tư vấn thiết kế, thi công hệ thống, bảo trì và sửa chữa PCCC.", "/dich-vu");

export default function ServicesPage() {
  return <>
    <PageIntro title="Dịch vụ PCCC của Lavita" description="Lavita cung cấp dịch vụ phòng cháy chữa cháy cho công trình dân dụng và công nghiệp, từ tư vấn thiết kế, thi công đến bảo trì và sửa chữa hệ thống." breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ PCCC" }]} />
    <div className="section service-directory">
      {serviceGroups.map((group) => <section key={group.id} className="service-group" aria-labelledby={`group-${group.id}`}>
        <div className="service-group-intro"><h2 id={`group-${group.id}`}>{group.title}</h2><p>{group.description}</p></div>
        <div className="service-directory-list">
          {services.filter((service) => service.group === group.id).map((service) => <article key={service.slug} id={service.slug} className="service-directory-row">
            <div><h3>{service.title}</h3><p>{service.description}</p></div>
            <Link href={contactHref(service.slug)} className="detail-link" aria-label={`Trao đổi về ${service.title}`}>Trao đổi về dịch vụ <ArrowRight size={18} aria-hidden="true" /></Link>
          </article>)}
        </div>
      </section>)}
    </div>
    <section className="section content-next">
      <div><h2>Chưa xác định được dịch vụ?</h2><p>Chia sẻ loại công trình, tình trạng hiện tại và nội dung bạn cần hỗ trợ để bắt đầu trao đổi.</p></div>
      <Link href={contactHref()} className="button button-primary">Trao đổi với Lavita <ArrowRight size={18} aria-hidden="true" /></Link>
    </section>
  </>;
}
