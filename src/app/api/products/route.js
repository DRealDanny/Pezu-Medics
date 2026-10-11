import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { verifyAdminSession } from "@/lib/auth";

const PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "products.json");

/**
 * Helper to read current products list from disk
 */
async function getProducts() {
  try {
    const raw = await readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
}

/**
 * Helper to write products list to disk
 */
async function saveProducts(products) {
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

/**
 * GET /api/products
 * Returns the current list of products from disk.
 */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

/**
 * POST /api/products
 * Add a new product (Admin authenticated).
 */
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, category, image } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number in Naira." },
        { status: 400 }
      );
    }

    const products = await getProducts();

    const newProduct = {
      id: String(Date.now()),
      name: name.trim(),
      price: numericPrice,
      category: (category && category.trim()) || "General Equipment",
      image: image && image.trim() ? image.trim() : "",
    };

    // Prepend to top of catalog
    const updatedProducts = [newProduct, ...products];
    await saveProducts(updatedProducts);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}

/**
 * PUT /api/products
 * Update an existing product (Admin authenticated).
 */
export async function PUT(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, price, category, image } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required for editing." }, { status: 400 });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number in Naira." },
        { status: 400 }
      );
    }

    const products = await getProducts();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const updatedProduct = {
      ...products[index],
      name: name.trim(),
      price: numericPrice,
      category: (category && category.trim()) || products[index].category || "General Equipment",
      image: image !== undefined ? (image ? image.trim() : "") : products[index].image || "",
    };

    products[index] = updatedProduct;
    await saveProducts(products);

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

/**
 * DELETE /api/products
 * Delete a product by ID (Admin authenticated).
 */
export async function DELETE(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Product ID is required for deletion." }, { status: 400 });
    }

    const products = await getProducts();
    const filteredProducts = products.filter((p) => String(p.id) !== String(id));

    if (filteredProducts.length === products.length) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await saveProducts(filteredProducts);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
