import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getNewsDetail, newsSource, originalNewsUrl, parseItemSlug, sanitizeArticle } from "@/lib/fire-police-news";
import "../../../news.css";

type Props = { params: Promise<{ category: string; slug: string }> };
const fallbackUrl = (category: string, slug: string) => `https://canhsatpccc.gov.vn/vi/news/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;

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
  return <div className="news-page">
    <article className="section article" aria-labelledby="article-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading, href: "/tin-tuc" }, { label: article.categoryName }]} />
      <header className="article-head">
        <p className="article-meta"><span lang="vi">{article.categoryName}</span>{date ? ` · ${date}` : ""}</p>
        <h1 id="article-title" lang="vi">{article.title}</h1>
        {article.description && <p className="article-lead" lang="vi">{article.description}</p>}
        {copy.languageNote && <p className="article-source">{copy.languageNote}</p>}
        {sourceLine}
      </header>
      {/* The thumbnail is usually a resized copy of the first body image: show it only for text-only articles. */}
      {image && !html.includes("<img") && <div className="article-cover"><Image src={image} alt="" fill unoptimized priority /></div>}
      <div className="article-body" lang="vi" dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="article-foot">
        {sourceLine}
        <Link className="detail-link" href="/tin-tuc">{copy.moreNews}</Link>
      </footer>
    </article>
  </div>;
}
