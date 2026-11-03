"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {},
  clearCart: () => {},
  totalCount: 0,
  totalAmount: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
});

const CART_STORAGE_KEY = "pezu_cart_items";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on client mount (avoids SSR hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load cart from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to persist cart to storage:", e);
    }
  }, [cart, isLoaded]);

  // Synchronize cart across browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } catch (_) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || !product.id) return;
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id) === String(product.id));
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity || 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + qtyToAdd,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: String(product.id),
          name: product.name,
          price: typeof product.price === "number" ? product.price : parseFloat(product.price) || 0,
          category: product.category,
          image: product.image || "",
          description: product.description || "",
          quantity: qtyToAdd,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity: qty } : item
      )
    );
  }, [removeFromCart]);

  const incrementQuantity = useCallback((productId) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((productId) => {
    setCart((prev) => {
      const target = prev.find((item) => String(item.id) === String(productId));
      if (!target) return prev;
      if ((target.quantity || 1) <= 1) {
        // If 1, decrementing removes the item from cart
        return prev.filter((item) => String(item.id) !== String(productId));
      }
      return prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
      return sum + p * (item.quantity || 1);
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        totalCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
