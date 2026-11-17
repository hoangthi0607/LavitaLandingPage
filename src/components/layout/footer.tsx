import { Brand } from "./brand";
import Link from "next/link";
import { company, serviceHref, services } from "@/data/home";

export function Footer() {
  return <footer className="section footer">
    <div className="footer-brand"><Brand /><p>Giải pháp phòng cháy chữa cháy<br />cho từng giai đoạn công trình.</p></div>
    <nav aria-label="Dịch vụ cuối trang"><h3>Dịch vụ PCCC</h3>{services.map(service => <Link href={serviceHref(service.slug)} key={service.slug}>{service.title}</Link>)}</nav>
    <nav aria-label="Tìm hiểu Lavita"><h3>Tìm hiểu Lavita</h3><Link href="/du-an">Dự án PCCC</Link><Link href="/san-pham">Sản phẩm</Link><Link href="/ve-lavita">Về Lavita</Link><Link href="/lien-he">Liên hệ tư vấn</Link><Link className="footer-profile" href="/ho-so-nang-luc">Hồ sơ năng lực</Link></nav>
    <div className="footer-company"><h3>{company.name}</h3><p>Mã số thuế: {company.taxCode}</p><a href={company.phoneHref}>{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a><p>{company.address}</p></div>
    <small className="footer-copyright">© {new Date().getFullYear()} LAVITA.</small>
  </footer>;
}
