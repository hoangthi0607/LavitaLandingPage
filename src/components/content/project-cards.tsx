import Image from "next/image";
import { getContent, type LocalizedProject } from "@/i18n/content";
import Link from "@/i18n/link";

// Project cards (19/11/2026): photo with the PCCC scope tag, title, then location / scale / investor rows. The whole
// card opens the project (the title link covers it); on hover the card lifts, the photo zooms and a strip slides up.
// Used on /du-an, service pages and related projects. Styles live in app/[lang]/du-an/projects.css.
export async function ProjectCards({ items }: { items: readonly LocalizedProject[] }) {
  const { t } = await getContent();
  const labels = t.projectCard;
  const pending = t.common.pending;
  const label = (text: string) => text.replace(/[:：]\s*$/, "");
  return <ul className="projects-grid">
    {items.map(project => <li className="projects-card" key={project.slug} data-reveal="up">
      <div className="projects-card-photo">
        <Image src={project.image} alt="" fill sizes="(max-width: 1024px) 92vw, 44vw" />
        <span className="projects-card-tag">{project.tag}</span>
        <span className="projects-card-cta" aria-hidden="true">{t.home.projects.details}</span>
      </div>
      <div className="projects-card-body">
        <h3><Link href={`/du-an/${project.slug}`}>{project.title}</Link></h3>
        <dl className="projects-card-meta">
          <div><dt>{label(labels.location)}</dt><dd className={project.location ? undefined : "is-pending"}>{project.location || pending}</dd></div>
          <div><dt>{label(labels.scale)}</dt><dd className={project.scale ? undefined : "is-pending"}>{project.scale || pending}</dd></div>
          <div><dt>{label(labels.investor)}</dt><dd className={project.investor ? undefined : "is-pending"}>{project.investor || pending}</dd></div>
        </dl>
      </div>
    </li>)}
  </ul>;
}
