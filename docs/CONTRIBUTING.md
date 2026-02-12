# Contributing to CohortFlow

**Version:** 1.0
**Last Updated:** February 12, 2026
**Team:** MAIA Biotech Spring 2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Code Style and Conventions](#code-style-and-conventions)
5. [Git Workflow](#git-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation Standards](#documentation-standards)
9. [Team Coordination](#team-coordination)

---

## Getting Started

### Team Members

**Project Lead:** Caleb Newton

**Team Roles:**
- **Frontend:** UI components, pages, styling
- **Backend:** tRPC routers, database queries, business logic
- **Full-Stack:** End-to-end features (application flow, review system)
- **DevOps:** Deployment, CI/CD, monitoring

### Communication Channels

- **GitHub:** Code reviews, issue tracking, project board
- **Slack/Discord:** Real-time coordination (if applicable)
- **Weekly Sync:** Progress updates, blockers, planning

### Onboarding Checklist

- [ ] Clone repository
- [ ] Install dependencies (`pnpm install`)
- [ ] Start local Postgres (`docker run ...`)
- [ ] Configure `.env.local`
- [ ] Run `pnpm db:push` and `pnpm db:seed`
- [ ] Start dev server (`pnpm dev`)
- [ ] Create first branch and PR

---

## Development Setup

### Prerequisites

- **Node.js:** 18.17.0+
- **pnpm:** 8.15.3
- **Docker:** For PostgreSQL
- **Git:** Latest version
- **VSCode:** Recommended IDE

### Installation

```bash
# Clone repository
git clone https://github.com/MAIA-Biotech-Spring-2026/cohortflow.git
cd cohortflow

# Install dependencies
pnpm install

# Start PostgreSQL
docker run -d \
  --name cohortflow-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cohortflow \
  -p 5432:5432 \
  postgres:14

# Configure environment
cp .env.example .env.local
# Edit .env.local with DATABASE_URL, NEXTAUTH_SECRET, BLOB_READ_WRITE_TOKEN

# Push schema and seed data
pnpm db:push
pnpm db:seed

# Start dev server
pnpm dev
```

**Verify:** Open `http://localhost:3000` and login with `coordinator@example.com` / `demo123`

### VSCode Extensions

**Recommended:**
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Error Lens** - Inline error display
- **Prisma/Drizzle** - Schema syntax highlighting
- **GitLens** - Git visualization

**Install all:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension usernamehw.errorlens
code --install-extension eamodio.gitlens
```

### VSCode Settings

**`.vscode/settings.json`:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Project Structure

### Monorepo Layout

```
cohortflow/
├── apps/
│   └── web/                     # Next.js application
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (auth)/     # Auth pages (login, register)
│       │   │   ├── (coordinator)/  # Coordinator dashboard
│       │   │   ├── (reviewer)/     # Reviewer queue
│       │   │   └── (applicant)/    # Applicant portal
│       │   ├── components/     # React components
│       │   │   ├── ui/         # Shadcn/ui components
│       │   │   └── features/   # Feature-specific components
│       │   ├── server/         # tRPC server
│       │   │   ├── api/
│       │   │   │   └── routers/   # tRPC routers
│       │   │   └── auth.ts     # NextAuth config
│       │   ├── lib/            # Utilities
│       │   └── styles/         # Global styles
│       ├── public/             # Static assets
│       └── package.json
├── packages/
│   ├── db/                     # Database layer
│   │   ├── src/
│   │   │   ├── schema.ts       # Drizzle schema
│   │   │   ├── index.ts        # DB client export
│   │   │   └── seed.ts         # Data seeding
│   │   └── drizzle/            # Migrations
│   ├── auth/                   # Auth utilities (future)
│   └── types/                  # Shared types (future)
├── docs/                       # Documentation
│   ├── PRODUCT_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── AMBIGUITY.md
├── .github/
│   └── workflows/              # CI/CD workflows
├── package.json                # Root package
├── pnpm-workspace.yaml         # Workspace config
├── turbo.json                  # Turborepo config
└── README.md
```

### File Naming Conventions

**React Components:**
- PascalCase: `ApplicationCard.tsx`
- Collocate styles/tests: `ApplicationCard.css`, `ApplicationCard.test.tsx`

**Utilities:**
- camelCase: `formatDate.ts`, `csvBuilder.ts`

**Pages (App Router):**
- Folder-based: `app/(coordinator)/dashboard/page.tsx`
- Route groups: `(coordinator)`, `(auth)`

**tRPC Routers:**
- camelCase: `program.ts`, `application.ts`

**Database Schema:**
- camelCase tables: `users`, `programs`, `applications`
- snake_case columns in SQL, camelCase in TypeScript

---

## Code Style and Conventions

### TypeScript

**Always use TypeScript:**
- No `.js` or `.jsx` files
- Enable strict mode (`tsconfig.json`)
- Prefer `interface` over `type` for object shapes
- Use `type` for unions and primitives

**Good:**
```typescript
interface User {
  id: string;
  name: string;
  role: 'APPLICANT' | 'REVIEWER' | 'COORDINATOR';
}

type UserRole = User['role'];
```

**Bad:**
```typescript
// Don't use `any`
function processUser(user: any) { ... }

// Don't use implicit `any`
function formatDate(date) { ... }
```

### React Components

**Functional Components with Hooks:**
```typescript
// Good: Named export, typed props
interface ApplicationCardProps {
  application: Application;
  onSelect: (id: string) => void;
}

export function ApplicationCard({ application, onSelect }: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div onClick={() => onSelect(application.id)}>
      {application.name}
    </div>
  );
}
```

**Server Components (default):**
```typescript
// app/(coordinator)/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch data on server
  const programs = await db.query.programs.findMany();

  return (
    <div>
      <h1>Dashboard</h1>
      <ProgramList programs={programs} />
    </div>
  );
}
```

**Client Components (when needed):**
```typescript
'use client';

import { useState } from 'react';

export function InteractiveButton() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### tRPC Procedures

**Input Validation with Zod:**
```typescript
export const applicationRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(z.object({
      programId: z.string().uuid(),
      responses: z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        email: z.string().email(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      // Business logic
      const [application] = await ctx.db.insert(applications).values({
        programId: input.programId,
        applicantId: ctx.session.user.id,
        responses: input.responses,
        status: 'SUBMITTED',
      }).returning();

      return application;
    }),
});
```

**Error Handling:**
```typescript
if (!application) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Application not found',
  });
}

if (application.applicantId !== ctx.session.user.id) {
  throw new TRPCError({
    code: 'FORBIDDEN',
    message: 'You do not have permission to access this application',
  });
}
```

### Styling (Tailwind CSS)

**Utility Classes:**
```tsx
<div className="flex items-center gap-4 rounded-lg border p-4 shadow-sm">
  <h2 className="text-lg font-semibold">Application</h2>
  <span className="text-sm text-gray-500">Submitted 2 days ago</span>
</div>
```

**Use `cn()` for Conditional Classes:**
```tsx
import { cn } from '~/lib/utils';

<button
  className={cn(
    'rounded px-4 py-2 font-medium',
    isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
  )}
>
  Submit
</button>
```

**Shadcn/ui Components:**
```tsx
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <h2>Dialog Content</h2>
  </DialogContent>
</Dialog>
```

### Database Queries (Drizzle)

**Prefer Query Builder:**
```typescript
// Good: Type-safe query
const applications = await db.query.applications.findMany({
  where: (applications, { eq }) => eq(applications.programId, programId),
  with: {
    applicant: {
      columns: { id: true, name: true, email: true },
    },
  },
  orderBy: (applications, { desc }) => [desc(applications.submittedAt)],
  limit: 50,
});
```

**Use Transactions for Multi-Step Operations:**
```typescript
await db.transaction(async (tx) => {
  // Create application
  const [application] = await tx.insert(applications).values({
    programId,
    applicantId: userId,
    responses,
  }).returning();

  // Create audit log
  await tx.insert(auditLogs).values({
    userId,
    eventType: 'APPLICATION_SUBMITTED',
    resourceType: 'APPLICATION',
    resourceId: application.id,
    metadata: { programId },
    timestamp: new Date(),
  });
});
```

### Comments

**Use JSDoc for Functions:**
```typescript
/**
 * Calculate average review scores for an application.
 * @param reviews - Array of review objects
 * @returns Object with average scores per criterion
 */
function calculateAverageScores(reviews: Review[]): Record<string, number> {
  // Implementation
}
```

**Explain Complex Logic:**
```typescript
// Calculate weighted score: fit (40%), experience (30%), availability (30%)
const weightedScore =
  (scores.fit * 0.4) +
  (scores.experience * 0.3) +
  (scores.availability * 0.3);
```

**Avoid Obvious Comments:**
```typescript
// Bad
// Set loading to true
setLoading(true);

// Good (no comment needed)
setLoading(true);
```

---

## Git Workflow

### Branch Naming

**Format:** `type/short-description`

**Types:**
- `feat/` - New feature
- `fix/` - Bug fix
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

**Examples:**
- `feat/application-submission-form`
- `fix/reviewer-queue-pagination`
- `refactor/state-machine-logic`
- `docs/api-reference-update`

### Commit Messages

**Format:** `type: description`

**Types:** (same as branches)

**Examples:**
- `feat: add application submission form`
- `fix: resolve reviewer queue pagination bug`
- `refactor: simplify state machine transitions`
- `docs: update API reference with new endpoints`

**Guidelines:**
- Use imperative mood ("add" not "added")
- Capitalize first letter
- No period at end
- Keep under 72 characters
- Reference issue if applicable: `fix: resolve #42 - pagination bug`

### Workflow Steps

**1. Create Branch:**
```bash
git checkout main
git pull origin main
git checkout -b feat/application-form
```

**2. Make Changes:**
```bash
# Edit files
# ...

# Stage changes
git add src/app/apply/page.tsx src/components/ApplicationForm.tsx

# Commit with message
git commit -m "feat: add application form with validation"
```

**3. Push Branch:**
```bash
git push origin feat/application-form
```

**4. Open Pull Request:**
- Go to GitHub repository
- Click "New Pull Request"
- Select branch: `feat/application-form`
- Fill out PR template
- Request reviews

**5. Address Review Comments:**
```bash
# Make changes based on feedback
git add .
git commit -m "fix: address PR feedback - add error handling"
git push origin feat/application-form
```

**6. Merge:**
- Squash and merge (preferred for clean history)
- Delete branch after merge

---

## Pull Request Process

### PR Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Related Issue
Closes #[issue number]

## Testing
- [ ] Tested locally
- [ ] Added unit tests (if applicable)
- [ ] Verified on preview deployment

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No console errors or warnings
```

### Review Guidelines

**As Author:**
- Self-review before requesting review
- Ensure CI passes (lint, type-check, build)
- Respond to comments promptly
- Mark resolved threads as resolved

**As Reviewer:**
- Review within 24 hours
- Check for:
  - Correctness
  - Code style consistency
  - Performance considerations
  - Security issues
  - Test coverage
- Use GitHub suggestions for small fixes
- Approve when satisfied

**Review Comments:**
- Be constructive and respectful
- Explain "why" not just "what"
- Distinguish between "must fix" and "nice to have"

### PR Size

**Keep PRs small:**
- Ideal: < 300 lines changed
- Maximum: < 500 lines changed
- Break large features into multiple PRs

**Example:**
Instead of one PR for "Review System" (2000 lines), create:
1. `feat/review-schema` (200 lines)
2. `feat/review-router` (300 lines)
3. `feat/review-ui` (400 lines)

---

## Testing Guidelines

### Unit Tests (Future)

**Framework:** Vitest

**Test File Location:**
- Collocate: `ApplicationCard.test.tsx` next to `ApplicationCard.tsx`
- Or: `__tests__/ApplicationCard.test.tsx`

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateAverageScores } from './scoreUtils';

describe('calculateAverageScores', () => {
  it('should calculate average scores correctly', () => {
    const reviews = [
      { scores: { fit: 4, availability: 5 } },
      { scores: { fit: 5, availability: 3 } },
    ];

    const result = calculateAverageScores(reviews);

    expect(result.fit).toBe(4.5);
    expect(result.availability).toBe(4);
  });
});
```

**Run Tests:**
```bash
pnpm turbo run test
```

### E2E Tests (Future)

**Framework:** Playwright

**Test File Location:** `tests/e2e/`

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test('coordinator can create program', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'coordinator@example.com');
  await page.fill('input[name="password"]', 'demo123');
  await page.click('button[type="submit"]');

  await page.goto('/programs/new');
  await page.fill('input[name="name"]', 'Test Program');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Program created successfully')).toBeVisible();
});
```

**Run E2E Tests:**
```bash
pnpm playwright test
```

### Manual Testing Checklist

**Before PR:**
- [ ] Test feature in all user roles (Applicant, Reviewer, Coordinator)
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test error states (invalid input, network errors)
- [ ] Check browser console for errors

---

## Documentation Standards

### Code Documentation

**Functions:**
```typescript
/**
 * Generate CSV export from applications.
 *
 * @param applications - Array of application objects
 * @param mapping - Export field mapping configuration
 * @returns CSV string with header and data rows
 *
 * @example
 * const csv = generateCSV(applications, exportMapping);
 * // Returns: "First Name,Last Name,Email\nJane,Doe,jane@example.com"
 */
export function generateCSV(
  applications: Application[],
  mapping: ExportMapping,
): string {
  // Implementation
}
```

**Complex Types:**
```typescript
/**
 * Application pipeline stage definition.
 *
 * @property id - Unique stage identifier
 * @property name - Display name for stage
 * @property order - Position in pipeline (1-indexed)
 * @property automated - Whether stage transitions automatically
 */
interface PipelineStage {
  id: string;
  name: string;
  order: number;
  automated: boolean;
}
```

### Markdown Documentation

**Update when:**
- Adding new API endpoints (API.md)
- Changing database schema (DATABASE.md)
- Updating deployment process (DEPLOYMENT.md)
- Adding team conventions (CONTRIBUTING.md)

**Format:**
- Use headers (`#`, `##`, `###`)
- Add code blocks with syntax highlighting
- Include examples
- Link to related docs

---

## Team Coordination

### Daily Workflow

**Morning:**
- Pull latest `main` branch
- Check GitHub issues assigned to you
- Review open PRs (if reviewer)

**Throughout Day:**
- Commit and push frequently
- Open draft PR for work in progress
- Ask questions in team chat

**End of Day:**
- Push all work (even if incomplete)
- Update PR description with progress
- Flag blockers for team

### Weekly Sync

**Agenda:**
1. Progress updates (what was completed)
2. Blockers (what's stuck)
3. Planning (what's next)
4. Code review (discuss complex PRs)

**Action Items:**
- Rotate meeting facilitator weekly
- Document decisions in GitHub issues
- Update project board

### Pair Programming

**When to Pair:**
- Complex features (state machine, export engine)
- Debugging difficult issues
- Onboarding new team members

**Tools:**
- VSCode Live Share
- Zoom screen share
- GitHub Codespaces (optional)

---

## Project Board

### GitHub Projects

**Board:** [CohortFlow Project Board](https://github.com/MAIA-Biotech-Spring-2026/cohortflow/projects)

**Columns:**
- **Backlog:** Not yet started
- **In Progress:** Actively working
- **In Review:** PR open, awaiting review
- **Done:** Merged to main

**Card Format:**
- Title: Brief description
- Labels: `frontend`, `backend`, `bug`, `enhancement`, `documentation`
- Assignee: Team member responsible
- Linked PR: (when in progress)

---

## Troubleshooting

### Common Issues

**Issue:** `pnpm install` fails
**Solution:**
```bash
pnpm store prune
pnpm install --force
```

**Issue:** Type errors after pulling
**Solution:**
```bash
pnpm install
pnpm turbo run type-check
```

**Issue:** Database schema out of sync
**Solution:**
```bash
pnpm db:push --force
pnpm db:seed
```

**Issue:** Port 3000 already in use
**Solution:**
```bash
lsof -ti:3000 | xargs kill
pnpm dev
```

---

## Resources

### Internal Docs

- [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) - Product requirements
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [API.md](./API.md) - API reference
- [DATABASE.md](./DATABASE.md) - Database schema
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

### External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com/)

---

## Getting Help

**Blockers:**
- Post in team chat with `@mention`
- Create GitHub issue with `help wanted` label
- Schedule pairing session

**Questions:**
- Check documentation first
- Search GitHub issues (open and closed)
- Ask in team chat
- Reach out to project lead

---

**Welcome to the team! Let's build something great together.**

---

**Document Maintained By:** MAIA Biotech Spring 2026 Team
**Last Review:** February 12, 2026
