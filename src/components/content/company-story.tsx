import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { aboutCompany } from "@/data/home";

export function CompanyStory() {
  const { overview, vision, mission, coreValues, growth } = aboutCompany;
  const maximum = Math.max(...growth.milestones.map(item => item.value));

  return <>
    <section id="gioi-thieu" className="company-overview" aria-labelledby="company-overview-title">
      <div className="company-overview-heading"><h2 id="company-overview-title">{overview.sectionTitle}</h2><p>{overview.heading}</p><Link className="button button-light" href="/ho-so-nang-luc">Xem hồ sơ năng lực<ArrowRight size={18} aria-hidden="true" /></Link></div>
      <div className="company-story-copy">
        <p className="lead">{overview.lead}</p>
        {overview.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>

    <nav className="section company-story-nav" aria-label="Nội dung về Lavita">
      {aboutCompany.sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}<ArrowDown size={15} aria-hidden="true" /></a>)}
    </nav>

    <section id="tam-nhin-su-menh" className="section company-purpose" aria-label="Tầm nhìn và sứ mệnh">
      <div className="company-purpose-row company-vision-row">
        <figure className="company-vision-photo"><Image src={overview.image.src} alt={overview.image.alt} fill sizes="(max-width: 760px) 90vw, 45vw" /></figure>
        <div className="company-vision"><h2>{vision.heading}</h2><p>{vision.text}</p><Link className="button button-primary" href="/du-an">Khám phá dự án PCCC<ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
      <div className="company-purpose-row company-mission-row"><div className="company-mission"><h2>{mission.heading}</h2><ul>{mission.items.map(item => <li key={item}>{item}</li>)}</ul></div><figure className="company-team-photo"><Image src={vision.image.src} alt={vision.image.alt} width={vision.image.width} height={vision.image.height} sizes="(max-width: 760px) 90vw, 45vw" /></figure></div>
    </section>

    <section id="gia-tri-cot-loi" className="section company-values" aria-labelledby="company-values-title">
      <h2 id="company-values-title">{coreValues.heading}</h2>
      <ul className="company-values-list">{coreValues.items.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ul>
    </section>

    <section id="ke-hoach-tang-truong" className="section company-growth" aria-labelledby="company-growth-title">
      <div className="company-growth-copy"><h2 id="company-growth-title">{growth.heading}</h2><p className="lead">{growth.description}</p><p id="company-growth-note">{growth.note}</p></div>
      <ol className="company-growth-chart" aria-label="Mục tiêu kế hoạch theo năm, đơn vị tỷ đồng" aria-describedby="company-growth-note">
        {growth.milestones.map(item => <li key={item.year} style={{ "--growth-ratio": item.value / maximum } as CSSProperties}>
          <span className="company-growth-year">{item.year}</span><span className="company-growth-bar" aria-hidden="true" /><span className="company-growth-amount"><strong>{item.value}</strong><span>{growth.unit}</span></span>
        </li>)}
      </ol>
    </section>
    <section className="section company-details" aria-labelledby="company-details-title"><h2 id="company-details-title">Thông tin doanh nghiệp</h2><dl className="company-facts">{aboutCompany.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></section>
  </>;
}
