import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { aboutCompany, company, homeNews, homePartners, serviceGroups, serviceHref, services } from "@/data/home";
import { cdnUrl, formatDate, getNewsPage, itemSlug, newsSource, type NewsItem } from "@/lib/fire-police-news";

// Company intro in the dcons.vn "about-home" layout: heading, copy, large figures, overlapping photos, partner row.
// #capabilities is kept on the figures so older shared links still land on this section.
export function HomeAbout() {
  const founded = aboutCompany.facts.find(fact => fact.label === "Thành lập")?.value;
  return <section id="about" className="section home-about" aria-labelledby="home-about-title">
    <div className="home-about-inner">
      <div className="home-about-copy">
        <h2 id="home-about-title" data-reveal="up">Giải pháp PCCC toàn diện</h2>
        <p className="home-about-desc" data-reveal="up">{aboutCompany.overview.lead} {aboutCompany.overview.paragraphs[1]}</p>
        <div id="capabilities" className="home-about-stats" data-reveal="up">
          <div><strong>{founded}</strong><span>Năm<br />thành lập</span></div>
          <div><strong>{services.length}</strong><span>Dịch vụ<br />PCCC</span></div>
        </div>
        <Link className="detail-link" href="/ve-lavita" data-reveal="up">Tìm hiểu về Lavita</Link>
      </div>
      <div className="home-about-media" data-reveal="right">
        <div className="home-about-photo home-about-photo-top"><Image src="/images/profile/doi-ngu-thi-cong-c2.webp" alt="Đội ngũ Lavita thi công hệ thống PCCC tại Chung cư C2 Bình Dương" fill sizes="(max-width: 980px) 70vw, 30vw" /></div>
        <div className="home-about-photo home-about-photo-main"><Image src="/images/engineer.webp" alt="Nhân sự kỹ thuật Lavita kiểm tra tủ điện của hệ thống PCCC" fill sizes="(max-width: 980px) 85vw, 40vw" /></div>
      </div>
    </div>
    <div className="home-partners" data-reveal="up">
      <h3>Đối tác<br />chiến lược</h3>
      {homePartners.length > 0
        ? <ul>{homePartners.map(partner => <li key={partner}>{partner}</li>)}</ul>
        : <><ul aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <li key={index} className="is-pending">Logo đối tác</li>)}</ul><p className="home-partners-note">Đang cập nhật</p></>}
    </div>
  </section>;
}

export function Services() {
  return <section id="services" className="section services" aria-labelledby="services-title">
    <div className="services-intro">
      <h2 id="services-title" className="home-title">Dịch vụ PCCC</h2>
      <p>Từ bản vẽ đầu tiên đến quá trình vận hành — Lavita đồng hành ở từng giai đoạn của công trình.</p>
      <nav className="service-entry" aria-label="Dịch vụ theo nhu cầu">{serviceGroups.map(group => <Link href={`/dich-vu#group-${group.id}`} key={group.id}>{group.title}</Link>)}</nav>
      <Link className="detail-link" href="/dich-vu">Xem tất cả dịch vụ</Link>
    </div>
    <div className="service-list">
      {services.map((service, index) => <details className="service-row" key={service.title} open={index < 2}>
        <summary><h3>{service.title}</h3><Plus size={22} aria-hidden="true" /></summary>
        <div className="service-body"><p>{service.description}</p><Link href={serviceHref(service.slug)}>Tìm hiểu dịch vụ</Link></div>
      </details>)}
    </div>
  </section>;
}

function NewsCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
  const image = cdnUrl(item.filePreview);
  const date = formatDate(item.publishedDate);
  return <Link className={`home-news-card${large ? " home-news-card-large" : ""}`} href={`/tin-tuc/bai-viet/${item.categorySlug}/${itemSlug(item)}`} data-reveal={large ? "left" : "right"}>
    {image && <Image className="home-news-image" src={image} alt="" fill unoptimized />}
    <div>{large ? <h3>{item.title}</h3> : <h3 className="home-news-small-title">{item.title}</h3>}{date && <p className="home-news-date">{date}</p>}</div>
  </Link>;
}

// News in the dcons.vn layout (one large, two small): the latest articles from canhsatpccc.gov.vn,
// falling back to the placeholder cards when the source cannot be reached.
export async function News() {
  const latest = (await getNewsPage(1, 3))?.items ?? [];
  const [lead, ...rest] = homeNews.placeholders;
  return <section id="news" className="section home-news" aria-labelledby="home-news-title">
    <div className="home-news-head" data-reveal="up">
      <h2 id="home-news-title" className="home-title">{homeNews.heading}</h2>
      {latest.length > 0 && <Link className="detail-link" href="/tin-tuc">Xem thêm tin tức</Link>}
    </div>
    {latest.length >= 3 ? <>
      <div className="home-news-grid">
        <NewsCard item={latest[0]} large />
        <div className="home-news-side">{latest.slice(1, 3).map(item => <NewsCard key={item.id} item={item} />)}</div>
      </div>
      <p className="home-news-source">Nguồn: <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{newsSource.name}<span className="sr-only"> (mở trong tab mới)</span></a></p>
    </> : <div className="home-news-grid">
      <article className="home-news-card home-news-card-large" data-reveal="left"><div><h3>{lead.title}</h3><p>{lead.text}</p></div></article>
      <div className="home-news-side">{rest.map((item, index) => <article className="home-news-card" key={index} data-reveal="right"><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </div>}
  </section>;
}

export function Contact() {
  return <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div><h2 id="contact-title">Công trình của bạn.<br /><span>Giải pháp của chúng tôi.</span></h2><p>Chọn dịch vụ, chia sẻ nhu cầu và trao đổi cùng Lavita về công trình.</p><Link className="button button-primary" href="/lien-he">Chuẩn bị nội dung tư vấn<ArrowRight size={18} aria-hidden="true" /></Link></div>
      <address>
        <a href={company.phoneHref}><Phone aria-hidden="true" /><span>Hotline<strong>{company.phone}</strong></span></a>
        <a href={`mailto:${company.email}`}><Mail aria-hidden="true" /><span>Email<strong>{company.email}</strong></span></a>
        <div><MapPin aria-hidden="true" /><span>Địa chỉ<strong>{company.address}</strong></span></div>
      </address>
    </section>;
}
