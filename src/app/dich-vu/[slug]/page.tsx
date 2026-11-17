import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { contactHref, getService, projectCategoryHref, serviceHref, services } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  return pageMetadata(`${service.title} PCCC`, service.description, `/dich-vu/${service.slug}`);
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const relatedServices = service.relatedServiceSlugs.map((slug) => getService(slug)).filter((item) => item !== undefined);

  return <>
    <PageIntro title={`${service.title} PCCC`} description={service.description} breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ PCCC", href: "/dich-vu" }, { label: service.title }]} />
    <section className="section content-section service-overview">
      <div className="content-photo"><Image src={service.image} alt={`Hình ảnh minh họa dịch vụ ${service.title} PCCC`} fill sizes="(max-width: 760px) 90vw, 48vw" priority /></div>
      <div className="content-copy">
        <h2>Bắt đầu từ nhu cầu công trình</h2>
        <p>{service.description} Bạn có thể trao đổi với Lavita về công trình và nội dung cần hỗ trợ trước khi xác định phạm vi cụ thể.</p>
        <h3>Thông tin nên chuẩn bị</h3>
        <ul className="preparation-list">{service.preparation.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="content-note">Bạn có thể bắt đầu trao đổi khi chưa có đầy đủ các thông tin trên.</p>
        <div className="content-actions"><Link href={contactHref(service.slug)} className="button button-primary">Tư vấn về dịch vụ này <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
    <section className="section content-section related-services" aria-labelledby="related-services-title"><h2 id="related-services-title">Dịch vụ liên quan</h2><div className="related-service-list">{relatedServices.map((related) => <Link key={related.slug} href={serviceHref(related.slug)}><span>{related.title}</span></Link>)}</div></section>
    <div className="section content-return"><Link href={projectCategoryHref(service.slug)} className="detail-link">Xem dự án theo hạng mục dịch vụ này</Link></div>
  </>;
}
