/**
 * Shared Product Category Definitions
 * Pezu Medics Catalog
 */

export const PRODUCT_CATEGORIES = [
  {
    id: "consumables",
    full: "MEDICAL AND SURGICAL, LABORATORIES CONSUMABLES AND DISPOSABLES",
    short: "Consumables & Disposables",
    color: "#0284c7",
    bg: "#e0f2fe",
    border: "#bae6fd",
  },
  {
    id: "laboratory",
    full: "LABORATORY PRODUCTS",
    short: "Laboratory Products",
    color: "#7c3aed",
    bg: "#f3e8ff",
    border: "#ddd6fe",
  },
  {
    id: "equipment",
    full: "MEDICAL EQUIPMENT",
    short: "Medical Equipment",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
];

export const DEFAULT_CATEGORY = PRODUCT_CATEGORIES[0].full;

/**
 * Get category badge metadata by full or partial category string
 */
export function getCategoryBadge(category) {
  if (!category || typeof category !== "string") {
    return PRODUCT_CATEGORIES[0];
  }

  const clean = category.trim();

  // Exact full or short match
  const exact = PRODUCT_CATEGORIES.find(
    (c) =>
      c.full.toLowerCase() === clean.toLowerCase() ||
      c.short.toLowerCase() === clean.toLowerCase()
  );
  if (exact) return exact;

  // Fuzzy match keywords
  const upper = clean.toUpperCase();
  if (
    upper.includes("CONSUMABLE") ||
    upper.includes("SURGICAL") ||
    upper.includes("DISPOSABLE") ||
    upper.includes("DIAGNOSTICS") ||
    upper.includes("SYRINGE")
  ) {
    return PRODUCT_CATEGORIES[0];
  }
  if (upper.includes("LABORATORY") || upper.includes("LAB ")) {
    return PRODUCT_CATEGORIES[1];
  }
  if (upper.includes("EQUIPMENT")) {
    return PRODUCT_CATEGORIES[2];
  }

  return {
    id: "custom",
    full: clean,
    short: clean,
    color: "#0284c7",
    bg: "#e0f2fe",
    border: "#bae6fd",
  };
}
