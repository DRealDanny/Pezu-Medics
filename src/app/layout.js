import "./globals.css";
import CurtainReveal from "@/components/CurtainReveal";

export const metadata = {
  title: "Pezu Medics – Medical Product Catalog",
  description:
    "Browse our curated range of high-quality medical and diagnostic equipment. Switch between list and grid views to find exactly what you need.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CurtainReveal />
        {children}
      </body>
    </html>
  );
}

