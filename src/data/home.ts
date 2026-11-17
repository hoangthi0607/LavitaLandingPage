// Nội dung theo hồ sơ năng lực Lavita ngày 10.07.2025.
export const site = {
  url: "https://lavitacons.vn",
  name: "Lavita",
  title: "Lavita | Thiết kế, thi công và bảo trì PCCC",
  description: "Công ty TNHH Xây dựng Lavita cung cấp giải pháp phòng cháy chữa cháy: tư vấn thiết kế, thi công hệ thống, bảo trì và sửa chữa.",
  heroHeading: "Lavita – giải pháp\nphòng cháy chữa cháy",
};

export const company = {
    name: "Công ty TNHH Xây dựng Lavita", phone: "0962 381 114", phoneHref: "tel:+84962381114",
    email: "sales@lavitacons.vn", address: "Số 26 - 28 Nguyễn Hoàng, Khu phố 1, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam",
 taxCode: "0318182111", profile: "/documents/ho-so-nang-luc-lavita.pdf",
};
export const projectNavigation = { label: "Dự án PCCC", href: "/du-an" } as const;
export const navigation = [
 { label: "Về Lavita", href: "/ve-lavita" }, { label: "Dịch vụ PCCC", href: "/dich-vu" }, projectNavigation,
 { label: "Sản phẩm", href: "/san-pham" }, { label: "Hồ sơ năng lực", href: "/ho-so-nang-luc" }, { label: "Liên hệ", href: "/lien-he" },
];
// Language switcher. Only Vietnamese content exists today; the others are placeholders until translations ship.
export const languages = [
 { code: "en", name: "Tiếng Anh", nativeName: "English" },
 { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt" },
 { code: "zh", name: "Tiếng Trung", nativeName: "中文" },
 { code: "ko", name: "Tiếng Hàn", nativeName: "한국어" },
 { code: "ja", name: "Tiếng Nhật", nativeName: "日本語" },
] as const;
export type LanguageCode = (typeof languages)[number]["code"];
export const currentLanguage: LanguageCode = "vi";
export const slides = [
 { title: "An toàn hôm nay.\nGiá trị mai sau.", description: "Giải pháp phòng cháy chữa cháy đồng bộ — từ tư vấn thiết kế, thi công đến bảo trì công trình.", category: "LAVITA · GIẢI PHÁP PCCC", href: "/dich-vu", image: "/images/installation.webp", alt: "Hệ thống đường ống PCCC" },
 { title: "Thiết kế đúng.\nVững nền an toàn.", description: "Đồng hành cùng công trình dân dụng và công nghiệp với giải pháp phù hợp từng nhu cầu.", category: "TƯ VẤN & THIẾT KẾ", href: "/dich-vu#tu-van-thiet-ke", image: "/images/dai-nhat.webp", alt: "Phối cảnh Chung cư Đại Nhật, dự án thiết kế PCCC" },
 { title: "Chủ động bảo trì.\nBền vững vận hành.", description: "Bảo trì, sửa chữa hệ thống PCCC để công trình vận hành an toàn.", category: "BẢO TRÌ & SỬA CHỮA", href: "/dich-vu#bao-tri-sua-chua", image: "/images/maintenance.webp", alt: "Kiểm tra thiết bị hệ thống PCCC" },
];
export const services = [
 { slug: "tu-van-thiet-ke", title: "Tư vấn thiết kế", description: "Xây dựng giải pháp và thiết kế hệ thống PCCC phù hợp đặc thù công trình.", group: "trien-khai", image: "/images/dai-nhat.webp", preparation: ["Loại công trình và địa điểm", "Giai đoạn chuẩn bị hoặc thiết kế hiện tại", "Bản vẽ và nhu cầu PCCC đang có"], relatedServiceSlugs: ["thi-cong-he-thong"] },
 { slug: "thi-cong-he-thong", title: "Thi công hệ thống", description: "Triển khai thi công hệ thống PCCC cho công trình dân dụng và công nghiệp.", group: "trien-khai", image: "/images/installation.webp", preparation: ["Loại công trình và địa điểm", "Phạm vi hệ thống cần thi công", "Hồ sơ thiết kế và tiến độ dự kiến"], relatedServiceSlugs: ["tu-van-thiet-ke", "bao-tri-sua-chua"] },
 { slug: "bao-tri-sua-chua", title: "Bảo trì & sửa chữa", description: "Kiểm tra, bảo trì và sửa chữa hệ thống; nạp sạc các loại bình chữa cháy.", group: "van-hanh", image: "/images/maintenance.webp", preparation: ["Loại công trình đang vận hành", "Hệ thống hoặc thiết bị cần kiểm tra", "Tình trạng hiện tại và nhu cầu bảo trì"], relatedServiceSlugs: ["thi-cong-he-thong"] },
] as const;
export const serviceGroups = [
 { id: "trien-khai", title: "Thiết kế & triển khai", description: "Tư vấn thiết kế và thi công hệ thống PCCC cho công trình." },
 { id: "van-hanh", title: "Vận hành & an toàn", description: "Kiểm tra, bảo trì và sửa chữa hệ thống PCCC tại công trình." },
] as const;
export const projects = [
 { slug: "chung-cu-dai-nhat", serviceSlug: "tu-van-thiet-ke", title: "Chung cư Đại Nhật", description: "Block A & B · TP. Hồ Chí Minh", location: "TP. Hồ Chí Minh", tag: "Thiết kế PCCC", image: "/images/profile/dai-nhat-thiet-ke.webp", profilePage: 18 },
 { slug: "crescent-mall", serviceSlug: "tu-van-thiet-ke", title: "Crescent Mall", description: "Trung tâm thương mại · TP. Hồ Chí Minh", location: "TP. Hồ Chí Minh", tag: "Thiết kế PCCC", image: "/images/crescent-mall.webp", profilePage: 19 },
 { slug: "chung-cu-c2-binh-duong", serviceSlug: "thi-cong-he-thong", title: "Chung cư C2 – Bình Dương", description: "Công trình dân dụng · Bình Dương", location: "Bình Dương", tag: "Thi công PCCC", image: "/images/binh-duong.webp", profilePage: 22 },
 { slug: "the-pegasuite", serviceSlug: "bao-tri-sua-chua", title: "The Pegasuite", description: "Chung cư Phương Việt · TP. Hồ Chí Minh", location: "TP. Hồ Chí Minh", tag: "Bảo trì PCCC", image: "/images/pegasuite.webp", profilePage: 25 },
] as const;
export const projectPortfolio = {
 title: "Dự án PCCC",
 description: "Khám phá các công trình Lavita tham gia tư vấn thiết kế, thi công hệ thống, bảo trì và sửa chữa PCCC.",
 banner: { src: "/images/installation.webp", alt: "Hệ thống đường ống PCCC lắp đặt dọc trần công trình" },
 allLabel: "Tất cả",
} as const;
export const projectLocations = [...new Set(projects.map(project => project.location))];
export type Service = (typeof services)[number];
export type Project = (typeof projects)[number];
export function getService(slug?: string) { return services.find(service => service.slug === slug); }
export function getProject(slug?: string) { return projects.find(project => project.slug === slug); }
export function serviceHref(slug?: string) {
 const service = getService(slug);
 return service ? `/dich-vu#${service.slug}` : "/dich-vu";
}
export function projectCategoryHref(slug?: string) {
 const service = getService(slug);
 return service ? `/du-an?${new URLSearchParams({ "dich-vu": service.slug })}` : "/du-an";
}
export function contactHref(serviceSlug?: string, projectSlug?: string) {
 const project = getProject(projectSlug);
 const service = getService(serviceSlug) ?? getService(project?.serviceSlug);
 const query = new URLSearchParams();
 if (service) query.set("dich-vu", service.slug);
 if (project) query.set("du-an", project.slug);
 return `/lien-he${query.size ? `?${query.toString()}` : ""}`;
}
export const values = ["An toàn, chất lượng & hiệu quả chi phí", "Chủ động, nhanh chóng & quyết liệt", "Hợp tác & chia sẻ kinh nghiệm", "Phát triển cùng nhân viên & đối tác", "Trách nhiệm với cộng đồng & xã hội"];

// Nội dung chi tiết: phần giới thiệu, tầm nhìn/sứ mệnh, giá trị và kế hoạch
// ở các trang PDF 2–5. Các mốc dưới đây là kế hoạch, không phải kết quả thực hiện.
export const aboutCompany = {
 title: "Về Lavita",
 description: "Tìm hiểu về Công ty TNHH Xây dựng Lavita: giới thiệu doanh nghiệp, tầm nhìn, sứ mệnh, giá trị cốt lõi và kế hoạch tăng trưởng.",
 heading: "Lavita. Đồng hành cùng sự an toàn.",
 heroDescription: "Đồng hành cùng sự an toàn.\nGiải pháp PCCC cho công trình dân dụng và công nghiệp.",
 introduction: "Công ty TNHH Xây dựng Lavita cung cấp giải pháp phòng cháy chữa cháy cho công trình dân dụng và công nghiệp từ năm 2023.",
 bannerImage: { src: "/images/profile/he-thong-pccc.webp", alt: "Hệ thống đường ống phòng cháy chữa cháy tại công trình" },
 facts: [
  { label: "Tên doanh nghiệp", value: company.name },
  { label: "Thành lập", value: "2023" },
  { label: "Địa chỉ", value: company.address },
  { label: "Mã số thuế", value: company.taxCode },
 ],
 sections: [
  { id: "gioi-thieu", title: "Giới thiệu" },
  { id: "tam-nhin-su-menh", title: "Tầm nhìn & sứ mệnh" },
  { id: "gia-tri-cot-loi", title: "Giá trị cốt lõi" },
  { id: "ke-hoach-tang-truong", title: "Kế hoạch tăng trưởng" },
 ],
 overview: {
  sectionTitle: "Giới thiệu chung",
  heading: "Kiến tạo niềm tin và giá trị cho tương lai.",
  lead: "Với sứ mệnh mang đến những giải pháp đột phá và chất lượng vượt trội, Lavita tập trung vào các giải pháp hệ thống phòng cháy chữa cháy.",
  paragraphs: [
   "Thành lập từ năm 2023, Công ty TNHH Xây dựng Lavita hoạt động trong lĩnh vực cung cấp dịch vụ và giải pháp tối ưu cho các dự án, hướng đến những công trình an toàn, bền vững.",
   "Từ tư vấn thiết kế, thi công đến bảo trì, Lavita đồng hành cùng khách hàng để xây dựng giải pháp PCCC phù hợp với công trình, chú trọng hiệu quả và tối ưu chi phí.",
  ],
  image: { src: "/images/engineer.webp", alt: "Nhân sự kỹ thuật Lavita kiểm tra tủ điện của hệ thống PCCC" },
 },
 vision: {
  heading: "Tầm nhìn",
  text: "Trở thành đơn vị hàng đầu trong lĩnh vực phòng cháy chữa cháy tại Việt Nam, tiên phong trong việc cung cấp giải pháp an toàn toàn diện, hiện đại và bền vững cho mọi công trình – từ dân dụng đến công nghiệp, góp phần xây dựng một xã hội an toàn trước rủi ro cháy nổ.",
  image: { src: "/images/profile/doi-ngu-thi-cong-c2.webp", width: 1181, height: 664, alt: "Đội ngũ Lavita thi công hệ thống PCCC tại Chung cư C2 Bình Dương" },
 },
 mission: {
  heading: "Sứ mệnh",
  items: [
   "Cung cấp giải pháp PCCC hiệu quả – đúng chuẩn – tối ưu chi phí.",
   "Cam kết an toàn tuyệt đối cho người và tài sản.",
   "Đồng hành cùng khách hàng từ thiết kế, thi công đến bảo trì.",
   "Không ngừng nâng cao năng lực kỹ thuật và công nghệ.",
   "Phát triển bền vững: gắn kết giữa lợi ích doanh nghiệp, khách hàng và trách nhiệm xã hội.",
  ],
 },
 coreValues: {
  heading: "Giá trị cốt lõi",
  items: [
   { title: "An toàn, chất lượng và hiệu quả", text: "Sản phẩm an toàn, chất lượng vượt trội, hiệu quả chi phí." },
   { title: "Nhanh chóng và quyết liệt", text: "Hành động nhanh và quyết liệt để đảm bảo tiến độ, tiết kiệm thời gian và chi phí." },
   { title: "Hợp tác và chia sẻ", text: "Hợp tác và chia sẻ kinh nghiệm cùng mang lại thành công chung cho dự án." },
   { title: "Cùng phát triển", text: "Sự phát triển của công ty gắn với sự phát triển của nhân viên và đối tác." },
   { title: "Trách nhiệm với cộng đồng", text: "Trách nhiệm với cộng đồng và xã hội luôn được đề cao." },
  ],
 },
 growth: {
  heading: "Kế hoạch tăng trưởng",
  description: "Các mốc mục tiêu giai đoạn 2023–2027.",
  note: "Các giá trị thể hiện mục tiêu kế hoạch, không phải số liệu kết quả thực hiện.",
  unit: "tỷ đồng",
  milestones: [
   { year: 2023, value: 25 },
   { year: 2024, value: 35 },
   { year: 2025, value: 55 },
   { year: 2026, value: 85 },
   { year: 2027, value: 105 },
  ],
 },
} as const;

export type ProfileDocument = { src: string; width: number; height: number; title: string; sourcePage: number };

export const companyProfile = {
 title: "Hồ sơ năng lực",
 description: "Thông tin doanh nghiệp, chuyên môn, đội ngũ và các dự án PCCC của Công ty TNHH Xây dựng Lavita.",
 heroHeading: "Hồ sơ năng lực\nLavita.",
 introduction: "Chuyên môn từ con người.\nMinh chứng qua từng công trình.",
 heroImage: { src: "/images/profile/he-thong-pccc.webp", alt: "Hệ thống đường ống PCCC", sourcePage: 21 },
 founded: "2023",
 teamTitle: "Đội ngũ thi công công trình",
 teamCaption: "Đội thi công hệ thống PCCC tại Chung cư C2 Bình Dương.",
 teamImage: { src: "/images/profile/doi-ngu-thi-cong-c2.webp", width: 1181, height: 664, alt: "Đội thi công hệ thống PCCC tại Chung cư C2 Bình Dương", sourcePage: 23 },
 legalTitle: "Hồ sơ pháp lý",
 credentialsTitle: "Bằng cấp, chứng chỉ nhân sự",
 showCredentials: false,
 technicianImage: { src: "/images/profile/ky-thuat-vien-pccc.webp", width: 720, height: 1020, alt: "Kỹ thuật viên thao tác tại hệ thống PCCC", sourcePage: 10 },
 projectsTitle: "Năng lực thể hiện\nqua phạm vi PCCC.",
 sections: [
  { id: "thong-tin-doanh-nghiep", title: "Đội ngũ thi công" },
  { id: "phap-ly", title: "Hồ sơ pháp lý" },
  { id: "chuyen-mon", title: "Bằng cấp, chứng chỉ nhân sự" },
  { id: "du-an-tieu-bieu", title: "Dự án tiêu biểu" },
 ],
 organization: [
  { title: "Khối văn phòng", roles: ["Hành chính – Nhân sự", "Kế toán", "Hợp đồng", "Đấu thầu"] },
  { title: "Khối kinh doanh", roles: ["Dự án", "Thương mại"] },
  { title: "Khối kỹ thuật", roles: ["Tư vấn thiết kế", "Thi công", "Bảo trì"] },
 ],
 legalDocuments: [
  { title: "Đăng ký doanh nghiệp", pages: [
   { src: "/images/profile/dang-ky-doanh-nghiep-1.webp", width: 643, height: 916, title: "Đăng ký doanh nghiệp – trang 1", sourcePage: 6 },
   { src: "/images/profile/dang-ky-doanh-nghiep-2.webp", width: 791, height: 1128, title: "Đăng ký doanh nghiệp – trang 2", sourcePage: 6 },
  ] },
  { title: "Điều kiện kinh doanh dịch vụ PCCC", pages: [
   { src: "/images/profile/dieu-kien-kinh-doanh-pccc-1.webp", width: 730, height: 1025, title: "Giấy xác nhận đủ điều kiện kinh doanh dịch vụ PCCC", sourcePage: 7 },
   { src: "/images/profile/dieu-kien-kinh-doanh-pccc-2.webp", width: 730, height: 1025, title: "Nội dung kinh doanh dịch vụ PCCC kèm theo", sourcePage: 7 },
  ] },
 ],
 credentials: [
  { src: "/images/profile/chung-chi-le-tien-thuy.webp", width: 1050, height: 738, title: "Chứng chỉ nhân sự – Lê Tiến Thủy", sourcePage: 11 },
  { src: "/images/profile/bang-cap-le-tien-thuy.webp", width: 1259, height: 874, title: "Bằng tốt nghiệp đại học – Lê Tiến Thủy", sourcePage: 11 },
  { src: "/images/profile/chung-chi-tran-luong-anh.webp", width: 1073, height: 756, title: "Chứng chỉ nhân sự – Trần Lương Anh", sourcePage: 11 },
  { src: "/images/profile/bang-cap-tran-luong-anh.webp", width: 1024, height: 705, title: "Bằng tốt nghiệp đại học – Trần Lương Anh", sourcePage: 11 },
 ],
 projectChapters: [
  { serviceSlug: "tu-van-thiet-ke", projectSlugs: ["chung-cu-dai-nhat", "crescent-mall"], photos: [{ src: "/images/profile/dai-nhat-thiet-ke.webp", width: 1800, height: 1273, alt: "Chung cư Đại Nhật – phạm vi thiết kế PCCC", sourcePage: 18 }] },
  { serviceSlug: "thi-cong-he-thong", projectSlugs: ["chung-cu-c2-binh-duong"], photos: [{ src: "/images/binh-duong.webp", width: 957, height: 535, alt: "Chung cư C2 Bình Dương – phạm vi thi công PCCC", sourcePage: 22 }] },
  { serviceSlug: "bao-tri-sua-chua", projectSlugs: ["the-pegasuite"], photos: [
   { src: "/images/profile/pegasuite-kiem-tra-tu.webp", width: 556, height: 858, alt: "Kiểm tra tủ hệ thống PCCC tại Chung cư Phương Việt – The Pegasuite", sourcePage: 25 },
   { src: "/images/profile/pegasuite-kiem-tra-thiet-bi.webp", width: 556, height: 858, alt: "Kiểm tra thiết bị PCCC tại Chung cư Phương Việt – The Pegasuite", sourcePage: 25 },
  ] },
 ],
} as const;
