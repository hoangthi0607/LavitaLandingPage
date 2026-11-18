// Supported languages, in the order the header flags appear. Vietnamese is the default and keeps the
// unprefixed URLs (/dich-vu); the others are served under a prefix (/en/dich-vu). Slugs stay Vietnamese
// in every language so links, anchors and query strings are shared.
export const locales = ["en", "vi", "zh", "ko", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export const hasLocale = (value: string | undefined): value is Locale => locales.includes(value as Locale);

export const localeInfo: Record<Locale, { nativeName: string; htmlLang: string; intl: string; openGraph: string }> = {
  en: { nativeName: "English", htmlLang: "en", intl: "en-GB", openGraph: "en_US" },
  vi: { nativeName: "Tiếng Việt", htmlLang: "vi", intl: "vi-VN", openGraph: "vi_VN" },
  zh: { nativeName: "中文", htmlLang: "zh-CN", intl: "zh-CN", openGraph: "zh_CN" },
  ko: { nativeName: "한국어", htmlLang: "ko", intl: "ko-KR", openGraph: "ko_KR" },
  ja: { nativeName: "日本語", htmlLang: "ja", intl: "ja-JP", openGraph: "ja_JP" },
};

/** Adds the locale prefix to an internal path ("/du-an?x=1" → "/en/du-an?x=1"). External links and assets pass through. */
export function localizeHref(href: string, locale: Locale) {
  if (locale === defaultLocale || !href.startsWith("/") || href.startsWith("//")) return href;
  const [, path, rest] = href.match(/^([^?#]*)(.*)$/) ?? ["", href, ""];
  return `/${locale}${path === "/" ? "" : path}${rest}`;
}

/** Splits a browser pathname into its locale and the shared, unprefixed path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  // The "vi" prefix is stripped too: Vietnamese URLs are unprefixed for visitors, but in production usePathname()
  // can return the rewritten "/vi/..." route (prerendered pages), while `next dev` returns the browser URL.
  const first = pathname.split("/")[1];
  if (hasLocale(first)) return { locale: first, path: pathname.slice(first.length + 1) || "/" };
  return { locale: defaultLocale, path: pathname || "/" };
}

/** Replaces {name} placeholders in a dictionary string. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
