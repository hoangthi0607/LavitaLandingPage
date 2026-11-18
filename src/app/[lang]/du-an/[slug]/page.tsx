import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ProjectCards, ProjectSpecs } from "@/components/content/project-cards";
import { contactHref, projectBase, projectCategoryHref, serviceHref } from "@/data/home";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "../projects.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projectBase.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const content = await getContent();
  const project = content.project((await params).slug);
  if (!project) notFound();
  const copy = content.t.projectDetail;
  return pageMetadata(format(copy.metaTitle, { title: project.title, tag: project.tag }), format(copy.metaDescription, { tag: project.tag, title: project.title, description: project.description }), `/du-an/${project.slug}`);
}

export default async function ProjectPage({ params }: Props) {
  const content = await getContent();
  const { t, intl } = content;
  const copy = t.projectDetail;
  const project = content.project((await params).slug);
  if (!project) notFound();
  const service = content.service(project.serviceSlug);
  const relatedProjects = content.projects.filter((item) => item.serviceSlug === project.serviceSlug && item.slug !== project.slug);

  return <>
    <PageIntro title={project.title} description={project.description} breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.projects, href: "/du-an" }, ...(service ? [{ label: service.title, href: projectCategoryHref(service.slug) }] : []), { label: project.title }]} />
    <section className="section content-section project-detail">
      <div className="project-detail-photo" data-reveal="left"><Image src={project.image} alt={format(copy.imageAlt, { title: project.title, tag: project.tag })} fill sizes="(max-width: 760px) 90vw, 65vw" priority /></div>
      <div className="project-detail-copy" data-reveal="right"><h2 className="section-title">{copy.infoHeading}</h2><ProjectSpecs project={project} /><p>{format(copy.performed, { scope: project.scope, title: project.title })}</p></div>
    </section>
    <section className="section content-next"><div><h2>{copy.nextHeading}</h2><p>{format(copy.nextText, { scope: project.scope })}</p>{service && <Link href={serviceHref(service.slug)} className="detail-link">{format(copy.learnService, { service: service.title.toLocaleLowerCase(intl) })}</Link>}</div><Link href={contactHref(project.serviceSlug, project.slug)} className="button button-primary">{copy.cta} <ArrowRight size={18} aria-hidden="true" /></Link></section>
    {relatedProjects.length > 0 && <section className="section content-section"><h2 className="section-title">{copy.related}</h2><ProjectCards items={relatedProjects} /></section>}
    <div className="section content-return"><Link href={projectCategoryHref(project.serviceSlug)} className="detail-link">{format(copy.seeMore, { scope: project.scope })}</Link></div>
  </>;
}
