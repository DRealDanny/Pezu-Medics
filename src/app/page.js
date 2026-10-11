import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductCatalog from "@/components/ProductCatalog/ProductCatalog";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ProductCatalog />
      </main>
      <Footer />
    </>
  );
}
