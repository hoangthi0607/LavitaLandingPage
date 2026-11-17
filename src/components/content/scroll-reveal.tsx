"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./scroll-reveal.css";

// Legacy targets reveal upward. Any element can opt in with data-reveal="up|down|left|right|scale|fade".
const revealTargets = [
  "[data-reveal]",
  ".services-intro > *",
  ".service-list > .service-row",
  ".section-heading > *",
  ".project-grid > .project-card",
  ".about-photo",
  ".about-copy > *",
  ".capabilities > div > *",
  ".values-list > li",
  ".content-next > div > *",
  ".content-next > .button",
  ".contact > div > *",
  ".contact address > *",
  ".profile-company-photo",
  ".profile-company-copy > *",
  ".profile-legal > h2",
  ".profile-legal-groups > .profile-legal-album",
  "#chuyen-mon > h2",
  ".profile-credentials-layout > *",
  ".profile-organization > h2, .profile-organization > h3",
  ".profile-management",
  ".profile-organization-tree > ul > li",
  ".profile-project-layout > .profile-project-chapter",
  ".profile-contact > div > *",
].join(", ");

export function ScrollReveal({ children, className = "scroll-reveal-scope" }: { children: ReactNode; className?: string }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const scope = scopeRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!scope || motion.matches || !("IntersectionObserver" in window)) return;

    const elements = Array.from(scope.querySelectorAll<HTMLElement>(revealTargets))
      // Skip children of an element that already reveals, so a group moves as one.
      .filter((element, _, all) => !all.some(other => other !== element && other.contains(element) && other.hasAttribute("data-reveal")));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-scroll-reveal", "visible");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -64px 0px", threshold: 0 });

    // Enhance only content below the fold; server-rendered content stays visible
    // without JavaScript, and the initial viewport never flashes or disappears.
    for (const element of elements) {
      if (element.getBoundingClientRect().top < window.innerHeight - 64) continue;
      const siblings = Array.from(element.parentElement?.children ?? []);
      const order = Math.min(siblings.indexOf(element), 3);
      element.style.setProperty("--reveal-delay", `${order * 90}ms`);
      element.setAttribute("data-scroll-reveal", "pending");
      observer.observe(element);
    }

    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("[data-scroll-reveal]");
      if (!element || !scope.contains(element)) return;
      element.setAttribute("data-scroll-reveal", "visible");
      observer.unobserve(element);
    };
    const reset = () => {
      observer.disconnect();
      for (const element of elements) {
        element.removeAttribute("data-scroll-reveal");
        element.style.removeProperty("--reveal-delay");
      }
    };
    const onMotionChange = () => { if (motion.matches) reset(); };
    // Elements in the last strip of the page can never cross the observer margin; reveal them at the end of the page.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
      for (const element of scope.querySelectorAll<HTMLElement>("[data-scroll-reveal=pending]")) {
        if (element.getBoundingClientRect().top < window.innerHeight) { element.setAttribute("data-scroll-reveal", "visible"); observer.unobserve(element); }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    scope.addEventListener("focusin", revealFocused);
    motion.addEventListener("change", onMotionChange);
    return () => {
      reset();
      scope.removeEventListener("focusin", revealFocused);
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", onMotionChange);
    };
  }, [pathname]);

  return <div className={className} ref={scopeRef}>{children}</div>;
}
