"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { getCategoryBadge } from "@/lib/categories";
import styles from "./CartDrawer.module.css";

/* ── Placeholder image for cart item ── */
function CartItemPlaceholder({ name }) {
  return (
    <div className={styles.itemPlaceholder} aria-label={`Product thumbnail for ${name}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalCount,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const drawerRef = useRef(null);

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isCartOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleStartShopping = () => {
    setIsCartOpen(false);
    const catalogEl = document.getElementById("our-product-price") || document.getElementById("product-catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formattedTotal = `₦${Number(totalAmount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`${styles.backdrop}${isCartOpen ? ` ${styles.backdropOpen}` : ""}`}
        onClick={handleClose}
        aria-hidden={!isCartOpen}
      />

      {/* Side Panel Drawer */}
      <aside
        ref={drawerRef}
        className={`${styles.drawer}${isCartOpen ? ` ${styles.drawerOpen}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        aria-hidden={!isCartOpen}
      >
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.titleWithIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={styles.headerCartIcon}
              >
                <circle cx="8" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <h2 className={styles.drawerTitle}>Your Cart</h2>
            </div>
            <span className={styles.headerCountBadge} aria-label={`${totalCount} items in cart`}>
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </span>
          </div>

          <div className={styles.headerActions}>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className={styles.clearCartBtn}
                title="Remove all items from cart"
                aria-label="Clear all items from cart"
              >
                Clear Cart
              </button>
            )}

            <button
              type="button"
              id="cart-drawer-close-btn"
              onClick={handleClose}
              className={styles.closeBtn}
              aria-label="Close cart"
              title="Close cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body: Products list or Empty state */}
        <div className={styles.drawerBody}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartState}>
              <div className={styles.emptyIconCircle}>
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="21" r="1.5" />
                  <circle cx="19" cy="21" r="1.5" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>Your cart is empty</h3>
              <p className={styles.emptySubtitle}>
                You haven&apos;t added any medical supplies or equipment to your cart yet.
              </p>
              <button
                type="button"
                onClick={handleStartShopping}
                className={styles.startShoppingBtn}
              >
                <span>Browse Products</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          ) : (
            <div className={styles.itemsList} role="list">
              {cart.map((item) => {
                const categoryBadge = getCategoryBadge(item.category);
                const unitPrice = Number(item.price || 0);
                const itemTotal = unitPrice * (item.quantity || 1);
                const formattedUnitPrice = `₦${unitPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
                const formattedItemTotal = `₦${itemTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;

                return (
                  <article key={item.id} className={styles.cartItem} role="listitem">
                    {/* Item Thumbnail */}
                    <div className={styles.itemImageWrapper}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={styles.itemImage}
                        />
                      ) : (
                        <CartItemPlaceholder name={item.name} />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className={styles.itemDetails}>
                      <div className={styles.itemHeaderRow}>
                        <div className={styles.itemMeta}>
                          {categoryBadge && (
                            <span
                              className={styles.categoryBadge}
                              style={{
                                color: categoryBadge.color,
                                backgroundColor: categoryBadge.bg,
                                borderColor: categoryBadge.border,
                              }}
                            >
                              {categoryBadge.short}
                            </span>
                          )}
                          <h4 className={styles.itemName} title={item.name}>
                            {item.name}
                          </h4>
                        </div>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className={styles.removeItemBtn}
                          aria-label={`Remove ${item.name} from cart`}
                          title="Remove item"
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
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>

                      <div className={styles.itemPriceRow}>
                        <span className={styles.itemUnitPrice}>
                          {formattedUnitPrice} each
                        </span>
                      </div>

                      {/* Quantity Stepper & Calculated Item Total */}
                      <div className={styles.itemControlsRow}>
                        <div
                          className={styles.quantityStepper}
                          role="group"
                          aria-label={`Quantity controls for ${item.name}`}
                        >
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.id)}
                            className={styles.stepperBtn}
                            aria-label={`Decrease quantity of ${item.name}`}
                            title="Decrease quantity"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>

                          <span className={styles.quantityValue} aria-label={`Quantity: ${item.quantity}`}>
                            {item.quantity || 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => incrementQuantity(item.id)}
                            className={styles.stepperBtn}
                            aria-label={`Increase quantity of ${item.name}`}
                            title="Increase quantity"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        </div>

                        {/* Calculated item total (units * price) */}
                        <div className={styles.itemTotalWrapper}>
                          <span className={styles.itemTotalLabel}>Total:</span>
                          <span className={styles.itemTotalPrice}>
                            {formattedItemTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer: Order breakdown, Subtotal, and Total */}
        {cart.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>{formattedTotal}</span>
            </div>

            {/* Bottom Actions */}
            <div className={styles.footerActions}>
              <button
                type="button"
                onClick={handleClose}
                className={styles.continueShoppingBtn}
              >
                Continue Shopping
              </button>
              <button
                type="button"
                id="cart-checkout-btn"
                className={styles.checkoutBtn}
                title="Proceed to checkout"
              >
                <span>Checkout</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
