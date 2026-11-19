"use client";

import { useEffect, useRef, useState } from "react";

// Sticky need-group bar on /dich-vu: a pill slides to the group being read (scroll spy). Plain anchor links without JS.
export function ServiceGroupNav({ groups, label }: { groups: { id: string; title: string }[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const sections = groups.map(group => document.getElementById(`group-${group.id}`)?.closest("section")).filter((section): section is HTMLElement => Boolean(section));
    // The group crossing the line 40% down the viewport is the one being read.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.querySelector("h2")?.id.replace(/^group-/, "") ?? null);
    }, { rootMargin: "-40% 0px -59% 0px" });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [groups]);

  useEffect(() => {
    const place = () => {
      const link = listRef.current?.querySelector<HTMLAnchorElement>(`a[href="#group-${active}"]`);
      if (!link) { setIndicator(null); return; }
      setIndicator({ left: link.offsetLeft, width: link.offsetWidth });
      const list = listRef.current!;
      // Keep the current group visible when the bar scrolls sideways on small screens.
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: link.offsetLeft - 16, behavior: "smooth" });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return <nav className="svc-groupnav" aria-label={label}>
    <ul ref={listRef}>
      {indicator && <li className="svc-groupnav-indicator" aria-hidden="true" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />}
      {groups.map(group => <li key={group.id}><a href={`#group-${group.id}`} aria-current={active === group.id ? "true" : undefined}>{group.title}</a></li>)}
    </ul>
  </nav>;
}
