import { localeInfo } from "@/i18n/config";
import type { Content } from "@/i18n/content";
import { absoluteUrl } from "@/i18n/urls";

// Only business facts already displayed on the homepage are included.
function graph({ site, company, services, locale, t }: Content) {
  const organizationId = `${site.url}/#organization`;
  const websiteId = `${site.url}/#website`;
  const home = absoluteUrl("/", locale);
  const inLanguage = localeInfo[locale].intl;
  return [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Lavita",
      legalName: company.name,
      url: `${site.url}/`,
      description: site.description,
      logo: `${site.url}/images/lavita-symbol.png`,
      telephone: company.phoneHref.replace("tel:", ""),
      email: company.email,
      taxID: company.taxCode,
      address: { "@type": "PostalAddress", streetAddress: company.address, addressCountry: "VN" },
      // Consultations are handled in Vietnamese; translated pages do not change that.
      contactPoint: { "@type": "ContactPoint", telephone: company.phoneHref.replace("tel:", ""), email: company.email, contactType: t.meta.contactType, availableLanguage: "vi" },
    },
    { "@type": "WebSite", "@id": websiteId, name: site.name, alternateName: company.name, url: `${site.url}/`, inLanguage, publisher: { "@id": organizationId } },
    {
      "@type": "WebPage", "@id": `${home}#webpage`, url: home, name: site.title, description: site.description,
      inLanguage, isPartOf: { "@id": websiteId }, about: { "@id": organizationId },
      mainEntity: services.map((_, index) => ({ "@id": `${home}#service-${index + 1}` })),
    },
    ...services.map((service, index) => ({
      "@type": "Service", "@id": `${home}#service-${index + 1}`, name: service.title, serviceType: t.meta.serviceType,
      description: service.description, url: absoluteUrl(`/dich-vu/${service.slug}`, locale), provider: { "@id": organizationId },
    })),
  ];
}

export const businessStructuredData = (content: Content) => ({ "@context": "https://schema.org", "@graph": graph(content).filter(node => node["@type"] !== "WebPage") });
export const homepageStructuredData = (content: Content) => ({ "@context": "https://schema.org", "@graph": graph(content).filter(node => node["@type"] === "WebPage") });
