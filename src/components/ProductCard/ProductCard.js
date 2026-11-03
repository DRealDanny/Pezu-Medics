"use client";

import { useState } from "react";
import styles from "./ProductCard.module.css";
import { getCategoryBadge } from "@/lib/categories";
import { useCart } from "@/context/CartContext";

/* ── Placeholder image ── */
function PlaceholderImage({ name }) {
  return (
    <div className={styles.imagePlaceholder} aria-label={`Product image for ${name}`}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M6 32 L16 22 L24 30 L32 20 L42 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Product Image</span>
    </div>
  );
}

/**
 * ProductCard
 * @param {{ product: object, view: "grid" | "list" }} props
 */
export default function ProductCard({ product, view }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const { id, name, price, category, description } = product || {};
  const formattedPrice = `₦${Number(price || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const cleanDescription = (description || "").trim();
  const categoryBadge = getCategoryBadge(category);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const renderActionButton = () => (
    <button
      type="button"
      className={`${styles.cta}${isAdded ? ` ${styles.ctaAdded}` : ""}`}
      onClick={handleAddToCart}
      aria-label={`Add ${name} to cart`}
    >
      {isAdded ? (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={styles.ctaIcon}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Added</span>
        </>
      ) : (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={styles.ctaIcon}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add To Cart</span>
        </>
      )}
    </button>
  );

  if (view === "list") {
    return (
      <article className={styles.cardList} id={`product-${id}`} aria-label={name}>
        <div className={styles.imageWrapperList}>
          {product.image ? (
            <img src={product.image} alt={name} className={styles.productImage} />
          ) : (
            <PlaceholderImage name={name} />
          )}
        </div>
        <div className={styles.cardListBody}>
          <div className={styles.cardListInfo}>
            {categoryBadge && (
              <span
                className={styles.category}
                style={{
                  color: categoryBadge.color,
                  backgroundColor: categoryBadge.bg,
                  borderColor: categoryBadge.border,
                }}
                title={categoryBadge.full}
              >
                {categoryBadge.short}
              </span>
            )}
            <h2 className={styles.name}>{name}</h2>
            {cleanDescription ? (
              <p className={styles.description}>{cleanDescription}</p>
            ) : null}
          </div>
          <div className={styles.cardListMeta}>
            <span className={styles.price}>{formattedPrice}</span>
            {renderActionButton()}
          </div>
        </div>
      </article>
    );
  }

  /* Grid card (default) */
  return (
    <article className={styles.cardGrid} id={`product-${id}`} aria-label={name}>
      <div className={styles.imageWrapper}>
        {product.image ? (
          <img src={product.image} alt={name} className={styles.productImage} />
        ) : (
          <PlaceholderImage name={name} />
        )}
      </div>
      <div className={styles.cardBody}>
        {categoryBadge && (
          <span
            className={styles.category}
            style={{
              color: categoryBadge.color,
              backgroundColor: categoryBadge.bg,
              borderColor: categoryBadge.border,
            }}
            title={categoryBadge.full}
          >
            {categoryBadge.short}
          </span>
        )}
        <h2 className={styles.name}>{name}</h2>
        {cleanDescription ? (
          <p className={styles.description}>{cleanDescription}</p>
        ) : (
          <div className={styles.descriptionSpacer} aria-hidden="true" />
        )}
        <div className={styles.cardFooter}>
          <span className={styles.price}>{formattedPrice}</span>
          {renderActionButton()}
        </div>
      </div>
    </article>
  );
}
