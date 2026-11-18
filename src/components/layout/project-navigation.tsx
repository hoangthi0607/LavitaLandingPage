"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { projectCategoryHref, projectsHref } from "@/data/home";
import Link, { useLocalePath } from "@/i18n/link";

export function ProjectNavigation({ mobile = false, label, services, labels, expanded, onExpandedChange, onNavigate }: {
  mobile?: boolean;
  label: string;
  services: { slug: string; title: string }[];
  labels: { open: string; close: string };
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onNavigate: () => void;
}) {
  const pathname = useLocalePath();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = `${mobile ? "mobile" : "desktop"}-project-categories`;

  useEffect(() => {
    if (!expanded) return;
    const values = new URLSearchParams(window.location.search).getAll("dich-vu");
    setSelectedCategory(values.length === 1 ? services.find(service => service.slug === values[0])?.slug : undefined);
  }, [expanded, services]);

  useEffect(() => {
    if (!expanded) return;
    const closeOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) onExpandedChange(false);
    };
    const closeOnHistory = () => onNavigate();
    document.addEventListener("click", closeOutside);
    window.addEventListener("popstate", closeOnHistory);
    return () => {
      document.removeEventListener("click", closeOutside);
      window.removeEventListener("popstate", closeOnHistory);
    };
  }, [expanded, onExpandedChange, onNavigate]);

  const navigate = () => {
    onExpandedChange(false);
    onNavigate();
  };

  return <div className="nav-dropdown" ref={rootRef} data-section="projects" data-expanded={expanded}
    data-active={pathname === projectsHref || pathname.startsWith(`${projectsHref}/`) || undefined}
    onPointerEnter={event => { if (!mobile && event.pointerType === "mouse") onExpandedChange(true); }}
    onPointerLeave={event => {
      if (!mobile && event.pointerType === "mouse" && !rootRef.current?.contains(document.activeElement)) onExpandedChange(false);
    }}
    onBlurCapture={event => { if (!mobile && !event.currentTarget.contains(event.relatedTarget)) onExpandedChange(false); }}
    onKeyDown={event => {
      if (event.key !== "Escape" || !expanded) return;
      event.preventDefault();
      event.stopPropagation();
      onExpandedChange(false);
      toggleRef.current?.focus();
    }}>
    <div className="nav-dropdown-heading">
      <Link className="nav-dropdown-link" href={projectsHref} onClick={navigate}
        aria-current={pathname === projectsHref ? "page" : undefined}
        data-active={pathname.startsWith(`${projectsHref}/`) || undefined}>{label}</Link>
      <button className="nav-dropdown-toggle" type="button" ref={toggleRef}
        aria-expanded={expanded} aria-controls={panelId}
        aria-label={expanded ? labels.close : labels.open}
        onClick={() => onExpandedChange(!expanded)}><ChevronDown size={16} aria-hidden="true" /></button>
    </div>
    <ul className="nav-dropdown-panel" id={panelId} hidden={!expanded}>
      {services.map(service => <li key={service.slug}>
        <Link href={projectCategoryHref(service.slug)} onClick={navigate}
          aria-current={pathname === projectsHref && selectedCategory === service.slug ? "page" : undefined}>{service.title}</Link>
      </li>)}
    </ul>
  </div>;
}
