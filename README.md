# Clark's Bookkeeping & Tax Preparation — Standalone Website

A self-contained Node.js + React app for **Clark's Bookkeeping & Tax Preparation Services** in Moorhead, Minnesota. No third-party platform dependencies — runs anywhere a Node 20 container plus PostgreSQL is available, including Railway, Fly.io, Render, or your own VM.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui
- **Backend**: Node.js 20 + Express 4 (single process, serves API and the built SPA)
- **Database**: PostgreSQL (via the `pg` driver)
- **Auth**: bcrypt password hashing + JWT in HttpOnly cookies (no OAuth, no third-party identity provider)
- **File uploads**: `multer` to local disk (mount a Railway volume at `/app/uploads` for persistence)
- **CSV import**: `csv-parse` for ingesting CrossLink client exports

## Pages

| Route                | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `/`                  | Single-page landing: Hero, About, Tools, Services, Credentials, Contact form |
| `/upload`            | Public secure document upload form (W-2s, 1099s, etc.)                       |
| `/admin`             | Email/password admin login                                                   |
| `/admin/dashboard`   | Tabbed dashboard: Contact Submissions, Document Uploads, Client List         |

## Admin accounts (seeded automatically)

The first time the app boots with a working `DATABASE_URL`, two admin accounts are created if they don't already exist:

| Email                            | Password    |
| -------------------------------- | ----------- |
| `Lisaclarktaxpro2023@gmail.com`  | `Money2026!` |
| `clarkryan977@gmail.com`         | `Money2026!` |

Change them in production by editing the `admins` table directly (passwords are bcrypt-hashed) or by extending `server/db.ts`.

## Required environment variables

See `env.sample`.

| Name           | Required | Notes                                                                                |
| -------------- | -------- | ------------------------------------------------------------------------------------ |
| `DATABASE_URL` | yes      | Postgres connection string. On Railway use `${{Postgres.DATABASE_URL}}`.             |
| `JWT_SECRET`   | yes      | Random ≥32-byte string used to sign session cookies. Set to something unique.        |
| `UPLOAD_DIR`   | no       | Defaults to `/app/uploads` in the Docker image. Mount a Railway Volume here.         |
| `PORT`         | no       | Set automatically by Railway. Defaults to `3000` locally.                            |

## Local development

```bash
pnpm install
# In one terminal: vite frontend on :3000
pnpm dev
# In another terminal: API on :3000 too — for fullstack dev, build once and run start:
pnpm build && DATABASE_URL=postgres://localhost/clark JWT_SECRET=local-dev pnpm start
```

For a "real" dev workflow with HMR, point Vite's proxy at the API server (or just run `pnpm build && pnpm start` since the build is fast).

## Deploy to Railway

1. **Create the project** on [railway.app](https://railway.app) and connect this GitHub repo (`clarkryan977-ship-it/clarks-bookkeeping-website`).
2. **Add a PostgreSQL plugin** to the project. Railway will expose it as the `Postgres` service.
3. **Set environment variables** on the web service:
   - `DATABASE_URL = ${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET = <a long random string>`
4. **Add a Volume** mounted at `/app/uploads` if you want client document uploads to survive deploys.
5. Railway will detect the `Dockerfile` and `railway.json` and build automatically. The healthcheck is `/api/health`.
6. **Add a custom domain** (`clarksbookkeepingandtaxprep.com` and `www.clarksbookkeepingandtaxprep.com`) in the Settings → Networking panel and update DNS at your registrar with the CNAME / ANAME records Railway provides.

## API surface

| Method | Path                                | Auth      | Description                                            |
| ------ | ----------------------------------- | --------- | ------------------------------------------------------ |
| GET    | `/api/health`                       | public    | Healthcheck                                            |
| POST   | `/api/auth/login`                   | public    | Email/password login, sets HttpOnly cookie             |
| POST   | `/api/auth/logout`                  | public    | Clears the cookie                                      |
| GET    | `/api/auth/me`                      | public    | Returns the current admin or 401                       |
| POST   | `/api/contact`                      | public    | Submit the contact form                                |
| POST   | `/api/uploads`                      | public    | Multipart upload (one `document` file + metadata)      |
| GET    | `/api/admin/contacts`               | admin     | List contact submissions                               |
| DELETE | `/api/admin/contacts/:id`           | admin     | Delete a contact submission                            |
| GET    | `/api/admin/uploads`                | admin     | List uploaded files                                    |
| GET    | `/api/admin/uploads/:id/download`   | admin     | Download an uploaded file                              |
| DELETE | `/api/admin/uploads/:id`            | admin     | Delete an uploaded file                                |
| GET    | `/api/admin/clients?q=`             | admin     | List/search clients                                    |
| POST   | `/api/admin/clients/import`         | admin     | CSV import (multipart `file`)                          |
| DELETE | `/api/admin/clients/:id`            | admin     | Delete one client                                      |
| DELETE | `/api/admin/clients`                | admin     | Truncate the client table                              |

## Project layout

```
client/           # React + Vite SPA
  index.html
  public/img/     # Logo + CrossLink certificate (kept in repo)
  src/
    components/   # Navbar, Footer, SiteLayout, ErrorBoundary, shadcn ui/*
    pages/        # Home, Upload, AdminLogin, AdminDashboard, NotFound
    lib/api.ts    # Tiny fetch wrapper
    index.css     # Brand tokens (slate / forest green / gold)
    App.tsx       # Route table
server/
  index.ts        # Express bootstrap, serves SPA + /api
  db.ts           # pg pool, schema migration, admin seed
  auth.ts         # JWT helpers + requireAdmin middleware
  routes.ts       # All /api routes
Dockerfile        # Multi-stage build for Railway
railway.json      # Railway service config (Docker builder + healthcheck)
env.sample        # Required env vars
```
