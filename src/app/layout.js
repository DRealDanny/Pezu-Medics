import { Inter } from "next/font/google";
import "./globals.css";
import CurtainReveal from "@/components/CurtainReveal";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <CurtainReveal />
        {children}
      </body>
    </html>
  );
}

