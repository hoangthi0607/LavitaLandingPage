import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowRight, Building2, CalendarDays, Check, FileText, MapPin, Phone, Quote } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ParallaxBand, TiltCard, TimelineLine } from "@/components/content/about-effects";
import { Brand } from "@/components/layout/brand";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { pageMetadata } from "@/lib/metadata";
import "./about.css";

export async function generateMetadata() {
  const { about } = await getContent();
  return pageMetadata(about.title, about.description, "/ve-lavita");
}

// Structure follows dcons.vn/gioi-thieu: intro, parallax photo, company details, purpose, timeline, values.
// 19/11/2026: intro rises on load, the photo band opens to full width on scroll, purpose photos wipe in, mission
// points arrive one by one, growth bars rise, and the page closes on the shared dark contact band.
export default async function AboutPage() {
  const { about, company, site, t } = await getContent();
  const maximum = Math.max(...about.milestones.map(item => item.value));
  const details = [
    { icon: Building2, title: about.companyName, lines: [company.name] },
    { icon: MapPin, title: about.headOffice, lines: [company.address] },
    { icon: CalendarDays, title: t.common.founded, lines: [format(about.foundedValue, { year: company.founded })] },
    { icon: FileText, title: t.common.taxCode, lines: [company.taxCode] },
  ];

  return <div className="about-page">
    <section className="section about-intro" aria-labelledby="about-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: about.title }]} />
      <div className="about-intro-grid">
        <h1 id="about-title">{about.title}</h1>
        <div className="about-intro-copy">
          <p className="about-intro-lead">{about.lead}</p>
          {about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <Link className="detail-link" href="/ho-so-nang-luc">{t.common.viewProfile}</Link>
        </div>
      </div>
    </section>

    <ParallaxBand className="about-band" src={about.images.banner} alt={about.bannerAlt} />

    <section id="gioi-thieu" className="section about-company" aria-labelledby="about-company-title">
      <h2 id="about-company-title" className="sr-only">{about.companyInfo}</h2>
      <div className="about-company-logo" data-reveal="left"><Brand link={false} labels={{ tagline: t.company.tagline, home: t.nav.brandHome, logo: t.nav.brandLogo }} /></div>
      <div className="about-company-list">
        {details.map(item => <div className="about-company-item" data-reveal="right" key={item.title}>
          <span className="about-company-icon"><item.icon size={22} aria-hidden="true" /></span>
          <div><h3>{item.title}</h3>{item.lines.map(line => <p key={line}>{line}</p>)}</div>
        </div>)}
        <div className="about-company-item" data-reveal="right">
          <span className="about-company-icon"><Phone size={22} aria-hidden="true" /></span>
          <div><h3>{about.contact}</h3>
            <p>{t.common.hotline}: <a href={company.phoneHref}>{company.phone}</a></p>
            <p>{t.common.email}: <a href={`mailto:${company.email}`}>{company.email}</a></p>
            <p>{t.common.website}: <a href={site.url}>{site.url.replace(/^https:\/\//, "")}</a></p>
          </div>
        </div>
      </div>
    </section>

    <section id="tam-nhin-su-menh" className="section about-purpose" aria-label={about.purposeLabel}>
      <div className="about-purpose-row">
        <figure className="about-purpose-photo" data-reveal="wipe"><Image src={about.images.overview} alt={about.overviewAlt} fill sizes="(max-width: 900px) 92vw, 45vw" /></figure>
        <div className="about-purpose-copy" data-reveal="right"><h2 className="about-section-title">{about.visionHeading}</h2><blockquote className="about-vision"><Quote className="about-vision-mark" size={40} strokeWidth={1.5} aria-hidden="true" /><p>{about.vision}</p></blockquote></div>
      </div>
      <div className="about-purpose-row about-purpose-row-reverse">
        <figure className="about-purpose-photo" data-reveal="wipe"><Image src={about.images.vision.src} alt={about.visionAlt} fill sizes="(max-width: 900px) 92vw, 45vw" /></figure>
        <div className="about-purpose-copy"><h2 className="about-section-title" data-reveal="left">{about.missionHeading}</h2><ul className="about-mission">{about.mission.map(item => <li key={item} data-reveal="left"><span className="about-mission-check" aria-hidden="true"><Check size={16} strokeWidth={2.5} /></span>{item}</li>)}</ul></div>
      </div>
    </section>

    <section id="lich-su-phat-trien" className="section about-history" aria-labelledby="about-history-title">
      <h2 id="about-history-title" className="about-section-title about-section-title-center" data-reveal="down">{about.historyHeading}</h2>
      <div className="about-timeline">
        <TimelineLine />
        <ol>
        {about.history.map((item, index) => <li className={`about-timeline-item ${index % 2 ? "is-right" : "is-left"}${item.pending ? " is-pending" : ""}`} key={item.period}>
          <div className="about-timeline-marker" data-reveal="pop" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
          <span className="about-timeline-connector" data-reveal="grow" aria-hidden="true" />
          <div className="about-timeline-panel" data-reveal={index % 2 ? "left" : "right"}>
            <p className="about-timeline-period">{item.period}</p>
            <h3>{item.pending ? <span className="about-pending">{t.common.pending}</span> : item.title}</h3>
            <p>{item.text}</p>
          </div>
          <div className="about-timeline-media" data-reveal="scale"><span>{about.historyPendingMedia}</span></div>
        </li>)}
        </ol>
      </div>
    </section>

    <section id="ke-hoach-tang-truong" className="section about-growth" aria-labelledby="about-growth-title">
      <div className="about-growth-copy" data-reveal="left"><h2 id="about-growth-title" className="about-section-title">{about.growthHeading}</h2><p>{about.growthDescription}</p><p id="about-growth-note" className="about-growth-note">{about.growthNote}</p></div>
      <ol className="about-growth-chart" aria-label={about.growthChartLabel} aria-describedby="about-growth-note">
        {about.milestones.map((item, index) => <li key={item.year} data-reveal="up" style={{ "--growth-ratio": item.value / maximum, "--i": index } as CSSProperties}>
          <span className="about-growth-year">{item.year}</span><span className="about-growth-bar" aria-hidden="true" /><span className="about-growth-amount"><strong>{item.value}</strong> {about.growthUnit}</span>
        </li>)}
      </ol>
    </section>

    <section id="gia-tri-cot-loi" className="section about-values" aria-labelledby="about-values-title">
      <h2 id="about-values-title" className="about-section-title about-section-title-center" data-reveal="down">{about.coreValuesHeading}</h2>
      <ul className="about-values-list">
        {about.coreValues.map(item => <li key={item.title} data-reveal="up">
          <TiltCard className="about-value-card">
            <Image className="about-value-image" src={item.image} alt="" fill sizes="(max-width: 600px) 86vw, (max-width: 1100px) 44vw, 260px" />
            <div className="about-value-info"><h3>{item.title}</h3><p>{item.text}</p></div>
          </TiltCard>
        </li>)}
      </ul>
    </section>

    <section className="cta-band" aria-labelledby="about-next-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="about-next-title">{about.nextHeading}</h2><p>{about.nextText}</p></div>
        <div className="cta-band-actions">
          <Link className="button button-light" href="/dich-vu">{t.common.findService}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="button cta-band-ghost" href={company.phoneHref}><Phone size={18} aria-hidden="true" />{company.phone}</a>
        </div>
      </div>
    </section>
  </div>;
}
