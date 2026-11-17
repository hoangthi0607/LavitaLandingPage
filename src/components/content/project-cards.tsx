import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Project } from "@/data/home";

export function ProjectCards({ items, variant = "default" }: { items: readonly Project[]; variant?: "default" | "portfolio" }) {
  if (variant === "portfolio") return <div className="project-portfolio-grid">
    {items.map(project => <article className="project-portfolio-card" key={project.slug}>
      <Link className="project-portfolio-photo" href={`/du-an/${project.slug}`} aria-label={`Xem ${project.title} – ${project.tag}`}><Image src={project.image} alt={`${project.title} – ${project.tag}`} fill sizes="(max-width: 760px) 90vw, 45vw" /></Link>
      <h3><Link href={`/du-an/${project.slug}`}>{project.title}</Link></h3>
      <dl className="project-portfolio-facts"><div><dt>Công trình</dt><dd>{project.description}</dd></div><div><dt>Phạm vi PCCC</dt><dd>{project.tag}</dd></div></dl>
      <Link className="project-portfolio-link" href={`/du-an/${project.slug}`}>Xem chi tiết dự án<ArrowRight size={18} aria-hidden="true" /></Link>
    </article>)}
  </div>;
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
            <Link href={`/du-an/${project.slug}`} className="project-link">Xem chi tiết dự án <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>
      ))}
    </div>
  );
}
