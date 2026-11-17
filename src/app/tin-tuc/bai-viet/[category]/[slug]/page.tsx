import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
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
  const { category, slug, article } = await load(params);
  if (!article) return { title: "Tin tức PCCC", robots: { index: false } };
  const image = cdnUrl(article.filePreview);
  // The agency's page is the original: point search engines there to avoid duplicate content.
  return {
    title: article.title, description: article.description ?? undefined,
    alternates: { canonical: originalNewsUrl(article) ?? fallbackUrl(category, slug) },
    openGraph: { type: "article", locale: "vi_VN", title: article.title, description: article.description ?? undefined, ...(image ? { images: [{ url: image }] } : {}) },
  };
}

// Full article republished from canhsatpccc.gov.vn, always credited with a link to the original.
export default async function NewsArticlePage({ params }: Props) {
  const { category, slug, article } = await load(params);
  const original = article ? originalNewsUrl(article) : fallbackUrl(category, slug);
  const sourceLine = <p className="article-source">Nguồn: <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{newsSource.name}</a> · <a href={original} target="_blank" rel="noopener noreferrer">Xem bài gốc<span className="sr-only"> (mở trong tab mới)</span></a></p>;

  if (!article) return <div className="news-page">
    <section className="section article-head">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc" }, { label: "Bài viết" }]} />
      <div className="news-error"><h1>Chưa tải được bài viết</h1><p>Máy chủ nguồn đang không phản hồi hoặc bài viết không còn. Bạn có thể xem trực tiếp tại trang gốc.</p>{sourceLine}</div>
    </section>
  </div>;

  const image = cdnUrl(article.filePreview);
  const html = sanitizeArticle(article.content);
  return <div className="news-page">
    <article className="section article" aria-labelledby="article-title">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc" }, { label: article.categoryName }]} />
      <header className="article-head">
        <p className="article-meta">{article.categoryName}{formatDate(article.publishedDate) ? ` · ${formatDate(article.publishedDate)}` : ""}</p>
        <h1 id="article-title">{article.title}</h1>
        {article.description && <p className="article-lead">{article.description}</p>}
        {sourceLine}
      </header>
      {/* The thumbnail is usually a resized copy of the first body image: show it only for text-only articles. */}
      {image && !html.includes("<img") && <div className="article-cover"><Image src={image} alt="" fill sizes="(max-width: 900px) 92vw, 820px" priority /></div>}
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
      <footer className="article-foot">
        {sourceLine}
        <Link className="detail-link" href="/tin-tuc">Xem tin tức khác</Link>
      </footer>
    </article>
  </div>;
}
