"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import Link from "@/i18n/link";
import "swiper/css";
import "swiper/css/effect-fade";

// Full-height carousel in the dcons.vn home style: centred heading, large side chevrons, pill dots.
// The H1 and actions stay outside the slides so they are always present.
type Slide = { href: string; image: string; title: string; description: string; alt: string };

export function Hero({ heading, slides, labels }: { heading: string; slides: Slide[]; labels: Dictionary["home"]["hero"] & { findService: string } }) {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const shouldAutoplay = !reducedMotion && !focused && !hovered;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (shouldAutoplay) swiper.autoplay.start();
    else swiper.autoplay.stop();
    return () => { if (!swiper.destroyed) swiper.autoplay.stop(); };
  }, [swiper, shouldAutoplay]);

  const slide = slides[active];
  return (
    <section className="hero" aria-labelledby="hero-title" aria-roledescription={labels.roleDescription}
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <Swiper modules={[A11y, Autoplay, EffectFade]} effect="fade" fadeEffect={{ crossFade: true }} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={reducedMotion ? 0 : 1000} loop a11y={{ slideLabelMessage: labels.slideLabel, itemRoleDescriptionMessage: "slide" }} onSwiper={setSwiper} onSlideChange={instance => setActive(instance.realIndex)}>
        {slides.map((item, index) => (
          <SwiperSlide key={item.title}>
            <div className={`hero-slide hero-slide-${index}`} inert={index !== active}>
              <Image className="hero-image" src={item.image} alt={item.alt} fill priority={index === 0} sizes="100vw" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-content">
        <h1 id="hero-title">{heading}</h1>
        <p className="hero-tagline" aria-live={shouldAutoplay ? "off" : "polite"}>{slide.title.replace("\n", " ")}</p>
        <p className="hero-description">{slide.description}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/dich-vu">{labels.findService}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link className="hero-secondary" href={slide.href === "/dich-vu" ? "/du-an" : slide.href}>{slide.href === "/dich-vu" ? labels.seeProjects : labels.learnService}</Link>
        </div>
      </div>
      <button type="button" className="hero-arrow hero-arrow-prev" onClick={() => swiper?.slidePrev()} aria-label={labels.previous}><ChevronLeft size={44} strokeWidth={1.75} aria-hidden="true" /></button>
      <button type="button" className="hero-arrow hero-arrow-next" onClick={() => swiper?.slideNext()} aria-label={labels.next}><ChevronRight size={44} strokeWidth={1.75} aria-hidden="true" /></button>
      <div className="hero-dots" role="group" aria-label={labels.dots}>
        {slides.map((item, index) => <button type="button" key={item.title} aria-label={format(labels.dot, { index: index + 1, title: item.title.replace("\n", " ") })} aria-current={index === active ? "true" : undefined} onClick={() => swiper?.slideToLoop(index)} />)}
      </div>
    </section>
  );
}
