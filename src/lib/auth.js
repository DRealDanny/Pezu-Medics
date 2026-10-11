export const ADMIN_CONFIG = {
  email: (process.env.ADMIN_EMAIL || "").trim(),
  username: (process.env.ADMIN_USERNAME || "").trim(),
  password: process.env.ADMIN_PASSWORD || "",
  cookieName: process.env.ADMIN_COOKIE_NAME || "pezucms_session",
  tokenValue: process.env.ADMIN_SESSION_SECRET || "",
};

/**
 * Verify whether an incoming request has a valid CMS session cookie.
 * @param {Request} request 
 * @returns {boolean}
 */
export function verifyAdminSession(request) {
  try {
    if (!ADMIN_CONFIG.tokenValue) return false;
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((c) => c.trim().split("="))
        .filter(([k]) => Boolean(k))
    );
    const token = cookies[ADMIN_CONFIG.cookieName];
    return Boolean(token && token === ADMIN_CONFIG.tokenValue);
  } catch {
    return false;
  }
}
