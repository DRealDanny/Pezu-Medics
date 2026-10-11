"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import ViewToggle from "@/components/ViewToggle/ViewToggle";
import styles from "./ProductCatalog.module.css";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

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

  return (
    <section className={styles.catalog} aria-label="Product catalog">
      <div className="container">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h1>Our Products</h1>
            {status === "success" && (
              <p>Browse our full range of medical equipment and consumables.</p>
            )}
          </div>
          <div className={styles.toolbarRight}>
            {status === "success" && (
              <span className={styles.productCount} aria-live="polite">
                {products.length} {products.length === 1 ? "product" : "products"}
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
          <div
            id="product-grid"
            className={view === "grid" ? styles.gridLayout : styles.listLayout}
            aria-label={view === "grid" ? "Products in grid view" : "Products in list view"}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} view={view} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
