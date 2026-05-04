import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
const COOKIE_NAME = "clark_admin";

export interface AdminTokenPayload {
  sub: number;
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function setAdminCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAdminCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function readAdminToken(req: Request): AdminTokenPayload | null {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) return null;
  try {
    return jwt.verify(raw, JWT_SECRET) as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const payload = readAdminToken(req);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { admin?: AdminTokenPayload }).admin = payload;
  next();
}
