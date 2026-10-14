import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { company, contactHref, projects, serviceGroups, services, values } from "@/data/home";

function ProfileLink({ children, className = "detail-link", page }: { children: React.ReactNode; className?: string; page?: number }) {
  return <a className={className} href={`${company.profile}${page ? `#page=${page}` : ""}`} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (PDF, mở trong tab mới)</span></a>;
}

export function IntroStrip() {
  return <div className="intro-strip">
      <p>Tối ưu giải pháp.<br /><strong>Gia tăng giá trị.</strong></p>
      <p>Lavita đồng hành cùng công trình dân dụng và công nghiệp từ năm 2023.</p>
      <div><ProfileLink>Hồ sơ năng lực Lavita</ProfileLink><span className="file-note">PDF · 67 MB</span></div>
    </div>;
}

export function About({ overview = true }: { overview?: boolean }) {
  return <section id="about" className="section about" aria-labelledby="about-title">
      <div className="about-photo"><Image src="/images/engineer.webp" alt="Nhân sự kỹ thuật Lavita kiểm tra tủ điện của hệ thống PCCC" fill sizes="(max-width: 760px) 100vw, 45vw" /><div className="photo-caption">Đồng hành cùng sự an toàn.</div></div>
      <div className="about-copy">
        <h2 id="about-title">Kiến tạo niềm tin.<br /><span>Vững bền giá trị.</span></h2>
        <p className="lead">Lavita cung cấp dịch vụ và giải pháp phòng cháy chữa cháy cho công trình dân dụng và công nghiệp.</p>
        <p>Thành lập từ năm 2023, Công ty TNHH Xây dựng Lavita đồng hành cùng khách hàng từ tư vấn thiết kế, thi công đến bảo trì. Chúng tôi hướng đến giải pháp hiệu quả, tối ưu chi phí và công trình an toàn, bền vững.</p>
        {overview ? <Link className="detail-link" href="/ve-lavita">Tìm hiểu về Lavita <ArrowRight size={19} aria-hidden="true" /></Link> : <ProfileLink page={2}>Mở giới thiệu trong hồ sơ</ProfileLink>}
      </div>
    </section>;
}

export function Services() {
  return <section id="services" className="section services" aria-labelledby="services-title">
    <div className="services-intro">
      <h2 id="services-title">Dịch vụ PCCC<br /><span>theo nhu cầu của bạn.</span></h2>
      <p>Từ bản vẽ đầu tiên đến quá trình vận hành — Lavita đồng hành ở từng giai đoạn của công trình.</p>
      <nav className="service-entry" aria-label="Dịch vụ theo nhu cầu">{serviceGroups.map(group => <Link href={`/dich-vu#group-${group.id}`} key={group.id}>{group.title}<ArrowRight size={18} aria-hidden="true" /></Link>)}</nav>
      <Link className="detail-link" href="/dich-vu">Xem tất cả dịch vụ <ArrowRight size={19} aria-hidden="true" /></Link>
    </div>
    <div className="service-list">
      {services.map((service, index) => <details className="service-row" key={service.title} open={index < 2}>
        <summary><h3>{service.title}</h3><Plus size={22} aria-hidden="true" /></summary>
        <div className="service-body"><p>{service.description}</p><Link href={`/dich-vu/${service.slug}`}>Xem phạm vi & dự án tham khảo <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </details>)}
    </div>
  </section>;
}

export function Projects() {
  return <section id="projects" className="section projects" aria-labelledby="projects-title">
    <div className="section-heading"><h2 id="projects-title">Năng lực qua<br /><span>từng công trình.</span></h2><Link className="detail-link" href="/du-an">Xem dự án theo phạm vi PCCC <ArrowRight size={19} aria-hidden="true" /></Link></div>
    <div className="project-grid">
      {projects.map(project => <article className="project-card" key={project.title}>
        <div className="project-photo"><Image src={project.image} alt={`${project.title} – ${project.tag}`} fill sizes="(max-width: 760px) 100vw, 50vw" /><span>{project.tag}</span></div>
        <div className="project-info"><div><h3><Link href={`/du-an/${project.slug}`}>{project.title}</Link></h3><p>{project.description}</p></div><Link className="project-link" href={`/du-an/${project.slug}`}>Xem phạm vi PCCC <ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {project.title}</span></Link><ProfileLink className="project-link project-proof" page={project.profilePage}>Mở hồ sơ PDF<span className="sr-only">: {project.title}</span></ProfileLink></div>
      </article>)}
    </div>
  </section>;
}

export function Capabilities() {
  return <section id="capabilities" className="section capabilities" aria-labelledby="capabilities-title">
      <div><h2 id="capabilities-title">Chuyên môn.<br />Trách nhiệm.<br /><span>Niềm tin.</span></h2><p>Đội ngũ kỹ thuật, hồ sơ pháp lý và hệ thống giá trị là nền tảng để Lavita đồng hành cùng khách hàng.</p><ProfileLink className="button button-light">Xem hồ sơ năng lực</ProfileLink><span className="file-note">PDF · 67 MB</span></div>
      <ul className="values-list">{values.map(value => <li key={value}>{value}</li>)}</ul>
    </section>;
}

export function Training() {
  return <section id="training" className="section training" aria-labelledby="training-title">
      <div className="training-photo"><Image src="/images/training.webp" alt="Hoạt động huấn luyện sử dụng bình chữa cháy" fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
      <div><h2 id="training-title">An toàn bắt đầu<br />từ sự chủ động.</h2><p className="lead">Đào tạo và huấn luyện nghiệp vụ PCCC — nâng cao khả năng ứng phó tại công trình.</p><p>Song hành với hệ thống kỹ thuật, Lavita cung cấp hoạt động tập huấn nghiệp vụ và dịch vụ nạp sạc bình chữa cháy.</p><Link className="detail-link" href="/dich-vu/dao-tao-huan-luyen">Tìm hiểu đào tạo & huấn luyện <ArrowRight size={19} aria-hidden="true" /></Link><Link className="detail-link" href={contactHref("bao-tri-sua-chua")}>Trao đổi về bảo trì <ArrowRight size={19} aria-hidden="true" /></Link></div>
    </section>;
}

export function Contact() {
  return <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div><h2 id="contact-title">Công trình của bạn.<br /><span>Giải pháp của chúng tôi.</span></h2><p>Chọn dịch vụ, chia sẻ nhu cầu và trao đổi cùng Lavita về công trình.</p><Link className="button button-primary" href="/lien-he">Chuẩn bị nội dung tư vấn <ArrowRight size={18} aria-hidden="true" /></Link></div>
      <address>
        <a href={company.phoneHref}><Phone aria-hidden="true" /><span>Hotline<strong>{company.phone}</strong></span><ArrowUpRight className="contact-arrow" size={19} aria-hidden="true" /></a>
        <a href={`mailto:${company.email}`}><Mail aria-hidden="true" /><span>Email<strong>{company.email}</strong></span><ArrowUpRight className="contact-arrow" size={19} aria-hidden="true" /></a>
        <div><MapPin aria-hidden="true" /><span>Địa chỉ<strong>{company.address}</strong></span></div>
      </address>
    </section>;
}
