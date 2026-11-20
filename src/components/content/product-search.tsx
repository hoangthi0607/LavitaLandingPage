"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LayoutGrid, Package, Search } from "lucide-react";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import Link from "@/i18n/link";
import { normalizeSearch } from "@/lib/normalize-search";

/** One product as the suggestions need it; `text` is the normalised title + SKU + description the server also searches. */
export type SearchItem = { slug: string; title: string; sku?: string; group?: string; image?: string; text: string };
/** One product group; `href` opens its list (#ket-qua), `text` is the normalised name. */
export type SearchCategory = { slug: string; title: string; count: number; image?: string; href: string; text: string };

type Copy = Pick<Dictionary["productsPage"], "searchLabel" | "searchPlaceholder" | "searchButton" | "sku" | "count" | "suggestionsLabel" | "suggestionsCount" | "suggestKeywords" | "suggestCategories" | "suggestProducts" | "seeAllResults" | "noSuggestions">;

const maxKeywords = 6;
const maxCategories = 3;
const maxProducts = 4;

type Keyword = { phrase: string; count: number };
type Option = { kind: "keyword"; href: string } | { kind: "category"; href: string } | { kind: "product"; href: string } | { kind: "all" };

// Catalogue search box with a two-column suggestion panel: on the left, search phrases completed from product names
// (each with the number of products a search for it finds) and matching groups; on the right, the first matching
// products with photos; at the bottom, "see all". Phrases and products come from the current group, filtered exactly
// like the server filters ?q=, so the counts match the full results. Enter (with nothing highlighted), the button or
// "see all" sends the normal GET form to the list right under this box (#ket-qua). Works as a plain form without
// JavaScript. Pattern: WAI-ARIA combobox with a grouped listbox popup.
export function ProductSearch({ action, listPath, category, keyword, items, categories, copy }: {
  action: string; listPath: string; category?: string; keyword: string; items: readonly SearchItem[]; categories: readonly SearchCategory[]; copy: Copy;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState(keyword);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // The server re-renders with a new keyword or group after a search; keep the box in step.
  useEffect(() => { setValue(keyword); setOpen(false); setActive(-1); }, [keyword, category]);

  const typed = value.trim();
  const query = normalizeSearch(typed);
  const matches = useMemo(() => query ? items.filter(item => item.text.includes(query)) : [], [items, query]);
  const keywords = useMemo(() => query ? suggestKeywords(items, query) : [], [items, query]);
  const groups = useMemo(() => query ? categories.filter(item => item.slug !== category && item.text.includes(query)).slice(0, maxCategories) : [], [categories, category, query]);
  const products = matches.slice(0, maxProducts);
  const expanded = open && query.length > 0;

  const searchHref = (phrase: string) => {
    const params = new URLSearchParams();
    if (category) params.set("danh-muc", category);
    params.set("q", phrase);
    return `${listPath}?${params}#ket-qua`;
  };
  // Keyboard order: phrases, groups, products, "see all".
  const options: Option[] = [
    ...keywords.map(item => ({ kind: "keyword" as const, href: searchHref(item.phrase) })),
    ...groups.map(item => ({ kind: "category" as const, href: item.href })),
    ...products.map(item => ({ kind: "product" as const, href: `/san-pham/${item.slug}` })),
    ...(matches.length ? [{ kind: "all" as const }] : []),
  ];
  const groupStart = keywords.length;
  const productStart = groupStart + groups.length;
  const allIndex = productStart + products.length;

  useEffect(() => {
    if (!expanded) return;
    const close = (event: PointerEvent) => { if (!formRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [expanded]);

  const optionId = (index: number) => `${id}-opt-${index}`;
  // Keep the highlighted option visible when the panel scrolls.
  useEffect(() => { if (active >= 0) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active, id]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!query) return;
      event.preventDefault();
      setOpen(true);
      if (!options.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      const total = options.length + 1;
      // Cycle through the options and back to the text box (-1).
      setActive(current => (current + 1 + step + total) % total - 1);
    } else if (event.key === "Escape") {
      if (expanded) { event.preventDefault(); setOpen(false); setActive(-1); }
      else if (value) { event.preventDefault(); setValue(""); }
    } else if (event.key === "Enter" && expanded && active >= 0 && options[active]?.kind !== "all") {
      // A highlighted phrase, group or product: follow its link (the shared Link picks client or full navigation).
      event.preventDefault();
      setOpen(false);
      document.getElementById(optionId(active))?.querySelector("a")?.click();
    }
    // Any other Enter submits the form: the full filtered list.
  }

  const option = (index: number) => ({
    id: optionId(index), role: "option", "aria-selected": active === index,
    className: "prod-suggest-option",
  });
  const linkProps = (index: number) => ({ tabIndex: -1, onClick: () => setOpen(false), onPointerEnter: () => setActive(index) });
  const empty = !matches.length && !groups.length;
  const status = !expanded ? "" : empty ? format(copy.noSuggestions, { keyword: typed }) : format(copy.suggestionsCount, { count: matches.length });

  return <form ref={formRef} className="prod-search" action={action} method="get" role="search" data-open={expanded || undefined}>
    {category && <input type="hidden" name="danh-muc" value={category} />}
    <label htmlFor={`${id}-input`} className="sr-only">{copy.searchLabel}</label>
    <Search className="prod-search-icon" size={20} aria-hidden="true" />
    <input
      id={`${id}-input`} type="search" name="q" value={value} maxLength={100} placeholder={copy.searchPlaceholder} autoComplete="off"
      role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={`${id}-list`}
      aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
      onChange={event => { setValue(event.target.value); setOpen(true); setActive(-1); }}
      onFocus={() => setOpen(true)}
      onKeyDown={onKeyDown}
    />
    <button type="submit">{copy.searchButton}</button>

    <div className="prod-suggest" hidden={!expanded}>
      <div id={`${id}-list`} role="listbox" aria-label={copy.suggestionsLabel} className="prod-suggest-panel" data-products={products.length > 0 || undefined}>
        {(keywords.length > 0 || groups.length > 0) && <div className="prod-suggest-side">
          {keywords.length > 0 && <div role="group" aria-labelledby={`${id}-kw`}>
            <p id={`${id}-kw`} className="prod-suggest-heading" role="presentation">{copy.suggestKeywords}</p>
            {keywords.map((item, index) => <div key={item.phrase} {...option(index)}>
              <Link href={searchHref(item.phrase)} className="prod-suggest-keyword" {...linkProps(index)}>
                <Highlight text={item.phrase} query={query} bold />
                <small>{item.count}</small>
              </Link>
            </div>)}
          </div>}
          {groups.length > 0 && <div role="group" aria-labelledby={`${id}-cats`}>
            <p id={`${id}-cats`} className="prod-suggest-heading" role="presentation">{copy.suggestCategories}</p>
            {groups.map((item, offset) => <div key={item.slug} {...option(groupStart + offset)}>
              <Link href={item.href} className="prod-suggest-keyword" {...linkProps(groupStart + offset)}>
                <span className="prod-suggest-cat">
                  <span className="prod-suggest-dot">{item.image ? <Image src={item.image} alt="" width={28} height={28} /> : <LayoutGrid size={14} aria-hidden="true" />}</span>
                  <Highlight text={item.title} query={query} />
                </span>
                <small>{item.count}</small>
              </Link>
            </div>)}
          </div>}
        </div>}
        {products.length > 0 && <div role="group" aria-labelledby={`${id}-products`} className="prod-suggest-main">
          <p id={`${id}-products`} className="prod-suggest-heading" role="presentation">{copy.suggestProducts}</p>
          {products.map((item, offset) => {
            const index = productStart + offset;
            return <div key={item.slug} {...option(index)}>
              <Link href={`/san-pham/${item.slug}`} className="prod-suggest-product" {...linkProps(index)}>
                <span className="prod-suggest-thumb">{item.image ? <Image src={item.image} alt="" width={64} height={64} /> : <Package size={22} aria-hidden="true" />}</span>
                <span className="prod-suggest-text">
                  {item.group && <small>{item.group}</small>}
                  <Highlight text={item.title} query={query} />
                  {item.sku && <small>{format(copy.sku, { sku: item.sku })}</small>}
                </span>
              </Link>
            </div>;
          })}
        </div>}
        {matches.length > 0 && <div {...option(allIndex)} className="prod-suggest-all">
          <button type="submit" tabIndex={-1} onPointerEnter={() => setActive(allIndex)}>{format(copy.seeAllResults, { keyword: typed, count: matches.length })}</button>
        </div>}
      </div>
      {empty && <p className="prod-suggest-empty">{format(copy.noSuggestions, { keyword: typed })}</p>}
    </div>
    <p className="sr-only" role="status" aria-live="polite">{status}</p>
  </form>;
}

const fold = (word: string) => normalizeSearch(word).replace(/[^\p{L}\p{N}-]/gu, "");
const clean = (word: string) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

// Search phrases completed from product names: where the typed words start a run of words in a name, offer that run
// plus the next one or two words ("van" → "van bướm", "van một chiều"); a half-typed last word completes to the whole
// word ("va" → "van"). A longer phrase replaces its shorter prefix when both find the same products. Each phrase is
// counted the way the server searches (title + SKU + description), so the count is what "search" will show.
function suggestKeywords(items: readonly SearchItem[], query: string): Keyword[] {
  const queryWords = query.split(/\s+/).filter(Boolean);
  const phrases = new Map<string, string>();
  for (const item of items) {
    const words = item.title.split(/\s+/).map(clean).filter(Boolean);
    const folded = words.map(fold);
    for (let start = 0; start + queryWords.length <= words.length; start++) {
      const fits = queryWords.every((word, index) => index === queryWords.length - 1 ? folded[start + index].startsWith(word) : folded[start + index] === word);
      if (!fits) continue;
      for (let extra = 0; extra <= 2; extra++) {
        const end = start + queryWords.length + extra;
        if (end > words.length) break;
        const phrase = words.slice(start, end).join(" ").toLocaleLowerCase();
        const key = normalizeSearch(phrase);
        if (!phrases.has(key)) phrases.set(key, phrase);
      }
    }
  }
  const counted = [...phrases].map(([key, phrase]) => ({ key, phrase, count: items.filter(item => item.text.includes(key)).length }))
    .filter(item => item.count > 0);
  const wordCount = (key: string) => key.split(" ").length;
  // Drop a phrase when a one-word-longer phrase finds the same products: "van một" gives way to "van một chiều".
  const whole = counted.filter(item => item.key === query
    || !counted.some(other => other.count === item.count && wordCount(other.key) === wordCount(item.key) + 1 && other.key.startsWith(item.key + " ")));
  // A two-word completion only stands in for its one-word prefix ("van một chiều" for "van một"); next to a shown
  // prefix it is usually a compound cut in half ("quạt hút âm" beside "quạt hút").
  const shown = new Set(whole.map(item => item.key));
  const kept = whole.filter(item => wordCount(item.key) < queryWords.length + 2 || !shown.has(item.key.split(" ").slice(0, -1).join(" ")));
  return kept.sort((a, b) => b.count - a.count || a.phrase.length - b.phrase.length).slice(0, maxKeywords).map(({ phrase, count }) => ({ phrase, count }));
}

// Marks the typed text inside a label. Matching ignores accents, so positions are found on the normalised label,
// which keeps one character per character for Vietnamese (NFD marks are stripped after decomposing each letter).
// `bold` sets the typed part in bold (search phrases, "**van** một chiều") instead of the red mark used on names.
function Highlight({ text, query, bold = false }: { text: string; query: string; bold?: boolean }) {
  const chars = [...text];
  const folded = chars.map(char => normalizeSearch(char));
  const start = query && folded.every(part => [...part].length === 1) ? folded.join("").indexOf(query) : -1;
  if (start < 0) return <span className="prod-suggest-label">{text}</span>;
  const end = start + [...query].length;
  const [before, match, after] = [chars.slice(0, start).join(""), chars.slice(start, end).join(""), chars.slice(end).join("")];
  return bold
    ? <span className="prod-suggest-label">{before}<b>{match}</b>{after}</span>
    : <span className="prod-suggest-label">{before}<mark>{match}</mark>{after}</span>;
}
