import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards } from "@/components/content/project-cards";
import { company, contactHref, getProject, getService, projects } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return pageMetadata(`${project.title} – ${project.tag}`, `${project.tag} tại ${project.title}. ${project.description}. Xem phạm vi PCCC và hồ sơ năng lực Lavita.`, `/du-an/${project.slug}`);
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const service = getService(project.serviceSlug);
  const relatedProjects = projects.filter((item) => item.serviceSlug === project.serviceSlug && item.slug !== project.slug);

  return <>
    <PageIntro title={project.title} description={project.description} breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dự án PCCC", href: "/du-an" }, { label: project.title }]} />
    <section className="section content-section project-detail">
      <div className="project-detail-photo"><Image src={project.image} alt={`${project.title} – phạm vi ${project.tag}`} fill sizes="(max-width: 760px) 90vw, 65vw" priority /></div>
      <div className="project-detail-copy"><h2>Phạm vi Lavita thực hiện</h2><p className="project-detail-scope">{project.tag}</p><p>Thông tin {project.tag.toLocaleLowerCase("vi-VN")} tại {project.title} được giới thiệu trong hồ sơ năng lực Lavita.</p><a href={`${company.profile}#page=${project.profilePage}`} className="detail-link" target="_blank" rel="noopener noreferrer"><FileText size={18} aria-hidden="true" /> Đối chiếu PDF · trang {project.profilePage}<span className="sr-only"> (mở trong tab mới)</span></a><span className="file-note">Hồ sơ năng lực · PDF khoảng 67 MB</span></div>
    </section>
    <section className="section content-next"><div><h2>Công trình của bạn có nhu cầu tương tự?</h2><p>Trao đổi với Lavita về {project.tag.toLocaleLowerCase("vi-VN")} cho công trình của bạn. Dịch vụ và dự án đang xem sẽ được giữ trong nội dung liên hệ.</p>{service && <Link href={`/dich-vu/${service.slug}`} className="detail-link">Tìm hiểu dịch vụ {service.title.toLocaleLowerCase("vi-VN")} <ArrowRight size={18} aria-hidden="true" /></Link>}</div><Link href={contactHref(project.serviceSlug, project.slug)} className="button button-primary">Tư vấn cho công trình của bạn <ArrowRight size={18} aria-hidden="true" /></Link></section>
    {relatedProjects.length > 0 && <section className="section content-section"><h2>Dự án cùng phạm vi</h2><ProjectCards items={relatedProjects} /></section>}
    <div className="section content-return"><Link href={`/du-an?dich-vu=${project.serviceSlug}`} className="detail-link">Xem các dự án {project.tag.toLocaleLowerCase("vi-VN")} <ArrowRight size={18} aria-hidden="true" /></Link></div>
  </>;
}
