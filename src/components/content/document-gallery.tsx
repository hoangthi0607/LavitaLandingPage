"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Minus, Plus, X, ZoomIn } from "lucide-react";
import type { ProfileDocument } from "@/data/home";

export function DocumentGallery({ title, items, variant = "legal" }: { title: string; items: readonly ProfileDocument[]; variant?: "legal" | "credentials" }) {
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
      {items.map((item, index) => <a className="document-thumbnail" key={item.src} href={item.src} aria-label={`Xem ${item.title}`} aria-haspopup="dialog" onClick={event => open(event, index)}>
        <Image src={item.src} alt={item.title} width={item.width} height={item.height} sizes={variant === "legal" ? "(max-width: 359px) 80vw, (max-width: 760px) 40vw, 20vw" : "(max-width: 760px) 40vw, 25vw"} />
        <span className="document-thumbnail-action"><ZoomIn size={16} aria-hidden="true" /><span>Xem ảnh</span></span>
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
      <div className="document-viewer-header"><div><h2 id={`${id}-title`}>{active?.title ?? title}</h2><p id={`${id}-status`} role="status">{active && `Ảnh ${(selected ?? 0) + 1} / ${items.length} · Hồ sơ năng lực, trang PDF ${active.sourcePage}`}</p></div><button type="button" className="document-viewer-icon" onClick={close} aria-label="Đóng ảnh"><X size={23} aria-hidden="true" /></button></div>
      <div ref={stageRef} className={`document-viewer-stage${zoomed ? " is-zoomed" : ""}`} tabIndex={0} aria-label="Vùng xem tài liệu">
        {active && !imageError && <Image key={active.src} src={active.src} alt={active.title} width={active.width} height={active.height} unoptimized loading="eager" onError={() => setImageError(true)} />}
        {imageError && <p className="document-viewer-error">Không thể tải ảnh tài liệu. Bạn có thể thử mở ảnh gốc bằng liên kết bên dưới.</p>}
      </div>
      <div className="document-viewer-controls"><div className="document-viewer-pages"><button type="button" className="document-viewer-icon" onClick={() => change(-1)} disabled={selected === null || selected === 0} aria-label="Ảnh trước"><ChevronLeft aria-hidden="true" /></button><button type="button" className="document-viewer-icon" onClick={() => change(1)} disabled={selected === null || selected === items.length - 1} aria-label="Ảnh tiếp theo"><ChevronRight aria-hidden="true" /></button></div><button type="button" className="document-viewer-zoom" aria-pressed={zoomed} onClick={() => { setZoomed(value => !value); stageRef.current?.scrollTo(0, 0); }}>{zoomed ? <Minus size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}{zoomed ? "Thu vừa khung" : "Phóng lớn"}</button>{active && <a href={active.src} target="_blank" rel="noopener noreferrer" className="document-viewer-original">Mở ảnh gốc<ExternalLink size={16} aria-hidden="true" /><span className="sr-only">, mở trong tab mới</span></a>}</div>
    </dialog>
  </>;
}
