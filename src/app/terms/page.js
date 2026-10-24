import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { SearchProvider } from "@/context/SearchContext";
import TermsClient from "./TermsClient";
import styles from "./terms.module.css";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Official Terms and Conditions governing access to, purchases, supply agreements, and medical equipment distribution with PEZU STANDARD MEDICS CONCERN NIG.",
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
          <TermsClient />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </SearchProvider>
  );
}
