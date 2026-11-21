import Image from "next/image";
import Link from "@/i18n/link";

export type ServicePanel = { slug: string; title: string; lead: string; topics: string[]; image: string };

// Home services as open white cards (21/11/2026, large-print home page): photo on top, then the title, the lead, the
// topics and a link to the service page. Everything is visible at once in dark text on white; nothing expands,
// overlays a photo or depends on hovering, which older readers found hard to follow in the dark expanding panels.
export function ServicePanels({ services, learn }: { services: ServicePanel[]; learn: string }) {
  return <ol className="service-panels">
    {services.map(service => {
      const titleId = `service-panel-${service.slug}-title`;
      return <li className="service-panel" key={service.slug}>
        <article className="service-panel-card" data-reveal="up" aria-labelledby={titleId}>
          <div className="service-panel-media"><Image src={service.image} alt="" fill sizes="(max-width: 760px) 92vw, 46vw" /></div>
          <h3 id={titleId} className="service-panel-title">{service.title}</h3>
          <div className="service-panel-body">
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
