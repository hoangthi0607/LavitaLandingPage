import Link from "next/link";
import { site } from "@/data/home";

export type Breadcrumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Breadcrumb[]; className?: string }) {
  const graph = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: `${site.url}${item.href}` } : {}) })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <nav className={className ? `breadcrumbs ${className}` : "breadcrumbs"} aria-label="Đường dẫn trang">
      <ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol>
    </nav>
  </>;
}
