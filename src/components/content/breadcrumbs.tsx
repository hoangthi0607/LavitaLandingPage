import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";
import { absoluteUrl } from "@/i18n/urls";

export type Breadcrumb = { label: string; href?: string };

export async function Breadcrumbs({ items, className }: { items: Breadcrumb[]; className?: string }) {
  const { locale, t } = await getContent();
  const graph = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: absoluteUrl(item.href, locale) } : {}) })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <nav className={className ? `breadcrumbs ${className}` : "breadcrumbs"} aria-label={t.common.breadcrumbLabel}>
      <ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol>
    </nav>
  </>;
}
