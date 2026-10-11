import styles from "./ProductCard.module.css";

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
  const { id, name, price, description } = product || {};
  const formattedPrice = `₦${Number(price || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const cleanDescription = (description || "").trim();
  const displayDescription = cleanDescription || "Reliable medical supplies & consumables";

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
            <h2 className={styles.name}>{name}</h2>
            <p className={`${styles.description} ${!cleanDescription ? styles.emptyDescription : ""}`}>
              {displayDescription}
            </p>
          </div>
          <div className={styles.cardListMeta}>
            <span className={styles.price}>{formattedPrice}</span>
            <button className={styles.cta} aria-label={`Enquire about ${name}`}>
              Enquire
            </button>
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
        <h2 className={styles.name}>{name}</h2>
        <p className={`${styles.description} ${!cleanDescription ? styles.emptyDescription : ""}`}>
          {displayDescription}
        </p>
        <div className={styles.cardFooter}>
          <span className={styles.price}>{formattedPrice}</span>
          <button className={styles.cta} aria-label={`Enquire about ${name}`}>
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
