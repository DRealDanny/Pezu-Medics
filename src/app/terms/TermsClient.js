"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { TERMS_SECTIONS, EFFECTIVE_DATE } from "./termsData";
import styles from "./terms.module.css";

// Helper to format leading clause numbers (e.g. 1.1, 12.2), bold text (**text**) and markdown links ([label](url))
function renderFormattedContent(text) {
  if (!text || typeof text !== "string") return text;

  let prefixElement = null;
  let remainingText = text;

  // Highlight leading clause numbers like "1.1 ", "12.3 " in blue, flat with no border
  const clauseMatch = remainingText.match(/^(\d+\.\d+)(\s+)/);
  if (clauseMatch) {
    prefixElement = (
      <span key="clause-num" className={styles.clauseNum}>
        {clauseMatch[1]}
      </span>
    );
    remainingText = remainingText.slice(clauseMatch[0].length);
  }

  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = [];
  if (prefixElement) {
    parts.push(prefixElement);
    parts.push(" ");
  }

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(remainingText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(remainingText.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong key={match.index} className={styles.boldText}>
          {boldText}
        </strong>
      );
    } else if (token.startsWith("[")) {
      const closingBracket = token.indexOf("](");
      if (closingBracket !== -1) {
        const label = token.slice(1, closingBracket);
        const url = token.slice(closingBracket + 2, -1);
        const isExternal = url.startsWith("http://") || url.startsWith("https://");
        parts.push(
          <a
            key={match.index}
            href={url}
            className={styles.link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {label}
          </a>
        );
      } else {
        parts.push(token);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < remainingText.length) {
    parts.push(remainingText.slice(lastIndex));
  }

  return parts;
}

export default function TermsClient() {
  const [activeId, setActiveId] = useState("section-1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);
  const isScrollingByClick = useRef(false);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return TERMS_SECTIONS;
    return TERMS_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.num.includes(q) ||
        String(parseInt(sec.num, 10)).includes(q)
    );
  }, [filterQuery]);

  // Scroll to section smoothly
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    isScrollingByClick.current = true;
    setActiveId(id);
    setIsDrawerOpen(false);

    // Calculate position with offset for sticky header and mobile bar
    const yOffset = window.innerWidth < 1024 ? -140 : -100;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingByClick.current = false;
    }, 700);
  }, []);

  // Guarantee the page starts from top on normal load/reload,
  // but honors deep links to specific sections (e.g. Refund Policy -> section-12)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = window.location.hash ? window.location.hash.replace("#", "") : "";
    const params = new URLSearchParams(window.location.search);
    const paramSection = params.get("section");
    const targetId = hash.startsWith("section-")
      ? hash
      : paramSection && paramSection.startsWith("section-")
      ? paramSection
      : null;

    if (targetId) {
      const timer = setTimeout(() => {
        scrollToSection(targetId);
        // Clean URL after scrolling so future manual reloads start from the top
        try {
          window.history.replaceState(null, "", window.location.pathname);
        } catch (_) {}
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // Standard visit or reload: start at absolute top
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection]);

  // Listen for custom navigate events (e.g. from Footer Refund Policy when on /terms)
  // and hashchange events
  useEffect(() => {
    const handleCustomNav = (e) => {
      if (e.detail?.id) {
        scrollToSection(e.detail.id);
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash ? window.location.hash.replace("#", "") : "";
      if (hash && hash.startsWith("section-")) {
        window.history.replaceState(null, "", window.location.pathname);
        scrollToSection(hash);
      }
    };

    window.addEventListener("terms:navigate-section", handleCustomNav);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("terms:navigate-section", handleCustomNav);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [scrollToSection]);

  // Scrollspy: update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingByClick.current) return;

      const triggerOffset = window.innerWidth < 1024 ? 160 : 130;
      let currentId = TERMS_SECTIONS[0].id;

      for (let i = 0; i < TERMS_SECTIONS.length; i++) {
        const sec = TERMS_SECTIONS[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerOffset) {
            currentId = sec.id;
          } else {
            break;
          }
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep active item in view inside the desktop sidebar
  useEffect(() => {
    if (!desktopNavRef.current) return;
    const activeBtn = desktopNavRef.current.querySelector(
      `[data-section-id="${activeId}"]`
    );
    if (activeBtn) {
      const container = desktopNavRef.current;
      const btnTop = activeBtn.offsetTop;
      const btnHeight = activeBtn.offsetHeight;
      const cTop = container.scrollTop;
      const cHeight = container.clientHeight;

      if (btnTop < cTop + 40) {
        container.scrollTo({ top: Math.max(0, btnTop - 40), behavior: "smooth" });
      } else if (btnTop + btnHeight > cTop + cHeight - 40) {
        container.scrollTo({
          top: btnTop + btnHeight - cHeight + 40,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  // Lock body scroll and handle Escape key when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsDrawerOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isDrawerOpen]);

  return (
    <div className={styles.pageWrap}>
      {/* ── Sticky Mobile & Tablet TOC Icon Only (< 1024px) ── */}
      <aside className={styles.mobileBarWrapper} aria-label="Table of Contents Quick Navigation">
        <div className={styles.mobileBarInner}>
          <button
            type="button"
            className={`${styles.mobileHamburgerBtn} ${
              isDrawerOpen ? styles.mobileHamburgerBtnActive : ""
            }`}
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            aria-expanded={isDrawerOpen}
            aria-controls="terms-mobile-drawer"
            aria-label="Table of Contents"
            title="Table of Contents"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Mobile & Tablet Open Canvas Drawer ── */}
      <div
        className={`${styles.drawerBackdrop} ${
          isDrawerOpen ? styles.drawerBackdropOpen : styles.drawerBackdropClosed
        }`}
        onClick={() => setIsDrawerOpen(false)}
        role="presentation"
        aria-hidden={!isDrawerOpen}
      >
        <div
          id="terms-mobile-drawer"
          className={`${styles.drawerSheet} ${
            isDrawerOpen ? styles.drawerSheetOpen : styles.drawerSheetClosed
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal={isDrawerOpen ? "true" : undefined}
          aria-label="Table of Contents"
        >
          <div className={styles.drawerHeader}>
            <div className={styles.drawerHeaderLeft}>
              <span className={styles.drawerHeaderIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </span>
              <div>
                <h3 className={styles.drawerTitle}>Table of Contents</h3>
                <span className={styles.drawerSubtitle}>{TERMS_SECTIONS.length} Sections</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close Table of Contents"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Quick Filter Search */}
          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search sections..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className={styles.searchInput}
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                className={styles.clearSearchBtn}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Nav List */}
          <nav
            ref={mobileNavRef}
            className={styles.drawerNavList}
            aria-label="Mobile sections"
          >
            {filteredSections.map((sec, idx) => {
              const isActive = activeId === sec.id;
              return (
                <button
                  key={sec.id}
                  data-section-id={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  style={{ "--item-idx": Math.min(idx, 15) }}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.navNum}>{sec.num}</span>
                  <span className={styles.navText}>{sec.title}</span>
                  {isActive && <span className={styles.activeDot} />}
                </button>
              );
            })}
            {filteredSections.length === 0 && (
              <div className={styles.noResults}>No matching sections found</div>
            )}
          </nav>
        </div>
      </div>

      {/* ── Main Layout: Sticky Desktop TOC (Left) + Document Card (Right) ── */}
      <div className={styles.mainGrid}>
        {/* ── Desktop TOC Sidebar (>= 1024px) ── */}
        <aside className={styles.desktopSidebar} aria-label="Table of Contents">
          <div className={styles.tocCard}>
            <div className={styles.tocCardHeader}>
              <div className={styles.tocHeaderTitleWrap}>
                <span className={styles.tocHeaderIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </span>
                <span className={styles.tocHeaderTitle}>Table of Contents</span>
              </div>
              <span className={styles.tocBadge}>{TERMS_SECTIONS.length} Sections</span>
            </div>

            {/* Quick Filter Search */}
            <div className={styles.searchBox}>
              <svg
                className={styles.searchIcon}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Quick filter..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className={styles.searchInput}
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  className={styles.clearSearchBtn}
                  aria-label="Clear filter"
                >
                  ×
                </button>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav
              ref={desktopNavRef}
              className={styles.tocNavList}
              aria-label="Desktop terms sections"
            >
              {filteredSections.map((sec) => {
                const isActive = activeId === sec.id;
                return (
                  <button
                    key={sec.id}
                    data-section-id={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className={styles.navNum}>{sec.num}</span>
                    <span className={styles.navText}>{sec.title}</span>
                    {isActive && <span className={styles.activeDot} />}
                  </button>
                );
              })}
              {filteredSections.length === 0 && (
                <div className={styles.noResults}>No matching sections</div>
              )}
            </nav>
          </div>
        </aside>

        {/* ── Document Column (Right) ── */}
        <div className={styles.docColumn}>
          {/* ── Page Header: Subheadings side by side across all screens ── */}
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Terms and Conditions</h1>
            <div className={styles.subheadingsRow}>
              <span className={styles.pageSubtitle}>Official Policy &amp; Legal Terms</span>
              <span className={styles.subheadingDivider} aria-hidden="true">•</span>
              <span className={styles.effectiveDate}>
                <strong>Effective date:</strong> {EFFECTIVE_DATE}
              </span>
            </div>
          </header>

          {/* ── Flat & Clean Document Container ── */}
          <article className={styles.docCard}>
            {TERMS_SECTIONS.map((sec, idx) => (
              <section
                key={sec.id}
                id={sec.id}
                className={`${styles.section} ${
                  idx < TERMS_SECTIONS.length - 1 ? styles.sectionDivider : ""
                }`}
              >
                {/* Section Heading: Blue Flat Number */}
                <h2 className={styles.secTitle}>
                  <span className={styles.secNumber}>{parseInt(sec.num, 10)}.</span>{" "}
                  {sec.title}
                </h2>

                {/* Body Content */}
                <div className={styles.secBody}>
                  {sec.paragraphs?.map((p, i) => (
                    <p key={i}>{renderFormattedContent(p)}</p>
                  ))}

                  {sec.list && (
                    <ul className={styles.secList}>
                      {sec.list.map((item, i) => (
                        <li key={i} className={styles.secListItem}>
                          <span className={styles.listAlpha}>
                            {String.fromCharCode(97 + i)}.
                          </span>
                          <span className={styles.listText}>
                            {renderFormattedContent(item)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.afterParagraphs?.map((p, i) => (
                    <p key={i}>{renderFormattedContent(p)}</p>
                  ))}

                  {/* Section 27: Contact Details (Flat Text, No Border) */}
                  {sec.isContactCard && sec.contactInfo && (
                    <ul className={styles.contactList}>
                      <li>
                        <strong>Business Name:</strong>{" "}
                        <span>{sec.contactInfo.companyName}</span>
                      </li>
                      <li>
                        <strong>Registered Address:</strong>{" "}
                        <span>{sec.contactInfo.address}</span>
                      </li>
                      <li>
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${sec.contactInfo.email}`}
                          className={styles.link}
                        >
                          {sec.contactInfo.email}
                        </a>
                      </li>
                      <li>
                        <strong>Telephone:</strong>{" "}
                        <a
                          href={`tel:${sec.contactInfo.phone.replace(/\s+/g, "")}`}
                          className={styles.link}
                        >
                          {sec.contactInfo.phoneFormatted || sec.contactInfo.phone}
                        </a>
                      </li>
                      <li>
                        <strong>Website:</strong>{" "}
                        <a
                          href={sec.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          {sec.contactInfo.website}
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
