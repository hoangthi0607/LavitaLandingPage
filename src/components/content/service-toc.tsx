"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

// Sticky table of contents for a service page. Highlights the section being read (scrollspy) with a marker that
// slides to the active link. Plain anchor links, so it still works without JavaScript.
export function ServiceToc({ label, items }: { label: string; items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const targets = items.map(item => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const tops = new Map<string, number>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) tops.set(entry.target.id, entry.isIntersecting ? entry.boundingClientRect.top : Infinity);
      const inView = [...tops].filter(([, top]) => top !== Infinity).sort((a, b) => a[1] - b[1]);
      if (inView.length) setActive(inView[0][0]);
    }, { rootMargin: "-25% 0px -60% 0px" });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  useLayoutEffect(() => {
    const measure = () => {
      const link = listRef.current?.querySelector<HTMLElement>('a[aria-current="location"]');
      if (link) setMarker({ top: link.offsetTop, height: link.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return <nav className="service-toc" aria-label={label}>
    <p className="service-toc-label">{label}</p>
    <ol ref={listRef} style={marker ? { "--marker-top": `${marker.top}px`, "--marker-height": `${marker.height}px` } as CSSProperties : undefined} data-marker={marker ? "true" : undefined}>
      {items.map(item => <li key={item.id}><a href={`#${item.id}`} aria-current={item.id === active ? "location" : undefined}>{item.title}</a></li>)}
    </ol>
  </nav>;
}
