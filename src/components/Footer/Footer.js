"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animateFooterScrollReveal } from "@/lib/scrollReveal";
import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export default function Footer() {
  const footerCardRef = useRef(null);

  useEffect(() => {
    if (footerCardRef.current) {
      const cleanup = animateFooterScrollReveal(footerCardRef.current);
      return () => cleanup();
    }
  }, []);

  const handleScrollToCatalog = (e) => {
    e.preventDefault();
    const target = document.getElementById("our-product-price");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className={styles.footerWrap} role="contentinfo">
      <div className={`container ${styles.footerContainer}`}>
        <div ref={footerCardRef} className={styles.footerCard}>
          <div className={styles.cardContent}>
            {/* ── Brand Column ── */}
            <div className={styles.brandCol}>
              <Image
                src="/logo-mark.png"
                alt="Pezu Standard Medical Concern"
                width={185}
                height={38}
                className={styles.footerLogo}
              />
              <p className={styles.brandBlurb}>
                Supplying clinics, hospitals, and healthcare professionals with
                reliable medical equipment, laboratory diagnostics, and surgical
                consumables.
              </p>
              <div className={styles.hoursBadge}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>Mon – Sat, Open 24 hours</span>
              </div>
            </div>

            {/* ── Multi-Column Nav Links ── */}
            <div className={styles.linksGrid}>
              {/* Column 1: Categories */}
              <div className={`${styles.col} ${styles.colCategories}`}>
                <h3 className={styles.colTitle}>Categories</h3>
                <ul className={styles.linksList}>
                  <li>
                    <a href="#our-product-price" onClick={handleScrollToCatalog}>
                      Medical Equipment
                    </a>
                  </li>
                  <li>
                    <a href="#our-product-price" onClick={handleScrollToCatalog}>
                      Laboratory Products
                    </a>
                  </li>
                  <li>
                    <a href="#our-product-price" onClick={handleScrollToCatalog}>
                      Surgical Consumables
                    </a>
                  </li>
                  <li>
                    <a href="#our-product-price" onClick={handleScrollToCatalog}>
                      Hospital Disposables
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2: Contact */}
              <div className={`${styles.col} ${styles.colContact}`}>
                <h3 className={styles.colTitle}>Contact</h3>
                <ul className={styles.linksList}>
                  <li>
                    <a href="tel:+2348105117437" className={styles.contactLink}>
                      +234 810 511 7437
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:pezustandardmedicsconcerns@gmail.com"
                      className={styles.contactLink}
                    >
                      pezustandardmedicsconcerns@gmail.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/2348105117437?text=Hello%20Pezu%20Standard%20Medics"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappLink}
                    >
                      WhatsApp Chat ↗
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Address */}
              <div className={`${styles.col} ${styles.colAddress}`}>
                <h3 className={styles.colTitle}>Address</h3>
                <address className={styles.addressBlock}>
                  24 Alubomimu street, off Imaro Street,<br />
                  Idumota, Lagos Island, Nigeria
                </address>
              </div>

              {/* Column 4: Legal */}
              <div className={`${styles.col} ${styles.colLegal}`}>
                <h3 className={styles.colTitle}>Legal</h3>
                <ul className={styles.linksList}>
                  <li>
                    <a href="#terms">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a href="#refund">Refund Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Bottom Divider & Copyright ── */}
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © {year} Pezu Standard Medical Concern. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
