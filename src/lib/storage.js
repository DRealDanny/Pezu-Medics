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

function sanitizeAndDeduplicate(list) {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set();
  const result = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const idStr = String(item.id || "").trim();
    if (!idStr || seenIds.has(idStr)) continue;
    seenIds.add(idStr);
    result.push({
      id: idStr,
      name: String(item.name || "").trim(),
      price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
      category: String(item.category || "General Equipment").trim(),
      description: item.description ? String(item.description).trim() : "",
      image: item.image ? String(item.image).trim() : "",
    });
  }
  return result;
}

let knownBlobUrl = null;

/**
 * Get products list from Vercel Blob or local disk
 */
export async function getProducts() {
  if (isVercelBlobEnabled()) {
    try {
      const { list } = await import("@vercel/blob");

      // Resolve known blob URL if not already cached in this process
      if (!knownBlobUrl) {
        const { blobs } = await list({ prefix: "data/products.json" });
        if (blobs && blobs.length > 0) {
          const exact = blobs.find((b) => b.pathname === "data/products.json") || blobs[0];
          knownBlobUrl = exact.url;
        }
      }

      if (knownBlobUrl) {
        // Fetch directly from Vercel Blob with cache-busting timestamp
        const cacheBustedUrl = `${knownBlobUrl}?t=${Date.now()}`;
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
            return sanitizeAndDeduplicate(data);
          }
        }
      }
    } catch (err) {
      console.warn("Vercel Blob read error, falling back to local seed:", err.message);
    }
  }

  // Fallback to local filesystem
  const seed = await getSeedProducts();
  return sanitizeAndDeduplicate(seed);
}

/**
 * Save products list to Vercel Blob and/or local disk
 */
export async function saveProducts(products) {
  const cleanProducts = sanitizeAndDeduplicate(products);

  if (isVercelBlobEnabled()) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put("data/products.json", JSON.stringify(cleanProducts, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
      });
      knownBlobUrl = blob.url;
    } catch (blobErr) {
      console.error("Failed to save products to Vercel Blob:", blobErr);
      throw blobErr;
    }
  }

  // Also attempt to sync to local disk if running in writable environment
  try {
    await writeFile(LOCAL_PRODUCTS_FILE, JSON.stringify(cleanProducts, null, 2), "utf-8");
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
