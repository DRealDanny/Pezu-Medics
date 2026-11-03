import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductCatalog from "@/components/ProductCatalog/ProductCatalog";
import HeroSection from "@/components/HeroSection/HeroSection";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { SearchProvider } from "@/context/SearchContext";
import { CartProvider } from "@/context/CartContext";

export default function HomePage() {
  return (
    <SearchProvider>
      <CartProvider>
        <Header />
        <main>
          <HeroSection />
          <ProductCatalog />
        </main>
        <Footer />
        <ScrollToTop />
      </CartProvider>
    </SearchProvider>
  );
}
