import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { contactHref, serviceGroups, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Dịch vụ PCCC", "Tìm hiểu các dịch vụ Lavita cung cấp: tư vấn thiết kế, thi công hệ thống, bảo trì và sửa chữa PCCC.", "/dich-vu");

// dcons.vn visual language: section titles with an accent bar, photo + copy rows alternating sides.
export default function ServicesPage() {
  let row = 0;
  return <>
    <PageIntro title="Dịch vụ PCCC của Lavita" description="Lavita cung cấp dịch vụ phòng cháy chữa cháy cho công trình dân dụng và công nghiệp, từ tư vấn thiết kế, thi công đến bảo trì và sửa chữa hệ thống." breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ PCCC" }]} />
    <div className="section service-directory">
      {serviceGroups.map(group => <section key={group.id} className="service-group" aria-labelledby={`group-${group.id}`}>
        <div className="service-group-intro" data-reveal="up"><h2 id={`group-${group.id}`} className="section-title">{group.title}</h2><p>{group.description}</p></div>
        <div className="service-cards">
          {services.filter(service => service.group === group.id).map(service => {
            const reverse = row++ % 2 === 1;
            return <article key={service.slug} id={service.slug} className={`service-card${reverse ? " is-reverse" : ""}`}>
              <div className="service-card-photo" data-reveal={reverse ? "right" : "left"}><Image src={service.image} alt={`Hình ảnh minh họa dịch vụ ${service.title} PCCC`} fill sizes="(max-width: 900px) 92vw, 46vw" /></div>
              <div className="service-card-copy" data-reveal={reverse ? "left" : "right"}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <h4>Thông tin nên chuẩn bị</h4>
                <ul className="spec-list">{service.preparation.map(item => <li key={item}>{item}</li>)}</ul>
                <div className="content-actions">
                  <Link href={contactHref(service.slug)} className="button button-primary" aria-label={`Trao đổi về ${service.title}`}>Trao đổi về dịch vụ<ArrowRight size={18} aria-hidden="true" /></Link>
                  <Link href={`/dich-vu/${service.slug}`} className="detail-link">Chi tiết dịch vụ</Link>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>)}
    </div>
    <section className="section content-next">
      <div><h2>Chưa xác định được dịch vụ?</h2><p>Chia sẻ loại công trình, tình trạng hiện tại và nội dung bạn cần hỗ trợ để bắt đầu trao đổi.</p></div>
      <Link href={contactHref()} className="button button-primary">Trao đổi với Lavita<ArrowRight size={18} aria-hidden="true" /></Link>
    </section>
  </>;
}
