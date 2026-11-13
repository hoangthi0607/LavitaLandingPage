import { Hero } from "@/components/home/hero";
import { ScrollReveal } from "@/components/content/scroll-reveal";
import { IntroStrip, About, Services, Projects, Capabilities, Contact } from "@/components/home/sections";
import { homepageStructuredData } from "@/data/structured-data";

export default function HomePage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData).replace(/</g, "\\u003c") }} /><Hero /><ScrollReveal><IntroStrip /><Services /><Projects /><About /><Capabilities /><Contact /></ScrollReveal></>;
}
