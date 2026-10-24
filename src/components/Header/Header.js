"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { getCategoryBadge } from "@/lib/categories";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const {
    searchQuery,
    performGlobalSearch,
    clearSearch,
    isHeaderSearchOpen,
    setIsHeaderSearchOpen,
    searchMatchCount,
    hasQuery,
    catalogProducts,
  } = useSearch();

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter products for the mini dropdown when on non-home pages
  const matchingProducts = useMemo(() => {
    if (!hasQuery || !catalogProducts || catalogProducts.length === 0) return [];
    const q = searchQuery.toLowerCase().trim();
    return catalogProducts.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc;
    });
  }, [hasQuery, searchQuery, catalogProducts]);

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

    // Scrolling the page closes the search box, but scrolling inside the dropdown should not close it
    const handleScroll = (e) => {
      if (e.target && searchContainerRef.current && searchContainerRef.current.contains(e.target)) {
        return;
      }
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

  const handleProductClick = (product) => {
    setIsHeaderSearchOpen(false);
    router.push(
      `/?search=${encodeURIComponent(product.name)}&productId=${encodeURIComponent(product.id)}#our-product-price`
    );
  };

  const handleViewAllClick = () => {
    setIsHeaderSearchOpen(false);
    router.push(
      `/?search=${encodeURIComponent(searchQuery)}#our-product-price`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isHomePage) {
      if (hasQuery) {
        setIsHeaderSearchOpen(false);
        router.push(
          `/?search=${encodeURIComponent(searchQuery)}#our-product-price`
        );
      }
    } else {
      const catalogEl = document.getElementById("our-product-price") || document.getElementById("product-catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`${styles.header}${scrolled ? ` ${styles.scrolled}` : ""}`} role="banner">
      <div className={`container ${styles.headerInner}`}>
        {/* Brand logo (hidden on mobile only when search bar is actively expanded) */}
        <Link
          href="/"
          className={`${styles.logoLink}${isHeaderSearchOpen ? ` ${styles.logoHiddenOnMobileSearch}` : ""}`}
          aria-label="Pezu Standard Medics Concern"
        >
          <Image
            src="/brand-logo.png"
            alt="Pezu Standard Medics Concern"
            width={184}
            height={42}
            priority
            fetchPriority="high"
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

          {/* Mini dropdown tab when on another page that's not the homepage */}
          {!isHomePage && isHeaderSearchOpen && hasQuery && (
            <div
              className={styles.miniDropdown}
              role="dialog"
              aria-label="Product Search Results"
            >
              {matchingProducts.length > 0 ? (
                <>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownHeaderTitle}>
                      Matching Products
                    </span>
                    <span className={styles.dropdownHeaderBadge}>
                      {matchingProducts.length}{" "}
                      {matchingProducts.length === 1 ? "result" : "results"}
                    </span>
                  </div>

                  <div className={styles.dropdownList} role="listbox">
                    {matchingProducts.slice(0, 15).map((product) => {
                      const badge = getCategoryBadge(product.category);
                      return (
                        <button
                          key={product.id}
                          type="button"
                          className={styles.dropdownItem}
                          onClick={() => handleProductClick(product)}
                          role="option"
                          aria-selected="false"
                        >
                          <div className={styles.itemThumb}>
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className={styles.itemImg}
                              />
                            ) : (
                              <div className={styles.itemPlaceholderIcon}>
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect x="3" y="3" width="18" height="18" rx="3" />
                                  <line x1="12" y1="8" x2="12" y2="16" />
                                  <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className={styles.itemInfo}>
                            <div className={styles.itemName}>{product.name}</div>
                            <div className={styles.itemMeta}>
                              {badge && (
                                <span
                                  className={styles.itemCatBadge}
                                  style={{
                                    color: badge.color,
                                    backgroundColor: badge.bg,
                                    borderColor: badge.border,
                                  }}
                                >
                                  {badge.short}
                                </span>
                              )}
                              <span className={styles.itemPrice}>
                                ₦{Number(product.price || 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                })}
                              </span>
                            </div>
                          </div>

                          <span className={styles.itemArrow} aria-hidden="true">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.dropdownFooter}>
                    <button
                      type="button"
                      className={styles.dropdownViewAllBtn}
                      onClick={handleViewAllClick}
                    >
                      <span>
                        View all {matchingProducts.length} results in catalog
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className={styles.dropdownEmptyState}
                  role="status"
                  aria-live="polite"
                >
                  <div className={styles.emptyIconWrap}>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line
                        x1="8"
                        y1="11"
                        x2="14"
                        y2="11"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.emptyTitle}>No matching products</div>
                  <p className={styles.emptyText}>
                    No product matching &ldquo;<strong>{searchQuery}</strong>&rdquo; was
                    found in our catalog across all categories.
                  </p>
                  <div className={styles.emptyActions}>
                    <button
                      type="button"
                      className={styles.emptyClearBtn}
                      onClick={handleClearQuery}
                    >
                      Clear search
                    </button>
                    <a
                      href={`https://wa.me/2348105117437?text=${encodeURIComponent(
                        `Hello Pezu Standard Medics, I searched for "${searchQuery}" on your website but could not find it. Do you have this product available?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.emptyWhatsAppBtn}
                    >
                      <span>Enquire on WhatsApp</span>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
