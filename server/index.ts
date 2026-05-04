import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { initDb } from "./db.js";
import { apiRouter } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.set("trust proxy", true);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // API routes
  app.use("/api", apiRouter);

  // Static frontend
  // In production: dist/index.js + dist/public
  // In dev (rare): serve from project root /dist/public
  const candidates = [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
  ];
  const staticPath = candidates.find((p) => fs.existsSync(path.join(p, "index.html")));

  if (staticPath) {
    app.use(express.static(staticPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    console.warn(
      "[server] No built client found. Run `pnpm build` before starting in production."
    );
    app.get("*", (_req, res) => {
      res.status(503).send("Frontend not built yet. Run `pnpm build`.");
    });
  }

  try {
    await initDb();
    console.log("[server] Database initialized.");
  } catch (err) {
    console.error("[server] Database init failed:", err);
  }

  const port = Number(process.env.PORT) || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
