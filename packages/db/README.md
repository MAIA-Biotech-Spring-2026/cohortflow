# @cohortflow/db

Database layer for CohortFlow built with Drizzle ORM and PostgreSQL.

## Features

- **Type-safe schema** with Drizzle ORM
- **Zod validation** for all entities
- **Connection pooling** with postgres.js
- **Comprehensive seed data** for development
- **Type-safe query helpers** for common operations
- **Full relationship support** with foreign keys and indexes

## Setup

### Prerequisites

- PostgreSQL 14+ running locally or remotely
- Node.js 18.17+
- pnpm 8.15+

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL connection string.

### Database Migrations

Generate migration files from schema:

```bash
pnpm db:generate
```

Push schema changes to database:

```bash
pnpm db:push
```

### Seed Database

Populate the database with demo data:

```bash
pnpm db:seed
```

This creates:
- 3 demo users (coordinator, 2 reviewers)
- 10 applicant users
- 1 active volunteer program with 6 stages
- 10 applications in various states
- 20+ reviews
- Sample files and audit logs

### Database Studio

Open Drizzle Studio to browse and edit data:

```bash
pnpm db:studio
```

## Schema

### Tables

#### Users
- Stores user accounts with roles (applicant, reviewer, coordinator)
- Indexed on email and role

#### Programs
- Application program templates with stages and rubrics
- JSONB fields for flexible configuration
- Linked to creator (coordinator)

#### Applications
- Individual applications submitted by applicants
- Tracks current stage and status
- JSONB data field stores form responses
- Indexed on program, applicant, status, and stage

#### Files
- File uploads linked to applications
- Stores filename and URL
- Tracks who uploaded each file

#### Reviews
- Reviewer assessments of applications
- JSONB scores field maps rubric criteria to ratings
- Supports pending, in_progress, and completed states

#### Audit Logs
- Comprehensive activity tracking
- Captures user actions on all resources
- JSONB metadata for flexible logging

## Usage

### Import the Database Client

```typescript
import { db, queries } from '@cohortflow/db';
```

### Using Type-safe Queries

```typescript
// Find user by email
const user = await queries.users.findByEmail('coordinator@cohortflow.org');

// Get active programs
const programs = await queries.programs.findActive();

// Find applications for a program
const applications = await queries.applications.findByProgram(programId);

// Get pending reviews for a reviewer
const reviews = await queries.reviews.findPending(reviewerId);

// Get recent audit logs
const logs = await queries.auditLogs.findRecent(50);
```

### Using Drizzle Directly

```typescript
import { db, users, applications } from '@cohortflow/db';
import { eq } from 'drizzle-orm';

// Insert a new user
const [newUser] = await db.insert(users).values({
  email: 'new@example.com',
  name: 'New User',
  role: 'applicant',
}).returning();

// Query with joins
const result = await db.query.applications.findMany({
  where: eq(applications.status, 'under_review'),
  with: {
    program: true,
    applicant: true,
    reviews: {
      with: {
        reviewer: true,
      },
    },
  },
});
```

### Validation with Zod

```typescript
import { userSchema, applicationSchema } from '@cohortflow/db';

// Validate user input
const result = userSchema.safeParse({
  email: 'test@example.com',
  name: 'Test User',
  role: 'applicant',
});

if (result.success) {
  const validUser = result.data;
  // Use validUser...
} else {
  console.error(result.error);
}
```

## Type Exports

All TypeScript types are exported from the package:

```typescript
import type {
  User,
  NewUser,
  Program,
  NewProgram,
  Application,
  NewApplication,
  Review,
  NewReview,
  ProgramStage,
  RubricCriterion,
  FormField,
} from '@cohortflow/db';
```

## Development

### Type Checking

```bash
pnpm type-check
```

### Database Schema Updates

1. Update `src/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:push` to apply changes
4. Update seed script if needed
5. Run `pnpm db:seed` to verify

## Demo Accounts

After seeding, use these accounts for testing:

- **Coordinator**: coordinator@cohortflow.org
- **Reviewer 1**: reviewer1@cohortflow.org
- **Reviewer 2**: reviewer2@cohortflow.org
- **Applicants**: Various (check seed output)

## Architecture

```
db/
├── src/
│   ├── index.ts         # Database client & query helpers
│   ├── schema.ts        # Table definitions & types
│   └── seed.ts          # Demo data seeding
├── drizzle/             # Generated migrations (git-ignored)
├── drizzle.config.ts    # Drizzle Kit configuration
├── package.json         # Dependencies & scripts
└── tsconfig.json        # TypeScript configuration
```

## Connection Pooling

The database client uses postgres.js with optimized connection pooling:

- **Max connections**: 10
- **Idle timeout**: 20 seconds
- **Connect timeout**: 10 seconds

Adjust these in `src/index.ts` based on your deployment needs.

## Best Practices

1. **Use query helpers** for common operations instead of raw queries
2. **Validate input** with Zod schemas before database operations
3. **Create audit logs** for important actions using `utils.createAuditLog()`
4. **Update timestamps** on applications with `utils.touchApplication()`
5. **Use transactions** for multi-step operations that should be atomic

## Troubleshooting

### Connection Issues

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists: `createdb cohortflow`

### Migration Errors

- Clear migrations: `rm -rf drizzle`
- Regenerate: `pnpm db:generate`
- Push fresh: `pnpm db:push`

### Seed Failures

- Ensure schema is pushed: `pnpm db:push`
- Check for existing data conflicts
- Clear database manually if needed
