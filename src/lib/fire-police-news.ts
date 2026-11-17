import sanitizeHtml from "sanitize-html";

// Read-only client for the public CMS API behind canhsatpccc.gov.vn (Cục Cảnh sát PCCC và CNCH, Bộ Công an).
// The API is undocumented and may change: every call is cached for an hour, times out after 8s and
// returns null on failure so pages can show a fallback instead of breaking.
const API = "https://api.canhsatpccc.gov.vn/api/cms";
const SITE = "https://canhsatpccc.gov.vn";
const CDN = "https://cdn.canhsatpccc.gov.vn";
const REVALIDATE_SECONDS = 3600;

export const newsSource = {
  name: "Cục Cảnh sát PCCC và CNCH – Bộ Công an",
  url: `${SITE}/vi`,
  newsCategory: "tin-tuc-su-kien",
  legalCategory: "van-ban-phap-quy",
} as const;

export type NewsItem = {
  id: number; title: string; description: string | null; slugUrl: string; publishedDate: string;
  categoryName: string; categorySlug: string; filePreview: string | null;
};
export type NewsDetail = NewsItem & { content: string | null };
type FileRef = { fileName: string; filePreview: string; fileSize: number; fileId: number };
export type LegalItem = {
  id: number; name: string; description: string | null; slugUrl: string; symbol: string | null; issuingAgency: string | null;
  categoryName: string; categorySlug: string; publishedDate: string | null; startDate: string | null; endDate: string | null;
  statusName: string | null; legalDocumentFile: FileRef | null; galaryFiles: FileRef[] | null;
};
export type Page<T> = { items: T[]; pageIndex: number; pageCount: number; total: number };

async function request<T>(path: string, params: Record<string, string | number>): Promise<T | null> {
  const query = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
  try {
    const response = await fetch(`${API}${path}?${query}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const json = await response.json() as { content?: T | null; err?: unknown };
    return json.content ?? null;
  } catch {
    return null;
  }
}

type ListContent<T> = { items: T[]; pageIndex: number; pageCount: number; totalItemCount: number };
const toPage = <T,>(content: ListContent<T> | null): Page<T> | null =>
  content && Array.isArray(content.items) ? { items: content.items, pageIndex: content.pageIndex, pageCount: content.pageCount, total: content.totalItemCount } : null;

export async function getNewsPage(page = 1, pageSize = 9) {
  return toPage(await request<ListContent<NewsItem>>("/News/GetListAllFE", { pageIndex: page, pageSize, langId: "vi", CategorySlugUrl: newsSource.newsCategory }));
}
export async function getLegalPage(page = 1, pageSize = 10) {
  return toPage(await request<ListContent<LegalItem>>("/LegalDocument/GetListAllFE", { pageIndex: page, pageSize, langId: "vi", CategorySlugUrl: newsSource.legalCategory }));
}
export async function getNewsDetail(id: number, categorySlug: string) {
  return request<NewsDetail>("/News/GetDetailFE", { newTransId: id, cateSlug: categorySlug, langId: "vi" });
}
export async function getLegalDetail(id: number, categorySlug: string) {
  return request<LegalItem>("/LegalDocument/GetDetailFE", { legalDocTransId: id, cateSlug: categorySlug, langId: "vi" });
}

/** Stored paths look like "Uploads\\news_folder\\x.jpg"; files are served from the CDN. */
export function cdnUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${CDN}/${path.replace(/\\/g, "/").replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/")}`;
}
/** Slug used by both sites: "<slugUrl>-<id>". */
export const itemSlug = (item: { slugUrl: string; id: number }) => `${item.slugUrl}-${item.id}`;
export function parseItemSlug(slug: string) {
  const match = /-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
}
export const originalNewsUrl = (item: NewsItem) => `${SITE}/vi/news/${item.categorySlug}/${itemSlug(item)}`;
export const originalLegalUrl = (item: LegalItem) => `${SITE}/vi/legal-document/${item.categorySlug}/${itemSlug(item)}`;
export const legalFiles = (item: LegalItem) => [item.legalDocumentFile, ...(item.galaryFiles ?? [])].filter((file): file is FileRef => Boolean(file?.filePreview));

export function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(date);
}

/** Article HTML comes from a third party: keep text formatting, images from the agency CDN and safe links only. */
export function sanitizeArticle(html: string | null) {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "span", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "width", "height", "loading"], td: ["colspan", "rowspan"], th: ["colspan", "rowspan"], p: ["style"], span: [] },
    allowedStyles: { p: { "text-align": [/^(left|right|center|justify)$/] } },
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    exclusiveFilter: frame => frame.tag === "img" && !/^https:\/\/(cdn|api)\.canhsatpccc\.gov\.vn\//.test(frame.attribs.src ?? ""),
    transformTags: {
      a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" } }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, src: cdnUrl(attribs.src) ?? "", loading: "lazy", alt: attribs.alt ?? "" } }),
      h1: "h2",
    },
  });
}
