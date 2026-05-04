import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[db] DATABASE_URL is not set. The server will start but database-backed features will fail until it is configured."
  );
}

export const pool = new Pool({
  connectionString,
  // Railway requires SSL when not on internal network. Allow self-signed.
  ssl: connectionString && !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1")
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
});

export async function initDb() {
  if (!connectionString) {
    console.warn("[db] Skipping schema init because DATABASE_URL is missing.");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS document_uploads (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      note TEXT,
      original_filename TEXT NOT NULL,
      stored_filename TEXT NOT NULL,
      mime_type TEXT,
      size_bytes BIGINT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      ssn_last4 TEXT,
      filing_status TEXT,
      tax_year TEXT,
      notes TEXT,
      raw JSONB,
      imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await seedAdmins();
}

async function seedAdmins() {
  const seedList = [
    { email: "Lisaclarktaxpro2023@gmail.com", password: "Money2026!" },
    { email: "clarkryan977@gmail.com", password: "Money2026!" },
  ];

  for (const { email, password } of seedList) {
    const existing = await pool.query(
      "SELECT id FROM admins WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
        [email, hash]
      );
      console.log(`[db] Seeded admin account: ${email}`);
    }
  }
}
