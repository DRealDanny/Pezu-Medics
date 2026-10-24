import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { SearchProvider } from "@/context/SearchContext";
import styles from "./terms.module.css";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions for ordering, procurement, and medical supply services with Pezu Standard Medics Concern.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <SearchProvider>
      <div className={styles.termsPage}>
        <Header />

        <main className={styles.mainContent}>
          <div className="container">
            {/* ── Breadcrumb & Navigation Bar ── */}
            <div className={styles.topNavRow}>
              <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
                <Link href="/" className={styles.breadcrumbLink}>
                  Home
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span>Legal</span>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent} aria-current="page">
                  Terms &amp; Conditions
                </span>
              </nav>

              <Link href="/" className={styles.backBtn}>
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
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>

            {/* ── Hero Card ── */}
            <header className={styles.heroCard}>
              <div className={styles.badge}>
                <span className={styles.badgeDot} />
                <span>Legal Agreement</span>
              </div>
              <h1 className={styles.title}>Terms &amp; Conditions</h1>
              <p className={styles.subtitle}>
                Official terms and service conditions governing purchases, supply
                agreements, and operations at Pezu Standard Medics Concern.
              </p>
              <div className={styles.metaInfo}>
                <span className={styles.metaItem}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Effective Date: 2026</span>
                </span>
                <span>•</span>
                <span className={styles.metaItem}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Pezu Standard Medics Concern</span>
                </span>
              </div>
            </header>

            {/* ── Main Content Container ── */}
            <article className={styles.contentCard} id="terms-content">
              {/* Ready placeholder banner */}
              <div className={styles.placeholderBanner}>
                <svg
                  className={styles.placeholderIcon}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className={styles.placeholderText}>
                  <h4>Page Ready for Content</h4>
                  <p>
                    The Terms &amp; Conditions page structure has been established and linked from the footer.
                    Please provide your specific clauses, legal policies, or terms text to populate this section.
                  </p>
                </div>
              </div>

              {/* Preliminary sections (will be replaced or filled with user's content) */}
              <section className={styles.termsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>01.</span>
                  <h2 className={styles.sectionTitle}>Introduction &amp; Agreement</h2>
                </div>
                <div className={styles.sectionBody}>
                  <p>
                    These Terms and Conditions govern the sale and distribution of medical equipment,
                    laboratory diagnostics, and hospital consumables provided by Pezu Standard Medics Concern.
                    By placing an order or using our services, you agree to be bound by these provisions.
                  </p>
                </div>
              </section>

              <section className={styles.termsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>02.</span>
                  <h2 className={styles.sectionTitle}>Product Verification &amp; Compliance</h2>
                </div>
                <div className={styles.sectionBody}>
                  <p>
                    All diagnostic reagents, surgical consumables, and clinical apparatus supplied are sourced
                    from verified manufacturers and handled under appropriate storage and handling protocols.
                  </p>
                </div>
              </section>

              <section className={styles.termsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>03.</span>
                  <h2 className={styles.sectionTitle}>Orders, Invoicing &amp; Delivery</h2>
                </div>
                <div className={styles.sectionBody}>
                  <p>
                    Orders are processed upon confirmation. Invoices are issued in Nigerian Naira (NGN),
                    and nationwide logistics are coordinated for prompt dispatch to healthcare facilities.
                  </p>
                </div>
              </section>

              <section className={styles.termsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>04.</span>
                  <h2 className={styles.sectionTitle}>Support &amp; Inquiries</h2>
                </div>
                <div className={styles.sectionBody}>
                  <p>
                    For any questions regarding these terms, contract purchasing, or order tracking, please reach out
                    directly to our customer support or legal desk.
                  </p>
                </div>
              </section>
            </article>

            {/* ── Contact / Inquiry Card ── */}
            <div className={styles.inquiriesCard}>
              <div className={styles.inquiriesContent}>
                <h3>Questions about our Terms?</h3>
                <p>
                  Our team is available 24/7 to assist clinics, hospitals, and medical practitioners across Nigeria.
                </p>
              </div>
              <div className={styles.inquiriesActions}>
                <a
                  href="tel:+2348105117437"
                  className={styles.contactBtn}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Call Us</span>
                </a>
                <a
                  href="https://wa.me/2348105117437?text=Hello%20Pezu%20Standard%20Medics,%20I%20have%20an%20inquiry%20regarding%20your%20terms%20and%20conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <span>WhatsApp Chat ↗</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </SearchProvider>
  );
}
