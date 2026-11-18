"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import Link from "@/i18n/link";

const DELAY = 6000;

// Full-width project showcase in the dcons.vn home style: photo background, project facts on the left,
// thumbnails and arrows on the right, a countdown bar on top. Pauses on hover, focus, hidden tab or reduced motion.
// All projects are shown: thumbnails scroll horizontally and follow the active project; full-size backdrops are only
// mounted for the active project, its neighbours and the ones already shown, so the page does not load every photo.
type ShowcaseProject = { slug: string; title: string; location: string; tag: string; scale: string; investor: string; image: string };

export function ProjectShowcase({ projects, labels, pending }: { projects: ShowcaseProject[]; labels: Dictionary["home"]["projects"]; pending: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(false);
  const autoplay = !paused && !reducedMotion && !hidden;
  const project = projects[active];
  const go = (index: number) => setActive((index + projects.length) % projects.length);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(() => new Set([0, 1, projects.length - 1]));

  useEffect(() => {
    setMounted(current => {
      const next = [active, (active + 1) % projects.length, (active - 1 + projects.length) % projects.length];
      return next.every(index => current.has(index)) ? current : new Set([...current, ...next]);
    });
    // Keep the active thumbnail visible inside the strip without scrolling the page.
    const list = thumbsRef.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (!list || !item) return;
    const left = item.offsetLeft, right = left + item.offsetWidth;
    if (left < list.scrollLeft || right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - (list.clientWidth - item.offsetWidth) / 2), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [active, projects.length]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    const visibility = () => setHidden(document.hidden);
    update(); visibility();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % projects.length), DELAY);
    return () => window.clearTimeout(timer);
  }, [autoplay, active, projects.length]);

  return <section id="projects" className="home-projects" aria-labelledby="home-projects-title" aria-roledescription={labels.roleDescription}
    onPointerEnter={event => { if (event.pointerType === "mouse") setPaused(true); }}
    onPointerLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <h2 id="home-projects-title" className="sr-only">{labels.heading}</h2>
    <div className="home-projects-backdrop" aria-hidden="true">
      {projects.map((item, index) => mounted.has(index) && <div key={item.slug} className="home-projects-photo" data-active={index === active ? "true" : undefined}><Image src={item.image} alt="" fill sizes="100vw" /></div>)}
    </div>
    <div className="home-projects-bar" aria-hidden="true"><span key={active} style={{ animationDuration: `${DELAY}ms`, animationPlayState: autoplay ? "running" : "paused" }} /></div>
    <div className="home-projects-inner">
      <div className="home-projects-content" key={project.slug} aria-live={autoplay ? "off" : "polite"}>
        <p className="home-projects-label">{labels.label}</p>
        <h3>{project.title}</h3>
        <dl>
          <div><dt>{labels.location}</dt><dd>{project.location || pending}</dd></div>
          <div><dt>{labels.scope}</dt><dd>{project.tag}</dd></div>
          <div><dt>{labels.scale}</dt><dd>{project.scale || pending}</dd></div>
          <div><dt>{labels.investor}</dt><dd>{project.investor || pending}</dd></div>
        </dl>
        <div className="home-projects-actions">
          <Link className="button button-primary" href={`/du-an/${project.slug}`}>{labels.details}<span className="sr-only">: {project.title}</span></Link>
          <Link className="home-projects-all" href="/du-an">{labels.all}</Link>
        </div>
      </div>
      <div className="home-projects-nav">
        <ul className="home-projects-thumbs" ref={thumbsRef}>
          {projects.map((item, index) => <li key={item.slug}>
            <button type="button" aria-pressed={index === active} aria-label={format(labels.view, { title: item.title })} onClick={() => go(index)}>
              <Image src={item.image} alt="" fill sizes="160px" /><span>{item.title}</span>
            </button>
          </li>)}
        </ul>
        <div className="home-projects-arrows">
          <p className="home-projects-count" aria-hidden="true">{active + 1} / {projects.length}</p>
          <button type="button" onClick={() => go(active - 1)} aria-label={labels.previous}><ChevronLeft size={22} aria-hidden="true" /></button>
          <button type="button" onClick={() => go(active + 1)} aria-label={labels.next}><ChevronRight size={22} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  </section>;
}
