import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and create unique filename
    const originalName = file.name || "product-image.jpg";
    const extension = path.extname(originalName).toLowerCase() || ".jpg";
    const cleanBase = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}-${cleanBase}${extension}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
