"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { site, slides } from "@/data/home";
import "swiper/css";

export function Hero() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
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

  return (
    <section className="hero" aria-labelledby="hero-title" aria-roledescription="băng chuyền"
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <Swiper modules={[A11y, Autoplay]} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={reducedMotion ? 0 : 450} loop a11y={{ slideLabelMessage: "Giải pháp {{index}} trên {{slidesLength}}", itemRoleDescriptionMessage: "slide" }} onSwiper={setSwiper} onSlideChange={swiper => setActive(swiper.realIndex)} onSlideChangeTransitionStart={() => setTransitioning(true)} onSlideChangeTransitionEnd={() => setTransitioning(false)}>
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className={`hero-slide hero-slide-${index}`} inert={index !== active}>
              <Image className="hero-image" src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="100vw" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-content">
        <h1 id="hero-title">{site.heroHeading}</h1>
        <p>{slides[active].description}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/dich-vu">Tìm dịch vụ phù hợp <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link className="hero-secondary" href={slides[active].href === "/dich-vu" ? "/du-an" : slides[active].href}>{slides[active].href === "/dich-vu" ? "Xem dự án PCCC" : "Tìm hiểu dịch vụ"} <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="hero-bottom">
        <p>{slides[active].title.replace("\n", " ")}<span>Thiết kế. Thi công. Bảo trì.</span></p>
        <div className="hero-controls">
          <span className="slide-count" aria-live={shouldAutoplay ? "off" : "polite"} aria-atomic="true"><span className="sr-only">Slide </span>{String(active + 1).padStart(2, "0")}<span> / {String(slides.length).padStart(2, "0")}</span></span>
          <button type="button" aria-disabled={transitioning} onClick={() => { if (!transitioning) swiper?.slidePrev(); }} aria-label="Giải pháp trước"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-disabled={transitioning} onClick={() => { if (!transitioning) swiper?.slideNext(); }} aria-label="Giải pháp tiếp theo"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
