import { company, services, site } from "./home";

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;
const webpageId = `${site.url}/#webpage`;

// Only business facts already displayed on the homepage are included.
export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
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
      contactPoint: { "@type": "ContactPoint", telephone: company.phoneHref.replace("tel:", ""), email: company.email, contactType: "Tư vấn dịch vụ PCCC", availableLanguage: "vi" },
    },
    { "@type": "WebSite", "@id": websiteId, name: site.name, alternateName: company.name, url: `${site.url}/`, inLanguage: "vi-VN", publisher: { "@id": organizationId } },
    {
      "@type": "WebPage", "@id": webpageId, url: `${site.url}/`, name: site.title, description: site.description,
      inLanguage: "vi-VN", isPartOf: { "@id": websiteId }, about: { "@id": organizationId },
      mainEntity: services.map((_, index) => ({ "@id": `${site.url}/#service-${index + 1}` })),
    },
    ...services.map((service, index) => ({
      "@type": "Service", "@id": `${site.url}/#service-${index + 1}`, name: service.title, serviceType: "Phòng cháy chữa cháy",
      description: service.description, url: `${site.url}/#services`, provider: { "@id": organizationId },
    })),
  ],
};
