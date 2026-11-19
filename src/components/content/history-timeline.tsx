"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type HistoryItem = { period: string; title: string; text: string; pending?: boolean };

const pinQuery = "(min-width: 768px) and (min-height: 480px) and (prefers-reduced-motion: no-preference)";

// "Lịch sử phát triển" pinned while scrolling (wide, tall screens, motion allowed): the stage stays in view and each
// period fades out as the next fades in, in place; a rail of periods shows progress and jumps to a period. Elsewhere,
// and before JavaScript runs, the periods are a plain list, so nothing is hidden.
export function HistoryTimeline({ heading, headingId, items, pendingLabel, mediaLabel }: { heading: string; headingId: string; items: readonly HistoryItem[]; pendingLabel: string; mediaLabel: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const count = items.length;

  useEffect(() => {
    const media = window.matchMedia(pinQuery);
    const update = () => setPinned(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Scroll position within the track → overall progress and the period shown.
  const measure = () => {
    const track = trackRef.current;
    if (!track) return null;
    const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    const rect = track.getBoundingClientRect();
    const travel = rect.height - (window.innerHeight - header);
    return { header, rect, travel };
  };

  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const m = measure();
      if (!m || m.travel <= 0) return;
      const value = Math.min(1, Math.max(0, (m.header - m.rect.top) / m.travel));
      setProgress(value);
      setActive(Math.min(count - 1, Math.floor(value * count)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [pinned, count]);

  const jump = (index: number) => {
    const m = measure();
    if (!m) return;
    const top = window.scrollY + m.rect.top - m.header + m.travel * ((index + .5) / count);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return <div ref={trackRef} className="history" data-pinned={pinned ? "on" : undefined} style={{ "--count": count, "--progress": progress } as CSSProperties}>
    <div className="history-stage">
      <h2 id={headingId} className="about-section-title about-section-title-center history-heading">{heading}</h2>
      <div className="history-body">
      {pinned && <div className="history-rail">
        <span className="history-rail-fill" aria-hidden="true" />
        <ol>
        {items.map((item, index) => <li key={item.period}>
          <button type="button" aria-current={index === active ? "step" : undefined} onClick={() => jump(index)}>
            <span className="history-rail-dot" aria-hidden="true" />{item.period}
          </button>
        </li>)}
        </ol>
      </div>}
      <ol className="history-panels">
        {items.map((item, index) => {
          const state = !pinned ? undefined : index === active ? "active" : index < active ? "before" : "after";
          return <li key={item.period} className={`history-panel${item.pending ? " is-pending" : ""}`} data-state={state} aria-hidden={pinned && index !== active ? true : undefined}>
            <div className="history-panel-copy">
              <p className="history-period">{item.period}</p>
              <h3>{item.pending ? <span className="about-pending">{pendingLabel}</span> : item.title}</h3>
              <p>{item.text}</p>
            </div>
            <div className="history-media"><span>{mediaLabel}</span></div>
          </li>;
        })}
      </ol>
      </div>
    </div>
  </div>;
}
