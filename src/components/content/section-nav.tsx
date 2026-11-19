"use client";

import { useEffect, useRef, useState } from "react";

// Sticky in-page bar (/dich-vu groups, /ho-so-nang-luc sections): a red pill slides to the part being read. Each item
// points at an element id; the section around it is watched. Plain anchor links without JavaScript.
// Styles: .section-nav in app/[lang]/content.css.
export function SectionNav({ items, label }: { items: { target: string; title: string }[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const watched = new Map<Element, string>();
    for (const item of items) {
      const element = document.getElementById(item.target);
      if (element) watched.set(element.closest("section") ?? element, item.target);
    }
    // The part crossing the line 40% down the viewport is the one being read.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(watched.get(entry.target) ?? null);
    }, { rootMargin: "-40% 0px -59% 0px" });
    watched.forEach((_, element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const place = () => {
      const link = listRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (!link) { setIndicator(null); return; }
      setIndicator({ left: link.offsetLeft, width: link.offsetWidth });
      const list = listRef.current!;
      // Keep the current item visible when the bar scrolls sideways on small screens.
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: link.offsetLeft - 16, behavior: "smooth" });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return <nav className="section-nav" aria-label={label}>
    <ul ref={listRef}>
      {indicator && <li className="section-nav-indicator" aria-hidden="true" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />}
      {items.map(item => <li key={item.target}><a href={`#${item.target}`} aria-current={active === item.target ? "true" : undefined}>{item.title}</a></li>)}
    </ul>
  </nav>;
}
