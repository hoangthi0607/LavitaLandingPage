import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getLegalDetail, legalFiles, newsSource, originalLegalUrl, parseItemSlug } from "@/lib/fire-police-news";
import "../../../news.css";

type Props = { params: Promise<{ category: string; slug: string }> };
const fallbackUrl = (category: string, slug: string) => `https://canhsatpccc.gov.vn/vi/legal-document/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;

async function load(params: Props["params"]) {
  const { category, slug } = await params;
  const id = parseItemSlug(slug);
  if (!id || !/^[a-z0-9-]+$/.test(category)) notFound();
  return { category, slug, doc: await getLegalDetail(id, category) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getContent();
  const { category, slug, doc } = await load(params);
  if (!doc) return { title: t.news.legalTitle, robots: { index: false } };
  return { title: doc.name, description: doc.description ?? undefined, alternates: { canonical: originalLegalUrl(doc) ?? fallbackUrl(category, slug) } };
}

// Legal document details from canhsatpccc.gov.vn: metadata and attachments served by the agency's CDN.
// Document fields stay Vietnamese (lang="vi"); labels follow the page language.
export default async function LegalDocumentPage({ params }: Props) {
  const { t, intl } = await getContent();
  const copy = t.news;
  const { category, slug, doc } = await load(params);
  const original = doc ? originalLegalUrl(doc) : fallbackUrl(category, slug);
  const sourceLine = <p className="article-source">{t.common.source} <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{copy.sourceName}</a> · <a href={original} target="_blank" rel="noopener noreferrer">{copy.viewOriginalPage}<span className="sr-only"> {t.common.newTab}</span></a></p>;
  if (!doc) return <div className="news-page"><section className="section article-head">
    <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading, href: "/tin-tuc?muc=van-ban" }, { label: copy.document }]} />
    <div className="news-error"><h1>{copy.legalErrorHeading}</h1><p>{copy.legalErrorText}</p>{sourceLine}</div>
  </section></div>;

  const rows = [
    [copy.rows.symbol, doc.symbol],
    [copy.rows.type, doc.categoryName],
    [copy.rows.agency, doc.issuingAgency],
    [copy.rows.published, formatDate(doc.publishedDate, intl)],
    [copy.rows.from, formatDate(doc.startDate, intl)],
    [copy.rows.to, formatDate(doc.endDate, intl)],
    [copy.rows.status, doc.statusName],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const files = legalFiles(doc);

  return <div className="news-page">
    <article className="section article" aria-labelledby="legal-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading, href: "/tin-tuc?muc=van-ban" }, { label: copy.legalTitle }]} />
      <header className="article-head">
        <p className="article-meta" lang="vi">{doc.categoryName}</p>
        <h1 id="legal-title" lang="vi">{doc.name}</h1>
        {doc.description && doc.description !== doc.name && <p className="article-lead" lang="vi">{doc.description}</p>}
        {copy.languageNote && <p className="article-source">{copy.languageNote}</p>}
        {sourceLine}
      </header>
      <dl className="legal-specs">{rows.map(([label, value]) => <div key={label}><dt>{label}:</dt><dd lang="vi">{value}</dd></div>)}</dl>
      <section className="legal-files" aria-labelledby="legal-files-title">
        <h2 id="legal-files-title" className="section-title">{copy.filesHeading}</h2>
        {files.length > 0 ? <ul>{files.map(file => <li key={file.fileId}>
          <a href={cdnUrl(file.filePreview) ?? original} target="_blank" rel="noopener noreferrer"><Download size={18} aria-hidden="true" />{file.fileName || copy.downloadFile}<span className="sr-only"> {copy.downloadNote}</span></a>
        </li>)}</ul> : <p>{copy.noFiles} <a href={original} target="_blank" rel="noopener noreferrer">{copy.originalPage}</a>.</p>}
      </section>
      <footer className="article-foot"><Link className="detail-link" href="/tin-tuc?muc=van-ban">{copy.moreDocuments}</Link></footer>
    </article>
  </div>;
}
