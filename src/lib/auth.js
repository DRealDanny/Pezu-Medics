export const ADMIN_CONFIG = {
  email: "admin@pezumedics.com",
  username: "admin",
  password: "admin123",
  cookieName: "pezucms_session",
  tokenValue: "pezu_authenticated_admin_session_valid",
};

/**
 * Verify whether an incoming request has a valid CMS session cookie.
 * @param {Request} request 
 * @returns {boolean}
 */
export function verifyAdminSession(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map((c) => c.trim().split("="))
        .filter(([k]) => Boolean(k))
    );
    const token = cookies[ADMIN_CONFIG.cookieName];
    return token === ADMIN_CONFIG.tokenValue;
  } catch {
    return false;
  }
}
