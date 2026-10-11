"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import ViewToggle from "@/components/ViewToggle/ViewToggle";
import styles from "./ProductCatalog.module.css";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setProducts(data);
          setStatus("success");
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        if (!cancelled) setStatus("error");
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Filter products by search query ── */
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  return (
    <section className={styles.catalog} aria-label="Product catalog">
      <div className="container">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h1>Our Product prices</h1>
            {status === "success" && (
              <p>Browse our full range of medical equipment and consumables.</p>
            )}
          </div>
          <div className={styles.toolbarRight}>
            {/* Frontend Search Bar */}
            <div className={styles.searchBarWrap}>
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
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products by title or category"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClearBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {status === "success" && (
              <span className={styles.productCount} aria-live="polite">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </span>
            )}
            <ViewToggle view={view} onChange={setView} />
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
                <h2 className={styles.notAvailableHeading}>Not Available</h2>
                <p className={styles.notAvailableText}>
                  No product matching &ldquo;{searchQuery}&rdquo; was found in our catalog.
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div
                id="product-grid"
                className={view === "grid" ? styles.gridLayout : styles.listLayout}
                aria-label={view === "grid" ? "Products in grid view" : "Products in list view"}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
