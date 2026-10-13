"use client";

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import initialProducts from "@/data/products.json";

const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
  selectedCategory: "all",
  setSelectedCategory: () => {},
  isHeaderSearchOpen: false,
  setIsHeaderSearchOpen: () => {},
  performGlobalSearch: () => {},
  clearSearch: () => {},
  catalogProducts: [],
  setCatalogProducts: () => {},
  searchMatchCount: null,
  hasQuery: false,
});

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState(
    Array.isArray(initialProducts) ? initialProducts : []
  );

  /**
   * Search across all categories regardless of active category filter.
   * Resets selectedCategory to "all" to satisfy the requirement:
   * "search for products across all categories whether you are in a category for that product or not.
   * Let it pick it's search query from 'All Category'"
   */
  const performGlobalSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      setSelectedCategory("all");
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const hasQuery = Boolean(searchQuery && searchQuery.trim());

  // Count matches across all categories to determine green (found) vs red (not listed)
  const searchMatchCount = useMemo(() => {
    if (!hasQuery) return null;
    const q = searchQuery.toLowerCase().trim();
    if (!catalogProducts || catalogProducts.length === 0) return 0;
    return catalogProducts.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc;
    }).length;
  }, [hasQuery, searchQuery, catalogProducts]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isHeaderSearchOpen,
        setIsHeaderSearchOpen,
        performGlobalSearch,
        clearSearch,
        catalogProducts,
        setCatalogProducts,
        searchMatchCount,
        hasQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
