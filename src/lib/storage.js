import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";

const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "products.json");

/**
 * Check whether Vercel Blob is configured via environment variable
 */
export function isVercelBlobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Read the default initial products from local seed file
 */
async function getSeedProducts() {
  try {
    const raw = await readFile(LOCAL_PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Could not read local seed products file:", error.message);
    return [];
  }
}

let inMemoryProductsCache = null;
let cacheTimestamp = 0;

/**
 * Get products list from Vercel Blob or local disk
 */
export async function getProducts() {
  // If memory cache is recent (< 10s), return immediately for instantaneous updates
  if (inMemoryProductsCache && Date.now() - cacheTimestamp < 10000) {
    return inMemoryProductsCache;
  }

  if (isVercelBlobEnabled()) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "data/products.json", limit: 1 });
      if (blobs && blobs.length > 0) {
        // Append timestamp query parameter to bypass Vercel Edge CDN caching
        const cacheBustedUrl = `${blobs[0].url}?t=${Date.now()}`;
        const res = await fetch(cacheBustedUrl, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            inMemoryProductsCache = data;
            cacheTimestamp = Date.now();
            return data;
          }
        }
      }
    } catch (err) {
      console.warn("Vercel Blob read error, falling back to local seed:", err.message);
    }
  }

  // Fallback to local filesystem
  const seed = await getSeedProducts();
  inMemoryProductsCache = seed;
  cacheTimestamp = Date.now();
  return seed;
}

/**
 * Save products list to Vercel Blob and/or local disk
 */
export async function saveProducts(products) {
  // Immediately update in-memory cache so subsequent reads are instantaneous
  inMemoryProductsCache = products;
  cacheTimestamp = Date.now();

  if (isVercelBlobEnabled()) {
    try {
      const { put } = await import("@vercel/blob");
      await put("data/products.json", JSON.stringify(products, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
      });
    } catch (blobErr) {
      console.error("Failed to save products to Vercel Blob:", blobErr);
      throw blobErr;
    }
  }

  // Also attempt to sync to local disk if running in writable environment
  try {
    await writeFile(LOCAL_PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (fsErr) {
    // If on read-only Vercel serverless, disk write will fail but Blob succeeded
    if (!isVercelBlobEnabled()) {
      throw fsErr;
    }
  }
}

/**
 * Store an uploaded image in Vercel Blob or local public/uploads/
 */
export async function saveUploadedImage({ filename, buffer, contentType = "image/webp" }) {
  if (isVercelBlobEnabled()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType,
    });
    return blob.url;
  }

  // Local filesystem fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

/**
 * Delete an image from Vercel Blob or local disk
 */
export async function deleteStoredImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;

  if (isVercelBlobEnabled() && (imageUrl.includes("blob.vercel-storage.com") || imageUrl.startsWith("http"))) {
    try {
      const { del } = await import("@vercel/blob");
      await del(imageUrl);
      return;
    } catch (err) {
      console.warn("Could not delete image from Vercel Blob:", err.message);
    }
  }

  if (imageUrl.startsWith("/uploads/")) {
    try {
      const filename = path.basename(imageUrl);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await unlink(filePath);
    } catch {
      // Ignored if file doesn't exist
    }
  }
}
