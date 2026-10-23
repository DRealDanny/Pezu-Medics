"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useSearch } from "@/context/SearchContext";
import styles from "./HeroSection.module.css";

/* ── ─────────────────────────────────────────────── ──
   HERO SLIDES
   Replace these placeholder URLs with your own landscape
   photos at any time — the slideshow mechanics are wired
   to the array index, so no other code needs changing.
   ── ─────────────────────────────────────────────── ── */
const HERO_SLIDES = [
  {
    id: 1,
    src: "/images/hero/hero_01.webp",
    alt: "Pezu Standard Medics Concern - Certified Medical Supplies & Equipment",
    caption: "Certified Medical Suppliers",
  },
  {
    id: 2,
    src: "/images/hero/hero_02.webp",
    alt: "Medical and surgical consumables, syringes, gloves, and theatre instruments",
    caption: "Medical & Surgical Disposable",
  },
  {
    id: 3,
    src: "/images/hero/hero_03.webp",
    alt: "Advanced laboratory testing and diagnostic equipment",
    caption: "Laboratory Products",
  },
  {
    id: 4,
    src: "/images/hero/hero_04.webp",
    alt: "Operating theatre and clinical monitoring equipment",
    caption: "Medical Equipment",
  },
];

const SLIDE_DURATION = 4500; // ms per slide

export default function HeroSection() {
  const { searchQuery } = useSearch();
  const hasQuery = Boolean(searchQuery && searchQuery.trim().length > 0);

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("next");
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0); // force re-mount of progress bar animation

  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const totalSlides = HERO_SLIDES.length;

  /* ── Advance to next slide ── */
  const goTo = useCallback(
    (index) => {
      if (index === current) return;
      const clamped = ((index % totalSlides) + totalSlides) % totalSlides;
      setDirection(index >= current ? "next" : "prev");
      setPrev(current);
      setCurrent(clamped);
      setProgressKey((k) => k + 1);
    },
    [current, totalSlides]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* ── Auto-advance timer ── */
  useEffect(() => {
    if (isPaused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [isPaused, goNext]);

  /* ── Clear prev slide after transition completes ── */
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(t);
  }, [prev]);

  /* ── When a search keyword is entered anywhere in navigation/header, hide hero ── */
  if (hasQuery) {
    return null;
  }

  /* ── Touch / swipe support ── */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only act on primarily horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  /* ── Smooth scroll CTA ── */
  const handleScrollToCatalog = (e) => {
    e.preventDefault();
    const target = document.getElementById("our-product-price");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className={styles.hero} aria-label="Hero section">
      <div className="container">
        <div className={styles.heroGrid}>
          {/* ── Centered Editorial Block ── */}
          <div className={styles.editorial}>
            {/* H1 Heading */}
            <h1 className={styles.heading}>
              <span className={styles.headingText}>
                Certified Medical Equipment, Laboratory Products &amp;{" "}
              </span>
              <span className={styles.headingAccent}>
                Surgical Consumables/<wbr />Disposables
              </span>
            </h1>

            {/* Subheading */}
            <p className={styles.subheading}>
              <span className={styles.subText}>
                Equipping hospitals, diagnostic centers, and clinics with verified
                surgical instruments, rapid diagnostics, and essential medical
                supplies, ready for fast dispatch.
              </span>
            </p>

            {/* CTA Row */}
            <div className={styles.ctaRow}>
              <div className={styles.ctaRowInner}>
                <a
                  href="#our-product-price"
                  className={styles.ctaPrimary}
                  onClick={handleScrollToCatalog}
                  aria-label="Explore our product prices — scroll to catalog"
                >
                  <span>Explore Our Product Prices</span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Wide Rectangular Slideshow ── */}
          <div className={styles.slideshowOuter}>
        <div
          className={styles.slideshowFrame}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Medical equipment slideshow"
          role="region"
        >
          <div className={styles.slideTrack}>
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === current;
              const isExiting = idx === prev;
              if (!isActive && !isExiting) return null;

              const isAnimating = prev !== null;
              let slideClasses = styles.slide;
              if (isActive) {
                slideClasses += ` ${styles.active}`;
                if (isAnimating) {
                  slideClasses +=
                    direction === "prev"
                      ? ` ${styles.coverInFromLeft}`
                      : ` ${styles.coverInFromRight}`;
                }
              } else if (isExiting) {
                slideClasses += ` ${styles.exiting}`;
              }

              return (
                <div
                  key={slide.id}
                  className={slideClasses}
                  aria-hidden={!isActive}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className={styles.slideImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1160px"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    quality={82}
                  />
                  <div className={styles.slideOverlay} aria-hidden="true" />
                  <div
                    className={styles.captionBadge}
                    aria-label={slide.caption}
                  >
                    {slide.number && (
                      <span className={styles.captionNumber}>
                        {slide.number}
                      </span>
                    )}
                    <span>{slide.caption}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bars */}
          <div
            className={styles.progressBars}
            role="tablist"
            aria-label="Slide navigation"
          >
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === current}
                aria-label={`Go to slide ${idx + 1}: ${slide.caption}`}
                className={`${styles.progressBar}${
                  idx < current ? ` ${styles.done}` : ""
                }${idx === current ? ` ${styles.active}` : ""}`}
                style={{ "--progress-duration": `${SLIDE_DURATION}ms` }}
                onClick={() => goTo(idx)}
              >
                <span
                  key={`${idx}-${progressKey}`}
                  className={styles.progressBarFill}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
