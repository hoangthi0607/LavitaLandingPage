import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards, ProjectSpecs } from "@/components/content/project-cards";
import { contactHref, getProject, getService, projectCategoryHref, projects, serviceHref } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "../projects.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return pageMetadata(`${project.title} – ${project.tag}`, `${project.tag} tại ${project.title}. ${project.description}.`, `/du-an/${project.slug}`);
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const service = getService(project.serviceSlug);
  // Lower-case only the first letter so the PCCC acronym keeps its capitals ("thiết kế PCCC").
  const scope = project.tag.charAt(0).toLocaleLowerCase("vi-VN") + project.tag.slice(1);
  const relatedProjects = projects.filter((item) => item.serviceSlug === project.serviceSlug && item.slug !== project.slug);

  return <>
    <PageIntro title={project.title} description={project.description} breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dự án PCCC", href: "/du-an" }, ...(service ? [{ label: service.title, href: projectCategoryHref(service.slug) }] : []), { label: project.title }]} />
    <section className="section content-section project-detail">
      <div className="project-detail-photo" data-reveal="left"><Image src={project.image} alt={`${project.title} – phạm vi ${project.tag}`} fill sizes="(max-width: 760px) 90vw, 65vw" priority /></div>
      <div className="project-detail-copy" data-reveal="right"><h2 className="section-title">Thông tin dự án</h2><ProjectSpecs project={project} /><p>Lavita thực hiện {scope} tại {project.title}.</p></div>
    </section>
    <section className="section content-next"><div><h2>Công trình của bạn có nhu cầu tương tự?</h2><p>Trao đổi với Lavita về {scope} cho công trình của bạn. Dịch vụ và dự án đang xem sẽ được giữ trong nội dung liên hệ.</p>{service && <Link href={serviceHref(service.slug)} className="detail-link">Tìm hiểu dịch vụ {service.title.toLocaleLowerCase("vi-VN")}</Link>}</div><Link href={contactHref(project.serviceSlug, project.slug)} className="button button-primary">Tư vấn cho công trình của bạn <ArrowRight size={18} aria-hidden="true" /></Link></section>
    {relatedProjects.length > 0 && <section className="section content-section"><h2 className="section-title">Dự án cùng phạm vi</h2><ProjectCards items={relatedProjects} /></section>}
    <div className="section content-return"><Link href={projectCategoryHref(project.serviceSlug)} className="detail-link">Xem các dự án {scope}</Link></div>
  </>;
}
