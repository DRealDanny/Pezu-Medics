"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if the user prefers reduced motion
 */
export function isReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animate the Product Catalog Header (Toolbar and Category Filter Slider bar)
 * Smooth, unified glide with zero layout recalculation or scroll observer stutter.
 * @param {Object} options
 * @param {Element} options.toolbar
 * @param {Element} options.sliderWrapper
 * @param {boolean} options.isInitialLoad
 * @returns {Function} cleanup function
 */
export function animateCatalogHeader({ toolbar, sliderWrapper, isInitialLoad = false }) {
  if (typeof window === "undefined" || isReducedMotion()) return () => {};

  const targets = [toolbar, sliderWrapper].filter(Boolean);
  if (targets.length === 0) return () => {};

  const ctx = gsap.context(() => {
    // If on initial page load, time it smoothly right as the curtain reveals (0.70s)
    // If user scrolled to the section later, triggers immediately
    const loadDelay = isInitialLoad ? 0.70 : 0;

    gsap.fromTo(
      targets,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.60,
        stagger: 0.10,
        delay: loadDelay,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: toolbar || sliderWrapper,
          start: isInitialLoad ? "top 96%" : "top 86%",
          once: true,
        },
      }
    );
  });

  return () => ctx.revert();
}

/**
 * Animate Product Cards batch on scroll and on filter change
 * @param {Array<Element>} cards
 * @param {Object} options
 * @returns {Function} cleanup function
 */
export function animateProductCards(cards, options = {}) {
  if (typeof window === "undefined" || !cards || cards.length === 0 || isReducedMotion()) return () => {};

  const { isInitialLoad = false } = options;

  const ctx = gsap.context(() => {
    const loadDelay = isInitialLoad ? 0.88 : 0;

    ScrollTrigger.batch(cards, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.05,
            delay: loadDelay,
            ease: "power2.out",
            clearProps: "transform",
            overwrite: "auto",
          }
        );
      },
    });
  });

  return () => ctx.revert();
}

/**
 * Animate Footer card and columns when scrolled into view
 * @param {Element} footerCard
 * @returns {Function} cleanup function
 */
export function animateFooterScrollReveal(footerCard) {
  if (typeof window === "undefined" || !footerCard || isReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    gsap.fromTo(
      footerCard,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.70,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: footerCard,
          start: "top 88%",
          once: true,
        },
      }
    );
  });

  return () => ctx.revert();
}
