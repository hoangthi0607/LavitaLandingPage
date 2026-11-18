"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Quote text with a smooth "read more": the extra paragraphs grow open (grid rows 0fr → 1fr) and the toggle stays
// at the bottom of the quote. Without JavaScript the <noscript> style in Testimonials shows everything.
export function TestimonialText({ paragraphs, more, less }: { paragraphs: readonly string[]; more: string; less: string }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [first, ...rest] = paragraphs;
  useEffect(() => setReady(true), []);

  function toggle() {
    if (open) {
      // Collapsing a long quote can leave the reader below it: bring the quote's top back into view.
      const figure = ref.current?.closest("figure");
      if (figure && figure.getBoundingClientRect().top < 0) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        figure.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
      }
    }
    setOpen(value => !value);
  }

  return <div ref={ref} className="home-testimonial-text">
    <blockquote>
      <p>{first}</p>
      {rest.length > 0 && <div id={id} className="home-testimonial-more" data-open={open ? "true" : undefined} inert={ready && !open}>
        <div>{rest.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </div>}
    </blockquote>
    {rest.length > 0 && <button type="button" className="home-testimonial-toggle" aria-expanded={open} aria-controls={id} onClick={toggle}>
      {open ? less : more}<ChevronDown size={18} aria-hidden="true" />
    </button>}
  </div>;
}
