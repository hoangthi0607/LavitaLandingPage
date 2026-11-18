import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { homePartners, serviceHref } from "@/data/home";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getNewsPage, itemSlug, newsSource, type NewsItem } from "@/lib/fire-police-news";

// Company intro in the dcons.vn "about-home" layout: heading, copy, large figures, overlapping photos, partner row.
// #capabilities is kept on the figures so older shared links still land on this section.
export async function HomeAbout() {
  const { company, services, t } = await getContent();
  const about = t.home.about;
  return <section id="about" className="section home-about" aria-labelledby="home-about-title">
    <div className="home-about-inner">
      <div className="home-about-copy">
        <h2 id="home-about-title" data-reveal="up">{about.heading}</h2>
        <p className="home-about-desc" data-reveal="up">{about.lead}</p>
        <div id="capabilities" className="home-about-stats" data-reveal="up">
          <div><strong>{company.founded}</strong><span>{about.foundedLabel[0]}<br />{about.foundedLabel[1]}</span></div>
          <div><strong>{services.length}</strong><span>{about.servicesLabel[0]}<br />{about.servicesLabel[1]}</span></div>
        </div>
        <Link className="detail-link" href="/ve-lavita" data-reveal="up">{about.learnMore}</Link>
      </div>
      <div className="home-about-media" data-reveal="right">
        <div className="home-about-photo home-about-photo-top"><Image src="/images/profile/doi-ngu-thi-cong-c2.webp" alt={about.photoTopAlt} fill sizes="(max-width: 980px) 70vw, 30vw" /></div>
        <div className="home-about-photo home-about-photo-main"><Image src="/images/engineer.webp" alt={about.photoMainAlt} fill sizes="(max-width: 980px) 85vw, 40vw" /></div>
      </div>
    </div>
    <div className="home-partners" data-reveal="up">
      <h3>{about.partners[0]}<br />{about.partners[1]}</h3>
      {homePartners.length > 0
        ? <ul>{homePartners.map(partner => <li key={partner}>{partner}</li>)}</ul>
        : <><ul aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <li key={index} className="is-pending">{about.partnerLogo}</li>)}</ul><p className="home-partners-note">{t.common.pending}</p></>}
    </div>
  </section>;
}

export async function Services() {
  const { services, serviceGroups, t } = await getContent();
  const copy = t.home.services;
  return <section id="services" className="section services" aria-labelledby="services-title">
    <div className="services-intro">
      <h2 id="services-title" className="home-title">{copy.heading}</h2>
      <p>{copy.intro}</p>
      <nav className="service-entry" aria-label={copy.entryLabel}>{serviceGroups.map(group => <Link href={`/dich-vu#group-${group.id}`} key={group.id}>{group.title}</Link>)}</nav>
      <Link className="detail-link" href="/dich-vu">{copy.all}</Link>
    </div>
    <div className="service-list">
      {services.map((service, index) => <details className="service-row" key={service.slug} open={index < 2}>
        <summary><h3>{service.title}</h3><Plus size={22} aria-hidden="true" /></summary>
        <div className="service-body"><p>{service.description}</p><Link href={serviceHref(service.slug)}>{copy.learn}</Link></div>
      </details>)}
    </div>
  </section>;
}

function NewsCard({ item, intl, large = false }: { item: NewsItem; intl: string; large?: boolean }) {
  const image = cdnUrl(item.filePreview);
  const date = formatDate(item.publishedDate, intl);
  return <Link className={`home-news-card${large ? " home-news-card-large" : ""}`} href={`/tin-tuc/bai-viet/${item.categorySlug}/${itemSlug(item)}`} data-reveal={large ? "left" : "right"}>
    {image && <Image className="home-news-image" src={image} alt="" fill unoptimized />}
    {/* Agency articles are published in Vietnamese only. */}
    <div lang="vi">{large ? <h3>{item.title}</h3> : <h3 className="home-news-small-title">{item.title}</h3>}{date && <p className="home-news-date">{date}</p>}</div>
  </Link>;
}

// News in the dcons.vn layout (one large, two small): the latest articles from canhsatpccc.gov.vn,
// falling back to the placeholder cards when the source cannot be reached.
export async function News() {
  const { t, intl } = await getContent();
  const copy = t.home.news;
  const latest = (await getNewsPage(1, 3))?.items ?? [];
  const [lead, ...rest] = copy.placeholders;
  return <section id="news" className="section home-news" aria-labelledby="home-news-title">
    <div className="home-news-head" data-reveal="up">
      <h2 id="home-news-title" className="home-title">{copy.heading}</h2>
      {latest.length > 0 && <Link className="detail-link" href="/tin-tuc">{copy.more}</Link>}
    </div>
    {latest.length >= 3 ? <>
      <div className="home-news-grid">
        <NewsCard item={latest[0]} intl={intl} large />
        <div className="home-news-side">{latest.slice(1, 3).map(item => <NewsCard key={item.id} item={item} intl={intl} />)}</div>
      </div>
      <p className="home-news-source">{t.common.source} <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{t.news.sourceName}<span className="sr-only"> {t.common.newTab}</span></a>{t.news.languageNote && <> · {t.news.languageNote}</>}</p>
    </> : <div className="home-news-grid">
      <article className="home-news-card home-news-card-large" data-reveal="left"><div><h3>{lead.title}</h3><p>{lead.text}</p></div></article>
      <div className="home-news-side">{rest.map((item, index) => <article className="home-news-card" key={index} data-reveal="right"><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </div>}
  </section>;
}

export async function Contact() {
  const { company, t } = await getContent();
  const copy = t.home.contact;
  return <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div><h2 id="contact-title">{copy.heading}<br /><span>{copy.headingAccent}</span></h2><p>{copy.text}</p><Link className="button button-primary" href="/lien-he">{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link></div>
      <address>
        <a href={company.phoneHref}><Phone aria-hidden="true" /><span>{t.common.hotline}<strong>{company.phone}</strong></span></a>
        <a href={`mailto:${company.email}`}><Mail aria-hidden="true" /><span>{t.common.email}<strong>{company.email}</strong></span></a>
        <div><MapPin aria-hidden="true" /><span>{t.common.address}<strong>{company.address}</strong></span></div>
      </address>
    </section>;
}
