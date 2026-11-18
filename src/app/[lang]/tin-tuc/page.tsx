import Image from "next/image";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Pagination } from "@/components/content/pagination";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { cdnUrl, formatDate, getLegalPage, getNewsPage, itemSlug, legalFiles, newsSource } from "@/lib/fire-police-news";
import { pageMetadata } from "@/lib/metadata";
import "./news.css";

export async function generateMetadata() {
  const { t } = await getContent();
  return pageMetadata(t.news.metaTitle, t.news.metaDescription, "/tin-tuc");
}

type Props = { searchParams: Promise<{ muc?: string | string[]; trang?: string | string[] }> };
type TabId = "tin-tuc" | "van-ban";
const single = (value?: string | string[]) => (typeof value === "string" ? value : undefined);
const href = (tab: TabId, page = 1) => {
  const query = new URLSearchParams();
  if (tab !== "tin-tuc") query.set("muc", tab);
  if (page > 1) query.set("trang", String(page));
  return query.size ? `/tin-tuc?${query}` : "/tin-tuc";
};

// News and legal documents republished from canhsatpccc.gov.vn, in the dcons.vn visual language.
// The agency publishes in Vietnamese only, so article text keeps lang="vi" on every language version.
export default async function NewsPage({ searchParams }: Props) {
  const { t, intl } = await getContent();
  const copy = t.news;
  const tabs: { id: TabId; label: string }[] = [{ id: "tin-tuc", label: copy.tabNews }, { id: "van-ban", label: copy.tabLegal }];
  const params = await searchParams;
  const tab: TabId = single(params.muc) === "van-ban" ? "van-ban" : "tin-tuc";
  const requested = Math.max(1, Number.parseInt(single(params.trang) ?? "1", 10) || 1);
  const news = tab === "tin-tuc" ? await getNewsPage(requested) : null;
  const legal = tab === "van-ban" ? await getLegalPage(requested) : null;
  const result = news ?? legal;
  const date = (value: string | null | undefined) => formatDate(value, intl);

  return <div className="news-page">
    <section className="section news-head" aria-labelledby="news-title">
      <Breadcrumbs items={[{ label: t.common.home, href: "/" }, { label: copy.heading }]} />
      <h1 id="news-title">{copy.heading}</h1>
      <p className="news-source">{t.common.source} <a href={newsSource.url} target="_blank" rel="noopener noreferrer">{copy.sourceName}<span className="sr-only"> {t.common.newTab}</span></a></p>
      {copy.languageNote && <p className="news-source">{copy.languageNote}</p>}
      <nav className="news-tabs" aria-label={copy.tabsLabel}>
        {tabs.map(item => <Link key={item.id} href={href(item.id)} aria-current={item.id === tab ? "page" : undefined}>{item.label}</Link>)}
      </nav>
    </section>

    <section className="section news-body" aria-label={tabs.find(item => item.id === tab)?.label}>
      {!result ? <div className="news-error">
        <h2>{copy.errorHeading}</h2>
        <p>{copy.errorText} <a href={newsSource.url} target="_blank" rel="noopener noreferrer">canhsatpccc.gov.vn</a>.</p>
      </div> : result.items.length === 0 ? <p className="news-empty">{copy.empty}</p> : null}

      {news && news.items.length > 0 && <ul className="news-grid">
        {news.items.map(item => {
          const image = cdnUrl(item.filePreview);
          return <li key={item.id} data-reveal="up">
            <Link className="news-card" href={`/tin-tuc/bai-viet/${item.categorySlug}/${itemSlug(item)}`} lang="vi">
              <span className="news-card-photo">{image ? <Image src={image} alt="" fill unoptimized /> : null}</span>
              <span className="news-card-meta">{item.categoryName}{date(item.publishedDate) ? ` · ${date(item.publishedDate)}` : ""}</span>
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
              <h2 lang="vi"><Link href={`/tin-tuc/van-ban/${item.categorySlug}/${itemSlug(item)}`}>{item.name}</Link></h2>
              <p className="legal-meta">
                <span lang="vi">{item.categoryName}</span>
                {item.symbol && <span>{format(copy.symbol, { value: item.symbol })}</span>}
                {date(item.publishedDate) && <span>{date(item.publishedDate)}</span>}
                {files > 0 && <span>{format(copy.files, { count: files })}</span>}
              </p>
            </div>
          </li>;
        })}
      </ul>}

      {result && <Pagination page={result.pageIndex} pageCount={result.pageCount} href={number => href(tab, number)} label={copy.paginationLabel} />}
    </section>
  </div>;
}
