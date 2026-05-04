import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import { parse } from "csv-parse/sync";
import path from "path";
import fs from "fs";
import { pool } from "./db.js";
import {
  signAdminToken,
  setAdminCookie,
  clearAdminCookie,
  readAdminToken,
  requireAdmin,
} from "./auth.js";

export const apiRouter = Router();

// ---------- Uploads dir ----------
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const stamp = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    cb(null, `${stamp}-${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

const csvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// ---------- Health ----------
apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ---------- Auth ----------
apiRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }
  try {
    const result = await pool.query(
      "SELECT id, email, password_hash FROM admins WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    if (result.rowCount === 0) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }
    const row = result.rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }
    const token = signAdminToken({ sub: row.id, email: row.email });
    setAdminCookie(res, token);
    res.json({ ok: true, admin: { email: row.email } });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ error: "Login failed." });
  }
});

apiRouter.post("/auth/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

apiRouter.get("/auth/me", (req, res) => {
  const payload = readAdminToken(req);
  if (!payload) {
    res.status(401).json({ admin: null });
    return;
  }
  res.json({ admin: { email: payload.email } });
});

// ---------- Contact form (public) ----------
apiRouter.post("/contact", async (req, res) => {
  const { fullName, phone, email, message } = req.body || {};
  if (!fullName || !email || !message) {
    res.status(400).json({ error: "Full name, email, and message are required." });
    return;
  }
  try {
    const r = await pool.query(
      `INSERT INTO contact_submissions (full_name, phone, email, message)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [String(fullName).slice(0, 200), phone ? String(phone).slice(0, 50) : null, String(email).slice(0, 200), String(message).slice(0, 5000)]
    );
    res.json({ ok: true, id: r.rows[0].id });
  } catch (err) {
    console.error("[contact]", err);
    res.status(500).json({ error: "Could not submit message." });
  }
});

// ---------- Public document upload ----------
apiRouter.post("/uploads", upload.single("document"), async (req, res) => {
  const file = req.file;
  const { fullName, email, phone, note } = req.body || {};
  if (!file || !fullName || !email) {
    if (file) fs.unlink(file.path, () => {});
    res.status(400).json({ error: "Name, email, and a file are required." });
    return;
  }
  try {
    const r = await pool.query(
      `INSERT INTO document_uploads
        (full_name, email, phone, note, original_filename, stored_filename, mime_type, size_bytes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [
        String(fullName).slice(0, 200),
        String(email).slice(0, 200),
        phone ? String(phone).slice(0, 50) : null,
        note ? String(note).slice(0, 2000) : null,
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
      ]
    );
    res.json({ ok: true, id: r.rows[0].id });
  } catch (err) {
    console.error("[uploads]", err);
    fs.unlink(file.path, () => {});
    res.status(500).json({ error: "Upload failed." });
  }
});

// ---------- Admin routes ----------
apiRouter.get("/admin/contacts", requireAdmin, async (_req, res) => {
  const r = await pool.query(
    `SELECT id, full_name, phone, email, message, created_at
     FROM contact_submissions ORDER BY created_at DESC LIMIT 500`
  );
  res.json({ items: r.rows });
});

apiRouter.delete("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Bad id" });
    return;
  }
  await pool.query("DELETE FROM contact_submissions WHERE id = $1", [id]);
  res.json({ ok: true });
});

apiRouter.get("/admin/uploads", requireAdmin, async (_req, res) => {
  const r = await pool.query(
    `SELECT id, full_name, email, phone, note, original_filename, stored_filename,
            mime_type, size_bytes, created_at
     FROM document_uploads ORDER BY created_at DESC LIMIT 500`
  );
  res.json({ items: r.rows });
});

apiRouter.get("/admin/uploads/:id/download", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Bad id" });
    return;
  }
  const r = await pool.query(
    "SELECT original_filename, stored_filename, mime_type FROM document_uploads WHERE id = $1",
    [id]
  );
  if (r.rowCount === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const { original_filename, stored_filename, mime_type } = r.rows[0];
  const filePath = path.join(UPLOAD_DIR, stored_filename);
  if (!fs.existsSync(filePath)) {
    res.status(410).json({ error: "File missing on server" });
    return;
  }
  if (mime_type) res.setHeader("Content-Type", mime_type);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(original_filename)}"`
  );
  fs.createReadStream(filePath).pipe(res);
});

apiRouter.delete("/admin/uploads/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Bad id" });
    return;
  }
  const r = await pool.query(
    "SELECT stored_filename FROM document_uploads WHERE id = $1",
    [id]
  );
  if (r.rowCount && r.rows[0].stored_filename) {
    const fp = path.join(UPLOAD_DIR, r.rows[0].stored_filename);
    fs.unlink(fp, () => {});
  }
  await pool.query("DELETE FROM document_uploads WHERE id = $1", [id]);
  res.json({ ok: true });
});

// ---------- Clients ----------
apiRouter.get("/admin/clients", requireAdmin, async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (q) {
    const r = await pool.query(
      `SELECT * FROM clients
       WHERE LOWER(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) LIKE LOWER($1)
          OR LOWER(COALESCE(email,'')) LIKE LOWER($1)
          OR COALESCE(phone,'') LIKE $1
       ORDER BY imported_at DESC LIMIT 1000`,
      [`%${q}%`]
    );
    res.json({ items: r.rows });
    return;
  }
  const r = await pool.query(
    "SELECT * FROM clients ORDER BY imported_at DESC LIMIT 1000"
  );
  res.json({ items: r.rows });
});

apiRouter.delete("/admin/clients", requireAdmin, async (_req, res) => {
  await pool.query("TRUNCATE clients RESTART IDENTITY");
  res.json({ ok: true });
});

apiRouter.delete("/admin/clients/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Bad id" });
    return;
  }
  await pool.query("DELETE FROM clients WHERE id = $1", [id]);
  res.json({ ok: true });
});

apiRouter.post(
  "/admin/clients/import",
  requireAdmin,
  csvUpload.single("file"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "CSV file is required." });
      return;
    }
    let records: Record<string, string>[];
    try {
      records = parse(file.buffer, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true,
      }) as Record<string, string>[];
    } catch (err) {
      console.error("[csv parse]", err);
      res.status(400).json({ error: "Could not parse CSV." });
      return;
    }

    const lower = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, "");

    function pick(row: Record<string, string>, keys: string[]): string | null {
      const norm: Record<string, string> = {};
      for (const k of Object.keys(row)) norm[lower(k)] = row[k];
      for (const k of keys) {
        const v = norm[lower(k)];
        if (v != null && String(v).trim() !== "") return String(v).trim();
      }
      return null;
    }

    let inserted = 0;
    for (const row of records) {
      const firstName = pick(row, ["first_name", "firstname", "first name", "first"]);
      const lastName = pick(row, ["last_name", "lastname", "last name", "last", "surname"]);
      const email = pick(row, ["email", "email address", "e-mail"]);
      const phone = pick(row, ["phone", "phone number", "cell", "mobile"]);
      const address = pick(row, ["address", "street", "address1", "address 1"]);
      const city = pick(row, ["city"]);
      const state = pick(row, ["state"]);
      const zip = pick(row, ["zip", "zipcode", "zip code", "postal", "postal code"]);
      const ssn = pick(row, ["ssn", "social", "social security number"]);
      const ssnLast4 = ssn ? ssn.replace(/\D/g, "").slice(-4) : null;
      const filing = pick(row, ["filing_status", "filing status", "status"]);
      const taxYear = pick(row, ["tax_year", "tax year", "year"]);
      const notes = pick(row, ["notes", "memo", "comment", "comments"]);

      // skip totally empty rows
      if (!firstName && !lastName && !email && !phone) continue;

      await pool.query(
        `INSERT INTO clients
          (first_name, last_name, email, phone, address, city, state, zip,
           ssn_last4, filing_status, tax_year, notes, raw)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          state,
          zip,
          ssnLast4,
          filing,
          taxYear,
          notes,
          row,
        ]
      );
      inserted++;
    }

    res.json({ ok: true, inserted, total: records.length });
  }
);
