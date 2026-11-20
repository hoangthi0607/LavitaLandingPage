import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { Brand } from "./brand";

const companyLinkKeys = [
  { key: "home", href: "/" }, { key: "about", href: "/ve-lavita" }, { key: "services", href: "/dich-vu" }, { key: "projects", href: "/du-an" },
  { key: "products", href: "/san-pham" }, { key: "profile", href: "/ho-so-nang-luc" }, { key: "news", href: "/tin-tuc" }, { key: "contact", href: "/lien-he" },
] as const;

// Footer in the tkfire.com.vn structure on Lavita's warm charcoal: brand and intro; company and head office details;
// services; links; a hairline and the centred copyright. No scroll or hover animation.
export async function Footer() {
  const { company, services, site, t } = await getContent();
  const website = site.url.replace(/^https?:\/\//, "");
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-about">
        <Brand labels={{ tagline: t.company.tagline, home: t.nav.brandHome, logo: t.nav.brandLogo }} />
        <p>{t.footer.intro}</p>
      </div>
      <div className="footer-company">
        <h2 className="footer-title">{company.name}</h2>
        <ul className="footer-details">
          <li><span>{t.common.taxCode}:</span> {company.taxCode}</li>
          <li><span>{t.footer.headOffice}:</span> {company.address}</li>
          <li><span>{t.common.hotline}:</span> <a href={company.phoneHref}>{company.phone}</a></li>
          <li><span>{t.common.email}:</span> <a href={`mailto:${company.email}`}>{company.email}</a></li>
          <li><span>{t.common.website}:</span> <a href={site.url}>{website}</a></li>
        </ul>
      </div>
      <nav className="footer-col footer-services" aria-label={t.footer.servicesLabel}>
        <h2 className="footer-title">{t.nav.services}</h2>
        <ul>{services.map(service => <li key={service.slug}><Link href={`/dich-vu/${service.slug}`}>{service.pageTitle}</Link></li>)}</ul>
      </nav>
      <nav className="footer-col" aria-label={t.footer.links}>
        <h2 className="footer-title">{t.footer.links}</h2>
        <ul>{companyLinkKeys.map(link => <li key={link.href}><Link href={link.href}>{t.nav[link.key]}</Link></li>)}</ul>
      </nav>
    </div>
    <p className="footer-bottom">© {new Date().getFullYear()} {company.name}. {t.footer.rights}</p>
  </footer>;
}
