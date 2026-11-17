import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
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
  const { category, slug, doc } = await load(params);
  if (!doc) return { title: "Văn bản pháp quy", robots: { index: false } };
  return { title: doc.name, description: doc.description ?? undefined, alternates: { canonical: originalLegalUrl(doc) ?? fallbackUrl(category, slug) } };
}

// Legal document details from canhsatpccc.gov.vn: metadata and attachments served by the agency's CDN.
export default async function LegalDocumentPage({ params }: Props) {
  const { category, slug, doc } = await load(params);
  const original = doc ? originalLegalUrl(doc) : fallbackUrl(category, slug);
  const sourceLine = <p className="article-source">Nguồn: <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{newsSource.name}</a> · <a href={original} target="_blank" rel="noopener noreferrer">Xem trang gốc<span className="sr-only"> (mở trong tab mới)</span></a></p>;
  if (!doc) return <div className="news-page"><section className="section article-head">
    <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc?muc=van-ban" }, { label: "Văn bản" }]} />
    <div className="news-error"><h1>Chưa tải được văn bản</h1><p>Máy chủ nguồn đang không phản hồi hoặc văn bản không còn. Bạn có thể xem trực tiếp tại trang gốc.</p>{sourceLine}</div>
  </section></div>;

  const rows = [
    ["Số hiệu", doc.symbol],
    ["Loại văn bản", doc.categoryName],
    ["Cơ quan ban hành", doc.issuingAgency],
    ["Ngày đăng", formatDate(doc.publishedDate)],
    ["Từ ngày", formatDate(doc.startDate)],
    ["Đến ngày", formatDate(doc.endDate)],
    ["Trạng thái", doc.statusName],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const files = legalFiles(doc);

  return <div className="news-page">
    <article className="section article" aria-labelledby="legal-title">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc?muc=van-ban" }, { label: "Văn bản pháp quy" }]} />
      <header className="article-head">
        <p className="article-meta">{doc.categoryName}</p>
        <h1 id="legal-title">{doc.name}</h1>
        {doc.description && doc.description !== doc.name && <p className="article-lead">{doc.description}</p>}
        {sourceLine}
      </header>
      <dl className="legal-specs">{rows.map(([label, value]) => <div key={label}><dt>{label}:</dt><dd>{value}</dd></div>)}</dl>
      <section className="legal-files" aria-labelledby="legal-files-title">
        <h2 id="legal-files-title" className="section-title">Tệp đính kèm</h2>
        {files.length > 0 ? <ul>{files.map(file => <li key={file.fileId}>
          <a href={cdnUrl(file.filePreview) ?? original} target="_blank" rel="noopener noreferrer"><Download size={18} aria-hidden="true" />{file.fileName || "Tải tệp"}<span className="sr-only"> (tải từ máy chủ của Cục Cảnh sát PCCC và CNCH)</span></a>
        </li>)}</ul> : <p>Văn bản này chưa có tệp đính kèm. Xem chi tiết tại <a href={original} target="_blank" rel="noopener noreferrer">trang gốc</a>.</p>}
      </section>
      <footer className="article-foot"><Link className="detail-link" href="/tin-tuc?muc=van-ban">Xem văn bản khác</Link></footer>
    </article>
  </div>;
}
