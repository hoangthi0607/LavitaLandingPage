import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { About, Capabilities, Training } from "@/components/home/sections";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Về Lavita", "Tìm hiểu Công ty TNHH Xây dựng Lavita, dịch vụ PCCC, giá trị cốt lõi và hồ sơ năng lực doanh nghiệp.", "/ve-lavita");

export default function AboutPage() {
  return <><PageIntro title="Lavita. Đồng hành cùng sự an toàn." description="Công ty TNHH Xây dựng Lavita cung cấp giải pháp PCCC cho công trình dân dụng và công nghiệp từ năm 2023." breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Về Lavita" }]} /><About overview={false} /><Capabilities /><Training /><section className="section content-next"><div><h2>Tìm giải pháp cho công trình.</h2><p>Xem dịch vụ PCCC, đối chiếu dự án theo phạm vi và trao đổi nhu cầu cùng Lavita.</p></div><Link className="button button-primary" href="/dich-vu">Tìm dịch vụ phù hợp <ArrowRight size={18} aria-hidden="true" /></Link></section></>;
}
