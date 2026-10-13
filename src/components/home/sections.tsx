import Image from "next/image";
import { ArrowRight, ArrowUpRight, Download, Mail, MapPin, Phone, Plus } from "lucide-react";
import { company, projects, services, values } from "@/data/home";

function ProfileLink({ children, className = "detail-link", page }: { children: React.ReactNode; className?: string; page?: number }) {
  return <a className={className} href={`${company.profile}${page ? `#page=${page}` : ""}`} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (PDF, mở trong tab mới)</span></a>;
}

export function About() {
  return <>
    <div className="intro-strip">
      <p>Tối ưu giải pháp.<br /><strong>Gia tăng giá trị.</strong></p>
      <p>Lavita đồng hành cùng công trình dân dụng và công nghiệp từ năm 2023.</p>
      <div><ProfileLink>Hồ sơ năng lực Lavita</ProfileLink><span className="file-note">PDF · 67 MB</span></div>
    </div>
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="about-photo"><Image src="/images/engineer.webp" alt="Nhân sự kỹ thuật Lavita kiểm tra tủ điện của hệ thống PCCC" fill sizes="(max-width: 760px) 100vw, 45vw" /><div className="photo-caption">Đồng hành cùng sự an toàn.</div></div>
      <div className="about-copy">
        <h2 id="about-title">Kiến tạo niềm tin.<br /><span>Vững bền giá trị.</span></h2>
        <p className="lead">Lavita cung cấp dịch vụ và giải pháp phòng cháy chữa cháy cho công trình dân dụng và công nghiệp.</p>
        <p>Thành lập từ năm 2023, Công ty TNHH Xây dựng Lavita đồng hành cùng khách hàng từ tư vấn thiết kế, thi công đến bảo trì. Chúng tôi hướng đến giải pháp hiệu quả, tối ưu chi phí và công trình an toàn, bền vững.</p>
        <a className="detail-link" href="#capabilities">Khám phá năng lực Lavita <ArrowRight size={19} aria-hidden="true" /></a>
      </div>
    </section>
  </>;
}

export function Services() {
  return <section id="services" className="section services" aria-labelledby="services-title">
    <div className="services-intro">
      <h2 id="services-title">Một đối tác.<br />Trọn vẹn giải pháp PCCC.</h2>
      <p>Từ bản vẽ đầu tiên đến quá trình vận hành — Lavita đồng hành ở từng giai đoạn của công trình.</p>
      <a className="detail-link" href="#contact">Trao đổi về công trình <ArrowRight size={19} aria-hidden="true" /></a>
    </div>
    <div className="service-list">
      {services.map((service, index) => <details className="service-row" key={service.title} open={index < 2}>
        <summary><h3>{service.title}</h3><Plus size={22} aria-hidden="true" /></summary>
        <div className="service-body"><p>{service.description}</p><a href={`mailto:${company.email}?subject=${encodeURIComponent(`Tư vấn ${service.title.toLowerCase()} PCCC`)}`}>Gửi yêu cầu tư vấn <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </details>)}
    </div>
  </section>;
}

export function Projects() {
  return <section id="projects" className="section projects" aria-labelledby="projects-title">
    <div className="section-heading"><h2 id="projects-title">Năng lực qua<br /><span>từng công trình.</span></h2><div><ProfileLink>Xem hồ sơ dự án</ProfileLink><span className="file-note">PDF · 67 MB</span></div></div>
    <div className="project-grid">
      {projects.map(project => <article className="project-card" key={project.title}>
        <div className="project-photo"><Image src={project.image} alt={`${project.title} – ${project.tag}`} fill sizes="(max-width: 760px) 100vw, 50vw" /><span>{project.tag}</span></div>
        <div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><ProfileLink className="project-link" page={project.profilePage}>Xem trong hồ sơ<span className="sr-only">: {project.title}</span></ProfileLink></div>
      </article>)}
    </div>
  </section>;
}

export function OtherSections() {
  return <>
    <section id="capabilities" className="section capabilities" aria-labelledby="capabilities-title">
      <div><h2 id="capabilities-title">Chuyên môn.<br />Trách nhiệm.<br /><span>Niềm tin.</span></h2><p>Đội ngũ kỹ thuật, hồ sơ pháp lý và hệ thống giá trị là nền tảng để Lavita đồng hành cùng khách hàng.</p><ProfileLink className="button button-light">Xem hồ sơ năng lực</ProfileLink><span className="file-note">PDF · 67 MB</span></div>
      <ul className="values-list">{values.map(value => <li key={value}>{value}</li>)}</ul>
    </section>
    <section className="section training" aria-labelledby="training-title">
      <div className="training-photo"><Image src="/images/training.webp" alt="Hoạt động huấn luyện sử dụng bình chữa cháy" fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
      <div><h2 id="training-title">An toàn bắt đầu<br />từ sự chủ động.</h2><p className="lead">Đào tạo và huấn luyện nghiệp vụ PCCC — nâng cao khả năng ứng phó tại công trình.</p><p>Song hành với hệ thống kỹ thuật, Lavita cung cấp hoạt động tập huấn nghiệp vụ và dịch vụ nạp sạc bình chữa cháy.</p><a className="detail-link" href={`mailto:${company.email}?subject=${encodeURIComponent("Tư vấn đào tạo và bảo trì PCCC")}`}>Tư vấn đào tạo & bảo trì <ArrowUpRight size={19} aria-hidden="true" /></a></div>
    </section>
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div><h2 id="contact-title">Công trình của bạn.<br /><span>Giải pháp của chúng tôi.</span></h2><p>Trao đổi nhu cầu để cùng lựa chọn giải pháp PCCC phù hợp.</p><a className="button button-primary" href={company.phoneHref}><Phone size={18} aria-hidden="true" /> Gọi tư vấn ngay</a></div>
      <address>
        <a href={company.phoneHref}><Phone aria-hidden="true" /><span>Hotline<strong>{company.phone}</strong></span><ArrowUpRight className="contact-arrow" size={19} aria-hidden="true" /></a>
        <a href={`mailto:${company.email}`}><Mail aria-hidden="true" /><span>Email<strong>{company.email}</strong></span><ArrowUpRight className="contact-arrow" size={19} aria-hidden="true" /></a>
        <div><MapPin aria-hidden="true" /><span>Địa chỉ<strong>{company.address}</strong></span></div>
      </address>
    </section>
  </>;
}
