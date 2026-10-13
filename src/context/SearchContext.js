"use client";

import { createContext, useContext, useState, useCallback } from "react";

const SearchContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
  selectedCategory: "all",
  setSelectedCategory: () => {},
  isHeaderSearchOpen: false,
  setIsHeaderSearchOpen: () => {},
  performGlobalSearch: () => {},
  clearSearch: () => {},
});

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);

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
