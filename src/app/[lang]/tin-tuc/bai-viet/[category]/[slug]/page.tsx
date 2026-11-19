import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, Newspaper } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ReadingProgress } from "@/components/content/reading-progress";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getNewsDetail, getNewsPage, itemSlug, newsSource, originalNewsUrl, parseItemSlug, sanitizeArticle, type NewsItem } from "@/lib/fire-police-news";
import "../../../news.css";

type Props = { params: Promise<{ category: string; slug: string }> };
const fallbackUrl = (category: string, slug: string) => `https://canhsatpccc.gov.vn/vi/news/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
const articleHref = (item: NewsItem) => `/tin-tuc/bai-viet/${item.categorySlug}/${itemSlug(item)}`;

async function load(params: Props["params"]) {
  const { category, slug } = await params;
  const id = parseItemSlug(slug);
  if (!id || !/^[a-z0-9-]+$/.test(category)) notFound();
  return { category, slug, article: await getNewsDetail(id, category) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getContent();
  const { category, slug, article } = await load(params);
  if (!article) return { title: t.news.metaTitle, robots: { index: false } };
  const image = cdnUrl(article.filePreview);
  // The agency's page is the original: point search engines there to avoid duplicate content.
  return {
    title: article.title, description: article.description ?? undefined,
    alternates: { canonical: originalNewsUrl(article) ?? fallbackUrl(category, slug) },
    openGraph: { type: "article", locale: "vi_VN", title: article.title, description: article.description ?? undefined, ...(image ? { images: [{ url: image }] } : {}) },
  };
}

// Full article republished from canhsatpccc.gov.vn, always credited with a link to the original.
// The article itself is Vietnamese on every language version; only the surrounding interface is translated.
// 19/11/2026: reading progress bar, category/date chips, a sticky side rail (source card, latest articles), more
// articles as cards and the shared contact panel.
export default async function NewsArticlePage({ params }: Props) {
  const { t, intl } = await getContent();
  const copy = t.news;
  const { category, slug, article } = await load(params);
  const original = article ? originalNewsUrl(article) : fallbackUrl(category, slug);
  const sourceLine = <p className="article-source">{t.common.source} <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{copy.sourceName}</a> · <a href={original} target="_blank" rel="noopener noreferrer">{copy.viewOriginal}<span className="sr-only"> {t.common.newTab}</span></a></p>;

  if (!article) return <div className="news-page">
    <section className="section article-head">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading, href: "/tin-tuc" }, { label: copy.article }]} />
      <div className="news-error"><h1>{copy.articleErrorHeading}</h1><p>{copy.articleErrorText}</p>{sourceLine}</div>
    </section>
  </div>;

  const image = cdnUrl(article.filePreview);
  const html = sanitizeArticle(article.content);
  const date = formatDate(article.publishedDate, intl);
  // Latest articles for the side rail and the closing cards, without the current one.
  const latest = ((await getNewsPage(1, 8))?.items ?? []).filter(item => item.id !== article.id);
  const rail = latest.slice(0, 4);
  const more = latest.length >= 7 ? latest.slice(4, 7) : latest.slice(0, 3);
  const contact = t.home.contact;

  return <div className="news-page">
    <ReadingProgress targetId="article-body" />
    <div className="section article-layout">
      <article className="article" aria-labelledby="article-title">
        <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading, href: "/tin-tuc" }, { label: article.categoryName }]} />
        <header className="article-head">
          <p className="article-meta"><span className="article-chip" lang="vi">{article.categoryName}</span>{date && <span className="article-date"><CalendarDays size={15} aria-hidden="true" />{date}</span>}</p>
          <h1 id="article-title" lang="vi">{article.title}</h1>
          {article.description && <p className="article-lead" lang="vi">{article.description}</p>}
          {copy.languageNote && <p className="article-source">{copy.languageNote}</p>}
          {sourceLine}
        </header>
        {/* The thumbnail is usually a resized copy of the first body image: show it only for text-only articles. */}
        {image && !html.includes("<img") && <div className="article-cover"><Image src={image} alt="" fill unoptimized priority /></div>}
        <div id="article-body" className="article-body" lang="vi" dangerouslySetInnerHTML={{ __html: html }} />
        <footer className="article-foot">
          {sourceLine}
          <Link className="detail-link" href="/tin-tuc">{copy.moreNews}</Link>
        </footer>
      </article>

      <aside className="article-rail" aria-label={copy.heading}>
        <div className="article-rail-card">
          <p className="article-rail-label">{t.common.source.replace(/[:：]\s*$/, "")}</p>
          <p className="article-rail-agency">{copy.sourceName}</p>
          <a className="article-rail-link" href={original} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} aria-hidden="true" />{copy.viewOriginal}<span className="sr-only"> {t.common.newTab}</span></a>
          <Link className="article-rail-link" href="/tin-tuc"><ArrowLeft size={16} aria-hidden="true" />{copy.moreNews}</Link>
        </div>
        {rail.length > 0 && <div className="article-rail-card">
          <p className="article-rail-label">{copy.heading}</p>
          <ul className="article-rail-list">{rail.map(item => {
            const thumb = cdnUrl(item.filePreview);
            const when = formatDate(item.publishedDate, intl);
            return <li key={item.id}>
              <Link href={articleHref(item)} lang="vi">
                <span className="article-rail-thumb">{thumb ? <Image src={thumb} alt="" fill unoptimized /> : <Newspaper size={20} aria-hidden="true" />}</span>
                <span className="article-rail-text"><span className="article-rail-title">{item.title}</span>{when && <span className="article-rail-date">{when}</span>}</span>
              </Link>
            </li>;
          })}</ul>
        </div>}
      </aside>
    </div>

    {more.length > 0 && <section className="section article-more" aria-labelledby="article-more-title">
      <div className="article-more-head" data-reveal="up"><h2 id="article-more-title" className="section-title">{copy.heading}</h2><Link className="detail-link" href="/tin-tuc">{copy.moreNews}</Link></div>
      <ul className="news-grid">{more.map(item => {
        const thumb = cdnUrl(item.filePreview);
        const when = formatDate(item.publishedDate, intl);
        return <li key={item.id} data-reveal="up">
          <Link className="news-card" href={articleHref(item)} lang="vi">
            <span className="news-card-photo">{thumb ? <Image src={thumb} alt="" fill unoptimized /> : <Newspaper size={40} strokeWidth={1.4} aria-hidden="true" />}{when && <span className="news-card-date">{when}</span>}</span>
            <span className="news-card-body"><span className="news-card-meta">{item.categoryName}</span><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</span>
          </Link>
        </li>;
      })}</ul>
    </section>}

    <section className="cta-band" aria-labelledby="article-cta-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="article-cta-title">{contact.heading} {contact.headingAccent}</h2><p>{contact.text}</p></div>
        <div className="cta-band-actions"><Link className="button button-light" href="/lien-he">{contact.cta}<ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  </div>;
}
