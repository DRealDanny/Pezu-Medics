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
    searchMatchCount,
    hasQuery,
  } = useSearch();

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Track header shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isHeaderSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isHeaderSearchOpen]);

  // Close search box on outside click or scroll, but RETAIN search results
  useEffect(() => {
    if (!isHeaderSearchOpen) return;

    // Tap or click outside search box closes it
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsHeaderSearchOpen(false);
      }
    };

    // Scrolling the page closes the search box while retaining results
    const handleScroll = () => {
      setIsHeaderSearchOpen(false);
    };

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsHeaderSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHeaderSearchOpen, setIsHeaderSearchOpen]);

  const handleOpenSearch = () => {
    setIsHeaderSearchOpen(true);
  };

  const handleClearQuery = (e) => {
    e.stopPropagation();
    clearSearch();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catalogEl = document.getElementById("our-product-price") || document.getElementById("product-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`} role="banner">
      <div className={`container ${styles.headerInner}`}>
        {/* Brand logo (hidden on mobile only when search bar is actively expanded) */}
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

        {/* Global Search Container */}
        <div ref={searchContainerRef} className={styles.searchContainer}>
          {isHeaderSearchOpen ? (
            <form
              onSubmit={handleSubmit}
              className={`${styles.searchFormExpanded}${
                hasQuery
                  ? searchMatchCount > 0
                    ? ` ${styles.expandedMatches}`
                    : ` ${styles.expandedNoMatches}`
                  : ""
              }`}
              role="search"
            >
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
                aria-label="Search all products across all categories"
              />
              {/* Only 1 single X button: Clears search query */}
              {searchQuery ? (
                <button
                  type="button"
                  id="header-search-clear-btn"
                  onClick={handleClearQuery}
                  className={styles.clearBtn}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ) : null}
            </form>
          ) : (
            <button
              type="button"
              id="header-search-btn"
              onClick={handleOpenSearch}
              className={`${styles.searchToggleBtn}${
                hasQuery
                  ? searchMatchCount > 0
                    ? ` ${styles.toggleMatches}`
                    : ` ${styles.toggleNoMatches}`
                  : ""
              }`}
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
              <span className={styles.searchBtnText}>
                {hasQuery ? `Searching: "${searchQuery}"` : "Search all products…"}
              </span>
              {hasQuery && (
                <span
                  className={`${styles.activeQueryBadge} ${
                    searchMatchCount > 0 ? styles.badgeMatches : styles.badgeNoMatches
                  }`}
                >
                  {searchMatchCount > 0 ? `${searchMatchCount} found` : "0 matches"}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
