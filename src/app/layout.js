import "./globals.css";

export const metadata = {
  title: "Pezu Medics – Medical Product Catalog",
  description:
    "Browse our curated range of high-quality medical and diagnostic equipment. Switch between list and grid views to find exactly what you need.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
