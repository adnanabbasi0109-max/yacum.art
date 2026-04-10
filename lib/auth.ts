import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const COOKIE_NAME = "yacum_token";
const ADMIN_COOKIE_NAME = "yacum_admin";

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function requireAdmin(): Promise<
  { ok: true; email: string } | { ok: false; reason: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return { ok: false, reason: "not_authenticated" };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; admin: true };
    if (!decoded?.admin || !isAdminEmail(decoded.email)) {
      return { ok: false, reason: "forbidden" };
    }
    return { ok: true, email: decoded.email };
  } catch {
    return { ok: false, reason: "invalid_token" };
  }
}

export function signAdminToken(email: string) {
  return jwt.sign({ email, admin: true }, JWT_SECRET, { expiresIn: "7d" });
}

export { ADMIN_COOKIE_NAME };

export function signToken(payload: { id: string; email: string; name: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE_NAME };
