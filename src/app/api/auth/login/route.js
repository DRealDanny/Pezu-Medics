import { NextResponse } from "next/server";
import { ADMIN_CONFIG } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    const trimmedId = (identifier || "").trim().toLowerCase();
    const isIdentifierValid =
      Boolean(trimmedId) &&
      ((ADMIN_CONFIG.email && trimmedId === ADMIN_CONFIG.email.toLowerCase()) ||
        (ADMIN_CONFIG.username && trimmedId === ADMIN_CONFIG.username.toLowerCase()));
    const isPasswordValid =
      Boolean(password) && Boolean(ADMIN_CONFIG.password) && password === ADMIN_CONFIG.password;

    if (!isIdentifierValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        email: ADMIN_CONFIG.email,
        role: "Administrator",
      },
    });

    response.cookies.set({
      name: ADMIN_CONFIG.cookieName,
      value: ADMIN_CONFIG.tokenValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
