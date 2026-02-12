# Database Migrations Guide

Guide for managing database schema changes safely in CohortFlow.

## Development vs Production

### Development (db:push)

```bash
pnpm db:push
```

- **Use for**: Rapid prototyping, local development
- **Behavior**: Directly syncs schema to database
- **No migration files**: Changes are not tracked
- **Data loss**: May drop and recreate tables
- **Fast**: Immediate feedback

### Production (db:migrate)

```bash
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Apply migrations
```

- **Use for**: Production deployments, team collaboration
- **Behavior**: Creates SQL migration files
- **Tracked**: All changes are versioned
- **Safe**: No data loss, incremental changes
- **Reviewable**: SQL can be inspected before applying

## Migration Workflow

### 1. Make Schema Changes

Edit `/Users/joelnewton/Desktop/MAIA-Biotech-Spring-2026/cohortflow/packages/db/src/schema.ts`:

```typescript
// Add a new column
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('applicant'),
  phoneNumber: text('phone_number'), // NEW FIELD
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

### 2. Generate Migration

```bash
pnpm db:generate
```

This creates a new migration file in `drizzle/` directory:

```
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_phone_number.sql  # New migration
└── meta/
    ├── _journal.json
    └── 0001_snapshot.json
```

### 3. Review Migration

Inspect the generated SQL:

```sql
-- drizzle/0001_add_phone_number.sql
ALTER TABLE "users" ADD COLUMN "phone_number" text;
```

Verify it's correct and safe to run.

### 4. Apply Migration

```bash
pnpm db:migrate
```

This executes the SQL against your database.

### 5. Update Seed (if needed)

If your changes affect seed data, update `/Users/joelnewton/Desktop/MAIA-Biotech-Spring-2026/cohortflow/packages/db/src/seed.ts`:

```typescript
const users = [
  {
    email: 'coordinator@cohortflow.org',
    name: 'Sarah Johnson',
    role: 'coordinator' as const,
    phoneNumber: '(555) 123-4567', // New field
  },
  // ...
];
```

### 6. Test

```bash
pnpm db:seed
pnpm db:studio
```

## Common Schema Changes

### Adding a Column

```typescript
export const users = pgTable('users', {
  // ... existing fields
  newField: text('new_field'), // Nullable by default
});
```

Migration:
```sql
ALTER TABLE "users" ADD COLUMN "new_field" text;
```

### Adding a Required Column

```typescript
export const users = pgTable('users', {
  // ... existing fields
  newField: text('new_field').notNull().default('default_value'),
});
```

Migration:
```sql
ALTER TABLE "users" ADD COLUMN "new_field" text NOT NULL DEFAULT 'default_value';
```

### Removing a Column

```typescript
export const users = pgTable('users', {
  // ... remove the field from definition
});
```

Migration:
```sql
ALTER TABLE "users" DROP COLUMN "old_field";
```

### Renaming a Column

Drizzle doesn't auto-detect renames. Manual migration required:

```typescript
// In schema.ts - rename field
export const users = pgTable('users', {
  fullName: text('full_name').notNull(), // Was 'name'
});
```

Then edit migration file:
```sql
ALTER TABLE "users" RENAME COLUMN "name" TO "full_name";
```

### Adding an Index

```typescript
export const users = pgTable('users', {
  email: text('email').notNull(),
  phoneNumber: text('phone_number'),
}, (table) => ({
  phoneIdx: index('users_phone_idx').on(table.phoneNumber), // NEW
}));
```

Migration:
```sql
CREATE INDEX "users_phone_idx" ON "users" ("phone_number");
```

### Adding a Foreign Key

```typescript
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
});
```

Migration:
```sql
CREATE TABLE "comments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "application_id" uuid NOT NULL,
  "content" text NOT NULL,
  FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE
);
```

### Adding an Enum Value

PostgreSQL doesn't easily support adding enum values. Options:

1. **Create new enum** (recommended):
```typescript
export const userRoleEnumV2 = pgEnum('user_role_v2', [
  'applicant',
  'reviewer',
  'coordinator',
  'admin', // New value
]);
```

2. **Use text** instead of enum for extensibility

3. **Manual migration**:
```sql
ALTER TYPE user_role ADD VALUE 'admin';
```

### Changing Column Type

Requires careful migration:

```typescript
// Before: text
// After: integer
export const applications = pgTable('applications', {
  currentStage: integer('current_stage').notNull().default(0),
});
```

Manual migration needed:
```sql
ALTER TABLE "applications"
  ALTER COLUMN "current_stage"
  TYPE integer
  USING current_stage::integer;
```

## Advanced Patterns

### Multi-step Migrations

For breaking changes, use multiple migrations:

**Step 1**: Add new column
```sql
ALTER TABLE "users" ADD COLUMN "phone_number" text;
```

**Step 2**: Migrate data
```sql
UPDATE "users" SET "phone_number" = "old_phone_column";
```

**Step 3**: Drop old column
```sql
ALTER TABLE "users" DROP COLUMN "old_phone_column";
```

### Transactions

Wrap migrations in transactions:

```sql
BEGIN;

ALTER TABLE "users" ADD COLUMN "status" text;
UPDATE "users" SET "status" = 'active';
ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL;

COMMIT;
```

### Conditional Migrations

Check if change already applied:

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "phone_number" text;
  END IF;
END $$;
```

## Rolling Back

### In Development

```bash
# Drop and recreate database
dropdb cohortflow
createdb cohortflow
pnpm db:push
pnpm db:seed
```

### In Production

Create a down migration:

```sql
-- drizzle/0001_add_phone_number_down.sql
ALTER TABLE "users" DROP COLUMN "phone_number";
```

Apply manually:
```bash
psql cohortflow < drizzle/0001_add_phone_number_down.sql
```

## Best Practices

### 1. Always Review Generated SQL

Don't blindly trust `db:generate`. Review the SQL before applying.

### 2. Test Migrations Locally

```bash
# Create a test database
createdb cohortflow_test

# Export test DB URL
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cohortflow_test

# Apply migration
pnpm db:migrate

# Test seed
pnpm db:seed
```

### 3. Backup Before Production Migrations

```bash
pg_dump cohortflow > backup_before_migration.sql
```

### 4. Use NOT NULL Carefully

Adding `NOT NULL` to existing columns requires:
1. Add column as nullable
2. Populate with data
3. Make NOT NULL in separate migration

### 5. Avoid Dropping Columns in One Step

1. Stop using column in code
2. Deploy code
3. Drop column in later migration

### 6. Index Large Tables

For tables with >100k rows, create indexes `CONCURRENTLY`:

```sql
CREATE INDEX CONCURRENTLY "users_email_idx" ON "users" ("email");
```

### 7. Foreign Key Constraints

Always specify `onDelete` behavior:

```typescript
.references(() => users.id, { onDelete: 'cascade' })
```

Options:
- `cascade`: Delete related records
- `set null`: Set foreign key to null
- `restrict`: Prevent deletion
- `no action`: Default (restrict)

### 8. Version Control Migrations

Commit migration files:
```bash
git add drizzle/
git commit -m "migration: add phone number to users"
```

## Troubleshooting

### Migration Already Applied

```
Error: Migration 0001_xxx has already been applied
```

Check `drizzle.__drizzle_migrations` table:

```sql
SELECT * FROM drizzle.__drizzle_migrations;
```

### Conflicting Migrations

Multiple developers generating migrations can conflict. Resolve:

1. Pull latest migrations
2. Delete your generated migration
3. Regenerate after pulling
4. Merge conflicts in SQL

### Schema Drift

Schema doesn't match migrations:

```bash
# Reset (development only!)
pnpm db:push --force
```

### Lock Timeout

Long-running migrations can lock tables. Use:

```sql
SET lock_timeout = '10s';
ALTER TABLE "users" ADD COLUMN "new_field" text;
```

## Production Deployment Checklist

- [ ] Generate migration locally: `pnpm db:generate`
- [ ] Review SQL in `drizzle/` directory
- [ ] Test migration on staging database
- [ ] Backup production database: `pg_dump`
- [ ] Schedule maintenance window if needed
- [ ] Apply migration: `pnpm db:migrate`
- [ ] Verify schema: `pnpm db:studio`
- [ ] Monitor application for errors
- [ ] Keep backup for 7 days

## Resources

- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [PostgreSQL Migrations Best Practices](https://www.postgresql.org/docs/current/ddl-alter.html)
