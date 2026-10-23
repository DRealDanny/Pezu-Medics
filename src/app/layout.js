import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CurtainReveal from "@/components/CurtainReveal";
import StructuredData from "@/components/StructuredData/StructuredData";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pezustandardmedics.com";

export const viewport = {
  themeColor: "#0071e3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Pezu Standard Medics Concern | Certified Medical Supplies, Diagnostic Equipment & Surgical Consumables Lagos Nigeria",
    template: "%s | Pezu Standard Medics Concern",
  },
  description:
    "Nigeria's trusted medical supply partner in Idumota, Lagos. Source certified clinical diagnostic equipment, rapid lab test kits, hospital disposables, and surgical consumables at wholesale & retail prices with same-day dispatch nationwide.",
  applicationName: "Pezu Standard Medics Concern",
  authors: [{ name: "Pezu Standard Medics Concern", url: SITE_URL }],
  creator: "Pezu Standard Medics Concern",
  publisher: "Pezu Standard Medics Concern",
  category: "Medical Equipment, Hospital Supplies & Diagnostics",
  classification: "Medical Device Distribution & Clinical Consumables",
  keywords: [
    "Pezu Medics",
    "Pezu Standard Medics Concern",
    "medical supplies Lagos Nigeria",
    "medical equipment supplier Idumota Lagos",
    "buy medical supplies Nigeria",
    "surgical consumables Lagos",
    "disposable syringes wholesale Nigeria",
    "sterile surgical gloves Lagos",
    "laboratory diagnostic test kits Nigeria",
    "malaria test kits price Nigeria",
    "hepatitis test kits Lagos",
    "specimen bottles EDTA lithium heparin",
    "centrifuge machine price Lagos",
    "autoclave sterilizer Nigeria",
    "patient monitor suppliers Lagos",
    "hospital disposables wholesale Idumota",
    "medical equipment distributor Nigeria",
    "rapid diagnostic test kits IVD",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Pezu Standard Medics Concern",
    title:
      "Pezu Standard Medics Concern | Certified Medical Supplies & Diagnostic Equipment Lagos Nigeria",
    description:
      "Nigeria's trusted medical supply partner in Idumota, Lagos. Source certified clinical diagnostic equipment, rapid lab test kits, hospital disposables, and surgical consumables at wholesale & retail prices.",
    images: [
      {
        url: "/open-graph.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Pezu Standard Medics Concern - Medical Supplies, Lab Diagnostics & Surgical Consumables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pezu Standard Medics Concern | Medical Supplies & Diagnostic Equipment Lagos",
    description:
      "Leading Nigerian medical distributor in Idumota, Lagos. Certified surgical consumables, rapid diagnostic kits, and hospital equipment with nationwide dispatch.",
    images: ["/open-graph.png"],
    creator: "@pezumedics",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  other: {
    "geo.region": "NG-LA",
    "geo.placename": "Idumota, Lagos Island",
    "geo.position": "6.4550;3.3841",
    ICBM: "6.4550, 3.3841",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <StructuredData />
        <Script
          id="scroll-reset"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>
        <CurtainReveal />
        {children}
      </body>
    </html>
  );
}
