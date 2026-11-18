import { PageIntro } from "@/components/content/page-intro";
import { getContent } from "@/i18n/content";
import Link from "@/i18n/link";

export default async function NotFound() {
  const { t } = await getContent();
  const copy = t.notFound;
  return <><PageIntro title={copy.title} description={copy.description} breadcrumbs={[{ label: t.common.home, href: "/" }, { label: copy.breadcrumb }]} /><section className="section content-actions"><Link className="button button-primary" href="/dich-vu">{copy.services}</Link><Link className="button button-secondary" href="/du-an">{copy.projects}</Link><Link className="detail-link" href="/lien-he">{copy.contact}</Link></section></>;
}
