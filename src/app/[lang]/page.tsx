import { Hero } from "@/components/home/hero";
import { ProjectShowcase } from "@/components/home/project-showcase";
import { Contact, HomeAbout, News, Services } from "@/components/home/sections";
import { homepageStructuredData } from "@/data/structured-data";
import { getContent } from "@/i18n/content";
import "@/components/home/home.css";

// Order follows dcons.vn home: hero, company intro, (Lavita services), project showcase, news, contact.
export default async function HomePage() {
  const content = await getContent();
  const { t } = content;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData(content)).replace(/</g, "\\u003c") }} />
    <Hero heading={t.home.heroHeading} slides={content.slides} labels={{ ...t.home.hero, findService: t.common.findService }} />
    <HomeAbout /><Services />
    <ProjectShowcase projects={content.projects.map(({ slug, title, location, tag, scale, investor, image }) => ({ slug, title, location, tag, scale, investor, image }))} labels={t.home.projects} pending={t.common.pending} />
    <News /><Contact />
  </>;
}
