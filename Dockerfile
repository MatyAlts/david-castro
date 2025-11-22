# Dockerfile para Imprenta Manager - Next.js App
FROM node:20-bullseye-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client with correct binary target
RUN npx prisma generate --schema=./prisma/schema.production.prisma

# Set environment variable for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Build Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y openssl libssl-dev

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.production.prisma && node server.js"]
