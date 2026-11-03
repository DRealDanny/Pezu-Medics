import { writeFileSync } from "node:fs";
import path from "node:path";

const LIVE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pezustandardmedics.com";
const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "products.json");

async function syncProducts() {
  console.log(`Fetching latest products from ${LIVE_URL}/api/products...`);
  const res = await fetch(`${LIVE_URL}/api/products?t=${Date.now()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch live products: HTTP ${res.status}`);
  }

  const products = await res.json();
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Received empty or invalid product list from live site");
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf-8");
  console.log(`✅ Successfully synced ${products.length} products to src/data/products.json`);
}

syncProducts().catch((err) => {
  console.error("❌ Sync failed:", err.message);
  process.exit(1);
});

