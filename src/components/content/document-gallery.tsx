"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Minus, Plus, X, ZoomIn } from "lucide-react";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import "./document-gallery.css";

type GalleryItem = { src: string; width: number; height: number; title: string };
const thumbnailSizes = {
  legal: "(max-width: 359px) 80vw, (max-width: 760px) 40vw, 20vw",
  credentials: "(max-width: 760px) 40vw, 25vw",
  product: "(max-width: 760px) 25vw, 12vw",
};

// Profile scans and product photos. In the "product" variant the first item is shown large (see catalogue.css).
export function DocumentGallery({ title, items, labels, variant = "legal" }: { title: string; items: readonly GalleryItem[]; labels: Dictionary["gallery"]; variant?: keyof typeof thumbnailSizes }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);
  const id = useId();
  const active = selected === null ? undefined : items[selected];
  const isOpen = selected !== null;

  useEffect(() => {
    if (!isOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [isOpen]);

  function open(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialogRef.current?.showModal) return;
    event.preventDefault();
    openerRef.current = event.currentTarget;
    setSelected(index);
    setZoomed(false);
    setImageError(false);
    dialogRef.current.showModal();
  }

  function change(direction: number) {
    setSelected(current => current === null ? null : Math.max(0, Math.min(items.length - 1, current + direction)));
    setZoomed(false);
    setImageError(false);
    stageRef.current?.scrollTo(0, 0);
  }

  function close() { dialogRef.current?.close(); }

  return <>
    <div className={`document-gallery document-gallery-${variant}`} role="group" aria-label={title}>
      {items.map((item, index) => <a className="document-thumbnail" key={item.src} href={item.src} aria-label={format(labels.view, { title: item.title })} aria-haspopup="dialog" onClick={event => open(event, index)}>
        <Image src={item.src} alt={item.title} width={item.width} height={item.height} sizes={variant === "product" && index === 0 ? "(max-width: 760px) 90vw, 45vw" : thumbnailSizes[variant]} priority={variant === "product" && index === 0} />
        <span className="document-thumbnail-action"><ZoomIn size={16} aria-hidden="true" /><span>{labels.viewImage}</span></span>
      </a>)}
    </div>
    <dialog ref={dialogRef} className="document-viewer" aria-labelledby={`${id}-title`} aria-describedby={`${id}-status`}
      onClose={() => { setSelected(null); setZoomed(false); openerRef.current?.focus({ preventScroll: true }); }}
      onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(); } }}
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          change(event.key === "ArrowRight" ? 1 : -1);
        }
        if (event.key === "Tab" && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), [tabindex="0"]');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
      <div className="document-viewer-header"><div><h2 id={`${id}-title`}>{active?.title ?? title}</h2><p id={`${id}-status`} role="status">{active && format(labels.status, { index: (selected ?? 0) + 1, total: items.length })}</p></div><button type="button" className="document-viewer-icon" onClick={close} aria-label={labels.close}><X size={23} aria-hidden="true" /></button></div>
      <div ref={stageRef} className={`document-viewer-stage${zoomed ? " is-zoomed" : ""}`} tabIndex={0} aria-label={labels.stage}>
        {active && !imageError && <Image key={active.src} src={active.src} alt={active.title} width={active.width} height={active.height} unoptimized loading="eager" onError={() => setImageError(true)} />}
        {imageError && <p className="document-viewer-error">{labels.error}</p>}
      </div>
      <div className="document-viewer-controls"><div className="document-viewer-pages"><button type="button" className="document-viewer-icon" onClick={() => change(-1)} disabled={selected === null || selected === 0} aria-label={labels.previous}><ChevronLeft aria-hidden="true" /></button><button type="button" className="document-viewer-icon" onClick={() => change(1)} disabled={selected === null || selected === items.length - 1} aria-label={labels.next}><ChevronRight aria-hidden="true" /></button></div><button type="button" className="document-viewer-zoom" aria-pressed={zoomed} onClick={() => { setZoomed(value => !value); stageRef.current?.scrollTo(0, 0); }}>{zoomed ? <Minus size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}{zoomed ? labels.zoomOut : labels.zoomIn}</button>{active && <a href={active.src} target="_blank" rel="noopener noreferrer" className="document-viewer-original">{labels.original}<ExternalLink size={16} aria-hidden="true" /><span className="sr-only">{labels.newTab}</span></a>}</div>
    </dialog>
  </>;
}
