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
  return <NextLink href={localizeHref(href, locale)} {...props} />;
}
