"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import ViewToggle from "@/components/ViewToggle/ViewToggle";
import { PRODUCT_CATEGORIES, getCategoryBadge } from "@/lib/categories";
import { useSearch } from "@/context/SearchContext";
import styles from "./ProductCatalog.module.css";

const ITEMS_PER_PAGE = 20;

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [currentPage, setCurrentPage] = useState(1);

  const {
    searchQuery,
    performGlobalSearch,
    clearSearch,
    selectedCategory,
    setSelectedCategory,
    setCatalogProducts,
    searchMatchCount,
    hasQuery,
  } = useSearch();

  /* ── Default view mode on mobile startup: List not Grid ── */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 640px)").matches || window.innerWidth <= 640;
      if (isMobile) {
        setView("list");
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let activeFetchId = 0;
    let debounceTimer = null;

    async function fetchProducts() {
      const fetchId = ++activeFetchId;
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && fetchId === activeFetchId && Array.isArray(data)) {
          // Strictly deduplicate by product id
          const seen = new Set();
          const cleanList = data.filter((p) => {
            if (!p || !p.id || seen.has(String(p.id))) return false;
            seen.add(String(p.id));
            return true;
          });
          setProducts(cleanList);
          if (setCatalogProducts) setCatalogProducts(cleanList);
          setStatus("success");
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        if (!cancelled && fetchId === activeFetchId) setStatus("error");
      }
    }

    fetchProducts();

    // Re-sync instantly whenever user switches back to this tab/window after CMS edits
    function handleVisibilityOrFocus() {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          fetchProducts();
        }, 120);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleVisibilityOrFocus);
      document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    }

    return () => {
      cancelled = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleVisibilityOrFocus);
        document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      }
    };
  }, []);

  /* ── Filter products by category & search query ── */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query filter: always searches across ALL categories
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        return matchName || matchCat || matchDesc;
      }

      // Category filter: applies when there is no active search query
      if (selectedCategory !== "all") {
        const badge = getCategoryBadge(p.category);
        if (badge.full !== selectedCategory && badge.id !== selectedCategory) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Is search engine actively used
  const isSearchActive = Boolean(searchQuery.trim());

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  // Clamp current page if total pages decreases
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Paginated product slice: SEARCH displays ALL results; Filtered browsing displays 20 per page
  const displayedProducts = useMemo(() => {
    if (isSearchActive) {
      return filteredProducts;
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, isSearchActive]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    const catalogEl = document.getElementById("product-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Smart page numbers windowing for desktop/tablet
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);


  return (
    <section id="product-catalog" className={styles.catalog} aria-label="Product catalog">
      <div className="container">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h1>Our Product Prices</h1>
            {status === "success" && (
              <p>Browse our full range of medical equipment and prices.</p>
            )}
          </div>
          <div className={styles.toolbarRight}>
            {/* Category Dropdown Filter */}
            <div className={styles.categorySelectWrap}>
              <svg
                className={styles.categorySelectIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <select
                id="frontend-category-filter"
                className={styles.categorySelect}
                value={searchQuery.trim() ? "all" : selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (searchQuery) clearSearch();
                }}
                aria-label="Filter products by category"
              >
                <option value="all">
                  {searchQuery.trim()
                    ? `All Categories (${filteredProducts.length} matches)`
                    : `All Categories (${products.length})`}
                </option>
                {PRODUCT_CATEGORIES.map((cat) => {
                  const count = products.filter((p) => {
                    const b = getCategoryBadge(p.category);
                    return b.full === cat.full || b.id === cat.id;
                  }).length;
                  return (
                    <option key={cat.id} value={cat.full}>
                      {cat.full} ({count})
                    </option>
                  );
                })}
              </select>
              <svg
                className={styles.selectChevron}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Frontend Search Bar */}
            <div
              className={`${styles.searchBarWrap}${
                hasQuery
                  ? searchMatchCount > 0
                    ? ` ${styles.searchMatches}`
                    : ` ${styles.searchNoMatches}`
                  : ""
              }`}
            >
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                id="frontend-product-search"
                className={styles.searchInput}
                placeholder="Search products across all categories…"
                value={searchQuery}
                onChange={(e) => performGlobalSearch(e.target.value)}
                aria-label="Search products across all categories"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClearBtn}
                  onClick={clearSearch}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.toolbarActions}>
              {status === "success" && (
                <span className={styles.productCount} aria-live="polite">
                  {isSearchActive
                    ? `${filteredProducts.length} ${filteredProducts.length === 1 ? "match" : "matches"}`
                    : `Showing ${
                        filteredProducts.length === 0
                          ? 0
                          : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                              currentPage * ITEMS_PER_PAGE,
                              filteredProducts.length
                            )} of ${filteredProducts.length}`
                      }`}
                </span>
              )}

              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>
        </div>

        {/* Content states */}
        {status === "loading" && (
          <div className={styles.stateWrapper} aria-busy="true" aria-label="Loading products">
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner} />
              <p>Loading products…</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className={styles.stateWrapper}>
            <div className={styles.errorBox} role="alert">
              <h2>Unable to load products</h2>
              <p>Please check your connection or try refreshing the page.</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <>
            {filteredProducts.length === 0 ? (
              <div className={styles.notAvailableBox} role="status">
                <div className={styles.notAvailableIcon}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <h2 className={styles.notAvailableHeading}>No Products Found</h2>
                <p className={styles.notAvailableText}>
                  {searchQuery
                    ? `No product matching "${searchQuery}" was found in our catalog across all categories.`
                    : `No products currently listed under "${selectedCategory}".`}
                </p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
                  {selectedCategory !== "all" && (
                    <button
                      type="button"
                      className={styles.clearSearchBtn}
                      onClick={() => setSelectedCategory("all")}
                    >
                      Show All Categories
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      type="button"
                      className={styles.clearSearchBtn}
                      onClick={clearSearch}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  id="product-grid"
                  className={view === "grid" ? styles.gridLayout : styles.listLayout}
                  aria-label={view === "grid" ? "Products in grid view" : "Products in list view"}
                >
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} view={view} />
                  ))}
                </div>

                {/* Pagination Controls (Active for category / all browsing; bypassed during active search) */}
                {!isSearchActive && totalPages > 1 && (
                  <nav className={styles.paginationWrapper} aria-label="Product catalog pagination">
                    <div className={styles.paginationContainer}>
                      <button
                        type="button"
                        id="pagination-prev-btn"
                        className={`${styles.pageBtn} ${styles.navBtn}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Go to previous page"
                      >
                        <svg
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
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>Prev</span>
                      </button>

                      {/* Desktop / Tablet Page Numbers */}
                      <div className={styles.pageNumberList}>
                        {pageNumbers.map((p, idx) =>
                          p === "..." ? (
                            <span key={`ellipsis-${idx}`} className={styles.ellipsis} aria-hidden="true">
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              type="button"
                              className={`${styles.pageBtn}${currentPage === p ? ` ${styles.pageBtnActive}` : ""}`}
                              onClick={() => handlePageChange(p)}
                              aria-label={`Go to page ${p}`}
                              aria-current={currentPage === p ? "page" : undefined}
                            >
                              {p}
                            </button>
                          )
                        )}
                      </div>

                      {/* Mobile Page Indicator */}
                      <div className={styles.mobilePageIndicator} aria-current="page">
                        Page {currentPage} of {totalPages}
                      </div>

                      <button
                        type="button"
                        id="pagination-next-btn"
                        className={`${styles.pageBtn} ${styles.navBtn}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Go to next page"
                      >
                        <span>Next</span>
                        <svg
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
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>

                    <div className={styles.paginationInfo}>
                      <span>Page {currentPage} of {totalPages}</span>
                      <span>•</span>
                      <span className={styles.paginationInfoBadge}>
                        20 products per page
                      </span>
                    </div>
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
