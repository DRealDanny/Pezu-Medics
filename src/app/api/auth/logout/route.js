import { NextResponse } from "next/server";
import { ADMIN_CONFIG } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set({
    name: ADMIN_CONFIG.cookieName,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
