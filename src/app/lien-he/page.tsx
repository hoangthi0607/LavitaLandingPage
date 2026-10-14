import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactComposer } from "@/components/contact/contact-composer";
import { PageIntro } from "@/components/content/page-intro";
import { company, getProject, getService } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Liên hệ tư vấn PCCC",
  "Trao đổi với Lavita về dịch vụ PCCC phù hợp công trình. Liên hệ qua điện thoại hoặc chuẩn bị email với dịch vụ và dự án bạn đã tham khảo.",
  "/lien-he",
);

type ContactSearchParams = {
  "dich-vu"?: string | string[];
  "du-an"?: string | string[];
};

function singleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<ContactSearchParams>;
}) {
  const query = await searchParams;
  const project = getProject(singleValue(query["du-an"]));
  const service = getService(singleValue(query["dich-vu"])) ?? getService(project?.serviceSlug);

  return <>
    <PageIntro
      title="Trao đổi nhu cầu PCCC"
      description={service || project
        ? "Bạn có thể gọi trực tiếp hoặc chuẩn bị email để Lavita hiểu nhu cầu của công trình. Thông tin bạn đã chọn được giữ lại bên dưới."
        : "Bạn có thể gọi trực tiếp hoặc chuẩn bị email để Lavita hiểu dịch vụ và nhu cầu PCCC của công trình."}
      breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
    />
    <section className="section contact-page" aria-label="Thông tin liên hệ và nội dung tư vấn">
      <div className="contact-directory">
        <h2>Liên hệ Lavita</h2>
        <p>Chưa xác định dịch vụ cần tìm? Gọi để trao đổi về tình trạng công trình và nhu cầu của bạn.</p>
        <address className="contact-directory-list">
          <a href={company.phoneHref}>
            <Phone size={21} aria-hidden="true" />
            <span>Điện thoại<strong>{company.phone}</strong></span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a href={`mailto:${company.email}`}>
            <Mail size={21} aria-hidden="true" />
            <span>Email trực tiếp<strong>{company.email}</strong></span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div>
            <MapPin size={21} aria-hidden="true" />
            <span>Địa chỉ<strong>{company.address}</strong></span>
          </div>
        </address>
        <Link className="detail-link" href="/dich-vu">Xem lại các dịch vụ PCCC <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <ContactComposer
        key={`${service?.slug ?? "general"}:${project?.slug ?? "none"}`}
        initialServiceSlug={service?.slug}
        initialProjectSlug={project?.slug}
      />
    </section>
  </>;
}
