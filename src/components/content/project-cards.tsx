import Image from "next/image";
import { getContent, type LocalizedProject } from "@/i18n/content";
import Link from "@/i18n/link";

// Project cards in the dcons.vn/du-an style: photo, then label/value rows. Styles live in app/[lang]/du-an/projects.css.
export function ProjectCards({ items }: { items: readonly LocalizedProject[] }) {
  return <ul className="projects-grid">
    {items.map(project => <li className="projects-card" key={project.slug} data-reveal="up">
      <Link className="projects-card-photo" href={`/du-an/${project.slug}`} tabIndex={-1} aria-hidden="true"><Image src={project.image} alt="" fill sizes="(max-width: 1024px) 92vw, 44vw" /></Link>
      <ProjectSpecs project={project} linkTitle />
    </li>)}
  </ul>;
}

export async function ProjectSpecs({ project, linkTitle = false }: { project: LocalizedProject; linkTitle?: boolean }) {
  const { t } = await getContent();
  const labels = t.projectCard;
  const pending = t.common.pending;
  return <dl className="projects-card-specs">
    <div><dt>{labels.name}</dt><dd>{linkTitle ? <Link href={`/du-an/${project.slug}`}>{project.title}</Link> : project.title}</dd></div>
    <div><dt>{labels.location}</dt><dd>{project.location}</dd></div>
    <div><dt>{labels.scale}</dt><dd className={project.scale ? undefined : "is-pending"}>{project.scale || pending}</dd></div>
    <div><dt>{labels.scope}</dt><dd>{project.tag}</dd></div>
    <div><dt>{labels.investor}</dt><dd className={project.investor ? undefined : "is-pending"}>{project.investor || pending}</dd></div>
  </dl>;
}
