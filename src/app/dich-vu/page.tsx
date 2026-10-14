import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { contactHref, serviceGroups, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Dịch vụ PCCC", "Chọn dịch vụ PCCC theo nhu cầu: thiết kế, thi công, nghiệm thu, bảo trì, huấn luyện hoặc vật tư thiết bị. Xem phạm vi và dự án phù hợp của Lavita.", "/dich-vu");

export default function ServicesPage() {
  return <>
    <PageIntro title="Dịch vụ PCCC cho từng nhu cầu" description="Chọn dịch vụ phù hợp với giai đoạn công trình. Từ đây, bạn có thể tìm hiểu phạm vi, xem dự án cùng dịch vụ và trao đổi trực tiếp với Lavita." breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ PCCC" }]} />
    <div className="section service-directory">
      {serviceGroups.map((group) => <section key={group.id} className="service-group" aria-labelledby={`group-${group.id}`}>
        <div className="service-group-intro"><h2 id={`group-${group.id}`}>{group.title}</h2><p>{group.description}</p></div>
        <div className="service-directory-list">
          {services.filter((service) => service.group === group.id).map((service) => <article key={service.slug} className="service-directory-row">
            <div><h3><Link href={`/dich-vu/${service.slug}`}>{service.title}</Link></h3><p>{service.description}</p></div>
            <Link href={`/dich-vu/${service.slug}`} className="detail-link" aria-label={`Tìm hiểu dịch vụ ${service.title}`}>Tìm hiểu dịch vụ <ArrowRight size={18} aria-hidden="true" /></Link>
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
