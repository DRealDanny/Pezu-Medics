"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

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
        {/* Brand logo */}
        <Link href="/" className={styles.logoLink} aria-label="Pezu Standard Medical Concern">
          <Image
            src="/logo-mark.png"
            alt="Pezu Standard Medical Concern"
            width={204}
            height={42}
            priority
            unoptimized
            className={styles.brandLogo}
          />
        </Link>
      </div>
    </header>
  );
}
