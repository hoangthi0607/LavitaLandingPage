"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { company, navigation } from "@/data/home";
import { Brand } from "./brand";
import { LanguageFlags } from "./language-flags";
import { ProjectNavigation } from "./project-navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); setExpandedMenu(null); }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 960px)");
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
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  const dropdown = (mobile = false) => {
    const key = mobile ? "mobile-projects" : "desktop-projects";
    return <ProjectNavigation key="/du-an" mobile={mobile}
      expanded={expandedMenu === key && (!mobile || open)}
      onExpandedChange={value => setExpandedMenu(current => value ? key : current === key ? null : current)}
      onNavigate={() => { setOpen(false); setExpandedMenu(null); }} />;
  };
  return (
    <header className="site-header">
      <div className="utility"><span>Giải pháp phòng cháy chữa cháy toàn diện</span><div className="utility-actions"><LanguageFlags className="utility-languages" /><a href={company.phoneHref}><Phone size={13} aria-hidden="true" /> {company.phone}</a></div></div>
      <div className="navigation">
        <Brand />
        <nav className="desktop-nav" aria-label="Điều hướng chính">{navigation.map(item => item.href === "/du-an" ? dropdown() : <Link key={item.href} href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}>{item.label}</Link>)}</nav>
        <LanguageFlags className="header-languages" />
        <button ref={toggleRef} className="menu-toggle" onClick={() => { setOpen(!open); setExpandedMenu(null); }} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Đóng menu" : "Mở menu"}>{open ? <X /> : <Menu />}</button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Điều hướng di động" hidden={!open}>{navigation.map(item => item.href === "/du-an" ? dropdown(true) : <Link key={item.href} href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}<a className="mobile-phone" href={company.phoneHref}><Phone size={18} aria-hidden="true" /> Gọi {company.phone}</a></nav>
    </header>
  );
}
