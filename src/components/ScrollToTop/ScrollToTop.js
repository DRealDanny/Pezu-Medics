"use client";

import { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable automatic browser scroll restoration so website always starts from top on reload
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const handlePageShow = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      };

      window.addEventListener("pageshow", handlePageShow);

      return () => {
        window.removeEventListener("pageshow", handlePageShow);
      };
    }
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 150) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      type="button"
      id="scroll-to-top-btn"
      className={`${styles.scrollToTopBtn} ${visible ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
