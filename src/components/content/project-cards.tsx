import Image from "next/image";
import Link from "next/link";
import { projectPortfolio, type Project } from "@/data/home";

// Project cards in the dcons.vn/du-an style: photo, then label/value rows. Styles live in app/du-an/projects.css.
export function ProjectCards({ items }: { items: readonly Project[] }) {
  const pending = projectPortfolio.pendingLabel;
  return <ul className="projects-grid">
    {items.map(project => <li className="projects-card" key={project.slug} data-reveal="up">
      <Link className="projects-card-photo" href={`/du-an/${project.slug}`} tabIndex={-1} aria-hidden="true"><Image src={project.image} alt="" fill sizes="(max-width: 1024px) 92vw, 44vw" /></Link>
      <ProjectSpecs project={project} pending={pending} linkTitle />
    </li>)}
  </ul>;
}

export function ProjectSpecs({ project, pending = projectPortfolio.pendingLabel, linkTitle = false }: { project: Project; pending?: string; linkTitle?: boolean }) {
  return <dl className="projects-card-specs">
    <div><dt>Tên dự án:</dt><dd>{linkTitle ? <Link href={`/du-an/${project.slug}`}>{project.title}</Link> : project.title}</dd></div>
    <div><dt>Vị trí:</dt><dd>{project.location}</dd></div>
    <div><dt>Quy mô:</dt><dd className={project.scale ? undefined : "is-pending"}>{project.scale || pending}</dd></div>
    <div><dt>Hạng mục PCCC:</dt><dd>{project.tag}</dd></div>
    <div><dt>Chủ đầu tư:</dt><dd className={project.investor ? undefined : "is-pending"}>{project.investor || pending}</dd></div>
  </dl>;
}
