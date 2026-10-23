import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CurtainReveal from "@/components/CurtainReveal";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
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
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <CurtainReveal />
        {children}
      </body>
    </html>
  );
}

