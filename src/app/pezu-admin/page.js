"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

/* ── Standard category choices for convenience ── */
const PRESET_CATEGORIES = [
  "Diagnostics",
  "PPE",
  "Monitoring",
  "Equipment",
  "Respiratory",
  "First Aid",
  "Waste Management",
  "Surgical",
];

/* ── Medical Cross Logo Icon ── */
function BrandLogoIcon({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="8" width="4" height="16" rx="2" fill="currentColor" />
      <rect x="8" y="14" width="16" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}

/* ── Generic Placeholder Icon ── */
function PlaceholderIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

/* ── Convert Number to Words in Nigerian Naira ── */
function numberToNairaWords(num) {
  if (isNaN(num) || num <= 0) return "";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convertGroup(n) {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
      if (n > 0) str += "and ";
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? "-" + ones[n % 10] : "") + " ";
    } else if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  }

  const intPart = Math.floor(num);
  if (intPart === 0) return "Zero Naira";

  const billions = Math.floor(intPart / 1000000000);
  const millions = Math.floor((intPart % 1000000000) / 1000000);
  const thousands = Math.floor((intPart % 1000000) / 1000);
  const remainder = intPart % 1000;

  const parts = [];
  if (billions > 0) parts.push(convertGroup(billions) + " Billion");
  if (millions > 0) parts.push(convertGroup(millions) + " Million");
  if (thousands > 0) parts.push(convertGroup(thousands) + " Thousand");
  if (remainder > 0) parts.push(convertGroup(remainder));

  return parts.join(", ") + " Naira";
}

/* ── Get Scale & Denomination breakdown for price ── */
function getPriceScale(num) {
  if (isNaN(num) || num <= 0) return null;
  let scale = "";
  let badgeColor = "";

  if (num < 100) {
    scale = "Units / Tens";
    badgeColor = "#64748b";
  } else if (num < 1000) {
    scale = "Hundreds";
    badgeColor = "#2563eb"; // Blue
  } else if (num < 100000) {
    scale = "Thousands";
    badgeColor = "#0284c7"; // Sky Blue
  } else if (num < 1000000) {
    scale = "Hundred Thousands";
    badgeColor = "#7c3aed"; // Purple
  } else if (num < 1000000000) {
    scale = "Millions";
    badgeColor = "#059669"; // Emerald
  } else {
    scale = "Billions";
    badgeColor = "#d97706"; // Amber
  }

  return {
    scale,
    badgeColor,
    words: numberToNairaWords(num),
    formatted: `₦${Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  };
}

export default function PezuAdminPage() {
  /* ── Auth State ── */
  const [authState, setAuthState] = useState({ checking: true, loggedIn: false, user: null });
  const [loginForm, setLoginForm] = useState({ identifier: "admin@pezumedics.com", password: "admin123" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  /* ── CMS Products State ── */
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  /* ── Modal & Form State ── */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [activeProductId, setActiveProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Diagnostics",
    price: "",
    description: "",
    image: "",
  });
  const [imageInputMode, setImageInputMode] = useState("upload"); // "upload" | "url"
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  /* ── Delete Confirmation State ── */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Toast notifications ── */
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  /* ── 1. Check Session on Mount ── */
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/status");
        if (res.ok) {
          const data = await res.json();
          setAuthState({ checking: false, loggedIn: true, user: data.user });
          fetchProducts();
        } else {
          setAuthState({ checking: false, loggedIn: false, user: null });
        }
      } catch {
        setAuthState({ checking: false, loggedIn: false, user: null });
      }
    }
    checkAuth();
  }, []);

  /* ── 2. Fetch Products List ── */
  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        showToast("Failed to fetch products from CMS", "error");
      }
    } catch {
      showToast("Error connecting to products API", "error");
    } finally {
      setLoadingProducts(false);
    }
  }

  /* ── 3. Handle Login Submit ── */
  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (res.ok) {
        setAuthState({ checking: false, loggedIn: true, user: data.user });
        showToast("Welcome back! Signed in to Pezu Medics CMS.");
        fetchProducts();
      } else {
        setLoginError(data.error || "Authentication failed.");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  /* ── 4. Handle Logout ── */
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setAuthState({ checking: false, loggedIn: false, user: null });
    showToast("Signed out successfully.");
  }

  /* ── 5. Open Add Modal ── */
  function openAddModal() {
    setModalMode("create");
    setActiveProductId(null);
    setFormData({
      name: "",
      category: "Diagnostics",
      price: "",
      description: "",
      image: "",
    });
    setFormError("");
    setModalOpen(true);
  }

  /* ── 6. Open Edit Modal ── */
  function openEditModal(prod) {
    setModalMode("edit");
    setActiveProductId(prod.id);
    const initialPrice =
      prod.price !== undefined && prod.price !== null
        ? Number(prod.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "";

    setFormData({
      name: prod.name || "",
      category: prod.category || "General Equipment",
      price: initialPrice,
      description: prod.description || "",
      image: prod.image || "",
    });
    setImageInputMode(prod.image && prod.image.startsWith("http") ? "url" : "upload");
    setFormError("");
    setModalOpen(true);
  }

  /* ── Real-time Price Input Formatting with Commas & Scale ── */
  function handlePriceChange(e) {
    const raw = e.target.value;
    if (!raw.trim()) {
      setFormData((prev) => ({ ...prev, price: "" }));
      return;
    }
    // Remove non-numeric characters except single decimal point
    const clean = raw.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts.length > 1 ? "." + parts.slice(1).join("").slice(0, 2) : "";

    setFormData((prev) => ({ ...prev, price: integerPart + decimalPart }));
  }

  /* ── On Blur: Ensure Price ends with .00 ── */
  function handlePriceBlur() {
    if (!formData.price || !formData.price.trim()) return;
    const cleanNumber = parseFloat(formData.price.replace(/,/g, ""));
    if (!isNaN(cleanNumber) && cleanNumber >= 0) {
      const formatted = cleanNumber.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFormData((prev) => ({ ...prev, price: formatted }));
    }
  }

  /* ── Reactive Scale Indicator for Current Input ── */
  const priceNumericValue = useMemo(() => {
    if (!formData.price) return 0;
    const num = parseFloat(String(formData.price).replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  }, [formData.price]);

  const activePriceScale = useMemo(() => {
    return getPriceScale(priceNumericValue);
  }, [priceNumericValue]);

  /* ── 7. Handle Image Upload ── */
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError("");

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: result.url }));
        showToast("Image uploaded successfully!");
      } else {
        setFormError(result.error || "Failed to upload image.");
      }
    } catch {
      setFormError("Error uploading image file.");
    } finally {
      setUploadingImage(false);
    }
  }

  /* ── 8. Save Product (Add or Edit) ── */
  async function handleSaveProduct(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    const cleanNum = parseFloat(String(formData.price).replace(/,/g, ""));
    if (isNaN(cleanNum) || cleanNum < 0) {
      setFormError("Please enter a valid price in Naira (₦).");
      return;
    }

    setSavingProduct(true);
    setFormError("");

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: cleanNum,
      description: formData.description ? formData.description.trim() : "",
      image: formData.image ? formData.image.trim() : "",
    };

    try {
      if (modalMode === "create") {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (res.ok) {
          setProducts((prev) => [resData.product, ...prev]);
          setModalOpen(false);
          showToast(`"${payload.name}" added to catalog!`);
        } else {
          setFormError(resData.error || "Failed to add product.");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: activeProductId, ...payload }),
        });
        const resData = await res.json();
        if (res.ok) {
          setProducts((prev) =>
            prev.map((p) => (String(p.id) === String(activeProductId) ? resData.product : p))
          );
          setModalOpen(false);
          showToast(`"${payload.name}" updated successfully!`);
        } else {
          setFormError(resData.error || "Failed to update product.");
        }
      }
    } catch {
      setFormError("Network error while saving product.");
    } finally {
      setSavingProduct(false);
    }
  }

  /* ── 9. Delete Product Flow (Removes from DB and disk completely) ── */
  function confirmDelete(prod) {
    setProductToDelete(prod);
    setDeleteModalOpen(true);
  }

  async function handleDeleteProduct() {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products?id=${productToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(productToDelete.id)));
        setDeleteModalOpen(false);
        showToast(`"${productToDelete.name}" and associated media removed completely.`);
      } else {
        const resData = await res.json();
        showToast(resData.error || "Failed to delete product.", "error");
      }
    } catch {
      showToast("Network error while deleting product.", "error");
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  }

  /* ── 10. Filtered Products & Stats ── */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const stats = useMemo(() => {
    const total = products.length;
    const categories = new Set(products.map((p) => p.category)).size;
    return { total, categories };
  }, [products]);

  const allCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  /* ── Loading state while checking auth ── */
  if (authState.checking) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
          <p>Verifying CMS credentials…</p>
        </div>
      </div>
    );
  }

  /* ── GATEKEEPER: LOGIN VIEW ── */
  if (!authState.loggedIn) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogoIcon}>
              <BrandLogoIcon size={48} />
            </div>
            <h1 className={styles.loginTitle}>Pezu Medics CMS</h1>
            <p className={styles.loginSubtitle}>
              Sign in to manage product inventory, pricing (₦), descriptions, and media.
            </p>
          </div>

          {loginError && <div className={styles.errorMessage}>{loginError}</div>}

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="login-identifier" className={styles.label}>
                Email or Username
              </label>
              <input
                id="login-identifier"
                type="text"
                className={styles.input}
                value={loginForm.identifier}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, identifier: e.target.value }))
                }
                placeholder="admin@pezumedics.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className={styles.input}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.loginBtn} disabled={loginLoading}>
              {loginLoading ? "Authenticating…" : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className={styles.demoBox}>
            <div className={styles.demoBoxTitle}>
              <span>Default Credentials</span>
              <button
                type="button"
                className={styles.demoFillBtn}
                onClick={() =>
                  setLoginForm({ identifier: "admin@pezumedics.com", password: "admin123" })
                }
              >
                Auto-fill
              </button>
            </div>
            <p className={styles.demoCreds}>
              User: <strong>admin@pezumedics.com</strong>
              <br />
              Pass: <strong>admin123</strong>
            </p>
          </div>

          <Link href="/" className={styles.loginBackLink}>
            ← Back to Public Product Catalog
          </Link>
        </div>
      </main>
    );
  }

  /* ── AUTHENTICATED: CMS DASHBOARD VIEW ── */
  return (
    <div className={styles.adminWrapper}>
      {/* ── Navigation Header ── */}
      <header className={styles.adminNav} role="banner">
        <div className={`container ${styles.adminNavInner}`}>
          <div className={styles.navBrand}>
            <div style={{ color: "var(--color-accent)" }}>
              <BrandLogoIcon size={30} />
            </div>
            <div>
              <span className={styles.navBrandTitle}>Pezu Medics CMS</span>
            </div>
            <span className={styles.navBadge}>
              <span className={styles.badgePulse} />
              Live Sync
            </span>
          </div>

          <div className={styles.navActions}>
            <Link href="/" target="_blank" className={styles.viewStoreBtn} title="Open Live Store in New Tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View Store
            </Link>

            <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body ── */}
      <main className={`container ${styles.dashboardMain}`}>
        {/* KPI Stats Grid (Total Products & Categories only) */}
        <section className={styles.statsGrid} aria-label="CMS Overview Statistics">
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Products</span>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statDesc}>Listed in live catalog</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Categories</span>
            <span className={styles.statValue}>{stats.categories}</span>
            <span className={styles.statDesc}>Medical product sectors</span>
          </div>
        </section>

        {/* Controls Bar: Search, Category Filter & Add Product */}
        <section className={styles.controlsBar}>
          <div className={styles.searchFilterGroup}>
            <div className={styles.searchInputWrap}>
              <span className={styles.searchIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search products by title, category, or description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories ({products.length})</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button onClick={openAddModal} className={styles.addBtn} id="btn-add-product">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Product
          </button>
        </section>

        {/* Products Table (Desktop) & Cards (Mobile/Tablet) */}
        <div className={styles.tableCard}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <PlaceholderIcon size={48} />
              </div>
              <h3>No products found</h3>
              <p>
                {searchTerm || categoryFilter !== "all"
                  ? "Try clearing your filters or search keywords."
                  : "Click 'Add New Product' to start populating your catalog."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className={styles.tableWrap}>
                <table className={styles.productTable}>
                  <thead>
                    <tr>
                      <th style={{ width: "70px" }}>Image</th>
                      <th>Product Details</th>
                      <th>Category</th>
                      <th>Price (Naira)</th>
                      <th>Media Source</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} id={`cms-row-${p.id}`}>
                        <td>
                          <div className={styles.thumbCell}>
                            {p.image ? (
                              <img src={p.image} alt={p.name} className={styles.thumbImg} />
                            ) : (
                              <div className={styles.thumbPlaceholder}>
                                <PlaceholderIcon size={20} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.productTitleCell}>
                            <span className={styles.productNameText}>{p.name}</span>
                            {p.description && (
                              <div className={styles.productDescSnippet} title={p.description}>
                                {p.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={styles.categoryTag}>{p.category}</span>
                        </td>
                        <td className={styles.priceTag}>
                          ₦{Number(p.price || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          {p.image ? (
                            <span className={styles.statusCustom}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="6"/>
                              </svg>
                              Custom Image
                            </span>
                          ) : (
                            <span className={styles.statusPlaceholder}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="6"/>
                              </svg>
                              Placeholder Icon
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className={styles.actionBtns} style={{ justifyContent: "flex-end" }}>
                            <button
                              onClick={() => openEditModal(p)}
                              className={styles.editBtn}
                              title={`Edit ${p.name}`}
                              id={`edit-prod-${p.id}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(p)}
                              className={styles.deleteBtn}
                              title={`Delete ${p.name}`}
                              id={`delete-prod-${p.id}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className={styles.mobileCardsList}>
                {filteredProducts.map((p) => (
                  <div key={p.id} className={styles.mobileCard} id={`cms-mobile-card-${p.id}`}>
                    <div className={styles.mobileCardTop}>
                      <div className={styles.thumbCell}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} className={styles.thumbImg} />
                        ) : (
                          <div className={styles.thumbPlaceholder}>
                            <PlaceholderIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className={styles.mobileCardInfo}>
                        <span className={styles.categoryTag}>{p.category}</span>
                        <h4 className={styles.mobileCardTitle}>{p.name}</h4>
                        {p.description && (
                          <p className={styles.mobileCardDesc}>{p.description}</p>
                        )}
                        <span className={styles.priceTag}>
                          ₦{Number(p.price || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className={styles.mobileCardBottom}>
                      <div>
                        {p.image ? (
                          <span className={styles.statusCustom}>Custom Image</span>
                        ) : (
                          <span className={styles.statusPlaceholder}>Placeholder</span>
                        )}
                      </div>
                      <div className={styles.actionBtns}>
                        <button onClick={() => openEditModal(p)} className={styles.editBtn}>
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(p)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── ADD / EDIT MODAL ── */}
      {modalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modalMode === "create" ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {formError && <div className={styles.errorMessage}>{formError}</div>}

            <form onSubmit={handleSaveProduct} className={styles.modalForm}>
              {/* Product Name */}
              <div className={styles.formGroup}>
                <label htmlFor="prod-name" className={styles.label}>
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Digital Pulse Oximeter Pro"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Category */}
              <div className={styles.formGroup}>
                <label htmlFor="prod-category" className={styles.label}>
                  Category *
                </label>
                <input
                  id="prod-category"
                  type="text"
                  className={styles.input}
                  list="categories-list"
                  placeholder="e.g. Diagnostics, PPE, Monitoring"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
                <datalist id="categories-list">
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              {/* Price in Naira with Commas, .00 & Scale Indicator */}
              <div className={styles.formGroup}>
                <label htmlFor="prod-price" className={styles.label}>
                  Price (₦ Naira by Default) *
                </label>
                <div className={styles.inputPrefixWrap}>
                  <span className={styles.prefixSymbol}>₦</span>
                  <input
                    id="prod-price"
                    type="text"
                    inputMode="decimal"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    required
                  />
                </div>

                {/* Real-time Scale & Denomination Indicator */}
                {activePriceScale && (
                  <div className={styles.priceScaleBox} aria-live="polite">
                    <div className={styles.priceScaleHeader}>
                      <span
                        className={styles.priceScaleBadge}
                        style={{ backgroundColor: activePriceScale.badgeColor }}
                      >
                        {activePriceScale.scale}
                      </span>
                      <span className={styles.priceScaleFormatted}>
                        {activePriceScale.formatted}
                      </span>
                    </div>
                    <p className={styles.priceScaleWords}>{activePriceScale.words}</p>
                  </div>
                )}
              </div>

              {/* Product Description with Multi-line Line Breaks */}
              <div className={styles.formGroup}>
                <label htmlFor="prod-desc" className={styles.label}>
                  Product Description
                </label>
                <textarea
                  id="prod-desc"
                  className={styles.textarea}
                  placeholder={"100 pieces per pack\n40 packs per carton"}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                  ↵ Press Enter to add line breaks — they will appear on separate lines on the public website.
                </p>
              </div>

              {/* Product Image Input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Image</label>
                <div className={styles.imageModeToggle}>
                  <button
                    type="button"
                    className={`${styles.imageModeBtn} ${
                      imageInputMode === "upload" ? styles.active : ""
                    }`}
                    onClick={() => setImageInputMode("upload")}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    className={`${styles.imageModeBtn} ${
                      imageInputMode === "url" ? styles.active : ""
                    }`}
                    onClick={() => setImageInputMode("url")}
                  >
                    Image URL
                  </button>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <div
                      className={styles.uploadDropzone}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent)" }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                        {uploadingImage ? "Uploading image…" : "Click to select and upload product image"}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                        PNG, JPG, WEBP, or SVG
                      </p>
                    </div>
                  </div>
                ) : (
                  <input
                    type="url"
                    className={styles.input}
                    placeholder="https://example.com/medical-product.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  />
                )}

                {/* Image Live Preview */}
                {formData.image ? (
                  <div className={styles.previewThumbWrap}>
                    <img src={formData.image} alt="Preview" className={styles.previewImg} />
                    <div className={styles.previewDetails}>
                      <span className={styles.previewLabel}>Active Image</span>
                      <span className={styles.previewUrl}>{formData.image}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      title="Clear image"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className={styles.helpText}>
                    💡 If no image is added, the product catalog will automatically use the standard Pezu Medics placeholder icon.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={savingProduct || uploadingImage}
                  id="btn-save-product"
                >
                  {savingProduct ? "Saving…" : modalMode === "create" ? "Add to Catalog" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteModalOpen && productToDelete && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard} style={{ maxWidth: "420px" }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} style={{ color: "#dc2626" }}>
                Confirm Deletion
              </h2>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.875rem", lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
              Are you sure you want to delete <strong>{productToDelete.name}</strong> (₦{Number(productToDelete.price || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})?
              <br />
              This will immediately and completely remove the product and its uploaded media files from the database and storage.
            </p>

            <div className={styles.modalActions} style={{ marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className={styles.deleteBtn}
                style={{ padding: "10px 20px" }}
                disabled={deleting}
                id="btn-confirm-delete"
              >
                {deleting ? "Deleting…" : "Yes, Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notifications ── */}
      <div className={styles.toastWrap} aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${
              t.type === "error" ? styles.toastError : styles.toastSuccess
            }`}
          >
            {t.type === "success" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
