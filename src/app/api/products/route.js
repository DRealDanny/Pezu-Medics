import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { getProducts, saveProducts, deleteStoredImage } from "@/lib/storage";

/**
 * GET /api/products
 * Returns the current list of products from Vercel Blob or disk.
 */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "Pragma": "no-cache",
      "Expires": "0",
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
    const { name, price, category, image, description } = body;

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
      description: (description && description.trim()) || "",
      image: image && image.trim() ? image.trim() : "",
    };

    // Prepend to top of catalog, ensuring unique IDs
    const cleanExisting = products.filter((p) => String(p.id) !== newProduct.id);
    const updatedProducts = [newProduct, ...cleanExisting];
    await saveProducts(updatedProducts);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: `Failed to create product: ${error.message || "Storage error"}` },
      { status: 500 }
    );
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
    const { id, name, price, category, image, description } = body;

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

    const oldImage = products[index].image;
    const newImage = image !== undefined ? (image ? image.trim() : "") : oldImage || "";

    // If image was replaced or cleared, remove previous image from storage
    if (oldImage && oldImage !== newImage) {
      await deleteStoredImage(oldImage);
    }

    const updatedProduct = {
      ...products[index],
      name: name.trim(),
      price: numericPrice,
      category: (category && category.trim()) || products[index].category || "General Equipment",
      description: description !== undefined ? (description ? description.trim() : "") : products[index].description || "",
      image: newImage,
    };

    products[index] = updatedProduct;
    await saveProducts(products);

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: `Failed to update product: ${error.message || "Storage error"}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products
 * Delete a product by ID (Admin authenticated).
 * Also completely deletes associated uploaded image file from Vercel Blob or disk.
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
    const productToDelete = products.find((p) => String(p.id) === String(id));

    if (!productToDelete) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Completely remove uploaded image from storage
    if (productToDelete.image) {
      await deleteStoredImage(productToDelete.image);
    }

    const filteredProducts = products.filter((p) => String(p.id) !== String(id));
    await saveProducts(filteredProducts);

    return NextResponse.json({
      success: true,
      message: "Product and associated image completely deleted.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: `Failed to delete product: ${error.message || "Storage error"}` },
      { status: 500 }
    );
  }
}
