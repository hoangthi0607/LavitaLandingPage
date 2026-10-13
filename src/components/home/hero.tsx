"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { site, slides } from "@/data/home";
import "swiper/css";

export function Hero() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const swiperRef = useRef<SwiperInstance | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title" aria-roledescription="băng chuyền">
      <Swiper modules={[A11y]} speed={reducedMotion ? 0 : 450} loop a11y={{ slideLabelMessage: "Giải pháp {{index}} trên {{slidesLength}}", itemRoleDescriptionMessage: "slide" }} onSwiper={swiper => { swiperRef.current = swiper; }} onSlideChange={swiper => setActive(swiper.realIndex)} onSlideChangeTransitionStart={() => setTransitioning(true)} onSlideChangeTransitionEnd={() => setTransitioning(false)}>
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
          <a className="button button-primary" href="#contact">Tư vấn cho công trình <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a className="hero-secondary" href={slides[active].href}>Khám phá giải pháp <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="hero-bottom">
        <p>{slides[active].title.replace("\n", " ")}<span>Thiết kế. Thi công. Bảo trì.</span></p>
        <div className="hero-controls">
          <span className="slide-count" aria-live="polite" aria-atomic="true"><span className="sr-only">Slide </span>{String(active + 1).padStart(2, "0")}<span> / {String(slides.length).padStart(2, "0")}</span></span>
          <button type="button" disabled={transitioning} onClick={() => swiperRef.current?.slidePrev()} aria-label="Giải pháp trước"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" disabled={transitioning} onClick={() => swiperRef.current?.slideNext()} aria-label="Giải pháp tiếp theo"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
