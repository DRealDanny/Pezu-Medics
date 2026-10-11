import { NextResponse } from "next/server";
import path from "node:path";
import sharp from "sharp";
import { verifyAdminSession } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/storage";

export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to the CMS." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "Uploaded image file is empty." }, { status: 400 });
    }

    // Convert all uploaded images to WebP format with sharp
    // Downscale if dimension exceeds 1200x1200px and compress to lightweight, high-quality WebP
    let webpBuffer;
    try {
      webpBuffer = await sharp(buffer)
        .rotate() // Auto-orient based on EXIF
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
          effort: 4,
        })
        .toBuffer();
    } catch (primaryErr) {
      console.warn("Primary Sharp conversion with rotate failed, trying fallback:", primaryErr.message);
      try {
        // Fallback: convert without rotate or complex effort settings
        webpBuffer = await sharp(buffer)
          .resize({
            width: 1200,
            height: 1200,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toBuffer();
      } catch (fallbackErr) {
        console.error("Image WebP conversion completely failed:", fallbackErr);
        return NextResponse.json(
          {
            error: `Image conversion failed: ${fallbackErr.message || "Invalid or unsupported image file"}. Please upload a standard image (PNG, JPG, JPEG, WEBP).`,
          },
          { status: 400 }
        );
      }
    }

    // Sanitize and create unique WebP filename
    const originalName = file.name || "product-image";
    const originalExt = path.extname(originalName);
    const cleanBase =
      path
        .basename(originalName, originalExt)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 30) || "product";

    const uniqueFilename = `${Date.now()}-${cleanBase}.webp`;

    // Save to Vercel Blob (in cloud) or local disk (in dev)
    const publicUrl = await saveUploadedImage({
      filename: uniqueFilename,
      buffer: webpBuffer,
      contentType: "image/webp",
    });

    const originalKb = Math.round(buffer.length / 1024);
    const optimizedKb = Math.round(webpBuffer.length / 1024);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      format: "webp",
      originalSize: `${originalKb} KB`,
      optimizedSize: `${optimizedKb} KB`,
    });
  } catch (error) {
    console.error("File upload route error:", error);
    return NextResponse.json(
      { error: `Upload error: ${error.message || "Failed to process image."}` },
      { status: 500 }
    );
  }
}
