import Image from "next/image";
import { ArrowRight, Mail, MapPin, Newspaper, Phone, Quote } from "lucide-react";
import { homeClients } from "@/data/home";
import { getContent } from "@/i18n/content";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { ServicePanels } from "@/components/home/service-panels";
import { TestimonialText } from "@/components/home/testimonial-text";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getNewsPage, itemSlug, newsSource, type NewsItem } from "@/lib/fire-police-news";

// Company intro: heading, copy, overlapping photos and client logo band.
// #capabilities stays on the intro so older shared links still land on this section.
export async function HomeAbout() {
  const { t } = await getContent();
  const about = t.home.about;
  return <section id="about" className="section home-about" aria-labelledby="home-about-title">
    <div id="capabilities" className="home-about-inner">
      <div className="home-about-copy">
        <h2 id="home-about-title" data-reveal="up">{about.heading}</h2>
        <p className="home-about-desc" data-reveal="up">{about.lead}</p>
        <Link className="detail-link" href="/ve-lavita" data-reveal="up">{about.learnMore}</Link>
      </div>
      <div className="home-about-media" data-reveal="right">
        <div className="home-about-photo home-about-photo-top"><Image src="/images/profile/doi-ngu-thi-cong-c2.webp" alt={about.photoTopAlt} fill sizes="(max-width: 980px) 70vw, 30vw" /></div>
        <div className="home-about-photo home-about-photo-main"><Image src="/images/engineer.webp" alt={about.photoMainAlt} fill sizes="(max-width: 980px) 85vw, 40vw" /></div>
      </div>
    </div>
    <div className="home-clients" data-reveal="up">
      <div className="home-clients-head"><h3>{about.clients}</h3>{homeClients.length === 0 && <p className="home-clients-note">{t.common.pending}</p>}</div>
      <LogoMarquee logos={homeClients} pendingLabel={about.clientLogo} label={about.clients} />
    </div>
  </section>;
}

// Services: split intro (title left, intro and need groups right) above expanding photo panels (ServicePanels).
export async function Services() {
  const { services, serviceGroups, t } = await getContent();
  const copy = t.home.services;
  const panels = services.map(service => ({ slug: service.slug, title: service.pageTitle, lead: service.detail.lead, image: service.image, topics: service.detail.sections.map(section => section.heading) }));
  return <section id="services" className="section services" aria-labelledby="services-title">
    <div className="services-intro">
      <h2 id="services-title" className="home-title" data-reveal="left">{copy.heading}</h2>
      <div className="services-intro-side" data-reveal="right">
        <p>{copy.intro}</p>
        <nav className="service-entry" aria-label={copy.entryLabel}>{serviceGroups.map(group => <Link href={`/dich-vu#group-${group.id}`} key={group.id}>{group.title}</Link>)}</nav>
      </div>
    </div>
    <ServicePanels services={panels} learn={copy.learn} />
    <div className="services-more" data-reveal="up"><Link className="button button-secondary" href="/dich-vu">{copy.all}</Link></div>
  </section>;
}

const newsHref = (item: NewsItem) => `/tin-tuc/bai-viet/${item.categorySlug}/${itemSlug(item)}`;

// Lead article: white card, photo on top with the category and date chips, title and summary in dark text below
// (21/11/2026: no text over the photo). The photo zooms slowly on hover.
// Agency articles are published in Vietnamese only, hence lang="vi".
function NewsFeature({ item, intl }: { item: NewsItem; intl: string }) {
  const image = cdnUrl(item.filePreview);
  const date = formatDate(item.publishedDate, intl);
  return <Link className="home-news-feature" href={newsHref(item)} lang="vi" data-reveal="wipe">
    <span className="home-news-media">
      {image ? <Image className="home-news-image" src={image} alt="" fill unoptimized /> : <Newspaper className="home-news-placeholder-icon" size={48} strokeWidth={1.3} aria-hidden="true" />}
      <span className="home-news-chips"><span className="home-news-chip">{item.categoryName}</span>{date && <span className="home-news-chip is-date">{date}</span>}</span>
    </span>
    <span className="home-news-feature-copy"><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</span>
  </Link>;
}

// Other latest articles as compact rows: thumbnail, category, title, date.
function NewsRow({ item, intl }: { item: NewsItem; intl: string }) {
  const image = cdnUrl(item.filePreview);
  const date = formatDate(item.publishedDate, intl);
  return <li data-reveal="up">
    <Link className="home-news-row" href={newsHref(item)} lang="vi">
      <span className="home-news-thumb">{image ? <Image src={image} alt="" fill unoptimized /> : <Newspaper size={22} aria-hidden="true" />}</span>
      <span className="home-news-row-copy"><span className="home-news-row-meta">{item.categoryName}</span><h3>{item.title}</h3>{date && <span className="home-news-row-date">{date}</span>}</span>
    </Link>
  </li>;
}

// Client feedback from the old lavitacons.vn site. The first paragraph is always visible; the rest opens smoothly
// with the toggle at the bottom of each quote (TestimonialText).
export async function Testimonials() {
  const { t } = await getContent();
  const copy = t.home.testimonials;
  return <section id="testimonials" className="section home-testimonials" aria-labelledby="home-testimonials-title">
    <noscript><style>{".home-testimonial-more{grid-template-rows:1fr!important;opacity:1!important}.home-testimonial-toggle{display:none!important}"}</style></noscript>
    <h2 id="home-testimonials-title" className="home-title" data-reveal="up">{copy.heading}</h2>
    <div className="home-testimonials-grid">
      {copy.items.map((item, index) => <figure className="home-testimonial" key={index} data-reveal={index % 2 ? "right" : "left"}>
        <Quote className="home-testimonial-mark" size={36} strokeWidth={1.5} aria-hidden="true" />
        <TestimonialText paragraphs={item.paragraphs} more={copy.more} less={copy.less} />
        <figcaption><strong>{item.name}</strong>{item.role && <span>{item.role}</span>}</figcaption>
      </figure>)}
    </div>
  </section>;
}

// News (19/11/2026): the lead article as a large photo card beside a list of four more, from canhsatpccc.gov.vn;
// the source line sits under the heading. Falls back to the placeholder cards when the source cannot be reached.
export async function News() {
  const { t, intl } = await getContent();
  const copy = t.home.news;
  const latest = (await getNewsPage(1, 5))?.items ?? [];
  const [lead, ...rest] = copy.placeholders;
  return <section id="news" className="section home-news" aria-labelledby="home-news-title">
    <div className="home-news-head" data-reveal="up">
      <div>
        <h2 id="home-news-title" className="home-title">{copy.heading}</h2>
        {latest.length >= 3 && <p className="home-news-source">{t.common.source} <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{t.news.sourceName}<span className="sr-only"> {t.common.newTab}</span></a>{t.news.languageNote && <> · {t.news.languageNote}</>}</p>}
      </div>
      {latest.length > 0 && <Link className="detail-link" href="/tin-tuc">{copy.more}</Link>}
    </div>
    {latest.length >= 3 ? <div className="home-news-layout">
      <NewsFeature item={latest[0]} intl={intl} />
      <ul className="home-news-list">{latest.slice(1, 5).map(item => <NewsRow key={item.id} item={item} intl={intl} />)}</ul>
    </div> : <div className="home-news-grid">
      <article className="home-news-card home-news-card-large" data-reveal="left"><div><h3>{lead.title}</h3><p>{lead.text}</p></div></article>
      <div className="home-news-side">{rest.map((item, index) => <article className="home-news-card" key={index} data-reveal="right"><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </div>}
  </section>;
}

// Contact as one light ivory panel (21/11/2026, was warm charcoal): the heading lines rise in turn, the CTA and contact tiles follow, and a technician
// photo is wiped in from the right as the panel enters the viewport (static with reduced motion).
export async function Contact() {
  const { company, t } = await getContent();
  const copy = t.home.contact;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;
  return <section id="contact" className="section home-contact" aria-labelledby="contact-title">
    <div className="home-contact-panel">
      <div className="home-contact-copy">
        <h2 id="contact-title"><span data-reveal="up">{copy.heading}</span> <span className="home-contact-accent" data-reveal="up">{copy.headingAccent}</span></h2>
        <p data-reveal="up">{copy.text}</p>
        <div className="home-contact-action" data-reveal="up"><Link className="button button-primary" href="/lien-he">{copy.cta}<ArrowRight size={18} aria-hidden="true" /></Link></div>
        <address className="home-contact-tiles">
          <a className="home-contact-tile is-phone" href={company.phoneHref} data-reveal="up"><span className="home-contact-icon"><Phone size={20} aria-hidden="true" /></span><span>{t.common.hotline}<strong>{company.phone}</strong></span></a>
          <a className="home-contact-tile" href={`mailto:${company.email}`} data-reveal="up"><span className="home-contact-icon"><Mail size={20} aria-hidden="true" /></span><span>{t.common.email}<strong>{company.email}</strong></span></a>
          <a className="home-contact-tile is-wide" href={mapsHref} target="_blank" rel="noopener noreferrer" data-reveal="up"><span className="home-contact-icon"><MapPin size={20} aria-hidden="true" /></span><span>{t.common.address}<strong lang="vi">{company.address}</strong><span className="sr-only"> {t.contactPage.mapsNewTab}</span></span></a>
        </address>
      </div>
      <div className="home-contact-photo" data-reveal="wipe"><Image src="/images/profile/ky-thuat-vien-pccc.webp" alt="" fill sizes="(max-width: 900px) 92vw, 36vw" /></div>
    </div>
  </section>;
}
