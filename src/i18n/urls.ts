import { site } from "@/data/home";
import { defaultLocale, localeInfo, localizeHref, locales, type Locale } from "./config";

// Request-independent URL helpers, safe for route handlers such as sitemap.ts.
export const absoluteUrl = (path: string, locale: Locale) => {
  const localized = localizeHref(path, locale);
  return `${site.url}${localized === "/" ? "/" : localized}`;
};

/** Canonical URL for this language plus hreflang links to every translation of the same path. */
export function alternates(path: string, locale: Locale): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = Object.fromEntries(locales.map(code => [localeInfo[code].htmlLang, absoluteUrl(path, code)]));
  languages["x-default"] = absoluteUrl(path, defaultLocale);
  return { canonical: absoluteUrl(path, locale), languages };
}
