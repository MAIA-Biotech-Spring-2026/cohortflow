# Database Layer Setup Guide

## Quick Start

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Start PostgreSQL

Using Docker:

```bash
docker run --name cohortflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cohortflow \
  -p 5432:5432 \
  -d postgres:16
```

Or use an existing PostgreSQL installation.

### 3. Configure Environment

```bash
cd packages/db
cp .env.example .env
```

Edit `.env` if using a different database configuration.

### 4. Push Schema

```bash
pnpm db:push
```

This creates all tables, indexes, and relationships in your database.

### 5. Seed Demo Data

```bash
pnpm db:seed
```

This populates the database with:
- 3 staff users (1 coordinator, 2 reviewers)
- 10 applicants
- 1 active volunteer program with 6 stages
- 10 applications in various states
- 20+ reviews
- Sample files and audit logs

### 6. Explore Data

```bash
pnpm db:studio
```

Opens Drizzle Studio at http://localhost:4983 for browsing and editing data.

## Demo Accounts

After seeding, you can use these accounts:

| Role | Email | Purpose |
|------|-------|---------|
| Coordinator | coordinator@cohortflow.org | Program management, review oversight |
| Reviewer | reviewer1@cohortflow.org | Application review |
| Reviewer | reviewer2@cohortflow.org | Application review |
| Applicant | See seed output | Submit and track applications |

## Database Schema Overview

### Core Tables

**users**
- Authentication and role-based access
- Roles: applicant, reviewer, coordinator

**programs**
- Application program templates
- Configurable stages with form fields
- Scoring rubrics for reviews
- Export mappings for data integration

**applications**
- User submissions linked to programs
- Stage progression tracking
- Status workflow (draft → submitted → under_review → accepted/rejected/waitlisted)
- JSONB data storage for flexible form responses

**files**
- Document uploads (resumes, references, etc.)
- Linked to applications
- URL-based storage (S3, local, etc.)

**reviews**
- Reviewer assessments with rubric scores
- Comments and feedback
- Status tracking (pending → in_progress → completed)

**audit_logs**
- Comprehensive activity tracking
- User actions on all resources
- Full change history

### Key Features

1. **Type Safety**: Full TypeScript types generated from schema
2. **Validation**: Zod schemas for runtime validation
3. **Relationships**: Proper foreign keys and cascading deletes
4. **Indexes**: Optimized for common query patterns
5. **JSONB**: Flexible data storage for dynamic forms
6. **Enums**: Type-safe status and role values

## Development Workflow

### Making Schema Changes

1. Edit `src/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply changes: `pnpm db:push`
4. Update seed if needed
5. Re-seed: `pnpm db:seed`
6. Test changes: `pnpm db:studio`

### Adding New Tables

```typescript
export const myNewTable = pgTable('my_new_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  nameIdx: index('my_new_table_name_idx').on(table.name),
}));
```

### Adding Relationships

```typescript
export const myNewTableRelations = relations(myNewTable, ({ one, many }) => ({
  user: one(users, {
    fields: [myNewTable.userId],
    references: [users.id],
  }),
}));
```

### Adding Query Helpers

In `src/index.ts`:

```typescript
export const queries = {
  // ... existing queries
  myNewTable: {
    findByName: async (name: string) => {
      return db.query.myNewTable.findFirst({
        where: (table, { eq }) => eq(table.name, name),
      });
    },
  },
};
```

## Common Operations

### Creating Records

```typescript
import { db, users, applications } from '@cohortflow/db';

// Create a user
const [newUser] = await db.insert(users).values({
  email: 'new@example.com',
  name: 'New User',
  role: 'applicant',
}).returning();

// Create an application
const [newApp] = await db.insert(applications).values({
  programId: 'program-uuid',
  applicantId: newUser.id,
  status: 'draft',
  currentStage: 0,
  data: {},
}).returning();
```

### Querying with Relations

```typescript
import { queries } from '@cohortflow/db';

// Get application with all related data
const app = await queries.applications.findById('app-uuid');
// Returns: { application, program, applicant, files[], reviews[] }

// Get reviewer's pending reviews
const pending = await queries.reviews.findPending('reviewer-uuid');
```

### Updating Records

```typescript
import { db, applications, eq } from '@cohortflow/db';

await db.update(applications)
  .set({
    status: 'submitted',
    currentStage: 6,
    updatedAt: new Date(),
  })
  .where(eq(applications.id, 'app-uuid'));
```

### Creating Audit Logs

```typescript
import { utils } from '@cohortflow/db';

await utils.createAuditLog(
  userId,
  'submit',
  'application',
  applicationId,
  { stage: 6, status: 'submitted' }
);
```

## Production Considerations

### Connection Pooling

Adjust pool settings in `src/index.ts` based on your deployment:

```typescript
const client = postgres(connectionString, {
  max: 20,              // Increase for high traffic
  idle_timeout: 30,     // Keep connections longer
  connect_timeout: 10,
});
```

### Environment Variables

Production `.env`:

```bash
DATABASE_URL=postgresql://user:password@host:5432/cohortflow?ssl=true&sslmode=require
```

### Migrations

For production deployments:

1. Generate migration: `pnpm db:generate`
2. Review generated SQL in `drizzle/` directory
3. Apply with: `pnpm db:migrate`
4. Never use `db:push` in production (it's for development only)

### Backup Strategy

Regular backups:

```bash
pg_dump cohortflow > backup-$(date +%Y%m%d).sql
```

### Monitoring

Consider adding:
- Connection pool monitoring
- Query performance logging
- Slow query alerts
- Database metrics (CPU, memory, disk)

## Troubleshooting

### "relation does not exist"

Run `pnpm db:push` to create tables.

### "duplicate key value violates unique constraint"

Clear database or use fresh UUIDs.

### Connection refused

Check PostgreSQL is running and `DATABASE_URL` is correct.

### Slow queries

Review indexes in `src/schema.ts` and add as needed:

```typescript
(table) => ({
  myIdx: index('table_field_idx').on(table.field),
})
```

### Type errors

Run `pnpm type-check` to see full errors.

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Zod Documentation](https://zod.dev)
- [postgres.js](https://github.com/porsager/postgres)
