import Link from "next/link";
import { PageIntro } from "@/components/content/page-intro";

export default function NotFound() {
  return <><PageIntro title="Không tìm thấy trang này." description="Bạn có thể tìm dịch vụ PCCC, xem dự án hoặc liên hệ Lavita từ các đường dẫn bên dưới." breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Không tìm thấy trang" }]} /><section className="section content-actions"><Link className="button button-primary" href="/dich-vu">Tìm dịch vụ PCCC</Link><Link className="button button-secondary" href="/du-an">Xem dự án</Link><Link className="detail-link" href="/lien-he">Liên hệ Lavita</Link></section></>;
}
