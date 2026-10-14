// Nội dung theo hồ sơ năng lực Lavita ngày 10.07.2025.
export const site = {
  url: "https://lavitacons.vn",
  name: "Lavita",
  title: "Lavita | Thiết kế, thi công và bảo trì PCCC",
  description: "Công ty TNHH Xây dựng Lavita cung cấp giải pháp phòng cháy chữa cháy: thiết kế, thi công, nghiệm thu, bảo trì, huấn luyện và thiết bị PCCC.",
  heroHeading: "Lavita – giải pháp\nphòng cháy chữa cháy",
};

export const company = {
    name: "Công ty TNHH Xây dựng Lavita", phone: "0962 381 114", phoneHref: "tel:+84962381114",
    email: "sales@lavitacons.vn", address: "Số 26 - 28 Nguyễn Hoàng, Khu phố 1, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam",
 taxCode: "0318182111", profile: "/documents/ho-so-nang-luc-lavita.pdf",
};
export const navigation = [
 { label: "Dịch vụ PCCC", href: "/dich-vu" }, { label: "Dự án PCCC", href: "/du-an" },
 { label: "Về Lavita", href: "/ve-lavita" }, { label: "Hồ sơ năng lực", href: company.profile }, { label: "Liên hệ", href: "/lien-he" },
];
export const slides = [
 { title: "An toàn hôm nay.\nGiá trị mai sau.", description: "Giải pháp phòng cháy chữa cháy đồng bộ — từ tư vấn thiết kế, thi công đến bảo trì công trình.", category: "LAVITA · GIẢI PHÁP PCCC", href: "/dich-vu", image: "/images/installation.webp", alt: "Hệ thống đường ống PCCC trong hồ sơ Lavita" },
 { title: "Thiết kế đúng.\nVững nền an toàn.", description: "Đồng hành cùng công trình dân dụng và công nghiệp với giải pháp phù hợp từng nhu cầu.", category: "TƯ VẤN & THIẾT KẾ", href: "/dich-vu/tu-van-thiet-ke", image: "/images/dai-nhat.webp", alt: "Phối cảnh Chung cư Đại Nhật, dự án thiết kế PCCC" },
 { title: "Chủ động bảo trì.\nBền vững vận hành.", description: "Bảo trì, sửa chữa hệ thống PCCC và huấn luyện nghiệp vụ để sẵn sàng ứng phó.", category: "BẢO TRÌ & HUẤN LUYỆN", href: "/dich-vu/bao-tri-sua-chua", image: "/images/maintenance.webp", alt: "Kiểm tra thiết bị hệ thống PCCC" },
];
export const services = [
 { slug: "tu-van-thiet-ke", title: "Tư vấn thiết kế", description: "Xây dựng giải pháp và thiết kế hệ thống PCCC phù hợp đặc thù công trình.", group: "trien-khai", image: "/images/dai-nhat.webp", preparation: ["Loại công trình và địa điểm", "Giai đoạn chuẩn bị hoặc thiết kế hiện tại", "Bản vẽ và nhu cầu PCCC đang có"], relatedServiceSlugs: ["thi-cong-he-thong", "tu-van-nghiem-thu"] },
 { slug: "thi-cong-he-thong", title: "Thi công hệ thống", description: "Triển khai thi công hệ thống PCCC cho công trình dân dụng và công nghiệp.", group: "trien-khai", image: "/images/installation.webp", preparation: ["Loại công trình và địa điểm", "Phạm vi hệ thống cần thi công", "Hồ sơ thiết kế và tiến độ dự kiến"], relatedServiceSlugs: ["tu-van-thiet-ke", "tu-van-nghiem-thu"] },
 { slug: "tu-van-nghiem-thu", title: "Tư vấn nghiệm thu", description: "Đồng hành trong công tác tư vấn nghiệm thu phòng cháy chữa cháy.", group: "trien-khai", image: "/images/engineer.webp", preparation: ["Loại công trình và địa điểm", "Tình trạng triển khai hệ thống PCCC", "Hồ sơ hiện có và nội dung cần trao đổi"], relatedServiceSlugs: ["thi-cong-he-thong", "bao-tri-sua-chua"] },
 { slug: "bao-tri-sua-chua", title: "Bảo trì & sửa chữa", description: "Kiểm tra, bảo trì và sửa chữa hệ thống; nạp sạc các loại bình chữa cháy.", group: "van-hanh", image: "/images/maintenance.webp", preparation: ["Loại công trình đang vận hành", "Hệ thống hoặc thiết bị cần kiểm tra", "Tình trạng hiện tại và nhu cầu bảo trì"], relatedServiceSlugs: ["dao-tao-huan-luyen", "vat-tu-thiet-bi"] },
 { slug: "dao-tao-huan-luyen", title: "Đào tạo & huấn luyện", description: "Đào tạo, tập huấn nghiệp vụ PCCC cho đội ngũ tại công trình.", group: "van-hanh", image: "/images/training.webp", preparation: ["Loại công trình và địa điểm huấn luyện", "Đội ngũ tham gia dự kiến", "Nội dung và thời gian muốn trao đổi"], relatedServiceSlugs: ["bao-tri-sua-chua", "vat-tu-thiet-bi"] },
 { slug: "vat-tu-thiet-bi", title: "Vật tư & thiết bị", description: "Thiết bị PCCC, báo cháy tự động, sản phẩm HVAC và vật liệu chống cháy.", group: "thiet-bi", image: "/images/installation.webp", preparation: ["Loại thiết bị hoặc vật tư cần tìm", "Thông số và số lượng nếu đã có", "Công trình sử dụng và thời gian dự kiến"], relatedServiceSlugs: ["thi-cong-he-thong", "bao-tri-sua-chua"] },
] as const;
export const serviceGroups = [
 { id: "trien-khai", title: "Thiết kế & triển khai", description: "Từ chuẩn bị thiết kế đến thi công và tư vấn nghiệm thu." },
 { id: "van-hanh", title: "Vận hành & an toàn", description: "Bảo trì hệ thống và huấn luyện đội ngũ tại công trình." },
 { id: "thiet-bi", title: "Vật tư & thiết bị", description: "Tìm thiết bị PCCC, sản phẩm HVAC và vật liệu chống cháy." },
] as const;
export const projects = [
 { slug: "chung-cu-dai-nhat", serviceSlug: "tu-van-thiet-ke", title: "Chung cư Đại Nhật", description: "Block A & B · TP. Hồ Chí Minh", tag: "Thiết kế PCCC", image: "/images/dai-nhat.webp", profilePage: 18 },
 { slug: "crescent-mall", serviceSlug: "tu-van-thiet-ke", title: "Crescent Mall", description: "Trung tâm thương mại · TP. Hồ Chí Minh", tag: "Thiết kế PCCC", image: "/images/crescent-mall.webp", profilePage: 19 },
 { slug: "chung-cu-c2-binh-duong", serviceSlug: "thi-cong-he-thong", title: "Chung cư C2 – Bình Dương", description: "Công trình dân dụng · Bình Dương", tag: "Thi công PCCC", image: "/images/binh-duong.webp", profilePage: 22 },
 { slug: "the-pegasuite", serviceSlug: "bao-tri-sua-chua", title: "The Pegasuite", description: "Chung cư Phương Việt · TP. Hồ Chí Minh", tag: "Bảo trì PCCC", image: "/images/pegasuite.webp", profilePage: 25 },
] as const;
export type Service = (typeof services)[number];
export type Project = (typeof projects)[number];
export function getService(slug?: string) { return services.find(service => service.slug === slug); }
export function getProject(slug?: string) { return projects.find(project => project.slug === slug); }
export function contactHref(serviceSlug?: string, projectSlug?: string) {
 const project = getProject(projectSlug);
 const service = getService(serviceSlug) ?? getService(project?.serviceSlug);
 const query = new URLSearchParams();
 if (service) query.set("dich-vu", service.slug);
 if (project) query.set("du-an", project.slug);
 return `/lien-he${query.size ? `?${query.toString()}` : ""}`;
}
export const values = ["An toàn, chất lượng & hiệu quả chi phí", "Chủ động, nhanh chóng & quyết liệt", "Hợp tác & chia sẻ kinh nghiệm", "Phát triển cùng nhân viên & đối tác", "Trách nhiệm với cộng đồng & xã hội"];
