import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { company, navigation } from "@/data/home";

export function Footer() {
  return <footer className="section footer">
    <div><Brand /><p>Giải pháp phòng cháy chữa cháy<br />cho từng giai đoạn công trình.</p></div>
    <div><h3>{company.name}</h3><p>Mã số thuế: {company.taxCode}</p><a className="footer-profile" href={company.profile} target="_blank" rel="noopener noreferrer">Hồ sơ năng lực <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (PDF, 67 MB, mở trong tab mới)</span></a></div>
    <nav aria-label="Điều hướng cuối trang">{navigation.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
    <small>© {new Date().getFullYear()} LAVITA. Thông tin theo hồ sơ năng lực doanh nghiệp.</small>
  </footer>;
}
