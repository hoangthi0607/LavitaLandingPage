import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";

// Round page numbers in the dcons.vn style. Long ranges collapse to 1 … 4 5 6 … N.
export async function Pagination({ page, pageCount, href, label }: { page: number; pageCount: number; href: (page: number) => string; label: string }) {
  if (pageCount <= 1) return null;
  const { t } = await getContent();
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter(number => number >= 1 && number <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return <nav className="pagination" aria-label={label} data-reveal="up">
    {page > 1 ? <Link className="pagination-arrow" href={href(page - 1)} aria-label={t.pagination.previous}><ChevronLeft size={24} aria-hidden="true" /></Link> : <span className="pagination-arrow" aria-hidden="true"><ChevronLeft size={24} /></span>}
    <ol>{sorted.map((number, index) => <li key={number}>
      {index > 0 && number - sorted[index - 1] > 1 && <span className="pagination-gap" aria-hidden="true">…</span>}
      <Link className="pagination-number" href={href(number)} aria-current={number === page ? "page" : undefined} aria-label={format(t.pagination.page, { page: number })}>{number}</Link>
    </li>)}</ol>
    {page < pageCount ? <Link className="pagination-arrow" href={href(page + 1)} aria-label={t.pagination.next}><ChevronRight size={24} aria-hidden="true" /></Link> : <span className="pagination-arrow" aria-hidden="true"><ChevronRight size={24} /></span>}
  </nav>;
}
