"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearch } from "@/context/SearchContext";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const {
    searchQuery,
    performGlobalSearch,
    clearSearch,
    isHeaderSearchOpen,
    setIsHeaderSearchOpen,
  } = useSearch();

  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isHeaderSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isHeaderSearchOpen]);

  const handleOpenSearch = () => {
    setIsHeaderSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsHeaderSearchOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catalogEl = document.getElementById("product-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCloseSearch();
    }
  };

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`} role="banner">
      <div className={`container ${styles.headerInner}`}>
        {/* Brand logo (hidden or scaled on mobile when search is expanded) */}
        <Link
          href="/"
          className={`${styles.logoLink}${isHeaderSearchOpen ? ` ${styles.logoHiddenOnMobileSearch}` : ""}`}
          aria-label="Pezu Standard Medical Concern"
        >
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

        {/* Global Search across all categories */}
        <div className={styles.searchContainer}>
          {isHeaderSearchOpen ? (
            <form onSubmit={handleSubmit} className={styles.searchFormExpanded} role="search">
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                id="header-global-search-input"
                className={styles.searchInput}
                placeholder="Search all products & categories…"
                value={searchQuery}
                onChange={(e) => performGlobalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search all products across all categories"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className={styles.clearBtn}
                  aria-label="Clear search query"
                  title="Clear"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseSearch}
                className={styles.closeSearchBtn}
                aria-label="Close search"
                title="Close search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </form>
          ) : (
            <button
              type="button"
              id="header-search-btn"
              onClick={handleOpenSearch}
              className={styles.searchToggleBtn}
              aria-label="Search products across all categories"
              title="Search products across all categories"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className={styles.searchBtnText}>Search all products…</span>
              {searchQuery && (
                <span className={styles.activeQueryBadge}>Active</span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
