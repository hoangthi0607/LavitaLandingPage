import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { DocumentGallery } from "@/components/content/document-gallery";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./profile.css";

export async function generateMetadata() {
  const { profile } = await getContent();
  return pageMetadata(profile.title, profile.description, "/ho-so-nang-luc");
}

export default async function CompanyProfilePage() {
  const content = await getContent();
  const { company, profile, t } = content;
  const gallery = t.gallery;
  return <>
    <section className="section profile-hero" aria-labelledby="profile-title">
      <Image src={profile.heroImage.src} alt={profile.heroAlt} fill sizes="100vw" preload />
      <div className="profile-hero-copy"><nav className="breadcrumbs" aria-label={profile.breadcrumbLabel}><ol><li><Link href="/">{t.common.home}</Link></li><li><span aria-current="page">{profile.title}</span></li></ol></nav><h1 id="profile-title">{profile.heroHeading}</h1><p>{profile.introduction}</p></div>
    </section>
    <nav className="section profile-contents" aria-label={profile.contentsLabel}>{profile.sections.filter(section => profile.showCredentials || section.id !== "chuyen-mon").map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
    <section id="thong-tin-doanh-nghiep" className="section profile-company" aria-labelledby="profile-company-title">
      <figure className="profile-company-photo" data-reveal="left"><Image src={profile.teamImage.src} alt={profile.teamAlt} width={profile.teamImage.width} height={profile.teamImage.height} sizes="(max-width: 760px) 90vw, 55vw" /></figure>
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
      <div className={`profile-organization${profile.showCredentials ? "" : " profile-organization-only"}`}>{profile.showCredentials ? <h3>{profile.organizationHeading}</h3> : <h2 id="profile-organization-title" className="section-title">{profile.organizationHeading}</h2>}<div className="profile-organization-tree"><p className="profile-management">{profile.management}</p><ul>{profile.organization.map(group => <li key={group.title}>{profile.showCredentials ? <h4>{group.title}</h4> : <h3>{group.title}</h3>}<ul>{group.roles.map(role => <li key={role}>{role}</li>)}</ul></li>)}</ul></div></div>
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

    <section className="section profile-contact" aria-labelledby="profile-contact-title"><div><h2 id="profile-contact-title">{profile.contactHeading}</h2><address><a href={company.phoneHref}>{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></address></div><div className="profile-contact-actions"><Link className="button button-primary" href="/lien-he">{profile.contactCta}<ArrowRight size={18} aria-hidden="true" /></Link><a className="profile-download" href={company.profile} download={profile.downloadName} hrefLang="vi" aria-label={profile.downloadLabel}><Download size={17} aria-hidden="true" />{profile.download}</a></div></section>
  </>;
}
