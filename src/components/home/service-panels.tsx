"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import Link from "@/i18n/link";

export type ServicePanel = { slug: string; title: string; lead: string; topics: string[]; image: string };

// Home services as expanding photo panels (≥ 1024 px): one panel is open; hovering (mouse) or pressing another panel's
// title opens it. The panels sit side by side at any screen height. Narrow screens, and the server render before
// JavaScript, show every service as an open card, so nothing is hidden without the enhancement.
export function ServicePanels({ services, learn }: { services: ServicePanel[]; learn: string }) {
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(false);
  const hoverTimer = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(media.matches);
    update();
    media.addEventListener("change", update);
    return () => { media.removeEventListener("change", update); window.clearTimeout(hoverTimer.current); };
  }, []);

  // A short delay so sweeping the pointer across the row does not open every panel on the way.
  const hoverOpen = (index: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(index), 120);
  };

  return <ol className="service-panels" data-panels={wide ? "on" : undefined} onPointerLeave={() => window.clearTimeout(hoverTimer.current)}>
    {services.map((service, index) => {
      const open = !wide || index === active;
      const bodyId = `service-panel-${service.slug}`;
      return <li className="service-panel" key={service.slug} data-active={wide && index === active ? "true" : undefined}
        onPointerEnter={event => { if (wide && event.pointerType === "mouse") hoverOpen(index); }}>
        <article className="service-panel-card" data-reveal="up" aria-labelledby={`${bodyId}-title`}>
          <div className="service-panel-media"><Image src={service.image} alt="" fill sizes="(max-width: 1023px) 92vw, 60vw" /></div>
          <h3 id={`${bodyId}-title`} className="service-panel-title">
            {wide
              ? <button type="button" aria-expanded={index === active} aria-controls={bodyId} onClick={() => setActive(index)}>
                  <span>{service.title}</span><Plus className="service-panel-plus" size={20} aria-hidden="true" />
                </button>
              : service.title}
          </h3>
          <div id={bodyId} className="service-panel-body" inert={!open}>
            <div className="service-panel-inner">
              <p>{service.lead}</p>
              <ul className="service-panel-topics">{service.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
              <Link className="service-panel-link" href={`/dich-vu/${service.slug}`}>{learn}<span className="sr-only">: {service.title}</span></Link>
            </div>
          </div>
        </article>
      </li>;
    })}
  </ol>;
}
