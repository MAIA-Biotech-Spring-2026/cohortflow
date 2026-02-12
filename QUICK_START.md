# CohortFlow - Quick Start Guide

Get CohortFlow running locally in minutes. Perfect for development, testing, and demonstrations.

## Prerequisites

- **Node.js** 18.17.0 or higher
- **pnpm** 8.15.3 or higher
- **Git**
- **PostgreSQL** 14+ (or use Vercel Postgres)

## One-Command Setup

```bash
git clone https://github.com/MAIA-Biotech-Spring-2026/cohortflow.git && \
cd cohortflow && \
pnpm install && \
cp .env.example .env.local && \
pnpm db:push && \
pnpm db:seed && \
pnpm dev
```

Then open **http://localhost:3000** in your browser.

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MAIA-Biotech-Spring-2026/cohortflow.git
cd cohortflow
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database connection:

```bash
# For local PostgreSQL development:
DATABASE_URL="postgresql://user:password@localhost:5432/cohortflow"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
```

**For Vercel Postgres (recommended):**

1. Create a Vercel account at https://vercel.com
2. Create a new Postgres database in Vercel
3. Copy the connection string to `DATABASE_URL`
4. Generate a secret: `openssl rand -base64 32`
5. For local development, use `NEXTAUTH_URL="http://localhost:3000"`

### 4. Set Up the Database

Push the schema to your database:

```bash
pnpm db:push
```

Seed with demo data:

```bash
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Open **http://localhost:3000** - you should be redirected to the login page.

---

## Demo Login Credentials

Use these accounts to test different roles:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Coordinator** | `coordinator@example.com` | `demo123` | Full admin access, create programs, assign reviewers, export rosters |
| **Reviewer** | `reviewer@example.com` | `demo123` | Review assigned applications, score with rubrics |
| **Applicant** | `applicant@example.com` | `demo123` | Submit applications, view status, upload documents |

### Test Users by Program

The seed script creates multiple test users for different programs:

- **Volunteer Program**: reviewer-volunteer@example.com, coordinator-volunteer@example.com
- **Shadowing Program**: reviewer-shadowing@example.com
- **Research Program**: reviewer-research@example.com

All use password `demo123`.

---

## Key Features Overview

### For Program Coordinators

1. **Create Programs** - Define intake pipeline stages, rubrics, and fields
2. **Manage Applications** - View all applicants in a pipeline board
3. **Assign Reviewers** - Distribute applications to review team
4. **Track Progress** - See real-time status of reviews and decisions
5. **Export Roster** - Download final approved applicant list as CSV

**Getting Started:**
- Log in as `coordinator@example.com`
- Navigate to "Programs" → "Create New Program"
- Follow the guided setup wizard

### For Reviewers

1. **Review Queue** - See applications assigned to you
2. **Rubric Scoring** - Score applicants on defined criteria
3. **Comments & Notes** - Provide detailed feedback
4. **Document Review** - View uploaded resumes, essays, transcripts

**Getting Started:**
- Log in as `reviewer@example.com`
- Go to "My Reviews" tab
- Click an application to start reviewing

### For Applicants

1. **Submit Application** - Fill forms, upload documents
2. **Track Status** - See where your application is in the pipeline
3. **View Feedback** - Read reviewer comments (if enabled)
4. **Update Profile** - Modify submission before deadline

**Getting Started:**
- Log in as `applicant@example.com`
- Click on a program to view submission form
- Upload required documents
- Submit application

---

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Run production build locally

# Database
pnpm db:push         # Push schema changes
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed with demo data
pnpm db:studio       # Open Drizzle Studio

# Code Quality
pnpm lint            # Run ESLint
pnpm type-check      # Run TypeScript type checking
pnpm format          # Format code with Prettier

# Cleanup
pnpm clean           # Remove build artifacts and node_modules
```

---

## Troubleshooting

### Database Connection Failed

**Error:** `Error: getaddrinfo ENOTFOUND localhost`

**Solution:**
- Ensure PostgreSQL is running: `psql postgres`
- Check `DATABASE_URL` in `.env.local`
- For Vercel Postgres, ensure the IP whitelist includes your machine
- Try: `pnpm db:push --force` to retry migration

### Port 3000 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or use a different port: `PORT=3001 pnpm dev`

### pnpm Command Not Found

**Error:** `command not found: pnpm`

**Solution:**
```bash
npm install -g pnpm@8.15.3
# Or use npm instead:
npm install
npm run dev
```

### Type Checking Errors

**Error:** `error TS2307: Cannot find module...`

**Solution:**
```bash
pnpm install
pnpm type-check
```

### Build Fails

**Error:** `error - Build failed...`

**Solution:**
```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm db:push
pnpm db:seed
pnpm build
```

### Login Issues

**Can't log in with demo credentials?**

1. Clear browser cookies
2. Ensure `NEXTAUTH_SECRET` is set in `.env.local`
3. Check that `NEXTAUTH_URL` matches your current URL
4. Reseed the database: `pnpm db:seed`

---

## Project Structure

```
cohortflow/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── server/      # tRPC server
│       │   └── lib/         # Utilities
│       └── public/          # Static assets
├── packages/
│   └── db/                  # Database schema
│       ├── src/
│       │   ├── schema.ts    # Drizzle schema
│       │   └── seed.ts      # Database seeding
│       └── drizzle.config.ts
├── .env.example             # Environment variables
├── vercel.json              # Vercel configuration
└── turbo.json               # Turbo workspace config
```

---

## Development Workflow

### Create a New Feature

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and test:
   ```bash
   pnpm dev
   ```

3. Run quality checks:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

5. Open a Pull Request on GitHub

### Database Changes

1. Update schema in `packages/db/src/schema.ts`
2. Push changes to database:
   ```bash
   pnpm db:push
   ```
3. Update migrations:
   ```bash
   pnpm db:generate
   ```

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub main branch
2. Connect your GitHub repo to Vercel: https://vercel.com/new
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Vercel Postgres connection
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel domain
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
4. Deploy button click - done!

CI/CD will automatically test and deploy on push to main.

### Production Checklist

- [ ] Set all environment variables in Vercel
- [ ] Database migrations are applied
- [ ] Type checking passes: `pnpm type-check`
- [ ] Build succeeds: `pnpm build`
- [ ] Demo users have secure passwords (change from `demo123`)
- [ ] Review security headers in `vercel.json`
- [ ] Test login with all three roles

---

## Next Steps

1. **Read the Docs**
   - [Product Specification](./docs/PRODUCT_SPEC.md) - Feature details
   - [Architecture](./docs/ARCHITECTURE.md) - System design
   - [API Reference](./docs/API.md) - tRPC endpoints

2. **Configure Your First Program**
   - Log in as coordinator
   - Create a custom intake pipeline
   - Invite reviewers to participate

3. **Integrate Data**
   - Use export mapping to match your existing spreadsheet
   - Export CSV roster with one click

4. **Customize**
   - Edit rubric criteria for your programs
   - Add custom application fields
   - Configure stage transitions

---

## Support & Contributing

- **Issues**: Report bugs on [GitHub Issues](https://github.com/MAIA-Biotech-Spring-2026/cohortflow/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/MAIA-Biotech-Spring-2026/cohortflow/discussions)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## License

MIT License - See [LICENSE](./LICENSE) for details

---

**Built for the future of healthcare operations** 🏥

Questions? Open an issue or contact the team!
