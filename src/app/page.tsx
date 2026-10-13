import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { About, Services, Projects, OtherSections } from "@/components/home/sections";
import { homeStructuredData } from "@/data/structured-data";

export default function HomePage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c") }} /><Header /><main id="main-content" tabIndex={-1}><Hero /><About /><Services /><Projects /><OtherSections /></main><Footer /></>;
}
