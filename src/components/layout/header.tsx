"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { company, navigation } from "@/data/home";
import { Brand } from "./brand";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const media = window.matchMedia("(min-width: 960px)");
    const onResize = () => { if (media.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onResize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="utility"><span>Giải pháp phòng cháy chữa cháy toàn diện</span><a href={company.phoneHref}><Phone size={13} aria-hidden="true" /> {company.phone}</a></div>
      <div className="navigation">
        <Brand />
        <nav className="desktop-nav" aria-label="Điều hướng chính">{navigation.map(item => item.href === company.profile ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}<span className="nav-file">PDF</span><span className="sr-only">, 67 MB, mở trong tab mới</span></a> : <Link key={item.href} href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}>{item.label}</Link>)}</nav>
        <Link className="header-cta" href="/lien-he">Tư vấn công trình <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <button ref={toggleRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Đóng menu" : "Mở menu"}>{open ? <X /> : <Menu />}</button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Điều hướng di động" hidden={!open}>{navigation.map(item => item.href === company.profile ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{item.label}<span className="nav-file">PDF · 67 MB</span><span className="sr-only">, mở trong tab mới</span></a> : <Link key={item.href} href={item.href} aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}<a className="mobile-phone" href={company.phoneHref}><Phone size={18} aria-hidden="true" /> Gọi {company.phone}</a></nav>
    </header>
  );
}
