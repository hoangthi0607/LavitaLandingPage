"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Stacking service cards: each card is sticky (CSS, wide and tall screens only); while the next card slides over it,
// this sets --cover (0 → 1) on the covered card so CSS can shrink and dim it. No effect with reduced motion or
// when the cards are not sticky (mobile, short screens): --cover stays 0.
export function ServiceStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const sticky = !motion.matches && getComputedStyle(cards[0]).position === "sticky";
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        let cover = 0;
        if (sticky && next) {
          const a = card.getBoundingClientRect(), b = next.getBoundingClientRect();
          cover = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
        }
        card.style.setProperty("--cover", cover.toFixed(3));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return <ol ref={ref} className="service-stack">{children}</ol>;
}
