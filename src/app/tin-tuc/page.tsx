import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Pagination } from "@/components/content/pagination";
import { cdnUrl, formatDate, getLegalPage, getNewsPage, itemSlug, legalFiles, newsSource } from "@/lib/fire-police-news";
import { pageMetadata } from "@/lib/metadata";
import "./news.css";

export const metadata = pageMetadata("Tin tức PCCC", "Tin tức – sự kiện và văn bản pháp quy về phòng cháy chữa cháy, tổng hợp từ Cục Cảnh sát PCCC và CNCH – Bộ Công an.", "/tin-tuc");

type Props = { searchParams: Promise<{ muc?: string | string[]; trang?: string | string[] }> };
const tabs = [
  { id: "tin-tuc", label: "Tin tức – Sự kiện" },
  { id: "van-ban", label: "Văn bản pháp quy" },
] as const;
type TabId = (typeof tabs)[number]["id"];
const single = (value?: string | string[]) => (typeof value === "string" ? value : undefined);
const href = (tab: TabId, page = 1) => {
  const query = new URLSearchParams();
  if (tab !== "tin-tuc") query.set("muc", tab);
  if (page > 1) query.set("trang", String(page));
  return query.size ? `/tin-tuc?${query}` : "/tin-tuc";
};

// News and legal documents republished from canhsatpccc.gov.vn, in the dcons.vn visual language.
export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const tab: TabId = single(params.muc) === "van-ban" ? "van-ban" : "tin-tuc";
  const requested = Math.max(1, Number.parseInt(single(params.trang) ?? "1", 10) || 1);
  const news = tab === "tin-tuc" ? await getNewsPage(requested) : null;
  const legal = tab === "van-ban" ? await getLegalPage(requested) : null;
  const result = news ?? legal;

  return <div className="news-page">
    <section className="section news-head" aria-labelledby="news-title">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]} />
      <h1 id="news-title">Tin tức</h1>
      <p className="news-source">Nguồn: <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{newsSource.name}<span className="sr-only"> (mở trong tab mới)</span></a></p>
      <nav className="news-tabs" aria-label="Chuyên mục tin">
        {tabs.map(item => <Link key={item.id} href={href(item.id)} aria-current={item.id === tab ? "page" : undefined}>{item.label}</Link>)}
      </nav>
    </section>

    <section className="section news-body" aria-label={tabs.find(item => item.id === tab)?.label}>
      {!result ? <div className="news-error">
        <h2>Chưa tải được tin từ Cục Cảnh sát PCCC và CNCH</h2>
        <p>Máy chủ nguồn đang không phản hồi. Vui lòng thử lại sau hoặc xem trực tiếp tại <a href={newsSource.url} target="_blank" rel="noopener noreferrer">canhsatpccc.gov.vn</a>.</p>
      </div> : result.items.length === 0 ? <p className="news-empty">Chưa có nội dung trong trang này.</p> : null}

      {news && news.items.length > 0 && <ul className="news-grid">
        {news.items.map(item => {
          const image = cdnUrl(item.filePreview);
          return <li key={item.id} data-reveal="up">
            <Link className="news-card" href={`/tin-tuc/bai-viet/${item.categorySlug}/${itemSlug(item)}`}>
              <span className="news-card-photo">{image ? <Image src={image} alt="" fill unoptimized /> : null}</span>
              <span className="news-card-meta">{item.categoryName}{formatDate(item.publishedDate) ? ` · ${formatDate(item.publishedDate)}` : ""}</span>
              <h2>{item.title}</h2>
              {item.description && <p>{item.description}</p>}
            </Link>
          </li>;
        })}
      </ul>}

      {legal && legal.items.length > 0 && <ul className="legal-list">
        {legal.items.map(item => {
          const files = legalFiles(item).length;
          return <li key={item.id} data-reveal="up">
            <FileText size={26} aria-hidden="true" />
            <div>
              <h2><Link href={`/tin-tuc/van-ban/${item.categorySlug}/${itemSlug(item)}`}>{item.name}</Link></h2>
              <p className="legal-meta">
                <span>{item.categoryName}</span>
                {item.symbol && <span>Số hiệu: {item.symbol}</span>}
                {formatDate(item.publishedDate) && <span>{formatDate(item.publishedDate)}</span>}
                {files > 0 && <span>{files} tệp đính kèm</span>}
              </p>
            </div>
          </li>;
        })}
      </ul>}

      {result && <Pagination page={result.pageIndex} pageCount={result.pageCount} href={number => href(tab, number)} label="Phân trang tin tức" />}
    </section>
  </div>;
}
