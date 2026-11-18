import { Mail, MapPin, Phone } from "lucide-react";
import { serviceHref } from "@/data/home";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { Brand } from "./brand";

const companyLinkKeys = [
  { key: "home", href: "/" }, { key: "about", href: "/ve-lavita" }, { key: "projects", href: "/du-an" }, { key: "products", href: "/san-pham" },
  { key: "profile", href: "/ho-so-nang-luc" }, { key: "news", href: "/tin-tuc" }, { key: "contact", href: "/lien-he" },
] as const;

// Footer in the dcons.vn structure: brand and office details on the left, two link columns on the right.
export async function Footer() {
  const { company, services, t } = await getContent();
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-left">
        <div className="footer-brand" data-reveal="up"><Brand labels={{ tagline: t.company.tagline, home: t.nav.brandHome, logo: t.nav.brandLogo }} /></div>
        <div className="footer-addresses">
          <div className="footer-address" data-reveal="up">
            <h3><MapPin size={16} aria-hidden="true" />{t.footer.headOffice}</h3>
            <p>{company.address}</p>
            <p>{t.common.taxCode}: {company.taxCode}</p>
          </div>
          <div className="footer-address" data-reveal="up">
            <h3><Phone size={16} aria-hidden="true" />{t.footer.contact}</h3>
            <p><a href={company.phoneHref}>{company.phone}</a></p>
            <p><a href={`mailto:${company.email}`}><Mail size={14} aria-hidden="true" />{company.email}</a></p>
          </div>
        </div>
      </div>
      <div className="footer-right">
        <nav className="footer-col" aria-label="Lavita" data-reveal="up"><h3>Lavita</h3><ul>{companyLinkKeys.map(link => <li key={link.href}><Link href={link.href}>{t.nav[link.key]}</Link></li>)}</ul></nav>
        <nav className="footer-col" aria-label={t.footer.servicesLabel} data-reveal="up"><h3>{t.nav.services}</h3><ul>{services.map(service => <li key={service.slug}><Link href={serviceHref(service.slug)}>{service.title}</Link></li>)}</ul></nav>
      </div>
    </div>
    <p className="footer-bottom" data-reveal="up">© {new Date().getFullYear()} {company.name}. {t.footer.rights}</p>
  </footer>;
}
