const TOKEN_KEY = "Token";

const COOKIE_OPTIONS = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  maxAge: 60 * 60 * 24 * 90, // seconds
};

type ReqLike = {
  headers?: { cookie?: string };
};

type ResLike = {
  getHeader?: (name: string) => any;
  setHeader?: (name: string, value: any) => void;
};

function parseCookie(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;

  cookieHeader.split(";").forEach((part) => {
    const [rawKey, ...rawVal] = part.trim().split("=");
    if (!rawKey) return;
    const key = rawKey;
    const val = rawVal.join("=");
    out[key] = decodeURIComponent(val || "");
  });

  return out;
}

function serializeCookie(name: string, value: string, opts: typeof COOKIE_OPTIONS) {
  const parts: string[] = [];
  parts.push(`${name}=${encodeURIComponent(value)}`);
  parts.push(`Path=${opts.path}`);
  parts.push(`Max-Age=${opts.maxAge}`);
  parts.push(`SameSite=${opts.sameSite}`);
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

function serializeDeleteCookie(name: string, path = "/") {
  const parts: string[] = [];
  parts.push(`${name}=`);
  parts.push(`Path=${path}`);
  parts.push("Max-Age=0");
  parts.push("SameSite=Lax");
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

function setSetCookieHeader(res: ResLike | undefined, cookie: string) {
  if (!res?.setHeader || !res?.getHeader) return;

  const prev = res.getHeader("Set-Cookie");
  if (!prev) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }

  if (Array.isArray(prev)) {
    res.setHeader("Set-Cookie", [...prev, cookie]);
    return;
  }

  res.setHeader("Set-Cookie", [prev, cookie]);
}

export function setToken_Localstorage(params: string, req?: ReqLike, res?: ResLike) {
  try {
    if (typeof window !== "undefined") {
      document.cookie = serializeCookie(TOKEN_KEY, params, COOKIE_OPTIONS);
      return;
    }

    if (req && res) {
      setSetCookieHeader(res, serializeCookie(TOKEN_KEY, params, COOKIE_OPTIONS));
    }
  } catch (e) {
    console.error("Error setting token in cookies:", e);
  }
}

export function getToken_Localstorage(req?: ReqLike, res?: ResLike) {
  try {
    if (typeof window !== "undefined") {
      const all = parseCookie(document.cookie);
      return all[TOKEN_KEY] || null;
    }

    const cookieHeader = req?.headers?.cookie;
    const all = parseCookie(cookieHeader);
    return all[TOKEN_KEY] || null;
  } catch {
    return null;
  }
}

export function logout(req?: ReqLike, res?: ResLike) {
  try {
    if (typeof window !== "undefined") {
      document.cookie = serializeDeleteCookie(TOKEN_KEY, "/");
      return;
    }

    if (req && res) {
      setSetCookieHeader(res, serializeDeleteCookie(TOKEN_KEY, "/"));
    }
  } catch (e) {
    console.error("Error removing token cookie:", e);
  }
}

export function setTokenServerSide(token: string, req: ReqLike, res: ResLike) {
  setToken_Localstorage(token, req, res);
}
