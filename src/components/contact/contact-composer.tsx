"use client";

import { useState } from "react";
import { ArrowUpRight, Mail, X } from "lucide-react";
import { catalogueHref } from "@/data/products";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import Link from "@/i18n/link";

type ContactComposerProps = {
  initialServiceSlug?: string;
  initialProjectSlug?: string;
  initialProductCategorySlug?: string;
  initialProductSlug?: string;
  data: {
    email: string; phone: string; phoneHref: string;
    services: { slug: string; title: string }[];
    projects: { slug: string; title: string; tag: string }[];
    productCategories: { slug: string; title: string }[];
    products: { slug: string; title: string; sku?: string; categorySlug: string }[];
  };
  labels: Dictionary["composer"] & { or: string; call: string };
};

// The email is written in the visitor's language; Lavita receives it as the visitor sends it.
export function ContactComposer({ initialServiceSlug, initialProjectSlug, initialProductCategorySlug, initialProductSlug, data, labels: l }: ContactComposerProps) {
  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug ?? "");
  const [projectSlug, setProjectSlug] = useState(initialProjectSlug);
  const [productCategorySlug, setProductCategorySlug] = useState(initialProductCategorySlug);
  const [productSlug, setProductSlug] = useState(initialProductSlug);
  const [name, setName] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [needs, setNeeds] = useState("");
  const service = data.services.find(item => item.slug === serviceSlug);
  const project = data.projects.find(item => item.slug === projectSlug);
  const product = data.products.find(item => item.slug === productSlug);
  const productCategory = data.productCategories.find(item => item.slug === (product?.categorySlug ?? productCategorySlug));
  const call = format(l.call, { phone: data.phone });
  const subject = product ? format(l.subjectProduct, { title: product.title }) : productCategory ? format(l.subjectProduct, { title: productCategory.title }) : service ? format(l.subjectService, { title: service.title }) : l.subjectGeneral;
  const body = [
    l.greeting,
    "",
    product ? format(l.aboutProduct, { title: `${product.title}${product.sku ? ` (${product.sku})` : ""}` }) : productCategory ? format(l.aboutCategory, { title: productCategory.title }) : service ? format(l.aboutService, { title: service.title }) : l.aboutGeneral,
    ...(productCategory && service ? [format(l.serviceLine, { title: service.title })] : []),
    ...(project ? [format(l.projectLine, { title: project.title, tag: project.tag })] : []),
    ...(name.trim() ? [format(l.nameLine, { value: name.trim() })] : []),
    ...(workplace.trim() ? [format(l.workplaceLine, { value: workplace.trim() })] : []),
    ...(needs.trim() ? ["", l.needsLine, needs.trim()] : []),
    "",
    l.closing,
    l.signOff,
  ].join("\n");
  const emailHref = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return <section className="contact-composer" aria-labelledby="contact-composer-title">
    <h2 id="contact-composer-title">{l.heading}</h2>
    <p>{productCategory ? l.introProduct : l.introGeneral}</p>
    <noscript>
      <p className="contact-noscript">{l.noscript} <a href={data.phoneHref}>{call}</a> {l.or} <a href={`mailto:${data.email}`}>{l.emailDirect}</a>.</p>
    </noscript>
    {project && <div className="contact-reference">
      <div>
        <span>{l.referenceProject}</span>
        <Link href={`/du-an/${project.slug}`}>{project.title}</Link>
        <p>{project.tag}</p>
      </div>
      <button type="button" className="contact-remove-reference" onClick={() => setProjectSlug(undefined)} aria-label={format(l.removeProject, { title: project.title })}>
        <X size={18} aria-hidden="true" /><span>{l.remove}</span>
      </button>
    </div>}
    {productCategory && <div className="contact-reference">
      <div><span>{product ? l.referenceProduct : l.referenceCategory}</span><Link href={product ? `/san-pham/${product.slug}` : catalogueHref(productCategory.slug)}>{product?.title ?? productCategory.title}</Link>{product && <p>{productCategory.title}</p>}</div>
      <button type="button" className="contact-remove-reference" onClick={() => { setProductSlug(undefined); setProductCategorySlug(undefined); }} aria-label={l.removeProduct}><X size={18} aria-hidden="true" /><span>{l.remove}</span></button>
    </div>}
    <div className="contact-fields">
      <div className="contact-field">
        <label htmlFor="contact-service">{l.serviceLabel}</label>
        <select id="contact-service" value={serviceSlug} onChange={event => setServiceSlug(event.target.value)}>
          <option value="">{l.serviceNone}</option>
          {data.services.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select>
      </div>
      <div className="contact-field-pair">
        <div className="contact-field">
          <label htmlFor="contact-name">{l.nameLabel}</label>
          <input id="contact-name" type="text" autoComplete="name" maxLength={120} value={name} onChange={event => setName(event.target.value)} />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-workplace">{l.workplaceLabel}</label>
          <input id="contact-workplace" type="text" autoComplete="organization" maxLength={180} value={workplace} onChange={event => setWorkplace(event.target.value)} />
        </div>
      </div>
      <div className="contact-field">
        <label htmlFor="contact-needs">{l.needsLabel}</label>
        <textarea id="contact-needs" rows={5} maxLength={1500} aria-describedby="contact-needs-hint" value={needs} onChange={event => setNeeds(event.target.value)} />
        <p id="contact-needs-hint" className="contact-field-hint">{l.needsHint}</p>
      </div>
    </div>
    <details className="contact-email-preview">
      <summary>{l.preview}</summary>
      <p><strong>{l.subjectLabel}</strong> {subject}</p>
      <pre>{body}</pre>
    </details>
    <div className="contact-compose-action">
      <a className="button button-primary" href={emailHref}><Mail size={19} aria-hidden="true" />{l.open}<ArrowUpRight size={18} aria-hidden="true" /></a>
      <p>{format(l.openHint, { email: data.email })}</p>
    </div>
    <p className="contact-email-help">{l.help} <a href={`mailto:${data.email}`}>{data.email}</a> {l.or} <a href={data.phoneHref}>{call}</a>.</p>
  </section>;
}
