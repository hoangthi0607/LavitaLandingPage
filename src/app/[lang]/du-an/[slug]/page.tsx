import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Layers, MapPin, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ProjectCards } from "@/components/content/project-cards";
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

// Project detail (19/11/2026): full-width photo hero (slow zoom, copy rising), a facts strip overlapping its lower
// edge, the scope statement with actions, related projects, previous/next project cards, and the contact panel.
export default async function ProjectPage({ params }: Props) {
  const content = await getContent();
  const { t, intl, projects } = content;
  const copy = t.projectDetail;
  const project = content.project((await params).slug);
  if (!project) notFound();
  const service = content.service(project.serviceSlug);
  const relatedProjects = projects.filter((item) => item.serviceSlug === project.serviceSlug && item.slug !== project.slug);
  const at = projects.findIndex(item => item.slug === project.slug);
  const previous = projects[(at - 1 + projects.length) % projects.length];
  const next = projects[(at + 1) % projects.length];
  const label = (text: string) => text.replace(/[:：]\s*$/, "");
  const facts = [
    { icon: MapPin, label: label(t.projectCard.location), value: project.location },
    { icon: Layers, label: label(t.projectCard.scale), value: project.scale },
    { icon: ShieldCheck, label: label(t.projectCard.scope), value: project.tag },
    { icon: Building2, label: label(t.projectCard.investor), value: project.investor },
  ];

  return <div className="prj-detail">
    <section className="prj-detail-hero" aria-labelledby="project-title">
      <Image className="prj-detail-hero-image" src={project.image} alt={format(copy.imageAlt, { title: project.title, tag: project.tag })} fill sizes="100vw" priority />
      <div className="prj-detail-hero-copy">
        <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: t.nav.projects, href: "/du-an" }, ...(service ? [{ label: service.title, href: projectCategoryHref(service.slug) }] : []), { label: project.title }]} />
        <Link className="prj-detail-tag" href={projectCategoryHref(project.serviceSlug)}>{project.tag}</Link>
        <h1 id="project-title">{project.title}</h1>
        {project.description && <p>{project.description}</p>}
      </div>
    </section>

    <section className="prj-detail-facts" aria-label={copy.infoHeading}>
      <dl>{facts.map(fact => <div key={fact.label}>
        <span className="prj-detail-fact-icon" aria-hidden="true"><fact.icon size={20} /></span>
        <dt>{fact.label}</dt>
        <dd className={fact.value ? undefined : "is-pending"}>{fact.value || t.common.pending}</dd>
      </div>)}</dl>
    </section>

    <section className="section prj-detail-scope" aria-labelledby="project-scope-title">
      <h2 id="project-scope-title" className="sr-only">{copy.infoHeading}</h2>
      <p className="prj-detail-statement" data-reveal="up">{format(copy.performed, { scope: project.scope, title: project.title })}</p>
      <div className="prj-detail-actions" data-reveal="up">
        <Link href={contactHref(project.serviceSlug, project.slug)} className="button button-primary">{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
        {service && <Link href={serviceHref(service.slug)} className="detail-link">{format(copy.learnService, { service: service.title.toLocaleLowerCase(intl) })}</Link>}
      </div>
    </section>

    {relatedProjects.length > 0 && <section className="section prj-detail-related" aria-labelledby="related-projects-title">
      <div className="prj-detail-related-head" data-reveal="up">
        <h2 id="related-projects-title" className="section-title">{copy.related}</h2>
        <Link href={projectCategoryHref(project.serviceSlug)} className="detail-link">{format(copy.seeMore, { scope: project.scope })}</Link>
      </div>
      <ProjectCards items={relatedProjects.slice(0, 3)} />
    </section>}

    <nav className="section prj-detail-pager" aria-label={t.nav.projects}>
      {[{ item: previous, label: t.home.projects.previous, icon: ArrowLeft, side: "prev" }, { item: next, label: t.home.projects.next, icon: ArrowRight, side: "next" }].map(({ item, label: text, icon: Icon, side }) => <Link key={side} className={`prj-detail-pager-link is-${side}`} href={`/du-an/${item.slug}`} data-reveal={side === "prev" ? "left" : "right"}>
        <Image src={item.image} alt="" fill sizes="(max-width: 760px) 92vw, 46vw" />
        <span className="prj-detail-pager-copy"><span className="prj-detail-pager-label"><Icon size={16} aria-hidden="true" />{text}</span><strong>{item.title}</strong><span className="prj-detail-pager-tag">{item.tag}</span></span>
      </Link>)}
    </nav>

    <section className="cta-band" aria-labelledby="project-cta-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="project-cta-title">{copy.nextHeading}</h2><p>{format(copy.nextText, { scope: project.scope })}</p></div>
        <div className="cta-band-actions"><Link href={contactHref(project.serviceSlug, project.slug)} className="button button-light">{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  </div>;
}
