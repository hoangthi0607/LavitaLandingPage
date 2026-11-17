import { Breadcrumbs, type Breadcrumb } from "./breadcrumbs";

export type { Breadcrumb };

export function PageIntro({ title, description, breadcrumbs }: { title: string; description: string; breadcrumbs: Breadcrumb[] }) {
  return <section className="section page-intro">
    <Breadcrumbs items={breadcrumbs} />
    <h1>{title}</h1><p className="lead">{description}</p>
  </section>;
}
