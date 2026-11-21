"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import Link, { useLocalePath } from "@/i18n/link";
import { projectsHref } from "@/data/home";
import { Brand } from "./brand";
import { LanguageFlags } from "./language-flags";
import { ProjectNavigation } from "./project-navigation";

export type HeaderContent = {
  t: { nav: Dictionary["nav"] };
  navigation: { href: string; label: string }[];
  services: { slug: string; title: string }[];
  phone: string;
  phoneHref: string;
  tagline: string;
};

// Fixed header in the dcons.vn style: logo left, capitalised menu in the middle, languages on the right.
// On the home page it sits transparent over the hero and turns solid once the page scrolls.
export function Header({ content }: { content: HeaderContent }) {
  const { nav } = content.t;
  const pathname = useLocalePath();
  const [open, setOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); setExpandedMenu(null); }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1200px)");
    const onResize = () => { setExpandedMenu(null); if (media.matches) setOpen(false); };
    media.addEventListener("change", onResize);
    return () => media.removeEventListener("change", onResize);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        setOpen(false);
        setExpandedMenu(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const dropdown = (label: string, mobile = false) => {
    const key = mobile ? "mobile-projects" : "desktop-projects";
    return <ProjectNavigation key={projectsHref} mobile={mobile} label={label} services={content.services}
      labels={{ open: nav.openProjectCategories, close: nav.closeProjectCategories }}
      expanded={expandedMenu === key && (!mobile || open)}
      onExpandedChange={value => setExpandedMenu(current => value ? key : current === key ? null : current)}
      onNavigate={() => { setOpen(false); setExpandedMenu(null); }} />;
  };
  const brand = { tagline: content.tagline, home: nav.brandHome, logo: nav.brandLogo };

  return (
    <header className="site-header">
      <div className="navigation">
        <Brand labels={brand} />
        <nav className="desktop-nav" aria-label={nav.mainLabel}>{content.navigation.map(item => item.href === projectsHref ? dropdown(item.label) : <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav>
        <div className="header-actions">
          <LanguageFlags className="header-languages" label={nav.languages} />
          <button ref={toggleRef} type="button" className="menu-toggle" data-open={open ? "true" : undefined} onClick={() => { setOpen(!open); setExpandedMenu(null); }} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? nav.closeMenu : nav.openMenu}><span /><span /><span /></button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label={nav.mobileLabel} hidden={!open}>
        <LanguageFlags className="mobile-languages" label={nav.languages} />
        {content.navigation.map(item => item.href === projectsHref ? dropdown(item.label, true) : <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
        <a className="mobile-phone" href={content.phoneHref}><Phone size={18} aria-hidden="true" /> {format(nav.call, { phone: content.phone })}</a>
      </nav>
    </header>
  );
}
