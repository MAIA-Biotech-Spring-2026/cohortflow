# CohortFlow Database Documentation

**Version:** 1.0
**Last Updated:** February 12, 2026
**Database:** PostgreSQL 14+
**ORM:** Drizzle ORM 0.33

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Design](#schema-design)
3. [Entity Relationships](#entity-relationships)
4. [Table Definitions](#table-definitions)
5. [Indexes and Constraints](#indexes-and-constraints)
6. [Sample Queries](#sample-queries)
7. [Migration Strategy](#migration-strategy)
8. [Data Seeding](#data-seeding)

---

## Overview

CohortFlow uses PostgreSQL as its primary database, managed via Drizzle ORM for type-safe queries and schema management.

### Design Principles

- **Relational Integrity:** Foreign keys enforce relationships
- **Type Safety:** Schema defined in TypeScript, types inferred
- **Audit Trail:** Insert-only logs for compliance
- **JSON Flexibility:** Custom fields and rubric scores stored as JSON
- **UUID Primary Keys:** Globally unique, secure identifiers

### Connection

**Development:**
```
postgresql://postgres:postgres@localhost:5432/cohortflow
```

**Production (Vercel Postgres):**
```
postgresql://default:password@hostname:5432/verceldb?sslmode=require
```

---

## Schema Design

### Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    Users ||--o{ Programs : "coordinates"
    Users ||--o{ Applications : "applies"
    Users ||--o{ Reviews : "writes"
    Users ||--o{ ReviewerAssignments : "assigned_to"
    Users ||--o{ Files : "uploads"
    Users ||--o{ AuditLogs : "generates"

    Programs ||--o{ Applications : "contains"
    Programs ||--o{ ReviewerAssignments : "has_reviewers"

    Applications ||--o{ Files : "includes"
    Applications ||--o{ Reviews : "receives"
    Applications ||--o{ AuditLogs : "logged_for"

    Files ||--o{ AuditLogs : "logged_for"

    Users {
        uuid id PK
        string email UK "Unique, indexed"
        string name
        enum role "APPLICANT, REVIEWER, COORDINATOR"
        string hashedPassword
        timestamp createdAt
        timestamp updatedAt
    }

    Programs {
        uuid id PK
        string name
        text description
        uuid coordinatorId FK
        enum status "DRAFT, OPEN, CLOSED"
        date applicationOpenDate
        date applicationCloseDate
        json stages "Array of stage definitions"
        json rubricTemplate "Scoring criteria"
        json exportMapping "CSV field mapping"
        timestamp createdAt
        timestamp updatedAt
    }

    Applications {
        uuid id PK
        uuid programId FK
        uuid applicantId FK
        string currentStage
        timestamp submittedAt
        json responses "Applicant form data"
        enum status "DRAFT, SUBMITTED, UNDER_REVIEW, IN_PROGRESS, ACCEPTED, WAITLIST, REJECTED"
        timestamp createdAt
        timestamp updatedAt
    }

    Files {
        uuid id PK
        uuid applicationId FK
        uuid uploadedBy FK
        string fileName
        string fileType "resume, transcript, reference"
        string mimeType "application/pdf, image/jpeg"
        bigint sizeBytes
        string blobUrl "Vercel Blob URL"
        timestamp uploadedAt
    }

    Reviews {
        uuid id PK
        uuid applicationId FK
        uuid reviewerId FK
        string stage
        json scores "{ criterionId: score }"
        text comments
        timestamp submittedAt
        timestamp createdAt
        timestamp updatedAt
    }

    ReviewerAssignments {
        uuid id PK
        uuid programId FK
        uuid reviewerId FK
        string stage
        uuid assignedBy FK
        timestamp assignedAt
    }

    AuditLogs {
        uuid id PK
        uuid userId FK "Nullable for system events"
        enum eventType "FILE_UPLOAD, FILE_DOWNLOAD, STAGE_CHANGE, REVIEW_SUBMIT, EXPORT, PROGRAM_CREATED, etc."
        enum resourceType "APPLICATION, FILE, PROGRAM, REVIEW"
        uuid resourceId
        json metadata "Event-specific details"
        string ipAddress "Optional, for security"
        timestamp timestamp
    }
```

### Schema Visualization (ASCII)

```
┌──────────────┐
│    Users     │
├──────────────┤
│ id (PK)      │───┐
│ email (UK)   │   │
│ name         │   │
│ role         │   │
│ hashedPwd    │   │
└──────────────┘   │
                   │
        ┌──────────┼─────────────────────────┐
        │          │                         │
        │          │                         │
┌───────▼──────────▼──┐              ┌──────▼──────────┐
│     Programs        │              │  Applications   │
├─────────────────────┤              ├─────────────────┤
│ id (PK)             │──────────────│ id (PK)         │
│ name                │         ┌────│ programId (FK)  │
│ coordinatorId (FK)  │         │    │ applicantId (FK)│
│ status              │         │    │ currentStage    │
│ openDate            │         │    │ responses (JSON)│
│ closeDate           │         │    │ status          │
│ stages (JSON)       │         │    └─────────────────┘
│ rubricTemplate(JSON)│         │           │
│ exportMapping (JSON)│         │           │
└─────────────────────┘         │     ┌─────▼─────┐
        │                       │     │  Files    │
        │                       │     ├───────────┤
        │                       │     │ id (PK)   │
        │                       └─────│ appId (FK)│
        │                             │ fileName  │
┌───────▼─────────────┐               │ blobUrl   │
│ReviewerAssignments  │               └───────────┘
├─────────────────────┤                     │
│ id (PK)             │                     │
│ programId (FK)      │               ┌─────▼─────────┐
│ reviewerId (FK)     │               │  AuditLogs    │
│ stage               │               ├───────────────┤
│ assignedBy (FK)     │               │ id (PK)       │
└─────────────────────┘               │ userId (FK)   │
        │                             │ eventType     │
        │                             │ resourceType  │
┌───────▼─────────┐                   │ resourceId    │
│    Reviews      │                   │ metadata(JSON)│
├─────────────────┤                   │ timestamp     │
│ id (PK)         │                   └───────────────┘
│ applicationId(FK)│
│ reviewerId (FK) │
│ stage           │
│ scores (JSON)   │
│ comments        │
└─────────────────┘
```

---

## Entity Relationships

### One-to-Many Relationships

**Users → Programs** (coordinatorId)
- One coordinator can manage multiple programs
- Cascade: SET NULL (preserve programs if coordinator deleted)

**Users → Applications** (applicantId)
- One applicant can submit multiple applications (different programs)
- Cascade: CASCADE (delete applications if applicant deleted)

**Users → Reviews** (reviewerId)
- One reviewer can write multiple reviews
- Cascade: SET NULL (preserve reviews if reviewer deleted)

**Users → Files** (uploadedBy)
- One user can upload multiple files
- Cascade: CASCADE

**Programs → Applications** (programId)
- One program contains multiple applications
- Cascade: CASCADE (delete applications if program deleted)

**Applications → Files** (applicationId)
- One application can have multiple files
- Cascade: CASCADE (delete files if application deleted)

**Applications → Reviews** (applicationId)
- One application can have multiple reviews (different reviewers/stages)
- Cascade: CASCADE

**Programs → ReviewerAssignments** (programId)
- One program can have multiple reviewer assignments
- Cascade: CASCADE

### Many-to-Many Relationships

**Users ↔ Programs (via ReviewerAssignments)**
- Reviewers can be assigned to multiple programs
- Programs can have multiple reviewers
- Junction table: ReviewerAssignments

---

## Table Definitions

### Users

Stores user accounts (applicants, reviewers, coordinators).

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| `name` | VARCHAR(255) | NOT NULL | Display name |
| `role` | ENUM | NOT NULL | APPLICANT, REVIEWER, or COORDINATOR |
| `hashedPassword` | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- PRIMARY: `id`
- UNIQUE: `email`

**Drizzle Schema:**
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: pgEnum('user_role', ['APPLICANT', 'REVIEWER', 'COORDINATOR']).notNull(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

---

### Programs

Stores program configurations (cycles, stages, rubrics).

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique program identifier |
| `name` | VARCHAR(255) | NOT NULL | Program name |
| `description` | TEXT | NULLABLE | Program description |
| `coordinatorId` | UUID | FOREIGN KEY (users.id), NOT NULL | Program coordinator |
| `status` | ENUM | NOT NULL | DRAFT, OPEN, or CLOSED |
| `applicationOpenDate` | DATE | NOT NULL | Application period start |
| `applicationCloseDate` | DATE | NOT NULL | Application period end |
| `stages` | JSONB | NOT NULL | Array of stage definitions |
| `rubricTemplate` | JSONB | NOT NULL | Scoring criteria |
| `exportMapping` | JSONB | NULLABLE | CSV field mapping |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**JSON Schemas:**

**stages:**
```json
[
  {
    "id": "eligibility",
    "name": "Eligibility Screen",
    "order": 1,
    "automated": false
  },
  {
    "id": "documents",
    "name": "Document Review",
    "order": 2,
    "automated": false
  }
]
```

**rubricTemplate:**
```json
{
  "criteria": [
    {
      "id": "fit",
      "name": "Program Fit",
      "description": "Alignment with program goals",
      "maxScore": 5
    },
    {
      "id": "availability",
      "name": "Availability",
      "description": "Time commitment match",
      "maxScore": 5
    }
  ]
}
```

**exportMapping:**
```json
{
  "columns": [
    {
      "name": "First Name",
      "fieldPath": "responses.firstName"
    },
    {
      "name": "Last Name",
      "fieldPath": "responses.lastName"
    },
    {
      "name": "Average Score",
      "fieldPath": "aggregatedScore"
    }
  ]
}
```

**Indexes:**
- PRIMARY: `id`
- INDEX: `coordinatorId`
- INDEX: `status`

**Drizzle Schema:**
```typescript
export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  coordinatorId: uuid('coordinator_id').references(() => users.id, { onDelete: 'set null' }),
  status: pgEnum('program_status', ['DRAFT', 'OPEN', 'CLOSED']).notNull(),
  applicationOpenDate: date('application_open_date').notNull(),
  applicationCloseDate: date('application_close_date').notNull(),
  stages: jsonb('stages').notNull(),
  rubricTemplate: jsonb('rubric_template').notNull(),
  exportMapping: jsonb('export_mapping'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

---

### Applications

Stores applicant submissions.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique application identifier |
| `programId` | UUID | FOREIGN KEY (programs.id), NOT NULL | Associated program |
| `applicantId` | UUID | FOREIGN KEY (users.id), NOT NULL | Applicant user |
| `currentStage` | VARCHAR(100) | NOT NULL | Current pipeline stage |
| `submittedAt` | TIMESTAMP | NULLABLE | Submission timestamp (null if draft) |
| `responses` | JSONB | NOT NULL | Form responses |
| `status` | ENUM | NOT NULL | Application status |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Status Values:**
- `DRAFT` - Application in progress
- `SUBMITTED` - Application submitted
- `UNDER_REVIEW` - Assigned to reviewers
- `IN_PROGRESS` - Active review process
- `ACCEPTED` - Accepted (terminal)
- `WAITLIST` - Waitlisted
- `REJECTED` - Rejected (terminal)

**responses JSON Schema:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+15551234567",
  "customFields": {
    "interest": "Cardiology",
    "availability": "Weekends",
    "whyApplying": "I am passionate about..."
  }
}
```

**Indexes:**
- PRIMARY: `id`
- INDEX: `programId, currentStage` (pipeline queries)
- INDEX: `applicantId` (applicant dashboard)
- UNIQUE: `programId, applicantId` (one application per program per user)

**Drizzle Schema:**
```typescript
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
  applicantId: uuid('applicant_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  currentStage: varchar('current_stage', { length: 100 }).notNull(),
  submittedAt: timestamp('submitted_at'),
  responses: jsonb('responses').notNull(),
  status: pgEnum('application_status', ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'ACCEPTED', 'WAITLIST', 'REJECTED']).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueApplicationPerProgram: unique().on(table.programId, table.applicantId),
}));
```

---

### Files

Stores uploaded file metadata (actual files in Vercel Blob).

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique file identifier |
| `applicationId` | UUID | FOREIGN KEY (applications.id), NOT NULL | Associated application |
| `uploadedBy` | UUID | FOREIGN KEY (users.id), NOT NULL | User who uploaded |
| `fileName` | VARCHAR(255) | NOT NULL | Original file name |
| `fileType` | VARCHAR(50) | NOT NULL | resume, transcript, reference, other |
| `mimeType` | VARCHAR(100) | NOT NULL | application/pdf, image/jpeg, etc. |
| `sizeBytes` | BIGINT | NOT NULL | File size in bytes |
| `blobUrl` | TEXT | NOT NULL | Vercel Blob URL |
| `uploadedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Upload timestamp |

**Indexes:**
- PRIMARY: `id`
- INDEX: `applicationId` (fetch all files for application)

**Drizzle Schema:**
```typescript
export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull(),
  uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  blobUrl: text('blob_url').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
```

---

### Reviews

Stores reviewer evaluations and scores.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique review identifier |
| `applicationId` | UUID | FOREIGN KEY (applications.id), NOT NULL | Reviewed application |
| `reviewerId` | UUID | FOREIGN KEY (users.id), NOT NULL | Reviewer user |
| `stage` | VARCHAR(100) | NOT NULL | Pipeline stage reviewed |
| `scores` | JSONB | NOT NULL | Rubric scores |
| `comments` | TEXT | NULLABLE | Reviewer comments |
| `submittedAt` | TIMESTAMP | NOT NULL | Review submission timestamp |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**scores JSON Schema:**
```json
{
  "fit": 4,
  "availability": 5,
  "experience": 3
}
```

**Indexes:**
- PRIMARY: `id`
- INDEX: `applicationId` (fetch all reviews for application)
- INDEX: `reviewerId` (reviewer's completed reviews)
- UNIQUE: `applicationId, reviewerId, stage` (one review per reviewer per stage)

**Drizzle Schema:**
```typescript
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
  stage: varchar('stage', { length: 100 }).notNull(),
  scores: jsonb('scores').notNull(),
  comments: text('comments'),
  submittedAt: timestamp('submitted_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueReviewPerStage: unique().on(table.applicationId, table.reviewerId, table.stage),
}));
```

---

### ReviewerAssignments

Tracks reviewer assignments to programs.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique assignment identifier |
| `programId` | UUID | FOREIGN KEY (programs.id), NOT NULL | Assigned program |
| `reviewerId` | UUID | FOREIGN KEY (users.id), NOT NULL | Assigned reviewer |
| `stage` | VARCHAR(100) | NOT NULL | Pipeline stage |
| `assignedBy` | UUID | FOREIGN KEY (users.id), NOT NULL | Coordinator who assigned |
| `assignedAt` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Assignment timestamp |

**Indexes:**
- PRIMARY: `id`
- INDEX: `programId, reviewerId` (check reviewer access)
- INDEX: `reviewerId` (reviewer's assigned programs)

**Drizzle Schema:**
```typescript
export const reviewerAssignments = pgTable('reviewer_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  stage: varchar('stage', { length: 100 }).notNull(),
  assignedBy: uuid('assigned_by').references(() => users.id, { onDelete: 'set null' }),
  assignedAt: timestamp('assigned_at').notNull().defaultNow(),
});
```

---

### AuditLogs

Immutable audit trail for compliance.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique log entry identifier |
| `userId` | UUID | FOREIGN KEY (users.id), NULLABLE | User who triggered event (null for system) |
| `eventType` | ENUM | NOT NULL | Type of event |
| `resourceType` | ENUM | NOT NULL | Type of resource |
| `resourceId` | UUID | NOT NULL | Resource identifier |
| `metadata` | JSONB | NOT NULL | Event-specific details |
| `ipAddress` | VARCHAR(45) | NULLABLE | User IP address (IPv4/IPv6) |
| `timestamp` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Event timestamp |

**Event Types:**
- `FILE_UPLOAD`
- `FILE_DOWNLOAD`
- `STAGE_CHANGE`
- `REVIEW_SUBMIT`
- `EXPORT`
- `PROGRAM_CREATED`
- `PROGRAM_UPDATED`
- `APPLICATION_SUBMITTED`

**Resource Types:**
- `APPLICATION`
- `FILE`
- `PROGRAM`
- `REVIEW`
- `USER`

**metadata JSON Examples:**

**FILE_DOWNLOAD:**
```json
{
  "fileName": "resume.pdf",
  "fileId": "uuid",
  "applicationId": "uuid"
}
```

**STAGE_CHANGE:**
```json
{
  "applicationId": "uuid",
  "fromStage": "SUBMITTED",
  "toStage": "UNDER_REVIEW",
  "reason": "Passed eligibility check"
}
```

**EXPORT:**
```json
{
  "programId": "uuid",
  "programName": "Fall 2026 Volunteer",
  "rowCount": 127,
  "filters": {
    "status": "ACCEPTED"
  }
}
```

**Indexes:**
- PRIMARY: `id`
- INDEX: `resourceType, resourceId, timestamp` (fetch logs for resource)
- INDEX: `userId, timestamp` (fetch logs by user)
- INDEX: `eventType, timestamp` (filter by event type)

**Drizzle Schema:**
```typescript
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  eventType: pgEnum('event_type', [
    'FILE_UPLOAD',
    'FILE_DOWNLOAD',
    'STAGE_CHANGE',
    'REVIEW_SUBMIT',
    'EXPORT',
    'PROGRAM_CREATED',
    'PROGRAM_UPDATED',
    'APPLICATION_SUBMITTED',
  ]).notNull(),
  resourceType: pgEnum('resource_type', ['APPLICATION', 'FILE', 'PROGRAM', 'REVIEW', 'USER']).notNull(),
  resourceId: uuid('resource_id').notNull(),
  metadata: jsonb('metadata').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});
```

---

## Indexes and Constraints

### Primary Keys

All tables use UUID primary keys for global uniqueness and security.

### Foreign Keys

**Cascade Rules:**
- `programs → applications`: CASCADE (delete applications if program deleted)
- `applications → files`: CASCADE (delete files if application deleted)
- `applications → reviews`: CASCADE (delete reviews if application deleted)
- `users → auditLogs`: SET NULL (preserve logs if user deleted)

### Unique Constraints

- `users.email` - One email per account
- `applications(programId, applicantId)` - One application per program per user
- `reviews(applicationId, reviewerId, stage)` - One review per reviewer per stage

### Check Constraints

**programs:**
```sql
CHECK (application_close_date > application_open_date)
```

**files:**
```sql
CHECK (size_bytes > 0)
```

### Composite Indexes

**High-traffic queries:**
```sql
CREATE INDEX idx_applications_program_stage ON applications(program_id, current_stage);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id, timestamp);
CREATE INDEX idx_reviewer_assignments_lookup ON reviewer_assignments(program_id, reviewer_id);
```

---

## Sample Queries

### Fetch applications for pipeline board

```typescript
// Drizzle query
const applications = await db.query.applications.findMany({
  where: (applications, { eq, and }) => and(
    eq(applications.programId, programId),
    eq(applications.currentStage, 'eligibility'),
  ),
  with: {
    applicant: {
      columns: { id: true, name: true, email: true },
    },
  },
  orderBy: (applications, { desc }) => [desc(applications.submittedAt)],
  limit: 50,
});
```

**SQL:**
```sql
SELECT
  a.*,
  u.id AS applicant_id,
  u.name AS applicant_name,
  u.email AS applicant_email
FROM applications a
JOIN users u ON a.applicant_id = u.id
WHERE a.program_id = $1
  AND a.current_stage = $2
ORDER BY a.submitted_at DESC
LIMIT 50;
```

---

### Calculate average review scores

```typescript
// Drizzle query
const reviews = await db.query.reviews.findMany({
  where: (reviews, { eq }) => eq(reviews.applicationId, applicationId),
});

const avgScores: Record<string, number> = {};
const criteriaIds = Object.keys(reviews[0].scores);

criteriaIds.forEach((criterionId) => {
  const scores = reviews.map((r) => r.scores[criterionId]).filter(Boolean);
  avgScores[criterionId] = scores.reduce((a, b) => a + b, 0) / scores.length;
});

const overallAverage = Object.values(avgScores).reduce((a, b) => a + b, 0) / Object.values(avgScores).length;
```

**SQL (with JSON aggregation):**
```sql
SELECT
  application_id,
  AVG((scores->>'fit')::numeric) AS avg_fit_score,
  AVG((scores->>'availability')::numeric) AS avg_availability_score,
  COUNT(*) AS review_count
FROM reviews
WHERE application_id = $1
GROUP BY application_id;
```

---

### Audit log query: Who accessed a file?

```typescript
// Drizzle query
const accessLogs = await db.query.auditLogs.findMany({
  where: (logs, { eq, and }) => and(
    eq(logs.resourceType, 'FILE'),
    eq(logs.resourceId, fileId),
    eq(logs.eventType, 'FILE_DOWNLOAD'),
  ),
  with: {
    user: {
      columns: { id: true, name: true, email: true, role: true },
    },
  },
  orderBy: (logs, { desc }) => [desc(logs.timestamp)],
});
```

**SQL:**
```sql
SELECT
  al.*,
  u.name AS user_name,
  u.email AS user_email,
  u.role AS user_role
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.resource_type = 'FILE'
  AND al.resource_id = $1
  AND al.event_type = 'FILE_DOWNLOAD'
ORDER BY al.timestamp DESC;
```

---

### Export CSV data

```typescript
// Fetch applications with reviews
const applications = await db.query.applications.findMany({
  where: (applications, { eq, and }) => and(
    eq(applications.programId, programId),
    eq(applications.status, 'ACCEPTED'),
  ),
  with: {
    applicant: true,
    reviews: {
      with: {
        reviewer: true,
      },
    },
  },
});

// Map to CSV rows based on exportMapping
const csvRows = applications.map((app) => {
  const avgScore = app.reviews.length > 0
    ? app.reviews.reduce((sum, r) => sum + Object.values(r.scores).reduce((a, b) => a + b, 0), 0) / app.reviews.length
    : null;

  return {
    'First Name': app.responses.firstName,
    'Last Name': app.responses.lastName,
    'Email': app.responses.email,
    'Average Score': avgScore,
    'Status': app.status,
  };
});
```

---

## Migration Strategy

### Development Workflow

**1. Modify schema:**
```typescript
// packages/db/src/schema.ts
export const programs = pgTable('programs', {
  // Add new column
  cycleYear: integer('cycle_year'),
  // ...
});
```

**2. Generate migration:**
```bash
pnpm db:generate
```

**3. Review migration SQL:**
```sql
-- drizzle/0001_add_cycle_year.sql
ALTER TABLE programs ADD COLUMN cycle_year INTEGER;
```

**4. Apply migration:**
```bash
pnpm db:migrate
```

### Production Migrations

**Vercel Deployment:**
- Migrations run automatically on deploy via `postbuild` script
- Use `db.push()` for schema-less changes (dev only)
- Use `db.migrate()` for tracked migrations (production)

**Rollback Strategy:**
- Keep migration backups
- Test migrations on preview deployments first
- Use transactions for multi-step migrations

---

## Data Seeding

### Synthetic Data Generation

**Script:** `packages/db/src/seed.ts`

**Goals:**
- Generate realistic test data for development
- Create demo accounts for all roles
- Populate full application pipeline

**Seed Data:**
- 3 coordinators
- 10 reviewers
- 150 applicants
- 3 programs (Volunteer, Shadowing, Research)
- 400+ applications across stages
- 1000+ reviews
- 500+ file records (with Faker-generated metadata)
- 2000+ audit log entries

**Run Seeding:**
```bash
pnpm db:seed
```

**Demo Accounts:**
```
coordinator@example.com / demo123
reviewer@example.com    / demo123
applicant@example.com   / demo123
```

---

## Performance Considerations

### Query Optimization

**Eager Loading:**
- Use `with` clause in Drizzle to avoid N+1 queries
- Example: Fetch applications with applicant and reviews in single query

**Pagination:**
- Always use `limit` and `offset` for large result sets
- Consider cursor-based pagination for high-traffic endpoints

**Indexing:**
- Add indexes for frequently filtered columns
- Monitor slow query log in production

### Connection Pooling

**Vercel Postgres:**
- Built-in connection pooling (PgBouncer)
- Max connections: 100 (Pro plan)
- Use `db.query` for connection management

**Local Development:**
- Use Docker Postgres with default max_connections=100

---

## Backup and Recovery

### Automated Backups (Vercel Postgres)

- **Daily backups:** Retained for 7 days (free tier), 30 days (Pro)
- **Point-in-time recovery:** Available on Pro+ plans
- **Manual snapshots:** Before major schema changes

### Disaster Recovery

**RTO (Recovery Time Objective):** 1 hour
**RPO (Recovery Point Objective):** 24 hours (daily backups)

**Post-MVP:**
- Cross-region replication for high availability
- Continuous backups with 1-minute RPO

---

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/14/)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [API.md](./API.md) - API reference

---

**Document Maintained By:** MAIA Biotech Spring 2026 Team
**Last Review:** February 12, 2026
