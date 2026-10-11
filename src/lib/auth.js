export const ADMIN_CONFIG = {
  get email() {
    return (process.env.ADMIN_EMAIL || "").trim();
  },
  get username() {
    return (process.env.ADMIN_USERNAME || "").trim();
  },
  get password() {
    return (process.env.ADMIN_PASSWORD || "").trim();
  },
  get cookieName() {
    return (process.env.ADMIN_COOKIE_NAME || "pezucms_session").trim();
  },
  get tokenValue() {
    return (process.env.ADMIN_SESSION_SECRET || "").trim();
  },
};

/**
 * Robustly extract CMS session cookie token from NextRequest or standard Request.
 * @param {Request} request 
 * @returns {string|null}
 */
export function getSessionTokenFromRequest(request) {
  if (!request) return null;

  // 1. Next.js RequestCookies helper (NextRequest)
  try {
    if (request.cookies && typeof request.cookies.get === "function") {
      const cookieObj = request.cookies.get(ADMIN_CONFIG.cookieName);
      if (cookieObj && cookieObj.value) {
        return cookieObj.value.trim();
      }
    }
  } catch {}

  // 2. Fallback to parsing the raw cookie header string
  try {
    const cookieHeader = request.headers?.get?.("cookie") || "";
    if (cookieHeader) {
      const parts = cookieHeader.split(";");
      for (const part of parts) {
        const eqIdx = part.indexOf("=");
        if (eqIdx === -1) continue;
        const key = part.slice(0, eqIdx).trim();
        if (key === ADMIN_CONFIG.cookieName) {
          let val = part.slice(eqIdx + 1).trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          }
          try {
            return decodeURIComponent(val).trim();
          } catch {
            return val.trim();
          }
        }
      }
    }
  } catch {}

  return null;
}

/**
 * Verify whether an incoming request has a valid CMS session cookie.
 * @param {Request} request 
 * @returns {boolean}
 */
export function verifyAdminSession(request) {
  try {
    const expected = ADMIN_CONFIG.tokenValue;
    if (!expected) return false;

    const token = getSessionTokenFromRequest(request);
    return Boolean(token && token === expected);
  } catch {
    return false;
  }
}
