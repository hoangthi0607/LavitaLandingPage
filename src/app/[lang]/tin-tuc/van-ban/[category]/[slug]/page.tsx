import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarClock, CalendarDays, Download, ExternalLink, FileText, Hash, Landmark } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getLegalDetail, getLegalPage, itemSlug, legalFiles, newsSource, originalLegalUrl, parseItemSlug, type LegalItem } from "@/lib/fire-police-news";
import "../../../news.css";

type Props = { params: Promise<{ category: string; slug: string }> };
const fallbackUrl = (category: string, slug: string) => `https://canhsatpccc.gov.vn/vi/legal-document/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
const legalHref = (item: LegalItem) => `/tin-tuc/van-ban/${item.categorySlug}/${itemSlug(item)}`;
// File type badge from the extension, size from bytes (the agency reports bytes).
const extension = (name: string) => name.match(/\.([a-z0-9]{2,5})$/i)?.[1].toUpperCase();
const fileSize = (bytes: number, intl: string) => {
  if (!bytes || bytes < 0) return undefined;
  const number = new Intl.NumberFormat(intl, { maximumFractionDigits: 1 });
  return bytes >= 1024 * 1024 ? `${number.format(bytes / 1024 / 1024)} MB` : `${number.format(Math.max(1, bytes / 1024))} KB`;
};

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
// 19/11/2026: type/date chips, facts as icon tiles, attachments as cards with type and size, a sticky rail (source,
// latest documents), more documents as cards and the shared contact panel.
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

  const published = formatDate(doc.publishedDate, intl);
  const facts = [
    { icon: Hash, label: copy.rows.symbol, value: doc.symbol },
    { icon: FileText, label: copy.rows.type, value: doc.categoryName },
    { icon: Landmark, label: copy.rows.agency, value: doc.issuingAgency },
    { icon: CalendarDays, label: copy.rows.published, value: published },
    { icon: CalendarClock, label: copy.rows.from, value: formatDate(doc.startDate, intl) },
    { icon: CalendarClock, label: copy.rows.to, value: formatDate(doc.endDate, intl) },
    { icon: BadgeCheck, label: copy.rows.status, value: doc.statusName },
  ].filter((fact): fact is typeof fact & { value: string } => Boolean(fact.value));
  const files = legalFiles(doc);
  // Latest documents for the rail and the closing cards, without the current one.
  const latest = ((await getLegalPage(1, 8))?.items ?? []).filter(item => item.id !== doc.id);
  const rail = latest.slice(0, 4);
  const more = latest.length >= 7 ? latest.slice(4, 7) : latest.slice(0, 3);
  const contact = t.home.contact;
  const sourceLabel = t.common.source.replace(/[:：]\s*$/, "");

  return <div className="news-page">
    <div className="section article-layout">
      <article className="article" aria-labelledby="legal-title">
        <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading, href: "/tin-tuc?muc=van-ban" }, { label: copy.legalTitle }]} />
        <header className="article-head">
          <p className="article-meta"><span className="article-chip" lang="vi">{doc.categoryName}</span>{published && <span className="article-date"><CalendarDays size={15} aria-hidden="true" />{published}</span>}</p>
          <h1 id="legal-title" lang="vi">{doc.name}</h1>
          {doc.description && doc.description !== doc.name && <p className="article-lead" lang="vi">{doc.description}</p>}
          {copy.languageNote && <p className="article-source">{copy.languageNote}</p>}
          {sourceLine}
        </header>

        <dl className="legal-facts">{facts.map(fact => <div key={fact.label}>
          <span className="legal-fact-icon" aria-hidden="true"><fact.icon size={18} /></span>
          <dt>{fact.label}</dt>
          <dd lang="vi">{fact.value}</dd>
        </div>)}</dl>

        <section className="legal-files" aria-labelledby="legal-files-title">
          <h2 id="legal-files-title" className="section-title" data-reveal="up">{copy.filesHeading}</h2>
          {files.length > 0 ? <ul>{files.map(file => {
            const type = extension(file.fileName);
            const size = fileSize(file.fileSize, intl);
            return <li key={file.fileId} data-reveal="up">
              <a href={cdnUrl(file.filePreview) ?? original} target="_blank" rel="noopener noreferrer">
                <span className="legal-file-type" aria-hidden="true">{type ?? <FileText size={20} />}</span>
                <span className="legal-file-text"><span className="legal-file-name">{file.fileName || copy.downloadFile}</span>{size && <span className="legal-file-size">{size}</span>}</span>
                <span className="legal-file-download" aria-hidden="true"><Download size={18} /></span>
                <span className="sr-only"> {copy.downloadNote}</span>
              </a>
            </li>;
          })}</ul> : <p className="legal-no-files">{copy.noFiles} <a href={original} target="_blank" rel="noopener noreferrer">{copy.originalPage}</a>.</p>}
        </section>
        <footer className="article-foot">{sourceLine}<Link className="detail-link" href="/tin-tuc?muc=van-ban">{copy.moreDocuments}</Link></footer>
      </article>

      <aside className="article-rail" aria-label={copy.legalTitle}>
        <div className="article-rail-card">
          <p className="article-rail-label">{sourceLabel}</p>
          <p className="article-rail-agency">{copy.sourceName}</p>
          <a className="article-rail-link" href={original} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} aria-hidden="true" />{copy.viewOriginalPage}<span className="sr-only"> {t.common.newTab}</span></a>
          <Link className="article-rail-link" href="/tin-tuc?muc=van-ban"><ArrowLeft size={16} aria-hidden="true" />{copy.moreDocuments}</Link>
        </div>
        {rail.length > 0 && <div className="article-rail-card">
          <p className="article-rail-label">{copy.legalTitle}</p>
          <ul className="legal-rail-list">{rail.map(item => {
            const when = formatDate(item.publishedDate, intl);
            return <li key={item.id}><Link href={legalHref(item)} lang="vi"><span className="legal-rail-title">{item.name}</span>{when && <span className="article-rail-date">{when}</span>}</Link></li>;
          })}</ul>
        </div>}
      </aside>
    </div>

    {more.length > 0 && <section className="section article-more" aria-labelledby="legal-more-title">
      <div className="article-more-head" data-reveal="up"><h2 id="legal-more-title" className="section-title">{copy.legalTitle}</h2><Link className="detail-link" href="/tin-tuc?muc=van-ban">{copy.moreDocuments}</Link></div>
      <ul className="legal-list">{more.map(item => {
        const count = legalFiles(item).length;
        const when = formatDate(item.publishedDate, intl);
        return <li key={item.id} data-reveal="up">
          <span className="legal-icon"><FileText size={22} aria-hidden="true" /></span>
          <div>
            <h3 lang="vi"><Link href={legalHref(item)}>{item.name}</Link></h3>
            <p className="legal-meta">
              <span lang="vi">{item.categoryName}</span>
              {item.symbol && <span>{format(copy.symbol, { value: item.symbol })}</span>}
              {when && <span>{when}</span>}
              {count > 0 && <span>{format(copy.files, { count })}</span>}
            </p>
          </div>
        </li>;
      })}</ul>
    </section>}

    <section className="cta-band" aria-labelledby="legal-cta-title">
      <div className="cta-band-inner" data-reveal="up">
        <div><h2 id="legal-cta-title">{contact.heading} {contact.headingAccent}</h2><p>{contact.text}</p></div>
        <div className="cta-band-actions"><Link className="button button-light" href="/lien-he">{contact.cta}<ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  </div>;
}
