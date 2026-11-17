import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, serviceHref, services } from "@/data/home";
import { Brand } from "./brand";

const companyLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Về Lavita", href: "/ve-lavita" },
  { label: "Dự án PCCC", href: "/du-an" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Hồ sơ năng lực", href: "/ho-so-nang-luc" },
  { label: "Liên hệ", href: "/lien-he" },
];

// Footer in the dcons.vn structure: brand and office details on the left, two link columns on the right.
export function Footer() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-left">
        <div className="footer-brand" data-reveal="up"><Brand /></div>
        <div className="footer-addresses">
          <div className="footer-address" data-reveal="up">
            <h3><MapPin size={16} aria-hidden="true" />Trụ sở</h3>
            <p>{company.address}</p>
            <p>Mã số thuế: {company.taxCode}</p>
          </div>
          <div className="footer-address" data-reveal="up">
            <h3><Phone size={16} aria-hidden="true" />Liên hệ</h3>
            <p><a href={company.phoneHref}>{company.phone}</a></p>
            <p><a href={`mailto:${company.email}`}><Mail size={14} aria-hidden="true" />{company.email}</a></p>
          </div>
        </div>
      </div>
      <div className="footer-right">
        <nav className="footer-col" aria-label="Lavita" data-reveal="up"><h3>Lavita</h3><ul>{companyLinks.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>
        <nav className="footer-col" aria-label="Dịch vụ PCCC cuối trang" data-reveal="up"><h3>Dịch vụ PCCC</h3><ul>{services.map(service => <li key={service.slug}><Link href={serviceHref(service.slug)}>{service.title}</Link></li>)}</ul></nav>
      </div>
    </div>
    <p className="footer-bottom" data-reveal="up">© {new Date().getFullYear()} {company.name}. Bảo lưu mọi quyền.</p>
  </footer>;
}
