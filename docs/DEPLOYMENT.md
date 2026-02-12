# CohortFlow Deployment Guide

**Version:** 1.0
**Last Updated:** February 12, 2026
**Platform:** Vercel (Production), Docker (Local Development)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Local Development Setup](#local-development-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Database Setup](#database-setup)
7. [File Storage Setup](#file-storage-setup)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Troubleshooting](#troubleshooting)

---

## Overview

CohortFlow is deployed to Vercel with the following stack:
- **Compute:** Vercel Serverless Functions (Node.js 18)
- **Database:** Vercel Postgres (PostgreSQL 14+)
- **Storage:** Vercel Blob (global CDN)
- **CDN:** Vercel Edge Network

### Deployment Environments

**Local Development:**
- `http://localhost:3000`
- Local PostgreSQL (Docker)
- Vercel Blob (test account)

**Preview (PR Deployments):**
- `https://cohortflow-<git-branch>-<team-name>.vercel.app`
- Separate Vercel Postgres instance
- Vercel Blob (shared)

**Production:**
- `https://cohortflow.vercel.app`
- Vercel Postgres (production instance)
- Vercel Blob (production)

---

## Prerequisites

### Required Tools

- **Node.js:** 18.17.0 or higher
- **pnpm:** 8.15.3 or higher
- **Git:** Latest version
- **Docker:** For local PostgreSQL (optional but recommended)
- **Vercel CLI:** For deployment management

**Install Tools:**
```bash
# Node.js (via nvm)
nvm install 18.17.0
nvm use 18.17.0

# pnpm
npm install -g pnpm@8.15.3

# Vercel CLI
pnpm add -g vercel

# Docker Desktop (macOS/Windows)
# https://www.docker.com/products/docker-desktop
```

### Vercel Account

1. Create account at [vercel.com](https://vercel.com)
2. Join team: `MAIA-Biotech-Spring-2026`
3. Install Vercel CLI and login:
   ```bash
   vercel login
   ```

---

## Environment Variables

### Required Variables

**`.env.local` (Local Development):**
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cohortflow

# NextAuth.js
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000

# Vercel Blob (get from Vercel dashboard)
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>

# Node Environment
NODE_ENV=development
```

**Vercel Production (Set in Vercel Dashboard):**
```env
# Database (auto-populated by Vercel Postgres)
POSTGRES_URL=<vercel-postgres-url>
POSTGRES_PRISMA_URL=<vercel-postgres-prisma-url>
POSTGRES_URL_NON_POOLING=<vercel-postgres-non-pooling-url>
DATABASE_URL=${POSTGRES_PRISMA_URL}

# NextAuth.js
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://cohortflow.vercel.app

# Vercel Blob (auto-populated by Vercel Blob)
BLOB_READ_WRITE_TOKEN=<production-token>

# Node Environment
NODE_ENV=production
```

### Generating Secrets

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Example output:** `xyzABC123...` (use this as `NEXTAUTH_SECRET`)

### Setting Environment Variables in Vercel

**Via CLI:**
```bash
vercel env add NEXTAUTH_SECRET production
# Paste secret when prompted
```

**Via Dashboard:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select project: `cohortflow`
3. Settings → Environment Variables
4. Add variable (name, value, environment)

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/MAIA-Biotech-Spring-2026/cohortflow.git
cd cohortflow
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Start PostgreSQL

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name cohortflow-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cohortflow \
  -p 5432:5432 \
  postgres:14

# Verify running
docker ps | grep cohortflow-db
```

**Option B: Local PostgreSQL**
```bash
# macOS (via Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb cohortflow
```

### Step 4: Configure Environment

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local
# Set DATABASE_URL, NEXTAUTH_SECRET, BLOB_READ_WRITE_TOKEN
```

**Get Vercel Blob Token:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Storage → Blob → Create Store (if not exists)
3. Copy `BLOB_READ_WRITE_TOKEN`

### Step 5: Push Database Schema

```bash
pnpm db:push
```

**Expected output:**
```
✓ Schema pushed successfully
```

### Step 6: Seed Database

```bash
pnpm db:seed
```

**Expected output:**
```
✓ Created 3 coordinators
✓ Created 10 reviewers
✓ Created 150 applicants
✓ Created 3 programs
✓ Created 400 applications
✓ Created 1000+ reviews
✓ Seed complete
```

### Step 7: Start Development Server

```bash
pnpm dev
```

**Expected output:**
```
> turbo run dev

cohortflow:web: ▲ Next.js 14.2.3
cohortflow:web:   - Local:        http://localhost:3000
cohortflow:web:   - Ready in 1.2s
```

### Step 8: Verify Setup

**Open browser:**
- Navigate to `http://localhost:3000`
- Login with demo account:
  - Email: `coordinator@example.com`
  - Password: `demo123`

**Test key features:**
- Dashboard loads
- Programs list shows 3 programs
- Pipeline board displays applications

---

## Vercel Deployment

### Step 1: Connect GitHub Repository

**Via Vercel Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Select: `MAIA-Biotech-Spring-2026/cohortflow`
4. Team: `MAIA-Biotech-Spring-2026`
5. Framework Preset: **Next.js**
6. Root Directory: `./` (monorepo detected automatically)
7. Build Command: `turbo run build` (auto-detected)
8. Output Directory: `.next` (auto-detected)

**Click "Deploy"**

### Step 2: Configure Build Settings

**Vercel automatically detects:**
- Framework: Next.js 14
- Package Manager: pnpm
- Build Command: `pnpm turbo run build`
- Install Command: `pnpm install`

**Manual Override (if needed):**
```json
{
  "buildCommand": "pnpm turbo run build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Step 3: Set Environment Variables

**Required for first deploy:**
```bash
# Via CLI
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# Enter: https://cohortflow.vercel.app
```

**Or via Dashboard:**
- Settings → Environment Variables
- Add `NEXTAUTH_SECRET` (Production)
- Add `NEXTAUTH_URL` (Production): `https://cohortflow.vercel.app`

### Step 4: Deploy

**Automatic (on git push to main):**
```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

**Vercel auto-deploys on push to `main`**

**Manual (via CLI):**
```bash
vercel --prod
```

### Step 5: Verify Deployment

**Check deployment status:**
```bash
vercel ls
```

**Expected output:**
```
cohortflow  Production  https://cohortflow.vercel.app  1m ago
```

**Visit production URL:**
- Open `https://cohortflow.vercel.app`
- Verify homepage loads
- Check `/login` page

---

## Database Setup

### Vercel Postgres Setup

**Step 1: Create Database**

**Via Vercel Dashboard:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Storage → Postgres → Create Database
3. Database Name: `cohortflow-production`
4. Region: `us-east-1` (choose closest to users)
5. Create

**Via CLI:**
```bash
vercel postgres create cohortflow-production
```

**Step 2: Link Database to Project**

**Via Dashboard:**
1. Select database: `cohortflow-production`
2. Connect to Project → Select `cohortflow`
3. Environment: Production

**Via CLI:**
```bash
vercel link
vercel env pull .env.production
```

**Environment variables auto-populated:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

**Step 3: Run Migrations**

**First deployment:**
```bash
# Push schema (migrations run on deploy)
vercel env pull .env.production
pnpm db:push
```

**Subsequent deployments:**
- Migrations run automatically via `postbuild` script in `package.json`

**Manual migration:**
```bash
# Connect to production DB
vercel postgres connect cohortflow-production

# Run migration
pnpm db:migrate
```

**Step 4: Seed Production Data (Optional)**

**Create production seed script (without synthetic data):**
```bash
# Only seed demo accounts, no fake applications
pnpm db:seed:production
```

**Or manually via SQL:**
```sql
-- Insert coordinator account
INSERT INTO users (id, email, name, role, hashed_password)
VALUES (
  gen_random_uuid(),
  'admin@cohortflow.app',
  'Admin User',
  'COORDINATOR',
  '<bcrypt-hashed-password>'
);
```

---

## File Storage Setup

### Vercel Blob Setup

**Step 1: Create Blob Store**

**Via Vercel Dashboard:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Storage → Blob → Create Store
3. Store Name: `cohortflow-files`
4. Create

**Via CLI:**
```bash
vercel blob create cohortflow-files
```

**Step 2: Link to Project**

**Via Dashboard:**
1. Select store: `cohortflow-files`
2. Connect to Project → Select `cohortflow`
3. Environment: Production

**Environment variable auto-populated:**
- `BLOB_READ_WRITE_TOKEN`

**Step 3: Verify Integration**

**Test file upload:**
```typescript
// Test in Vercel production
import { put } from '@vercel/blob';

const blob = await put('test.txt', 'Hello from CohortFlow!', {
  access: 'public',
});

console.log(blob.url); // https://blob.vercel-storage.com/...
```

**Expected:** File uploaded successfully, URL returned

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18.17.0
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm turbo run lint

      - name: Type check
        run: pnpm turbo run type-check

      - name: Build
        run: pnpm turbo run build

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18.17.0
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm turbo run test
```

### Vercel Deployment Triggers

**Automatic Deployments:**
- **Production:** Push to `main` branch
- **Preview:** Push to any branch or PR

**Deployment Settings (vercel.json):**
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "github": {
    "silent": false,
    "autoAlias": true
  }
}
```

### Preview Deployments

**Every PR gets:**
- Unique URL: `https://cohortflow-pr-123.vercel.app`
- Separate database instance (optional)
- Auto-deployed on every push to PR branch
- Auto-deleted after PR merge

**Comment in PR:**
```
✅ Preview deployment ready!
🔗 https://cohortflow-pr-123.vercel.app
```

---

## Monitoring and Logging

### Vercel Analytics

**Enable:**
1. Vercel Dashboard → Project → Analytics
2. Enable Web Analytics

**Metrics:**
- Page views
- Unique visitors
- Core Web Vitals (LCP, FID, CLS)
- Top pages

### Application Logs

**View Logs:**
```bash
vercel logs <deployment-url>
```

**Or in Dashboard:**
- Project → Deployments → [Select deployment] → Logs

**Log Levels:**
- `console.log()` → INFO
- `console.warn()` → WARN
- `console.error()` → ERROR

**Log Retention:** 7 days (free tier), 30 days (Pro)

### Error Tracking (Post-MVP)

**Integrate Sentry:**
```bash
pnpm add @sentry/nextjs
```

**Configure:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Uptime Monitoring (Post-MVP)

**Use Better Uptime:**
1. Create monitor: `https://cohortflow.vercel.app`
2. Check interval: 1 minute
3. Alert channels: Email, Slack

---

## Troubleshooting

### Build Failures

**Issue:** `pnpm install` fails
**Solution:**
```bash
# Clear pnpm cache
pnpm store prune
pnpm install --force
```

**Issue:** TypeScript errors during build
**Solution:**
```bash
# Check types locally first
pnpm turbo run type-check

# Fix errors, then redeploy
git add .
git commit -m "fix: type errors"
git push
```

**Issue:** Turbo cache errors
**Solution:**
```bash
# Clear Turbo cache
pnpm clean
pnpm install
pnpm turbo run build --force
```

---

### Database Issues

**Issue:** `DATABASE_URL` not set
**Solution:**
```bash
# Pull env vars from Vercel
vercel env pull .env.local

# Or set manually in .env.local
DATABASE_URL=postgresql://...
```

**Issue:** Migration failed
**Solution:**
```bash
# Reset database (DEV ONLY, destructive!)
pnpm db:push --force

# Or run migration manually
vercel postgres connect cohortflow-production
\d  # List tables
# Run migration SQL manually
```

**Issue:** Connection pool exhausted
**Solution:**
- Vercel Postgres uses PgBouncer (connection pooling)
- Check connection count in dashboard
- Use `POSTGRES_PRISMA_URL` (pooled) instead of `POSTGRES_URL`

---

### File Upload Issues

**Issue:** `BLOB_READ_WRITE_TOKEN` not set
**Solution:**
```bash
# Get token from dashboard
vercel env pull .env.local

# Or add manually
vercel env add BLOB_READ_WRITE_TOKEN production
```

**Issue:** File upload fails with 413 (Payload Too Large)
**Solution:**
- Vercel Blob limit: 500 MB per file
- Check file size client-side before upload
- Add validation in upload handler

**Issue:** Signed URLs not working
**Solution:**
```typescript
// Ensure token is set
import { getSignedUrl } from '@vercel/blob';

const signedUrl = await getSignedUrl(blobUrl, {
  expiresIn: 3600, // 1 hour
});
```

---

### Performance Issues

**Issue:** Slow page load
**Solution:**
- Check Vercel Analytics for bottlenecks
- Enable Static Generation for non-dynamic pages
- Add caching headers

**Issue:** Serverless function timeout (10s limit)
**Solution:**
- Optimize database queries (add indexes)
- Use pagination for large result sets
- Consider Edge Functions for latency-sensitive endpoints

---

## Rollback Strategy

### Instant Rollback

**Via Dashboard:**
1. Deployments → [Select previous deployment]
2. Click "Promote to Production"

**Via CLI:**
```bash
vercel rollback <deployment-url>
```

**Example:**
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback https://cohortflow-abc123.vercel.app
```

### Database Rollback

**Restore from backup:**
1. Vercel Dashboard → Storage → Postgres → Backups
2. Select backup (daily, retained 7 days)
3. Restore

**Or via CLI:**
```bash
vercel postgres restore cohortflow-production <backup-id>
```

---

## Security Checklist

### Pre-Production

- [ ] `NEXTAUTH_SECRET` is strong random string (32+ chars)
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] Database credentials not exposed in logs
- [ ] `BLOB_READ_WRITE_TOKEN` not committed to git
- [ ] HTTPS enforced (Vercel default)
- [ ] CORS configured for production domain only

### Post-Production

- [ ] Enable Vercel Security Headers
- [ ] Set up Content Security Policy (CSP)
- [ ] Review audit logs regularly
- [ ] Monitor error rates in Sentry
- [ ] Set up uptime monitoring

---

## Scaling Considerations

### Current Limits (Vercel Pro)

- **Serverless Functions:** 1000 invocations/hour
- **Bandwidth:** 100 GB/month
- **Postgres Storage:** 10 GB
- **Blob Storage:** 100 GB

### Scaling Plan

**Phase 1 (MVP):** Vercel Pro (~$20/month)
**Phase 2 (Beta):** Vercel Enterprise (~$500/month)
- Increased limits
- Dedicated support
- SLA guarantees

**Database Scaling:**
- Read replicas for analytics queries
- Increase connection pool size
- Consider caching layer (Redis)

---

## Maintenance

### Regular Tasks

**Daily:**
- Check error logs in Vercel dashboard
- Monitor uptime and response times

**Weekly:**
- Review database backup status
- Check storage usage (Blob, Postgres)
- Update dependencies (patch versions)

**Monthly:**
- Review audit logs for anomalies
- Analyze performance metrics
- Update dependencies (minor versions)

**Quarterly:**
- Review security checklist
- Audit user permissions
- Backup audit logs to external storage

---

## References

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

---

**Document Maintained By:** MAIA Biotech Spring 2026 Team
**Last Review:** February 12, 2026
