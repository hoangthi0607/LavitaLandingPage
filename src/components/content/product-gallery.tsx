"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";

type GalleryImage = { src: string; width: number; height: number; title: string };

// Product photos: a large stage that cross-fades between images, a magnifier that follows the pointer on devices that
// hover, previous/next buttons, a counter, thumbnails and a link to the original file. Every image is in the server
// render; without JavaScript the first one shows and the original link still works.
export function ProductGallery({ images, labels, title }: { images: readonly GalleryImage[]; labels: Dictionary["gallery"]; title: string }) {
  const [active, setActive] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const count = images.length;
  const go = (index: number) => { setActive((index + count) % count); setLens(null); };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setLens({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  };

  return <div className="pd-gallery" role="group" aria-label={title} aria-roledescription="carousel">
    <div className="pd-stage" data-zoom={lens ? "true" : undefined} onPointerMove={move} onPointerLeave={() => setLens(null)}
      style={lens ? { "--lens-x": `${lens.x}%`, "--lens-y": `${lens.y}%` } as React.CSSProperties : undefined}>
      {images.map((image, index) => <div className="pd-stage-image" key={image.src} data-active={index === active ? "true" : undefined} aria-hidden={index !== active}>
        <Image src={image.src} alt={image.title} fill sizes="(max-width: 900px) 92vw, 46vw" priority={index === 0} />
      </div>)}
      {count > 1 && <>
        <button type="button" className="pd-stage-arrow pd-stage-prev" onClick={() => go(active - 1)} aria-label={labels.previous}><ChevronLeft size={22} aria-hidden="true" /></button>
        <button type="button" className="pd-stage-arrow pd-stage-next" onClick={() => go(active + 1)} aria-label={labels.next}><ChevronRight size={22} aria-hidden="true" /></button>
        <p className="pd-stage-count" aria-live="polite">{format(labels.status, { index: active + 1, total: count })}</p>
      </>}
    </div>
    <div className="pd-gallery-bar">
      {count > 1 && <ul className="pd-thumbs">
        {images.map((image, index) => <li key={image.src}>
          <button type="button" aria-pressed={index === active} aria-label={format(labels.view, { title: image.title })} onClick={() => go(index)}>
            <Image src={image.src} alt="" fill sizes="96px" />
          </button>
        </li>)}
      </ul>}
      <a className="pd-original" href={images[active].src} target="_blank" rel="noopener"><ExternalLink size={16} aria-hidden="true" />{labels.original}<span className="sr-only">{labels.newTab}</span></a>
    </div>
  </div>;
}
