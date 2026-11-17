import { Hero } from "@/components/home/hero";
import { ProjectShowcase } from "@/components/home/project-showcase";
import { Contact, HomeAbout, News, Services } from "@/components/home/sections";
import { homepageStructuredData } from "@/data/structured-data";
import "@/components/home/home.css";

// Order follows dcons.vn home: hero, company intro, (Lavita services), project showcase, news, contact.
export default function HomePage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData).replace(/</g, "\\u003c") }} /><Hero /><HomeAbout /><Services /><ProjectShowcase /><News /><Contact /></>;
}
