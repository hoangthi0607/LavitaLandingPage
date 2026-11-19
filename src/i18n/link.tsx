"use client";

import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { defaultLocale, hasLocale, localizeHref, splitLocale, type Locale } from "./config";

/** Current locale in Client Components (the [lang] root param; unprefixed URLs are rewritten to "vi"). */
export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return hasLocale(params?.lang) ? params.lang : defaultLocale;
}

/** Browser pathname without the locale prefix, for comparing against shared paths such as "/du-an". */
export function useLocalePath() {
  return splitLocale(usePathname() ?? "/").path;
}

/** next/link that keeps the visitor in their language: "/du-an" becomes "/en/du-an" on English pages. */
export default function Link({ href, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = useLocale();
  const target = localizeHref(href, locale);
  // Unprefixed Vietnamese URLs are served through next.config rewrites. In production, Next 16's client router does
  // not fetch the new page when such a link differs only in its query (?danh-muc=…, ?dich-vu=…, ?trang=…): the URL
  // changes but the list stays the same. These links therefore load the page normally.
  if (locale === defaultLocale && target.startsWith("/") && target.includes("?")) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prefetch, scroll, replace, shallow, locale: _locale, legacyBehavior, passHref, onNavigate, ...anchor } = props;
    return <a href={target} {...anchor} />;
  }
  return <NextLink href={target} {...props} />;
}
