import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, FileText, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ParallaxBand, TiltCard, TimelineLine } from "@/components/content/about-effects";
import { Brand } from "@/components/layout/brand";
import { aboutCompany, company, site } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "./about.css";

export const metadata = pageMetadata(aboutCompany.title, aboutCompany.description, "/ve-lavita");

// Structure follows dcons.vn/gioi-thieu: intro, parallax photo, company details, purpose, timeline, values.
export default function AboutPage() {
  const { overview, vision, mission, coreValues, history, growth } = aboutCompany;
  const maximum = Math.max(...growth.milestones.map(item => item.value));
  const founded = aboutCompany.facts.find(fact => fact.label === "Thành lập")?.value;
  const details = [
    { icon: Building2, title: "Tên doanh nghiệp", lines: [company.name] },
    { icon: MapPin, title: "Trụ sở chính", lines: [company.address] },
    { icon: CalendarDays, title: "Thành lập", lines: [`Năm ${founded}`] },
    { icon: FileText, title: "Mã số thuế", lines: [company.taxCode] },
  ];

  return <div className="about-page">
    <section className="section about-intro" aria-labelledby="about-title">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: aboutCompany.title }]} />
      <div className="about-intro-grid">
        <h1 id="about-title">{aboutCompany.title}</h1>
        <div className="about-intro-copy">
          <p className="about-intro-lead">{overview.lead}</p>
          {overview.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <Link className="detail-link" href="/ho-so-nang-luc">Xem hồ sơ năng lực</Link>
        </div>
      </div>
    </section>

    <ParallaxBand className="about-band" src={aboutCompany.bannerImage.src} alt={aboutCompany.bannerImage.alt} />

    <section id="gioi-thieu" className="section about-company" aria-labelledby="about-company-title">
      <h2 id="about-company-title" className="sr-only">Thông tin doanh nghiệp</h2>
      <div className="about-company-logo" data-reveal="left"><Brand link={false} /></div>
      <div className="about-company-list">
        {details.map(item => <div className="about-company-item" data-reveal="right" key={item.title}>
          <item.icon size={26} aria-hidden="true" />
          <div><h3>{item.title}</h3>{item.lines.map(line => <p key={line}>{line}</p>)}</div>
        </div>)}
        <div className="about-company-item" data-reveal="right">
          <Phone size={26} aria-hidden="true" />
          <div><h3>Liên hệ</h3>
            <p>Hotline: <a href={company.phoneHref}>{company.phone}</a></p>
            <p>Email: <a href={`mailto:${company.email}`}>{company.email}</a></p>
            <p>Website: <a href={site.url}>{site.url.replace(/^https:\/\//, "")}</a></p>
          </div>
        </div>
      </div>
    </section>

    <section id="tam-nhin-su-menh" className="section about-purpose" aria-label="Tầm nhìn và sứ mệnh">
      <div className="about-purpose-row">
        <figure className="about-purpose-photo" data-reveal="left"><Image src={overview.image.src} alt={overview.image.alt} fill sizes="(max-width: 900px) 92vw, 45vw" /></figure>
        <div className="about-purpose-copy" data-reveal="right"><h2 className="about-section-title">{vision.heading}</h2><p>{vision.text}</p></div>
      </div>
      <div className="about-purpose-row about-purpose-row-reverse">
        <figure className="about-purpose-photo" data-reveal="right"><Image src={vision.image.src} alt={vision.image.alt} fill sizes="(max-width: 900px) 92vw, 45vw" /></figure>
        <div className="about-purpose-copy" data-reveal="left"><h2 className="about-section-title">{mission.heading}</h2><ul>{mission.items.map(item => <li key={item}>{item}</li>)}</ul></div>
      </div>
    </section>

    <section id="lich-su-phat-trien" className="section about-history" aria-labelledby="about-history-title">
      <h2 id="about-history-title" className="about-section-title about-section-title-center" data-reveal="down">{history.heading}</h2>
      <div className="about-timeline">
        <TimelineLine />
        <ol>
        {history.items.map((item, index) => <li className={`about-timeline-item ${index % 2 ? "is-right" : "is-left"}${item.pending ? " is-pending" : ""}`} key={item.period}>
          <div className="about-timeline-marker" data-reveal="pop" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
          <span className="about-timeline-connector" data-reveal="grow" aria-hidden="true" />
          <div className="about-timeline-panel" data-reveal={index % 2 ? "left" : "right"}>
            <p className="about-timeline-period">{item.period}</p>
            <h3>{item.pending ? <span className="about-pending">{history.pendingLabel}</span> : item.title}</h3>
            <p>{item.text}</p>
          </div>
          <div className="about-timeline-media" data-reveal="scale"><span>{history.pendingMedia}</span></div>
        </li>)}
        </ol>
      </div>
    </section>

    <section id="ke-hoach-tang-truong" className="section about-growth" aria-labelledby="about-growth-title">
      <div className="about-growth-copy" data-reveal="left"><h2 id="about-growth-title" className="about-section-title">{growth.heading}</h2><p>{growth.description}</p><p id="about-growth-note" className="about-growth-note">{growth.note}</p></div>
      <ol className="about-growth-chart" aria-label="Mục tiêu kế hoạch theo năm, đơn vị tỷ đồng" aria-describedby="about-growth-note">
        {growth.milestones.map(item => <li key={item.year} data-reveal="up" style={{ "--growth-ratio": item.value / maximum } as CSSProperties}>
          <span className="about-growth-year">{item.year}</span><span className="about-growth-bar" aria-hidden="true" /><span className="about-growth-amount"><strong>{item.value}</strong> {growth.unit}</span>
        </li>)}
      </ol>
    </section>

    <section id="gia-tri-cot-loi" className="section about-values" aria-labelledby="about-values-title">
      <h2 id="about-values-title" className="about-section-title about-section-title-center" data-reveal="down">{coreValues.heading}</h2>
      <ul className="about-values-list">
        {coreValues.items.map(item => <li key={item.title} data-reveal="up">
          <TiltCard className="about-value-card">
            <Image className="about-value-image" src={item.image} alt="" fill sizes="(max-width: 600px) 86vw, (max-width: 1100px) 44vw, 260px" />
            <div className="about-value-info"><h3>{item.title}</h3><p>{item.text}</p></div>
          </TiltCard>
        </li>)}
      </ul>
    </section>

    <section className="section content-next"><div><h2>Tìm giải pháp cho công trình.</h2><p>Xem dịch vụ PCCC, đối chiếu dự án theo phạm vi và trao đổi nhu cầu cùng Lavita.</p></div><Link className="button button-primary" href="/dich-vu">Tìm dịch vụ phù hợp<ArrowRight size={18} aria-hidden="true" /></Link></section>
  </div>;
}
