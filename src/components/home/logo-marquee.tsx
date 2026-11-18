"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import Image from "next/image";
import type { ClientLogo } from "@/data/home";

const SPEED = 40; // px per second, right to left

// Full-width client logo band in the hades.vn marquee style: one row, constant linear drift from right to left in a
// seamless loop, dots between logos. Drag (mouse or touch) moves it left or right. Pauses on hover/focus and when
// the tab is hidden; never moves on its own with prefers-reduced-motion. Without logos it shows "pending" tiles.
export function LogoMarquee({ logos, pendingLabel, label }: { logos: readonly ClientLogo[]; pendingLabel: string; label: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const hover = useRef(false);
  const drag = useRef<{ x: number; offset: number; moved: boolean } | null>(null);
  const offset = useRef(0);
  const groupWidth = useRef(0);

  // Enough copies of the group to cover the viewport while one copy scrolls out.
  useEffect(() => {
    const viewport = viewportRef.current, group = trackRef.current?.firstElementChild as HTMLElement | null;
    if (!viewport || !group) return;
    const measure = () => {
      groupWidth.current = group.offsetWidth;
      if (groupWidth.current > 0) setCopies(Math.max(2, Math.ceil(viewport.clientWidth / groupWidth.current) + 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const width = groupWidth.current;
      if (!drag.current && !hover.current && !media.matches && !document.hidden) offset.current += SPEED * dt;
      if (width > 0) offset.current = ((offset.current % width) + width) % width;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, offset: offset.current, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    offset.current = drag.current.offset - dx;
  }
  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.current?.moved) event.currentTarget.dataset.justDragged = "true";
    drag.current = null;
  }
  // A drag that ends on a logo link must not open it.
  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (event.currentTarget.dataset.justDragged) { event.preventDefault(); event.stopPropagation(); }
    delete event.currentTarget.dataset.justDragged;
  }

  const pending = logos.length === 0;
  const items = pending
    ? Array.from({ length: 8 }, (_, index) => <li key={index} className="is-pending">{pendingLabel}</li>)
    : logos.map(item => {
      const logo = <Image src={item.logo} alt={item.name} width={item.width} height={item.height} sizes="200px" loading="eager" draggable={false} />;
      return <li key={item.name}>{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">{logo}</a> : logo}</li>;
    });

  return <div ref={viewportRef} className="home-clients-marquee"
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onClickCapture={onClickCapture}
    onPointerEnter={event => { if (event.pointerType === "mouse") hover.current = true; }}
    onPointerLeave={() => { hover.current = false; }}
    onFocusCapture={() => { hover.current = true; }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) hover.current = false; }}>
    <div ref={trackRef} className="home-clients-track">
      {Array.from({ length: copies }, (_, copy) => <ul key={copy} className="home-clients-group"
        aria-label={copy === 0 && !pending ? label : undefined} aria-hidden={copy > 0 || pending ? true : undefined} inert={copy > 0 || undefined}>{items}</ul>)}
    </div>
  </div>;
}
