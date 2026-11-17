"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Runs `update` on scroll/resize, batched per animation frame.
function useScrollFrame(update: () => void, enabled: () => boolean) {
  const updateRef = useRef(update);
  useEffect(() => { updateRef.current = update; });
  useEffect(() => {
    if (!enabled()) return;
    let frame = 0;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => updateRef.current()); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [enabled]);
}

const always = () => !reducedMotion();

/** Wide photo band whose image drifts slower than the page (dcons.vn parallax). */
export function ParallaxBand({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const bandRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    const band = bandRef.current, image = imageRef.current;
    if (!band || !image) return;
    const rect = band.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    image.style.transform = `translate3d(0, ${((progress - .5) * 24).toFixed(2)}%, 0)`;
  }, always);
  return <div ref={bandRef} className={className}>
    <div ref={imageRef} className="parallax-image"><Image src={src} alt={alt} fill sizes="100vw" /></div>
  </div>;
}

/** Vertical timeline line that grows with scroll progress through its parent. Full length without JS. */
export function TimelineLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    const line = lineRef.current, track = line?.parentElement;
    if (!line || !track) return;
    const rect = track.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * .7 - rect.top) / rect.height));
    line.style.transform = `scaleY(${progress.toFixed(3)})`;
  }, always);
  return <div ref={lineRef} className="timeline-line" aria-hidden="true" />;
}

/** Card that tilts towards the pointer on hover-capable devices. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    const move = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(800px) rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 14).toFixed(2)}deg)`;
    };
    const leave = () => { card.style.transform = ""; };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
  }, []);
  return <div ref={cardRef} className={className}>{children}</div>;
}
