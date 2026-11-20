import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, Briefcase, Building2, Download, HardHat, Users } from "lucide-react";
import { SectionNav } from "@/components/content/section-nav";
import { DocumentGallery } from "@/components/content/document-gallery";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./profile.css";

export async function generateMetadata() {
  const { profile } = await getContent();
  return pageMetadata(profile.title, profile.description, "/ho-so-nang-luc");
}

// 19/11/2026: the hero photo zooms slowly and its copy rises; the contents bar sticks with a pill that follows the
// section being read (SectionNav); photos wipe in; the organisation chart builds from the board down
// (20/11/2026); project names are chips; the shared contact panel carries the PDF download.
// Icons for the organisation branches, in the order of profile.organization: office, business, technical.
const organizationIcons = [Building2, Briefcase, HardHat];

export default async function CompanyProfilePage() {
  const content = await getContent();
  const { company, profile, t } = content;
  const gallery = t.gallery;
  return <div className="profile-page">
    <section className="section profile-hero" aria-labelledby="profile-title">
      <Image src={profile.heroImage.src} alt={profile.heroAlt} fill sizes="100vw" preload />
      <div className="profile-hero-copy"><nav className="breadcrumbs" aria-label={profile.breadcrumbLabel}><ol><li><Link href="/">{t.common.home}</Link></li><li><span aria-current="page">{profile.title}</span></li></ol></nav><h1 id="profile-title">{profile.heroHeading}</h1><p>{profile.introduction}</p></div>
    </section>
    {/* The contents bar only sticks while the sections are on screen. */}
    <div className="profile-body">
    <SectionNav label={profile.contentsLabel} items={profile.sections.filter(section => profile.showCredentials || section.id !== "chuyen-mon").map(section => ({ target: section.id, title: section.title }))} />
    <section id="thong-tin-doanh-nghiep" className="section profile-company" aria-labelledby="profile-company-title">
      <figure className="profile-company-photo" data-reveal="wipe"><Image src={profile.teamImage.src} alt={profile.teamAlt} width={profile.teamImage.width} height={profile.teamImage.height} sizes="(max-width: 760px) 90vw, 55vw" /></figure>
      <div className="profile-company-copy" data-reveal="right"><h2 id="profile-company-title" className="section-title">{profile.teamTitle}</h2><p>{profile.teamCaption}</p><dl className="profile-facts"><div><dt>{t.common.founded}</dt><dd>{company.founded}</dd></div><div><dt>{t.common.taxCode}</dt><dd>{company.taxCode}</dd></div></dl><p className="profile-company-name">{company.name}</p></div>
    </section>

    <section id="phap-ly" className="section profile-legal" aria-labelledby="profile-legal-title">
      <h2 id="profile-legal-title" className="section-title">{profile.legalTitle}</h2>
      <div className="profile-legal-groups">{profile.legalDocuments.map(album => <div className="profile-legal-album" key={album.title} data-reveal="scale"><DocumentGallery title={album.title} items={album.pages} labels={gallery} /><h3>{album.title}</h3></div>)}</div>
    </section>

    <section id="doi-ngu" className={`section ${profile.showCredentials ? "profile-credentials" : "profile-people"}`} aria-labelledby={profile.showCredentials ? "profile-credentials-title" : "profile-organization-title"}>
      {profile.showCredentials && <div id="chuyen-mon">
      <h2 id="profile-credentials-title" className="section-title">{profile.credentialsTitle}</h2>
      <div className="profile-credentials-layout"><figure className="profile-technician"><Image src={profile.technicianImage.src} alt={profile.technicianAlt} width={profile.technicianImage.width} height={profile.technicianImage.height} sizes="(max-width: 760px) 90vw, 35vw" /></figure><div><DocumentGallery title={profile.credentialsTitle} items={profile.credentials} labels={gallery} variant="credentials" /></div></div>
      </div>}
      <div className={`profile-organization${profile.showCredentials ? "" : " profile-organization-only"}`}>{profile.showCredentials ? <h3>{profile.organizationHeading}</h3> : <h2 id="profile-organization-title" className="section-title">{profile.organizationHeading}</h2>}<div className="profile-organization-tree" data-reveal="fade"><p className="profile-management"><span className="profile-org-icon" aria-hidden="true"><Users size={20} /></span>{profile.management}</p><ul>{profile.organization.map((group, index) => { const Icon = organizationIcons[index] ?? Building2; return <li key={group.title} style={{ "--org-index": index } as CSSProperties}><div className="profile-org-card"><div className="profile-org-head"><span className="profile-org-icon" aria-hidden="true"><Icon size={20} /></span>{profile.showCredentials ? <h4>{group.title}</h4> : <h3>{group.title}</h3>}</div><ul>{group.roles.map((role, roleIndex) => <li key={role} style={{ "--org-role": roleIndex } as CSSProperties}>{role}</li>)}</ul></div></li>; })}</ul></div></div>
    </section>

    <section id="du-an-tieu-bieu" className="section profile-projects" aria-labelledby="profile-projects-title">
      <div className="section-heading"><h2 id="profile-projects-title" className="section-title">{profile.projectsTitle}</h2><Link className="detail-link" href="/du-an">{profile.projectsLink}</Link></div>
      <div className="profile-project-layout">{profile.projectChapters.map(chapter => {
        const service = content.service(chapter.serviceSlug);
        if (!service) return null;
        return <article className={`profile-project-chapter profile-project-${chapter.serviceSlug}`} key={chapter.serviceSlug}>
          <div className={`profile-project-photos${chapter.photos.length > 1 ? " profile-project-pair" : ""}`}>{chapter.photos.map(photo => <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={chapter.photos.length > 1 ? "(max-width: 760px) 43vw, 22vw" : "(max-width: 760px) 90vw, 50vw"} />)}</div>
          <h3>{service.pageTitle}</h3><div className="profile-project-links">{chapter.projectSlugs.map(slug => { const project = content.project(slug); return project ? <Link href={`/du-an/${project.slug}`} key={slug}>{project.title}<span className="sr-only"> · {project.tag}</span></Link> : null; })}</div>
        </article>;
      })}</div>
    </section>

    </div>

    <section className="cta-band profile-contact" aria-labelledby="profile-contact-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="profile-contact-title">{profile.contactHeading}</h2><address><a href={company.phoneHref}>{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></address></div>
        <div className="cta-band-actions">
          <Link className="button button-light" href="/lien-he">{profile.contactCta}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="button cta-band-ghost" href={company.profile} download={profile.downloadName} hrefLang="vi" aria-label={profile.downloadLabel}><Download size={18} aria-hidden="true" />{profile.download}</a>
        </div>
      </div>
    </section>
  </div>;
}
