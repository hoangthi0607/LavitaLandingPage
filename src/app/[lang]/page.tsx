import { Hero } from "@/components/home/hero";
import { ProjectShowcase } from "@/components/home/project-showcase";
import { Contact, HomeAbout, News, Services, Testimonials } from "@/components/home/sections";
import { homepageStructuredData } from "@/data/structured-data";
import { getContent } from "@/i18n/content";
import "@/components/home/home.css";

// Order follows dcons.vn home: hero, company intro, (Lavita services), project showcase, (client feedback), news, contact.
// .home-page (21/11/2026) sets the large-print reading size and darker secondary text for the whole home page.
export default async function HomePage() {
  const content = await getContent();
  const { t } = content;
  return <div className="home-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData(content)).replace(/</g, "\\u003c") }} />
    <Hero />
    <HomeAbout /><Services />
    <ProjectShowcase projects={content.projects.map(({ slug, title, location, tag, scale, investor, image }) => ({ slug, title, location, tag, scale, investor, image }))} labels={t.home.projects} pending={t.common.pending} />
    <Testimonials /><News /><Contact />
  </div>;
}
