"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { company, navigation } from "@/data/home";
import { Brand } from "./brand";
import { LanguageFlags } from "./language-flags";
import { ProjectNavigation } from "./project-navigation";

// Fixed header in the dcons.vn style: logo left, capitalised menu in the middle, languages on the right.
// On the home page it sits transparent over the hero and turns solid once the page scrolls.
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlay = pathname === "/";

  useEffect(() => { setOpen(false); setExpandedMenu(null); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1100px)");
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
  const dropdown = (mobile = false) => {
    const key = mobile ? "mobile-projects" : "desktop-projects";
    return <ProjectNavigation key="/du-an" mobile={mobile}
      expanded={expandedMenu === key && (!mobile || open)}
      onExpandedChange={value => setExpandedMenu(current => value ? key : current === key ? null : current)}
      onNavigate={() => { setOpen(false); setExpandedMenu(null); }} />;
  };
  const solid = !overlay || scrolled || open;

  return (
    <header className="site-header" data-overlay={overlay ? "true" : undefined} data-solid={solid ? "true" : "false"}>
      <div className="navigation">
        <Brand />
        <nav className="desktop-nav" aria-label="Điều hướng chính">{navigation.map(item => item.href === "/du-an" ? dropdown() : <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav>
        <div className="header-actions">
          <LanguageFlags className="header-languages" />
          <button ref={toggleRef} type="button" className="menu-toggle" data-open={open ? "true" : undefined} onClick={() => { setOpen(!open); setExpandedMenu(null); }} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Đóng menu" : "Mở menu"}><span /><span /><span /></button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Điều hướng di động" hidden={!open}>
        <LanguageFlags className="mobile-languages" />
        {navigation.map(item => item.href === "/du-an" ? dropdown(true) : <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
        <a className="mobile-phone" href={company.phoneHref}><Phone size={18} aria-hidden="true" /> Gọi {company.phone}</a>
      </nav>
    </header>
  );
}
