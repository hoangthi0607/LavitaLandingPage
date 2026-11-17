import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { DocumentGallery } from "@/components/content/document-gallery";
import { ScrollReveal } from "@/components/content/scroll-reveal";
import { company, companyProfile, getProject, getService } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "./profile.css";

export const metadata = pageMetadata(companyProfile.title, companyProfile.description, "/ho-so-nang-luc");

export default function CompanyProfilePage() {
  return <>
    <section className="section profile-hero" aria-labelledby="profile-title">
      <Image src={companyProfile.heroImage.src} alt={companyProfile.heroImage.alt} fill sizes="100vw" preload />
      <div className="profile-hero-copy"><nav className="breadcrumbs" aria-label="Đường dẫn"><ol><li><Link href="/">Trang chủ</Link></li><li><span aria-current="page">Hồ sơ năng lực</span></li></ol></nav><h1 id="profile-title">{companyProfile.heroHeading}</h1><p>{companyProfile.introduction}</p></div>
    </section>
    <nav className="section profile-contents" aria-label="Nội dung hồ sơ năng lực">{companyProfile.sections.filter(section => companyProfile.showCredentials || section.id !== "chuyen-mon").map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>

    <ScrollReveal>
    <section id="thong-tin-doanh-nghiep" className="section profile-company" aria-labelledby="profile-company-title">
      <figure className="profile-company-photo"><Image src={companyProfile.teamImage.src} alt={companyProfile.teamImage.alt} width={companyProfile.teamImage.width} height={companyProfile.teamImage.height} sizes="(max-width: 760px) 90vw, 55vw" /></figure>
      <div className="profile-company-copy"><h2 id="profile-company-title">{companyProfile.teamTitle}</h2><p>{companyProfile.teamCaption}</p><dl className="profile-facts"><div><dt>Thành lập</dt><dd>{companyProfile.founded}</dd></div><div><dt>Mã số thuế</dt><dd>{company.taxCode}</dd></div></dl><p className="profile-company-name">{company.name}</p></div>
    </section>

    <section id="phap-ly" className="section profile-legal" aria-labelledby="profile-legal-title">
      <h2 id="profile-legal-title">{companyProfile.legalTitle}</h2>
      <div className="profile-legal-groups">{companyProfile.legalDocuments.map(album => <div className="profile-legal-album" key={album.title}><DocumentGallery title={album.title} items={album.pages} /><h3>{album.title}</h3></div>)}</div>
    </section>

    <section id="doi-ngu" className={`section ${companyProfile.showCredentials ? "profile-credentials" : "profile-people"}`} aria-labelledby={companyProfile.showCredentials ? "profile-credentials-title" : "profile-organization-title"}>
      {companyProfile.showCredentials && <div id="chuyen-mon">
      <h2 id="profile-credentials-title">{companyProfile.credentialsTitle}</h2>
      <div className="profile-credentials-layout"><figure className="profile-technician"><Image src={companyProfile.technicianImage.src} alt={companyProfile.technicianImage.alt} width={companyProfile.technicianImage.width} height={companyProfile.technicianImage.height} sizes="(max-width: 760px) 90vw, 35vw" /></figure><div><DocumentGallery title={companyProfile.credentialsTitle} items={companyProfile.credentials} variant="credentials" /></div></div>
      </div>}
      <div className={`profile-organization${companyProfile.showCredentials ? "" : " profile-organization-only"}`}>{companyProfile.showCredentials ? <h3>Cơ cấu tổ chức</h3> : <h2 id="profile-organization-title">Cơ cấu tổ chức</h2>}<div className="profile-organization-tree"><p className="profile-management">Ban giám đốc</p><ul>{companyProfile.organization.map(group => <li key={group.title}>{companyProfile.showCredentials ? <h4>{group.title}</h4> : <h3>{group.title}</h3>}<ul>{group.roles.map(role => <li key={role}>{role}</li>)}</ul></li>)}</ul></div></div>
    </section>

    <section id="du-an-tieu-bieu" className="section profile-projects" aria-labelledby="profile-projects-title">
      <div className="section-heading"><h2 id="profile-projects-title">{companyProfile.projectsTitle}</h2><Link className="detail-link" href="/du-an">Xem dự án theo hạng mục</Link></div>
      <div className="profile-project-layout">{companyProfile.projectChapters.map(chapter => {
        const service = getService(chapter.serviceSlug);
        if (!service) return null;
        return <article className={`profile-project-chapter profile-project-${chapter.serviceSlug}`} key={chapter.serviceSlug}>
          <div className={`profile-project-photos${chapter.photos.length > 1 ? " profile-project-pair" : ""}`}>{chapter.photos.map(photo => <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={chapter.photos.length > 1 ? "(max-width: 760px) 43vw, 22vw" : "(max-width: 760px) 90vw, 50vw"} />)}</div>
          <h3>{service.title} PCCC</h3><div className="profile-project-links">{chapter.projectSlugs.map(slug => { const project = getProject(slug); return project ? <Link href={`/du-an/${project.slug}`} key={slug}>{project.title}<span className="sr-only"> · {project.tag}</span></Link> : null; })}</div>
        </article>;
      })}</div>
    </section>

    <section className="section profile-contact" aria-labelledby="profile-contact-title"><div><h2 id="profile-contact-title">Cùng trao đổi về công trình của bạn.</h2><address><a href={company.phoneHref}>{company.phone}</a><a href={`mailto:${company.email}`}>{company.email}</a></address></div><div className="profile-contact-actions"><Link className="button button-primary" href="/lien-he">Liên hệ Lavita<ArrowRight size={18} aria-hidden="true" /></Link><a className="profile-download" href={company.profile} download="Ho-so-nang-luc-Lavita.pdf" aria-label="Tải hồ sơ PDF, khoảng 67 MB"><Download size={17} aria-hidden="true" />Tải hồ sơ PDF</a></div></section>
    </ScrollReveal>
  </>;
}
