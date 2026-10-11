"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

/* ── SVG logo placeholder ── */
function LogoIcon({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={styles.logoIcon}
    >
      {/* Outer circle */}
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
      {/* Cross / plus mark – medical symbol */}
      <rect x="14" y="8" width="4" height="16" rx="2" fill="currentColor" />
      <rect x="8" y="14" width="16" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`} role="banner">
      <div className={`container ${styles.headerInner}`}>
        {/* Brand logo slot */}
        <div className={styles.logoArea}>
          <LogoIcon size={32} />
          <div>
            <p className={styles.brandName}>Pezu Medics</p>
            <p className={styles.brandTagline}>Medical Supplies &amp; Equipment</p>
          </div>
        </div>

        {/* CMS Link */}
        <a href="/admin" className={styles.adminLink} title="Headless CMS Admin Portal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          CMS Portal
        </a>
      </div>
    </header>
  );
}
