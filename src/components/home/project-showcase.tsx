"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projectPortfolio, projects } from "@/data/home";

const DELAY = 6000;

// Full-width project showcase in the dcons.vn home style: photo background, project facts on the left,
// thumbnails and arrows on the right, a countdown bar on top. Pauses on hover, focus, hidden tab or reduced motion.
export function ProjectShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(false);
  const autoplay = !paused && !reducedMotion && !hidden;
  const project = projects[active];
  const go = (index: number) => setActive((index + projects.length) % projects.length);

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
  }, [autoplay, active]);

  return <section id="projects" className="home-projects" aria-labelledby="home-projects-title" aria-roledescription="băng chuyền"
    onPointerEnter={event => { if (event.pointerType === "mouse") setPaused(true); }}
    onPointerLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <h2 id="home-projects-title" className="sr-only">Dự án tiêu biểu</h2>
    <div className="home-projects-backdrop" aria-hidden="true">
      {projects.map((item, index) => <div key={item.slug} className="home-projects-photo" data-active={index === active ? "true" : undefined}><Image src={item.image} alt="" fill sizes="100vw" /></div>)}
    </div>
    <div className="home-projects-bar" aria-hidden="true"><span key={active} style={{ animationDuration: `${DELAY}ms`, animationPlayState: autoplay ? "running" : "paused" }} /></div>
    <div className="home-projects-inner">
      <div className="home-projects-content" key={project.slug} aria-live={autoplay ? "off" : "polite"}>
        <p className="home-projects-label">Dự án</p>
        <h3>{project.title}</h3>
        <dl>
          <div><dt>Vị trí</dt><dd>{project.location}</dd></div>
          <div><dt>Hạng mục PCCC</dt><dd>{project.tag}</dd></div>
          <div><dt>Quy mô</dt><dd>{project.scale || projectPortfolio.pendingLabel}</dd></div>
          <div><dt>Chủ đầu tư</dt><dd>{project.investor || projectPortfolio.pendingLabel}</dd></div>
        </dl>
        <div className="home-projects-actions">
          <Link className="button button-primary" href={`/du-an/${project.slug}`}>Xem chi tiết<span className="sr-only">: {project.title}</span></Link>
          <Link className="home-projects-all" href="/du-an">Tất cả dự án</Link>
        </div>
      </div>
      <div className="home-projects-nav">
        <ul className="home-projects-thumbs">
          {projects.map((item, index) => <li key={item.slug}>
            <button type="button" aria-pressed={index === active} aria-label={`Xem dự án ${item.title}`} onClick={() => go(index)}>
              <Image src={item.image} alt="" fill sizes="160px" /><span>{item.title}</span>
            </button>
          </li>)}
        </ul>
        <div className="home-projects-arrows">
          <button type="button" onClick={() => go(active - 1)} aria-label="Dự án trước"><ChevronLeft size={22} aria-hidden="true" /></button>
          <button type="button" onClick={() => go(active + 1)} aria-label="Dự án tiếp theo"><ChevronRight size={22} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  </section>;
}
