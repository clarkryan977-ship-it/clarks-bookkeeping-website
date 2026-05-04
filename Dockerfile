# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile=false

# Copy the rest of the source
COPY . .

# Build frontend (vite -> dist/public) and bundle server (-> dist/index.js)
RUN pnpm build

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable

# Only install production deps
COPY package.json pnpm-lock.yaml* ./
COPY patches ./patches
RUN pnpm install --prod --frozen-lockfile=false

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Persistent uploads dir (mountable as Railway volume)
RUN mkdir -p /app/uploads
ENV UPLOAD_DIR=/app/uploads

EXPOSE 3000
CMD ["node", "dist/index.js"]
