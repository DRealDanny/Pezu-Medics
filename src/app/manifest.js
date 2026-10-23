/**
 * Web App Manifest for Pezu Medics
 * Meets PWA and search engine discovery standards
 */
export default function manifest() {
  return {
    name: "Pezu Standard Medics Concern",
    short_name: "Pezu Medics",
    description:
      "Certified Medical Equipment, Diagnostic Laboratory Test Kits, and Surgical Consumables distributor in Lagos, Nigeria.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef4fd",
    theme_color: "#0071e3",
    lang: "en-NG",
    orientation: "portrait-primary",
    categories: ["medical", "health", "shopping", "business"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
