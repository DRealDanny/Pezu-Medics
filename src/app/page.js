import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductCatalog from "@/components/ProductCatalog/ProductCatalog";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ProductCatalog />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
