import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { company, type Project } from "@/data/home";

export function ProjectCards({ items }: { items: readonly Project[] }) {
  return (
    <div className="project-grid content-project-grid">
      {items.map((project) => (
        <article key={project.slug} className="content-project">
          <Link href={`/du-an/${project.slug}`} className="project-photo" aria-label={`Xem ${project.title} – ${project.tag}`}>
            <Image src={project.image} alt={`${project.title} – ${project.tag}`} fill sizes="(max-width: 480px) 90vw, (max-width: 760px) 44vw, 45vw" />
            <span>{project.tag}</span>
          </Link>
          <div className="project-info">
            <h3><Link href={`/du-an/${project.slug}`}>{project.title}</Link></h3>
            <p>{project.description}</p>
            <div className="project-card-actions">
              <Link href={`/du-an/${project.slug}`} className="project-link">Xem phạm vi PCCC <ArrowRight size={16} aria-hidden="true" /></Link>
              <a href={`${company.profile}#page=${project.profilePage}`} className="project-proof" target="_blank" rel="noopener noreferrer">
                <FileText size={16} aria-hidden="true" /> Hồ sơ PDF · trang {project.profilePage}<span className="sr-only"> (mở trong tab mới)</span>
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
