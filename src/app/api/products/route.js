import products from "@/data/products.json";
import { NextResponse } from "next/server";

/**
 * GET /api/products
 *
 * Currently serves products from the local JSON file.
 * To connect a headless CMS, replace the import above with a fetch
 * call to your CMS API and return that data instead.
 *
 * Example (Contentful, Sanity, etc.):
 *   const res = await fetch("https://your-cms/products", { next: { revalidate: 60 } });
 *   const products = await res.json();
 */
export async function GET() {
  return NextResponse.json(products);
}
