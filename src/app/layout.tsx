import type { Metadata } from "next";
import localFont from "next/font/local";
import { company, site } from "@/data/home";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { businessStructuredData } from "@/data/structured-data";
import "./globals.css";
import "./content.css";
import "./contact.css";

const manrope = localFont({
  src: "../../public/fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Lavita" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: company.name, url: site.url }],
  creator: company.name,
  alternates: { canonical: `${site.url}/` },
  openGraph: { type: "website", locale: "vi_VN", siteName: site.name, url: `${site.url}/`, title: site.title, description: site.description },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [{ url: `${site.url}/opengraph-image`, alt: "Lavita – Giải pháp phòng cháy chữa cháy" }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className={manrope.variable}><body><a className="skip-link" href="#main-content">Đến nội dung chính</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessStructuredData).replace(/</g, "\\u003c") }} /><Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer /></body></html>;
}
