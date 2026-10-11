import { NextResponse } from "next/server";
import { ADMIN_CONFIG, verifyAdminSession } from "@/lib/auth";

export async function GET(request) {
  const isValid = verifyAdminSession(request);

  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: ADMIN_CONFIG.email,
      role: "Administrator",
    },
  });
}
