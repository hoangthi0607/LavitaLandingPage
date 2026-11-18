// Language-independent facts and structure from the Lavita company profile (10.07.2025).
// Every visible text lives in src/i18n/dictionaries; getContent() in src/i18n/content.ts merges both.
export const site = { url: "https://lavitacons.vn", name: "Lavita" };

export const company = {
  phone: "0962 381 114", phoneHref: "tel:+84962381114",
  email: "sales@lavitacons.vn", address: "Số 26 - 28 Nguyễn Hoàng, Khu phố 1, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam",
  taxCode: "0318182111", founded: "2023", profile: "/documents/ho-so-nang-luc-lavita.pdf",
};

export const navigationKeys = [
  { key: "about", href: "/ve-lavita" }, { key: "services", href: "/dich-vu" }, { key: "projects", href: "/du-an" },
  { key: "products", href: "/san-pham" }, { key: "profile", href: "/ho-so-nang-luc" }, { key: "news", href: "/tin-tuc" }, { key: "contact", href: "/lien-he" },
] as const;
export const projectsHref = "/du-an";

export const slideBase = [
  { href: "/dich-vu", image: "/images/profile/he-thong-pccc.webp" },
  { href: "/dich-vu#tu-van-thiet-ke", image: "/images/dai-nhat.webp" },
  { href: "/dich-vu#bao-tri-sua-chua", image: "/images/maintenance.webp" },
] as const;

// hasProjects: the service is a project category (project menu, /du-an tabs). Equipment supply has no projects;
// its detail page links to the product catalogue instead. Detail texts come from the old lavitacons.vn service pages.
export const serviceBase = [
  { slug: "tu-van-thiet-ke", group: "trien-khai", image: "/images/dai-nhat.webp", relatedServiceSlugs: ["thi-cong-he-thong"], hasProjects: true },
  { slug: "thi-cong-he-thong", group: "trien-khai", image: "/images/installation.webp", relatedServiceSlugs: ["tu-van-thiet-ke", "bao-tri-sua-chua"], hasProjects: true },
  { slug: "bao-tri-sua-chua", group: "van-hanh", image: "/images/maintenance.webp", relatedServiceSlugs: ["thi-cong-he-thong"], hasProjects: true },
  { slug: "cung-cap-thiet-bi", group: "cung-ung", image: "/images/vat-tu-thiet-bi.webp", relatedServiceSlugs: ["thi-cong-he-thong", "bao-tri-sua-chua"], hasProjects: false },
] as const;
export type ServiceSlug = (typeof serviceBase)[number]["slug"];
// How each section of services[slug].detail is laid out on the service page, in order:
// steps = numbered process, cards = labelled points with an icon, tiles = compact grid, checks = checklist.
export type ServiceSectionStyle = "steps" | "cards" | "tiles" | "checks";
export const serviceSectionStyles: Record<ServiceSlug, readonly ServiceSectionStyle[]> = {
  "tu-van-thiet-ke": ["steps", "checks", "checks", "cards"],
  "thi-cong-he-thong": ["cards", "steps"],
  "bao-tri-sua-chua": ["cards", "tiles", "cards"],
  "cung-cap-thiet-bi": ["cards", "tiles"],
};
export const serviceGroupIds = ["trien-khai", "van-hanh", "cung-ung"] as const;
export type ServiceGroupId = (typeof serviceGroupIds)[number];

// Sources: company profile (profilePage) and the "Dự án" posts of the old lavitacons.vn site (wpPost, backup 12/09/2026).
// Title, location, scale and investor live in the dictionaries; empty values render as the "pending" label.
export const projectBase = [
  { slug: "chung-cu-dai-nhat", serviceSlug: "tu-van-thiet-ke", image: "/images/profile/dai-nhat-thiet-ke.webp", profilePage: 18, wpPost: 2057 },
  { slug: "crescent-mall", serviceSlug: "tu-van-thiet-ke", image: "/images/crescent-mall.webp", profilePage: 19 },
  { slug: "chung-cu-c2-binh-duong", serviceSlug: "thi-cong-he-thong", image: "/images/binh-duong.webp", profilePage: 22, wpPost: 2056 },
  { slug: "the-pegasuite", serviceSlug: "bao-tri-sua-chua", image: "/images/pegasuite.webp", profilePage: 25, wpPost: 2193 },
  { slug: "sycamore-capitaland", serviceSlug: "tu-van-thiet-ke", image: "/images/projects/sycamore-capitaland.webp", wpPost: 2175 },
  { slug: "fpt-online-tang-5-6", serviceSlug: "tu-van-thiet-ke", image: "/images/projects/fpt-online-tang-5-6.webp", wpPost: 2173 },
  { slug: "truong-chuyen-biet-tuong-lai", serviceSlug: "thi-cong-he-thong", image: "/images/projects/truong-chuyen-biet-tuong-lai.webp", wpPost: 2177 },
  { slug: "truong-thcs-ba-dinh", serviceSlug: "thi-cong-he-thong", image: "/images/projects/truong-thcs-ba-dinh.webp", wpPost: 2179 },
  { slug: "cong-ty-dai-luc", serviceSlug: "thi-cong-he-thong", image: "/images/projects/cong-ty-dai-luc.webp", wpPost: 2181 },
  { slug: "phu-my-hung-7-toa-nha", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/phu-my-hung-7-toa-nha.webp", wpPost: 2187 },
  { slug: "riverside-residence", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/riverside-residence.webp", wpPost: 2191 },
  { slug: "diamond-lotus", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/diamond-lotus.webp", wpPost: 2189 },
  { slug: "mizuki-park", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/mizuki-park.webp", wpPost: 2200 },
  { slug: "chung-cu-an-phu-dong", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/chung-cu-an-phu-dong.webp", wpPost: 2196 },
  { slug: "nha-may-cj", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/nha-may-cj.webp", wpPost: 2198 },
  { slug: "dien-luc-dong-nai", serviceSlug: "bao-tri-sua-chua", image: "/images/projects/dien-luc-dong-nai.webp", wpPost: 2183 },
] as const;
export type ProjectSlug = (typeof projectBase)[number]["slug"];
export const projectPageSize = 8;

// Featured client logos for the home marquee: investors of projects in projectBase. Official logos taken from each
// company's website (18/11/2026) at the user's request, trimmed to 160 px high WebP in public/images/clients/.
export type ClientLogo = { name: string; logo: string; width: number; height: number; url?: string };
export const homeClients: ClientLogo[] = [
  { name: "CapitaLand", logo: "/images/clients/capitaland.webp", width: 373, height: 160 },
  { name: "FPT", logo: "/images/clients/fpt.webp", width: 266, height: 160 },
  { name: "Nam Long Group", logo: "/images/clients/nam-long.webp", width: 272, height: 160 },
  { name: "CJ Group", logo: "/images/clients/cj.webp", width: 189, height: 160 },
  { name: "EVN", logo: "/images/clients/evn.webp", width: 350, height: 160 },
  { name: "Phú Mỹ Hưng", logo: "/images/clients/phu-my-hung.webp", width: 207, height: 160 },
  { name: "Đại Phúc Group", logo: "/images/clients/dai-phuc.webp", width: 362, height: 160 },
  { name: "Saigonres", logo: "/images/clients/saigonres.webp", width: 178, height: 160 },
];

export function getServiceBase(slug?: string) { return serviceBase.find(service => service.slug === slug); }
export function getProjectBase(slug?: string) { return projectBase.find(project => project.slug === slug); }

// Unprefixed internal paths; the locale-aware Link adds /en, /zh… when needed.
export function serviceHref(slug?: string) {
  const service = getServiceBase(slug);
  return service ? `/dich-vu#${service.slug}` : "/dich-vu";
}
export function projectCategoryHref(slug?: string) {
  const service = getServiceBase(slug);
  return service ? `/du-an?${new URLSearchParams({ "dich-vu": service.slug })}` : "/du-an";
}
export function contactHref(serviceSlug?: string, projectSlug?: string) {
  const project = getProjectBase(projectSlug);
  const service = getServiceBase(serviceSlug) ?? getServiceBase(project?.serviceSlug);
  const query = new URLSearchParams();
  if (service) query.set("dich-vu", service.slug);
  if (project) query.set("du-an", project.slug);
  return `/lien-he${query.size ? `?${query.toString()}` : ""}`;
}

// Growth targets on profile pages 2–5. These are plans, not realised revenue (unit: billion VND).
export const growthMilestones = [
  { year: 2023, value: 25 },
  { year: 2024, value: 35 },
  { year: 2025, value: 55 },
  { year: 2026, value: 85 },
  { year: 2027, value: 105 },
] as const;

export const aboutImages = {
  banner: "/images/profile/he-thong-pccc.webp",
  overview: "/images/engineer.webp",
  vision: { src: "/images/profile/doi-ngu-thi-cong-c2.webp", width: 1181, height: 664 },
  coreValues: ["/images/maintenance.webp", "/images/profile/ky-thuat-vien-pccc.webp", "/images/profile/doi-ngu-thi-cong-c2.webp", "/images/engineer.webp", "/images/training.webp"],
} as const;
// Timeline: only the founding year is sourced; later periods are placeholders until real milestones are supplied.
export const historyPending = [false, true, true, true] as const;

export type ProfileDocument = { src: string; width: number; height: number; title: string; sourcePage: number };

export const profileBase = {
  showCredentials: false,
  heroImage: { src: "/images/profile/he-thong-pccc.webp", sourcePage: 21 },
  teamImage: { src: "/images/profile/doi-ngu-thi-cong-c2.webp", width: 1181, height: 664, sourcePage: 23 },
  technicianImage: { src: "/images/profile/ky-thuat-vien-pccc.webp", width: 720, height: 1020, sourcePage: 10 },
  sectionIds: ["thong-tin-doanh-nghiep", "phap-ly", "chuyen-mon", "du-an-tieu-bieu"],
  legalDocuments: [
    [
      { src: "/images/profile/dang-ky-doanh-nghiep-1.webp", width: 643, height: 916, sourcePage: 6 },
      { src: "/images/profile/dang-ky-doanh-nghiep-2.webp", width: 791, height: 1128, sourcePage: 6 },
    ],
    [
      { src: "/images/profile/dieu-kien-kinh-doanh-pccc-1.webp", width: 730, height: 1025, sourcePage: 7 },
      { src: "/images/profile/dieu-kien-kinh-doanh-pccc-2.webp", width: 730, height: 1025, sourcePage: 7 },
    ],
  ],
  credentials: [
    { src: "/images/profile/chung-chi-le-tien-thuy.webp", width: 1050, height: 738, sourcePage: 11 },
    { src: "/images/profile/bang-cap-le-tien-thuy.webp", width: 1259, height: 874, sourcePage: 11 },
    { src: "/images/profile/chung-chi-tran-luong-anh.webp", width: 1073, height: 756, sourcePage: 11 },
    { src: "/images/profile/bang-cap-tran-luong-anh.webp", width: 1024, height: 705, sourcePage: 11 },
  ],
  projectChapters: [
    { serviceSlug: "tu-van-thiet-ke", projectSlugs: ["chung-cu-dai-nhat", "crescent-mall"], photos: [{ src: "/images/profile/dai-nhat-thiet-ke.webp", width: 1800, height: 1273, sourcePage: 18 }] },
    { serviceSlug: "thi-cong-he-thong", projectSlugs: ["chung-cu-c2-binh-duong"], photos: [{ src: "/images/binh-duong.webp", width: 957, height: 535, sourcePage: 22 }] },
    { serviceSlug: "bao-tri-sua-chua", projectSlugs: ["the-pegasuite"], photos: [
      { src: "/images/profile/pegasuite-kiem-tra-tu.webp", width: 556, height: 858, sourcePage: 25 },
      { src: "/images/profile/pegasuite-kiem-tra-thiet-bi.webp", width: 556, height: 858, sourcePage: 25 },
    ] },
  ],
} as const;
