import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/content/page-intro";
import { ScrollReveal } from "@/components/content/scroll-reveal";
import { CompanyStory } from "@/components/content/company-story";
import { aboutCompany } from "@/data/home";
import { pageMetadata } from "@/lib/metadata";
import "./about.css";

export const metadata = pageMetadata(aboutCompany.title, aboutCompany.description, "/ve-lavita");

export default function AboutPage() {
  return <div className="company-page"><ScrollReveal>
    <div className="company-hero">
      <Image src={aboutCompany.bannerImage.src} alt={aboutCompany.bannerImage.alt} fill sizes="100vw" preload />
      <div className="company-hero-content"><PageIntro title={aboutCompany.title} description={aboutCompany.heroDescription} breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: aboutCompany.title }]} /><Link className="button button-light" href="/ho-so-nang-luc">Khám phá hồ sơ năng lực<ArrowRight size={18} aria-hidden="true" /></Link></div>
    </div>
    <CompanyStory />
    <section className="section content-next"><div><h2>Tìm giải pháp cho công trình.</h2><p>Xem dịch vụ PCCC, đối chiếu dự án theo phạm vi và trao đổi nhu cầu cùng Lavita.</p></div><Link className="button button-primary" href="/dich-vu">Tìm dịch vụ phù hợp <ArrowRight size={18} aria-hidden="true" /></Link></section>
  </ScrollReveal></div>;
}
