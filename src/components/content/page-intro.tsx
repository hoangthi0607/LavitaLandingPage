import Link from "next/link";
import { site } from "@/data/home";

export type Breadcrumb = { label: string; href?: string };

export function PageIntro({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Breadcrumb[] }) {
  const graph = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: `${site.url}${item.href}` } : {}) })) };
  return <section className="section page-intro">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <nav className="breadcrumbs" aria-label="Đường dẫn trang"><ol>{breadcrumbs.map((item, index) => <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>
    <h1>{title}</h1><p className="lead">{description}</p>
  </section>;
}
